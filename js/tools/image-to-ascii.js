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
      + '<label>Width (chars) <input type="range" id="width" min="40" max="200" value="100"> <span id="width-label">100</span></label>'
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
    var CHARS = " .:-=+*#%@";

    function convert() {
      if (!lastImg) return;
      var w = Number(widthEl.value);
      var aspect = lastImg.naturalHeight / lastImg.naturalWidth;
      var h = Math.max(1, Math.round(w * aspect * 0.5));
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(lastImg, 0, 0, w, h);
      var data = ctx.getImageData(0, 0, w, h).data;
      var lines = [];
      var invert = box.querySelector("#invert").checked;
      for (var y = 0; y < h; y++) {
        var line = "";
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          var idx = Math.floor((gray / 255) * (CHARS.length - 1));
          if (invert) idx = CHARS.length - 1 - idx;
          line += CHARS[idx];
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
    widthEl.addEventListener("input", function () {
      box.querySelector("#width-label").textContent = widthEl.value;
      convert();
    });
    box.querySelector("#invert").addEventListener("change", convert);
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
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          lastImg = img;
          controls.classList.remove("hidden");
          convert();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
});