ToolBox.define("todo-list", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<input type="text" id="new-item" placeholder="Add a task and press Enter…" style="flex:1; min-width:200px; padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);">'
      + '<button id="add" class="btn primary">＋ Add</button>'
      + '<button id="clear-done" class="btn ghost danger">🗑️ Clear done</button>'
      + "</div>"
      + '<div id="list"></div>'
      + '<p id="empty" class="muted center" style="padding:20px 0;">Nothing here yet — add your first task above.</p>'
      + '<p class="note-box">Your list is saved in this browser automatically.</p>'
      + "</div>";

    var KEY = "toolbox-todos";
    var items = [];
    try { items = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { items = []; }
    var listEl = box.querySelector("#list");
    var emptyEl = box.querySelector("#empty");

    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    }
    function render() {
      listEl.innerHTML = "";
      items.forEach(function (item, i) {
        var row = document.createElement("div");
        row.className = "todo-row" + (item.done ? " done" : "");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!item.done;
        cb.setAttribute("aria-label", "Mark done");
        cb.addEventListener("change", function () {
          items[i].done = cb.checked;
          save();
          render();
        });
        var span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = item.text;
        var rm = document.createElement("button");
        rm.className = "mini-btn rm";
        rm.textContent = "✕";
        rm.title = "Delete";
        rm.addEventListener("click", function () {
          items.splice(i, 1);
          save();
          render();
        });
        row.appendChild(cb);
        row.appendChild(span);
        row.appendChild(rm);
        listEl.appendChild(row);
      });
      emptyEl.style.display = items.length ? "none" : "";
      box.querySelector("#clear-done").disabled = !items.some(function (i) { return i.done; });
    }
    function add() {
      var input = box.querySelector("#new-item");
      var v = input.value.trim();
      if (!v) return;
      items.push({ text: v, done: false });
      input.value = "";
      save();
      render();
      input.focus();
    }
    box.querySelector("#add").addEventListener("click", add);
    box.querySelector("#new-item").addEventListener("keydown", function (e) {
      if (e.key === "Enter") add();
    });
    box.querySelector("#clear-done").addEventListener("click", function () {
      items = items.filter(function (i) { return !i.done; });
      save();
      render();
    });
    render();
  }
});