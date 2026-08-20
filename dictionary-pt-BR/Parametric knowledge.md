---
description: O que o modelo sabe pelo treinamento, guardado nos parâmetros. Congelado no treinamento. Contraparte do conhecimento contextual.
---

O que o [modelo](./Model.md) "sabe" pelo [treinamento](./Training.md), guardado em seus [parâmetros](./Parameters.md). Congelado no momento do treinamento — o modelo não consegue ver os próprios parâmetros nem atualizá-los. Detalhe se perde no aperto: bilhões de fatos são espremidos num número fixo de parâmetros, e os raros ficam borrados. É a fonte da fluência em temas comuns e da fabricação em temas incomuns. Contraparte do [conhecimento contextual](./Contextual%20knowledge.md).

Conhecimento paramétrico não é guardado como fatos. O treinamento nunca dá ao modelo um banco de dados para consultar; ele ajusta parâmetros até o modelo prever texto bem, e um modelo que prevê bem textos sobre um tema se comporta como se soubesse o tema. O quão confiável é esse conhecimento acompanha a frequência com que algo apareceu nos dados de treinamento: um tema com milhões de exemplos é reproduzido com precisão; num tema com só um punhado, o modelo chuta com base em como temas parecidos são. Reproduzir e chutar são o mesmo processo para o modelo, então ele não consegue dizer qual dos dois está fazendo. Uma resposta fabricada chega com a mesma fluência de uma correta. [Alucinação](./Hallucination.md) é o modelo chutando errado.

Conhecimento paramétrico também envelhece. Os parâmetros param de mudar no [corte de conhecimento](./Knowledge%20cutoff.md), então uma biblioteca lançada ou renomeada depois dessa data não existe neles, e uma API que mudou é lembrada na forma antiga.

Para as duas lacunas — rara demais e recente demais — o remédio é o mesmo: o conhecimento não pode ser acrescentado aos parâmetros, então tem que ser fornecido como conhecimento contextual.

_Uso:_

"Ele escreve React impecável, mas inventa métodos no nosso SDK interno."

"React é denso no conhecimento paramétrico — milhões de exemplos de treinamento. Seu SDK não é, então o modelo preenche com formatos plausíveis. Carrega a documentação do SDK no [contexto](./Context.md)."
