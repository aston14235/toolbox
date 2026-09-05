ToolBox.define("bmr-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label><input type="radio" name="unit" value="metric" checked> Metric (cm, kg)</label>'
      + '<label><input type="radio" name="unit" value="imperial"> Imperial (ft/in, lb)</label>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Sex</label><select id="sex"><option value="male">Male</option><option value="female">Female</option></select></div>'
      + '<div class="field"><label>Age (years)</label><input type="number" id="age" placeholder="e.g. 28" min="1" max="120" step="1"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label id="height-label">Height (cm)</label><input type="number" id="height" placeholder="e.g. 175" min="50" step="0.5"></div>'
      + '<div class="field"><label id="weight-label">Weight (kg)</label><input type="number" id="weight" placeholder="e.g. 72" min="20" step="0.1"></div>'
      + "</div>"
      + '<div class="field"><label>Activity level</label><select id="activity">'
      + '<option value="1.2">Sedentary — little or no exercise</option>'
      + '<option value="1.375">Light — exercise 1–3×/week</option>'
      + '<option value="1.55" selected>Moderate — exercise 3–5×/week</option>'
      + '<option value="1.725">Active — exercise 6–7×/week</option>'
      + '<option value="1.9">Very active — hard training 2×/day</option>'
      + "</select></div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="bmr">—</div><div class="label">BMR (kcal/day)</div></div>'
      + '<div class="stat"><div class="num" id="tdee">—</div><div class="label">Daily calories</div></div>'
      + "</div>"
      + '<p class="note-box" style="margin-top:12px;">BMR (Basal Metabolic Rate) is what you burn at rest; daily calories adds your activity level on top. Uses the Mifflin-St Jeor formula.</p>'
      + "</div>";

    function unit() { return box.querySelector('input[name="unit"]:checked').value; }
    function update() {
      var metric = unit() === "metric";
      box.querySelector("#height-label").textContent = metric ? "Height (cm)" : "Height (ft · in)";
      box.querySelector("#weight-label").textContent = metric ? "Weight (kg)" : "Weight (lb)";
      var hRaw = box.querySelector("#height").value;
      var wRaw = box.querySelector("#weight").value;
      var age = Number(box.querySelector("#age").value);
      var sex = box.querySelector("#sex").value;
      if (metric) {
        var cm = Number(hRaw), kg = Number(wRaw);
        if (isNaN(cm) || isNaN(kg) || isNaN(age) || cm <= 0 || kg <= 0 || age <= 0) {
          box.querySelector("#bmr").textContent = box.querySelector("#tdee").textContent = "—";
          return;
        }
      } else {
        var m = /^(\d+)(?:\.(\d+))?$/.exec(String(hRaw));
        var ft = m ? +m[1] : NaN;
        var inch = m && m[2] ? +m[2] : 0;
        cm = (ft * 12 + inch) * 2.54;
        kg = Number(wRaw) * 0.45359237;
        if (isNaN(cm) || isNaN(kg) || isNaN(age) || cm <= 0 || kg <= 0 || age <= 0) {
          box.querySelector("#bmr").textContent = box.querySelector("#tdee").textContent = "—";
          return;
        }
      }
      var bmr = sex === "male"
        ? 10 * kg + 6.25 * cm - 5 * age + 5
        : 10 * kg + 6.25 * cm - 5 * age - 161;
      var mult = Number(box.querySelector("#activity").value);
      box.querySelector("#bmr").textContent = Math.round(bmr).toLocaleString();
      box.querySelector("#tdee").textContent = Math.round(bmr * mult).toLocaleString();
    }

    box.querySelectorAll('input[name="unit"]').forEach(function (r) { r.addEventListener("change", update); });
    box.querySelector("#sex").addEventListener("change", update);
    box.querySelector("#age").addEventListener("input", update);
    box.querySelector("#height").addEventListener("input", update);
    box.querySelector("#weight").addEventListener("input", update);
    box.querySelector("#activity").addEventListener("change", update);
    box.querySelector("#age").value = "28";
    box.querySelector("#height").value = "175";
    box.querySelector("#weight").value = "72";
    update();
  }
});