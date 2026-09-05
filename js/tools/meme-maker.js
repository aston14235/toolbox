ToolBox.define("meme-maker", {
  styles: ".meme-canvas { max-width: 100%; border-radius: 12px; border: 1px solid var(--border); display: block; margin-top: 12px; } .meme-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; } @media (max-width: 720px) { .meme-controls { grid-template-columns: 1fr; } } .meme-zone { border: 2px dashed var(--border); border-radius: 14px; padding: 26px; text-align: center; cursor: pointer; transition: border-color .2s ease, background .2s ease; } .meme-zone:hover, .meme-zone.drag { border-color: var(--accent); background: var(--accent-soft); }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="meme-zone" id="zone">🖼️ <strong>Click to upload an image</strong> — or drag &amp; drop one here.<div class="small muted" style="margin-top:4px;">Works best with a square-ish photo (meme format).</div></div>'
      + '<input type="file" id="file" accept="image/*" class="hidden">'
      + '<canvas class="meme-canvas hidden" id="canvas"></canvas>'
      + '<div class="meme-controls hidden" id="controls">'
      + '<div class="field" style="margin-bottom:0;"><label>Top text</label><input type="text" id="top" placeholder="When someone asks what this tool does" maxlength="80"></div>'
      + '<div class="field" style="margin-bottom:0;"><label>Bottom text</label><input type="text" id="bottom" placeholder="you just drop the image and type" maxlength="80"></div>'
      + "</div>"
      + '<div class="controls hidden" id="row2" style="margin-top:14px;">'
      + '<label>Font size <input type="range" id="size" min="24" max="90" value="44" style="width:140px;"></label>'
      + '<label><input type="checkbox" id="outline" checked> Classic black outline</label>'
      + '<button class="btn primary" type="button" id="save">⬇️ Download PNG</button>'
      + "</div>"
      + "</div>";

    var zone = box.querySelector("#zone"), file = box.querySelector("#file");
    var canvas = box.querySelector("#canvas"), ctx = canvas.getContext("2d");
    var img = null;
    var MAXW = 1000, MAXH = 640;

    function draw() {
      if (!img) return;
      var scale = Math.min(MAXW / img.width, MAXH / img.height, 1);
      var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      canvas.width = w; canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      var top = box.querySelector("#top").value;
      var bottom = box.querySelector("#bottom").value;
      var size = Number(box.querySelector("#size").value);
      var outline = box.querySelector("#outline").checked;
      var lines = function (text) { return text.split("\n").filter(function (l) { return l.trim(); }); };
      function paint(texts, yPos, dir) {
        texts.forEach(function (t, i) {
          ctx.font = "900 " + size + "px Arial, sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          var y = yPos + dir * (size / 2 + i * size);
          if (outline) {
            ctx.lineWidth = Math.max(3, size / 9);
            ctx.strokeStyle = "#000";
            ctx.lineJoin = "round";
            ctx.strokeText(t, w / 2, y);
          }
          ctx.fillStyle = "#fff";
          ctx.fillText(t, w / 2, y);
        });
      }
      paint(lines(top), 12, 1);
      paint(lines(bottom), h - 12, -1);
    }

    function loadFile(f) {
      if (!f || !/^image\//.test(f.type)) return;
      var reader = new FileReader();
      reader.onload = function () {
        var im = new Image();
        im.onload = function () {
          img = im;
          zone.classList.add("hidden");
          canvas.classList.remove("hidden");
          box.querySelector("#controls").classList.remove("hidden");
          box.querySelector("#row2").classList.remove("hidden");
          draw();
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(f);
    }

    zone.addEventListener("click", function () { file.click(); });
    file.addEventListener("change", function () { loadFile(file.files[0]); });
    ["dragenter", "dragover"].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("drag"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("drag"); });
    });
    zone.addEventListener("drop", function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) loadFile(f);
    });
    box.querySelector("#top").addEventListener("input", draw);
    box.querySelector("#bottom").addEventListener("input", draw);
    box.querySelector("#size").addEventListener("input", draw);
    box.querySelector("#outline").addEventListener("change", draw);
    box.querySelector("#save").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "meme.png";
      a.click();
    });
  }
});