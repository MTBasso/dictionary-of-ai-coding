---
description: A unidade atômica que um modelo lê e escreve. Mais ou menos do tamanho de uma palavra, mas não exatamente.
---

A unidade atômica que um [modelo](./Model.md) lê e escreve. Mais ou menos do tamanho de uma palavra, mas não exatamente — palavras comuns são um token, palavras raras ou longas se dividem em vários. O tamanho da [janela de contexto](./Context%20window.md), o custo e a latência são todos contados em tokens.

Texto vira token por meio de um tokenizador: um vocabulário fixo de dezenas de milhares de fragmentos, aprendido antes do [treinamento](./Training.md), que divide qualquer entrada em uma sequência de itens desse vocabulário. O modelo nunca vê caracteres ou palavras — todo pedaço de texto é convertido em tokens na entrada, e a [previsão do próximo token](./Next-token%20prediction.md) produz a saída um token por vez.

Como regra de bolso, um token é cerca de três quartos de uma palavra em inglês, então mil tokens são mais ou menos 750 palavras. Em português, que tem palavras mais longas e acentuação, a conta costuma ser um pouco menos favorável. Código é menos previsível: palavras-chave e expressões comuns são tokenizadas de forma compacta, enquanto identificadores gerados, hashes, blobs em base64 e saída minificada se partem em muitos tokens por "palavra". O padrão: texto que apareceu com frequência no material de origem do tokenizador recebe codificações curtas e eficientes; texto que não apareceu é picotado em vários pedaços pequenos. Um hash como `a3f9c2e1` nunca apareceu em lugar nenhum, então se divide em muitos tokens, enquanto `function` é um só. É por isso que um arquivo de aparência pequena, cheio de strings incomuns, pode ocupar uma fatia surpreendente da janela de contexto.

Tokens são a unidade em que todo o resto é medido. O custo é por token — provedores cobram [tokens de entrada](./Input%20tokens.md) e [tokens de saída](./Output%20tokens.md) separadamente. A velocidade é em tokens por segundo, já que a saída é gerada um token por vez. E a janela de contexto é um número fixo de tokens, então a contagem de tokens dos seus arquivos decide quanto cabe.

_Evite:_ "palavra" — as fronteiras dos tokens não coincidem com as das palavras, e tokens por segundo / tokens por real são as unidades que realmente importam.

_Uso:_

"Qual vai ser o tamanho desse prompt?"

"Passa pelo tokenizador — o schema é compacto, mas as chaves do JSON são estranhas, então vão se dividir em mais tokens do que você imagina."
