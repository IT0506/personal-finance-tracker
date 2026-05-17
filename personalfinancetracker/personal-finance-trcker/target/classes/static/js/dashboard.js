// dashboard.js

const API_BASE_URL =
    typeof BASE_URL !== "undefined"
        ? BASE_URL
        : "http://localhost:8080";

// =========================
// Initialize Dashboard
// =========================
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

// =========================
// Load Dashboard
// =========================
async function loadDashboard() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/index.html";
        return;
    }

    if (!userId) {
        console.warn("userId not found in localStorage.");
        return;
    }

    try {
        // Your backend supports GET /transactions/user/{userId}
        const response = await fetch(
            `${API_BASE_URL}/transactions/user/${userId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to load transactions:", errorText);
            alert("Failed to load transactions.");
            return;
        }

        const transactions = await response.json();

        const table = document.getElementById("transactionTable");
        table.innerHTML = "";

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(txn => {
            const amount = Number(txn.amount) || 0;

            if (txn.type === "INCOME") {
                totalIncome += amount;
            } else if (txn.type === "EXPENSE") {
                totalExpense += amount;
            }

            const id = txn.transactionId || txn.id;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${txn.txnDate || ""}</td>
                <td>${txn.type || ""}</td>
                <td>${amount.toFixed(2)}</td>
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

        // Update summary cards
        document.getElementById("totalIncome").textContent =
            totalIncome.toFixed(2);

        document.getElementById("totalExpense").textContent =
            totalExpense.toFixed(2);

        document.getElementById("balance").textContent =
            (totalIncome - totalExpense).toFixed(2);

    } catch (error) {
        console.error("Dashboard load error:", error);
        alert("Unable to load dashboard.");
    }
}

// =========================
// Add Transaction
// =========================
async function addTransaction() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token || !userId) {
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
        type: type,
        amount: parseFloat(amount),
        category: category,
        description: description,
        txnDate: txnDate
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

        if (response.ok) {
            alert("Transaction added successfully!");

            // Clear form
            document.getElementById("amount").value = "";
            document.getElementById("category").value = "";
            document.getElementById("description").value = "";
            document.getElementById("txnDate").value = "";

            await loadDashboard();
        } else {
            const errorText = await response.text();
            console.error("Add transaction failed:", errorText);
            alert("Failed to add transaction.");
        }

    } catch (error) {
        console.error("Add transaction error:", error);
        alert("Unable to connect to server.");
    }
}

// =========================
// Delete Transaction
// =========================
async function deleteTransaction(id) {
    const token = localStorage.getItem("token");

    if (!confirm("Delete this transaction?")) {
        return;
    }

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

        if (response.ok) {
            await loadDashboard();
        } else {
            const errorText = await response.text();
            console.error("Delete failed:", errorText);
            alert("Delete failed.");
        }

    } catch (error) {
        console.error("Delete error:", error);
        alert("Unable to delete transaction.");
    }
}
async function getAIInsights() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const response = await fetch(`/ai/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
            "Authorization": `Bearer ${token}`
        },
        body: `Analyze transactions for user ${userId}`
    });

    const result = await response.text();
    document.getElementById("aiInsights").innerText = result;
}

// =========================
// Logout
// =========================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/index.html";
}