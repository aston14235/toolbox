ToolBox.define("scientific-calculator", {
  styles: ".calc-display-wrap { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; margin-bottom: 14px; text-align: right; min-height: 84px; } .calc-expr { color: var(--muted); font-size: .9rem; min-height: 1.4em; word-break: break-all; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; } .calc-cur { font-size: 1.9rem; font-weight: 800; word-break: break-all; font-variant-numeric: tabular-nums; color: var(--text); } .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; } .calc-grid button { padding: 13px 8px; font-size: 1rem; } .calc-grid .fn { color: var(--accent); } .calc-grid .op { color: var(--accent); font-weight: 800; } .calc-grid .eq { background: var(--accent); border-color: transparent; color: #fff; } .calc-grid .eq:hover { background: var(--accent-strong); }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="calc-display-wrap">'
      + '<div class="calc-expr" id="expr"></div>'
      + '<div class="calc-cur" id="cur">0</div>'
      + "</div>"
      + '<div class="calc-grid">'
      + '<button class="fn" data-k="(">(</button><button class="fn" data-k=")">)</button><button class="fn" data-k="C">C</button><button class="fn" data-k="⌫">⌫</button>'
      + '<button class="fn" data-k="x²">x²</button><button class="fn" data-k="√">√</button><button class="fn" data-k="1/x">1/x</button><button class="op" data-k="÷">÷</button>'
      + '<button class="fn" data-k="sin">sin</button><button class="fn" data-k="cos">cos</button><button class="fn" data-k="tan">tan</button><button class="op" data-k="×">×</button>'
      + '<button class="fn" data-k="ln">ln</button><button class="fn" data-k="log">log</button><button class="fn" data-k="π">π</button><button class="op" data-k="−">−</button>'
      + '<button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button class="op" data-k="+">+</button>'
      + '<button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button class="fn" data-k="xʸ">xʸ</button>'
      + '<button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button class="fn" data-k="%">%</button>'
      + '<button data-k="±">±</button><button data-k="0">0</button><button data-k=".">.</button><button class="eq" data-k="=">=</button>'
      + "</div>"
      + '<p class="note-box" style="margin-top:14px;">Keyboard supported: digits, + − × ÷ (use / and *), . ( ), Enter =, Backspace, Esc. Radians for trig.</p>'
      + "</div>";

    var exprEl = box.querySelector("#expr");
    var curEl = box.querySelector("#cur");
    var expr = "";
    var justEvaluated = false;

    function display() {
      curEl.textContent = expr === "" ? "0" : expr;
      exprEl.textContent = "";
    }

    function evaluate(showFull) {
      var t = expr
        .replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-")
        .replace(/π/g, "(Math.PI)").replace(/e/g, "(Math.E)")
        .replace(/\^/g, "**").replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(")
        .replace(/ln\(/g, "Math.log(").replace(/log\(/g, "Math.log10(");
      try {
        var result = new Function("return (" + t + ")")();
        if (typeof result === "number" && isFinite(result)) {
          if (showFull) exprEl.textContent = expr + " =";
          expr = String(parseFloat(result.toPrecision(14)));
          curEl.textContent = expr;
          return true;
        }
        throw new Error("nan");
      } catch (e) {
        curEl.textContent = "Error";
        exprEl.textContent = expr;
        expr = "";
        return false;
      }
    }

    function press(k) {
      if (k === "C") { expr = ""; curEl.textContent = "0"; exprEl.textContent = ""; justEvaluated = false; return; }
      if (k === "⌫") { expr = expr.slice(0, -1); display(); return; }
      if (k === "=") { evaluate(true); justEvaluated = true; return; }
      if (justEvaluated && /[0-9.]/.test(k)) { expr = ""; justEvaluated = false; }
      if (justEvaluated) justEvaluated = false;
      if (k === "x²") { expr = "(" + expr + ")^2"; }
      else if (k === "√") { expr = "sqrt(" + expr + ")"; }
      else if (k === "1/x") { expr = "1/(" + expr + ")"; }
      else if (k === "sin") { expr = "sin(" + expr + ")"; }
      else if (k === "cos") { expr = "cos(" + expr + ")"; }
      else if (k === "tan") { expr = "tan(" + expr + ")"; }
      else if (k === "ln") { expr = "ln(" + expr + ")"; }
      else if (k === "log") { expr = "log(" + expr + ")"; }
      else if (k === "xʸ") { expr = "(" + expr + ")^"; }
      else if (k === "%") { expr = "(" + expr + ")/100"; }
      else if (k === "±") { expr = "(-(" + expr + "))"; }
      else if (k === "π") { expr += "π"; }
      else if (k === ".") {
        var lastNum = expr.split(/[^0-9]/).pop() || "0";
        if (lastNum.indexOf(".") === -1) expr += ".";
      }
      else if (k === "+" || k === "−" || k === "×" || k === "÷" || k === "^") {
        if (expr === "" && k === "−") { expr = "−"; }
        else if (expr !== "" && !/[\d)]$/.test(expr)) { expr = expr.slice(0, -1) + k; }
        else expr += k;
      }
      else { expr += k; }
      display();
    }

    box.querySelectorAll(".calc-grid button").forEach(function (btn) {
      btn.addEventListener("click", function () { press(btn.dataset.k); });
    });

    box.addEventListener("keydown", function (e) {
      var map = { "/": "÷", "*": "×", "-": "−", "+": "+", ".": ".", "(": "(", ")": ")" };
      if (/^[0-9]$/.test(e.key)) { press(e.key); e.preventDefault(); }
      else if (map[e.key]) { press(map[e.key]); e.preventDefault(); }
      else if (e.key === "Enter" || e.key === "=") { press("="); e.preventDefault(); }
      else if (e.key === "Backspace") { press("⌫"); e.preventDefault(); }
      else if (e.key === "Escape") { press("C"); e.preventDefault(); }
    });

    display();
  }
});