ToolBox.define("prime-checker", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Enter a number</label>'
      + '<input type="number" id="num" value="97" style="padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1.1rem; max-width:260px;"></div>'
      + '<div id="verdict" class="center" style="margin-top:10px;"></div>'
      + '<div id="rows" class="kv" style="margin-top:16px;"></div>'
      + "</div>";

    var numEl = box.querySelector("#num");

    function isPrime(n) {
      if (n < 2) return false;
      if (n < 4) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      for (var i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    }

    function factors(n) {
      var out = [];
      var m = n;
      for (var d = 2; d * d <= m; d++) {
        while (m % d === 0) { out.push(d); m /= d; }
      }
      if (m > 1) out.push(m);
      return out;
    }

    function nextPrime(n) {
      var x = Math.max(2, n + 1);
      while (!isPrime(x)) x++;
      return x;
    }

    function prevPrime(n) {
      var x = n - 1;
      while (x > 1 && !isPrime(x)) x--;
      return x > 1 ? x : null;
    }

    function update() {
      var n = Math.abs(Math.round(Number(numEl.value) || 0));
      var verdict = box.querySelector("#verdict");
      var rows = box.querySelector("#rows");
      var prime = isPrime(n);
      verdict.innerHTML = prime
        ? '<span class="badge" style="background:rgba(34,197,94,.18); color:var(--ok); font-size:1rem; padding:6px 18px;">✓ ' + n.toLocaleString() + " is prime</span>"
        : '<span class="badge" style="background:rgba(239,68,68,.16); color:var(--danger); font-size:1rem; padding:6px 18px;">✗ ' + n.toLocaleString() + " is not prime</span>";

      var rowsHtml = "";
      function row(label, val) {
        rowsHtml += '<div class="row"><span>' + label + "</span><code>" + val + "</code></div>";
      }
      if (!prime && n > 1) {
        row("Prime factorization", factors(n).join(" × "));
      }
      row("Next prime", nextPrime(n).toLocaleString());
      var pv = prevPrime(n);
      row("Previous prime", pv ? pv.toLocaleString() : "—");
      row("Even / odd", n % 2 === 0 ? "Even" : "Odd");
      row("Perfect square", Number.isInteger(Math.sqrt(n)) ? "Yes" : "No");
      rows.innerHTML = rowsHtml;
    }

    numEl.addEventListener("input", update);
    update();
  }
});