ToolBox.define("loan-calculator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Loan amount ($)</label><input type="number" id="amount" placeholder="e.g. 30000" min="0" step="100"></div>'
      + '<div class="field"><label>Annual interest rate (%)</label><input type="number" id="rate" placeholder="e.g. 6.5" min="0" step="0.01"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Term (years)</label><input type="number" id="years" placeholder="e.g. 5" min="1" max="40" step="1"></div>'
      + '<div class="field"><label>Extra payment / month ($)</label><input type="number" id="extra" placeholder="e.g. 100 (optional)" min="0" step="10"></div>'
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="payment">—</div><div class="label">Monthly payment</div></div>'
      + '<div class="stat"><div class="num" id="total">—</div><div class="label">Total paid</div></div>'
      + '<div class="stat"><div class="num" id="interest">—</div><div class="label">Total interest</div></div>'
      + '<div class="stat"><div class="num" id="payoff">—</div><div class="label">Payoff time</div></div>'
      + "</div>"
      + '<p class="note-box" style="margin-top:12px;" id="note"></p>'
      + "</div>";

    function fmt(n) { return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }); }

    function update() {
      var amt = Number(box.querySelector("#amount").value);
      var apr = Number(box.querySelector("#rate").value);
      var yrs = Number(box.querySelector("#years").value);
      var extra = Number(box.querySelector("#extra").value) || 0;
      var note = box.querySelector("#note");
      if (isNaN(amt) || isNaN(apr) || isNaN(yrs) || amt <= 0 || apr < 0 || yrs <= 0) {
        box.querySelector("#payment").textContent = box.querySelector("#total").textContent =
          box.querySelector("#interest").textContent = box.querySelector("#payoff").textContent = "—";
        note.textContent = "Enter the loan amount, rate and term to see your payment.";
        return;
      }
      var r = apr / 100 / 12;
      var n = Math.round(yrs * 12);
      var pay;
      if (r === 0) pay = amt / n;
      else pay = amt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      var base = pay;
      if (extra > 0) pay += extra;

      // simulate to find payoff time with the extra payment
      var bal = amt, months = 0, interestPaid = 0;
      while (bal > 0 && months < 1200) {
        var ip = bal * r;
        interestPaid += ip;
        var pp = pay - ip;
        if (pp <= 0) break;
        bal -= pp;
        months++;
      }
      var realTotal = pay * months;
      var saved = (base * n - amt) - (realTotal - amt);

      box.querySelector("#payment").textContent = fmt(pay);
      box.querySelector("#total").textContent = fmt(realTotal);
      box.querySelector("#interest").textContent = fmt(interestPaid);
      box.querySelector("#payoff").textContent = months + " mo";
      if (extra > 0) {
        note.textContent = "With the extra $" + Number(extra).toFixed(0) + "/mo you finish "
          + Math.max(0, n - months) + " months early and save " + fmt(saved) + " in interest.";
      } else {
        note.textContent = "Standard " + yrs + "-year term — this payment stays fixed for the whole loan.";
      }
    }

    box.querySelector("#amount").addEventListener("input", update);
    box.querySelector("#rate").addEventListener("input", update);
    box.querySelector("#years").addEventListener("input", update);
    box.querySelector("#extra").addEventListener("input", update);
    box.querySelector("#amount").value = "30000";
    box.querySelector("#rate").value = "6.5";
    box.querySelector("#years").value = "5";
    update();
  }
});