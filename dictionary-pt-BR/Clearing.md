---
description: Encerrar a sessão atual e começar uma nova. A próxima mensagem parte de uma sessão vazia e de uma janela de contexto vazia.
aliases:
  - Limpeza
  - Limpar
---

Encerrar a [sessão](./Session.md) atual e começar uma nova. A próxima mensagem parte de uma sessão vazia e de uma [janela de contexto](./Context%20window.md) vazia. Em geral é iniciado por você.

Limpar é a cura para um contexto poluído. Uma sessão acumula de tudo: tentativas fracassadas, caminhos errados, [resultados de ferramenta](./Tool%20result.md) obsoletos, planos abandonados. O [modelo](./Model.md) relê tudo isso a cada [turno](./Turn.md), e histórico ruim atrapalha trabalho novo. Fundo numa sessão longa, o [agente](./Agent.md) fica mais vago e menos obediente — instruções que você deu com clareza são ignoradas, a qualidade escorrega, e cutucá-lo para fazer melhor não ajuda, porque o ruído em que ele está atolado continua no [contexto](./Context.md). Limpar remove o ruído.

Limpar não apaga a conversa. A maioria dos [harnesses](./Harness.md) guarda o histórico da sessão no seu computador, então a transcrição continua ali para ler ou retomar. O que se vai é o estado de trabalho do agente: o modelo é [sem estado](./Stateless.md), então a sessão nova não sabe nada do que a antiga sabia. Se a sessão contém decisões ou progresso de que a próxima vai precisar, peça ao agente que escreva um [artefato de handoff](./Handoff%20artifact.md) antes, e comece a nova sessão apontando para ele.

Compare com [compactação](./Compaction.md), que resume a sessão dentro do novo contexto em vez de começar do zero. Limpar é a ferramenta mais bruta: nada é levado adiante, inclusive a sujeira.

_Uso:_

"Ele está travado em loop no teste que falha."

"Limpa logo — começa uma sessão nova com o documento de plano e o arquivo de teste. Não adianta brigar com o contexto que já está lá."
