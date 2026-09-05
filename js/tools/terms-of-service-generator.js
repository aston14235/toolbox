ToolBox.define("terms-of-service-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Site / app name</label><input type="text" id="site" value="My App" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Operator / company</label><input type="text" id="owner" value="Jane Doe LLC" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Contact email</label><input type="email" id="email" value="legal@example.com" style="padding:10px 12px;"></div>'
      + '<div class="field"><label>Effective date</label><input type="date" id="date" style="padding:10px 12px;"></div>'
      + "</div>"
      + '<div class="field"><label>Country / jurisdiction</label><input type="text" id="country" value="United States" style="padding:10px 12px;"></div>'
      + '<div class="controls">'
      + '<label><input type="checkbox" id="paid"> Paid service (billing terms)</label>'
      + '<label><input type="checkbox" id="liability" checked> Include liability disclaimer</label>'
      + "</div>"
      + '<div class="controls">'
      + '<button id="gen" class="btn primary">✨ Generate terms</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<button id="dl" class="btn">⬇️ Download .md</button>'
      + "</div>"
      + '<textarea id="out" readonly rows="14" style="width:100%; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.85rem;"></textarea>'
      + "</div>";

    function gen() {
      var site = box.querySelector("#site").value.trim() || "this website";
      var owner = box.querySelector("#owner").value.trim() || "the operator";
      var email = box.querySelector("#email").value.trim() || "you@example.com";
      var country = box.querySelector("#country").value.trim() || "your country";
      var date = box.querySelector("#date").value || new Date().toISOString().slice(0, 10);
      var paid = box.querySelector("#paid").checked;
      var liability = box.querySelector("#liability").checked;
      var L = [];
      L.push("# Terms of Service — " + site);
      L.push("");
      L.push("**Effective date:** " + date);
      L.push("");
      L.push("These Terms govern your use of " + site + " operated by " + owner + " (\u201Cwe\u201D, \u201Cus\u201D). By using " + site + ", you agree to these Terms. If you don\u2019t agree, please don\u2019t use the service.");
      L.push("");
      L.push("## 1. Use of the Service");
      L.push("");
      L.push("- You must be at least 13 years old (or the minimum age in your country) to use " + site + ".");
      L.push("- You agree not to misuse the service, attempt to break its security, or use it for anything unlawful.");
      L.push("- We may update the service or these Terms from time to time; continued use means you accept the changes.");
      L.push("");
      L.push("## 2. Your Content");
      L.push("");
      L.push("You keep ownership of anything you submit. By submitting content, you grant us a limited license to host and display it solely to operate the service.");
      L.push("");
      if (paid) {
        L.push("## 3. Billing & Subscriptions");
        L.push("");
        L.push("- Fees are charged in advance and are non-refundable except where required by law.");
        L.push("- You can cancel anytime; access continues until the end of the paid period.");
        L.push("- Prices may change with 30 days\u2019 notice.");
        L.push("");
      }
      L.push("## " + (paid ? 4 : 3) + ". Intellectual Property");
      L.push("");
      L.push("The service, its design and its code are owned by " + owner + " and protected by law. You get a personal, non-transferable license to use it.");
      L.push("");
      L.push("## " + (paid ? 5 : 4) + ". Termination");
      L.push("");
      L.push("We may suspend or terminate access if you violate these Terms. You can stop using the service at any time.");
      L.push("");
      L.push("## " + (paid ? 6 : 5) + ". Disclaimers");
      L.push("");
      L.push("The service is provided \u201Cas is\u201D without warranties of any kind, express or implied.");
      L.push("");
      if (liability) {
        L.push("## " + (paid ? 7 : 6) + ". Limitation of Liability");
        L.push("");
        L.push("To the maximum extent permitted by law, " + owner + " is not liable for indirect, incidental, or consequential damages arising from your use of " + site + ".");
        L.push("");
      }
      L.push("## " + (paid ? (liability ? 8 : 7) : (liability ? 7 : 6)) + ". Governing Law");
      L.push("");
      L.push("These Terms are governed by the laws of " + country + ".");
      L.push("");
      L.push("## " + (paid ? (liability ? 9 : 8) : (liability ? 8 : 7)) + ". Contact");
      L.push("");
      L.push("Questions? Contact " + owner + " at " + email + ".");
      L.push("");
      L.push("---");
      L.push("*Generated with ToolBox — a starting point, not legal advice.*");
      box.querySelector("#out").value = L.join("\n");
    }
    box.querySelector("#gen").addEventListener("click", gen);
    box.querySelector("#paid").addEventListener("change", gen);
    box.querySelector("#liability").addEventListener("change", gen);
    ["site", "owner", "email", "country", "date"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", gen);
    });
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#out");
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
      a.download = "terms-of-service.md";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    box.querySelector("#date").value = new Date().toISOString().slice(0, 10);
    gen();
  }
});