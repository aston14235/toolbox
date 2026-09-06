ToolBox.define("spiral-art", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Spiral <select id="type"><option value="archimedean" selected>Archimedean</option><option value="logarithmic">Logarithmic</option><option value="fermat">Fermat</option></select></label>'
      + '<label>Rotations <input type="range" id="rot" min="1" max="20" value="6"></label>'
      + '<label>Thickness <input type="range" id="width" min="1" max="8" value="2"></label>'
      + '<input type="color" id="color" value="#0088ff" title="Spiral color">'
      + '<button id="play" class="btn primary">▶️ Animate</button>'
      + '<button id="save" class="btn">⬇️ Save PNG</button>'
      + "</div>"
      + '<div class="canvas-wrap"><canvas id="cv" width="700" height="700"></canvas></div>'
      + '<p class="note-box">Three classic spirals drawn point by point. Hit <strong>Animate</strong> to watch it draw itself, or just save the finished piece.</p>'
      + "</div>";

    var canvas = box.querySelector("#cv");
    var ctx = canvas.getContext("2d");
    var W = 700, H = 700, CX = W / 2, CY = H / 2;
    var anim = null;

    function points() {
      var type = box.querySelector("#type").value;
      var rot = +box.querySelector("#rot").value;
      var maxR = Math.min(W, H) / 2 - 24;
      var steps = 60 * rot;
      var out = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var th = t * Math.PI * 2 * rot;
        var r;
        if (type === "logarithmic") {
          var b = 0.14;
          r = maxR * (Math.exp(b * th) - 1) / (Math.exp(b * Math.PI * 2 * rot) - 1);
        } else if (type === "fermat") {
          r = maxR * Math.sqrt(th / (Math.PI * 2 * rot));
        } else {
          r = maxR * t;
        }
        out.push({ x: CX + r * Math.cos(th), y: CY + r * Math.sin(th) });
      }
      return out;
    }

    function drawUpTo(pts, n) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = box.querySelector("#color").value;
      ctx.lineWidth = +box.querySelector("#width").value;
      ctx.lineCap = "round";
      ctx.beginPath();
      var end = Math.min(Math.floor(n), pts.length - 1);
      for (var i = 0; i <= end; i++) {
        if (i === 0) ctx.moveTo(pts[i].x, pts[i].y);
        else ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    function drawAll() { drawUpTo(points(), 1e9); }
    function stop() {
      if (anim) { cancelAnimationFrame(anim); anim = null; }
      var b = box.querySelector("#play");
      b.textContent = "▶️ Animate";
      b.classList.add("primary");
    }

    box.querySelector("#play").addEventListener("click", function () {
      if (anim) { stop(); return; }
      var b = box.querySelector("#play");
      b.textContent = "⏸️ Stop";
      b.classList.remove("primary");
      var pts = points();
      var n = 0;
      var lastT = 0, started = false;
      function step(t) {
        /* first frame only seeds the clock — rAF timestamps are ms since page load,
           so subtracting a zero lastT would jump the whole spiral in one frame */
        if (!started) { started = true; lastT = t; anim = requestAnimationFrame(step); return; }
        n += (t - lastT) * 0.5;
        lastT = t;
        drawUpTo(pts, n);
        if (n < pts.length) anim = requestAnimationFrame(step);
        else stop();
      }
      anim = requestAnimationFrame(step);
    });
    box.querySelector("#save").addEventListener("click", function () {
      var a = document.createElement("a");
      a.download = "spiral-art.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
    ["type", "rot", "width", "color"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", function () {
        stop();
        drawAll();
      });
    });
    drawAll();
  }
});