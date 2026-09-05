ToolBox.define("unit-converter", {
  render: function (box) {
    var UNITS = {
      length: { base: "meter", units: { "Meters (m)": 1, "Kilometers (km)": 1000, "Centimeters (cm)": 0.01, "Millimeters (mm)": 0.001, "Miles (mi)": 1609.344, "Yards (yd)": 0.9144, "Feet (ft)": 0.3048, "Inches (in)": 0.0254 } },
      weight: { base: "kg", units: { "Kilograms (kg)": 1, "Grams (g)": 0.001, "Milligrams (mg)": 1e-6, "Pounds (lb)": 0.453592, "Ounces (oz)": 0.0283495, "Stones (st)": 6.35029, "Metric tons (t)": 1000 } },
      volume: { base: "liter", units: { "Liters (L)": 1, "Milliliters (mL)": 0.001, "Cubic meters (m³)": 1000, "US gallons": 3.78541, "US quarts": 0.946353, "US pints": 0.473176, "US cups": 0.236588, "Fluid ounces (fl oz)": 0.0295735, "Teaspoons (tsp)": 0.00492892, "Tablespoons (tbsp)": 0.0147868 } },
      data: { base: "byte", units: { "Bytes (B)": 1, "Kilobytes (KB)": 1024, "Megabytes (MB)": 1048576, "Gigabytes (GB)": 1073741824, "Terabytes (TB)": 1099511627776, "Bits (b)": 0.125 } }
    };
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Category</label><select id="cat">'
      + Object.keys(UNITS).map(function (k) { return '<option value="' + k + '">' + k.charAt(0).toUpperCase() + k.slice(1) + "</option>"; }).join("")
      + "</select></div>"
      + '<div class="split">'
      + '<div class="field"><label>From</label>'
      + '<input type="number" id="value" placeholder="e.g. 5">'
      + '<select id="from"></select></div>'
      + '<div class="field"><label>To</label>'
      + '<div class="big-num" id="result">—</div>'
      + '<select id="to"></select></div>'
      + "</div>"
      + '<p class="note-box" style="margin-top:4px;">Temperature (Celsius/Fahrenheit/Kelvin) coming soon — use the planned tools list to request it.</p>'
      + "</div>";

    var catEl = box.querySelector("#cat");
    var fromEl = box.querySelector("#from");
    var toEl = box.querySelector("#to");
    var valueEl = box.querySelector("#value");

    function populate() {
      var u = UNITS[catEl.value].units;
      fromEl.innerHTML = "";
      toEl.innerHTML = "";
      Object.keys(u).forEach(function (name) {
        var o1 = document.createElement("option");
        o1.value = name; o1.textContent = name;
        var o2 = document.createElement("option");
        o2.value = name; o2.textContent = name;
        fromEl.appendChild(o1);
        toEl.appendChild(o2);
      });
      toEl.value = Object.keys(u)[1] || Object.keys(u)[0];
      convert();
    }
    function convert() {
      var u = UNITS[catEl.value].units;
      var v = Number(valueEl.value);
      if (isNaN(v) || valueEl.value === "") { box.querySelector("#result").textContent = "—"; return; }
      var base = v * u[fromEl.value];
      box.querySelector("#result").textContent = (base / u[toEl.value]).toLocaleString(undefined, { maximumFractionDigits: 8 });
    }
    catEl.addEventListener("change", populate);
    fromEl.addEventListener("change", convert);
    toEl.addEventListener("change", convert);
    valueEl.addEventListener("input", convert);
    populate();
  }
});