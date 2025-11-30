// LocalStorage keys
const KEY_SALES = "sales_v2";
const KEY_EXPENSES = "expenses_v2";

// Data structure: [{ amount: 100, date: "2025-02-02" }]
let sales = [];
let expenses = [];

function loadData() {
  sales = JSON.parse(localStorage.getItem(KEY_SALES)) || [];
  expenses = JSON.parse(localStorage.getItem(KEY_EXPENSES)) || [];
}

function saveData() {
  localStorage.setItem(KEY_SALES, JSON.stringify(sales));
  localStorage.setItem(KEY_EXPENSES, JSON.stringify(expenses));
}

function updateDashboard() {
  const totalSales = sales.reduce((sum, x) => sum + x.amount, 0);
  const totalExpenses = expenses.reduce((sum, x) => sum + x.amount, 0);
  const profit = totalSales - totalExpenses;

  document.getElementById("totalSales").innerText = "₹" + totalSales;
  document.getElementById("totalExpenses").innerText = "₹" + totalExpenses;
  document.getElementById("netProfit").innerText = "₹" + profit;

  updateGrowthChart();
}

function addSale() {
  const amount = Number(document.getElementById("saleInput").value);
  const date = document.getElementById("saleDate").value || today();

  if (amount <= 0) return alert("Enter a valid Sale amount");

  sales.push({ amount, date });
  saveData();
  updateDashboard();
}

function addExpense() {
  const amount = Number(document.getElementById("expenseInput").value);
  const date = document.getElementById("expenseDate").value || today();

  if (amount <= 0) return alert("Enter a valid Expense amount");

  expenses.push({ amount, date });
  saveData();
  updateDashboard();
}

function clearAll() {
  if (!confirm("Clear ALL data?")) return;
  sales = [];
  expenses = [];
  saveData();
  updateDashboard();
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ----------------------
// Growth Chart
// ----------------------

let chart;

function updateGrowthChart() {
  const dates = [];
  const profits = [];

  // Collect unique dates
  const allDates = new Set();

  sales.forEach(s => allDates.add(s.date));
  expenses.forEach(e => allDates.add(e.date));

  const sortedDates = Array.from(allDates).sort();

  sortedDates.forEach(date => {
    const daySales = sales.filter(s => s.date === date)
                          .reduce((sum, x) => sum + x.amount, 0);
    const dayExpenses = expenses.filter(e => e.date === date)
                                .reduce((sum, x) => sum + x.amount, 0);
    const profit = daySales - dayExpenses;

    dates.push(date);
    profits.push(profit);
  });

  const ctx = document.getElementById("growthChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Profit Growth (Daily)",
        data: profits,
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        borderColor: "#1b72e8",
        pointRadius: 4,
        pointBackgroundColor: "#1b72e8"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// -------------------
// EVENT LISTENERS
// -------------------

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateDashboard();

  document.getElementById("addSaleBtn").addEventListener("click", addSale);
  document.getElementById("addExpenseBtn").addEventListener("click", addExpense);
  document.getElementById("clearAllBtn").addEventListener("click", clearAll);
});