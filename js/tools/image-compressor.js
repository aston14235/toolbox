ToolBox.define("image-compressor", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose an image">'
      + '<span class="dz-icon">🖼️</span><strong>Drop an image here</strong> or click to browse'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + "</div>"
      + '<div id="controls" class="hidden" style="margin-top:20px;">'
      + '<div class="controls">'
      + '<label>Format <select id="format">'
      + '<option value="image/jpeg">JPEG</option>'
      + '<option value="image/webp">WebP</option>'
      + '<option value="image/png">PNG (lossless)</option>'
      + "</select></label>"
      + '<label>Quality <input type="range" id="quality" min="10" max="100" value="80"> <span id="quality-label">80%</span></label>'
      + '<label>Max width <select id="max-width">'
      + '<option value="0">Original</option>'
      + '<option value="1920">1920 px</option>'
      + '<option value="1280">1280 px</option>'
      + '<option value="800">800 px</option>'
      + "</select></label>"
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="orig-size">—</div><div class="label">Original size</div></div>'
      + '<div class="stat"><div class="num" id="new-size">—</div><div class="label">New size</div></div>'
      + '<div class="stat"><div class="num" id="saved">—</div><div class="label">Saved</div></div>'
      + '<div class="stat"><div class="num" id="dims">—</div><div class="label">Dimensions</div></div>'
      + "</div>"
      + '<img id="preview" class="preview-img" alt="Preview of your image">'
      + '<div class="controls" style="margin-top:16px;"><button id="download" class="btn primary">⬇️ Download compressed</button></div>'
      + "</div></div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var controls = box.querySelector("#controls");
    var formatSel = box.querySelector("#format");
    var qualityEl = box.querySelector("#quality");
    var qualityLabel = box.querySelector("#quality-label");
    var maxWidthSel = box.querySelector("#max-width");
    var preview = box.querySelector("#preview");
    var downloadBtn = box.querySelector("#download");
    var source = null;
    var outputBlob = null;

    function fmtSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    function compress() {
      if (!source) return;
      var img = source.img;
      var maxW = Number(maxWidthSel.value) || img.naturalWidth;
      var w = Math.min(img.naturalWidth, maxW);
      var h = Math.round(img.naturalHeight * (w / img.naturalWidth));
      var mime = formatSel.value;
      var quality = Number(qualityEl.value) / 100;
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      if (mime === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(img, 0, 0, w, h);
      function onBlob(blob) {
        outputBlob = blob;
        preview.src = URL.createObjectURL(blob);
        box.querySelector("#new-size").textContent = fmtSize(blob.size);
        var pct = source.size > 0 ? Math.max(0, Math.round((1 - blob.size / source.size) * 100)) : 0;
        box.querySelector("#saved").textContent = pct + "%";
        downloadBtn.disabled = false;
      }
      if (mime === "image/png") canvas.toBlob(onBlob, mime);
      else canvas.toBlob(onBlob, mime, quality);
    }

    function loadFile(file) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) {
        window.alert("Please choose an image file.");
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          source = { name: file.name, size: file.size, img: img };
          box.querySelector("#orig-size").textContent = fmtSize(file.size);
          box.querySelector("#dims").textContent = img.naturalWidth + " × " + img.naturalHeight;
          controls.classList.remove("hidden");
          compress();
        };
        img.onerror = function () { window.alert("Could not read that image."); };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
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

    formatSel.addEventListener("change", compress);
    qualityEl.addEventListener("input", function () {
      qualityLabel.textContent = qualityEl.value + "%";
      compress();
    });
    maxWidthSel.addEventListener("change", compress);

    downloadBtn.addEventListener("click", function () {
      if (!outputBlob) return;
      var ext = formatSel.value === "image/png" ? "png" : formatSel.value === "image/webp" ? "webp" : "jpg";
      var base = (source ? source.name.replace(/\.[^.]+$/, "") : "image") + "-compressed";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(outputBlob);
      a.download = base + "." + ext;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    });
  }
});