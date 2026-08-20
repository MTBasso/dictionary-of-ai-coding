---
description: Fatos que o agente consegue ler diretamente do contexto agora. Contraparte do conhecimento paramétrico.
---

Fatos que o [agente](./Agent.md) consegue ler diretamente do [contexto](./Context.md) agora — a tarefa do usuário, arquivos que o agente leu, [resultados de ferramenta](./Tool%20result.md), o conteúdo do [AGENTS.md](./AGENTS.md.md) carregado no início da [sessão](./Session.md). Contraparte do [conhecimento paramétrico](./Parametric%20knowledge.md): o paramétrico é _recordado_ dos parâmetros; o contextual é _lido_ da [janela](./Context%20window.md). [Alucinações](./Hallucination.md) são bem menos comuns quando o agente trabalha a partir de conhecimento contextual — a resposta está bem na frente dele, não dragada de uma memória borrada.

Dos dois tipos de conhecimento, só o contextual está sob seu controle. Os parâmetros estão congelados, então o único jeito de dar ao [modelo](./Model.md) um conhecimento que lhe falta — um SDK interno, uma biblioteca lançada depois do [corte de conhecimento](./Knowledge%20cutoff.md), uma decisão tomada ontem — é colocá-lo no contexto. Boa parte do trabalho prático de programar com [IA](./AI.md) se reduz a isso: pôr os fatos certos diante do modelo no momento em que ele precisa deles.

Quando conhecimento contextual e paramétrico entram em conflito, o contextual em geral vence. Cole a documentação atual da API e o modelo a segue em vez da lembrança obsoleta da API antiga — embora a versão antiga ainda possa vazar, sobretudo já fundo numa sessão longa. Se o agente insiste em voltar a um padrão desatualizado apesar da documentação carregada, é conhecimento paramétrico vazando por cima do contextual; repetir a correção ou aproximá-la do trecho de trabalho ajuda.

Diferente do conhecimento paramétrico, o contextual custa algo para ser usado. Tudo carregado na janela gasta [tokens](./Token.md) e compete pelo [orçamento de atenção](./Attention%20budget.md) do modelo, então carregar mais não é automaticamente melhor — o objetivo é ter os fatos relevantes na janela, não todos os fatos.

_Use este termo_ apenas ao contrastar com conhecimento paramétrico; caso contrário, diga só **contexto**.

_Evite:_ "memória de trabalho" — conhecimento contextual é o que está na janela _agora_; um [sistema de memória](./Memory%20system.md) é o que traz conteúdo entre sessões para dentro dela. Escalas diferentes, não confunda.

_Uso:_

"Por que ele acerta a API quando eu colo a documentação e inventa quando não colo?"

"Com a documentação, é conhecimento contextual — ele está lendo da página. Sem ela, é paramétrico, e os endpoints raros ficam borrados."
