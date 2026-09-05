ToolBox.define("travel-itinerary-planner", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Trip name</label><input type="text" id="name" value="Summer in Tokyo" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Start date</label><input type="date" id="start" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Destination</label><input type="text" id="dest" value="Tokyo, Japan" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Nights</label><input type="number" id="nights" value="4" min="1" max="30" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="field"><label>Per-day plan — one line per day (optional)</label>'
      + '<textarea id="days" rows="5" style="width:100%;" placeholder="e.g. Senso-ji temple, teamLab Borderless&#10;Shibuya crossing, Meiji shrine, shopping&#10;Day trip to Kamakura"></textarea></div>'
      + '<div class="field"><label>Notes / packing / budget</label>'
      + '<textarea id="notes" rows="3" style="width:100%;" placeholder="e.g. JR Pass for 7 days, ~¥50,000 budget"></textarea></div>'
      + '<div class="controls">'
      + '<button id="gen" class="btn primary">✨ Build itinerary</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<button id="dl" class="btn">⬇️ Download .md</button>'
      + "</div>"
      + '<textarea id="out" readonly rows="14" style="width:100%; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.85rem;"></textarea>'
      + "</div>";

    function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function gen() {
      var name = box.querySelector("#name").value.trim() || "My Trip";
      var dest = box.querySelector("#dest").value.trim() || "Destination";
      var start = box.querySelector("#start").value;
      var nights = Number(box.querySelector("#nights").value) || 1;
      var plans = box.querySelector("#days").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
      var notes = box.querySelector("#notes").value.trim();
      var L = [];
      L.push("# " + name + " — " + dest);
      L.push("");
      var d = start ? new Date(start + "T00:00:00") : null;
      for (var i = 0; i <= nights; i++) {
        var label = i === 0 ? "Day 1 — Arrival" : i === nights ? "Day " + (i + 1) + " — Departure" : "Day " + (i + 1);
        if (d) label += " (" + d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) + ")";
        L.push("## " + label);
        L.push(plans[i] ? "- " + plans[i] : "- _(free day)_");
        L.push("");
        if (d) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      }
      if (notes) {
        L.push("## Notes & budget");
        L.push(notes.split("\n").map(function (s) { return "- " + s; }).join("\n"));
        L.push("");
      }
      L.push("---");
      L.push("_Generated with ToolBox_");
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
      a.download = "itinerary.md";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    box.querySelector("#start").value = iso(new Date());
    gen();
  }
});