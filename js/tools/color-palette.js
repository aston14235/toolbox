ToolBox.define("color-palette", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose an image">'
      + '<span class="dz-icon">🎨</span><strong>Drop an image here</strong> or click to browse'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + "</div>"
      + '<div id="controls" class="hidden" style="margin-top:20px;">'
      + '<div class="controls">'
      + '<label>Colors <select id="count">'
      + '<option value="5">5</option><option value="10" selected>10</option><option value="15">15</option><option value="20">20</option>'
      + "</select></label>"
      + "</div>"
      + '<div class="swatches" id="swatches"></div>'
      + '<p id="hint" class="muted small" style="margin-top:8px;">Click a swatch to copy its hex code.</p>'
      + '<img id="preview" class="preview-img" alt="Source image">'
      + "</div></div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var controls = box.querySelector("#controls");
    var swatchesEl = box.querySelector("#swatches");
    var countEl = box.querySelector("#count");
    var preview = box.querySelector("#preview");

    function hex(c) {
      function h(x) { return ("0" + x.toString(16)).slice(-2); }
      return "#" + h(c[0]) + h(c[1]) + h(c[2]);
    }

    function extract(img) {
      var size = 120;
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      var data = ctx.getImageData(0, 0, size, size).data;
      var buckets = {};
      for (var i = 0; i < data.length; i += 4) {
        var key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
        if (!buckets[key]) buckets[key] = { n: 0, r: 0, g: 0, b: 0 };
        buckets[key].n++;
        buckets[key].r += data[i];
        buckets[key].g += data[i + 1];
        buckets[key].b += data[i + 2];
      }
      var list = Object.keys(buckets).map(function (k) { return buckets[k]; })
        .sort(function (a, b) { return b.n - a.n; });
      var colors = list.slice(0, Number(countEl.value)).map(function (b) {
        var r = Math.round(b.r / b.n), g = Math.round(b.g / b.n), bl = Math.round(b.b / b.n);
        return [r, g, bl];
      });
      swatchesEl.innerHTML = "";
      colors.forEach(function (c) {
        var s = document.createElement("button");
        s.className = "swatch lg";
        s.style.background = hex(c);
        s.title = hex(c);
        s.setAttribute("aria-label", "Color " + hex(c));
        s.addEventListener("click", function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(hex(c)).then(function () {
              box.querySelector("#hint").textContent = "Copied " + hex(c) + " ✓";
              setTimeout(function () { box.querySelector("#hint").textContent = "Click a swatch to copy its hex code."; }, 1500);
            });
          }
        });
        swatchesEl.appendChild(s);
      });
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
    countEl.addEventListener("change", function () {
      if (lastImg) extract(lastImg);
    });
    var lastImg = null;
    function load(file) {
      if (!file || file.type.indexOf("image/") !== 0) { window.alert("Please choose an image file."); return; }
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          lastImg = img;
          preview.src = reader.result;
          controls.classList.remove("hidden");
          extract(img);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
});