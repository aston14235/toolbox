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
      + '<label>Style <select id="style"><option value="classic" selected>Classic</option><option value="fine">Fine</option><option value="blocky">Blocky</option></select></label>'
      + '<label>Width <input type="range" id="width" min="40" max="220" value="120"> <span id="width-label">120</span></label>'
      + '<label>Contrast <input type="range" id="contrast" min="0" max="200" value="100"> <span id="contrast-label">100%</span></label>'
      + '<label>Brightness <input type="range" id="brightness" min="-60" max="60" value="0"> <span id="brightness-label">0</span></label>'
      + "</div>"
      + '<div class="controls" style="margin-top:4px;">'
      + '<label>Dither <input type="checkbox" id="dither" checked></label>'
      + '<label>Invert <input type="checkbox" id="invert"></label>'
      + "</div>"
      + '<div class="ascii-out" id="out" aria-label="ASCII art output"></div>'
      + '<div class="controls" style="margin-top:14px;"><button id="copy" class="btn primary">📋 Copy ASCII</button></div>'
      + "</div></div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var controls = box.querySelector("#controls");
    var outEl = box.querySelector("#out");
    var widthEl = box.querySelector("#width");
    var lastImg = null;
    var lastUrl = null;
    var RAMP = {
      classic: " .:-=+*#%@",
      fine: " .,:;irsXA253hMHGS#9B&@",
      blocky: " ░▒▓█"
    };

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
      var contrast = Number(box.querySelector("#contrast").value) / 100;
      var bright = Number(box.querySelector("#brightness").value) / 100;
      var invert = box.querySelector("#invert").checked;

      // Perceptual luminance, alpha composited onto white so PNGs with transparency work
      for (var i = 0; i < n; i++) {
        var p = i * 4;
        var a = data[p + 3] / 255;
        var r = data[p] * a + 255 * (1 - a);
        var g = data[p + 1] * a + 255 * (1 - a);
        var b = data[p + 2] * a + 255 * (1 - a);
        gray[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
      var lines = [];
      for (var y = 0; y < h; y++) {
        var line = "";
        for (var x = 0; x < w; x++) {
          var idx = y * w + x;
          var v = Math.max(0, Math.min(255, gray[idx] + (err ? err[idx] : 0)));
          var ci = Math.round((v / 255) * (L - 1));
          if (invert) ci = L - 1 - ci;
          if (ci < 0) ci = 0;
          if (ci >= L) ci = L - 1;
          line += ramp[ci];
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
        lines.push(line);
      }
      outEl.textContent = lines.join("\n");
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
    ["style", "contrast", "brightness", "dither", "invert"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", convert);
      box.querySelector("#" + id).addEventListener("change", convert);
    });
    widthEl.addEventListener("input", function () {
      box.querySelector("#width-label").textContent = widthEl.value;
      convert();
    });
    box.querySelector("#contrast").addEventListener("input", function () {
      box.querySelector("#contrast-label").textContent = box.querySelector("#contrast").value + "%";
    });
    box.querySelector("#brightness").addEventListener("input", function () {
      box.querySelector("#brightness-label").textContent = box.querySelector("#brightness").value;
    });
    box.querySelector("#copy").addEventListener("click", function () {
      var txt = outEl.textContent;
      if (!txt) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy ASCII"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { done(); });
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
        convert();
      };
      img.src = lastUrl;
    }
  }
});