let allAchievements = [];

async function fetchAllAchievements() {
     if (allAchievements.length > 0) return;
    try {
        const response = await fetch('http://localhost:3000/achievements');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allAchievements = await response.json();
    } catch (error) {
        console.error("Error fetching achievements:", error);
    }
}


async function unlockAchievement(achievementId, userData) {
    if (!userData.unlockedAchievements) {
        userData.unlockedAchievements = [];
    }

    if (userData.unlockedAchievements.includes(achievementId)) {
        return;
    }

    userData.unlockedAchievements.push(achievementId);
    try {
        await fetch(`http://localhost:3000/users/${userData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        console.log(`Conquista ${achievementId} desbloqueada para ${userData.name}!`);
        renderUserAchievements(userData);
    } catch (error) {
        console.error("Error saving unlocked achievement:", error);
    }
}


function renderUserAchievements(userData) {
     console.log("--- Iniciando renderização de conquistas ---");
    console.log("Dados do usuário para renderizar:", userData.unlockedAchievements);
    console.log("Lista mestre de conquistas disponível:", allAchievements);
 
    const container = document.getElementById('conquistas-container');
    if (!container) return;

    container.innerHTML = '';

    if (!userData.unlockedAchievements || userData.unlockedAchievements.length === 0) {
        const mensagemVazio = document.createElement('p');
        mensagemVazio.className = 'text-black-50 p-2 small';
        mensagemVazio.textContent = 'Nenhuma conquista desbloqueada ainda.';
        container.appendChild(mensagemVazio);
        return;
    }

    userData.unlockedAchievements.forEach(id => {
        const achievement = allAchievements.find(a => Number(a.id) === Number(id));
        if (achievement) {
            const card = document.createElement('div');
            card.className = `card ${achievement.tier}`;
            card.innerHTML = `
                <img src="assets/${achievement.icon}" alt="${achievement.name}" class="card-image">
                <div class="card-content">
                    <p class="card-heading">${achievement.name}</p>
                    <p class="card-body">${achievement.description}</p>
                </div>
            `;
            container.appendChild(card);
        } else {
             console.warn(`Conquista com ID ${id} não encontrada na lista 'allAchievements'.`);
        }
    });
}


async function checkAllAchievements(userData, userTasks) {
    if (allAchievements.length === 0) {
        await fetchAllAchievements();
    }

    if (userTasks.some(t => t.realizada)) {
        await unlockAchievement(1, userData);
    }

    if (userTasks.some(t => t.sequencia > 0)) {
        await unlockAchievement(2, userData);
    }

    if (userData.level >= 10) await unlockAchievement(3, userData);
    if (userData.level >= 30) await unlockAchievement(7, userData);
    if (userData.level >= 70) await unlockAchievement(11, userData);

    const getMaxStreak = (recurrence) => {
        const streaks = userTasks
            .filter(t => t.recorrencia === recurrence && t.sequencia > 0)
            .map(t => t.sequencia);
        return streaks.length > 0 ? Math.max(...streaks) : 0;
    };

    const dailyStreak = getMaxStreak('Diariamente');
    if (dailyStreak >= 5) await unlockAchievement(4, userData);
    if (dailyStreak >= 15) await unlockAchievement(8, userData);
    if (dailyStreak >= 30) await unlockAchievement(12, userData);

    const weeklyStreak = getMaxStreak('Semanalmente');
    if (weeklyStreak >= 2) await unlockAchievement(5, userData);
    if (weeklyStreak >= 3) await unlockAchievement(9, userData);
    if (weeklyStreak >= 4) await unlockAchievement(13, userData);

    const monthlyStreak = getMaxStreak('Mensalmente');
    if (monthlyStreak >= 3) await unlockAchievement(6, userData);
    if (monthlyStreak >= 6) await unlockAchievement(10, userData);
    if (monthlyStreak >= 12) await unlockAchievement(14, userData);
    if (monthlyStreak >= 24) await unlockAchievement(15, userData);

}

 fetchAllAchievements();