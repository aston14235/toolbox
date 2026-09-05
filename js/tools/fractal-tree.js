ToolBox.define("fractal-tree", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Depth <input type="range" id="depth" min="1" max="12" value="9"></label>'
      + '<label>Branch angle <input type="range" id="angle" min="5" max="60" value="22"></label>'
      + '<label>Shrink <input type="range" id="shrink" min="50" max="90" value="70"></label>'
      + '<label>Trunk <input type="range" id="trunk" min="80" max="200" value="140"></label>'
      + '<button id="play" class="btn primary">🌱 Grow</button>'
      + '<button id="save" class="btn">⬇️ Save PNG</button>'
      + "</div>"
      + '<div class="canvas-wrap"><canvas id="cv" width="700" height="600"></canvas></div>'
      + '<p class="note-box">Recursive branches with a trunk-to-leaf gradient. Crank the depth up to 12 and watch the canopy fill in — then hit <strong>Grow</strong> to animate it.</p>'
      + "</div>";

    var canvas = box.querySelector("#cv");
    var ctx = canvas.getContext("2d");
    var W = 700, H = 600;
    var anim = null;

    function drawTree(level) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      var depth = +box.querySelector("#depth").value;
      var angle = +box.querySelector("#angle").value * Math.PI / 180;
      var shrink = +box.querySelector("#shrink").value / 100;
      var trunk = +box.querySelector("#trunk").value;

      function branch(x, y, len, a, d) {
        if (d > level) return;
        var ratio = depth === 0 ? 0 : d / depth;
        ctx.strokeStyle = d === 0 && level >= depth
          ? "hsl(140, 70%, 45%)"
          : "hsl(" + (30 + 100 * ratio) + ", 70%, " + (30 + 20 * ratio) + "%)";
        ctx.lineWidth = Math.max(1, (depth - d + 1) * (trunk / 90) * 0.9);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        var x2 = x + len * Math.cos(a);
        var y2 = y + len * Math.sin(a);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if (d < depth) {
          branch(x2, y2, len * shrink, a - angle, d + 1);
          branch(x2, y2, len * shrink, a + angle, d + 1);
        } else if (level >= depth) {
          ctx.fillStyle = "hsl(140, 70%, 45%)";
          ctx.beginPath();
          ctx.arc(x2, y2, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      branch(W / 2, H - 20, trunk, -Math.PI / 2, 0);
    }

    function stop() {
      if (anim) { cancelAnimationFrame(anim); anim = null; }
      var b = box.querySelector("#play");
      b.textContent = "🌱 Grow";
      b.classList.add("primary");
    }

    box.querySelector("#play").addEventListener("click", function () {
      if (anim) { stop(); return; }
      var b = box.querySelector("#play");
      b.textContent = "⏸️ Stop";
      b.classList.remove("primary");
      var max = +box.querySelector("#depth").value;
      var level = 0;
      var lastT = 0;
      function step(t) {
        level += (t - lastT) * 0.02;
        lastT = t;
        if (level < max) {
          drawTree(level);
          anim = requestAnimationFrame(step);
        } else {
          drawTree(max);
          stop();
        }
      }
      anim = requestAnimationFrame(step);
    });
    box.querySelector("#save").addEventListener("click", function () {
      var a = document.createElement("a");
      a.download = "fractal-tree.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
    ["depth", "angle", "shrink", "trunk"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", function () {
        stop();
        drawTree(+box.querySelector("#depth").value);
      });
    });
    drawTree(+box.querySelector("#depth").value);
  }
});