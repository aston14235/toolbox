ToolBox.define("slug-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Title or phrase</label>'
      + '<input type="text" id="title" placeholder="e.g. 10 Best Coffee Shops in Paris!" style="padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1rem;"></div>'
      + '<div class="controls">'
      + '<label>Separator <select id="sep">'
      + '<option value="-">Dash (hello-world)</option>'
      + '<option value="_">Underscore (hello_world)</option>'
      + '<option value="">None (helloworld)</option>'
      + "</select></label>"
      + '<label><input type="checkbox" id="trim" checked> Trim stop words (the, and, of…)</label>'
      + "</div>"
      + '<label class="section-sub" style="display:block; margin-top:6px;"><strong>Slug</strong></label>'
      + '<pre class="code-out" id="out" style="max-height:none;">—</pre>'
      + '<div class="controls" style="margin-top:12px;"><button id="copy" class="btn primary">📋 Copy slug</button></div>'
      + "</div>";

    var STOP = new Set(("a an and are as at be but by for from has have how if in into is it its not of on or such that the their then there these they this to was were what when where which who will with your you").split(" "));

    function slugify(s, sep) {
      var words = s.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]+/g, "")
        .split(/\s+/).filter(Boolean);
      var keep = words;
      if (box.querySelector("#trim").checked) keep = words.filter(function (w) { return !STOP.has(w); });
      var slug = keep.join(sep);
      slug = slug.replace(new RegExp("(^|)" + sep + "{2,}", "g"), sep);
      return slug;
    }

    function update() {
      var title = box.querySelector("#title").value;
      var sep = box.querySelector("#sep").value;
      box.querySelector("#out").textContent = title ? slugify(title, sep) : "—";
    }

    box.querySelector("#title").addEventListener("input", update);
    box.querySelector("#sep").addEventListener("change", update);
    box.querySelector("#trim").addEventListener("change", update);
    box.querySelector("#copy").addEventListener("click", function () {
      var slug = box.querySelector("#out").textContent;
      if (!slug || slug === "—") return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy slug"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(slug).then(done, done);
      } else done();
    });
    update();
  }
});