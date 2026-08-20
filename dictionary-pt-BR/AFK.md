---
description: Um padrão de trabalho em que o usuário dispara uma sessão e deixa o agente rodar sem supervisão (longe do teclado).
aliases:
  - away from keyboard
  - Longe do teclado
---

Do inglês _away from keyboard_, longe do teclado. Um padrão de trabalho em que o usuário dispara uma [sessão](./Session.md) e deixa o [agente](./Agent.md) rodar sem supervisão. É o multiplicador de vazão da programação com [IA](./AI.md) — várias sessões AFK podem rodar em paralelo enquanto você dorme, come ou trabalha em outra coisa. Em geral exige um [modo de permissão](./Permission%20mode.md) permissivo mais [sandbox](./Sandbox.md) para ser seguro.

Quando você não está lá, o agente lida com ambiguidade de outro jeito. Enquanto você olha, uma decisão ambígua aparece como pergunta e você responde; depois que você sai, o agente escolhe um padrão e segue, e toda decisão posterior é construída sobre aquele chute. A falha característica é voltar e encontrar horas de trabalho pronto e confiante, erguido sobre uma escolha errada feita nos primeiros dez minutos. O trabalho não é desleixado — é coerente, só que coerente sobre a coisa errada.

Como você não pode dar entrada durante a execução, dê antes e depois. Antes: resolva a ambiguidade de saída — uma sessão de [grilling](./Grilling.md), uma [especificação](./Spec.md) escrita — para sobrarem menos lacunas para o agente preencher sozinho. Durante: [verificações automatizadas](./Automated%20check.md) e [revisão automatizada](./Automated%20review.md) ocupam o lugar da atenção que você não está dando, falhando rápido no que pode ser pego mecanicamente. Depois: a execução termina em algo revisável — um PR, não mudanças já mescladas. AFK não elimina a [revisão humana](./Human%20review.md); adia tudo para o fim, e é por isso que o que chega no fim precisa valer a revisão. É também por isso que a [AX](./AX.md) importa mais em execuções AFK — sem ninguém olhando, o ambiente é o único apoio que o agente tem.

_Evite:_ "agente em segundo plano" — centra a máquina ("rodando em segundo plano") em vez do padrão humano ("o usuário foi embora"). AFK nomeia o fato que importa: o usuário não está olhando.

_Uso:_

"Estou rodando isso AFK — três agentes em sandbox na refatoração, e reviso os PRs de manhã."

"Com [permissões ignoradas](./Agent%20mode.md)?"

"Isso, [sistema de arquivos](./Filesystem.md) somente leitura, sem rede."
