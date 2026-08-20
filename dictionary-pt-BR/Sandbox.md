---
description: Um ambiente isolado onde o agente roda — contêiner, VM ou shell restrito. Limita o raio de dano das ações do agente.
aliases:
  - Sandboxing
  - Isolamento
---

Um [ambiente](./Environment.md) isolado dentro do qual o [agente](./Agent.md) roda — um contêiner, uma VM, um [sistema de arquivos](./Filesystem.md) efêmero ou um shell de permissões restritas. Limita o raio de dano das ações do agente: mesmo que ele rode comandos destrutivos ou baixe algo malicioso, o estrago fica contido. É o substrato de segurança que torna o [AFK](./AFK.md) praticável.

O sandbox e o [modo de permissão](./Permission%20mode.md) resolvem o mesmo problema por pontas opostas. Permissões perguntam antes de uma ação rodar; um sandbox limita o que a ação alcança caso ela rode. Permissões exigem você [no laço](./Human-in-the-loop.md) — cada pedido é uma interrupção — e uma sessão que pergunta o tempo todo é pouco autônoma. Um sandbox gasta infraestrutura em vez de atenção: quanto mais forte o isolamento, menos perguntas precisam ser feitas.

O isolamento vem em graus:

| Grau           | O que é                                                               | O que contém                                           |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| Shell restrito | Confinamento em nível de SO em volta de cada comando                  | Escritas fora do projeto, acesso à rede                |
| Contêiner      | Sistema de arquivos novo, sem credenciais montadas, descartado depois | Qualquer coisa que o agente faça com a própria máquina |
| VM / nuvem     | Uma máquina separada, muitas vezes fornecida pelo harness             | Tudo, incluindo escapes em nível de kernel             |

O que nenhum sandbox contém: ações que saem dele legitimamente. Um agente com suas credenciais do git pode dar push; um com acesso à rede pode chamar APIs de produção. Decida o que atravessa a fronteira antes de decidir a espessura dela.

_Uso:_

"Quero deixar ele rodar com [permissões ignoradas](./Agent%20mode.md) a noite toda, mas não estou pronto para isso."

"Põe num sandbox — contêiner novo, sem credenciais montadas, sem saída de rede. Na pior das hipóteses ele destrói o próprio sistema de arquivos e você descarta o contêiner."
