// ==========================================================
// Personal Finance Tracker - dashboard.js
// Working Features:
// ✅ Load dashboard
// ✅ Add transaction
// ✅ Delete transaction
// ✅ Save financial goal
// ✅ Show current goal
// ✅ Export CSV
// ✅ Export PDF
// ✅ AI Insights
// ✅ Logout
// ==========================================================

// API base URL from config.js
const API_BASE_URL =
    typeof BASE_URL !== "undefined"
        ? BASE_URL
        : "http://localhost:8080";

// ==========================================================
// INITIALIZE DASHBOARD
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/index.html";
        return;
    }

    loadDashboard();
    loadGoal();
});

// ==========================================================
// LOAD DASHBOARD
// ==========================================================
async function loadDashboard() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/transactions/user/${userId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const transactions = await response.json();

        const table = document.getElementById("transactionTable");
        table.innerHTML = "";

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(txn => {
            const amount = Number(txn.amount) || 0;

            if ((txn.type || "").toUpperCase() === "INCOME") {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }

            const id = txn.transactionId || txn.id;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${txn.txnDate || ""}</td>
                <td>${txn.type || ""}</td>
                <td>₹ ${amount.toFixed(2)}</td>
                <td>${txn.category || ""}</td>
                <td>${txn.description || ""}</td>
                <td>
                    <button onclick="deleteTransaction(${id})">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

        // Update summary
        document.getElementById("totalIncome").textContent =
            totalIncome.toFixed(2);

        document.getElementById("totalExpense").textContent =
            totalExpense.toFixed(2);

        document.getElementById("balance").textContent =
            (totalIncome - totalExpense).toFixed(2);

        // Update goal progress
        updateGoalProgress(totalIncome - totalExpense);

    } catch (error) {
        console.error("Dashboard load error:", error);
        alert("Unable to load dashboard.");
    }
}

// ==========================================================
// ADD TRANSACTION
// ==========================================================
async function addTransaction() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
        window.location.href = "/index.html";
        return;
    }

    const type = document.getElementById("type").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value.trim();
    const description = document.getElementById("description").value.trim();
    const txnDate = document.getElementById("txnDate").value;

    if (!amount || !category || !txnDate) {
        alert("Please fill all required fields.");
        return;
    }

    const transaction = {
        userId: Number(userId),
        type,
        amount: parseFloat(amount),
        category,
        description,
        txnDate
    };

    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        alert("Transaction added successfully!");

        // Clear form
        document.getElementById("amount").value = "";
        document.getElementById("category").value = "";
        document.getElementById("description").value = "";
        document.getElementById("txnDate").value = "";

        loadDashboard();

    } catch (error) {
        console.error("Add transaction error:", error);
        alert("Failed to add transaction.");
    }
}

// ==========================================================
// DELETE TRANSACTION
// ==========================================================
async function deleteTransaction(id) {
    const token = localStorage.getItem("token");

    if (!confirm("Delete this transaction?")) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/transactions/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        loadDashboard();

    } catch (error) {
        console.error("Delete transaction error:", error);
        alert("Delete failed.");
    }
}

// ==========================================================
// SAVE FINANCIAL GOAL
// ==========================================================
function saveGoal() {
    const goalName = document.getElementById("goalName").value.trim();
    const goalAmount = document.getElementById("goalAmount").value.trim();

    if (!goalName || !goalAmount) {
        alert("Please enter goal name and amount.");
        return;
    }

    const goal = {
        name: goalName,
        amount: parseFloat(goalAmount)
    };

    localStorage.setItem("financialGoal", JSON.stringify(goal));

    document.getElementById("goalName").value = "";
    document.getElementById("goalAmount").value = "";

    loadGoal();
    alert("Goal saved successfully!");
}

// ==========================================================
// LOAD GOAL
// ==========================================================
function loadGoal() {
    const savedGoal = localStorage.getItem("financialGoal");

    const goalDisplay = document.getElementById("goalDisplay");
    const goalProgress = document.getElementById("goalProgress");

    if (!goalDisplay || !goalProgress) return;

    if (!savedGoal) {
        goalDisplay.textContent = "No goal set";
        goalProgress.textContent = "";
        return;
    }

    const goal = JSON.parse(savedGoal);

    goalDisplay.textContent =
        `${goal.name} - ₹ ${Number(goal.amount).toFixed(2)}`;

    updateGoalProgress();
}

// ==========================================================
// UPDATE GOAL PROGRESS
// ==========================================================
function updateGoalProgress(currentBalance = null) {
    const savedGoal = localStorage.getItem("financialGoal");

    if (!savedGoal) return;

    const goal = JSON.parse(savedGoal);
    const goalProgress = document.getElementById("goalProgress");

    if (!goalProgress) return;

    if (currentBalance === null) {
        currentBalance = parseFloat(
            document.getElementById("balance").textContent || "0"
        );
    }

    const percentage = Math.min(
        (currentBalance / goal.amount) * 100,
        100
    );

    goalProgress.textContent =
        `Saved ₹ ${currentBalance.toFixed(2)} of ₹ ${goal.amount.toFixed(2)} `
        + `(${percentage.toFixed(1)}%)`;
}

// ==========================================================
// EXPORT CSV
// ==========================================================
async function exportCSV() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `${API_BASE_URL}/reports/csv`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const blob = await response.blob();
        downloadFile(blob, "transactions.csv");

    } catch (error) {
        console.error("CSV export error:", error);
        alert("Failed to export CSV.");
    }
}

// ==========================================================
// EXPORT PDF
// ==========================================================
async function exportPDF() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `${API_BASE_URL}/reports/pdf`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const blob = await response.blob();
        downloadFile(blob, "financial-report.pdf");

    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to export PDF.");
    }
}

// ==========================================================
// DOWNLOAD FILE HELPER
// ==========================================================
function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
}

// ==========================================================
// AI INSIGHTS
// ==========================================================
async function getAIInsights() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
        const response = await fetch(
            `${API_BASE_URL}/ai/analyze`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": `Bearer ${token}`
                },
                body: `Analyze transactions for user ${userId}`
            }
        );

        const result = await response.text();
        document.getElementById("aiInsights").innerText = result;

    } catch (error) {
        console.error("AI Insights error:", error);
        document.getElementById("aiInsights").innerText =
            "Unable to generate AI insights.";
    }
}

// ==========================================================
// LOGOUT
// ==========================================================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/index.html";
}
