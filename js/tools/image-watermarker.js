ToolBox.define("image-watermarker", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🖼️ <strong>Drop an image here</strong> or click to browse<input type="file" id="file" accept="image/*" class="hidden"></div>'
      + '<div id="wrap" class="hidden" style="margin-top:16px;">'
      + '<div class="field"><label>Watermark text</label><input type="text" id="text" value="© Your Name" style="padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);"></div>'
      + '<div class="split">'
      + '<div class="field"><label>Position</label><select id="pos">'
      + '<option value="se">Bottom right</option><option value="sw">Bottom left</option>'
      + '<option value="ne">Top right</option><option value="nw">Top left</option>'
      + '<option value="c">Center</option><option value="tile">Tile across</option>'
      + "</select></div>"
      + '<div class="field"><label>Size</label><input type="range" id="size" min="14" max="120" value="42" style="width:100%;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Opacity <span id="op-label">45%</span></label><input type="range" id="op" min="5" max="100" value="45" style="width:100%;"></div>'
      + '<div class="field"><label>Angle (deg)</label><input type="number" id="angle" value="-20" min="-90" max="90" step="1" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="controls"><button id="dl" class="btn primary">⬇️ Download watermarked</button></div>'
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
          var scale = Math.min(1, 1200 / im.width);
          cv.width = Math.round(im.width * scale);
          cv.height = Math.round(im.height * scale);
          // sensible default text size for the image, so it never dwarfs small photos
          box.querySelector("#size").value = Math.max(18, Math.min(90, Math.round(cv.width * 0.1)));
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
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      var text = box.querySelector("#text").value;
      if (!text) return;
      var size = Number(box.querySelector("#size").value);
      var op = Number(box.querySelector("#op").value) / 100;
      var angle = Number(box.querySelector("#angle").value) || 0;
      var pos = box.querySelector("#pos").value;
      box.querySelector("#op-label").textContent = Math.round(op * 100) + "%";
      ctx.save();
      ctx.globalAlpha = op;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,.6)";
      ctx.lineWidth = Math.max(1, size / 14);
      ctx.font = "700 " + size + "px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (pos === "tile") {
        ctx.translate(cv.width / 2, cv.height / 2);
        ctx.rotate(angle * Math.PI / 180);
        var tw = ctx.measureText(text).width + 40;
        for (var y = -cv.height; y < cv.height * 2; y += size * 3.2) {
          for (var x = -cv.width; x < cv.width * 2; x += tw) {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
          }
        }
      } else {
        var pad = 30, x, y;
        var meas = ctx.measureText(text).width;
        if (pos === "se") { x = cv.width - meas / 2 - pad; y = cv.height - pad; }
        else if (pos === "sw") { x = meas / 2 + pad; y = cv.height - pad; }
        else if (pos === "ne") { x = cv.width - meas / 2 - pad; y = pad; }
        else if (pos === "nw") { x = meas / 2 + pad; y = pad; }
        else { x = cv.width / 2; y = cv.height / 2; }
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.strokeText(text, 0, 0);
        ctx.fillText(text, 0, 0);
      }
      ctx.restore();
    }

    box.querySelector("#file").addEventListener("change", function () { loadFile(box.querySelector("#file").files[0]); box.querySelector("#file").value = ""; });
    var drop = box.querySelector("#drop");
    drop.addEventListener("click", function () { box.querySelector("#file").click(); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
    ["text", "size", "op", "angle", "pos"].forEach(function (id) {
      var el = box.querySelector("#" + id);
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", draw);
    });
    box.querySelector("#dl").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = cv.toDataURL("image/png");
      a.download = "watermarked.png";
      a.click();
    });
  }
});