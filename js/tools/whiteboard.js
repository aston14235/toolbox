ToolBox.define("whiteboard", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<div class="swatches" id="sw"></div>'
      + '<label title="Custom color"><input type="color" id="color" value="#6366f1"></label>'
      + '<label>Size <input type="range" id="size" min="1" max="60" value="8"></label>'
      + '<button class="btn" id="eraser">🧽 Eraser</button>'
      + '<button class="btn" id="undo" disabled>↩️ Undo</button>'
      + '<button class="btn ghost" id="clear">🗑️ Clear</button>'
      + '<button class="btn primary" id="save">⬇️ Save PNG</button>'
      + "</div>"
      + '<div class="canvas-wrap"><canvas id="canvas"></canvas></div>'
      + '<p class="note-box">💡 Tip: drag with the mouse (or your finger on touch screens) to draw. Use the eraser to fix mistakes, undo to step back.</p>'
      + "</div>";

    var canvas = box.querySelector("#canvas");
    var ctx = canvas.getContext("2d");
    var wrap = box.querySelector(".canvas-wrap");
    var swatchesEl = box.querySelector("#sw");
    var colorInput = box.querySelector("#color");
    var sizeInput = box.querySelector("#size");
    var eraserBtn = box.querySelector("#eraser");
    var undoBtn = box.querySelector("#undo");
    var clearBtn = box.querySelector("#clear");
    var saveBtn = box.querySelector("#save");

    var PRESETS = ["#111827", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#ffffff"];
    var color = "#6366f1";
    var size = 8;
    var erasing = false;
    var drawing = false;
    var undoStack = [];
    var MAX_UNDO = 12;

    function resize() {
      var rect = wrap.getBoundingClientRect();
      var w = Math.max(Math.floor(rect.width), 320);
      var h = 520;
      var dpr = window.devicePixelRatio || 1;
      var snap = document.createElement("canvas");
      snap.width = canvas.width;
      snap.height = canvas.height;
      if (canvas.width) snap.getContext("2d").drawImage(canvas, 0, 0);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (snap.width) ctx.drawImage(snap, 0, 0, snap.width, snap.height);
      undoStack.length = 0;
      undoBtn.disabled = true;
    }
    resize();
    window.addEventListener("resize", resize);

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

    sizeInput.addEventListener("input", function () { size = Number(sizeInput.value); });

    function setErasing(v) {
      erasing = v;
      eraserBtn.classList.toggle("active", v);
      canvas.style.cursor = v ? "cell" : "crosshair";
    }
    eraserBtn.addEventListener("click", function () { setErasing(!erasing); });

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function snapshot() {
      undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (undoStack.length > MAX_UNDO) undoStack.shift();
      undoBtn.disabled = undoStack.length === 0;
    }

    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawing = true;
      snapshot();
      var p = pos(e);
      ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
      ctx.strokeStyle = erasing ? "rgba(0,0,0,1)" : color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
      ctx.stroke();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      var p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
    function stop() { drawing = false; ctx.beginPath(); }
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    undoBtn.addEventListener("click", function () {
      var img = undoStack.pop();
      if (img) ctx.putImageData(img, 0, 0);
      undoBtn.disabled = undoStack.length === 0;
    });
    clearBtn.addEventListener("click", function () {
      snapshot();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    saveBtn.addEventListener("click", function () {
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "whiteboard.png";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
      });
    });
  }
});