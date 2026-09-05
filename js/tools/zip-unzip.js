ToolBox.define("zip-unzip", {
  styles: ".zip-list { margin-top: 12px; } .zip-list .row { display:flex; justify-content:space-between; gap:10px; padding:8px 12px; border:1px solid var(--border); border-radius:10px; margin-bottom:6px; align-items:center; } .zip-list .row code { word-break:break-all; }",
  render: function (box) {
    /* ================= Inflate (RFC 1951) ================= */
    function BitReader(bytes) {
      this.b = bytes; this.pos = 0;
      this.bit = function () { var v = (this.b[this.pos >> 3] >> (this.pos & 7)) & 1; this.pos++; return v; };
      this.bits = function (n) { var v = 0; for (var i = 0; i < n; i++) v |= this.bit() << i; return v; };
    }
    function buildTable(lengths, max) {
      // canonical Huffman from code lengths
      var blCount = new Array(max + 1).fill(0);
      lengths.forEach(function (l) { if (l > 0) blCount[l]++; });
      var nextCode = new Array(max + 1).fill(0);
      var code = 0;
      for (var bits = 1; bits <= max; bits++) { code = (code + blCount[bits - 1]) << 1; nextCode[bits] = code; }
      var table = new Array(1 << max);
      for (var i = 0; i < lengths.length; i++) {
        var len = lengths[i];
        if (!len) continue;
        var c = nextCode[len]++;
        for (var rev = 0, k = 0; k < len; k++) rev |= ((c >> k) & 1) << (len - 1 - k);
        table[rev] = { s: i, l: len }; // symbol + its code length
      }
      return { table: table, max: max };
    }
    var FIX_LEN = new Array(288).fill(0);
    (function () {
      for (var i = 0; i < 144; i++) FIX_LEN[i] = 8;
      for (i = 144; i < 256; i++) FIX_LEN[i] = 9;
      for (i = 256; i < 280; i++) FIX_LEN[i] = 7;
      for (i = 280; i < 288; i++) FIX_LEN[i] = 8;
    })();
    var FIX_DIST = new Array(30).fill(5);
    var LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
    var LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
    var DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
    var DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

    function inflate(bytes) {
      var br = new BitReader(bytes);
      var out = [];
      var litTable = buildTable(FIX_LEN, 9), distTable = buildTable(FIX_DIST, 5);
      var litMax = 9, distMax = 5;
      function decode(tbl, max) {
        // table is indexed by bit-reversed codes (accumulate LSB-first); the
        // stored length rejects partial-prefix matches (e.g. a 7-bit code of
        // all zeros must not match after only 1 bit).
        var code = 0;
        for (var len = 1; len <= max; len++) {
          code |= br.bit() << (len - 1);
          var e = tbl.table[code];
          if (e && e.l <= len) return e.s;
        }
        throw new Error("Bad Huffman code");
      }
      var done = false;
      while (!done) {
        var bfinal = br.bit();
        var btype = br.bits(2);
        if (btype === 0) {
          // stored (uncompressed) block
          br.pos = (br.pos + 7) & ~7;
          var len = br.bits(16);
          br.bits(16); // nlen (one's complement, ignored)
          var base = br.pos >> 3;
          for (var s = 0; s < len; s++) out.push(bytes[base + s]);
          br.pos += len * 8;
        } else if (btype === 1) {
          litTable = buildTable(FIX_LEN, 9); litMax = 9;
          distTable = buildTable(FIX_DIST, 5); distMax = 5;
        } else if (btype === 2) {
          var hlit = br.bits(5) + 257;
          var hdist = br.bits(5) + 1;
          var hclen = br.bits(4) + 4;
          var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          var clLengths = new Array(19).fill(0);
          for (var ci = 0; ci < hclen; ci++) clLengths[order[ci]] = br.bits(3);
          var clTable = buildTable(clLengths, 7);
          var lengths = [];
          while (lengths.length < hlit + hdist) {
            var sym = decode(clTable, 7);
            if (sym < 16) lengths.push(sym);
            else if (sym === 16) {
              var rep = br.bits(2) + 3, prev = lengths[lengths.length - 1] || 0;
              for (var r = 0; r < rep; r++) lengths.push(prev);
            } else if (sym === 17) {
              var rep2 = br.bits(3) + 3;
              for (r = 0; r < rep2; r++) lengths.push(0);
            } else {
              var rep3 = br.bits(7) + 11;
              for (r = 0; r < rep3; r++) lengths.push(0);
            }
          }
          litTable = buildTable(lengths.slice(0, hlit), 15); litMax = 15;
          distTable = buildTable(lengths.slice(hlit), 15); distMax = 15;
        }
        // decode literals/lengths
        while (true) {
          var sym = decode(litTable, litMax);
          if (sym < 256) { out.push(sym); }
          else if (sym === 256) break;
          else {
            var li = sym - 257;
            var lenv = LEN_BASE[li] + br.bits(LEN_EXTRA[li]);
            var dsym = decode(distTable, distMax);
            var dist = DIST_BASE[dsym] + br.bits(DIST_EXTRA[dsym]);
            for (var cp = 0; cp < lenv; cp++) out.push(out[out.length - dist]);
          }
        }
        if (bfinal) done = true;
      }
      return out;
    }

    /* ================= ZIP parsing ================= */
    function utf8(arr) {
      try { return new TextDecoder("utf-8").decode(new Uint8Array(arr)); } catch (e) { return ""; }
    }
    function readU16(b, o) { return b[o] | (b[o + 1] << 8); }
    function readU32(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0; }

    function unzip(buf) {
      var b = new Uint8Array(buf);
      // find EOCD
      var eocd = -1;
      for (var i = b.length - 22; i >= 0; i--) {
        if (readU32(b, i) === 0x06054b50) { eocd = i; break; }
      }
      if (eocd === -1) throw new Error("Not a valid ZIP (no end-of-central-directory found).");
      var count = readU16(b, eocd + 10);
      var cdOffset = readU32(b, eocd + 16);
      var files = [];
      var off = cdOffset;
      for (var f = 0; f < count; f++) {
        if (readU32(b, off) !== 0x02014b50) break;
        var method = readU16(b, off + 10);
        var compSize = readU32(b, off + 20);
        var uncompSize = readU32(b, off + 24);
        var nameLen = readU16(b, off + 28);
        var extraLen = readU16(b, off + 30);
        var commentLen = readU16(b, off + 32);
        var localOff = readU32(b, off + 42);
        var name = utf8(b.subarray(off + 46, off + 46 + nameLen));
        // local header
        var dataStart = localOff + 30 + readU16(b, localOff + 26) + readU16(b, localOff + 28);
        var comp = b.subarray(dataStart, dataStart + compSize);
        var data;
        if (method === 0) data = comp;
        else if (method === 8) data = new Uint8Array(inflate(comp));
        else { off += 46 + nameLen + extraLen + commentLen; continue; }
        var isDir = name.endsWith("/");
        if (!isDir) files.push({ name: name, size: uncompSize, bytes: data });
        off += 46 + nameLen + extraLen + commentLen;
      }
      return files;
    }

    /* ================= ZIP creation (store) ================= */
    function crc32(bytes) {
      var table = crc32.table || (crc32.table = (function () {
        var t = new Int32Array(256);
        for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
        return t;
      })());
      var c = 0xffffffff;
      for (var i = 0; i < bytes.length; i++) c = table[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
      return (c ^ 0xffffffff) >>> 0;
    }
    function makeZip(entries) {
      // entries: [{name, bytes: Uint8Array}]
      var parts = [], central = [];
      var offset = 0;
      entries.forEach(function (e) {
        var name = new TextEncoder().encode(e.name);
        var local = [];
        local.push(0x50, 0x4b, 0x03, 0x04);
        pushU16(local, 20); // version
        pushU16(local, 0x0800); // flags: utf-8
        pushU16(local, 0); // method: store
        pushU16(local, 0); pushU16(local, 0); // time/date
        pushU32(local, crc32(e.bytes));
        pushU32(local, e.bytes.length);
        pushU32(local, e.bytes.length);
        pushU16(local, name.length);
        pushU16(local, 0);
        var localArr = new Uint8Array(local.length + name.length + e.bytes.length);
        localArr.set(local, 0); localArr.set(name, local.length); localArr.set(e.bytes, local.length + name.length);
        parts.push(localArr);
        var cd = [];
        cd.push(0x50, 0x4b, 0x01, 0x02);
        pushU16(cd, 20); pushU16(cd, 20);
        pushU16(cd, 0x0800);
        pushU16(cd, 0); pushU16(cd, 0); pushU16(cd, 0);
        pushU32(cd, crc32(e.bytes));
        pushU32(cd, e.bytes.length);
        pushU32(cd, e.bytes.length);
        pushU16(cd, name.length);
        pushU16(cd, 0); pushU16(cd, 0); pushU16(cd, 0); pushU16(cd, 0);
        pushU32(cd, 0); // ext attr
        pushU32(cd, offset);
        var cdArr = new Uint8Array(cd.length + name.length);
        cdArr.set(cd, 0); cdArr.set(name, cd.length);
        central.push(cdArr);
        offset += localArr.length;
      });
      function pushU16(arr, v) { arr.push(v & 0xff, (v >> 8) & 0xff); }
      function pushU32(arr, v) { arr.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff); }
      var cdSize = central.reduce(function (n, a) { return n + a.length; }, 0);
      var cdStart = parts.reduce(function (n, a) { return n + a.length; }, 0);
      var eocd = [];
      eocd.push(0x50, 0x4b, 0x05, 0x06);
      pushU16(eocd, 0); pushU16(eocd, 0);
      pushU16(eocd, entries.length); pushU16(eocd, entries.length);
      pushU32(eocd, cdSize);
      pushU32(eocd, cdStart);
      pushU16(eocd, 0);
      var total = cdStart + cdSize + eocd.length;
      var zip = new Uint8Array(total);
      var p = 0;
      parts.forEach(function (a) { zip.set(a, p); p += a.length; });
      central.forEach(function (a) { zip.set(a, p); p += a.length; });
      zip.set(eocd, p);
      return zip;
    }

    /* ================= UI ================= */
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="tab-zip" class="btn active">📦 Create ZIP</button>'
      + '<button id="tab-unzip" class="btn">🗜️ Unzip</button>'
      + "</div>"
      + '<div id="pane-zip">'
      + '<div id="drop-files" class="dropzone" role="button" tabindex="0">📄 <strong>Add files to zip</strong> — drop them here or click to browse<input type="file" id="zip-files" multiple class="hidden"></div>'
      + '<div id="zip-list" class="zip-list"></div>'
      + '<div class="controls"><button id="make" class="btn primary" disabled>📦 Download .zip</button></div>'
      + "</div>"
      + '<div id="pane-unzip" class="hidden">'
      + '<div id="drop-zip" class="dropzone" role="button" tabindex="0">🗜️ <strong>Drop a .zip here</strong> or click to browse<input type="file" id="unzip-file" accept=".zip,application/zip" class="hidden"></div>'
      + '<div id="unzip-list" class="zip-list"></div>'
      + "</div>"
      + "</div>";

    var pending = [];
    function fmtSize(n) { return n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB"; }

    function addFiles(list) {
      Array.prototype.forEach.call(list, function (f) {
        var reader = new FileReader();
        reader.onload = function () {
          pending.push({ name: f.name, bytes: new Uint8Array(reader.result) });
          renderZipList();
        };
        reader.readAsArrayBuffer(f);
      });
    }
    function renderZipList() {
      box.querySelector("#zip-list").innerHTML = pending.map(function (e, i) {
        return '<div class="row"><code>' + ToolBox.esc(e.name) + "</code><span class=\"small muted\">" + fmtSize(e.bytes.length) + ' <button data-i="' + i + '" style="border:none;background:none;cursor:pointer;color:var(--danger);">✕</button></span></div>';
      }).join("");
      box.querySelector("#make").disabled = !pending.length;
    }
    box.querySelector("#zip-list").addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-i]");
      if (btn) { pending.splice(+btn.dataset.i, 1); renderZipList(); }
    });

    box.querySelector("#tab-zip").addEventListener("click", function () {
      box.querySelector("#tab-zip").classList.add("active");
      box.querySelector("#tab-unzip").classList.remove("active");
      box.querySelector("#pane-zip").classList.remove("hidden");
      box.querySelector("#pane-unzip").classList.add("hidden");
    });
    box.querySelector("#tab-unzip").addEventListener("click", function () {
      box.querySelector("#tab-unzip").classList.add("active");
      box.querySelector("#tab-zip").classList.remove("active");
      box.querySelector("#pane-unzip").classList.remove("hidden");
      box.querySelector("#pane-zip").classList.add("hidden");
    });

    var dropF = box.querySelector("#drop-files");
    dropF.addEventListener("click", function () { box.querySelector("#zip-files").click(); });
    box.querySelector("#zip-files").addEventListener("change", function () { addFiles(box.querySelector("#zip-files").files); box.querySelector("#zip-files").value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { dropF.addEventListener(ev, function (e) { e.preventDefault(); dropF.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dropF.addEventListener(ev, function (e) { e.preventDefault(); dropF.classList.remove("drag"); }); });
    dropF.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });

    box.querySelector("#make").addEventListener("click", function () {
      var zip = makeZip(pending);
      var blob = new Blob([zip], { type: "application/zip" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "archive.zip";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });

    var dropZ = box.querySelector("#drop-zip");
    dropZ.addEventListener("click", function () { box.querySelector("#unzip-file").click(); });
    box.querySelector("#unzip-file").addEventListener("change", function () { unzipFile(box.querySelector("#unzip-file").files[0]); box.querySelector("#unzip-file").value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { dropZ.addEventListener(ev, function (e) { e.preventDefault(); dropZ.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dropZ.addEventListener(ev, function (e) { e.preventDefault(); dropZ.classList.remove("drag"); }); });
    dropZ.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) unzipFile(f); });

    function unzipFile(f) {
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var list = box.querySelector("#unzip-list");
        try {
          var files = unzip(reader.result);
          list.innerHTML = files.length
            ? files.map(function (file, i) {
              return '<div class="row"><code>📄 ' + ToolBox.esc(file.name) + "</code><span class=\"small muted\">" + fmtSize(file.size) + ' <button data-u="' + i + '" class="btn" style="padding:4px 10px;font-size:.75rem;">⬇️ Download</button></span></div>';
            }).join("")
            : '<p class="note-box">No files found in that ZIP.</p>';
          window.__unzipResults = files;
        } catch (e) {
          list.innerHTML = '<p class="note-box" style="color:var(--danger);">⚠️ ' + ToolBox.esc(e.message) + "</p>";
        }
      };
      reader.readAsArrayBuffer(f);
    }
    box.querySelector("#unzip-list").addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-u]");
      if (btn && window.__unzipResults) {
        var file = window.__unzipResults[+btn.dataset.u];
        var blob = new Blob([file.bytes], { type: "application/octet-stream" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name.split("/").pop();
        a.click();
      }
    });
  }
});