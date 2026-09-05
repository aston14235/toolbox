ToolBox.define("json-formatter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="format" class="btn primary">✨ Format</button>'
      + '<button id="minify" class="btn">🗜️ Minify</button>'
      + '<button id="clear" class="btn ghost">🗑️ Clear</button>'
      + '<span id="status" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<label class="section-sub" style="margin-bottom:8px; display:block;"><strong>Input JSON</strong></label>'
      + '<textarea id="input" class="mono" placeholder=\'{"key": "value"}\' aria-label="Input JSON"></textarea>'
      + '<label class="section-sub" style="margin:16px 0 8px; display:block;"><strong>Output</strong></label>'
      + '<textarea id="output" class="mono" readonly aria-label="Formatted JSON"></textarea>'
      + "</div>";

    var input = box.querySelector("#input");
    var output = box.querySelector("#output");
    var status = box.querySelector("#status");

    function run(mode) {
      var raw = input.value.trim();
      if (!raw) { status.textContent = ""; output.value = ""; return; }
      try {
        var parsed = JSON.parse(raw);
        output.value = mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
        status.textContent = "✅ Valid JSON";
        status.style.color = "var(--ok)";
      } catch (e) {
        status.textContent = "❌ " + e.message;
        status.style.color = "var(--danger)";
        output.value = "";
      }
    }
    box.querySelector("#format").addEventListener("click", function () { run("format"); });
    box.querySelector("#minify").addEventListener("click", function () { run("minify"); });
    box.querySelector("#clear").addEventListener("click", function () {
      input.value = ""; output.value = ""; status.textContent = "";
    });
  }
});