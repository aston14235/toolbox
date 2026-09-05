ToolBox.define("excel-to-csv", {
  render: function (box) {
    /* ================= Inflate (RFC 1951) — compact copy ================= */
    function BitReader(bytes) {
      this.b = bytes; this.pos = 0;
      this.bit = function () { var v = (this.b[this.pos >> 3] >> (this.pos & 7)) & 1; this.pos++; return v; };
      this.bits = function (n) { var v = 0; for (var i = 0; i < n; i++) v |= this.bit() << i; return v; };
    }
    function buildTable(lengths, max) {
      var blCount = new Array(max + 1).fill(0);
      lengths.forEach(function (l) { if (l > 0) blCount[l]++; });
      var nextCode = new Array(max + 1).fill(0), code = 0;
      for (var bits = 1; bits <= max; bits++) { code = (code + blCount[bits - 1]) << 1; nextCode[bits] = code; }
      var table = new Array(1 << max);
      for (var i = 0; i < lengths.length; i++) {
        var len = lengths[i];
        if (!len) continue;
        var c = nextCode[len]++;
        var rev = 0;
        for (var k = 0; k < len; k++) rev |= ((c >> k) & 1) << (len - 1 - k);
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
      var br = new BitReader(bytes), out = [];
      var litT = buildTable(FIX_LEN, 9), distT = buildTable(FIX_DIST, 5), litMax = 9, distMax = 5;
      function decode(tbl, max) {
        // table is indexed by bit-reversed codes (accumulate LSB-first); the
        // stored length rejects partial-prefix matches (e.g. a 7-bit code of
        // all zeros must not match after only 1 bit).
        var c = 0;
        for (var len = 1; len <= max; len++) {
          c |= br.bit() << (len - 1);
          var e = tbl.table[c];
          if (e && e.l <= len) return e.s;
        }
        throw new Error("Bad Huffman code");
      }
      var done = false;
      while (!done) {
        var bfinal = br.bit(), btype = br.bits(2);
        if (btype === 0) {
          br.pos = (br.pos + 7) & ~7;
          var len = br.bits(16); br.bits(16);
          var base = br.pos >> 3;
          for (var s = 0; s < len; s++) out.push(bytes[base + s]);
          br.pos += len * 8;
        } else if (btype === 2) {
          var hlit = br.bits(5) + 257, hdist = br.bits(5) + 1, hclen = br.bits(4) + 4;
          var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          var cl = new Array(19).fill(0);
          for (var ci = 0; ci < hclen; ci++) cl[order[ci]] = br.bits(3);
          var clT = buildTable(cl, 7), lengths = [];
          while (lengths.length < hlit + hdist) {
            var sym = decode(clT, 7);
            if (sym < 16) lengths.push(sym);
            else if (sym === 16) { var rep = br.bits(2) + 3, prev = lengths[lengths.length - 1] || 0; for (var r = 0; r < rep; r++) lengths.push(prev); }
            else if (sym === 17) { var rep2 = br.bits(3) + 3; for (r = 0; r < rep2; r++) lengths.push(0); }
            else { var rep3 = br.bits(7) + 11; for (r = 0; r < rep3; r++) lengths.push(0); }
          }
          litT = buildTable(lengths.slice(0, hlit), 15); litMax = 15;
          distT = buildTable(lengths.slice(hlit), 15); distMax = 15;
        }
        while (true) {
          var sym = decode(litT, litMax);
          if (sym < 256) out.push(sym);
          else if (sym === 256) break;
          else {
            var li = sym - 257, lenv = LEN_BASE[li] + br.bits(LEN_EXTRA[li]);
            var dsym = decode(distT, distMax);
            var dist = DIST_BASE[dsym] + br.bits(DIST_EXTRA[dsym]);
            for (var cp = 0; cp < lenv; cp++) out.push(out[out.length - dist]);
          }
        }
        if (bfinal) done = true;
      }
      return out;
    }
    function readU16(b, o) { return b[o] | (b[o + 1] << 8); }
    function readU32(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0; }
    function unzip(buf) {
      var b = new Uint8Array(buf), eocd = -1;
      for (var i = b.length - 22; i >= 0; i--) if (readU32(b, i) === 0x06054b50) { eocd = i; break; }
      if (eocd === -1) throw new Error("Not a valid XLSX (ZIP container).");
      var count = readU16(b, eocd + 10), off = readU32(b, eocd + 16), files = {};
      for (var f = 0; f < count; f++) {
        if (readU32(b, off) !== 0x02014b50) break;
        var method = readU16(b, off + 10), compSize = readU32(b, off + 20);
        var nameLen = readU16(b, off + 28), extraLen = readU16(b, off + 30), commentLen = readU16(b, off + 32);
        var localOff = readU32(b, off + 42);
        var name = "";
        try { name = new TextDecoder("utf-8").decode(b.subarray(off + 46, off + 46 + nameLen)); } catch (e) {}
        var dataStart = localOff + 30 + readU16(b, localOff + 26) + readU16(b, localOff + 28);
        var comp = b.subarray(dataStart, dataStart + compSize);
        files[name] = method === 0 ? comp : method === 8 ? new Uint8Array(inflate(comp)) : null;
        off += 46 + nameLen + extraLen + commentLen;
      }
      return files;
    }

    /* ================= XLSX → CSV ================= */
    function xml(str) {
      return new DOMParser().parseFromString(str, "application/xml");
    }
    function cellText(cell, shared) {
      var t = cell.getAttribute("t");
      var v = cell.getElementsByTagName("v")[0];
      var isEl = cell.getElementsByTagName("is")[0];
      if (t === "inlineStr" && isEl) {
        var text = "";
        var nodes = isEl.getElementsByTagName("t");
        for (var i = 0; i < nodes.length; i++) text += nodes[i].textContent;
        return text;
      }
      if (t === "s" && v && shared) {
        var idx = parseInt(v.textContent, 10);
        var si = shared[idx];
        if (!si) return "";
        var text = "";
        var ts = si.getElementsByTagName("t");
        for (i = 0; i < ts.length; i++) text += ts[i].textContent;
        return text;
      }
      if (t === "b" && v) return v.textContent === "1" ? "TRUE" : "FALSE";
      return v ? v.textContent : "";
    }
    function colIndex(ref) {
      var m = /^([A-Z]+)/.exec(ref);
      var n = 0;
      if (m) for (var i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64);
      return n - 1;
    }
    function toCsv(cells, shared) {
      // cells: array of {ref, text}
      var rows = {};
      var maxCol = 0;
      cells.forEach(function (c) {
        var m = /(\d+)$/.exec(c.ref);
        var r = +m[1] - 1, col = colIndex(c.ref);
        if (!rows[r]) rows[r] = [];
        rows[r][col] = c.text;
        if (col > maxCol) maxCol = col;
      });
      var out = [];
      Object.keys(rows).sort(function (a, b) { return +a - +b; }).forEach(function (r) {
        var row = rows[r];
        for (var i = 0; i <= maxCol; i++) if (!row[i]) row[i] = "";
        out.push(row.map(function (v) {
          v = String(v).replace(/\r?\n/g, " ");
          return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
        }).join(","));
      });
      return out.join("\n");
    }

    /* ================= UI ================= */
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">📊 <strong>Drop an .xlsx file here</strong> or click to browse<input type="file" id="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="hidden"></div>'
      + '<div class="controls" style="margin-top:14px;">'
      + '<button id="dl" class="btn primary" disabled>⬇️ Download .csv</button>'
      + '<button id="copy" class="btn" disabled>📋 Copy CSV</button>'
      + "</div>"
      + '<div id="preview-wrap" class="hidden" style="margin-top:10px;"><label class="section-sub" style="display:block; margin-bottom:8px;"><strong>Preview (first 30 rows)</strong></label>'
      + '<div style="max-height:340px; overflow:auto; border:1px solid var(--border); border-radius:12px;"><table class="data" id="preview"></table></div></div>'
      + '<p class="note-box" id="status">Your spreadsheet never leaves your device — the whole conversion happens in the browser.</p>'
      + "</div>";

    var lastCsv = "";

    function convert(f) {
      var reader = new FileReader();
      reader.onload = function () {
        var status = box.querySelector("#status");
        try {
          var files = unzip(reader.result);
          var sharedDoc = null, shared = [];
          if (files["xl/sharedStrings.xml"]) {
            sharedDoc = xml(new TextDecoder("utf-8").decode(files["xl/sharedStrings.xml"]));
            shared = Array.prototype.slice.call(sharedDoc.getElementsByTagName("si"));
          }
          var sheetName = "xl/worksheets/sheet1.xml";
          // find the real first sheet via workbook.xml if needed
          if (!files[sheetName] && files["xl/workbook.xml"]) {
            var wb = xml(new TextDecoder("utf-8").decode(files["xl/workbook.xml"]));
            var first = wb.getElementsByTagName("sheet")[0];
            if (first) {
              var rid = first.getAttribute("r:id") || first.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
              if (rid && files["xl/_rels/workbook.xml.rels"]) {
                var rels = xml(new TextDecoder("utf-8").decode(files["xl/_rels/workbook.xml.rels"]));
                var relNodes = rels.getElementsByTagName("Relationship");
                for (var i = 0; i < relNodes.length; i++) {
                  if (relNodes[i].getAttribute("Id") === rid) {
                    var target = relNodes[i].getAttribute("Target");
                    sheetName = "xl/" + target.replace(/^\//, "").replace(/^xl\//, "");
                    if (target.indexOf("worksheets/") !== -1) sheetName = "xl/" + target;
                    break;
                  }
                }
              }
            }
          }
          if (!files[sheetName]) throw new Error("No worksheet found in this workbook.");
          var sheet = xml(new TextDecoder("utf-8").decode(files[sheetName]));
          var cells = [];
          var rows = sheet.getElementsByTagName("row");
          for (var r = 0; r < rows.length; r++) {
            var cs = rows[r].getElementsByTagName("c");
            for (var cix = 0; cix < cs.length; cix++) {
              var ref = cs[cix].getAttribute("r");
              if (!ref) continue;
              var text = cellText(cs[cix], shared);
              if (text !== "" || cs[cix].getElementsByTagName("v")[0]) cells.push({ ref: ref, text: text });
            }
          }
          lastCsv = toCsv(cells, shared);
          box.querySelector("#dl").disabled = false;
          box.querySelector("#copy").disabled = false;
          box.querySelector("#preview-wrap").classList.remove("hidden");
          var lines = lastCsv.split("\n").slice(0, 30);
          box.querySelector("#preview").innerHTML = "<thead><tr>" + lines[0].split(",").map(function () { return "<th>Col</th>"; }).join("") + "</tr></thead><tbody>"
            + lines.map(function (l) {
              var vals = l.split(",");
              while (vals.length < 4) vals.push("");
              return "<tr>" + vals.map(function (v) { return "<td>" + ToolBox.esc(v) + "</td>"; }).join("") + "</tr>";
            }).join("")
            + "</tbody>";
          status.textContent = "✅ Converted " + rows.length + " rows × " + (lastCsv.split("\n")[0] ? lastCsv.split("\n")[0].split(",").length : 0) + " columns.";
          status.style.color = "var(--ok)";
        } catch (e) {
          status.textContent = "⚠️ " + e.message;
          status.style.color = "var(--danger)";
        }
      };
      reader.readAsArrayBuffer(f);
    }

    box.querySelector("#dl").addEventListener("click", function () {
      var blob = new Blob([lastCsv], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "converted.csv";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    box.querySelector("#copy").addEventListener("click", function () {
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy CSV"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lastCsv).then(done, done);
      else done();
    });

    var drop = box.querySelector("#drop");
    drop.addEventListener("click", function () { box.querySelector("#file").click(); });
    box.querySelector("#file").addEventListener("change", function () { convert(box.querySelector("#file").files[0]); box.querySelector("#file").value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) convert(f); });
  }
});