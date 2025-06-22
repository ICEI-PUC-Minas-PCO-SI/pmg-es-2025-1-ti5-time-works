const nomeMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const nomesDiasSemana = ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."];

let modoVisualizacao = "mes";
let dataAtualCalendario = new Date();

const dataHoje = new Date();
const diaHoje = dataHoje.getDate();
const mesHoje = dataHoje.getMonth();
const anoHoje = dataHoje.getFullYear();

let instanciaModalTarefa = null;

document.addEventListener("DOMContentLoaded", () => {
    atualizarBotaoCalendario(modoVisualizacao);
    configurarEventListeners();
    adicionarEstilosTarefas();

    setTimeout(() => {
        atualizarCalendario();

         console.log("Tentando adicionar listener APÓS atualizar calendário...");

        const todolistToggle = document.getElementById('todolist-toggle');
        const mainCalendar = document.querySelector('main');

        console.log("Elemento do Toggle Switch encontrado:", todolistToggle);
        console.log("Elemento do Calendário (main) encontrado:", mainCalendar);

        if (todolistToggle && mainCalendar) {
            const todolistWrapper = document.getElementById('todolist');  

            if (!todolistToggle.hasListener) {
                todolistToggle.addEventListener('change', function () {
                    const isChecked = this.checked;

                    console.log(`--- CLIQUE NO TOGGLE ---`);
                    console.log(`O estado do switch agora é: ${isChecked ? 'ATIVADO' : 'DESATIVADO'}`);

                     mainCalendar.classList.toggle('calendar-hidden', isChecked);
                    console.log(`Classes no elemento <main>: ${mainCalendar.className}`);

                     if (todolistWrapper) {
                        todolistWrapper.classList.toggle('active', isChecked);
                        console.log(`Classes no wrapper #todolist: ${todolistWrapper.className}`);

                        if (isChecked) {
                            console.log('Tentando criar a To-do List...');
                             console.log('Dados disponíveis em "todo_tasks":', todo_tasks);

                             createTodoList();
                            console.log('A função createTodoList() foi chamada.');

                             console.log('Conteúdo do wrapper #todolist após a chamada:', todolistWrapper.innerHTML);
                        } else {
                             todolistWrapper.innerHTML = '';
                            console.log('O wrapper #todolist foi limpo.');
                        }
                    } else {
                        console.error("ERRO: O elemento contêiner #todolist não foi encontrado no HTML!");
                    }
                });
                todolistToggle.hasListener = true;
            }
        } else {
            console.error("ERRO: Não foi possível encontrar o toggle switch ou o elemento <main> do calendário.");
        }
    }, 100);  
});

function loadCalendarioMensal() {
    const blocosCalendario = document.getElementById("canvaCalendario");
    const ano = dataAtualCalendario.getFullYear();
    const mes = dataAtualCalendario.getMonth();

    const quantidadeDiasMesAtual = new Date(ano, mes + 1, 0).getDate();
    const primeiroDiaMes = new Date(ano, mes, 1).getDay();
    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    const difDiasProxMes = 42 - quantidadeDiasMesAtual - primeiroDiaMes;

    configurarGridCalendario(blocosCalendario, "repeat(7, 1fr)", "repeat(6, 1fr)");
    blocosCalendario.innerHTML = '';

    for (let i = primeiroDiaMes - 1; i >= 0; i--) {
        criarDiaCalendario(blocosCalendario, diasMesAnterior - i, true);
    }

    for (let i = 1; i <= quantidadeDiasMesAtual; i++) {
        const ehHoje = i === diaHoje && mes === mesHoje && ano === anoHoje;
        criarDiaCalendario(blocosCalendario, i, false, ehHoje);
    }

    for (let i = 1; i <= difDiasProxMes; i++) {
        criarDiaCalendario(blocosCalendario, i, true);
    }

    cabecalhoNomesDiaSemana();
}

function loadCalendarioSemanal() {
    const blocosCalendario = document.getElementById("canvaCalendario");
    const diaSemana = dataAtualCalendario.getDay();
    const inicioSemana = new Date(dataAtualCalendario);
    inicioSemana.setDate(inicioSemana.getDate() - diaSemana);

    configurarGridCalendario(blocosCalendario, "repeat(7, minmax(0, 1fr))", "auto repeat(24, 1fr)", "visualizacao-semanal");

    for (let i = 0; i < 7; i++) {
        const diaAtual = new Date(inicioSemana);
        diaAtual.setDate(inicioSemana.getDate() + i);
        criarCabecalhoDiaSemanal(blocosCalendario, diaAtual);
    }

    for (let hora = 0; hora < 24; hora++) {
        for (let dia = 0; dia < 7; dia++) {
            const diaAtual = new Date(inicioSemana);
            diaAtual.setDate(inicioSemana.getDate() + dia);
            diaAtual.setHours(hora, 0, 0, 0);
            criarCelulaHora(blocosCalendario, diaAtual, hora, dia === 0);
        }
    }

    cabecalhoNomesDiaSemana();
}

function loadCalendarioDiario() {
    const canva = document.getElementById("canvaCalendario");
    const dia = dataAtualCalendario.getDate();
    const mes = dataAtualCalendario.getMonth();
    const ano = dataAtualCalendario.getFullYear();
    const ehHoje = dia === diaHoje && mes === mesHoje && ano === anoHoje;

    configurarGridCalendario(canva, "minmax(0, 1fr)", "auto repeat(24, 1fr)", "visualizacao-diaria");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("cabecalho-dia-diario");
    headerDiv.innerHTML = `
            <div class="numero-dia-diario" style="${ehHoje ? 'background-color: #150A35; color: white;' : ''}">${dia}</div>
        `;
    canva.appendChild(headerDiv);

    for (let i = 0; i < 24; i++) {
        const dataAtual = new Date(ano, mes, dia, i, 0, 0, 0);
        criarCelulaHora(canva, dataAtual, i, true);
    }

    cabecalhoNomesDiaSemana();
}

function configurarGridCalendario(elemento, colunas, linhas, classe) {
    elemento.innerHTML = "";
    elemento.style.gridTemplateColumns = colunas;
    elemento.style.gridTemplateRows = linhas;
    elemento.style.overflow = "auto";
    elemento.className = classe || "";
}

function criarDiaCalendario(container, dia, cinza = false, destaque = false) {
    const diaDiv = document.createElement('div');
    diaDiv.classList.add('cardDiaCalendario');

    const estilo = cinza ? 'color: gray;' : '';
    const estiloDestaque = destaque ? 'background-color: #150A35; color: white;' : '';

    diaDiv.innerHTML = `
            <div style="width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; margin: auto; border-radius: 50%; font-size: 12px; ${estilo} ${estiloDestaque}">${dia}</div>
            <div class="dia-content-wrapper"></div>
        `;

    container.appendChild(diaDiv);
}

function criarCabecalhoDiaSemanal(container, data) {
    const dia = data.getDate();
    const mes = data.getMonth();
    const ano = data.getFullYear();
    const ehHoje = dia === diaHoje && mes === mesHoje && ano === anoHoje;

    const cabecalhoDia = document.createElement("div");
    cabecalhoDia.classList.add("cabecalho-dia-diario");
    cabecalhoDia.innerHTML = `
            <div class="numero-dia-diario" style="${ehHoje ? 'background-color: #150A35; color: white;' : ''}">${dia}</div>
        `;

    container.appendChild(cabecalhoDia);
}

function criarCelulaHora(container, data, hora, mostrarHora) {
    const celulaHora = document.createElement("div");
    celulaHora.classList.add("celula-hora-diaria");

    const horaFormatada = hora.toString().padStart(2, '0') + ":00";
    const dataFormatada = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}`;

    celulaHora.dataset.hora = horaFormatada;
    celulaHora.dataset.data = dataFormatada;

    if (mostrarHora) {
        celulaHora.innerHTML = `<span class="indicador-hora-diaria">${horaFormatada}</span>`;
    }

    container.appendChild(celulaHora);
}

function atualizarCalendario() {
    const ano = dataAtualCalendario.getFullYear();
    const mes = nomeMeses[dataAtualCalendario.getMonth()];
    document.getElementById("mesAtual").innerHTML = `${mes}<br>${ano}`;

    const visualizacoes = {
        "mes": loadCalendarioMensal,
        "semana": loadCalendarioSemanal,
        "dia": loadCalendarioDiario
    };

    visualizacoes[modoVisualizacao]?.();
    renderizarTarefas();
}

function navegarCalendario(direcao) {
    const incrementos = {
        "semana": direcao * 7,
        "dia": direcao * 1,
        "mes": null
    };

    if (modoVisualizacao === "mes") {
        dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() + direcao);
    } else {
        dataAtualCalendario.setDate(dataAtualCalendario.getDate() + incrementos[modoVisualizacao]);
    }

    atualizarCalendario();
}

function irParaHoje() {
    dataAtualCalendario = new Date();
    atualizarCalendario();
}

function alterarModoVisualizacao(novoModo) {
    modoVisualizacao = novoModo;
    atualizarBotaoCalendario(modoVisualizacao);
    atualizarCalendario();
}

function atualizarBotaoCalendario(visualizacaoAtual) {
    const botoes = {
        "mes": document.getElementById("botaoCalendarioMes"),
        "semana": document.getElementById("botaoCalendarioSemanal"),
        "dia": document.getElementById("botaoCalendarioDia")
    };

    Object.values(botoes).forEach(botao => botao?.classList.remove("esconderBotao"));
    botoes[visualizacaoAtual]?.classList.add("esconderBotao");
}

function cabecalhoNomesDiaSemana() {
    const cabecalhoCalendario = document.getElementById("cabecalhoCalendario");
    cabecalhoCalendario.innerHTML = "";

    if (modoVisualizacao === "dia") {
        const diaAtual = dataAtualCalendario.getDay();
        cabecalhoCalendario.style.gridTemplateColumns = "1fr";
        criarDivCabecalho(cabecalhoCalendario, nomesDiasSemana[diaAtual]);
    } else {
        cabecalhoCalendario.style.gridTemplateColumns = "repeat(7, 1fr)";
        nomesDiasSemana.forEach(nome => criarDivCabecalho(cabecalhoCalendario, nome));
    }
}

function criarDivCabecalho(container, texto) {
    const diaDiv = document.createElement("div");
    diaDiv.classList.add("cardCabecalhoCalendario");
    diaDiv.textContent = texto;
    container.appendChild(diaDiv);
}

function renderizarTarefas() {
    document.querySelectorAll('.tarefa-evento').forEach(tarefa => tarefa.remove());

    const tarefasCarregadas = typeof obterTarefas === 'function' ? obterTarefas() : [];

    tarefasCarregadas.forEach(tarefa => {
        const dataTarefa = new Date(tarefa.data + 'T' + tarefa.hora.replace('Z', ''));
        const corPrioridade = typeof obterCorPrioridade === 'function' ?
            obterCorPrioridade(tarefa.prioridade) : "#4CAF50";
        const estiloRealizada = tarefa.realizada ? "text-decoration: line-through; opacity: 0.7;" : "";

        const renderizadores = {
            "mes": () => renderizarTarefaMensal(tarefa, dataTarefa, corPrioridade, estiloRealizada),
            "semana": () => renderizarTarefaSemanalDiaria(tarefa, dataTarefa, corPrioridade, estiloRealizada),
            "dia": () => renderizarTarefaSemanalDiaria(tarefa, dataTarefa, corPrioridade, estiloRealizada)
        };

        renderizadores[modoVisualizacao]?.();
    });
}

function renderizarTarefaMensal(tarefa, dataTarefa, corPrioridade, estiloRealizada) {
    const dia = dataTarefa.getDate();
    const mes = dataTarefa.getMonth();
    const ano = dataTarefa.getFullYear();
    const anoAtual = dataAtualCalendario.getFullYear();
    const mesAtual = dataAtualCalendario.getMonth();

    if (mes === mesAtual && ano === anoAtual) {
        const celulas = document.querySelectorAll('.cardDiaCalendario');
        const primeiroDiaMes = new Date(ano, mes, 1).getDay();
        const indexCelula = primeiroDiaMes + dia - 1;

        if (celulas[indexCelula]) {
            adicionarTarefaMensal(celulas[indexCelula], tarefa, dataTarefa, corPrioridade, estiloRealizada);
        }
    }
}

function renderizarTarefaSemanalDiaria(tarefa, dataTarefa, corPrioridade, estiloRealizada) {
    const dataFormatada = typeof formatarData === 'function' ?
        formatarData(dataTarefa) :
        `${dataTarefa.getFullYear()}-${(dataTarefa.getMonth() + 1).toString().padStart(2, '0')}-${dataTarefa.getDate().toString().padStart(2, '0')}`;
    const horaFormatada = dataTarefa.getHours().toString().padStart(2, '0') + ":00";

    const celula = document.querySelector(`.celula-hora-diaria[data-data="${dataFormatada}"][data-hora="${horaFormatada}"]`);
    if (celula) {
        adicionarTarefaNaCelula(celula, tarefa, corPrioridade, estiloRealizada);
    }
}

function adicionarTarefaMensal(celula, tarefa, dataTarefa, corPrioridade, estiloRealizada) {
    const wrapper = celula.querySelector('.dia-content-wrapper');
    if (!wrapper) return;
    let container = wrapper.querySelector('.tarefas-container-mes');
    if (!container) {
        container = document.createElement('div');
        container.classList.add('tarefas-container-mes');
        wrapper.appendChild(container);
    }

    const tarefaElemento = document.createElement('div');
    tarefaElemento.classList.add('tarefa-evento', 'tarefa-item-mes');
    tarefaElemento.setAttribute('data-id-tarefa', tarefa.id);
    tarefaElemento.style.backgroundColor = corPrioridade;

    const horaExibicao = dataTarefa.getHours().toString().padStart(2, '0') + ":00";
    const iconeRecorrente = tarefa.recorrencia !== "Não repete" ? '<i class="icone-recorrente">🔄</i>' : '';

    tarefaElemento.innerHTML = `
            <span style="${estiloRealizada}">${horaExibicao} ${tarefa.titulo}</span>
            ${iconeRecorrente}
        `;

    container.appendChild(tarefaElemento);
}

function adicionarTarefaNaCelula(celula, tarefa, corPrioridade, estiloRealizada) {
    let container = celula.querySelector('.tarefas-container-celula');
    if (!container) {
        container = document.createElement('div');
        container.classList.add('tarefas-container-celula');
        container.classList.add('scrollbar'); celula.appendChild(container);
    }

    const tarefaElemento = document.createElement('div');
    tarefaElemento.classList.add('tarefa-evento');

    if (modoVisualizacao === "dia") {
        tarefaElemento.classList.add('tarefa-evento-diaria');
    } else if (modoVisualizacao === "semana") {
        tarefaElemento.classList.add('tarefa-evento-semanal');
    }

    tarefaElemento.setAttribute('data-id-tarefa', tarefa.id);
    tarefaElemento.style.backgroundColor = corPrioridade;

    const iconeRecorrente = tarefa.recorrencia !== "Não repete" ? '<i class="icone-recorrente">🔄</i>' : '';
    tarefaElemento.innerHTML = `
            <span style="${estiloRealizada}">${tarefa.titulo}</span>
            ${iconeRecorrente}
        `;

    container.appendChild(tarefaElemento);
}

function configurarEventListeners() {
    document.getElementById("hoje")?.addEventListener("click", irParaHoje);
    document.getElementById("avancar")?.addEventListener("click", () => navegarCalendario(1));
    document.getElementById("voltar")?.addEventListener("click", () => navegarCalendario(-1));

    document.getElementById("botaoCalendarioSemanal")?.addEventListener("click", () => alterarModoVisualizacao("semana"));
    document.getElementById("botaoCalendarioDia")?.addEventListener("click", () => alterarModoVisualizacao("dia"));
    document.getElementById("botaoCalendarioMes")?.addEventListener("click", () => alterarModoVisualizacao("mes"));
}

function adicionarEstilosTarefas() {
    const estilosTarefas = document.createElement('style');
    estilosTarefas.textContent = `
        /* Regra geral para o contêiner de tarefas em todas as visualizações */
        .tarefa-evento {
            padding: 2px 5px;
            margin: 0; /* A margem será controlada pelo 'gap' do container flex */
            border-radius: 3px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            flex-shrink: 0; /* Impede que a tarefa encolha verticalmente */
        }
        
        .tarefa-evento > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-grow: 1;
            min-width: 0;
        }

        .tarefa-item-mes {
            font-size: 10px;
            padding: 1px 3px;
            margin: 1px 0;
            text-align: left;
        }
        
        .tarefas-container-mes {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-height: calc(100% - 20px);
            overflow-y: auto;
            margin-top: 2px;
        }
        
        .icone-recorrente {
            font-size: 10px;
            margin-left: 3px;
            flex-shrink: 0;
        }
        
        /* Regra principal para as células de hora */
        .visualizacao-semanal .celula-hora-diaria,
        .visualizacao-diaria .celula-hora-diaria {
            height: 100%; /* Força a célula a ter a altura da linha da grade */
            min-height: 30px;
            position: relative;
            padding: 2px 4px;
        }
        
        /* Alinhamento da view diária (hora ao lado das tarefas) */
        .visualizacao-diaria .celula-hora-diaria {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        /* Contêiner que agrupa as tarefas dentro de uma célula */
        .tarefas-container-celula {
            height: 100%;
            display: flex;
            flex-direction: row; /* MUDADO PARA 'row' */
            gap: 2px;
            overflow: hidden; /* Overflow vertical não é mais necessário */
            flex-grow: 1;
            min-width: 0;
        }

        /* Nova regra para ajustar as tarefas que estão lado a lado */
        .tarefas-container-celula .tarefa-evento {
            flex: 1; /* Faz cada tarefa ocupar uma parte igual do espaço */
        }
    `;
    document.head.appendChild(estilosTarefas);
}

function criarModalTarefa() {
    let modalExistente = document.getElementById("modalTarefa");
    if (modalExistente) {
        modalExistente.remove();
    }

    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'modalTarefa';
    modalDiv.tabIndex = '-1';
    modalDiv.setAttribute('aria-labelledby', 'modalTarefaLabel');
    modalDiv.setAttribute('aria-hidden', 'true');

    modalDiv.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTarefaLabel">Nova Tarefa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <form id="formTarefa">
                        <div class="mb-3">
                            <label for="tituloTarefa" class="form-label">Título</label>
                            <input type="text" class="form-control" id="tituloTarefa" required>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <label for="dataTarefa" class="form-label">Data</label>
                                <input type="date" class="form-control" id="dataTarefa" required>
                            </div>
                            <div class="col">
                                <label for="horaTarefa" class="form-label">Horário</label>
                                <input type="time" class="form-control" id="horaTarefa" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="prioridadeTarefa" class="form-label">Prioridade</label>
                            <select class="form-select" id="prioridadeTarefa" required>
                                <option value="Muito baixa">Muito baixa</option>
                                <option value="Baixa">Baixa</option>
                                <option value="Média" selected>Média</option>
                                <option value="Alta">Alta</option>
                                <option value="Muito alta">Muito alta</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="recorrenciaTarefa" class="form-label">Recorrência</label>
                            <select class="form-select" id="recorrenciaTarefa" required>
                                <option value="Não repete" selected>Não repete</option>
                                <option value="Diariamente">Diariamente</option>
                                <option value="Semanalmente">Semanalmente</option>
                                <option value="Mensalmente">Mensalmente</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="descricaoTarefa" class="form-label">Descrição</label>
                            <textarea class="form-control" id="descricaoTarefa" rows="3"></textarea>
                        </div>
                    </form>
                    <div id="areaBotaoConcluido" class="d-none">
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="tarefaRealizada">
                            <label class="form-check-label" for="tarefaRealizada">Tarefa realizada</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" id="btnExcluirTarefa">Excluir</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="btnSalvarTarefa">Salvar</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    instanciaModalTarefa = new bootstrap.Modal(document.getElementById('modalTarefa'));

    const btnSalvar = document.getElementById('btnSalvarTarefa');
    const btnExcluir = document.getElementById('btnExcluirTarefa');
    const formTarefa = document.getElementById('formTarefa');

    btnSalvar.addEventListener('click', () => {
        console.log("Botão salvar clicado");
        if (formTarefa.checkValidity()) {
            salvarTarefa();
            instanciaModalTarefa.hide();
        } else {
            formTarefa.reportValidity();
        }
    });

    btnExcluir.addEventListener('click', () => {
        if (tarefaEditandoId !== null) {
            excluirTarefa(tarefaEditandoId);
            instanciaModalTarefa.hide();
        }
    });

    document.getElementById('modalTarefa').addEventListener('show.bs.modal', function (event) {
        const botaoExcluir = document.getElementById('btnExcluirTarefa');
        const areaBotaoConcluido = document.getElementById('areaBotaoConcluido');

        if (tarefaEditandoId !== null) {
            document.getElementById('modalTarefaLabel').textContent = 'Editar Tarefa';
            botaoExcluir.classList.remove('d-none');
            areaBotaoConcluido.classList.remove('d-none');
        } else {
            document.getElementById('modalTarefaLabel').textContent = 'Nova Tarefa';
            botaoExcluir.classList.add('d-none');
            areaBotaoConcluido.classList.add('d-none');
        }
    });
}

function abrirModalNovaTarefa(data, hora = '08:00') {
    tarefaEditandoId = null;
    criarModalTarefa();

    const dataFormatada = formatarDataParaInput(data);

    document.getElementById('tituloTarefa').value = '';
    document.getElementById('dataTarefa').value = dataFormatada;
    document.getElementById('horaTarefa').value = hora + ':00';
    document.getElementById('prioridadeTarefa').value = 'Média';
    document.getElementById('descricaoTarefa').value = '';
    document.getElementById('recorrenciaTarefa').value = 'Não repete';

    document.getElementById('btnExcluirTarefa').classList.add('d-none');

    instanciaModalTarefa?.show();
}

function abrirModalEditarTarefa(idTarefa) {
    const tarefa = tarefas.find(t => t.id === idTarefa);
    if (!tarefa) return;

    criarModalTarefa();

    tarefaEditandoId = idTarefa;
    document.getElementById('tituloTarefa').value = tarefa.titulo;
    document.getElementById('dataTarefa').value = tarefa.data;
    document.getElementById('horaTarefa').value = tarefa.hora;
    document.getElementById('prioridadeTarefa').value = tarefa.prioridade;
    document.getElementById('descricaoTarefa').value = tarefa.descricao || '';
    document.getElementById('tarefaRealizada').checked = tarefa.realizada || false;
    document.getElementById('recorrenciaTarefa').value = tarefa.recorrencia || 'Não repete';

    document.getElementById('btnExcluirTarefa').classList.remove('d-none');
    document.getElementById('areaBotaoConcluido').classList.remove('d-none');

    instanciaModalTarefa?.show();
}


function salvarTarefa() {
    const titulo = document.getElementById('tituloTarefa').value;
    const data = document.getElementById('dataTarefa').value;
    const hora = document.getElementById('horaTarefa').value;
    const prioridade = document.getElementById('prioridadeTarefa').value;
    const descricao = document.getElementById('descricaoTarefa').value;
    const recorrencia = document.getElementById('recorrenciaTarefa').value;
    const realizada = document.getElementById('tarefaRealizada')?.checked || false;

    const userId = typeof currentLoggedInUserId !== 'undefined' ? currentLoggedInUserId : "defaultUser";

    if (tarefaEditandoId !== null) {
        const index = tarefas.findIndex(t => t.id === tarefaEditandoId);
        if (index === -1) return;

        const tarefaOriginal = tarefas[index];

        const tarefaEditada = {
            ...tarefaOriginal,
            titulo, data, hora, prioridade, descricao, recorrencia, realizada
        };

        if (!tarefaOriginal.realizada && tarefaEditada.realizada) {
            if (typeof window.addXp === 'function') {
                const xpGanho = tarefaEditada.exp || 10; window.addXp(xpGanho); console.log(`Parabéns! Você ganhou ${xpGanho} XP por concluir a tarefa!`);
            }
        }
        if (tarefaEditada.recorrencia !== 'Não repete' && !tarefaOriginal.realizada && tarefaEditada.realizada) {

            if (tarefaEditada.serieId) {
                const tarefasDaSerie = tarefas
                    .filter(t => t.serieId === tarefaEditada.serieId)
                    .sort((a, b) => new Date(a.data) - new Date(b.data));

                const indexAtualNaSerie = tarefasDaSerie.findIndex(t => t.id === tarefaEditada.id);

                let sequenciaAnterior = 0;
                if (indexAtualNaSerie > 0) {
                    const tarefaAnterior = tarefasDaSerie[indexAtualNaSerie - 1];
                    if (tarefaAnterior.realizada) {
                        sequenciaAnterior = tarefaAnterior.sequencia || 0;
                    }
                }
                tarefaEditada.sequencia = sequenciaAnterior + 1;
            } else {
                tarefaEditada.sequencia = (tarefaOriginal.sequencia || 0) + 1;
            }
        } else if (tarefaOriginal.realizada && !tarefaEditada.realizada) {
            tarefaEditada.sequencia = 0;
        }

        fetch(`http://localhost:3000/tarefas/${tarefaEditandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefaEditada)
        })
            .then(response => response.json())
            .then(() => {
                recarregarTarefas();
                if (instanciaModalTarefa) instanciaModalTarefa.hide();
                tarefaEditandoId = null;
            })
            .catch(error => console.error('Erro ao editar tarefa:', error));

    } else {
        const serieId = recorrencia !== 'Não repete' ? `serie-${Date.now()}` : null;

        const novaTarefa = {
            titulo, data, hora, prioridade, descricao, realizada: false, recorrencia,
            exp: 10, sequencia: 0, userId, serieId: serieId
        };

        fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTarefa)
        })
            .then(response => response.json())
            .then((tarefaCriada) => {
                if (recorrencia !== "Não repete") {
                    gerarTarefasRecorrentes(tarefaCriada);
                }
                recarregarTarefas();
                if (instanciaModalTarefa) instanciaModalTarefa.hide();
            })
            .catch(error => console.error('Erro ao salvar nova tarefa:', error));
    }
}

function gerarTarefasRecorrentes(tarefaBase) {
    const dataOriginal = new Date(tarefaBase.data + 'T00:00:00');
    const anoOriginal = dataOriginal.getFullYear();
    const mesOriginal = dataOriginal.getMonth();
    const tarefasAGerar = [];

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (tarefaBase.recorrencia === 'Diariamente') {
        let dataAtual = new Date(dataOriginal);

        while (dataAtual.getMonth() === mesOriginal) {
            dataAtual.setDate(dataAtual.getDate() + 1);

            if (dataAtual.getMonth() !== mesOriginal) {
                break;
            }

            const novaData = new Date(dataAtual);
            if (novaData >= hoje) {
                tarefasAGerar.push({ ...tarefaBase, data: formatarDataParaInput(novaData) });
            }
        }
    } else if (tarefaBase.recorrencia === 'Semanalmente') {
        let dataAtual = new Date(dataOriginal);

        while (dataAtual.getMonth() === mesOriginal) {
            dataAtual.setDate(dataAtual.getDate() + 7);

            if (dataAtual.getMonth() !== mesOriginal) {
                break;
            }

            const novaData = new Date(dataAtual);
            if (novaData >= hoje) {
                tarefasAGerar.push({ ...tarefaBase, data: formatarDataParaInput(novaData) });
            }
        }
    } else if (tarefaBase.recorrencia === 'Mensalmente') {
        const diaDaSemanaOriginal = dataOriginal.getDay();
        const ordinalDaSemana = Math.ceil(dataOriginal.getDate() / 7);

        let dataDeReferencia = new Date(dataOriginal);

        while (dataDeReferencia.getFullYear() === anoOriginal) {
            dataDeReferencia.setMonth(dataDeReferencia.getMonth() + 1, 1);
            const mesAlvo = dataDeReferencia.getMonth();
            const anoAlvo = dataDeReferencia.getFullYear();

            if (anoAlvo > anoOriginal) break;

            const primeiroDiaDoMes = new Date(anoAlvo, mesAlvo, 1);
            const diaDaSemanaDoPrimeiroDia = primeiroDiaDoMes.getDay();
            let dataDaPrimeiraOcorrencia = 1 + (diaDaSemanaOriginal - diaDaSemanaDoPrimeiroDia + 7) % 7;
            let diaFinal = dataDaPrimeiraOcorrencia + ((ordinalDaSemana - 1) * 7);
            let novaData = new Date(anoAlvo, mesAlvo, diaFinal);

            if (novaData.getMonth() === mesAlvo && novaData >= hoje) {
                tarefasAGerar.push({ ...tarefaBase, data: formatarDataParaInput(novaData) });
            }
        }
    }

    tarefasAGerar.forEach(tarefa => {
        delete tarefa.id;
        tarefa.realizada = false;
        tarefa.userId = tarefaBase.userId;

        fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefa)
        }).catch(err => console.error('Erro ao criar tarefa recorrente:', err));
    });
}

function excluirTarefa(idTarefa) {
    fetch(`http://localhost:3000/tarefas/${idTarefa}`, {
        method: 'DELETE'
    })
        .then(() => {
            recarregarTarefas();
            if (instanciaModalTarefa) instanciaModalTarefa.hide();
        })

        .catch(error => console.error('Erro ao excluir tarefa:', error));
}

function formatarDataParaInput(data) {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function mostrarDetalhesTarefa(tarefa) {
    abrirModalEditarTarefa(tarefa.id);
}

function configurarEventosCalendario() {
    document.querySelectorAll('.cardDiaCalendario').forEach(celula => {
        celula.removeEventListener('dblclick', celula.eventoCliqueCalendario);

        celula.eventoCliqueCalendario = function (e) {
            if (e.target.closest('.tarefa-evento')) return;

            const diaTexto = this.querySelector('div')?.textContent;

            if (!diaTexto || isNaN(parseInt(diaTexto))) return;
            if (this.querySelector('div[style*="color: gray"]')) return;

            const dia = parseInt(diaTexto);
            const ano = dataAtualCalendario.getFullYear();
            const mes = dataAtualCalendario.getMonth();

            const data = new Date(ano, mes, dia);
            abrirModalNovaTarefa(data);
        };

        celula.addEventListener('dblclick', celula.eventoCliqueCalendario);
    });

    document.querySelectorAll('.celula-hora-diaria').forEach(celula => {
        celula.removeEventListener('dblclick', celula.eventoCliqueCalendario);

        celula.eventoCliqueCalendario = function (e) {
            if (e.target.closest('.tarefa-evento')) return;

            const dataStr = this.dataset.data;
            const horaStr = this.dataset.hora;

            if (!dataStr) return;

            const data = new Date(dataStr + 'T00:00:00');
            abrirModalNovaTarefa(data, horaStr?.split(':')[0] || '08');
        };

        celula.addEventListener('dblclick', celula.eventoCliqueCalendario);
    });

    document.querySelectorAll('.tarefa-evento').forEach(tarefaEl => {
        if (tarefaEl.eventoCliqueTarefa) {
            tarefaEl.removeEventListener('click', tarefaEl.eventoCliqueTarefa);
        }

        tarefaEl.eventoCliqueTarefa = function (e) {
            e.stopPropagation();
            const idTarefa = this.getAttribute('data-id-tarefa');
            if (idTarefa) {
                const tarefa = tarefas.find(t => t.id === idTarefa);
                if (tarefa) {
                    mostrarDetalhesTarefa(tarefa);
                }
            }
        };

        tarefaEl.addEventListener('click', tarefaEl.eventoCliqueTarefa);
    });
}

const atualizarCalendarioOriginal2 = atualizarCalendario;
atualizarCalendario = function () {
    atualizarCalendarioOriginal2();
    setTimeout(() => {
        configurarEventosCalendario();
    }, 100);
};

renderizarTarefas();