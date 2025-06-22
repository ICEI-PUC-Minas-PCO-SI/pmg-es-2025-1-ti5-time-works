function htmlSequenciaTarefas() { 
    let bgSequenciaTarefas = document.getElementById('sequenciaTarefas'); 
    bgSequenciaTarefas.classList.add("scrollbar"); 

    bgSequenciaTarefas.style.overflowY = 'auto'; 

    bgSequenciaTarefas.innerHTML = `<div class="p-2 my-2 rounded text-white" style="position: sticky; top: 0; background-color: #1E0E45;">Tarefas realizadas em sequência:</div>`; 

        let tarefasCompletasDaSerie = tarefas.filter(tarefa => 
        tarefa.recorrencia !== "Não repete" && 
        tarefa.realizada && 
        tarefa.serieId
    );

        const tarefasMaisRecentesPorSerie = new Map();
    for (const tarefa of tarefasCompletasDaSerie) {
        if (!tarefasMaisRecentesPorSerie.has(tarefa.serieId) || tarefa.sequencia > tarefasMaisRecentesPorSerie.get(tarefa.serieId).sequencia) {
            tarefasMaisRecentesPorSerie.set(tarefa.serieId, tarefa);
        }
    }

        const tarefasUnicasParaExibir = Array.from(tarefasMaisRecentesPorSerie.values());

        let ordemPrioridade = ["Muito alta", "Alta", "Média", "Baixa", "Muito baixa"]; 
    const tarefasOrdenadas = tarefasUnicasParaExibir.sort((a, b) => { 
        return ordemPrioridade.indexOf(a.prioridade) - ordemPrioridade.indexOf(b.prioridade); 
    });

        if (tarefasOrdenadas.length === 0) {
        const mensagemVazio = document.createElement('p');
        mensagemVazio.className = 'text-white-50 p-2 small';
        mensagemVazio.textContent = 'Nenhuma tarefa em sequência no momento.';
        bgSequenciaTarefas.appendChild(mensagemVazio);
        return;
    }

        for (let i = 0; i < tarefasOrdenadas.length; i++) { 
        let tarefa = tarefasOrdenadas[i]; 

        let corPrioridade = ""; 

        switch (tarefa.prioridade) { 
            case "Muito alta": corPrioridade = "#B71C1C"; break;
            case "Alta": corPrioridade = "#F44336"; break;
            case "Média": corPrioridade = "#d5c000"; break;
            case "Baixa": corPrioridade = "#4CAF50"; break;
            case "Muito baixa": corPrioridade = "#8BC34A"; break;
        }

        let htmlTarefasFiltradas = document.createElement('div'); 
        htmlTarefasFiltradas.className = `px-2`; 
        
                htmlTarefasFiltradas.innerHTML = `
            <div style="background-color: ${corPrioridade}" class="d-flex justify-content-between align-items-center text-white rounded p-2 my-2">
                <div style="background-color: transparent;" class="fw-bold">${tarefa.titulo}</div>
                <div style="background-color: transparent;" class="d-flex align-items-center">
                    <span class="me-2 fw-bold">${tarefa.sequencia}x</span>
                    <img style="width: 25px; height: 25px;" src="assets/img/firewhite.png">
                </div>
            </div>`; 

        bgSequenciaTarefas.appendChild(htmlTarefasFiltradas); 
    }
}

document.addEventListener("DOMContentLoaded", htmlSequenciaTarefas);