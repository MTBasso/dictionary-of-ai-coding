---
description: Um padrão de trabalho em que o usuário aceita o código do agente sem revisão humana. O diff é tratado como opaco.
---

Um padrão de trabalho em que o usuário aceita o código do [agente](./Agent.md) sem [revisão humana](./Human%20review.md). O diff é tratado como opaco — o que importa é se o programa se comporta, não o que há dentro dele. [Revisão automatizada](./Automated%20review.md) e [verificações automatizadas](./Automated%20check.md) ainda podem rodar; o vibe coding não diz nada sobre elas.

O termo vem de Andrej Karpathy, que o [cunhou no início de 2025](https://x.com/karpathy/status/1886192184808149383): você "se entrega totalmente às vibes" e "esquece que o código sequer existe" — descreve o que quer, aceita o que volta e julga pelo funcionamento.

O vibe coding troca inspeção por velocidade. Ler diffs costuma ser a etapa mais lenta do trabalho conduzido por agentes, então abrir mão disso remove o gargalo principal. Para código cujas falhas são baratas — [protótipos](./Prototyping.md), scripts de uma vez só, ferramentas internas — essa troca é razoável. O risco cresce com o tempo de vida e a criticidade do código.

O custo chega depois. Mudanças feitas assim se acumulam numa base de código que ninguém leu, e comportamento foi a única coisa verificada — então tudo o que o comportamento não revela, como um segredo escrito nos logs, um caso extremo faltando ou um tratamento de dados silenciosamente errado, vai para produção sem ser visto. A primeira vez que alguém depura o sistema é a primeira vez que alguém lê o código. Sem a revisão humana, a verificação automatizada que ainda rodar — testes, tipos, revisão automatizada — é o único portão pelo qual o código passa.

_Evite:_ "vibe coding" como sinônimo de "programação com IA de baixa qualidade" — o termo nomeia a postura de revisão, não o código resultante.

_Uso:_

"Você leu o que ele mudou no fluxo de autenticação?"

"Fiz no vibe — o login ainda funciona, foi só isso que eu conferi."

"Lê o diff antes de dar push; vibe em autenticação é assim que segredo vaza para o log."
