ToolBox.define("fuel-cost-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label><input type="radio" name="unit" value="metric" checked> Metric (km, L/100km)</label>'
      + '<label><input type="radio" name="unit" value="imperial"> Imperial (miles, MPG)</label>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label id="dist-label">Distance (km)</label><input type="number" id="dist" placeholder="e.g. 420" min="0" step="1"></div>'
      + '<div class="field"><label id="eff-label">Fuel efficiency (L/100km)</label><input type="number" id="eff" placeholder="e.g. 7.2" min="0.1" step="0.1"></div>'
      + "</div>"
      + '<div class="field"><label id="price-label">Fuel price (per liter, $)</label><input type="number" id="price" placeholder="e.g. 1.85" min="0" step="0.01"></div>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="fuel">—</div><div class="label">Fuel needed</div></div>'
      + '<div class="stat"><div class="num" id="cost">—</div><div class="label">Total cost</div></div>'
      + '<div class="stat"><div class="num" id="per-dist">—</div><div class="label">Cost per km</div></div>'
      + "</div>"
      + "</div>";

    function fmt(n) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }); }
    function money(n) { return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }); }

    function unit() { return box.querySelector('input[name="unit"]:checked').value; }

    function update() {
      var metric = unit() === "metric";
      box.querySelector("#dist-label").textContent = metric ? "Distance (km)" : "Distance (miles)";
      box.querySelector("#eff-label").textContent = metric ? "Fuel efficiency (L/100km)" : "Fuel efficiency (MPG)";
      box.querySelector("#price-label").textContent = metric ? "Fuel price (per liter, $)" : "Fuel price (per gallon, $)";

      var dist = Number(box.querySelector("#dist").value);
      var eff = Number(box.querySelector("#eff").value);
      var price = Number(box.querySelector("#price").value);
      if (isNaN(dist) || isNaN(eff) || isNaN(price) || dist <= 0 || eff <= 0 || price < 0) {
        box.querySelector("#fuel").textContent = box.querySelector("#cost").textContent =
          box.querySelector("#per-dist").textContent = "—";
        return;
      }
      var fuel, perKm;
      if (metric) {
        fuel = dist * eff / 100;            // liters
        perKm = fuel * price / dist;        // $ per km
      } else {
        fuel = dist / eff;                  // gallons
        perKm = fuel * price / dist;        // $ per mile
      }
      box.querySelector("#fuel").textContent = fmt(fuel) + (metric ? " L" : " gal");
      box.querySelector("#cost").textContent = money(fuel * price);
      box.querySelector("#per-dist").textContent = money(perKm) + (metric ? "/km" : "/mi");
    }

    box.querySelectorAll('input[name="unit"]').forEach(function (r) { r.addEventListener("change", update); });
    box.querySelector("#dist").addEventListener("input", update);
    box.querySelector("#eff").addEventListener("input", update);
    box.querySelector("#price").addEventListener("input", update);
    box.querySelector("#dist").value = "420";
    box.querySelector("#eff").value = "7.2";
    box.querySelector("#price").value = "1.85";
    update();
  }
});