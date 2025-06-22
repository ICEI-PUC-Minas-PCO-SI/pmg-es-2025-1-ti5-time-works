function htmlPrioridadeTarefas() {
        const container = document.getElementById('prioridadeTarefasContainer');
    if (!container) return; 

        container.classList.add("scrollbar");
    container.style.overflowY = 'auto';
    container.innerHTML = `<div class="p-2 my-2 rounded text-white" style="position: sticky; top: 0; background-color: #1E0E45;">Tarefas com prioridade: "Muito alta"</div>`;

        const tarefasFiltradas = tarefas.filter(tarefa => 
        tarefa.prioridade === "Muito alta" && !tarefa.realizada
    );

        const tarefasOrdenadas = tarefasFiltradas.sort((a, b) => new Date(a.data) - new Date(b.data));

        if (tarefasOrdenadas.length === 0) {
        const mensagemVazio = document.createElement('p');
        mensagemVazio.className = 'text-white-50 p-2 small';
        mensagemVazio.textContent = 'Nenhuma tarefa prioritária pendente.';
        container.appendChild(mensagemVazio);
        return;
    }

    const corPrioridade = "#B71C1C";

        for (const tarefa of tarefasOrdenadas) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'px-2';

                const [ano, mes, dia] = tarefa.data.split('-');
        const dataFormatada = `${dia}/${mes}`;

                cardDiv.innerHTML = `
            <div style="background-color: ${corPrioridade}" class="d-flex justify-content-between align-items-center text-white rounded p-2 my-2">
                <div style="background-color: transparent;" class="fw-bold">${tarefa.titulo}</div>
                <div style="background-color: transparent; font-size: 0.9em;">${dataFormatada}</div>
            </div>`;
        
        container.appendChild(cardDiv);
    }
}