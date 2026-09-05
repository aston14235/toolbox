ToolBox.define("bmi", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Height</label>'
      + '<div class="controls" style="margin-bottom:0;"><input type="number" id="height" placeholder="e.g. 175" style="width:110px; padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);">'
      + '<select id="h-unit"><option value="cm">cm</option><option value="m">m</option></select></div></div>'
      + '<div class="field"><label>Weight</label>'
      + '<div class="controls" style="margin-bottom:0;"><input type="number" id="weight" placeholder="e.g. 70" style="width:110px; padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);">'
      + '<select id="w-unit"><option value="kg">kg</option><option value="lb">lb</option></select></div></div>'
      + "</div>"
      + '<div class="center" style="margin-top:8px;"><span id="bmi-num" class="big-num">—</span>'
      + '<span id="bmi-cat" class="badge" style="margin-left:10px; background:var(--accent-soft); color:var(--accent);">—</span></div>'
      + '<div class="strength-bar" style="margin-top:14px; height:14px;"><div id="bar" style="width:0;"></div></div>'
      + '<div class="muted small" style="display:flex; justify-content:space-between; margin-top:6px;"><span>Underweight &lt;18.5</span><span>Normal 18.5–24.9</span><span>Overweight 25–29.9</span><span>Obese ≥30</span></div>'
      + "</div>";

    function update() {
      var h = Number(box.querySelector("#height").value);
      var w = Number(box.querySelector("#weight").value);
      if (!h || !w || h <= 0 || w <= 0) {
        box.querySelector("#bmi-num").textContent = "—";
        box.querySelector("#bmi-cat").textContent = "—";
        box.querySelector("#bar").style.width = "0";
        return;
      }
      var hm = box.querySelector("#h-unit").value === "m" ? h : h / 100;
      var wkg = box.querySelector("#w-unit").value === "lb" ? w * 0.453592 : w;
      var bmi = wkg / (hm * hm);
      box.querySelector("#bmi-num").textContent = bmi.toFixed(1);
      var cat, color, pos;
      if (bmi < 18.5) { cat = "Underweight"; color = "#f59e0b"; pos = 5; }
      else if (bmi < 25) { cat = "Normal weight ✓"; color = "var(--ok)"; pos = 30; }
      else if (bmi < 30) { cat = "Overweight"; color = "#f97316"; pos = 58; }
      else { cat = "Obese"; color = "var(--danger)"; pos = 85; }
      var c = box.querySelector("#bmi-cat");
      c.textContent = cat;
      c.style.background = color + "22";
      c.style.color = color;
      var bar = box.querySelector("#bar");
      bar.style.width = "0";
      bar.style.background = color;
      setTimeout(function () { bar.style.width = Math.min(100, pos) + "%"; }, 30);
    }
    ["#height", "#weight", "#h-unit", "#w-unit"].forEach(function (id) {
      box.querySelector(id).addEventListener("input", update);
    });
  }
});