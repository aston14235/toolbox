ToolBox.define("tip", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Bill amount ($)</label><input type="number" id="bill" placeholder="e.g. 85.50" step="0.01" min="0"></div>'
      + '<div class="field"><label>Tip</label><div class="controls" style="margin-bottom:0;">'
      + '<input type="range" id="tip" min="0" max="30" value="15"> <span id="tip-label">15%</span></div></div>'
      + '<div class="field"><label>Split between</label><div class="controls" style="margin-bottom:0;">'
      + '<input type="range" id="people" min="1" max="20" value="1"> <span id="people-label">1</span></div></div>'
      + "</div>"
      + '<div class="stats" style="margin-top:8px;">'
      + '<div class="stat"><div class="num" id="tip-amt">—</div><div class="label">Tip amount</div></div>'
      + '<div class="stat"><div class="num" id="total">—</div><div class="label">Total</div></div>'
      + '<div class="stat"><div class="num" id="per-person">—</div><div class="label">Per person</div></div>'
      + "</div></div>";

    function fmt(n) { return "$" + n.toFixed(2); }
    function update() {
      var bill = Number(box.querySelector("#bill").value) || 0;
      var tip = Number(box.querySelector("#tip").value);
      var people = Number(box.querySelector("#people").value);
      box.querySelector("#tip-label").textContent = tip + "%";
      box.querySelector("#people-label").textContent = people;
      var tipAmt = bill * tip / 100;
      var total = bill + tipAmt;
      box.querySelector("#tip-amt").textContent = fmt(tipAmt);
      box.querySelector("#total").textContent = fmt(total);
      box.querySelector("#per-person").textContent = fmt(total / people);
    }
    ["#bill", "#tip", "#people"].forEach(function (id) {
      box.querySelector(id).addEventListener("input", update);
    });
    update();
  }
});