---
description: Uma árvore de arquivos e diretórios em que o agente lê, escreve e executa — o ambiente padrão de um agente de programação.
---

Uma árvore de arquivos e diretórios em que o [agente](./Agent.md) lê, escreve e executa — o tipo padrão de [ambiente](./Environment.md) para um agente de programação. [AGENTS.md](./AGENTS.md.md), [skills](./Skill.md), código-fonte, scripts de build e configurações de [ferramenta](./Tool.md) moram todos num sistema de arquivos. Quando um [harness](./Harness.md) "inicia no seu projeto", ele está apontando o agente para um sistema de arquivos.

O agente só toca nele por meio de [chamadas de ferramenta](./Tool%20call.md) — ler um arquivo, escrever um, rodar um comando de shell. Nada em disco está na [janela de contexto](./Context%20window.md) até que uma chamada de ferramenta o carregue, e é isso que permite ao agente trabalhar num repositório muito maior que a janela: o sistema de arquivos guarda tudo, o contexto guarda só o que a tarefa atual leu. Alguns harnesses carregam por padrão os nomes de arquivo do diretório atual na janela de contexto — não o conteúdo, só a árvore — e eles funcionam como [ponteiros de contexto](./Context%20pointer.md): o agente vê o que existe e lê os arquivos de que precisa.

E ele é compartilhado com você. Os arquivos que o agente edita são os mesmos que você abre no editor e compara no git — o sistema de arquivos é a área de trabalho comum onde você revisa o que o agente fez.

_Uso:_

"Por que ele não está pegando meu AGENTS.md?"

"Ele está rodando contra outro sistema de arquivos — o [sandbox](./Sandbox.md) montou o diretório pai, não a raiz do projeto. Reaponta o harness."
