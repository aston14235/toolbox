ToolBox.define("percentage", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>What is X% of Y?</label>'
      + '<input type="number" id="a-pct" placeholder="e.g. 15"> <span class="muted">% of</span> <input type="number" id="a-num" placeholder="e.g. 200">'
      + '<div id="a-out" class="big-num" style="margin-top:10px;">—</div></div>'
      + '<div class="field"><label>X is what % of Y?</label>'
      + '<input type="number" id="b-x" placeholder="e.g. 30"> <span class="muted">is what % of</span> <input type="number" id="b-y" placeholder="e.g. 150">'
      + '<div id="b-out" class="big-num" style="margin-top:10px;">—</div></div>'
      + '<div class="field"><label>Percentage change from X to Y?</label>'
      + '<input type="number" id="c-x" placeholder="e.g. 50"> <span class="muted">to</span> <input type="number" id="c-y" placeholder="e.g. 75">'
      + '<div id="c-out" class="big-num" style="margin-top:10px;">—</div></div>'
      + "</div></div>";

    var inputs = box.querySelectorAll("input");
    function wire(a, b, outId, fn) {
      [a, b].forEach(function (id) {
        box.querySelector(id).addEventListener("input", function () {
          var va = Number(box.querySelector(a).value);
          var vb = Number(box.querySelector(b).value);
          box.querySelector(outId).textContent = fn(va, vb);
        });
      });
    }
    wire("#a-pct", "#a-num", "#a-out", function (p, n) {
      return isNaN(p) || isNaN(n) ? "—" : (p / 100 * n).toLocaleString(undefined, { maximumFractionDigits: 4 });
    });
    wire("#b-x", "#b-y", "#b-out", function (x, y) {
      return isNaN(x) || isNaN(y) || y === 0 ? "—" : (x / y * 100).toFixed(2) + "%";
    });
    wire("#c-x", "#c-y", "#c-out", function (x, y) {
      if (isNaN(x) || isNaN(y) || x === 0) return "—";
      var chg = (y - x) / x * 100;
      return (chg >= 0 ? "+" : "") + chg.toFixed(2) + "%";
    });
    inputs.forEach(function (i) { i.style.cssText = "padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); width:110px;"; });
  }
});