ToolBox.define("symmetry-painter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Mirror axes <select id="arms"><option value="2">2</option><option value="4" selected>4</option><option value="6">6</option><option value="8">8</option></select></label>'
      + '<label>Brush <input type="range" id="size" min="1" max="40" value="6"></label>'
      + '<input type="color" id="color" value="#0088ff" title="Brush color">'
      + '<button id="eraser" class="btn">🧽 Eraser</button>'
      + '<button id="clear" class="btn ghost">🗑️ Clear</button>'
      + '<button id="save" class="btn primary">⬇️ Save PNG</button>'
      + "</div>"
      + '<div class="canvas-wrap"><canvas id="cv" width="900" height="600"></canvas></div>'
      + '<p class="note-box">Draw and watch your strokes mirror around the center — 2, 4, 6 or 8-fold symmetry. Pick an eraser to clean up mistakes.</p>'
      + "</div>";

    var canvas = box.querySelector("#cv");
    var ctx = canvas.getContext("2d");
    var W = 900, H = 600, CX = W / 2, CY = H / 2;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);

    var drawing = false, erasing = false;
    var last = [];

    function arms() { return +box.querySelector("#arms").value; }
    function mirror(x, y) {
      var out = [];
      for (var i = 0; i < arms(); i++) {
        var a = (Math.PI * 2 * i) / arms();
        var dx = x - CX, dy = y - CY;
        out.push({
          x: CX + dx * Math.cos(a) - dy * Math.sin(a),
          y: CY + dx * Math.sin(a) + dy * Math.cos(a)
        });
      }
      return out;
    }
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    }
    function strokeTo(cur) {
      ctx.strokeStyle = erasing ? "#fff" : box.querySelector("#color").value;
      ctx.lineWidth = (erasing ? 2.2 : 1) * +box.querySelector("#size").value;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (var i = 0; i < last.length; i++) {
        ctx.moveTo(last[i].x, last[i].y);
        ctx.lineTo(cur[i].x, cur[i].y);
      }
      ctx.stroke();
    }
    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawing = true;
      last = mirror(pos(e).x, pos(e).y);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      var p = pos(e);
      var cur = mirror(p.x, p.y);
      strokeTo(cur);
      last = cur;
    });
    function end() { drawing = false; }
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);

    box.querySelector("#eraser").addEventListener("click", function () {
      erasing = !erasing;
      var b = box.querySelector("#eraser");
      b.classList.toggle("active", erasing);
      b.textContent = erasing ? "🖌️ Brush" : "🧽 Eraser";
    });
    box.querySelector("#clear").addEventListener("click", function () {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
    });
    box.querySelector("#save").addEventListener("click", function () {
      var a = document.createElement("a");
      a.download = "symmetry-art.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  }
});