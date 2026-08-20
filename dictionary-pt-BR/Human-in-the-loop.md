---
description: Um padrão de trabalho em que humanos acompanham o agente durante a sessão — revisando, redirecionando ou colaborando em tempo real.
aliases:
  - HITL
  - Humano no laço
---

Um padrão de trabalho em que uma ou mais pessoas acompanham o [agente](./Agent.md) durante a [sessão](./Session.md) — revisando, redirecionando ou colaborando em tempo real. A pessoa está presente e envolvida, não apenas liberando ações individuais.

O contraste é com o trabalho [AFK](./AFK.md), em que o agente roda sem supervisão e você julga o resultado depois. Humano no laço significa pegar problemas enquanto eles ainda são baratos: você vê o agente pegar o arquivo errado, ler mal o requisito ou entrar num beco sem saída, e o redireciona numa frase — em vez de descobrir vinte minutos de trabalho confiante construído sobre aquele erro. Agentes não sabem de forma confiável quando estão fora do rumo; deixados sozinhos, tendem a seguir em frente em vez de parar e perguntar.

Qual padrão serve depende do trabalho. Tarefas bem especificadas, de baixo risco e fáceis de verificar combinam com AFK. Tarefas ambíguas, irreversíveis, ou cujo resultado final você teria dificuldade de revisar — uma migração de schema, uma decisão de projeto delicada, qualquer coisa que toque produção — pedem que você fique no laço. O julgamento é essencialmente: quão caro é um caminho errado, e quão tarde você o perceberia?

Alguns trabalhos são no laço por natureza, porque suas reações são a entrada. [Grilling](./Grilling.md) só funciona com você ali para responder às perguntas; [prototipagem](./Prototyping.md) só funciona com você ali para reagir ao artefato.

Ficar no laço custa sua atenção, que é o recurso escasso. Parte de ficar melhor com agentes é mover mais trabalho para fora do laço com segurança — com planos, [verificações automatizadas](./Automated%20check.md) e [revisão humana](./Human%20review.md) no fim, em vez de supervisão o tempo todo.

_Uso:_

"Deixo isso rodando AFK a noite toda?"

"Não, é migração de schema — mantém humano no laço. Quero ver cada passo e direcionar se ele escolher a coluna errada para o backfill."
