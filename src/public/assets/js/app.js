// ========== CONFIGURAÇÕES E VARIÁVEIS GLOBAIS ==========
const urlBase = 'http://localhost:3000';
const urlTarefas = `${urlBase}/tarefas`;
const urlTodoTasks = `${urlBase}/todo_tasks`;
let tarefas = [];
let todo_tasks = [];
let currentLoggedInUserId = localStorage.getItem('currentUserId');

if (!currentLoggedInUserId) {
    window.location.href = 'login.html';
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", () => {
    checkTutorialStatus();

    carregaDadosJSONServer(() => {
        if (typeof atualizarCalendario === 'function') {
            atualizarCalendario();
        }
    });

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Sair';
    logoutBtn.classList.add('btn', 'btn-danger', 'ms-auto');
    logoutBtn.addEventListener('click', logout);
    document.querySelector('header').appendChild(logoutBtn);
});

function logout() {
    localStorage.removeItem('currentUserId');
    window.location.href = 'login.html';
}

async function checkTutorialStatus() {
    try {
        const response = await fetch(`${urlBase}/users/${currentLoggedInUserId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do usuário para o tutorial.');

        const userData = await response.json();

        if (userData && userData.hasSeenTutorial === false) {
            if (typeof initTutorial === 'function') {
                initTutorial();
            } else {
                console.error("Função initTutorial() não encontrada. Verifique a ordem dos scripts em index.html.");
            }
        } else {
            const tutorialContainer = document.getElementById('tutorialContainer');
            if (tutorialContainer) {
                tutorialContainer.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Erro em checkTutorialStatus:", error);
    }
}


// ========== CARREGAMENTO DE DADOS ==========

async function carregarTodoTasks(callback) {
    try {
        const response = await fetch(`${urlTodoTasks}?userId=${currentLoggedInUserId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        todo_tasks = await response.json();
        callback?.();
    } catch (error) {
        console.error('Erro ao carregar To-do Tasks:', error);
        todo_tasks = []; 
    }
}

async function adicionarTodoTask(text) {
    const novaTask = {
        text: text,
        completed: false,
        userId: currentLoggedInUserId
    };
    try {
        const response = await fetch(urlTodoTasks, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTask)
        });
        if (!response.ok) throw new Error('Falha ao adicionar a tarefa');
        recarregarTudo();  
    } catch (error) {
        console.error('Erro em adicionarTodoTask:', error);
    }
}

async function atualizarTodoTask(task) {
    try {
        const response = await fetch(`${urlTodoTasks}/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Falha ao atualizar a tarefa');
        recarregarTudo();
    } catch (error) {
        console.error('Erro em atualizarTodoTask:', error);
    }
}

async function excluirTodoTask(taskId) {
    try {
        const response = await fetch(`${urlTodoTasks}/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Falha ao excluir a tarefa');
        recarregarTudo();
    } catch (error) {
        console.error('Erro em excluirTodoTask:', error);
    }
}

 function recarregarTudo() {
    carregaDadosJSONServer(() => {
        if (typeof atualizarCalendario === 'function') {
            atualizarCalendario();
        }
          if (document.getElementById('todolist')?.classList.contains('active')) {
            createTodoList();
        }
    });
}

async function carregaDadosJSONServer(callback) {
    try {
         let response = await fetch(`${urlTarefas}?userId=${currentLoggedInUserId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        tarefas = await response.json();

        const algumaSequenciaQuebrou = await verificarEQuebrarSequencias();
        if (algumaSequenciaQuebrou) {
            response = await fetch(`${urlTarefas}?userId=${currentLoggedInUserId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            tarefas = await response.json();
        }
        
         await carregarTodoTasks();

         if (typeof htmlSequenciaTarefas === 'function') htmlSequenciaTarefas();
        if (typeof htmlPrioridadeTarefas === 'function') htmlPrioridadeTarefas();
        callback?.();

    } catch (error) {
        tarefas = [];
        console.error('Erro no ciclo de carregamento de tarefas:', error);
    }
}

function recarregarTarefas() {
    carregaDadosJSONServer(() => {
        if (typeof atualizarCalendario === 'function') {
            atualizarCalendario();
        }
    });
}

// ========== FUNÇÕES UTILITÁRIAS PARA TAREFAS ==========
function obterCorPrioridade(prioridade) {
    const cores = {
        "Muito alta": "#B71C1C",
        "Alta": "#F44336",
        "Média": "#d5c000",
        "Baixa": "#4CAF50",
        "Muito baixa": "#8BC34A"
    };
    return cores[prioridade] || "#4CAF50";
}

function formatarData(data) {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// ========== FUNÇÕES DE ACESSO AOS DADOS ==========
function obterTarefas() {
    return tarefas;
}

function obterTarefaPorId(id) {
    return tarefas.find(tarefa => tarefa.id === id);
}

function mostrarDetalhesTarefa(tarefa) {
    abrirModalEditarTarefa(tarefa.id);
}

async function verificarEQuebrarSequencias() {
    console.log("Verificando sequências quebradas...");

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const seriesQuebradas = new Set();

    const tarefasAtrasadas = tarefas.filter(tarefa => {
        if (!tarefa.serieId || tarefa.realizada) {
            return false;
        }
        const dataTarefa = new Date(tarefa.data + 'T00:00:00');
        const diffTime = hoje - dataTarefa;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 2;
    });

    if (tarefasAtrasadas.length === 0) {
        console.log("Nenhuma sequência quebrada foi encontrada.");
        return false;
    }

    tarefasAtrasadas.forEach(tarefa => seriesQuebradas.add(tarefa.serieId));
    console.log(`Sequências quebradas detectadas para as séries: ${[...seriesQuebradas].join(', ')}`);

    const tarefasParaResetar = tarefas.filter(
        tarefa => seriesQuebradas.has(tarefa.serieId) && tarefa.sequencia > 0
    );

    if (tarefasParaResetar.length === 0) {
        return false;
    }

    const promisesDeUpdate = tarefasParaResetar.map(tarefa => {
        const tarefaAtualizada = { ...tarefa, sequencia: 0 };
        return fetch(`${urlTarefas}/${tarefa.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefaAtualizada)
        }).then(res => res.json());
    });

    try {
        await Promise.all(promisesDeUpdate);
        console.log(`A sequência de ${tarefasParaResetar.length} tarefa(s) foi resetada com sucesso.`);
        return true;
    } catch (error) {
        console.error("Ocorreu um erro ao resetar as sequências:", error);
        return false;
    }
}