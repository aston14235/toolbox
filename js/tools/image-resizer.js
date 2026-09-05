ToolBox.define("image-resizer", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose an image">'
      + '<span class="dz-icon">🖼️</span><strong>Drop an image here</strong> or click to browse'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + "</div>"
      + '<div id="controls" class="hidden" style="margin-top:20px;">'
      + '<div class="split">'
      + '<div class="field"><label>Width (px)</label><input type="number" id="width" min="1" value="800"></div>'
      + '<div class="field"><label>Height (px)</label><input type="number" id="height" min="1" value="600"></div>'
      + "</div>"
      + '<label class="controls"><input type="checkbox" id="keep-ratio" checked> Keep aspect ratio</label>'
      + '<div class="controls">'
      + '<label>Format <select id="format"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>'
      + '<button id="apply" class="btn primary">📐 Resize</button>'
      + '<button id="download" class="btn">⬇️ Download</button>'
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="orig">—</div><div class="label">Original</div></div>'
      + '<div class="stat"><div class="num" id="newd">—</div><div class="label">New dimensions</div></div>'
      + '<div class="stat"><div class="num" id="size">—</div><div class="label">File size</div></div>'
      + "</div>"
      + '<img id="preview" class="preview-img" alt="Resized preview">'
      + "</div></div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var controls = box.querySelector("#controls");
    var widthEl = box.querySelector("#width");
    var heightEl = box.querySelector("#height");
    var keepEl = box.querySelector("#keep-ratio");
    var formatEl = box.querySelector("#format");
    var downloadBtn = box.querySelector("#download");
    var preview = box.querySelector("#preview");
    var source = null;
    var resizedBlob = null;

    function fmtSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    function loadFile(file) {
      if (!file || file.type.indexOf("image/") !== 0) { window.alert("Please choose an image file."); return; }
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          source = { name: file.name, img: img };
          widthEl.value = img.naturalWidth;
          heightEl.value = img.naturalHeight;
          box.querySelector("#orig").textContent = img.naturalWidth + " × " + img.naturalHeight;
          controls.classList.remove("hidden");
          resize();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function resize() {
      if (!source) return;
      var w = Math.max(1, Math.round(Number(widthEl.value) || 1));
      var h = Math.max(1, Math.round(Number(heightEl.value) || 1));
      if (keepEl.checked) {
        var ratio = source.img.naturalWidth / source.img.naturalHeight;
        if (w / h > ratio) h = Math.round(w / ratio);
        else w = Math.round(h * ratio);
        widthEl.value = w;
        heightEl.value = h;
      }
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      if (formatEl.value === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(source.img, 0, 0, w, h);
      canvas.toBlob(function (blob) {
        if (!blob) return;
        resizedBlob = blob;
        preview.src = URL.createObjectURL(blob);
        box.querySelector("#newd").textContent = w + " × " + h;
        box.querySelector("#size").textContent = fmtSize(blob.size);
        downloadBtn.disabled = false;
      }, formatEl.value, 0.92);
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
      if (f) loadFile(f);
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) loadFile(f);
      fileInput.value = "";
    });

    box.querySelector("#apply").addEventListener("click", resize);
    downloadBtn.addEventListener("click", function () {
      if (!resizedBlob) return;
      var ext = formatEl.value === "image/png" ? "png" : formatEl.value === "image/webp" ? "webp" : "jpg";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(resizedBlob);
      a.download = (source ? source.name.replace(/\.[^.]+$/, "") : "image") + "-resized." + ext;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    });
  }
});