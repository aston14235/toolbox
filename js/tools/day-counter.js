ToolBox.define("day-counter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Start date</label><input type="date" id="start"></div>'
      + '<div class="field"><label>End date</label><input type="date" id="end"></div>'
      + "</div>"
      + '<div class="controls"><label><input type="checkbox" id="inclusive"> Count the end day too (e.g. trips)</label></div>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="days">—</div><div class="label">Total days</div></div>'
      + '<div class="stat"><div class="num" id="weeks">—</div><div class="label">Weeks + days</div></div>'
      + '<div class="stat"><div class="num" id="workdays">—</div><div class="label">Weekdays</div></div>'
      + '<div class="stat"><div class="num" id="weekends">—</div><div class="label">Weekend days</div></div>'
      + "</div>"
      + '<p class="note-box" id="note" style="margin-top:12px;"></p>'
      + "</div>";

    function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

    function isoLocal(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    function update() {
      var sEl = box.querySelector("#start"), eEl = box.querySelector("#end");
      var s = sEl.value ? new Date(sEl.value + "T00:00:00") : null;
      var e = eEl.value ? new Date(eEl.value + "T00:00:00") : null;
      var out = {
        days: box.querySelector("#days"), weeks: box.querySelector("#weeks"),
        workdays: box.querySelector("#workdays"), weekends: box.querySelector("#weekends"),
        note: box.querySelector("#note")
      };
      if (!s || !e || isNaN(s.getTime()) || isNaN(e.getTime())) {
        ["days", "weeks", "workdays", "weekends"].forEach(function (k) { out[k].textContent = "—"; });
        out.note.textContent = "Pick both dates to count the days between them.";
        return;
      }
      var rev = s > e;
      if (rev) { var tmp = s; s = e; e = tmp; }
      var inclusive = box.querySelector("#inclusive").checked;
      var wd = 0, we = 0, days = 0, cur = new Date(s);
      // count the same span for every number: exclusive by default, inclusive if checked
      var last = inclusive ? new Date(e) : new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1);
      while (cur <= last) {
        days++;
        var day = cur.getDay();
        if (day === 0 || day === 6) we++; else wd++;
        cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
      }
      out.days.textContent = days.toLocaleString();
      out.weeks.textContent = Math.floor(days / 7) + " w " + (days % 7) + " d";
      out.workdays.textContent = wd.toLocaleString();
      out.weekends.textContent = we.toLocaleString();

      // approximate months+days for a friendlier readout
      var y = e.getFullYear() - s.getFullYear(), m = e.getMonth() - s.getMonth(), d = e.getDate() - s.getDate();
      if (d < 0) { m--; d += daysInMonth(e.getFullYear(), e.getMonth() - 1); }
      if (m < 0) { y--; m += 12; }
      var human = (y ? y + " year" + (y === 1 ? "" : "s") + " " : "") + (m ? m + " month" + (m === 1 ? "" : "s") + " " : "") + d + " day" + (d === 1 ? "" : "s");
      out.note.textContent = rev
        ? "That\u2019s " + human + " (counting from the later date back)."
        : "That\u2019s " + human + " between the two dates."
          + (box.querySelector("#inclusive").checked ? "" : " — tick \u201Ccount the end day\u201D if the last day counts.");
    }

    box.querySelector("#start").addEventListener("input", update);
    box.querySelector("#end").addEventListener("input", update);
    box.querySelector("#inclusive").addEventListener("change", update);
    var now = new Date();
    box.querySelector("#end").value = isoLocal(now);
    box.querySelector("#start").value = isoLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7));
    update();
  }
});