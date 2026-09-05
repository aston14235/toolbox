ToolBox.define("qr-generator", {
  render: function (box) {
    /* ================= GF(256) + Reed-Solomon ================= */
    var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
    (function () {
      var x = 1;
      for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
      for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    })();
    function mul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }
    function rsGen(deg) {
      var g = [1];
      for (var i = 0; i < deg; i++) {
        var next = new Array(g.length + 1).fill(0);
        for (var j = 0; j < g.length; j++) {
          next[j] ^= mul(g[j], EXP[i]);
          next[j + 1] ^= g[j];
        }
        g = next;
      }
      return g;
    }
    function rsRemainder(data, gen) {
      var res = new Array(gen.length - 1).fill(0);
      for (var i = 0; i < data.length; i++) {
        var f = data[i] ^ res[0];
        res.shift();
        res.push(0);
        if (f) for (var j = 0; j < res.length; j++) res[j] ^= mul(gen[j + 1], f);
      }
      return res;
    }

    /* ================= Version / block tables ================= */
    var TABLES = {
      L: [[7,1,19],[10,1,34],[15,1,55],[20,1,80],[26,1,108],[18,2,68],[20,2,78],[24,2,97],[30,2,116],[18,2,68,2,69]],
      M: [[10,1,16],[16,1,28],[26,1,44],[18,2,32],[24,2,43],[16,4,27],[18,4,31],[22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44]],
      Q: [[13,1,13],[22,1,22],[18,2,17],[26,2,24],[18,2,15,2,16],[24,4,19],[18,2,14,4,15],[22,4,18,2,19],[20,4,16,4,17],[24,6,19,2,20]],
      H: [[17,1,9],[28,1,16],[22,2,13],[16,4,9],[22,2,11,2,12],[28,4,15],[26,4,13,1,14],[26,4,14,2,15],[24,4,12,4,13],[28,6,15,2,16]]
    };
    var FORMAT = {
      L: [0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],
      M: [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],
      Q: [0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed],
      H: [0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b]
    };
    var VERSION_INFO = { 7: 0x07c94, 8: 0x085bc, 9: 0x09a99, 10: 0x0a4d3 };
    var ALIGN = { 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };

    /* ================= UI ================= */
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Text or URL</label>'
      + '<textarea id="input" rows="3" placeholder="https://example.com or any text…">https://aston14235.github.io/toolbox/</textarea></div>'
      + '<div class="split">'
      + '<div class="field"><label>Error correction</label><select id="level">'
      + '<option value="L">L — 7% (smallest)</option>'
      + '<option value="M" selected>M — 15%</option>'
      + '<option value="Q">Q — 25%</option>'
      + '<option value="H">H — 30% (most robust)</option>'
      + "</select></div>"
      + '<div class="field"><label>Size (px)</label><input type="number" id="size" value="320" min="120" max="800" step="20" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="controls"><button id="dl" class="btn primary">⬇️ Download PNG</button></div>'
      + '<div class="canvas-wrap center" style="padding:16px; background:#fff; border-radius:14px;"><canvas id="cv"></canvas></div>'
      + '<p class="note-box" id="note"></p>'
      + "</div>";

    /* ================= Encoder ================= */
    function buildMatrix(text, level) {
      var bytes = new TextEncoder().encode(text);
      var ver = 1;
      while (ver <= 10) {
        var caps = TABLES[level][ver - 1];
        var dataCap = 0;
        for (var i = 2; i < caps.length; i += 2) dataCap += caps[i - 1] * caps[i];
        var overhead = ver <= 9 ? 12 : 20; // 4 mode + 8/16 count bits
        if (bytes.length * 8 + overhead <= dataCap * 8) break;
        ver++;
      }
      if (ver > 10) throw new Error("Too long — try a lower error-correction level or shorter text.");
      var caps = TABLES[level][ver - 1];
      var ecLen = caps[0];

      /* ---- bitstream ---- */
      var bits = [];
      function pushBits(v, n) { for (var i = n - 1; i >= 0; i--) bits.push((v >> i) & 1); }
      pushBits(4, 4);
      pushBits(bytes.length, ver <= 9 ? 8 : 16);
      bytes.forEach(function (b) { pushBits(b, 8); });
      var dataCap = 0;
      for (var gi = 2; gi < caps.length; gi += 2) dataCap += caps[gi - 1] * caps[gi];
      var totalBits = dataCap * 8;
      pushBits(0, Math.min(4, totalBits - bits.length));
      while (bits.length % 8) bits.push(0);
      var pad = [0xec, 0x11], pi = 0;
      while (bits.length < totalBits) pushBits(pad[pi++ % 2], 8);

      var dataBytes = [];
      for (var bi = 0; bi < bits.length; bi += 8) {
        var v = 0;
        for (var bj = 0; bj < 8; bj++) v = (v << 1) | bits[bi + bj];
        dataBytes.push(v);
      }

      /* ---- RS blocks + interleave ---- */
      var blocks = [], pos = 0;
      for (gi = 2; gi < caps.length; gi += 2) {
        var count = caps[gi - 1], len = caps[gi];
        for (var k = 0; k < count; k++) {
          var blk = dataBytes.slice(pos, pos + len);
          pos += len;
          blocks.push({ data: blk, ec: rsRemainder(blk, rsGen(ecLen)) });
        }
      }
      var interleaved = [];
      var maxData = Math.max.apply(null, blocks.map(function (b) { return b.data.length; }));
      for (var di = 0; di < maxData; di++) blocks.forEach(function (b) { if (di < b.data.length) interleaved.push(b.data[di]); });
      for (var ei = 0; ei < ecLen; ei++) blocks.forEach(function (b) { interleaved.push(b.ec[ei]); });

      /* ---- matrix + reserved map ---- */
      var size = 21 + (ver - 1) * 4;
      var mod = new Uint8Array(size * size);
      var reserved = new Uint8Array(size * size);
      function set(x, y, v) { if (x >= 0 && y >= 0 && x < size && y < size) mod[y * size + x] = v; }
      function get(x, y) { return mod[y * size + x]; }
      function mark(x, y) { if (x >= 0 && y >= 0 && x < size && y < size) reserved[y * size + x] = 1; }

      function finder(x, y) {
        for (var r = -1; r <= 7; r++) for (var c = -1; c <= 7; c++) {
          mark(x + c, y + r);
          var dark = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          set(x + c, y + r, dark ? 1 : 0);
        }
      }
      finder(0, 0); finder(size - 7, 0); finder(0, size - 7);

      for (var t = 8; t < size - 8; t++) { mark(t, 6); mark(6, t); set(t, 6, t % 2 === 0 ? 1 : 0); set(6, t, t % 2 === 0 ? 1 : 0); }

      var alignPos = ALIGN[ver] || [];
      for (var a1 = 0; a1 < alignPos.length; a1++) for (var a2 = 0; a2 < alignPos.length; a2++) {
        var cx = alignPos[a1], cy = alignPos[a2];
        if ((cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)) continue;
        for (var r = -2; r <= 2; r++) for (var c = -2; c <= 2; c++) { mark(cx + c, cy + r); set(cx + c, cy + r, Math.max(Math.abs(r), Math.abs(c)) !== 2 ? 1 : 0); }
      }
      set(8, size - 8, 1); mark(8, size - 8);

      // reserve format + version areas
      for (var fi = 0; fi < 9; fi++) { mark(fi, 8); mark(8, fi); }
      for (fi = 0; fi < 8; fi++) { mark(size - 1 - fi, 8); mark(8, size - 1 - fi); }
      if (ver >= 7) {
        for (fi = 0; fi < 18; fi++) {
          var a = Math.floor(fi / 3), b = fi % 3;
          mark(size - 11 + b, a); mark(a, size - 11 + b);
        }
      }

      // place data (skip reserved)
      var bitIdx = 0;
      var dir = -1;
      for (var col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        for (var row = 0; row < size; row++) {
          var yy = dir === -1 ? size - 1 - row : row;
          for (var k2 = 0; k2 < 2; k2++) {
            var xx = col - k2;
            if (reserved[yy * size + xx]) continue;
            var bit = bitIdx < interleaved.length * 8 ? ((interleaved[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) : 0;
            set(xx, yy, bit);
            bitIdx++;
          }
        }
        dir = -dir;
      }

      // format + version placement helpers (bits go into reserved spots)
      function placeFormat(fmt) {
        for (var i = 0; i < 6; i++) set(8, i, (fmt >> i) & 1);
        set(8, 7, (fmt >> 6) & 1);
        set(8, 8, (fmt >> 7) & 1);
        set(7, 8, (fmt >> 8) & 1);
        for (i = 9; i < 15; i++) set(14 - i, 8, (fmt >> i) & 1);
        for (i = 0; i < 8; i++) set(size - 1 - i, 8, (fmt >> i) & 1);
        for (i = 8; i < 15; i++) set(8, size - 15 + i, (fmt >> i) & 1);
        set(8, size - 8, 1);
      }
      function placeVersion() {
        if (ver < 7) return;
        var v = VERSION_INFO[ver];
        for (var i = 0; i < 18; i++) {
          var bit = (v >> i) & 1;
          var a = Math.floor(i / 3), b = i % 3;
          set(size - 11 + b, a, bit);
          set(a, size - 11 + b, bit);
        }
      }

      /* ---- try all 8 masks, pick lowest penalty ---- */
      var candidates = [];
      for (var mi = 0; mi < 8; mi++) {
        var copy = mod.slice();
        for (var my = 0; my < size; my++) for (var mx = 0; mx < size; mx++) {
          if (reserved[my * size + mx]) continue;
          var cond = false;
          if (mi === 0) cond = (mx + my) % 2 === 0;
          else if (mi === 1) cond = my % 2 === 0;
          else if (mi === 2) cond = mx % 3 === 0;
          else if (mi === 3) cond = (mx + my) % 3 === 0;
          else if (mi === 4) cond = (Math.floor(my / 2) + Math.floor(mx / 3)) % 2 === 0;
          else if (mi === 5) cond = (mx * my) % 2 + (mx * my) % 3 === 0;
          else if (mi === 6) cond = ((mx * my) % 2 + (mx * my) % 3) % 2 === 0;
          else if (mi === 7) cond = ((mx + my) % 2 + (mx * my) % 3) % 2 === 0;
          if (cond) copy[my * size + mx] = 1;
        }
        var fmt = FORMAT[level][mi];
        // score needs format bits in place
        var scored = copy.slice();
        (function () {
          for (var i = 0; i < 6; i++) scored[i * size + 8] = (fmt >> i) & 1;
          scored[7 * size + 8] = (fmt >> 6) & 1;
          scored[8 * size + 8] = (fmt >> 7) & 1;
          scored[8 * size + 7] = (fmt >> 8) & 1;
          for (i = 9; i < 15; i++) scored[8 * size + (14 - i)] = (fmt >> i) & 1;
          for (i = 0; i < 8; i++) scored[8 * size + (size - 1 - i)] = (fmt >> i) & 1;
          for (i = 8; i < 15; i++) scored[(size - 15 + i) * size + 8] = (fmt >> i) & 1;
          scored[(size - 8) * size + 8] = 1;
        })();
        var penalty = 0;
        function scoreLine(getter, len) {
          var p = 0, run = 1;
          for (var i = 1; i < len; i++) {
            if (getter(i) === getter(i - 1)) { run++; if (i === len - 1 && run >= 5) p += 3 + (run - 5); }
            else { if (run >= 5) p += 3 + (run - 5); run = 1; }
          }
          return p;
        }
        for (var ry = 0; ry < size; ry++) penalty += scoreLine(function (i) { return scored[ry * size + i]; }, size);
        for (var rx = 0; rx < size; rx++) penalty += scoreLine(function (i) { return scored[i * size + rx]; }, size);
        for (var y2 = 0; y2 < size - 1; y2++) for (var x2 = 0; x2 < size - 1; x2++) {
          var v0 = scored[y2 * size + x2];
          if (v0 === scored[y2 * size + x2 + 1] && v0 === scored[(y2 + 1) * size + x2] && v0 === scored[(y2 + 1) * size + x2 + 1]) penalty += 3;
        }
        function finderPenalty(getter, len) {
          var p = 0;
          for (var i = 0; i + 11 <= len; i++) {
            var pat = "";
            for (var j = 0; j < 11; j++) pat += getter(i + j);
            if (pat === "00001011101" || pat === "10111010000") p += 40;
          }
          return p;
        }
        for (var fy = 0; fy < size; fy++) penalty += finderPenalty(function (i) { return scored[fy * size + i]; }, size);
        for (var fx = 0; fx < size; fx++) penalty += finderPenalty(function (i) { return scored[i * size + fx]; }, size);
        var dark = 0;
        scored.forEach(function (b) { dark += b; });
        var pct = dark / (size * size) * 100;
        penalty += Math.floor(Math.abs(pct - 50) / 5) * 10;
        candidates.push({ mask: mi, penalty: penalty, data: copy });
      }
      candidates.sort(function (a, b) { return a.penalty - b.penalty; });
      var best = candidates[0];
      mod = best.data;
      placeFormat(FORMAT[level][best.mask]);
      placeVersion();
      return { size: size, mod: mod };
    }

    function render() {
      var note = box.querySelector("#note");
      note.style.color = "";
      try {
        var text = box.querySelector("#input").value;
        var level = box.querySelector("#level").value;
        if (!text) { note.textContent = "Type something to generate a QR code."; return; }
        var qr = buildMatrix(text, level);
        var px = Number(box.querySelector("#size").value) || 320;
        var quiet = 4;
        var cell = Math.max(2, Math.floor(px / (qr.size + quiet * 2)));
        var out = Math.max(1, cell * (qr.size + quiet * 2));
        var cv = box.querySelector("#cv");
        cv.width = out; cv.height = out;
        var ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, out, out);
        ctx.fillStyle = "#000";
        for (var y = 0; y < qr.size; y++) for (var x = 0; x < qr.size; x++) {
          if (qr.mod[y * qr.size + x]) ctx.fillRect((x + quiet) * cell, (y + quiet) * cell, cell, cell);
        }
        note.textContent = "QR " + qr.size + "×" + qr.size + " modules · error correction " + level + " · " + text.length + " chars";
      } catch (e) {
        note.textContent = "⚠️ " + e.message;
        note.style.color = "var(--danger)";
      }
    }

    box.querySelector("#input").addEventListener("input", render);
    box.querySelector("#level").addEventListener("change", render);
    box.querySelector("#size").addEventListener("input", render);
    box.querySelector("#dl").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = box.querySelector("#cv").toDataURL("image/png");
      a.download = "qrcode.png";
      a.click();
    });
    render();
  }
});