ToolBox.define("image-cropper", {
  styles: ".crop-stage { position: relative; margin-top: 14px; } .crop-stage canvas { max-width: 100%; border-radius: 12px; border: 1px solid var(--border); display: block; touch-action: none; } .crop-box { position: absolute; border: 2px dashed rgba(56,182,255,.9); box-shadow: 0 0 0 9999px rgba(0,0,0,.55); cursor: move; } .crop-box .handle { position: absolute; width: 14px; height: 14px; background: #38b6ff; border: 2px solid #fff; border-radius: 4px; } .crop-box .nw { top:-8px; left:-8px; cursor:nwse-resize; } .crop-box .ne { top:-8px; right:-8px; cursor:nesw-resize; } .crop-box .sw { bottom:-8px; left:-8px; cursor:nesw-resize; } .crop-box .se { bottom:-8px; right:-8px; cursor:nwse-resize; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🖼️ <strong>Drop an image here</strong> or click to browse<input type="file" id="file" accept="image/*" class="hidden"></div>'
      + '<div id="stage-wrap" class="hidden">'
      + '<div class="controls" style="margin-top:12px;">'
      + '<label>Aspect <select id="aspect"><option value="free">Free</option><option value="1">1:1</option><option value="4:3">4:3</option><option value="3:2">3:2</option><option value="16:9">16:9</option><option value="9:16">9:16 (story)</option></select></label>'
      + '<button id="crop" class="btn primary">✂️ Crop</button>'
      + '<button id="dl" class="btn" disabled>⬇️ Download</button>'
      + "</div>"
      + '<div class="crop-stage" id="stage"><canvas id="cv"></canvas></div>'
      + '<div class="stats"><div class="stat"><div class="num" id="dims">—</div><div class="label">Result</div></div></div>'
      + "</div>"
      + "</div>";

    var file = box.querySelector("#file"), drop = box.querySelector("#drop"), stage = box.querySelector("#stage");
    var cv = box.querySelector("#cv"), ctx = cv.getContext("2d");
    var img = null, boxEl = null, drag = null, resultBlob = null;

    function loadFile(f) {
      if (!f || !/^image\//.test(f.type)) return;
      var reader = new FileReader();
      reader.onload = function () {
        var im = new Image();
        im.onload = function () {
          img = im;
          drop.classList.add("hidden");
          box.querySelector("#stage-wrap").classList.remove("hidden");
          fitStage();
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(f);
    }

    function fitStage() {
      var scale = Math.min(1, 760 / img.width);
      cv.width = Math.round(img.width * scale);
      cv.height = Math.round(img.height * scale);
      drawImage();
      makeBox(0, 0, cv.width, cv.height);
    }

    function drawImage() { ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height); }

    function makeBox(x, y, w, h) {
      if (boxEl) boxEl.remove();
      boxEl = document.createElement("div");
      boxEl.className = "crop-box";
      ["nw", "ne", "sw", "se"].forEach(function (hnd) { var s = document.createElement("span"); s.className = "handle " + hnd; boxEl.appendChild(s); });
      stage.appendChild(boxEl);
      placeBox(x, y, w, h);
      wireBox();
    }

    function placeBox(x, y, w, h) {
      x = Math.max(0, Math.min(x, cv.width)); y = Math.max(0, Math.min(y, cv.height));
      w = Math.max(20, Math.min(w, cv.width - x)); h = Math.max(20, Math.min(h, cv.height - y));
      boxEl.style.left = x + "px"; boxEl.style.top = y + "px"; boxEl.style.width = w + "px"; boxEl.style.height = h + "px";
    }

    function wireBox() {
      boxEl.addEventListener("mousedown", function (e) {
        var t = e.target;
        var mode = t.classList.contains("handle") ? t.className.split(" ")[1] : "move";
        e.preventDefault();
        var startX = e.clientX, startY = e.clientY;
        var bx = parseFloat(boxEl.style.left), by = parseFloat(boxEl.style.top), bw = parseFloat(boxEl.style.width), bh = parseFloat(boxEl.style.height);
        var aspect = box.querySelector("#aspect").value;
        var ratio = aspect === "free" ? null : aspect.split(":").map(Number)[0] / aspect.split(":").map(Number)[1];
        function move(ev) {
          var dx = ev.clientX - startX, dy = ev.clientY - startY;
          var x = bx, y = by, w = bw, h = bh;
          if (mode === "move") { x = bx + dx; y = by + dy; }
          else if (mode === "se") { w = bw + dx; h = bh + dy; }
          else if (mode === "nw") { x = bx + dx; y = by + dy; w = bw - dx; h = bh - dy; }
          else if (mode === "ne") { y = by + dy; w = bw + dx; h = bh - dy; }
          else if (mode === "sw") { x = bx + dx; w = bw - dx; h = bh + dy; }
          if (ratio) {
            var nw2 = Math.max(w, h * ratio);
            if (mode === "move") { w = nw2; h = nw2 / ratio; }
            else { w = nw2; h = nw2 / ratio; if (mode === "nw" || mode === "sw") x = bx + bw - w; if (mode === "ne" || mode === "sw") y = by + bh - h; if (mode === "nw" || mode === "ne") y = by + bh - h; }
          }
          placeBox(x, y, w, h);
        }
        function up() { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      });
    }

    box.querySelector("#aspect").addEventListener("change", function () {
      var b = boxEl.getBoundingClientRect();
      // re-apply aspect from current center
      var a = box.querySelector("#aspect").value;
      if (a !== "free") {
        var ratio = a.split(":").map(Number)[0] / a.split(":").map(Number)[1];
        var w = parseFloat(boxEl.style.width), h = parseFloat(boxEl.style.height);
        var nw2 = Math.max(w, h * ratio), nh = nw2 / ratio;
        var cx = parseFloat(boxEl.style.left) + w / 2, cy = parseFloat(boxEl.style.top) + h / 2;
        placeBox(cx - nw2 / 2, cy - nh / 2, nw2, nh);
      }
    });

    box.querySelector("#crop").addEventListener("click", function () {
      if (!img || !boxEl) return;
      var sx = parseFloat(boxEl.style.left), sy = parseFloat(boxEl.style.top);
      var sw = parseFloat(boxEl.style.width), sh = parseFloat(boxEl.style.height);
      var scale = img.width / cv.width;
      var out = document.createElement("canvas");
      out.width = Math.max(1, Math.round(sw * scale));
      out.height = Math.max(1, Math.round(sh * scale));
      out.getContext("2d").drawImage(img, sx * scale, sy * scale, sw * scale, sh * scale, 0, 0, out.width, out.height);
      out.toBlob(function (blob) { resultBlob = blob; box.querySelector("#dl").disabled = false; }, "image/png");
      box.querySelector("#dims").textContent = out.width + " × " + out.height;
    });

    box.querySelector("#dl").addEventListener("click", function () {
      if (!resultBlob) return;
      var a = document.createElement("a");
      a.href = URL.createObjectURL(resultBlob);
      a.download = "cropped.png";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });

    drop.addEventListener("click", function () { file.click(); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
    file.addEventListener("change", function () { loadFile(file.files[0]); file.value = ""; });
  }
});