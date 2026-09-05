ToolBox.define("typing-speed", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="passage" class="ascii-out" style="max-height:none; font-size:1.05rem; white-space:normal; line-height:1.7;"></div>'
      + '<div class="controls" style="margin-top:14px;">'
      + '<button id="start" class="btn primary">🚀 Start test</button>'
      + '<button id="new" class="btn ghost">🔄 New passage</button>'
      + '<span id="live" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<textarea id="type" placeholder="Type the passage here…" aria-label="Typing area"></textarea>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="wpm">0</div><div class="label">WPM</div></div>'
      + '<div class="stat"><div class="num" id="acc">—</div><div class="label">Accuracy</div></div>'
      + '<div class="stat"><div class="num" id="time">0.0s</div><div class="label">Time</div></div>'
      + "</div>"
      + '<p class="note-box">Type as fast and accurately as you can. WPM counts 5 characters as one word, accuracy is correct characters ÷ typed. All local — nothing leaves your browser.</p>'
      + "</div>";

    var PASSAGES = [
      "The quick brown fox jumps over the lazy dog while the sun sets slowly behind the distant hills and the birds fly home for the night.",
      "Practice makes perfect, but perfect practice makes perfect habits, so slow down, focus on every keystroke, and let speed come naturally with time.",
      "Great tools are simple, fast and private — they do one thing well and stay out of your way, letting you finish your work and get back to life.",
      "Typing is a conversation between your fingers and the keyboard, and like any good conversation it gets smoother the more you show up for it."
    ];
    var passage = "";
    var words = [];
    var running = false, done = false;
    var startAt = 0;
    var timer = null;
    var passageEl = box.querySelector("#passage");
    var typeEl = box.querySelector("#type");

    function setPassage() {
      passage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
      words = passage.split(" ");
      renderPassage(0);
    }
    function renderPassage(typed) {
      var html = "";
      var consumed = 0;
      var tWords = typed ? typed.split(" ") : [];
      words.forEach(function (w, i) {
        var tw = tWords[i] || "";
        var cls = "diff-del";
        if (!typed) cls = "";
        else if (i < tWords.length - 1 || typed.length >= passage.length) {
          cls = tw === w ? "diff-add" : "diff-del";
        } else if (w.indexOf(tw) === 0) cls = "diff-add";
        html += '<span class="' + cls + '" style="padding:1px 2px; border-radius:4px;">' + ToolBox.esc(w) + "</span> ";
      });
      passageEl.innerHTML = html;
    }
    function fmtTime(ms) {
      return (ms / 1000).toFixed(1) + "s";
    }
    function stats() {
      var typed = typeEl.value;
      var t = (Date.now() - startAt) / 1000 / 60;
      var correct = 0;
      for (var i = 0; i < typed.length; i++) {
        if (typed[i] === passage[i]) correct++;
      }
      var wpm = t > 0 ? Math.round((correct / 5) / t) : 0;
      var acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
      box.querySelector("#wpm").textContent = wpm;
      box.querySelector("#acc").textContent = acc + "%";
      box.querySelector("#time").textContent = fmtTime(Date.now() - startAt);
      var live = box.querySelector("#live");
      live.textContent = typed ? wpm + " wpm · " + acc + "%" : "Press Start, then type…";
      return { typed: typed, correct: correct };
    }
    function finish() {
      running = false;
      done = true;
      clearInterval(timer);
      typeEl.disabled = true;
      var s = stats();
      var acc = s.typed.length ? Math.round((s.correct / s.typed.length) * 100) : 100;
      box.querySelector("#live").textContent = "Done! " + box.querySelector("#wpm").textContent + " wpm · " + acc + "%";
      box.querySelector("#start").textContent = "🔁 Retry";
    }
    function reset() {
      done = false;
      running = false;
      clearInterval(timer);
      typeEl.disabled = false;
      typeEl.value = "";
      startAt = 0;
      box.querySelector("#wpm").textContent = "0";
      box.querySelector("#acc").textContent = "—";
      box.querySelector("#time").textContent = "0.0s";
      box.querySelector("#start").textContent = "🚀 Start test";
      box.querySelector("#live").textContent = "Press Start, then type…";
      renderPassage("");
    }
    box.querySelector("#start").addEventListener("click", function () {
      if (done) { setPassage(); reset(); return; }
      if (running) return;
      if (!typeEl.value) {
        running = true;
        startAt = Date.now();
        typeEl.focus();
        timer = setInterval(stats, 200);
        box.querySelector("#start").textContent = "⌨️ Go!";
      }
    });
    box.querySelector("#new").addEventListener("click", function () {
      reset();
      setPassage();
    });
    typeEl.addEventListener("input", function () {
      if (!running) return;
      stats();
      renderPassage(typeEl.value);
      if (typeEl.value.length >= passage.length) finish();
    });
    setPassage();
    reset();
  }
});