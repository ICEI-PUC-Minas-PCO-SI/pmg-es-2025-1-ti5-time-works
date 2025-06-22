function createTodoList() {
    const app = document.getElementById('todolist');
    if (!app) {
        console.error("Elemento #todolist não encontrado!");
        return;
    }
    app.innerHTML = "";

    const container = document.createElement('div');
    container.className = 'todo-container';

    const h2 = document.createElement('h2');
    h2.innerText = 'To-do List';
    h2.className = 'titulotodolist';
    container.appendChild(h2);

    const botaoadicionar = document.createElement("button");
    botaoadicionar.innerText = "Adicionar";
    botaoadicionar.className = 'btn-add';
    botaoadicionar.addEventListener("click", () => adicionartarefaForm(container));
    container.appendChild(botaoadicionar);

    const formContainer = document.createElement('div');
    formContainer.id = "form-container";
    container.appendChild(formContainer);

    const todoList = document.createElement('ul');
    todoList.id = 'todo-list';
    const completedList = document.createElement('ul');
    completedList.id = 'completed-list';

    (todo_tasks || []).forEach(task => {
        const li = document.createElement('li');
        li.dataset.taskId = task.id;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="options">⋮</button>
        `;

        li.querySelector('.task-checkbox').addEventListener('change', (e) => {
            task.completed = e.target.checked;
            atualizarTodoTask(task);
        });

        li.querySelector('.options').addEventListener('click', (e) => {
            e.stopPropagation();
            mostrarOpcoesTarefa(li, task);
        });

        if (task.completed) {
            li.classList.add('completed');
            completedList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });

    container.appendChild(todoList);
    if (completedList.children.length > 0) {
        const hr = document.createElement('hr');
        hr.className = 'divider-todolist';
        container.appendChild(hr);

        const h3 = document.createElement('h3');
        h3.innerText = 'Concluídas';
        container.appendChild(h3);
        container.appendChild(completedList);
    }
    app.appendChild(container);
}

function adicionartarefaForm(container) {
    const formContainer = container.querySelector("#form-container");
    if (formContainer.innerHTML !== "") return;

    formContainer.innerHTML = `
        <div class="task-form">
            <input type="text" id="task-name" placeholder="Nomeie essa nova tarefa!">
            <button id="confirm-task">✔</button>
            <button id="cancel-task">✖</button>
        </div>
    `;

    formContainer.querySelector('#confirm-task').addEventListener('click', () => {
        const taskName = formContainer.querySelector('#task-name').value.trim();
        if (taskName) {
            adicionarTodoTask(taskName);
        }
    });
    formContainer.querySelector('#cancel-task').addEventListener('click', () => formContainer.innerHTML = "");
}

function mostrarOpcoesTarefa(li, task) {
     document.querySelectorAll('.edit-options').forEach(opt => opt.remove());
     document.querySelectorAll('li .options').forEach(btn => btn.style.display = 'flex');

    const optionsButton = li.querySelector('.options');
    optionsButton.style.display = 'none';  

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'edit-options';
    optionsContainer.innerHTML = `
        <button class="edit-task" title="Editar">✏️</button>
        <button class="delete-task" title="Excluir">🗑️</button>
    `;
    li.appendChild(optionsContainer);  
    optionsContainer.querySelector('.edit-task').addEventListener('click', (e) => {
        e.stopPropagation();  
        editarTarefaForm(li, task);
    });
    optionsContainer.querySelector('.delete-task').addEventListener('click', () => excluirTodoTask(task.id));
}

document.addEventListener('click', function (event) {
    const isClickInsideOptions = event.target.closest('.edit-options, .options');

    if (!isClickInsideOptions) {
        document.querySelectorAll('.edit-options').forEach(opt => opt.remove());
        document.querySelectorAll('li .options').forEach(btn => btn.style.display = 'flex');
    }
});

function editarTarefaForm(li, task) {
    li.innerHTML = `
        <input type="text" class="edit-input" value="${task.text}">
        <div class="task-buttons">
            <button class="save-btn">Salvar</button>
            <button class="cancel-btn">Cancelar</button>
        </div>
    `;

    li.querySelector('.save-btn').addEventListener('click', () => {
        const newText = li.querySelector('.edit-input').value.trim();
        if (newText) {
            task.text = newText;
            atualizarTodoTask(task);
        }
    });
    li.querySelector('.cancel-btn').addEventListener('click', () => createTodoList());
}