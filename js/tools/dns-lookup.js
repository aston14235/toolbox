ToolBox.define("dns-lookup", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Domain</label><input type="text" id="domain" value="google.com" placeholder="example.com" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Record type</label><select id="type">'
      + '<option value="A">A (IPv4)</option>'
      + '<option value="AAAA">AAAA (IPv6)</option>'
      + '<option value="MX">MX (mail)</option>'
      + '<option value="TXT">TXT</option>'
      + '<option value="NS">NS (nameservers)</option>'
      + '<option value="CNAME">CNAME</option>'
      + "</select></div>"
      + "</div>"
      + '<div class="controls"><button id="go" class="btn primary">🔍 Look up</button></div>'
      + '<div id="results"></div>'
      + '<p class="note-box" id="status">Queries go through Cloudflare\u2019s public DNS-over-HTTPS — no DNS server config needed, works from any browser.</p>'
      + "</div>";

    function lookup() {
      var domain = box.querySelector("#domain").value.trim();
      var type = box.querySelector("#type").value;
      var res = box.querySelector("#results");
      var status = box.querySelector("#status");
      if (!domain) return;
      status.textContent = "Querying " + domain + "…";
      status.style.color = "";
      fetch("https://cloudflare-dns.com/dns-query?name=" + encodeURIComponent(domain) + "&type=" + type, { headers: { accept: "application/dns-json" } })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (j) {
          var answers = j.Answer || [];
          if (!answers.length) {
            res.innerHTML = '<p class="note-box">No ' + type + " records found for " + ToolBox.esc(domain) + ".</p>";
            status.textContent = "Done — no records.";
            status.style.color = "var(--ok)";
            return;
          }
          var html = '<table class="data"><thead><tr><th>Name</th><th>Type</th><th>TTL</th><th>Value</th></tr></thead><tbody>';
          answers.forEach(function (a) {
            html += "<tr><td>" + ToolBox.esc(a.name) + "</td><td>" + ToolBox.esc(a.type) + "</td><td>" + a.TTL + "</td><td style=\"word-break:break-all;\">" + ToolBox.esc(a.data) + "</td></tr>";
          });
          res.innerHTML = html + "</tbody></table>";
          status.textContent = "✅ " + answers.length + " record" + (answers.length === 1 ? "" : "s") + " from Cloudflare DoH.";
          status.style.color = "var(--ok)";
        })
        .catch(function (e) {
          res.innerHTML = "";
          status.textContent = "⚠️ Couldn\u2019t reach the DNS service (offline or blocked?). Error: " + (e.message || e);
          status.style.color = "var(--danger)";
        });
    }
    box.querySelector("#go").addEventListener("click", lookup);
    box.querySelector("#domain").addEventListener("keydown", function (e) { if (e.key === "Enter") lookup(); });
    box.querySelector("#type").addEventListener("change", lookup);
  }
});