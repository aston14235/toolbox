ToolBox.define("sql-formatter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="run" class="btn primary">✨ Format</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<div class="field"><label>SQL</label>'
      + '<textarea id="input" class="mono" rows="10" spellcheck="false">select u.id,u.name,count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 and u.created_at>\'2024-01-01\' group by u.id,u.name having count(o.id)>2 order by orders desc limit 10;</textarea></div>'
      + '<div class="field"><label>Formatted</label>'
      + '<textarea id="output" class="mono" rows="10" readonly></textarea></div>'
      + "</div>";

    var KEYWORDS = ["select", "from", "where", "group by", "having", "order by", "limit", "offset", "join", "inner join", "left join", "right join", "full join", "cross join", "on", "and", "or", "not", "union", "union all", "insert into", "values", "update", "set", "delete from", "create table", "alter table", "drop table", "case", "when", "then", "else", "end", "as", "asc", "desc", "in", "between", "like", "is null", "is not null", "exists", "distinct"];

    function format(sql) {
      // tokenize: strings, numbers, identifiers, punctuation, words
      var re = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`|\b\d+(?:\.\d+)?\b|[(),;=<>!+\-*/]|[A-Za-z_][A-Za-z0-9_.]*|\s+/g;
      var tokens = sql.match(re) || [];
      var out = [];
      var indent = 0;
      var newlineBefore = false;
      var pad = function () { return "  ".repeat(indent); };

      function wordUp(t) { return t.toUpperCase(); }

      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (/^\s+$/.test(t)) continue;
        var up = wordUp(t);

        if (up === "SELECT" || up === "FROM" || up === "WHERE" || up === "GROUP BY" || up === "ORDER BY" || up === "HAVING" || up === "LIMIT" || up === "UNION" || up === "UNION ALL" || up === "INSERT INTO" || up === "UPDATE" || up === "DELETE FROM" || up === "CREATE TABLE" || up === "VALUES") {
          if (out.length) out.push("\n" + pad());
          out.push(up);
          newlineBefore = true;
          continue;
        }
        if (up === "JOIN" || up === "INNER JOIN" || up === "LEFT JOIN" || up === "RIGHT JOIN" || up === "FULL JOIN" || up === "CROSS JOIN") {
          out.push("\n" + pad() + up);
          newlineBefore = true;
          continue;
        }
        if (up === "ON") {
          out.push("\n" + pad() + "ON");
          newlineBefore = true;
          continue;
        }
        if (up === "AND" || up === "OR") {
          out.push("\n" + pad() + up);
          newlineBefore = true;
          continue;
        }
        if (up === "WHEN") {
          out.push("\n" + pad() + "WHEN");
          newlineBefore = true;
          continue;
        }
        if (up === "THEN" || up === "ELSE") {
          out.push(" " + up);
          newlineBefore = false;
          continue;
        }
        if (up === "END") {
          out.push("\n" + pad() + "END");
          continue;
        }
        if (t === ",") {
          out[out.length - 1] = out[out.length - 1].replace(/\s+$/, "") + ",";
          out.push("\n" + pad());
          newlineBefore = true;
          continue;
        }
        if (t === "(") {
          indent++;
          out.push("(");
          newlineBefore = false;
          continue;
        }
        if (t === ")") {
          indent = Math.max(0, indent - 1);
          out.push(")");
          newlineBefore = false;
          continue;
        }
        if (t === ";") {
          out.push(";");
          continue;
        }
        if (newlineBefore) {
          out.push(" " + t);
          newlineBefore = false;
        } else {
          out.push(" " + t);
        }
      }
      return out.join("").trim().replace(/ +/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
    }

    function run() {
      var src = box.querySelector("#input").value;
      var out = format(src);
      box.querySelector("#output").value = out;
      box.querySelector("#report").textContent = src.length + " → " + out.length + " chars";
    }
    box.querySelector("#run").addEventListener("click", run);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#output");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.value).then(done, done);
      else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    run();
  }
});