---
description: Um sistema que tenta dar estado a um agente entre sessões, persistindo no ambiente e recarregando no início da sessão.
aliases:
  - Sistema de memória
---

Um sistema que tenta tornar um [agente](./Agent.md) [com estado](./Stateful.md) entre [sessões](./Session.md). Persiste informação no [ambiente](./Environment.md) durante uma sessão e a recarrega na [janela de contexto](./Context%20window.md) no início das seguintes, para que o agente leve continuidade além de você [limpar](./Clearing.md) a sessão.

Um sistema de memória tem duas metades. O caminho de escrita: durante uma sessão, o agente registra o que aprendeu — uma preferência que você declarou, um fato sobre o projeto — como arquivos no ambiente. O caminho de leitura: no início da sessão, o [harness](./Harness.md) carrega esses arquivos, ou um índice deles, de volta na janela de contexto. Muitos harnesses trazem o próprio sistema de memória — o `/memory` do Claude Code é um deles — mas você também pode construir o seu: um diretório de notas mais uma instrução no [AGENTS.md](./AGENTS.md.md) mandando consultá-lo.

Valem os mesmos trade-offs de qualquer conteúdo sempre carregado. Memórias se acumulam, então a maioria dos sistemas carrega um índice de uma linha e deixa os corpos atrás de [ponteiros de contexto](./Context%20pointer.md) em vez de embutir tudo. E memórias são [fontes secundárias](./Secondary%20source.md), então derivam: um fato registrado em março é carregado com a mesma confiança em junho, depois de o projeto ter seguido em frente. Um sistema de memória precisa de poda, do mesmo jeito que o AGENTS.md precisa.

_Uso:_

"Eu tenho que ficar repetindo que a gente usa Postgres, não MySQL."

"Monta um sistema de memória — escreve o que ele aprende no [sistema de arquivos](./Filesystem.md) no primeiro [turno](./Turn.md) e recarrega no início da sessão. O [modelo](./Model.md) em si é [sem estado](./Stateless.md); a camada de memória finge a continuidade."
