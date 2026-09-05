ToolBox.define("dice-roller", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Dice <input type="range" id="count" min="1" max="10" value="2"> <span id="count-label">2</span></label>'
      + '<label>Type <select id="sides">'
      + "<option value=\"4\">d4</option><option value=\"6\" selected>d6</option><option value=\"8\">d8</option>"
      + "<option value=\"10\">d10</option><option value=\"12\">d12</option><option value=\"20\">d20</option><option value=\"100\">d100</option>"
      + "</select></label>"
      + '<button id="roll" class="btn primary">🎲 Roll</button>'
      + "</div>"
      + '<div class="center" style="margin:10px 0;"><span id="faces" style="font-size:2rem; font-weight:800; letter-spacing:4px;">—</span></div>'
      + '<div class="center"><span id="total" class="big-num">—</span> <span class="muted">total</span></div>'
      + '<div id="history" class="file-list"></div>'
      + "</div>";

    var countEl = box.querySelector("#count");
    var sidesEl = box.querySelector("#sides");
    var facesEl = box.querySelector("#faces");
    var totalEl = box.querySelector("#total");
    var historyEl = box.querySelector("#history");
    var history = [];

    function roll() {
      var n = Number(countEl.value);
      var s = Number(sidesEl.value);
      var results = [];
      for (var i = 0; i < n; i++) results.push(Math.floor(Math.random() * s) + 1);
      facesEl.textContent = results.join("  ");
      var sum = results.reduce(function (a, b) { return a + b; }, 0);
      totalEl.textContent = sum;
      history.unshift(results.join("+") + " = " + sum);
      renderHistory();
    }
    function renderHistory() {
      historyEl.innerHTML = "";
      history.slice(0, 10).forEach(function (entry) {
        var li = document.createElement("li");
        var n = document.createElement("span");
        n.className = "fname";
        n.textContent = entry;
        li.appendChild(n);
        historyEl.appendChild(li);
      });
    }
    countEl.addEventListener("input", function () { box.querySelector("#count-label").textContent = countEl.value; });
    box.querySelector("#roll").addEventListener("click", roll);
    roll();
  }
});