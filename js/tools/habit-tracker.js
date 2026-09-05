ToolBox.define("habit-tracker", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<input type="text" id="new" placeholder="New habit… e.g. Drink water, Read 20 min" style="flex:1; min-width:200px; padding:10px 12px;">'
      + '<button id="add" class="btn primary">➕ Add habit</button>'
      + "</div>"
      + '<div id="board"></div>'
      + '<p class="note-box">Tap a day to check it off. Your habits are saved in this browser only — a streak counts consecutive days ending today or yesterday.</p>'
      + "</div>";

    var KEY = "toolbox-habits";
    var board = box.querySelector("#board");
    var habits = [];
    try { habits = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { habits = []; }

    function dayKey(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function days() {
      var out = [];
      for (var i = 13; i >= 0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        out.push(d);
      }
      return out;
    }
    function save() {
      localStorage.setItem(KEY, JSON.stringify(habits));
    }
    function streakOf(log) {
      var n = 0;
      var d = new Date();
      if (!log[dayKey(d)]) d.setDate(d.getDate() - 1);
      while (log[dayKey(d)]) {
        n++;
        d.setDate(d.getDate() - 1);
      }
      return n;
    }
    function render() {
      if (!habits.length) {
        board.innerHTML = '<p class="muted center" style="padding:26px 0;">No habits yet — add one above ☝️</p>';
        return;
      }
      var ds = days();
      var today = dayKey(new Date());
      var html = '<table class="data"><thead><tr><th style="min-width:150px;">Habit</th>';
      ds.forEach(function (d) {
        html += '<th style="text-align:center;">' + "SMTWTFS"[d.getDay()] + (dayKey(d) === today ? "·" : "") + "</th>";
      });
      html += "<th>Streak</th><th></th></tr></thead><tbody>";
      habits.forEach(function (h, hi) {
        html += '<tr><td><strong>' + ToolBox.esc(h.name) + "</strong></td>";
        ds.forEach(function (d) {
          var k = dayKey(d);
          var on = !!h.log[k];
          html += '<td style="text-align:center;"><button data-h="' + hi + '" data-k="' + k + '" class="swatch' + (on ? " active" : "") + '" style="background:' + (on ? "var(--accent)" : "transparent") + '; width:24px; height:24px;" title="' + k + '"></button></td>';
        });
        var s = streakOf(h.log);
        html += '<td><span class="tag" style="' + (s >= 3 ? "color:var(--ok); background:rgba(74,222,128,0.12); border-color:rgba(74,222,128,0.3);" : "") + '">' + (s === 1 ? "1 day" : s + " days") + "</span></td>";
        html += '<td><button data-del="' + hi + '" class="mini-btn rm">🗑️</button></td></tr>';
      });
      html += "</tbody></table>";
      board.innerHTML = html;
    }

    board.addEventListener("click", function (e) {
      var cell = e.target.closest("[data-h]");
      if (cell) {
        var h = habits[+cell.dataset.h];
        var k = cell.dataset.k;
        if (h.log[k]) delete h.log[k];
        else h.log[k] = true;
        save();
        render();
        return;
      }
      var del = e.target.closest("[data-del]");
      if (del) {
        habits.splice(+del.dataset.del, 1);
        save();
        render();
      }
    });

    function add() {
      var v = box.querySelector("#new").value.trim();
      if (!v) return;
      habits.push({ name: v, log: {} });
      box.querySelector("#new").value = "";
      save();
      render();
    }
    box.querySelector("#add").addEventListener("click", add);
    box.querySelector("#new").addEventListener("keydown", function (e) {
      if (e.key === "Enter") add();
    });
    render();
  }
});