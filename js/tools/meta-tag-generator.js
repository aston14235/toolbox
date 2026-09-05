ToolBox.define("meta-tag-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Site name</label><input type="text" id="site" placeholder="e.g. My Awesome Blog"></div>'
      + '<div class="field"><label>Page title</label><input type="text" id="title" placeholder="e.g. 10 Best Recipes of 2026"></div>'
      + "</div>"
      + '<div class="field"><label>Description</label><input type="text" id="desc" placeholder="One or two sentences that show up in search results…"></div>'
      + '<div class="split">'
      + '<div class="field"><label>Keywords (comma separated)</label><input type="text" id="keywords" placeholder="recipes, cooking, dinner"></div>'
      + '<div class="field"><label>Author</label><input type="text" id="author" placeholder="e.g. Jane Doe"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Canonical URL</label><input type="url" id="url" placeholder="https://example.com/post"></div>'
      + '<div class="field"><label>Twitter handle (no @)</label><input type="text" id="twitter" placeholder="myblog"></div>'
      + "</div>"
      + '<div class="field"><label>Social share image URL (optional)</label><input type="url" id="ogimg" placeholder="https://example.com/cover.jpg"></div>'
      + '<div class="controls">'
      + '<button class="btn primary" type="button" id="copy">📋 Copy tags</button>'
      + '<button class="btn" type="button" id="download">⬇️ Download .html</button>'
      + "</div>"
      + '<pre class="code-out" id="out" style="max-height:340px;overflow:auto;"></pre>'
      + "</div>";

    function esc(v) {
      return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function build() {
      var g = function (id) { return box.querySelector("#" + id).value.trim(); };
      var site = g("site"), title = g("title"), desc = g("desc"), keywords = g("keywords");
      var author = g("author"), url = g("url"), twitter = g("twitter"), ogimg = g("ogimg");
      var lines = [];
      lines.push('<!-- Primary -->');
      lines.push('<title>' + esc(title || "Untitled") + "</title>");
      lines.push('<meta name="description" content="' + esc(desc) + '">');
      if (keywords) lines.push('<meta name="keywords" content="' + esc(keywords) + '">');
      if (author) lines.push('<meta name="author" content="' + esc(author) + '">');
      if (url) lines.push('<link rel="canonical" href="' + esc(url) + '">');
      lines.push('<meta name="robots" content="index, follow">');
      lines.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
      lines.push("");
      lines.push('<!-- Open Graph (Facebook, WhatsApp, iMessage) -->');
      lines.push('<meta property="og:type" content="website">');
      lines.push('<meta property="og:site_name" content="' + esc(site || title) + '">');
      lines.push('<meta property="og:title" content="' + esc(title || site) + '">');
      lines.push('<meta property="og:description" content="' + esc(desc) + '">');
      if (url) lines.push('<meta property="og:url" content="' + esc(url) + '">');
      if (ogimg) lines.push('<meta property="og:image" content="' + esc(ogimg) + '">');
      lines.push("");
      lines.push('<!-- Twitter / X -->');
      lines.push('<meta name="twitter:card" content="summary_large_image">');
      if (twitter) lines.push('<meta name="twitter:site" content="@' + esc(twitter) + '">');
      lines.push('<meta name="twitter:title" content="' + esc(title || site) + '">');
      lines.push('<meta name="twitter:description" content="' + esc(desc) + '">');
      if (ogimg) lines.push('<meta name="twitter:image" content="' + esc(ogimg) + '">');
      return lines.join("\n");
    }
    function refresh() {
      box.querySelector("#out").textContent = build();
    }
    function status(msg) {
      var pre = box.querySelector("#out");
      var old = pre.textContent;
      var span = document.createElement("span");
      span.textContent = " ✓ " + msg;
      span.style.color = "var(--ok, #22c55e)";
      pre.appendChild(span);
      setTimeout(function () { pre.textContent = old; }, 1600);
    }
    ["site", "title", "desc", "keywords", "author", "url", "twitter", "ogimg"].forEach(function (id) {
      box.querySelector("#" + id).addEventListener("input", refresh);
    });
    box.querySelector("#copy").addEventListener("click", function () {
      var text = box.querySelector("#out").textContent;
      var done = function () { status("Copied to clipboard"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else fallbackCopy(text, done);
    });
    function fallbackCopy(text, done) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    box.querySelector("#download").addEventListener("click", function () {
      var blob = new Blob([box.querySelector("#out").textContent], { type: "text/html" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "meta-tags.html";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    box.querySelector("#site").value = "My Awesome Blog";
    box.querySelector("#title").value = "10 Best Recipes of 2026";
    box.querySelector("#desc").value = "Our all-time favorite weeknight recipes — tested, photographed, and ready in under 30 minutes.";
    box.querySelector("#keywords").value = "recipes, cooking, dinner";
    box.querySelector("#author").value = "Jane Doe";
    box.querySelector("#url").value = "https://example.com/best-recipes";
    box.querySelector("#twitter").value = "myblog";
    refresh();
  }
});