ToolBox.define("mockup-generator", {
  styles: ".mock-stage { margin-top: 14px; } .mock-stage canvas { max-width: 100%; border-radius: 12px; border: 1px solid var(--border); }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🖼️ <strong>Drop a screenshot here</strong> or click to browse<input type="file" id="file" accept="image/*" class="hidden"></div>'
      + '<div id="wrap" class="hidden" style="margin-top:16px;">'
      + '<div class="controls">'
      + '<label>Device <select id="device"><option value="phone">📱 Phone</option><option value="laptop">💻 Laptop</option></select></label>'
      + '<label>Background <input type="color" id="bg" value="#0f1a2a"></label>'
      + '<label>Padding <input type="range" id="pad" min="10" max="120" value="48" style="width:140px;"></label>'
      + '<button id="dl" class="btn primary">⬇️ Download PNG</button>'
      + "</div>"
      + '<div class="mock-stage center"><canvas id="cv"></canvas></div>'
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
          box.querySelector("#drop").classList.add("hidden");
          box.querySelector("#wrap").classList.remove("hidden");
          draw();
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(f);
    }

    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function draw() {
      if (!img) return;
      var device = box.querySelector("#device").value;
      var pad = Number(box.querySelector("#pad").value);
      var bg = box.querySelector("#bg").value;
      var iw = img.width, ih = img.height;
      var screenRatio = iw / ih;
      var screenW, screenH, bezel, frameW, frameH, scale = 1;
      if (device === "phone") {
        // fit screen to a 9:19-ish phone
        var targetW = 380, targetH = Math.round(targetW / (iw / ih));
        targetH = Math.min(targetH, Math.round(targetW * 2.1));
        // recompute width for the capped height
        if (targetH > targetW * 2.1) { targetH = Math.round(targetW * 2.1); targetW = Math.round(targetH * screenRatio); }
        bezel = 14;
        screenW = targetW; screenH = targetH;
      } else {
        var lw = 680, lh = Math.round(lw / screenRatio);
        lh = Math.min(lh, Math.round(lw * 0.72));
        if (lh < Math.round(lw * 0.5)) lh = Math.round(lw * 0.5);
        screenW = lw; screenH = lh;
        bezel = 12;
      }
      frameW = screenW + bezel * 2;
      frameH = screenH + bezel * 2 + (device === "phone" ? 34 : 26);
      var totalW = frameW + pad * 2, totalH = frameH + pad * 2;
      var maxW = 760;
      scale = Math.min(1, maxW / totalW);
      cv.width = Math.round(totalW * scale);
      cv.height = Math.round(totalH * scale);
      ctx.save();
      ctx.scale(scale, scale);
      // background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, totalW, totalH);
      var fx = pad, fy = pad;
      // device body
      ctx.fillStyle = "#111318";
      rr(fx, fy, frameW, frameH, device === "phone" ? 42 : 18);
      ctx.fill();
      // screen
      var sx = fx + bezel, sy = fy + bezel;
      rr(sx, sy, screenW, screenH, device === "phone" ? 6 : 4);
      ctx.save();
      ctx.clip();
      ctx.drawImage(img, sx, sy, screenW, screenH);
      ctx.restore();
      if (device === "phone") {
        // notch + home indicator
        ctx.fillStyle = "#111318";
        rr(sx + screenW * 0.32, sy + 8, screenW * 0.36, 16, 8);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.35)";
        rr(sx + screenW / 2 - 40, sy + screenH - 8, 80, 4, 2);
        ctx.fill();
      } else {
        // laptop base
        ctx.fillStyle = "#1b1d22";
        rr(fx - 6, fy + frameH, frameW + 12, 14, 6);
        ctx.fill();
        ctx.fillStyle = "#2a2d34";
        rr(fx + 60, fy + frameH + 4, frameW - 120, 6, 3);
        ctx.fill();
      }
      ctx.restore();
    }

    box.querySelector("#file").addEventListener("change", function () { loadFile(box.querySelector("#file").files[0]); box.querySelector("#file").value = ""; });
    var drop = box.querySelector("#drop");
    drop.addEventListener("click", function () { box.querySelector("#file").click(); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
    ["device", "bg", "pad"].forEach(function (id) {
      var el = box.querySelector("#" + id);
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", draw);
    });
    box.querySelector("#dl").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = cv.toDataURL("image/png");
      a.download = "mockup.png";
      a.click();
    });
  }
});