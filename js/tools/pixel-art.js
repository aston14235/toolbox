ToolBox.define("pixel-art", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Grid <select id="grid-size">'
      + '<option value="16">16 × 16</option>'
      + '<option value="24">24 × 24</option>'
      + '<option value="32" selected>32 × 32</option>'
      + "</select></label>"
      + '<div class="swatches" id="sw"></div>'
      + '<label title="Custom color"><input type="color" id="color" value="#111827"></label>'
      + '<button class="btn" id="eraser">🧽 Eraser</button>'
      + '<button class="btn ghost" id="clear">🗑️ Clear</button>'
      + '<button class="btn primary" id="save">⬇️ Save PNG</button>'
      + "</div>"
      + '<canvas id="art" class="pixel-canvas"></canvas>'
      + "</div>";

    var canvas = box.querySelector("#art");
    var ctx = canvas.getContext("2d");
    var gridSel = box.querySelector("#grid-size");
    var swatchesEl = box.querySelector("#sw");
    var colorInput = box.querySelector("#color");
    var eraserBtn = box.querySelector("#eraser");
    var clearBtn = box.querySelector("#clear");
    var saveBtn = box.querySelector("#save");

    var PRESETS = ["#111827", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899", "#ffffff"];
    var N = 32;
    var grid = [];
    var color = "#111827";
    var erasing = false;
    var painting = false;

    function makeGrid() {
      grid = [];
      for (var y = 0; y < N; y++) {
        var row = [];
        for (var x = 0; x < N; x++) row.push("#ffffff");
        grid.push(row);
      }
    }
    function render() {
      canvas.width = N;
      canvas.height = N;
      ctx.clearRect(0, 0, N, N);
      for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {
          ctx.fillStyle = grid[y][x];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    function cellAt(e) {
      var r = canvas.getBoundingClientRect();
      var x = Math.floor(((e.clientX - r.left) / r.width) * N);
      var y = Math.floor(((e.clientY - r.top) / r.height) * N);
      if (x < 0 || x >= N || y < 0 || y >= N) return null;
      return { x: x, y: y };
    }
    function paintAt(cell) {
      grid[cell.y][cell.x] = erasing ? "#ffffff" : color;
      render();
    }

    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      painting = true;
      var c = cellAt(e);
      if (c) paintAt(c);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!painting) return;
      var c = cellAt(e);
      if (c) paintAt(c);
    });
    function stop() { painting = false; }
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    gridSel.addEventListener("change", function () {
      N = Number(gridSel.value);
      makeGrid();
      render();
    });

    swatchesEl.innerHTML = "";
    PRESETS.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "swatch" + (c === color ? " active" : "");
      b.style.background = c;
      b.title = c;
      b.setAttribute("aria-label", "Color " + c);
      b.addEventListener("click", function () {
        color = c;
        colorInput.value = c;
        setErasing(false);
        box.querySelectorAll(".swatch").forEach(function (s) { s.classList.toggle("active", s === b); });
      });
      swatchesEl.appendChild(b);
    });
    colorInput.addEventListener("input", function () {
      color = colorInput.value;
      setErasing(false);
      box.querySelectorAll(".swatch").forEach(function (s) { s.classList.toggle("active", s.style.background === color); });
    });
    function setErasing(v) {
      erasing = v;
      eraserBtn.classList.toggle("active", v);
    }
    eraserBtn.addEventListener("click", function () { setErasing(!erasing); });
    clearBtn.addEventListener("click", function () { makeGrid(); render(); });
    saveBtn.addEventListener("click", function () {
      var scale = 16;
      var out = document.createElement("canvas");
      out.width = N * scale;
      out.height = N * scale;
      var octx = out.getContext("2d");
      for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {
          octx.fillStyle = grid[y][x];
          octx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
      out.toBlob(function (blob) {
        if (!blob) return;
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "pixel-art.png";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
      });
    });

    makeGrid();
    render();
  }
});