ToolBox.define("text-reverser", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="input" placeholder="Type or paste text to reverse…" aria-label="Input text"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button class="btn" data-mode="chars">🔁 Reverse characters</button>'
      + '<button class="btn" data-mode="words">↔️ Reverse word order</button>'
      + '<button class="btn" data-mode="both">🔃 Reverse both</button>'
      + '<button class="btn" data-mode="mirror">🪞 Mirror each word</button>'
      + "</div>"
      + '<textarea id="output" readonly placeholder="Result appears here…" aria-label="Result" style="margin-top:12px;"></textarea>'
      + '<div class="controls" style="margin-top:16px;"><button id="copy" class="btn primary">📋 Copy result</button></div>'
      + "</div>";

    var input = box.querySelector("#input");
    var output = box.querySelector("#output");

    function run(mode) {
      var s = input.value;
      if (!s) { output.value = ""; return; }
      if (mode === "chars") output.value = s.split("").reverse().join("");
      if (mode === "words") output.value = s.split(/\s+/).reverse().join(" ");
      if (mode === "both") output.value = s.split("").reverse().join("").split(/\s+/).reverse().join(" ");
      if (mode === "mirror") output.value = s.split(" ").map(function (w) { return w.split("").reverse().join(""); }).join(" ");
    }
    box.querySelectorAll("[data-mode]").forEach(function (btn) {
      btn.addEventListener("click", function () { run(btn.dataset.mode); });
    });
    box.querySelector("#copy").addEventListener("click", function () {
      if (!output.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy result"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.value).then(done, function () { output.select(); done(); });
      } else { output.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
  }
});