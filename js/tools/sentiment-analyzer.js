ToolBox.define("sentiment-analyzer", {
  render: function (box) {
    var POS = ("love great amazing excellent wonderful fantastic happy glad joy good best perfect awesome superb brilliant incredible outstanding lovely nice cool fun sweet beautiful delightful marvelous terrific fabulous enjoyable").split(" ");
    var NEG = ("hate terrible awful bad worst horrible horrible ugly sad cry angry mad annoying stupid boring useless disappointing frustrating broken waste fail disaster mess pain fear scary worry trouble problem difficult hard stressful sick hurt lonely angry").split(" ");
    var BOOST = { very: 1.6, really: 1.6, extremely: 1.8, so: 1.4, super: 1.5, absolutely: 1.8, completely: 1.7, totally: 1.5, quite: 1.3, somewhat: 0.7, slightly: 0.6, barely: 0.4 };
    var NEGATE = new Set(("not never no isn't isn aren't aren don't don doesn't doesn didn't didn wasn't wasn weren't weren can't can cannot wont won't shouldn't wouldn't couldn't hardly barely").split(" "));

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Text to analyze</label>'
      + '<textarea id="input" rows="7" placeholder="Paste a review, tweet, comment or paragraph…"></textarea></div>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="score">—</div><div class="label">Sentiment score</div></div>'
      + '<div class="stat"><div class="num" id="verdict">—</div><div class="label">Verdict</div></div>'
      + '<div class="stat"><div class="num" id="pos">0</div><div class="label">Positive words</div></div>'
      + '<div class="stat"><div class="num" id="neg">0</div><div class="label">Negative words</div></div>'
      + "</div>"
      + '<div class="strength-bar" style="margin-top:14px;"><div id="bar" style="width:0%;"></div></div>'
      + '<div id="sentences" class="file-list" style="margin-top:14px;max-height:260px;overflow:auto;"></div>'
      + "</div>";

    function analyze(text) {
      var words = text.toLowerCase().replace(/[^a-z'\s-]/g, " ").split(/\s+/).filter(Boolean);
      var score = 0, pos = 0, neg = 0, negateNext = false;
      var details = [];
      words.forEach(function (w, i) {
        var base = w.replace(/^[^a-z]+|[^a-z]+$/g, "");
        if (NEGATE.has(base)) { negateNext = true; return; }
        var val = 0;
        if (POS.indexOf(base) !== -1) val = 1;
        else if (NEG.indexOf(base) !== -1) val = -1;
        if (val !== 0) {
          var boost = 1;
          var prev = i > 0 ? words[i - 1].replace(/^[^a-z]+|[^a-z]+$/g, "") : "";
          if (BOOST[prev]) boost = BOOST[prev];
          var v = val * boost * (negateNext ? -1 : 1);
          if (v > 0) pos++; else neg++;
          score += v;
          details.push(w + ":" + (v > 0 ? "+" : "") + v.toFixed(1));
          negateNext = false;
        } else if (base === "but" || base === "however") {
          negateNext = false;
        }
      });
      return { score: score, pos: pos, neg: neg, details: details };
    }

    function update() {
      var text = box.querySelector("#input").value;
      if (!text.trim()) {
        box.querySelector("#score").textContent = "—";
        box.querySelector("#verdict").textContent = "—";
        box.querySelector("#bar").style.width = "0%";
        box.querySelector("#bar").style.background = "var(--muted)";
        box.querySelector("#sentences").innerHTML = "";
        return;
      }
      var r = analyze(text);
      box.querySelector("#score").textContent = (r.score > 0 ? "+" : "") + r.score.toFixed(1);
      box.querySelector("#pos").textContent = r.pos;
      box.querySelector("#neg").textContent = r.neg;
      var verdict = r.score > 1.5 ? "😄 Very positive" : r.score > 0.3 ? "🙂 Positive" : r.score < -1.5 ? "😠 Very negative" : r.score < -0.3 ? "🙁 Negative" : "😐 Neutral";
      box.querySelector("#verdict").textContent = verdict;
      var pct = Math.max(0, Math.min(100, 50 + r.score * 20));
      box.querySelector("#bar").style.width = pct + "%";
      box.querySelector("#bar").style.background = r.score >= 0 ? "linear-gradient(90deg, var(--accent), #9effff)" : "linear-gradient(90deg, #ff5f6b, #ffb199)";
      var sents = text.split(/(?<=[.!?])\s+/).filter(function (s) { return s.trim(); });
      box.querySelector("#sentences").innerHTML = sents.map(function (s) {
        var sr = analyze(s);
        var cls = sr.score > 0.2 ? "🟢" : sr.score < -0.2 ? "🔴" : "⚪";
        return '<li style="padding:8px 12px;">' + cls + " <span style=\"opacity:.75;\">" + ToolBox.esc(s.trim().slice(0, 120)) + "</span> <span style=\"font-weight:700;\">" + (sr.score > 0 ? "+" : "") + sr.score.toFixed(1) + "</span></li>";
      }).join("");
    }

    box.querySelector("#input").addEventListener("input", update);
    box.querySelector("#input").value = "I absolutely love this app! It works perfectly and the design is beautiful. However, the loading time is really annoying sometimes.";
    update();
  }
});