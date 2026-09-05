ToolBox.define("notepad", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="save" class="btn primary">⬇️ Save as .txt</button>'
      + '<button id="clear" class="btn ghost danger">🗑️ Clear</button>'
      + '<span class="tag" id="saved-hint" style="visibility:hidden;">Draft saved ✓</span>'
      + "</div>"
      + '<textarea id="text" placeholder="Start typing or paste your notes here…" aria-label="Notes"></textarea>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="words">0</div><div class="label">Words</div></div>'
      + '<div class="stat"><div class="num" id="chars">0</div><div class="label">Characters</div></div>'
      + '<div class="stat"><div class="num" id="lines">1</div><div class="label">Lines</div></div>'
      + "</div></div>";

    var ta = box.querySelector("#text");
    var KEY = "toolbox-notepad-draft";

    function update() {
      var v = ta.value;
      box.querySelector("#words").textContent = v.trim() ? v.trim().split(/\s+/).length : 0;
      box.querySelector("#chars").textContent = v.length;
      box.querySelector("#lines").textContent = v ? v.split("\n").length : 1;
    }

    var saveTimer = null;
    ta.addEventListener("input", function () {
      update();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        try { localStorage.setItem(KEY, ta.value); } catch (e) {}
        var hint = box.querySelector("#saved-hint");
        hint.style.visibility = "visible";
        setTimeout(function () { hint.style.visibility = "hidden"; }, 1200);
      }, 400);
    });

    try {
      var draft = localStorage.getItem(KEY);
      if (draft) ta.value = draft;
    } catch (e) {}
    update();

    box.querySelector("#save").addEventListener("click", function () {
      var blob = new Blob([ta.value], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "note.txt";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    });

    box.querySelector("#clear").addEventListener("click", function () {
      if (!ta.value || window.confirm("Clear the entire note?")) {
        ta.value = "";
        try { localStorage.removeItem(KEY); } catch (e) {}
        update();
        ta.focus();
      }
    });
  }
});