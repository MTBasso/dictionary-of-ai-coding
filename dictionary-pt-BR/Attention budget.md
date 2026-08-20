---
description: Cada token tem uma quantidade finita de influência para distribuir pelo resto do contexto. É por token e não cresce com o contexto.
---

Cada [token](./Token.md) tem uma quantidade finita de influência para distribuir pelo resto do [contexto](./Context.md). Influência pesada em [uma relação](./Attention%20relationship.md) deixa menos para as outras. O orçamento é por token e não cresce quando o contexto cresce, e é por isso que [sessões](./Session.md) longas diluem.

Pense nisso como sinal e ruído. Sua instrução é um sinal de volume fixo; todos os outros tokens da [janela de contexto](./Context%20window.md) são som concorrente. A instrução nunca fica mais baixa — continua lá, caractere por caractere — mas conforme o contexto cresce, a sala fica mais barulhenta em volta dela, e a relação sinal-ruído cai. Uma instrução que era a coisa mais alta com 10 mil tokens de contexto é zumbido de fundo com 150 mil. Esse é o mecanismo por trás da [degradação de atenção](./Attention%20degradation.md): o modelo não esquece; o sinal se perde no ruído.

O sintoma se lê como desobediência — o agente concordou com uma restrição no começo e depois se afasta dela, e recolar a restrição ajuda só por pouco tempo. A causa não é a instrução; é todo o resto da janela competindo com ela.

O que você controla é o que entra no contexto. Conteúdo que não serve à tarefa não é neutro — é ruído sobre tudo o que serve. Mantenha a janela pequena, [limpe](./Clearing.md) quando o contexto acumulado deixar de se pagar, e repita as restrições que importam em vez de confiar que a menção inicial vai se sustentar.

_Uso:_

"Por que ele fica ignorando o schema que eu colei lá em cima?"

"A gente já está bem dentro da [zona burra](./Smart%20zone.md) — o orçamento de atenção de cada token é fixo, mas o contexto continuou crescendo. O sinal do schema agora compete com milhares de tokens mais novos."
