async function getAIInsights() {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`${BASE_URL}/transactions/user/${userId}`);
    const data = await res.json();

    let income = 0, expense = 0;

    data.forEach(t => {
        if (t.type === "INCOME") income += t.amount;
        else expense += t.amount;
    });

    const savings = income - expense;

    let insight = "";

    if (savings < 0) {
        insight = "⚠️ You are spending more than you earn. Reduce expenses.";
    } else if (savings < 5000) {
        insight = "⚡ You are doing okay, but savings are low.";
    } else {
        insight = "💰 Great job! You are saving well.";
    }

    document.getElementById("aiInsights").innerText = insight;
}