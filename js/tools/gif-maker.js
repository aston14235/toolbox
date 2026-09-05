ToolBox.define("gif-maker", {
  styles: ".gif-thumbs { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; } .gif-thumb { position:relative; border:1px solid var(--border); border-radius:10px; padding:6px; background:var(--bg); } .gif-thumb img { width:70px; height:70px; object-fit:cover; border-radius:6px; display:block; } .gif-thumb button { position:absolute; top:-8px; right:-8px; width:22px; height:22px; border-radius:50%; border:1px solid var(--border); background:var(--surface); cursor:pointer; color:var(--danger); font-weight:700; line-height:1; }",
  render: function (box) {
    /* ============ LZW encoder ============ */
    function lzwEncode(indices, minCodeSize) {
      var clearCode = 1 << minCodeSize;
      var eoiCode = clearCode + 1;
      var codeSize = minCodeSize + 1;
      var dict = new Map();
      var dictNext = eoiCode + 1;
      var outBits = [];
      function emit(code, size) {
        for (var i = size - 1; i >= 0; i--) outBits.push((code >> i) & 1);
      }
      emit(clearCode, codeSize);
      var prefix = null;
      function reset() {
        dict = new Map();
        dictNext = eoiCode + 1;
        codeSize = minCodeSize + 1;
        prefix = null;
      }
      for (var i = 0; i < indices.length; i++) {
        var c = indices[i];
        if (prefix === null) { prefix = [c]; continue; }
        var key = prefix.join(",") + "," + c;
        if (dict.has(key)) { prefix = prefix.concat([c]); continue; }
        emit(prefix[0], codeSize);
        dict.set(key, dictNext);
        dictNext++;
        if (dictNext > (1 << codeSize) && codeSize < 12) codeSize++;
        if (dictNext >= 4096) { emit(clearCode, codeSize); reset(); prefix = [c]; }
        else prefix = [c];
      }
      if (prefix !== null) emit(prefix[0], codeSize);
      emit(eoiCode, codeSize);
      return outBits;
    }

    /* ============ Median-cut palette ============ */
    function buildPalette(images, num) {
      var samples = [];
      images.forEach(function (im) {
        var c = document.createElement("canvas");
        c.width = im.width; c.height = im.height;
        var x = c.getContext("2d");
        x.drawImage(im, 0, 0);
        var d;
        try { d = x.getImageData(0, 0, c.width, c.height).data; } catch (e) { return; }
        var step = Math.max(4, Math.floor(d.length / 4 / 3000));
        for (var i = 0; i < d.length; i += step * 4) {
          if (d[i + 3] < 128) continue;
          samples.push([d[i], d[i + 1], d[i + 2]]);
        }
      });
      if (!samples.length) samples = [[0, 0, 0], [255, 255, 255]];
      var boxes = [samples];
      function split(box) {
        var rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
        box.forEach(function (p) {
          rMin = Math.min(rMin, p[0]); rMax = Math.max(rMax, p[0]);
          gMin = Math.min(gMin, p[1]); gMax = Math.max(gMax, p[1]);
          bMin = Math.min(bMin, p[2]); bMax = Math.max(bMax, p[2]);
        });
        var range = [rMax - rMin, gMax - gMin, bMax - bMin];
        var chan = range[0] >= range[1] && range[0] >= range[2] ? 0 : range[1] >= range[2] ? 1 : 2;
        box.sort(function (a, b) { return a[chan] - b[chan]; });
        var mid = Math.ceil(box.length / 2);
        return [box.slice(0, mid), box.slice(mid)];
      }
      while (boxes.length < num && boxes.some(function (b) { return b.length > 1; })) {
        boxes.sort(function (a, b) { return b.length - a.length; });
        var biggest = boxes.shift();
        if (biggest.length > 1) {
          var parts = split(biggest);
          boxes.push(parts[0], parts[1]);
        } else boxes.push(biggest);
      }
      var palette = boxes.map(function (b) {
        var r = 0, g = 0, bl = 0;
        b.forEach(function (p) { r += p[0]; g += p[1]; bl += p[2]; });
        var n = b.length || 1;
        return [Math.round(r / n), Math.round(g / n), Math.round(bl / n)];
      });
      while (palette.length < num) palette.push([0, 0, 0]);
      return palette;
    }

    /* ============ GIF assembly ============ */
    function makeGif(images, delayMs, loop) {
      var width = Math.min.apply(null, images.map(function (i) { return i.width; }));
      var height = Math.min.apply(null, images.map(function (i) { return i.height; }));
      if (width < 1 || height < 1) throw new Error("Frames must all have a size.");
      var palette = buildPalette(images, 256);
      var palBytes = [];
      palette.forEach(function (p) { palBytes.push(p[0], p[1], p[2]); });
      while (palBytes.length < 256 * 3) palBytes.push(0, 0, 0);

      var delayCs = Math.max(1, Math.round(delayMs / 10));
      var chunks = [];
      function pushByte(b) { chunks.push(b); }
      function pushStr(s) { for (var i = 0; i < s.length; i++) chunks.push(s.charCodeAt(i)); }
      function pushBytes(arr) { chunks.push.apply(chunks, arr); }

      pushStr("GIF89a");
      pushByte(width & 0xff); pushByte((width >> 8) & 0xff);
      pushByte(height & 0xff); pushByte((height >> 8) & 0xff);
      pushByte(0xf7); // GCT flag, 8-bit color resolution, 256 colors
      pushByte(0); // bg
      pushByte(0);
      pushBytes(palBytes);

      // loop extension
      pushByte(0x21); pushByte(0xff); pushByte(0x0b);
      pushStr("NETSCAPE2.0");
      pushByte(0x03); pushByte(0x01);
      pushByte(loop & 0xff); pushByte((loop >> 8) & 0xff);
      pushByte(0);

      images.forEach(function (im) {
        var c = document.createElement("canvas");
        c.width = width; c.height = height;
        var x = c.getContext("2d");
        x.fillStyle = "#ffffff";
        x.fillRect(0, 0, width, height);
        x.drawImage(im, 0, 0, width, height);
        var d = x.getImageData(0, 0, width, height).data;
        // index each pixel to nearest palette color
        var indices = new Uint8Array(width * height);
        for (var i = 0; i < width * height; i++) {
          var pi = i * 4;
          var best = 0, bd = Infinity;
          for (var p = 0; p < 256; p++) {
            var dr = d[pi] - palette[p][0], dg = d[pi + 1] - palette[p][1], db = d[pi + 2] - palette[p][2];
            var dist = dr * dr + dg * dg + db * db;
            if (dist < bd) { bd = dist; best = p; }
          }
          indices[i] = best;
        }
        // GCE
        pushByte(0x21); pushByte(0xf9); pushByte(0x04);
        pushByte(0x04); // disposal: restore to bg (clear)
        pushByte(delayCs & 0xff); pushByte((delayCs >> 8) & 0xff);
        pushByte(0); // no transparency
        pushByte(0);
        // image descriptor
        pushByte(0x2c);
        pushByte(0); pushByte(0); pushByte(0); pushByte(0); // left/top = 0
        pushByte(width & 0xff); pushByte((width >> 8) & 0xff);
        pushByte(height & 0xff); pushByte((height >> 8) & 0xff);
        pushByte(0x00); // local color table: none
        // LZW
        var minCodeSize = width * height > 255 * 255 ? 8 : 8;
        var bits = lzwEncode(indices, minCodeSize);
        // pack bits into bytes
        var lzwBytes = [];
        for (var b = 0; b < bits.length; b += 8) {
          var byte = 0;
          for (var bb = 0; bb < 8; bb++) byte = (byte << 1) | (bits[b + bb] || 0);
          lzwBytes.push(byte);
        }
        pushByte(minCodeSize);
        // sub-blocks
        for (var s = 0; s < lzwBytes.length; s += 255) {
          var chunk = lzwBytes.slice(s, s + 255);
          pushByte(chunk.length);
          pushBytes(chunk);
        }
        pushByte(0);
      });
      pushByte(0x3b);
      return new Uint8Array(chunks);
    }

    /* ============ UI ============ */
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🎞️ <strong>Add frames</strong> — drop 2+ images here, or click to browse<input type="file" id="file" accept="image/*" multiple class="hidden"></div>'
      + '<div class="gif-thumbs" id="thumbs"></div>'
      + '<div class="controls" style="margin-top:14px;">'
      + '<label>Frame delay <input type="range" id="delay" min="50" max="2000" step="50" value="400" style="width:160px;"> <span id="delay-label">400ms</span></label>'
      + '<label>Loop <select id="loop"><option value="0" selected>Forever</option><option value="1">Once</option><option value="3">3 times</option></select></label>'
      + '<button id="make" class="btn primary" disabled>🎬 Make GIF</button>'
      + '<button id="dl" class="btn" disabled>⬇️ Download .gif</button>'
      + "</div>"
      + '<div id="result" class="canvas-wrap center"></div>'
      + "</div>";

    var frames = [];
    function refresh() {
      box.querySelector("#thumbs").innerHTML = frames.map(function (im, i) {
        return '<div class="gif-thumb"><img src="' + im.src + '" alt="frame ' + (i + 1) + '"><button data-i="' + i + '" title="Remove">✕</button></div>';
      }).join("");
      box.querySelector("#make").disabled = frames.length < 2;
      box.querySelector("#dl").disabled = true;
    }
    function loadFiles(list) {
      Array.prototype.forEach.call(list, function (f) {
        if (!f || !/^image\//.test(f.type)) return;
        var reader = new FileReader();
        reader.onload = function () {
          var im = new Image();
          im.onload = function () { frames.push(im); refresh(); };
          im.src = reader.result;
        };
        reader.readAsDataURL(f);
      });
    }

    box.querySelector("#drop").addEventListener("click", function () { box.querySelector("#file").click(); });
    box.querySelector("#file").addEventListener("change", function () { loadFiles(box.querySelector("#file").files); box.querySelector("#file").value = ""; });
    var drop = box.querySelector("#drop");
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { loadFiles(e.dataTransfer.files); });
    box.querySelector("#thumbs").addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-i]");
      if (btn) { frames.splice(+btn.dataset.i, 1); refresh(); }
    });
    box.querySelector("#delay").addEventListener("input", function () { box.querySelector("#delay-label").textContent = box.querySelector("#delay").value + "ms"; });
    box.querySelector("#make").addEventListener("click", function () {
      try {
        var bytes = makeGif(frames, Number(box.querySelector("#delay").value), Number(box.querySelector("#loop").value));
        var blob = new Blob([bytes], { type: "image/gif" });
        var url = URL.createObjectURL(blob);
        box.querySelector("#result").innerHTML = '<img src="' + url + '" alt="Your GIF" style="max-width:100%; border-radius:10px;">';
        box.querySelector("#dl").disabled = false;
        box.querySelector("#dl").onclick = function () {
          var a = document.createElement("a");
          a.href = url;
          a.download = "animation.gif";
          a.click();
        };
      } catch (e) {
        box.querySelector("#result").innerHTML = '<p class="note-box" style="color:var(--danger);">⚠️ ' + ToolBox.esc(e.message) + "</p>";
      }
    });
  }
});