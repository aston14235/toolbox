ToolBox.define("paint-color-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Room length (m)</label><input type="number" id="length" placeholder="e.g. 4" min="0.5" step="0.1"></div>'
      + '<div class="field"><label>Room width (m)</label><input type="number" id="width" placeholder="e.g. 3.5" min="0.5" step="0.1"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Wall height (m)</label><input type="number" id="height" placeholder="e.g. 2.6" min="0.5" step="0.1"></div>'
      + '<div class="field"><label>Coverage (m² per liter per coat)</label><input type="number" id="coverage" value="10" min="1" step="0.5"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Doors</label><input type="number" id="doors" value="1" min="0" step="1"></div>'
      + '<div class="field"><label>Windows</label><input type="number" id="windows" value="1" min="0" step="1"></div>'
      + "</div>"
      + '<div class="controls"><label><input type="checkbox" id="ceiling" checked> Paint the ceiling too</label>'
      + '<label><input type="checkbox" id="coats2" checked> 2 coats (recommended)</label></div>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="area">—</div><div class="label">Paintable area</div></div>'
      + '<div class="stat"><div class="num" id="liters">—</div><div class="label">Paint needed</div></div>'
      + '<div class="stat"><div class="num" id="cans">—</div><div class="label">Best buy</div></div>'
      + "</div>"
      + "</div>";

    function update() {
      var len = Number(box.querySelector("#length").value);
      var wid = Number(box.querySelector("#width").value);
      var hei = Number(box.querySelector("#height").value);
      var cov = Number(box.querySelector("#coverage").value);
      var doors = Number(box.querySelector("#doors").value) || 0;
      var windows = Number(box.querySelector("#windows").value) || 0;
      var out = { area: box.querySelector("#area"), liters: box.querySelector("#liters"), cans: box.querySelector("#cans") };
      if (isNaN(len) || isNaN(wid) || isNaN(hei) || isNaN(cov) || len <= 0 || wid <= 0 || hei <= 0 || cov <= 0) {
        out.area.textContent = out.liters.textContent = out.cans.textContent = "—";
        return;
      }
      var walls = 2 * hei * (len + wid);
      var openings = doors * 1.9 + windows * 1.5; // avg door ~1.9m², window ~1.5m²
      var area = Math.max(0, walls - openings);
      if (box.querySelector("#ceiling").checked) area += len * wid;
      var coats = box.querySelector("#coats2").checked ? 2 : 1;
      var liters = area * coats / cov;

      // suggest the smallest can combination (10L, 5L, 2.5L, 1L)
      var sizes = [10, 5, 2.5, 1];
      var remaining = liters, buy = [];
      sizes.forEach(function (s) {
        while (remaining > 0.001 && remaining >= s * 0.999) {
          buy.push(s);
          remaining -= s;
        }
      });
      if (remaining > 0.001) buy.push(sizes[sizes.length - 1]);

      out.area.textContent = Math.round(area) + " m²";
      out.liters.textContent = liters.toFixed(1) + " L";
      var counts = {};
      buy.forEach(function (s) { counts[s] = (counts[s] || 0) + 1; });
      out.cans.textContent = Object.keys(counts).map(function (s) { return counts[s] + "×" + s + "L"; }).join(" + ");
    }

    ["length", "width", "height", "coverage", "doors", "windows"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", update);
    });
    box.querySelector("#ceiling").addEventListener("change", update);
    box.querySelector("#coats2").addEventListener("change", update);
    box.querySelector("#length").value = "4";
    box.querySelector("#width").value = "3.5";
    box.querySelector("#height").value = "2.6";
    update();
  }
});