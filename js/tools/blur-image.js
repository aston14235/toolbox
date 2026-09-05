ToolBox.define("blur-image", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🖼️ <strong>Drop an image here</strong> or click to browse<input type="file" id="file" accept="image/*" class="hidden"></div>'
      + '<div id="wrap" class="hidden" style="margin-top:16px;">'
      + '<div class="controls">'
      + '<label>Blur <input type="range" id="amt" min="0" max="60" value="8" style="width:180px;"> <span id="amt-label">8px</span></label>'
      + '<label><input type="checkbox" id="pixelate" checked> Pixelate (instead of blur)</label>'
      + '<button id="dl" class="btn primary">⬇️ Download</button>'
      + "</div>"
      + '<div class="canvas-wrap"><canvas id="cv"></canvas></div>'
      + "</div>"
      + "</div>";

    var cv = box.querySelector("#cv"), ctx = cv.getContext("2d");
    var img = null;

    function loadFile(f) {
      if (!f || !/^image\//.test(f.type)) return;
      var reader = new FileReader();
      reader.onload = function () {
        var im = new Image();
        im.onload = function () {
          img = im;
          var scale = Math.min(1, 1000 / im.width);
          cv.width = Math.round(im.width * scale);
          cv.height = Math.round(im.height * scale);
          box.querySelector("#drop").classList.add("hidden");
          box.querySelector("#wrap").classList.remove("hidden");
          draw();
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(f);
    }

    function draw() {
      if (!img) return;
      var amt = Number(box.querySelector("#amt").value);
      box.querySelector("#amt-label").textContent = amt + "px";
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (box.querySelector("#pixelate").checked && amt > 0) {
        // cheap pixelation: draw small then upscale with nearest-neighbor
        var px = Math.max(2, Math.round(amt / 3));
        var sw = Math.max(1, Math.round(cv.width / px)), sh = Math.max(1, Math.round(cv.height / px));
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, sw, sh);
        ctx.drawImage(cv, 0, 0, sw, sh, 0, 0, cv.width, cv.height);
        ctx.imageSmoothingEnabled = true;
      } else {
        ctx.filter = "blur(" + amt + "px)";
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        ctx.filter = "none";
      }
    }

    box.querySelector("#file").addEventListener("change", function () { loadFile(box.querySelector("#file").files[0]); box.querySelector("#file").value = ""; });
    var drop = box.querySelector("#drop");
    drop.addEventListener("click", function () { box.querySelector("#file").click(); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
    box.querySelector("#amt").addEventListener("input", draw);
    box.querySelector("#pixelate").addEventListener("change", draw);
    box.querySelector("#dl").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = cv.toDataURL("image/png");
      a.download = "blurred.png";
      a.click();
    });
  }
});