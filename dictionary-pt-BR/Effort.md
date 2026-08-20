---
description: Um controle de quanto o modelo raciocina antes de responder. Mais esforço gasta mais tokens de saída para atacar problemas difíceis.
aliases:
  - Esforço de raciocínio
  - Reasoning effort
---

Esforço é um controle de quanto raciocínio um [modelo](./Model.md) faz antes de responder. Definido por [requisição ao provedor de modelo](./Model%20provider%20request.md), ele determina o tamanho do pensamento que o modelo percorre antes de começar a escrever a resposta que você vê. Esse pensamento é gerado no momento da [inferência](./Inference.md), como todo o resto; o [harness](./Harness.md) muitas vezes o esconde, mas é trabalho real que o modelo está fazendo.

Esforço mais alto custa mais e é mais lento. O raciocínio é emitido como [tokens](./Token.md), cobrado como [tokens de saída](./Output%20tokens.md) mesmo quando você nunca os vê, e produzido um token por vez — então subir o esforço alonga a espera até a resposta chegar e aumenta a conta. A troca é mais deliberação contra velocidade e custo.

A maioria dos harnesses expõe o esforço como uma escada curta:

| Nível  | Para que serve                                                                 |
| ------ | ------------------------------------------------------------------------------ |
| Baixo  | Edições mecânicas, consultas, mudanças bem especificadas com um caminho claro. |
| Médio  | Programação do dia a dia — o padrão de sempre.                                 |
| Alto   | Bugs complicados, decisões de projeto, planos de várias etapas.                |
| Máximo | Os problemas mais difíceis, em que uma resposta errada é cara de desfazer.     |

O sintoma de errar a mão corta para os dois lados. Coloque esforço baixo demais em um problema difícil e você recebe uma resposta confiante e rasa, que pulou o raciocínio de que o problema precisava — ela lê bem e está errada de um jeito que sai caro depois. Coloque no máximo para renomear uma linha e você espera um pensamento longo que não produz nada que o nível mais baixo não produziria.

Ajuste o esforço à tarefa, não à [sessão](./Session.md). Suba na parte que é genuinamente difícil de raciocinar, e desça no trabalho repetitivo em volta.

_Uso:_

"Ele continua errando essa correção de concorrência — já expliquei três vezes."

"Sobe o esforço. Esse é um bug pesado de raciocínio, e no ajuste padrão ele não está pensando tempo suficiente antes de se comprometer com uma abordagem."
