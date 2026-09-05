ToolBox.define("privacy-policy-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Site / app name</label><input type="text" id="site" placeholder="e.g. My Awesome App"></div>'
      + '<div class="field"><label>Contact email</label><input type="email" id="email" placeholder="privacy@example.com"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Operator / company</label><input type="text" id="owner" placeholder="e.g. Jane Doe (or company name)"></div>'
      + '<div class="field"><label>Effective date</label><input type="date" id="date"></div>'
      + "</div>"
      + '<div class="controls">'
      + '<label><input type="checkbox" id="gdpr" checked> Include GDPR section (EU visitors)</label>'
      + '<label><input type="checkbox" id="analytics"> I use analytics / cookies</label>'
      + "</div>"
      + '<div class="controls">'
      + '<button class="btn primary" type="button" id="copy">📋 Copy policy</button>'
      + '<button class="btn" type="button" id="download">⬇️ Download .md</button>'
      + "</div>"
      + '<textarea id="out" class="mono" rows="14" readonly style="width:100%;font-size:.85rem;"></textarea>'
      + "</div>";

    function build() {
      var g = function (id) { return box.querySelector("#" + id).value.trim(); };
      var site = g("site") || "this website";
      var email = g("email") || "you@example.com";
      var owner = g("owner") || "the site operator";
      var date = g("date") || new Date().toISOString().slice(0, 10);
      var gdpr = box.querySelector("#gdpr").checked;
      var analytics = box.querySelector("#analytics").checked;
      var L = [];
      L.push("# Privacy Policy for " + site);
      L.push("");
      L.push("**Effective date:** " + date);
      L.push("");
      L.push("This Privacy Policy explains how " + site + " (\u201Cwe\u201D, \u201Cus\u201D) collects, uses, and protects your information when you use our website. By using " + site + ", you agree to the practices described here.");
      L.push("");
      L.push("## 1. Information We Collect");
      L.push("");
      L.push("- **Information you provide:** anything you type, upload, or submit while using our services.");
      L.push("- **Automatic information:** browser type, device type, operating system, and pages visited, collected through standard web logs.");
      if (analytics) L.push("- **Cookies & analytics:** we use cookies and similar technologies to understand how visitors use the site and to improve it.");
      L.push("");
      L.push("## 2. How We Use Your Information");
      L.push("");
      L.push("We use the information we collect to provide and improve our services, respond to your requests, and keep the site secure.");
      L.push("");
      L.push("## 3. Data Storage & Security");
      L.push("");
      L.push("We take reasonable measures to protect your data. Where processing happens entirely in your browser (client-side), your content is never transmitted to our servers.");
      L.push("");
      L.push("## 4. Sharing of Information");
      L.push("");
      L.push("We do not sell your personal information. We only share data with third parties when required by law or when necessary to operate the service (for example, hosting providers).");
      if (gdpr) {
        L.push("");
        L.push("## 5. Your Rights (GDPR)");
        L.push("");
        L.push("If you are located in the European Economic Area, you have the right to access, correct, or delete your personal data, and to object to or restrict certain processing. To exercise any of these rights, contact us at " + email + ".");
      }
      L.push("");
      L.push("## " + (gdpr ? 6 : 5) + ". Contact");
      L.push("");
      L.push("Questions about this policy? Reach out to " + owner + " at " + email + ".");
      L.push("");
      L.push("---");
      L.push("*This policy was generated with ToolBox. It is a starting point, not legal advice — have a professional review it before going live.*");
      return L.join("\n");
    }
    function refresh() { box.querySelector("#out").value = build(); }
    function flash() {
      var out = box.querySelector("#out");
      out.style.outline = "2px solid var(--ok, #22c55e)";
      setTimeout(function () { out.style.outline = "none"; }, 1200);
    }
    ["site", "email", "owner", "date"].forEach(function (id) { box.querySelector("#" + id).addEventListener("input", refresh); });
    box.querySelector("#gdpr").addEventListener("change", refresh);
    box.querySelector("#analytics").addEventListener("change", refresh);
    box.querySelector("#copy").addEventListener("click", function () {
      var text = box.querySelector("#out").value;
      var done = function () { flash(); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      else fallback(text, done);
    });
    function fallback(text, done) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    box.querySelector("#download").addEventListener("click", function () {
      var blob = new Blob([box.querySelector("#out").value], { type: "text/markdown" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "privacy-policy.md";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    box.querySelector("#site").value = "My Awesome App";
    box.querySelector("#email").value = "privacy@example.com";
    box.querySelector("#owner").value = "Jane Doe";
    box.querySelector("#date").value = new Date().toISOString().slice(0, 10);
    refresh();
  }
});