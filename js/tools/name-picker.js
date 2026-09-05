ToolBox.define("name-picker", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<label class="section-sub" style="margin-bottom:8px; display:block;"><strong>Names (one per line)</strong></label>'
      + '<textarea id="names" placeholder="Alice&#10;Bob&#10;Charlie" aria-label="Names list">Alice&#10;Bob&#10;Charlie&#10;Dana&#10;Eve</textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button id="pick" class="btn primary">🎯 Pick a winner</button>'
      + '<button id="clear" class="btn ghost">🗑️ Clear history</button>'
      + "</div>"
      + '<div class="center" style="margin-top:8px;"><span id="winner" class="big-num">—</span></div>'
      + '<div id="history" class="file-list"></div>'
      + "</div>";

    var namesEl = box.querySelector("#names");
    var winnerEl = box.querySelector("#winner");
    var historyEl = box.querySelector("#history");
    var history = [];

    function pick() {
      var names = namesEl.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
      if (!names.length) { winnerEl.textContent = "Add some names first!"; return; }
      var target = names[Math.floor(Math.random() * names.length)];
      // quick animation through names
      var t = 0;
      var iv = setInterval(function () {
        winnerEl.textContent = names[Math.floor(Math.random() * names.length)];
        t += 60;
        if (t >= 600) {
          clearInterval(iv);
          winnerEl.textContent = "🏆 " + target;
          history.unshift(target);
          renderHistory();
        }
      }, 60);
    }
    function renderHistory() {
      historyEl.innerHTML = "";
      history.slice(0, 10).forEach(function (name, i) {
        var li = document.createElement("li");
        var n = document.createElement("span");
        n.className = "fname";
        n.textContent = (i === 0 ? "🥇 " : (i + 1) + ". ") + name;
        li.appendChild(n);
        historyEl.appendChild(li);
      });
    }
    box.querySelector("#pick").addEventListener("click", pick);
    box.querySelector("#clear").addEventListener("click", function () {
      history = [];
      winnerEl.textContent = "—";
      renderHistory();
    });
  }
});