async function addGoal() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const goal = {
        userId: userId,
        title: document.getElementById("goalTitle").value,
        targetAmount: document.getElementById("targetAmount").value,
        deadline: document.getElementById("deadline").value
    };

    const res = await fetch(`${BASE_URL}/goals`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(goal)
    });

    if (res.ok) {
        alert("Goal added");
        loadGoals();
    } else {
        alert("Failed to add goal");
    }
}

async function loadGoals() {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`${BASE_URL}/goals/user/${userId}`);
    const data = await res.json();

    const table = document.getElementById("goalTable");
    table.innerHTML = "";

    data.forEach(g => {
        table.innerHTML += `
            <tr>
                <td>${g.title}</td>
                <td>${g.targetAmount}</td>
                <td>${g.currentAmount}</td>
                <td>${g.deadline}</td>
                <td><button onclick="deleteGoal(${g.id})">Delete</button></td>
            </tr>
        `;
    });
}

async function deleteGoal(id) {
    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/goals/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadGoals();
}