const balance = document.getElementById("remaining-budget");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const budgetForm = document.getElementById("budget-form");

// Add elements to display total income, total expenses, and total money left
const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const totalMoneyLeftElement = document.getElementById("total-money-left");

// Retrieve transactions and budget from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let monthlyBudget = JSON.parse(localStorage.getItem("budget")) || 0;

// Add Transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!description || isNaN(amount) || !category) return;

  const transaction = {
    id: Date.now(),
    description,
    amount,
    category
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();
  transactionForm.reset();
});

// Save to LocalStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render Transactions
function renderTransactions() {
  transactionList.innerHTML = "";
  let totalIncome = 0,
    totalExpenses = 0;

  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${transaction.description} - Rs. ${transaction.amount > 0 ? "+" : ""}${transaction.amount} 
      [${transaction.category}]
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
    `;
    li.style.color = transaction.amount > 0 ? "green" : "red";
    transactionList.appendChild(li);

    if (transaction.amount > 0) totalIncome += transaction.amount;
    else totalExpenses += Math.abs(transaction.amount);
  });

  // Update the balance
  balance.textContent = `Rs. ${monthlyBudget - totalExpenses}`;

  // Highlight if over budget
  if (monthlyBudget > 0 && totalExpenses > monthlyBudget) {
    balance.style.color = "red";
    alert("Warning: You have exceeded your budget!");
  } else {
    balance.style.color = "green";
  }

  // Update total income, total expenses, and total money left
  totalIncomeElement.textContent = `Rs. ${totalIncome.toFixed(2)}`;
  totalExpensesElement.textContent = `Rs. ${totalExpenses.toFixed(2)}`;
  totalMoneyLeftElement.textContent = `Rs. ${(totalIncome - totalExpenses).toFixed(2)}`;
}

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveTransactions();
  renderTransactions();
}

// Set Budget
budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const budget = parseFloat(document.getElementById("budget-input").value);
  if (isNaN(budget) || budget <= 0) return;

  monthlyBudget = budget;
  localStorage.setItem("budget", JSON.stringify(monthlyBudget));
  renderTransactions();
});

// Initial Render on Page Load
function initialize() {
  renderTransactions();
}

// Call initialize to load previous transactions and budget
initialize();
