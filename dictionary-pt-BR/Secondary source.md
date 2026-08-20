---
description: Um relato de uma fonte primária, um passo afastado — resumos, documentação. Barato de carregar, com perdas por construção.
aliases:
  - Fonte secundária
---

Um relato de uma [fonte primária](./Primary%20source.md), um passo afastado — documentação descrevendo código, um resumo descrevendo uma transcrição, um relatório descrevendo resultados de busca. Mais barato de carregar na [janela de contexto](./Context%20window.md) que a fonte que descreve, e com perdas por construção: quem escreveu decidiu o que importava, e o que foi descartado é invisível para quem só tem o resumo.

Boa parte da engenharia de [contexto](./Context.md) é a fabricação de fontes secundárias. A [compactação](./Compaction.md) transforma o histórico da [sessão](./Session.md) num resumo que semeia a sessão seguinte. Um [subagente](./Subagent.md) queima o próprio contexto numa busca barulhenta e devolve um relatório curto. Um [artefato de handoff](./Handoff%20artifact.md) condensa as decisões de uma sessão num documento que a próxima lê. [Sistemas de memória](./Memory%20system.md) destilam o que uma sessão aprendeu em notas. Cada um faz a mesma troca: fidelidade por espaço.

Fontes secundárias falham de dois jeitos. Elas perdem informação — o resumo de compactação que perdeu a decisão sobre o schema, o relatório que não mencionou o caso extremo. E elas derivam — a fonte primária muda e o relato não acompanha, então a documentação descreve a arquitetura do trimestre passado com a confiança deste trimestre. Quando um [agente](./Agent.md) age sobre uma fonte secundária que falhou de qualquer um dos dois jeitos, ele trabalha com confiança a partir de informação errada; a solução é mandá-lo de volta à fonte primária.

Nenhuma das falhas torna fontes secundárias um erro. A janela de contexto é finita e fontes primárias são caras; sem resumos, relatórios e documentos de handoff, nada grande cabe. A habilidade está em saber quais detalhes sobrevivem à perda — e verificar contra a fonte primária quando algum não sobrevive. Uma fonte secundária bem feita carrega um [ponteiro de contexto](./Context%20pointer.md) de volta ao original — o resumo que nomeia a transcrição de onde veio, o documento que nomeia o arquivo que descreve — para que, quando o relato não bastar, o leitor possa seguir o ponteiro em vez de trabalhar com a perda.

_Uso:_

"O documento de handoff diz que a autenticação está pronta, mas a sessão nova fica achando renovação de token quebrada."

"O documento é uma fonte secundária — a última sessão escreveu o que acreditava, não o que é verdade. Faz a sessão nova rodar os testes de autenticação e confia na fonte primária."
