ToolBox.define("retirement-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Current age</label><input type="number" id="age" value="30" min="18" max="90" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Retirement age</label><input type="number" id="ret" value="65" min="18" max="90" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Current savings ($)</label><input type="number" id="saved" value="25000" min="0" step="1000" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Monthly contribution ($)</label><input type="number" id="monthly" value="500" min="0" step="50" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Expected annual return (%)</label><input type="number" id="return" value="7" min="0" max="30" step="0.1" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Annual spending in retirement ($)</label><input type="number" id="spend" value="40000" min="0" step="1000" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="total">—</div><div class="label">At retirement</div></div>'
      + '<div class="stat"><div class="num" id="withdraw">—</div><div class="label">Safe annual income (4%)</div></div>'
      + '<div class="stat"><div class="num" id="coverage">—</div><div class="label">Spending covered</div></div>'
      + "</div>"
      + '<p class="note-box" id="note"></p>'
      + "</div>";

    function fmt(n) { return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 }); }
    function update() {
      var age = Number(box.querySelector("#age").value);
      var ret = Number(box.querySelector("#ret").value);
      var saved = Number(box.querySelector("#saved").value) || 0;
      var monthly = Number(box.querySelector("#monthly").value) || 0;
      var r = (Number(box.querySelector("#return").value) || 0) / 100 / 12;
      var spend = Number(box.querySelector("#spend").value) || 0;
      if (isNaN(age) || isNaN(ret) || ret <= age) {
        box.querySelector("#total").textContent = box.querySelector("#withdraw").textContent = box.querySelector("#coverage").textContent = "—";
        box.querySelector("#note").textContent = "Retirement age must be after your current age.";
        return;
      }
      var months = (ret - age) * 12;
      var bal = saved;
      for (var i = 0; i < months; i++) bal = bal * (1 + r) + monthly;
      var safe = bal * 0.04;
      var covered = spend ? Math.min(999, Math.round(safe / spend * 100)) : 0;
      box.querySelector("#total").textContent = fmt(bal);
      box.querySelector("#withdraw").textContent = fmt(safe);
      box.querySelector("#coverage").textContent = covered >= 100 ? "✅ " + covered + "%" : covered + "%";
      var gap = spend - safe;
      box.querySelector("#note").textContent = covered >= 100
        ? "Your nest egg should cover your spending, with " + fmt(safe - spend) + "/yr to spare. 🎉"
        : "You\u2019ll come up " + fmt(gap) + "/yr short — add about " + fmt(gap / (0.04 * 12)) + " more saved, or " + fmt(Math.ceil(gap / 12 / (1 + r))) + "/mo, or retire later.";
    }
    ["age", "ret", "saved", "monthly", "return", "spend"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", update);
    });
    update();
  }
});