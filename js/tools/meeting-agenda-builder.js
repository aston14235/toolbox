ToolBox.define("meeting-agenda-builder", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Meeting title</label><input type="text" id="title" value="Weekly Team Sync" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Date &amp; time</label><input type="datetime-local" id="when" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Duration (minutes)</label><input type="number" id="dur" value="30" min="5" step="5" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Attendees (comma separated)</label><input type="text" id="people" value="Alex, Sam, Jordan" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="field"><label>Agenda items — one per line</label>'
      + '<textarea id="items" rows="6" style="width:100%;">Review last week\u2019s progress&#10;Decide on the Q3 roadmap&#10;Open issues &amp; blockers</textarea></div>'
      + '<div class="controls">'
      + '<button id="gen" class="btn primary">✨ Generate agenda</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<button id="dl" class="btn">⬇️ Download .md</button>'
      + "</div>"
      + '<textarea id="out" readonly rows="12" style="width:100%; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.85rem;"></textarea>'
      + "</div>";

    function gen() {
      var title = box.querySelector("#title").value.trim() || "Meeting";
      var when = box.querySelector("#when").value;
      var dur = box.querySelector("#dur").value || "30";
      var people = box.querySelector("#people").value.trim();
      var items = box.querySelector("#items").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
      var whenTxt = when ? new Date(when).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "TBD";
      var L = [];
      L.push("# " + title);
      L.push("");
      L.push("**When:** " + whenTxt + " · **Duration:** " + dur + " min");
      if (people) L.push("**Attendees:** " + people);
      L.push("");
      L.push("## Agenda");
      if (items.length) {
        var per = Math.max(3, Math.floor((Number(dur) || 30) / Math.max(1, items.length)));
        items.forEach(function (it, i) {
          L.push((i + 1) + ". **" + it + "** (" + per + " min)");
        });
      } else L.push("1. _(add agenda items)_");
      L.push("");
      L.push("## Notes");
      L.push("- ");
      box.querySelector("#out").value = L.join("\n");
    }
    box.querySelector("#gen").addEventListener("click", gen);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#out");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.value).then(done, done);
      else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    box.querySelector("#dl").addEventListener("click", function () {
      var blob = new Blob([box.querySelector("#out").value], { type: "text/markdown" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "agenda.md";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    box.querySelector("#when").value = now.toISOString().slice(0, 16);
    gen();
  }
});