ToolBox.define("background-remover", {
  styles: ".bg-stage { position: relative; margin-top: 14px; } .bg-stage canvas { max-width: 100%; border-radius: 12px; border: 1px solid var(--border); display: block; cursor: crosshair; } .checker { background-image: linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%), linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%); background-size: 20px 20px; background-position: 0 0, 10px 10px; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0">🖼️ <strong>Drop an image here</strong> or click to browse<input type="file" id="file" accept="image/*" class="hidden"></div>'
      + '<div id="wrap" class="hidden" style="margin-top:16px;">'
      + '<div class="controls">'
      + '<label>Tolerance <input type="range" id="tol" min="5" max="100" value="32" style="width:150px;"> <span id="tol-label">32</span></label>'
      + '<button id="auto" class="btn">✨ Auto-remove edges</button>'
      + '<button id="undo" class="btn ghost" disabled>↺ Undo</button>'
      + '<button id="dl" class="btn primary">⬇️ Download PNG</button>'
      + "</div>"
      + '<p class="small muted" style="margin-bottom:8px;">Click any pixel to remove the connected region around it. The checkerboard shows transparency.</p>'
      + '<div class="bg-stage checker"><canvas id="cv"></canvas></div>'
      + "</div>"
      + "</div>";

    var cv = box.querySelector("#cv"), ctx = cv.getContext("2d");
    var img = null, stack = [];

    function loadFile(f) {
      if (!f || !/^image\//.test(f.type)) return;
      var reader = new FileReader();
      reader.onload = function () {
        var im = new Image();
        im.onload = function () {
          img = im;
          var scale = Math.min(1, 900 / im.width);
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

    function draw() { ctx.clearRect(0, 0, cv.width, cv.height); if (img) ctx.drawImage(img, 0, 0, cv.width, cv.height); }

    function pushState() {
      stack.push(ctx.getImageData(0, 0, cv.width, cv.height));
      if (stack.length > 20) stack.shift();
      box.querySelector("#undo").disabled = false;
    }

    function floodRemove(x, y, tol) {
      var w = cv.width, h = cv.height;
      var src = ctx.getImageData(0, 0, w, h);
      var d = src.data;
      var target = [d[(y * w + x) * 4], d[(y * w + x) * 4 + 1], d[(y * w + x) * 4 + 2]];
      // If the clicked pixel is already transparent, remove from a corner instead
      var idx = (y * w + x) * 4;
      var visited = new Uint8Array(w * h);
      var queue = [[x, y]];
      visited[y * w + x] = 1;
      var tol2 = tol * tol;
      while (queue.length) {
        var p = queue.pop();
        var pi = (p[1] * w + p[0]) * 4;
        d[pi + 3] = 0;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) {
          var nx = p[0] + o[0], ny = p[1] + o[1];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
          var vi = ny * w + nx;
          if (visited[vi]) return;
          var di = vi * 4;
          if (d[di + 3] === 0) { visited[vi] = 1; return; }
          var dr = d[di] - target[0], dg = d[di + 1] - target[1], db = d[di + 2] - target[2];
          if (dr * dr + dg * dg + db * db <= tol2) {
            visited[vi] = 1;
            queue.push([nx, ny]);
          }
        });
      }
      ctx.putImageData(src, 0, 0);
    }

    function removeEdges() {
      pushState();
      var tol = Number(box.querySelector("#tol").value);
      // sample the 4 corners and remove each connected region
      [[0, 0], [cv.width - 1, 0], [0, cv.height - 1], [cv.width - 1, cv.height - 1]].forEach(function (c) {
        var di = (c[1] * cv.width + c[0]) * 4;
        var data = ctx.getImageData(0, 0, cv.width, cv.height);
        if (data.data[di + 3] !== 0) floodRemove(c[0], c[1], tol);
      });
    }

    cv.addEventListener("click", function (e) {
      var r = cv.getBoundingClientRect();
      var x = Math.round((e.clientX - r.left) * (cv.width / r.width));
      var y = Math.round((e.clientY - r.top) * (cv.height / r.height));
      pushState();
      floodRemove(Math.max(0, Math.min(x, cv.width - 1)), Math.max(0, Math.min(y, cv.height - 1)), Number(box.querySelector("#tol").value));
    });

    box.querySelector("#auto").addEventListener("click", removeEdges);
    box.querySelector("#undo").addEventListener("click", function () {
      var s = stack.pop();
      if (s) ctx.putImageData(s, 0, 0);
      box.querySelector("#undo").disabled = !stack.length;
    });
    box.querySelector("#tol").addEventListener("input", function () { box.querySelector("#tol-label").textContent = box.querySelector("#tol").value; });
    box.querySelector("#dl").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = cv.toDataURL("image/png");
      a.download = "no-background.png";
      a.click();
    });

    box.querySelector("#file").addEventListener("change", function () { loadFile(box.querySelector("#file").files[0]); box.querySelector("#file").value = ""; });
    var drop = box.querySelector("#drop");
    drop.addEventListener("click", function () { box.querySelector("#file").click(); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
  }
});