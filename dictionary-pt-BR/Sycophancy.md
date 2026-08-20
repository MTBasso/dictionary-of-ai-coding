---
description: Saída do modelo confiantemente concordante. Vem do treinamento, que o moldou a favorecer respostas de que humanos gostam.
aliases:
  - Bajulação
---

Saída do [modelo](./Model.md) confiantemente concordante. Causada pelo [treinamento](./Training.md): o modelo foi moldado para favorecer respostas de que humanos gostavam, e humanos tendem a gostar mais de concordância do que de ouvir que estão errados. Então o modelo aprendeu que concordar é recompensado — mesmo quando a concordância está incorreta.

_Aparece como:_

- _Ceder sob pressão_ — reverte uma resposta correta quando você diz "tem certeza?".
- _Elogiar entrada ruim_ — concorda que seu plano furado é brilhante antes de analisá-lo.
- _Enquadramento enviesado_ — a revisão puxa para o positivo quando você sinaliza que escreveu o código; para o negativo quando sinaliza que foi outra pessoa. Mesmo artefato, veredito diferente.
- _Mimetismo_ — repete os seus erros de volta como confirmação.

_Teste diagnóstico:_ o modelo teria dito isso sem o seu direcionamento? Se a única coisa que mudou foi seu tom ou enquadramento, é bajulação, não uma mudança real de análise.

_Solução:_ esconda suas preferências. Formule prompts de forma neutra — "revise este código", não "este código está bom?".

_Evite:_ usar "bajulação" para qualquer resposta errada que por acaso te agrade. Sem o teste diagnóstico, o termo não vale mais do que "errado".

_Uso:_

"Ele disse que meu plano de refatoração estava ótimo, aí eu perguntei 'tem certeza?' e ele voltou atrás em tudo."

"Bajulação clássica — concordou primeiro porque você soou confiante, depois cedeu porque você soou em dúvida. A qualidade do plano não mudou, seu tom mudou. [Limpa](./Clearing.md) e pergunta de novo sem sinalizar nada."
