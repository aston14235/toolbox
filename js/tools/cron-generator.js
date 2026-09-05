ToolBox.define("cron-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Preset</label><select id="preset">'
      + '<option value="min">Every minute (* * * * *)</option>'
      + '<option value="5min">Every 5 minutes (*/5 * * * *)</option>'
      + '<option value="hour">Every hour (0 * * * *)</option>'
      + '<option value="day" selected>Daily at time (0 HH * * *)</option>'
      + '<option value="week">Weekly on weekday (0 HH * * W)</option>'
      + '<option value="month">Monthly on day (0 0 DD * *)</option>'
      + '<option value="custom">Custom…</option>'
      + "</select></div>"
      + '<div class="field"><label>Time (for daily/weekly)</label><input type="time" id="time" value="09:00"></div>'
      + "</div>"
      + '<div id="extra"></div>'
      + '<div class="controls">'
      + '<label>Minute <input type="text" id="f-min" style="width:80px;"></label>'
      + '<label>Hour <input type="text" id="f-hour" style="width:80px;"></label>'
      + '<label>Day of month <input type="text" id="f-dom" style="width:80px;"></label>'
      + '<label>Month <input type="text" id="f-mon" style="width:80px;"></label>'
      + '<label>Day of week <input type="text" id="f-dow" style="width:80px;"></label>'
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="cron" style="font-size:1.05rem;">—</div><div class="label">Cron expression</div></div>'
      + '<div class="stat"><div class="num" id="desc" style="font-size:1rem;">—</div><div class="label">In plain English</div></div>'
      + "</div>"
      + '<div id="next" class="file-list" style="margin-top:14px;"></div>'
      + "</div>";

    var f = function (id) { return box.querySelector("#" + id); };

    function describe(expr) {
      var p = expr.trim().split(/\s+/);
      if (p.length !== 5) return "Needs 5 fields";
      var m = p[0], h = p[1], dom = p[2], mon = p[3], dow = p[4];
      var bits = [];
      var mSingle = /^\d+$/.test(m), hSingle = /^\d+$/.test(h);
      if (mSingle && hSingle && dom === "*" && mon === "*" && dow === "*") {
        return "Daily at " + h.padStart(2, "0") + ":" + m.padStart(2, "0");
      }
      if (m === "*") bits.push("every minute");
      else if (m.indexOf("*/") === 0) bits.push("every " + m.slice(2) + " minutes");
      else if (mSingle) bits.push("minute " + m.padStart(2, "0"));
      else bits.push("minutes: " + m);
      if (h === "*") bits.push("of every hour");
      else if (h.indexOf("*/") === 0) bits.push("of every " + h.slice(2) + " hours");
      else if (hSingle) bits.push("at " + h.padStart(2, "0") + ":00");
      else bits.push("hours: " + h);
      if (dom !== "*") bits.push("on day " + dom + " of the month");
      if (mon !== "*") bits.push("in month " + mon);
      if (dow !== "*") bits.push("on weekday " + dow);
      return bits.join(", ").replace(/every minute, of every hour/g, "every minute");
    }

    function expand(field) {
      // expand "1-5" ranges and "1,3" lists into arrays of numbers; "*" and "*/n" handled elsewhere
      var out = [];
      field.split(",").forEach(function (part) {
        var r = /^(\d+)-(\d+)$/.exec(part);
        if (r) { for (var i = +r[1]; i <= +r[2]; i++) out.push(i); }
        else if (part !== "") out.push(+part);
      });
      return out;
    }
    function stepMatch(field) { return field.indexOf("*/") === 0 ? +field.slice(2) : 0; }
    function nextRuns(expr, count) {
      var p = expr.trim().split(/\s+/);
      if (p.length !== 5) return [];
      function matcher(field, v) {
        if (field === "*") return true;
        if (field.indexOf("*/") === 0) return v % +field.slice(2) === 0;
        return expand(field).indexOf(v) !== -1;
      }
      var runs = [], cur = new Date();
      cur.setSeconds(0, 0);
      for (var guard = 0; guard < 200000 && runs.length < count; guard++) {
        if (matcher(p[0], cur.getMinutes()) && matcher(p[1], cur.getHours()) && matcher(p[2], cur.getDate()) && matcher(p[3], cur.getMonth() + 1) && matcher(p[4], cur.getDay())) {
          runs.push(cur.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }));
        }
        cur = new Date(cur.getTime() + 60000);
      }
      return runs;
    }

    function update() {
      var expr = [f("f-min").value, f("f-hour").value, f("f-dom").value, f("f-mon").value, f("f-dow").value].join(" ");
      f("cron").textContent = expr;
      f("desc").textContent = describe(expr);
      var runs = nextRuns(expr, 5);
      f("next").innerHTML = '<strong class="small" style="opacity:.7;">Next 5 runs:</strong><ul style="margin:6px 0 0 18px;">'
        + (runs.length ? runs.map(function (r) { return "<li>" + r + "</li>"; }).join("") : '<li style="opacity:.6;">Couldn\u2019t compute — check the expression</li>')
        + "</ul>";
    }

    function setFields(fields) {
      ["f-min", "f-hour", "f-dom", "f-mon", "f-dow"].forEach(function (id, i) { f(id).value = fields[i]; });
    }
    function applyPreset() {
      var p = f("preset").value, t = f("time").value || "09:00";
      var hh = t.split(":")[0], mm = t.split(":")[1];
      if (p === "min") setFields(["*", "*", "*", "*", "*"]);
      else if (p === "5min") setFields(["*/5", "*", "*", "*", "*"]);
      else if (p === "hour") setFields(["0", "*", "*", "*", "*"]);
      else if (p === "day") setFields([mm, hh, "*", "*", "*"]);
      else if (p === "week") setFields([mm, hh, "*", "*", "1-5"]);
      else if (p === "month") setFields(["0", "0", "1", "*", "*"]);
      // custom: keep whatever is typed
      update();
    }
    f("preset").addEventListener("change", applyPreset);
    f("time").addEventListener("change", applyPreset);
    ["f-min", "f-hour", "f-dom", "f-mon", "f-dow"].forEach(function (id) { f(id).addEventListener("input", update); });
    applyPreset();
  }
});