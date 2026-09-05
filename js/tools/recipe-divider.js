ToolBox.define("recipe-divider", {
  styles: ".chips { display: flex; gap: 6px; flex-wrap: wrap; } .chip { padding: 6px 13px; border-radius: 999px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: .8rem; font-weight: 600; cursor: pointer; } .chip:hover { border-color: var(--accent); background: var(--accent-soft); } .chip.active { background: linear-gradient(135deg, #0088ff, #38b6ff); border-color: transparent; color: #fff; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Ingredients — one per line, quantity first</label>'
      + '<textarea id="input" rows="9" placeholder="2 cups flour&#10;1 1/2 tsp salt&#10;3/4 cup milk&#10;2 eggs&#10;1/2 stick butter"></textarea></div>'
      + '<div class="controls"><span class="muted small">Scale by:</span>'
      + '<div class="chips">' + [0.5, 1, 2, 3].map(function (f) { return '<button class="chip' + (f === 1 ? " active" : "") + '" data-f="' + f + '">×' + f + "</button>"; }).join("")
      + '<button class="chip" data-f="custom" id="custom-chip">Custom…</button></div>'
      + '<input type="number" id="custom" class="hidden" placeholder="e.g. 1.5" step="0.1" min="0.1" style="width:90px;"></div>'
      + '<div class="field"><label>Scaled ingredients</label>'
      + '<textarea id="output" rows="9" readonly></textarea></div>'
      + "</div>";

    var inputEl = box.querySelector("#input"), outputEl = box.querySelector("#output");
    var factor = 1, customEl = box.querySelector("#custom");

    var FRACS = [[0.125, "1/8"], [0.25, "1/4"], [0.375, "3/8"], [0.5, "1/2"], [0.625, "5/8"], [0.75, "3/4"], [0.875, "7/8"], [1 / 3, "1/3"], [2 / 3, "2/3"], [0.2, "1/5"], [0.4, "2/5"], [0.6, "3/5"], [0.8, "4/5"]];
    function pretty(n) {
      if (n <= 0) return "0";
      var i = Math.floor(n), f = n - i;
      var best = null, bestDiff = 1;
      FRACS.forEach(function (fr) {
        var d = Math.abs(f - fr[0]);
        if (d < bestDiff) { bestDiff = d; best = fr; }
      });
      if (bestDiff < 0.035) {
        var str = best[1];
        return (i ? i + " " + str : str).replace(/^0 /, "");
      }
      return (Math.round(n * 100) / 100).toString();
    }
    function convert() {
      var lines = inputEl.value.split("\n");
      var out = lines.map(function (line) {
        var t = line.trim();
        if (!t) return "";
        var m = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s+(.+)$/.exec(t);
        if (!m) return t;
        var qty = (function (s) {
          var mixed = /^(\d+)\s+(\d+)\/(\d+)$/.exec(s);
          if (mixed) return +mixed[1] + +mixed[2] / +mixed[3];
          var frac = /^(\d+)\/(\d+)$/.exec(s);
          if (frac) return +frac[1] / +frac[2];
          return +s;
        })(m[1]);
        var scaled = qty * factor;
        return pretty(scaled) + " " + m[2];
      });
      outputEl.value = out.join("\n");
    }
    function setFactor(f) {
      factor = f;
      box.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c.dataset.f === String(f)); });
      customEl.classList.add("hidden");
      convert();
    }
    box.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        if (chip.dataset.f === "custom") {
          customEl.classList.remove("hidden");
          customEl.focus();
        } else setFactor(Number(chip.dataset.f));
      });
    });
    customEl.addEventListener("input", function () {
      var v = Number(customEl.value);
      if (v > 0) {
        factor = v;
        box.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        convert();
      }
    });
    inputEl.addEventListener("input", convert);
    inputEl.value = "2 cups flour\n1 1/2 tsp salt\n3/4 cup milk\n2 eggs\n1/2 stick butter";
    convert();
  }
});