ToolBox.define("age-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Date of birth</label><input type="date" id="dob" max=""></div>'
      + '<div class="field"><label>On date</label><input type="date" id="on"></div>'
      + "</div>"
      + '<div class="stats" style="margin-top:8px;">'
      + '<div class="stat"><div class="num" id="years">—</div><div class="label">Years</div></div>'
      + '<div class="stat"><div class="num" id="months">—</div><div class="label">Months</div></div>'
      + '<div class="stat"><div class="num" id="days">—</div><div class="label">Days</div></div>'
      + '<div class="stat"><div class="num" id="total-days">—</div><div class="label">Total days</div></div>'
      + '<div class="stat"><div class="num" id="weekday">—</div><div class="label">Born on</div></div>'
      + '<div class="stat"><div class="num" id="next-bday">—</div><div class="label">Next birthday in</div></div>'
      + "</div></div>";

    var dobEl = box.querySelector("#dob");
    var onEl = box.querySelector("#on");

    function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

    function calc() {
      var dobVal = dobEl.value, onVal = onEl.value;
      var dob = dobVal ? new Date(dobVal + "T00:00:00") : null;
      var on = onVal ? new Date(onVal + "T00:00:00") : new Date();
      on = new Date(on.getFullYear(), on.getMonth(), on.getDate());
      if (!dob || isNaN(dob.getTime()) || dob > on) {
        box.querySelector("#years").textContent = "—";
        box.querySelector("#months").textContent = "—";
        box.querySelector("#days").textContent = "—";
        box.querySelector("#total-days").textContent = "—";
        box.querySelector("#weekday").textContent = "—";
        box.querySelector("#next-bday").textContent = "—";
        return;
      }
      var y = on.getFullYear() - dob.getFullYear();
      var m = on.getMonth() - dob.getMonth();
      var d = on.getDate() - dob.getDate();
      if (d < 0) { m--; d += daysInMonth(on.getFullYear(), on.getMonth() - 1); }
      if (m < 0) { y--; m += 12; }
      box.querySelector("#years").textContent = y;
      box.querySelector("#months").textContent = m;
      box.querySelector("#days").textContent = d;

      var totalDays = Math.round((on - dob) / 86400000);
      box.querySelector("#total-days").textContent = totalDays.toLocaleString();
      box.querySelector("#weekday").textContent = dob.toLocaleDateString(undefined, { weekday: "long" });

      var next = new Date(on.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < on) next = new Date(on.getFullYear() + 1, dob.getMonth(), dob.getDate());
      var diff = Math.round((next - on) / 86400000);
      box.querySelector("#next-bday").textContent = diff === 0 ? "Today 🎉" : diff + " days";
    }

    dobEl.addEventListener("input", calc);
    onEl.addEventListener("input", calc);
    var now = new Date();
    onEl.value = now.toISOString().slice(0, 10);
    var def = new Date(now.getFullYear() - 25, now.getMonth(), now.getDate());
    dobEl.value = def.toISOString().slice(0, 10);
    dobEl.max = now.toISOString().slice(0, 10);
    calc();
  }
});