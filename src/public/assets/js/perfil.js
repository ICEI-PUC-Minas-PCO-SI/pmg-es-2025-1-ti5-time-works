document.addEventListener('DOMContentLoaded', function () {
    const openModalBtn = document.querySelector(".openmodal");
    const modal = document.querySelector("dialog");
    const closeModalBtn = document.querySelector(".buttonclose");
    const usernameDisplay = document.querySelector('.username');
    const profileImg = document.querySelector('.imgperfil');
    const openModalImg = document.querySelector('.openmodalimg');
    const userIdDisplay = document.querySelector('.userid');
    const userLevelDisplay = document.getElementById('userlevel');

    // const userXpDisplay = document.querySelector('.userxp');

    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editModal = document.getElementById('edit-modal');
    const closeEditModal = document.querySelector('.close-edit-modal');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const usernameInput = document.getElementById('username-input');
    const profileOptions = document.querySelectorAll('.profile-option');

    let currentUserId = localStorage.getItem('currentUserId');
    let userData = {};

    const urlUsers = `http://localhost:3000/users/${currentUserId}`;

    async function fetchUserData() {
        try {
             if (typeof fetchAllAchievements === 'function') {
                await fetchAllAchievements();
            }

            let response = await fetch(urlUsers);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            let freshUserData = await response.json();

            if (!freshUserData.unlockedAchievements) {
                freshUserData.unlockedAchievements = [];
            }

            await checkAllAchievements(freshUserData, obterTarefas());

            response = await fetch(urlUsers);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            userData = await response.json();

            updateProfileDisplay();
            updateXpDisplay();
            renderUserAchievements(userData);

        } catch (error) {
            console.error("Erro ao buscar dados do usuário ou processar conquistas:", error);
            userData = {
                name: "Usuário-teste",
                id: "#000000",
                profilePic: "assets/img/man.png",
                xp: 0,
                level: 1,
                unlockedAchievements: []
            };
            updateProfileDisplay();
            updateXpDisplay();
            renderUserAchievements(userData);
        }
    }

    function updateProfileDisplay() {
        usernameDisplay.textContent = userData.name || "Usuário-teste";
        userIdDisplay.textContent = userData.id || "#000000";
        profileImg.src = userData.profilePic || "assets/img/man.png";
        openModalImg.src = userData.profilePic || "assets/img/man.png";
    }

    function updateXpDisplay() {
        // userXpDisplay.textContent = `XP: ${userData.xp || 0}`; 
        userLevelDisplay.textContent = `Nível: ${userData.level || 1}`;
        calXpNextLv(userData.level || 1);
        xpbar();
    }

    openModalBtn.addEventListener('click', () => {
        modal.showModal();
        fetchUserData();
    });

    closeModalBtn.addEventListener('click', () => {
        modal.close();
    });

    let selectedProfilePic;

    editProfileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        usernameInput.value = userData.name;
        editModal.style.display = 'flex';

        selectedProfilePic = userData.profilePic;
        profileOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-value') === userData.profilePic) {
                option.classList.add('selected');
            }
        });
    });

    profileOptions.forEach(option => {
        option.addEventListener('click', function () {
            profileOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedProfilePic = this.getAttribute('data-value');
        });
    });

    saveChangesBtn.addEventListener('click', async function () {
        userData.name = usernameInput.value || userData.name;
        userData.profilePic = selectedProfilePic || userData.profilePic;

        try {
            const response = await fetch(urlUsers, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await response.json();
            updateProfileDisplay();
            editModal.style.display = 'none';
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    });

    closeEditModal.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    let xpToNextLevel = 100;

    function calXpNextLv(level) {
        xpToNextLevel = Math.floor(100 * Math.pow(level, 1.3));
    }

    async function addXp(amount) {
        userData.xp = (userData.xp || 0) + amount;
        checkLevelUp();
        await saveUserData();
        updateXpDisplay();
    }

    function checkLevelUp() {
        if (userData.xp >= xpToNextLevel) {
            userData.xp -= xpToNextLevel;
            userData.level = (userData.level || 1) + 1;
            calXpNextLv(userData.level);
            console.log(`Parabéns! Você subiu para o nível ${userData.level}!`);
        }
    }

    function xpbar() {
        const xpBarFill = document.querySelector('.xp-bar-fill');
        const xpBarText = document.querySelector('.xp-bar-text');

        if (!xpBarFill || !xpBarText) {
            return;
        }

        if (xpToNextLevel === 0) {
            return;
        }

        const calcpercent = Math.min(100, (userData.xp || 0) * 100 / xpToNextLevel);

        xpBarFill.style.width = `${calcpercent}%`;
        xpBarText.textContent = `${Math.floor(calcpercent)}%`;
    }

    async function saveUserData() {
        try {
            const response = await fetch(urlUsers, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

    fetchUserData();
    window.addXp = addXp;

});