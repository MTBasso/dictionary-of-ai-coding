---
description: Uma mensagem do usuário mais tudo o que o agente faz em resposta, até devolver a vez. Contém uma ou mais requisições ao provedor.
---

Uma mensagem do usuário mais tudo o que o [agente](./Agent.md) faz em resposta, até devolver a vez ao usuário. Contém uma ou mais [requisições ao provedor de modelo](./Model%20provider%20request.md) — muitas, se o agente chamar [ferramentas](./Tool.md). Uma pergunta de esclarecimento fecha o turno; sua resposta abre o próximo. A hierarquia é [sessão](./Session.md) **> Turno > Requisição ao provedor de modelo**.

O que torna o turno digno de nome é que a duração dele é decisão do agente, não sua. Você entrega uma mensagem; o agente decide quantas chamadas de ferramenta encadear antes de devolver a vez. Um turno pode ser uma resposta de uma frase ou vinte minutos lendo, editando e rodando testes. É a mesma propriedade vista de dois ângulos: turnos longos são o que tornam o trabalho [AFK](./AFK.md) possível, e turnos longos também são onde as coisas dão errado sem supervisão — quando o agente devolve a vez, ele pode ter derivado bem longe do que você queria dizer.

O turno também é a unidade natural de direcionamento. Tudo dentro de um turno acontece sem você; os intervalos entre turnos são onde você redireciona. A maioria dos [harnesses](./Harness.md) suaviza isso: você pode interromper no meio do turno para parar o agente e redirecioná-lo, ou digitar uma mensagem enquanto ele trabalha, que será lida quando o turno terminar. Se você se pegar repetidamente insatisfeito com onde os turnos param, a saída costuma ser pedir turnos menores — um plano primeiro, um passo por vez — trocando autonomia por intervalos mais frequentes para direcionar.

_Uso:_

"Um turno levou dois minutos?"

"Ele fez catorze [chamadas de ferramenta](./Tool%20call.md) dentro desse turno — cada uma é uma requisição separada ao provedor de modelo. A latência se acumula antes de o agente finalmente devolver a vez."
