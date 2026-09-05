ToolBox.define("stopwatch", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body center">'
      + '<div id="disp" class="timer-display">00:00.00</div>'
      + '<div class="controls" style="justify-content:center; margin-top:18px;">'
      + '<button id="start" class="btn primary">▶️ Start</button>'
      + '<button id="lap" class="btn" disabled>🏁 Lap</button>'
      + '<button id="reset" class="btn ghost">↺ Reset</button>'
      + "</div>"
      + '<ul id="laps" class="file-list" style="max-width:420px; margin-inline:auto;"></ul>'
      + '<p class="note-box">Precision timing for workouts, cooking or speedruns. Lap keeps the clock running and logs the split.</p>'
      + "</div>";

    var disp = box.querySelector("#disp");
    var lapsEl = box.querySelector("#laps");
    var startBtn = box.querySelector("#start");
    var lapBtn = box.querySelector("#lap");
    var startTime = 0, elapsed = 0, running = false;
    var lapStart = 0, lapCount = 0;
    var timer = null;

    function fmt(ms) {
      var cs = Math.floor(ms / 10) % 100;
      var s = Math.floor(ms / 1000) % 60;
      var m = Math.floor(ms / 60000);
      return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + "." + String(cs).padStart(2, "0");
    }
    function render() {
      disp.textContent = fmt(elapsed);
      document.title = running ? "⏱️ " + fmt(elapsed) + " · ToolBox" : "Stopwatch · ToolBox";
    }
    function tick() {
      elapsed = startTime ? Date.now() - startTime : 0;
      render();
    }
    function start() {
      if (running) { stop(); return; }
      running = true;
      startTime = Date.now() - elapsed;
      lapStart = Date.now();
      startBtn.textContent = "⏸️ Pause";
      startBtn.classList.remove("primary");
      lapBtn.disabled = false;
      timer = setInterval(tick, 33);
      tick();
    }
    function stop() {
      running = false;
      clearInterval(timer);
      startBtn.textContent = "▶️ Start";
      startBtn.classList.add("primary");
      lapBtn.disabled = true;
      tick();
    }
    startBtn.addEventListener("click", start);
    lapBtn.addEventListener("click", function () {
      var now = Date.now();
      var split = now - lapStart;
      lapStart = now;
      lapCount++;
      var li = document.createElement("li");
      var name = document.createElement("span");
      name.className = "fname";
      name.textContent = "Lap " + lapCount;
      var meta = document.createElement("span");
      meta.className = "fmeta";
      meta.textContent = fmt(split) + "  ·  total " + fmt(elapsed);
      li.appendChild(name);
      li.appendChild(meta);
      lapsEl.insertBefore(li, lapsEl.firstChild);
    });
    box.querySelector("#reset").addEventListener("click", function () {
      stop();
      elapsed = 0;
      lapStart = 0;
      lapCount = 0;
      lapsEl.innerHTML = "";
      render();
    });
    render();
  }
});