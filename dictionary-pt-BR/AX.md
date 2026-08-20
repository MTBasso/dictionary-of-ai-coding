---
description: "Experiência do agente: o quanto o ambiente está preparado para um agente trabalhar bem — verificações, arquitetura e contexto livre."
aliases:
  - Agent experience
  - Experiência do agente
---

Experiência do agente — o quanto o [ambiente](./Environment.md) está preparado para um [agente](./Agent.md) fazer um bom trabalho numa base de código. É a contraparte da [DX](./DX.md) voltada ao agente. Quando o mesmo agente vai bem num repositório e mal em outro — mesmo [modelo](./Model.md), mesmo [harness](./Harness.md) — a diferença costuma ser a AX. O instinto é culpar o modelo ou reescrever o prompt; a correção está mais vezes no repositório.

Uma boa AX tem três dimensões principais:

| Dimensão                   | Como é uma boa AX                                                                                                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verificações automatizadas | [Verificações](./Automated%20check.md) rápidas e determinísticas — tipos, testes, lint — a partir das quais o agente se autocorrige sem humano                                                                                    |
| Arquitetura                | Uma base de código que o agente navega sem ler tudo: estrutura previsível, bastante comportamento atrás de interfaces pequenas, nomes que dizem o que as coisas fazem                                                             |
| Contexto livre             | [AGENTS.md](./AGENTS.md.md), [skills](./Skill.md) e [ferramentas](./Tool.md) enxutos, para que a maior parte da [janela de contexto](./Context%20window.md) fique disponível e o agente siga na [zona esperta](./Smart%20zone.md) |

AX e DX se sobrepõem — boas verificações e arquitetura limpa ajudam os dois públicos — mas divergem. Pessoas toleram conhecimento tribal, CI lenta e "pergunta para a Sarah sobre o módulo de cobrança"; agentes não. Agentes não se beneficiam de tooltips da IDE nem de dashboards bonitos; eles precisam de falhas como texto num [resultado de ferramenta](./Tool%20result.md). Uma base de código pode ter boa DX e AX ruim.

_Evite:_ tratar AX como sinônimo de DX — os públicos precisam de investimentos diferentes.

_Uso:_

"O agente escreve um código ótimo no repositório da API e um lixo no do frontend."

"O repositório da API tem tipos estritos e uma suíte de testes rápida; o do frontend não tem nenhum dos dois e tem quarenta skills sempre carregadas. Isso é uma lacuna de AX, não um problema de modelo."
