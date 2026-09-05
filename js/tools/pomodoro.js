ToolBox.define("pomodoro", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body center">'
      + '<span id="mode" class="badge" style="background:var(--accent-soft); color:var(--accent); margin-bottom:12px;">Focus</span>'
      + '<div id="time" class="timer-display">25:00</div>'
      + '<div class="controls" style="justify-content:center; margin-top:18px;">'
      + '<button id="start" class="btn primary">▶️ Start</button>'
      + '<button id="reset" class="btn ghost">↺ Reset</button>'
      + "</div>"
      + '<div class="stats" style="max-width:420px; margin-inline:auto;">'
      + '<div class="stat"><div class="num" id="sessions">0</div><div class="label">Completed</div></div>'
      + '<div class="stat"><div class="num" id="cycle">1</div><div class="label">Cycle</div></div>'
      + "</div>"
      + '<p class="note-box">Classic technique: 25 minutes of focus, 5-minute short break, and a 15-minute long break every 4 cycles.</p>'
      + "</div>";

    var WORK = 25 * 60, SHORT = 5 * 60, LONG = 15 * 60;
    var total = WORK, remaining = WORK;
    var running = false, isBreak = false;
    var sessions = 0, cycle = 1;
    var interval = null;
    var timeEl = box.querySelector("#time");
    var modeEl = box.querySelector("#mode");
    var startBtn = box.querySelector("#start");

    function fmt(s) {
      var m = Math.floor(s / 60), sec = s % 60;
      return String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    }
    function render() {
      timeEl.textContent = fmt(remaining);
      modeEl.textContent = isBreak ? (total === LONG ? "Long break ☕" : "Short break ☕") : "Focus 🍅";
      document.title = (running ? (isBreak ? "☕ " : "🍅 ") : "") + fmt(remaining) + " · ToolBox";
      box.querySelector("#sessions").textContent = sessions;
      box.querySelector("#cycle").textContent = cycle;
    }
    function tick() {
      remaining--;
      if (remaining <= 0) {
        if (!isBreak) {
          sessions++;
          if (sessions % 4 === 0) { isBreak = true; total = LONG; }
          else { isBreak = true; total = SHORT; }
          beep();
        } else {
          isBreak = false;
          total = WORK;
          cycle = Math.floor(sessions / 4) + 1;
          beep();
        }
        remaining = total;
        stop();
      }
      render();
    }
    function beep() {
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.4].forEach(function (t) {
          var o = ctx.createOscillator();
          var g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.08, ctx.currentTime + t);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
          o.start(ctx.currentTime + t);
          o.stop(ctx.currentTime + t + 0.32);
        });
      } catch (e) {}
    }
    function start() {
      if (running) { stop(); return; }
      running = true;
      startBtn.textContent = "⏸️ Pause";
      startBtn.classList.remove("primary");
      interval = setInterval(tick, 1000);
      render();
    }
    function stop() {
      running = false;
      clearInterval(interval);
      startBtn.textContent = "▶️ Start";
      startBtn.classList.add("primary");
      document.title = "Pomodoro Timer · ToolBox";
      render();
    }
    startBtn.addEventListener("click", start);
    box.querySelector("#reset").addEventListener("click", function () {
      stop();
      total = WORK; remaining = WORK; isBreak = false; sessions = 0; cycle = 1;
      render();
    });
    render();
  }
});