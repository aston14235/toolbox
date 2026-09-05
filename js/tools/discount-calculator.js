ToolBox.define("discount-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Original price ($)</label><input type="number" id="price" placeholder="e.g. 120" step="0.01" min="0"></div>'
      + '<div class="field"><label>Discount (%)</label><input type="number" id="discount" placeholder="e.g. 25" step="0.5" min="0" max="100"></div>'
      + "</div>"
      + '<div class="controls"><span class="muted small">Quick picks:</span>'
      + [10, 20, 25, 30, 50, 75].map(function (d) { return '<button class="chip" data-d="' + d + '">' + d + "%</button>"; }).join("")
      + "</div>"
      + '<div class="stats" style="margin-top:10px;">'
      + '<div class="stat"><div class="num" id="final">—</div><div class="label">Final price</div></div>'
      + '<div class="stat"><div class="num" id="saved">—</div><div class="label">You save</div></div>'
      + '<div class="stat"><div class="num" id="pct">—</div><div class="label">Off</div></div>'
      + "</div></div>";

    function fmt(n) { return "$" + Number(n).toFixed(2); }
    function update() {
      var price = Number(box.querySelector("#price").value);
      var d = Number(box.querySelector("#discount").value);
      if (isNaN(price) || isNaN(d) || price < 0 || d < 0) {
        box.querySelector("#final").textContent = "—";
        box.querySelector("#saved").textContent = "—";
        box.querySelector("#pct").textContent = "—";
        return;
      }
      var saved = price * d / 100;
      box.querySelector("#final").textContent = fmt(price - saved);
      box.querySelector("#saved").textContent = fmt(saved);
      box.querySelector("#pct").textContent = d + "%";
    }
    box.querySelector("#price").addEventListener("input", update);
    box.querySelector("#discount").addEventListener("input", update);
    box.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        box.querySelector("#discount").value = chip.dataset.d;
        update();
      });
    });
    update();
  }
});