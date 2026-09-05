ToolBox.define("ip-lookup", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="mine" class="btn primary">📍 Look up my IP</button>'
      + '<span class="muted small">or enter any IP:</span>'
      + '<input type="text" id="ip" placeholder="e.g. 8.8.8.8" style="flex:1; min-width:160px; padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);">'
      + '<button id="go" class="btn">🔍 Look up</button>'
      + "</div>"
      + '<div class="kv">'
      + '<div class="row"><span>IP address</span><code id="r-ip" style="color:var(--text);font-weight:700;">—</code></div>'
      + '<div class="row"><span>Type</span><code id="r-type" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Location</span><code id="r-loc" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Country / flag</span><code id="r-country" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>ISP / org</span><code id="r-isp" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Timezone</span><code id="r-tz" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Coordinates</span><code id="r-coords" style="color:var(--text);">—</code></div>'
      + "</div>"
      + '<p class="note-box" id="status">Your IP is only sent to a public lookup API — no other data leaves this page.</p>'
      + "</div>";

    function lookup(ip) {
      var status = box.querySelector("#status");
      status.textContent = "Looking up…";
      status.style.color = "";
      var url = "https://ipwho.is/" + encodeURIComponent(ip || "");
      fetch(url)
        .then(function (r) { if (!r.ok) throw new Error("bad response"); return r.json(); })
        .then(function (j) {
          if (!j.success) throw new Error(j.message || "lookup failed");
          box.querySelector("#r-ip").textContent = j.ip;
          box.querySelector("#r-type").textContent = j.type || "—";
          box.querySelector("#r-loc").textContent = [j.city, j.region, j.country].filter(Boolean).join(", ") || "—";
          box.querySelector("#r-country").textContent = (j.flag ? j.flag.emoji + " " : "") + (j.country || "—");
          box.querySelector("#r-isp").textContent = (j.connection && j.connection.isp) || "—";
          box.querySelector("#r-tz").textContent = j.timezone && j.timezone.id ? j.timezone.id : "—";
          box.querySelector("#r-coords").textContent = (j.latitude != null && j.longitude != null) ? j.latitude + ", " + j.longitude : "—";
          status.textContent = "✅ Done.";
          status.style.color = "var(--ok)";
        })
        .catch(function (e) {
          status.textContent = "⚠️ Couldn\u2019t reach the lookup service (offline or blocked?). Error: " + (e.message || e);
          status.style.color = "var(--danger)";
        });
    }
    box.querySelector("#mine").addEventListener("click", function () { lookup(""); });
    box.querySelector("#go").addEventListener("click", function () { lookup(box.querySelector("#ip").value.trim()); });
    box.querySelector("#ip").addEventListener("keydown", function (e) { if (e.key === "Enter") lookup(box.querySelector("#ip").value.trim()); });
  }
});