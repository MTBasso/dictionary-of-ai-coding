---
description: O entendimento compartilhado do que está sendo construído, comum a usuário e agente, mas separado de qualquer artefato.
aliases:
  - Conceito de design
---

O entendimento compartilhado do que está sendo construído, comum ao usuário e ao [agente](./Agent.md), mas separado de qualquer artefato. É o termo de Brooks (_The Design of Design_): a conversa, os [artefatos de handoff](./Handoff%20artifact.md) e o código são todos artefatos que tentam capturar ou alcançar o conceito de design, mas nenhum deles _é_ o conceito. A qualidade do conceito de design é sentida pela qualidade da conversa que o construiu.

O termo nomeia a lacuna por trás de uma frustração conhecida: o agente escreve exatamente o que você pediu e mesmo assim está errado. A causa usual é que você ainda não tinha descoberto por completo o que queria. O conceito de design não estava terminado na sua própria cabeça — seu prompt capturou as partes que você já tinha resolvido e ficou em silêncio sobre as que não. O agente preencheu esses silêncios com as próprias suposições, porque não havia nada com que se alinhar. Nada deu defeito. Não havia conceito de design compartilhado, porque ainda não existia um inteiro para compartilhar.

Dá para perceber que um conceito de design é compartilhado do mesmo jeito que se percebe com um colega: a outra parte começa a responder perguntas que você ainda não fez do jeito que você responderia. Até lá, o trabalho é conversa — o [grilling](./Grilling.md) é a versão deliberada disso — e escrever uma [especificação](./Spec.md) cedo demais só registra o desalinhamento num artefato mais durável. O conceito de design também se move conforme você aprende; os artefatos ficam atrás dele, e é por isso que uma especificação fiel ao entendimento da semana passada ainda pode enganar a sessão desta semana.

_Uso:_

"Ele está escrevendo exatamente o que eu pedi e continua errado."

"Vocês ainda não compartilham um conceito de design — ele está preenchendo lacunas com suposições. Continua conversando até cancelamento, reembolso e entrega parcial baterem entre vocês, antes de deixar ele escrever uma especificação."
