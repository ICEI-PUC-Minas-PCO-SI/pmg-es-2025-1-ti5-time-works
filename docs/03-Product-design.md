# Product design

<span style="color:red">Pré-requisitos: <a href="02-Product-discovery.md"> Product discovery</a></span>

## Histórias de usuários

Com base na análise das personas, foram identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Enzo Gabriel  | Organizar minha rotina para atingir minhas metas pessoais de maneira equilibrada/precisa. | Utilizar o sistema de rotina irá auxiliar na disciplina e consistência do Enzo, ambos os objetivos dele são bastante exigentes, com isso ele precisa ter bastante controle e dedicação em suas habilidades, é claro equilibrando ambas com o sistema. |
|Jakson - Vendedor/Entregador |  Otimizar o tempo de trabalho seguindo uma rotina diária, além disso quero ser mais produtivo e eficiente no meu trabalho. | Diminuir os imprevistos com clientes problemáticos, além disso melhorar meu convívio familiar graças a organização diária do sistema. | 
Julia - Designer | Organizar meu dia a dia de maneira eficaz e precisa | Fazer as entregas de seus pedidos de forma mais precisa e no prazo, além de auxiliar bastante no trabalho o planejamento será essencial nos estudos. | 
Maria - Veterinária | Organizar a sua rotina dentro e fora do trabalho | evitar quaisquer tipos de transtornos, tendo auxílio com os horários de medicação dos animais e assistência também com os horários de atendimento da clínica.|
Andreza - Analista | Organizar o seu dia a dia já que trabalha home-office e faz um trabalho secundário home-office também | Organizar a rotina total, principalmente pelo fato de alguns momentos do dia ter que cobrar as entregas de alguns motoristas, além da cobrança de algumas documentações aos funcionários responsáveis e se dedicar a sua vida pessoal. 
Carla Souza - Promotora | Organizar minhas tarefas e viagens, além de melhorar minha produtividade no trabalho. | Ela deseja otimizar a sua rotina bem movimentada para que alguns problemas que normalmente ocorrem devido a sua falta de rotina não aconteçam com tanta frequência.


## Proposta de valor

![Exemplo de proposta de valor](images/Proposta%20de%20valor.jpg)

## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade dos requisitos, aplique uma técnica de priorização e detalhe como essa técnica foi aplicada.

### Requisitos funcionais

| ID     | Descrição do Requisito                                   | 
| ------ | ---------------------------------------------------------- | 
| RF-001 | O sistema deve permitir o usuário cadastrar novas atividades e tarefas. |
| RF-002 | O sistema deve permitir o usuário visualizar as tarefas por mês, semana e dia. |
| RF-003 | O sistema deve permitir ao usuário excluir/editar suas tarefas. |
| RF-004 | O sistema deve ter uma tela de visualização rápida das tarefas mais importantes.|
| RF-005 | O sistema deve apresentar um tutorial/passo a passo de suas funcionalidades no primeiro acesso. |
| RF-006 | O sistema deve ter um meio de personalizar o perfil do usuário. |
| RF-007 | Deverá ter um sistema de sequência separadas por tarefas recorrentes|

### Requisitos não funcionais

| ID      | Descrição do Requisito                                                              | 
| ------- | ------------------------------------------------------------------------------------- |
| RNF-001 | O sistema deve ser compatível com navegadores modernos como o Chrome, Firefox e Edge. |
| RNF-002 | DO sistema de rotina deve garantir que os dados do usuário sejam armazenados e transmitidos de forma segura.|


## Restrições

O projeto está restrito aos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|001| O sistema precisa seguir regulamentações especificas, como não utilizar banco de dados e backend |
|002| Tempo de resposta. A performance precisa ser otimizada para garantir que não haja atrasos.|