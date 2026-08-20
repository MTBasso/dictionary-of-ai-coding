---
description: O processo que define os parâmetros de um modelo expondo-o a enormes volumes de texto e ajustando-os para melhorar a previsão.
---

O processo que define os [parâmetros](./Parameters.md) de um [modelo](./Model.md), expondo-o a enormes volumes de texto e ajustando os parâmetros para melhorar a [previsão do próximo token](./Next-token%20prediction.md). É um processo único e caro, feito pelo [provedor de modelo](./Model%20provider.md). Abrange tanto o pré-treinamento (a rodada principal) quanto o pós-treinamento (refinamentos posteriores, como seguir instruções e segurança); a distinção não importa no nível deste glossário.

O mecanismo é repetição em escala: mostre ao modelo um trecho de texto, peça que ele preveja o próximo [token](./Token.md), empurre os parâmetros na direção do token que realmente veio, e repita ao longo de trilhões de tokens. Nada é guardado como fato ou regra — tudo o que o modelo "sabe" é efeito colateral de ficar melhor em prever, comprimido nos parâmetros como [conhecimento paramétrico](./Parametric%20knowledge.md).

Duas consequências importam no dia a dia. O treinamento termina em um ponto no tempo, então o modelo tem um [corte de conhecimento](./Knowledge%20cutoff.md) — ele não viu a versão da biblioteca que você atualizou mês passado. E treinamento não é algo que você faça: quando o modelo não conhece sua base de código, suas convenções ou suas APIs internas, a solução nunca é "ensinar o modelo" — é colocar esse material no [contexto](./Context.md), a única entrada que está na sua mão.

_Uso:_

"Dá para ele conhecer nossa API interna?"

"Por treinamento não — isso é um processo de meses, feito pelo provedor de modelo. Carregue a documentação da API no contexto; essa é a alavanca que você realmente tem."
