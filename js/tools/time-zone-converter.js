ToolBox.define("time-zone-converter", {
  render: function (box) {
    var FALLBACK = ["UTC", "America/Los_Angeles", "America/New_York", "Europe/London", "Europe/Paris", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney", "Africa/Lagos", "America/Sao_Paulo"];
    var ZONES = (typeof Intl.supportedValuesOf === "function" && Intl.supportedValuesOf("timeZone").length)
      ? Intl.supportedValuesOf("timeZone")
      : FALLBACK;
    // 'UTC' isn't always reported by supportedValuesOf — make sure it's always pickable
    if (ZONES.indexOf("UTC") === -1) ZONES.unshift("UTC");

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>From time zone</label><select id="from-tz"></select></div>'
      + '<div class="field"><label>To time zone</label><select id="to-tz"></select></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Date</label><input type="date" id="date"></div>'
      + '<div class="field"><label>Time</label><input type="time" id="time"></div>'
      + "</div>"
      + '<div class="controls">'
      + '<button class="btn" type="button" id="now-btn">🕒 Use current time</button>'
      + '<span class="muted small">Times convert instantly as you change them.</span>'
      + "</div>"
      + '<div class="kv" style="margin-top:4px;">'
      + '<div class="row"><span id="from-label">—</span><code id="from-out" style="color:var(--text);font-weight:700;">—</code></div>'
      + '<div class="row"><span id="to-label">—</span><code id="to-out" style="color:var(--text);font-weight:700;">—</code></div>'
      + "</div>"
      + '<p class="note-box" style="margin-top:12px;" id="note"></p>'
      + "</div>";

    var fromEl = box.querySelector("#from-tz"), toEl = box.querySelector("#to-tz");
    var dateEl = box.querySelector("#date"), timeEl = box.querySelector("#time");

    ZONES.forEach(function (z) {
      var o1 = document.createElement("option"); o1.value = z; o1.textContent = z.replace(/_/g, " ");
      var o2 = document.createElement("option"); o2.value = z; o2.textContent = z.replace(/_/g, " ");
      fromEl.appendChild(o1); toEl.appendChild(o2);
    });
    var here = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return "UTC"; } })();
    if (ZONES.indexOf(here) !== -1) fromEl.value = here;
    var guess = here === "America/New_York" ? "Europe/London" : "America/New_York";
    if (ZONES.indexOf(guess) !== -1) toEl.value = guess;
    else toEl.value = ZONES[0];

    function zoneAbbr(tz, epoch) {
      try {
        return new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(epoch)
          .filter(function (p) { return p.type === "timeZoneName"; })[0].value;
      } catch (e) { return ""; }
    }
    function fmt(tz, epoch) {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz, weekday: "short", year: "numeric", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit", second: "2-digit"
      }).format(epoch) + " (" + zoneAbbr(tz, epoch) + ")";
    }

    // Treat (y,mo,d,h,mi) as a wall-clock time in `tz` and return the epoch ms.
    function wallToEpoch(tz, y, mo, d, h, mi) {
      var utc = Date.UTC(y, mo, d, h, mi);
      var dtf = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      var map = {};
      dtf.formatToParts(new Date(utc)).forEach(function (p) { map[p.type] = p.value; });
      var asUTC = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour % 24, +map.minute);
      return utc - (asUTC - utc);
    }

    function update() {
      var note = box.querySelector("#note");
      if (!fromEl.value || !toEl.value) {
        box.querySelector("#from-out").textContent = "—";
        box.querySelector("#to-out").textContent = "—";
        note.textContent = "Pick both time zones.";
        return;
      }
      if (!dateEl.value || !timeEl.value) {
        box.querySelector("#from-out").textContent = "—";
        box.querySelector("#to-out").textContent = "—";
        note.textContent = "Pick a date and time to see the conversion.";
        return;
      }
      var parts = dateEl.value.split("-");
      var tp = timeEl.value.split(":");
      var epoch = wallToEpoch(fromEl.value, +parts[0], +parts[1] - 1, +parts[2], +tp[0], +tp[1]);
      box.querySelector("#from-label").textContent = "In " + fromEl.value.replace(/_/g, " ");
      box.querySelector("#from-out").textContent = fmt(fromEl.value, epoch);
      box.querySelector("#to-label").textContent = "In " + toEl.value.replace(/_/g, " ");
      box.querySelector("#to-out").textContent = fmt(toEl.value, epoch);
      note.textContent = "Same instant, two clocks.";
    }

    function useNow() {
      var now = new Date();
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: fromEl.value, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      dateEl.value = map.year + "-" + map.month + "-" + map.day;
      timeEl.value = (map.hour % 24 < 10 ? "0" : "") + (map.hour % 24) + ":" + map.minute;
      update();
    }

    [fromEl, toEl].forEach(function (el) { el.addEventListener("change", update); });
    dateEl.addEventListener("input", update);
    timeEl.addEventListener("input", update);
    box.querySelector("#now-btn").addEventListener("click", useNow);
    useNow();
  }
});