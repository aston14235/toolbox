ToolBox.define("roman-numeral", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Number to Roman</label><input type="number" id="num" placeholder="e.g. 1987" min="1" max="3999">'
      + '<div id="roman-out" class="big-num" style="margin-top:10px;">—</div></div>'
      + '<div class="field"><label>Roman to Number</label><input type="text" id="roman" placeholder="e.g. MCMLXXXVII">'
      + '<div id="num-out" class="big-num" style="margin-top:10px;">—</div></div>'
      + "</div></div>";

    function toRoman(n) {
      if (!n || n < 1 || n > 3999) return "—";
      var table = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
      var out = "";
      for (var i = 0; i < table.length; i++) {
        while (n >= table[i][0]) { out += table[i][1]; n -= table[i][0]; }
      }
      return out;
    }
    function fromRoman(s) {
      if (!s) return "—";
      var map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      var total = 0;
      for (var i = 0; i < s.length; i++) {
        var c = map[s[i]];
        if (!c) return "—";
        var next = map[s[i + 1]];
        if (next && next > c) { total -= c; } else { total += c; }
      }
      return total > 0 && total <= 3999 ? total : "—";
    }
    box.querySelector("#num").addEventListener("input", function () {
      box.querySelector("#roman-out").textContent = toRoman(Number(box.querySelector("#num").value));
    });
    box.querySelector("#roman").addEventListener("input", function () {
      box.querySelector("#num-out").textContent = fromRoman(box.querySelector("#roman").value.toUpperCase().trim());
    });
  }
});