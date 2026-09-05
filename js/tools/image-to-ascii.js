ToolBox.define("image-to-ascii", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose an image">'
      + '<span class="dz-icon">🖼️</span><strong>Drop an image here</strong> or click to browse'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + "</div>"
      + '<div id="controls" class="hidden" style="margin-top:20px;">'
      + '<div class="controls">'
      + '<label>Style <select id="style"><option value="classic" selected>Classic</option><option value="fine">Fine</option><option value="complex">Complex</option><option value="blocky">Blocky</option></select></label>'
      + '<label>Color <select id="color"><option value="off" selected>B&W</option><option value="full">Full color</option><option value="gray">Grayscale tint</option></select></label>'
      + '<label>Width <input type="range" id="width" min="40" max="220" value="120"> <span id="width-label">120</span></label>'
      + '<label>Contrast <input type="range" id="contrast" min="0" max="200" value="100"> <span id="contrast-label">100%</span></label>'
      + '<label>Brightness <input type="range" id="brightness" min="-60" max="60" value="0"> <span id="brightness-label">0</span></label>'
      + "</div>"
      + '<div class="controls" style="margin-top:4px;">'
      + '<label>Dither <input type="checkbox" id="dither" checked></label>'
      + '<label>Invert <input type="checkbox" id="invert"></label>'
      + '<button id="auto" class="btn ghost">✨ Auto-optimize</button>'
      + "</div>"
      + '<p id="auto-note" class="muted small" style="margin-top:6px;"></p>'
      + '<div class="ascii-out" id="out" aria-label="ASCII art output" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;line-height:1.05;white-space:pre;font-size:10px;word-break:break-all;"></div>'
      + '<div class="controls" style="margin-top:14px;">'
      + '<button id="copy" class="btn primary">📋 Copy ASCII</button>'
      + '<button id="copy-html" class="btn ghost">📋 Copy colored (HTML)</button>'
      + "</div></div></div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var controls = box.querySelector("#controls");
    var outEl = box.querySelector("#out");
    var widthEl = box.querySelector("#width");
    var lastImg = null;
    var lastUrl = null;
    var lastPlain = ""; /* plain-text mirror of the current output (for copy) */
    /* ascii-image-converter style ramps. The "complex" ramp is the classic
       70-level lighting-density ramp — smooth gradients, no banding. */
    var RAMP = {
      classic: " .:-=+*#%@",
      fine: " .,:;irsXA253hMHGS#9B&@",
      /* the classic 70-level lighting ramp (lightest → darkest, matching the
         other styles below) — the same character density ascii-image-converter
         uses for smooth gradients */
      complex: " .'`^\",:;Il!i><~+_-?[]{}1()|\\/tfrjxunvcxzYUCQL0OZmwqpdbkaoh*#MW&8%B@$",
      blocky: " ░▒▓█"
    };
    var STYLE_NAME = { classic: "Classic", fine: "Fine", complex: "Complex", blocky: "Blocky" };

    /* Analyze the image: aspect, resolution, tonal statistics and colorfulness.
       Computed on a small downscaled sample with the same auto-level stretch
       convert() uses, so the analysis matches what you'll see. */
    function analyze(img) {
      var sw = 160;
      var aspect = img.naturalHeight / img.naturalWidth;
      var sh = Math.max(1, Math.round(sw * aspect));
      var c = document.createElement("canvas");
      c.width = sw;
      c.height = sh;
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, sw, sh);
      var d = ctx.getImageData(0, 0, sw, sh).data;
      var n = sw * sh;
      var gray = new Float32Array(n);
      var chroma = 0;
      for (var i = 0; i < n; i++) {
        var p = i * 4;
        var a = d[p + 3] / 255;
        var r = d[p] * a + 255 * (1 - a);
        var g = d[p + 1] * a + 255 * (1 - a);
        var b = d[p + 2] * a + 255 * (1 - a);
        gray[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        chroma += (Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r)) / 2;
      }
      chroma /= n;
      var mn = 255, mx = 0;
      for (var j = 0; j < n; j++) {
        if (gray[j] < mn) mn = gray[j];
        if (gray[j] > mx) mx = gray[j];
      }
      if (mx - mn > 8) {
        var span = mx - mn;
        for (var k = 0; k < n; k++) gray[k] = (gray[k] - mn) / span * 255;
      }
      var mean = 0;
      for (var m = 0; m < n; m++) mean += gray[m];
      mean /= n;
      var varr = 0;
      var counts = {};
      for (var q = 0; q < n; q++) {
        varr += (gray[q] - mean) * (gray[q] - mean);
        var bucket = Math.round(gray[q] / 8);
        counts[bucket] = (counts[bucket] || 0) + 1;
      }
      var sigma = Math.sqrt(varr / n);
      var minShare = n * 0.0025;
      var tones = 0;
      for (var b in counts) if (counts[b] >= minShare) tones++;
      return { aspect: aspect, longest: Math.max(img.naturalWidth, img.naturalHeight), mean: mean, sigma: sigma, tones: tones, chroma: chroma };
    }

    /* Pick the best settings for the loaded image and apply them. */
    function autoTune() {
      if (!lastImg) return;
      var a = analyze(lastImg);

      // style: flat line art → Classic (clean edges), tonal → Fine, big detailed → Complex
      var style = a.tones <= 5 ? "classic" : (a.longest >= 1400 ? "complex" : "fine");
      box.querySelector("#style").value = style;

      // color: colorful photos get full color (that's what makes it look like the photo)
      var colorful = a.chroma >= 22;
      box.querySelector("#color").value = colorful ? "full" : "off";

      var aspect = a.aspect; // h/w
      var w;
      if (aspect <= 0.6) w = 140;
      else if (aspect <= 0.9) w = 125;
      else if (aspect <= 1.25) w = 110;
      else w = 90;
      w = Math.max(40, Math.min(160, w, lastImg.naturalWidth || 160));
      widthEl.value = w;
      box.querySelector("#width-label").textContent = w;

      box.querySelector("#contrast").value = 100;
      box.querySelector("#contrast-label").textContent = "100%";
      box.querySelector("#brightness").value = 0;
      box.querySelector("#brightness-label").textContent = "0";
      box.querySelector("#dither").checked = a.tones >= 6;

      box.querySelector("#auto-note").textContent = "✨ Auto-optimized: " + STYLE_NAME[style]
        + " · " + w + " chars wide"
        + (colorful ? " · full color" : " · B&W")
        + (a.tones >= 6 ? " · dither on" : " · dither off")
        + " — tweak any control to override.";
      convert();
    }

    function convert() {
      if (!lastImg) return;
      var ramp = RAMP[box.querySelector("#style").value];
      var L = ramp.length;
      var w = Number(widthEl.value);
      var aspect = lastImg.naturalHeight / lastImg.naturalWidth;
      var h = Math.max(1, Math.round(w * aspect * 0.5));
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(lastImg, 0, 0, w, h);
      var data = ctx.getImageData(0, 0, w, h).data;
      var n = w * h;
      var gray = new Float32Array(n);
      var rgb = new Uint8ClampedArray(n * 3);
      var contrast = Number(box.querySelector("#contrast").value) / 100;
      var bright = Number(box.querySelector("#brightness").value) / 100;
      var invert = box.querySelector("#invert").checked;
      var colorMode = box.querySelector("#color").value;

      // Perceptual luminance + pixel color, alpha composited onto white
      for (var i = 0; i < n; i++) {
        var p = i * 4;
        var a = data[p + 3] / 255;
        var r = data[p] * a + 255 * (1 - a);
        var g = data[p + 1] * a + 255 * (1 - a);
        var b = data[p + 2] * a + 255 * (1 - a);
        gray[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        rgb[i * 3] = r; rgb[i * 3 + 1] = g; rgb[i * 3 + 2] = b;
      }

      // Auto-levels: stretch the darkest..brightest range across the full ramp
      var mn = 255, mx = 0;
      for (var j = 0; j < n; j++) {
        if (gray[j] < mn) mn = gray[j];
        if (gray[j] > mx) mx = gray[j];
      }
      if (mx - mn > 8) {
        var span = mx - mn;
        for (var k = 0; k < n; k++) gray[k] = (gray[k] - mn) / span * 255;
      }

      // Contrast (pivot 128) + brightness
      for (var m = 0; m < n; m++) {
        gray[m] = (gray[m] - 128) * contrast + 128 + bright * 255;
      }

      var dither = box.querySelector("#dither").checked;
      var err = dither ? new Float32Array(n) : null;
      var ci = new Uint8Array(n); // ramp index per cell (dither-aware)
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var idx = y * w + x;
          var v = Math.max(0, Math.min(255, gray[idx] + (err ? err[idx] : 0)));
          // bright pixel → low ramp index (light char); dark → high index (dark char)
          var c = L - 1 - Math.round((v / 255) * (L - 1));
          if (invert) c = L - 1 - c;
          if (c < 0) c = 0;
          if (c >= L) c = L - 1;
          ci[idx] = c;
          if (err) {
            var q = Math.round((v / 255) * (L - 1)) / (L - 1) * 255;
            var e = v - q;
            if (x + 1 < w) err[idx + 1] += e * 7 / 16;
            if (y + 1 < h) {
              if (x > 0) err[idx + w - 1] += e * 3 / 16;
              err[idx + w] += e * 5 / 16;
              if (x + 1 < w) err[idx + w + 1] += e * 1 / 16;
            }
          }
        }
      }

      if (colorMode === "off") {
        var lines = [];
        for (var ly = 0; ly < h; ly++) {
          var line = "";
          for (var lx = 0; lx < w; lx++) line += ramp[ci[ly * w + lx]];
          lines.push(line);
        }
        lastPlain = lines.join("\n");
        outEl.textContent = lastPlain;
        box.querySelector("#copy-html").style.display = "none";
        return;
      }

      /* Colored output (ascii-image-converter style): each character is drawn
         with the pixel's own color, so the art keeps the photo's colors.
         Consecutive same-color chars are merged into one span for perf. */
      var html = "";
      lastPlain = "";
      for (var cy = 0; cy < h; cy++) {
        var runColor = null, run = "", runPlain = "";
        for (var cx = 0; cx < w; cx++) {
          var i2 = cy * w + cx;
          var ch = ramp[ci[i2]];
          runPlain += ch;
          var cr = rgb[i2 * 3], cg = rgb[i2 * 3 + 1], cb = rgb[i2 * 3 + 2];
          if (invert) { cr = 255 - cr; cg = 255 - cg; cb = 255 - cb; }
          if (colorMode === "gray") {
            var l = Math.round(0.2126 * cr + 0.7152 * cg + 0.0722 * cb);
            cr = l; cg = l; cb = l;
          }
          var key = cr + "," + cg + "," + cb;
          if (key !== runColor) {
            if (run) html += '<span style="color:rgb(' + runColor + ')">' + ToolBox.esc(run) + "</span>";
            runColor = key;
            run = ch;
          } else {
            run += ch;
          }
        }
        if (run) html += '<span style="color:rgb(' + runColor + ')">' + ToolBox.esc(run) + "</span>";
        html += "\n";
        lastPlain += runPlain + "\n";
      }
      lastPlain = lastPlain.replace(/\n$/, "");
      outEl.innerHTML = html;
      box.querySelector("#copy-html").style.display = "";
    }

    drop.addEventListener("click", function () { fileInput.click(); });
    drop.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); });
    });
    drop.addEventListener("drop", function (e) {
      var f = e.dataTransfer.files[0];
      if (f) load(f);
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) load(f);
      fileInput.value = "";
    });
    /* coalesced, throttled conversion for slider drags (full conversion per tick was heavy on big images) */
    var convertQueued = false;
    var convertLast = 0;
    function scheduleConvert() {
      if (convertQueued) return;
      convertQueued = true;
      requestAnimationFrame(function () {
        convertQueued = false;
        var now = performance.now();
        if (now - convertLast < 60) { scheduleConvert(); return; }
        convertLast = now;
        convert();
      });
    }
    ["style", "contrast", "brightness", "dither", "invert", "color"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", scheduleConvert);
      box.querySelector("#" + id).addEventListener("change", convert);
    });
    widthEl.addEventListener("input", function () {
      box.querySelector("#width-label").textContent = widthEl.value;
      scheduleConvert();
    });
    box.querySelector("#contrast").addEventListener("input", function () {
      box.querySelector("#contrast-label").textContent = box.querySelector("#contrast").value + "%";
    });
    box.querySelector("#brightness").addEventListener("input", function () {
      box.querySelector("#brightness-label").textContent = box.querySelector("#brightness").value;
    });
    box.querySelector("#auto").addEventListener("click", autoTune);
    box.querySelector("#copy").addEventListener("click", function () {
      if (!lastPlain) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy ASCII"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastPlain).then(done, function () { done(); });
      } else done();
    });
    box.querySelector("#copy-html").addEventListener("click", function () {
      if (!outEl.innerHTML) return;
      function done() {
        var b = box.querySelector("#copy-html");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy colored (HTML)"; }, 1500);
      }
      var html = outEl.innerHTML;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(html).then(done, function () { done(); });
      } else done();
    });
    function load(file) {
      if (!file || file.type.indexOf("image/") !== 0) { window.alert("Please choose an image file."); return; }
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        lastImg = img;
        controls.classList.remove("hidden");
        autoTune();
      };
      img.src = lastUrl;
    }
  }
});