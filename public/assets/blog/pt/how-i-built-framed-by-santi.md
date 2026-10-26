## 📸 Introdução: um portfólio de fotografia em produção ao terceiro dia

O [Framed by Santi](https://framedbysanti.rootdevs.es) é o site de [@framedbysanti](https://www.instagram.com/framedbysanti), um fotógrafo amador que fotografa as ruas de Nova Iorque com uma Fujifilm X100VI. Tem duas faces: um site público para mostrar as fotos dele e um painel privado para que ele próprio publique sem depender de ninguém.

Começou como um presente para um amigo, mas este artigo não é sobre isso: é sobre **como o construí em muito pouco tempo, com a ajuda do Claude Code, sem abdicar da qualidade**.

Os números, tirados do repositório:

- 📅 **9 dias com commits**, de 13 a 26 de outubro de 2026.
- 🚀 **Em produção ao dia 3**: site público e painel privado.
- 🔀 **189 commits** e **35 pull requests**.
- 🧪 **117 ficheiros de teste** com **857 casos**.
- 🌍 **Três idiomas**: inglês, espanhol e português.
- 💯 **100 nas quatro categorias do Lighthouse** (desktop, rede 4G).

<img class="theme-img theme-img--dark" src="/assets/images/blog/framedBySanti/commits_PT_dark.webp" alt="Gráfico de barras de commits por dia de 13 a 26 de outubro de 2026: 1, 43, 75 (o dia da entrada em produção), 3, nenhum no fim de semana, 22, 7, 23, 3, nenhum de 23 a 25 e 12">
<img class="theme-img theme-img--light" src="/assets/images/blog/framedBySanti/commits_PT_light.webp" alt="Gráfico de barras de commits por dia de 13 a 26 de outubro de 2026: 1, 43, 75 (o dia da entrada em produção), 3, nenhum no fim de semana, 22, 7, 23, 3, nenhum de 23 a 25 e 12">

---

## 🤖 Como trabalhei: agentes de IA, mas com método

Construí-o no terminal com agentes de IA (Claude Code) configurados com o [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), a ferramenta de código aberto de [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming). Não é "pedir um site à IA": é um fluxo de trabalho com regras.

- **ODD (Organic-Driven Development):** as alterações pequenas fazem-se diretamente; o trabalho grande tem um documento de tarefas com os requisitos copiados literalmente, para que nada se perca entre sessões.
- **Engram:** memória persistente. Cada decisão, erro resolvido ou preferência fica guardada e o agente recupera-a na sessão seguinte. Por exemplo: "pergunta antes de fazer push, mesmo para staging".
- **Testes primeiro:** para cada regra nova, primeiro um teste que falha e depois o código que o faz passar.
- **Ramos e revisão:** cada alteração sai de um ramo, sobe para `develop`, testo-a em `staging` e só chega a `main` (produção) quando eu a aprovo.

A divisão foi clara:

- 🤖 **O agente:** escreveu o código e os testes, investigou os erros, propôs soluções e abriu os PR.
- 🙋 **Eu:** decidi o que construir e como tinha de funcionar, revi cada alteração, corrigi o agente quando se enganava e aprovei cada entrada em produção.

> 💡 A IA escreve depressa; o que torna o resultado bom é **verificar**. Cada PR passou lint, testes e build, e nenhuma alteração chegou a produção sem a minha aprovação.

---

## 🧱 Stack e arquitetura

<img class="theme-img theme-img--dark" src="/assets/images/blog/framedBySanti/architecture_PT_dark.webp" alt="Diagrama de arquitetura do Framed by Santi: o navegador recebe a app estática da Vercel, lê o Firestore por REST nas páginas públicas e usa o Auth e o SDK do Firebase só no painel; as fotos chegam pela CDN da Cloudinary e o painel envia-as diretamente com uma assinatura; as funções da Vercel limpam a Cloudinary, enviam o email com o Resend, traduzem com o DeepL e assinam os uploads, e todas as do painel verificam no Firestore que o utilizador é admin com o seu próprio token">
<img class="theme-img theme-img--light" src="/assets/images/blog/framedBySanti/architecture_PT_light.webp" alt="Diagrama de arquitetura do Framed by Santi: o navegador recebe a app estática da Vercel, lê o Firestore por REST nas páginas públicas e usa o Auth e o SDK do Firebase só no painel; as fotos chegam pela CDN da Cloudinary e o painel envia-as diretamente com uma assinatura; as funções da Vercel limpam a Cloudinary, enviam o email com o Resend, traduzem com o DeepL e assinam os uploads, e todas as do painel verificam no Firestore que o utilizador é admin com o seu próprio token">

**Frontend**

- **Angular 22** sem Zone.js (*zoneless*), com **Signals** para todo o estado e componentes *standalone*.
- **TypeScript 6** em modo estrito: sem `any` e com tipos de retorno explícitos.
- **CSS nativo** com *nesting*, BEM e *mobile-first*. Sem pré-processador.
- **Vite 8** com `@analogjs/vite-plugin-angular` como única ferramenta de build.
- **Transloco** para os três idiomas.

**Serviços**

- **Vercel:** alojamento e quatro funções *serverless*.
- **Firebase Auth e Firestore:** login do painel e dados (séries, temas, definições).
- **Cloudinary:** armazenamento e entrega de fotos, com uploads assinados.
- **DeepL:** tradução automática dos textos.
- **Resend:** o email do formulário de contacto.

**As quatro funções de `api/`**

| Função | O que faz |
| --- | --- |
| `sign-upload` | Verifica que quem chama é admin e assina o upload para a Cloudinary. |
| `translate` | Proxy para o DeepL, só para admins, com 10 segundos de limite. |
| `cleanup-photos` | Apaga da Cloudinary as fotos que já nada usa. |
| `contact` | Valida o formulário e envia o email com o Resend. |

As três do painel verificam que o utilizador é admin da mesma forma: leem o documento dele no Firestore **com o token do próprio utilizador**, por isso são as regras de segurança do Firestore que decidem, não um segredo no servidor.

---

## 🖼️ O site público

- **As publicações são séries**, como um carrossel do Instagram: várias fotos com um título e uma história.
- **Início** com a última série num carrossel que se pode arrastar.
- **Galeria** com uma secção por série e filtro por temas.
- **Visor em ecrã inteiro:** zoom e deslocação (beliscar, arrastar, toque duplo, roda), gestos para mudar de foto, miniaturas, pré-carregamento da foto seguinte e uma transição suave entre fotos.
- **View Transitions** entre páginas, com um efeito de íris como o diafragma de uma câmara.
- **Sobre** com a história do Santi nas palavras dele e um formulário de contacto. O email dele nunca chega à página.
- **Idiomas a sério:** datas, números e plurais seguem o idioma ativo (`en-US`, `es-ES`, `pt-PT`).
- Com `prefers-reduced-motion`, nada é animado.

<p align="center"><a href="https://framedbysanti.rootdevs.es/" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/home_PT.webp" alt="Página inicial do Framed by Santi: foto do Flatiron em ecrã inteiro com o nome do Santi e os botões para a galeria e para o Instagram" width="720"></a><br><em>A página inicial. Clica para a veres ao vivo.</em></p>

<p align="center"><a href="https://framedbysanti.rootdevs.es/gallery" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/gallery_PT.webp" alt="Galeria do Framed by Santi: filtro por temas e uma série com o seu carrossel de fotos" width="720"></a><br><em>A galeria com o filtro por temas.</em></p>

<p align="center"><a href="https://framedbysanti.rootdevs.es/gallery" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/viewer_PT.webp" alt="Visor do Framed by Santi: uma foto em grande com setas, controlos de zoom e a fita de miniaturas" width="720"></a><br><em>O visor: zoom, setas e miniaturas.</em></p>

---

## 🔐 O painel privado

O painel vive em `/admin` e não tem nenhuma ligação pública: só se chega lá escrevendo o caminho.

- **Biblioteca de séries:** interruptor de publicada ou rascunho, editar e apagar.
- **Editor de séries:** arrastar fotos, pré-visualizá-las, reordená-las e escrever os textos num separador por idioma.
- **Fotos preparadas no navegador:** antes do upload, cada foto é redimensionada e recomprimida até um máximo de 6000 px e 10 MB, baixando a qualidade do JPEG por passos até caber. Assim respeitam-se os limites do plano gratuito da Cloudinary sem que o Santi tenha de pensar nisso.
- **Tradução automática:** o Santi escreve num idioma e, ao publicar, o DeepL preenche os que faltam. Cada idioma pode ser corrigido à mão.
- **Temas:** criam-se e apagam-se a partir do painel.
- **Limpeza automática:** ao abrir a biblioteca, as fotos da Cloudinary que já nenhuma série usa são apagadas em segundo plano.
- **Definições:** foto de perfil e alteração da palavra-passe.
- **Também no telemóvel:** o painel adapta-se ao ecrã do telemóvel, e no login pode-se mostrar ou ocultar a palavra-passe.
- **E um *easter egg*** só para o admin: um cantinho para continuar com força. 💪

<p align="center"><img src="/assets/images/blog/framedBySanti/dashboard-library_PT.webp" alt="Biblioteca do painel privado: as séries com a sua capa, o filtro por publicadas e rascunhos, e o interruptor para publicar" width="720"><br><em>A biblioteca: cada série é publicada ou passa a rascunho com um interruptor.</em></p>

<p align="center"><img src="/assets/images/blog/framedBySanti/dashboard-editor_PT.webp" alt="Editor de séries do painel privado: as fotos da série à esquerda e, à direita, os textos com um separador por idioma e o botão Traduzir" width="720"><br><em>O editor: fotos à esquerda, textos por idioma e o botão para traduzir à direita.</em></p>

---

## ⚡ Desempenho: medir, cortar e voltar a medir

Não deixei o desempenho para o fim: medi com o Lighthouse, ataquei o que mais pesava e voltei a medir. É assim que está hoje em desktop com rede 4G:

<p align="center"><img src="/assets/images/blog/framedBySanti/lighthouse.webp" alt="Relatório do Lighthouse do Framed by Santi em desktop com rede 4G: 100 em Performance, Accessibility, Best Practices e SEO" width="420"></p>

### Primeira ronda: de 44 a 73 em telemóvel

A primeira medição, a 15 de outubro em telemóvel com 4G lento (o caso mais exigente), deu um desempenho de **44-48**, com um CLS de **0,333** e um LCP de **7,5 s**. Com três alterações resolvi quase tudo:

- **Pré-carregar a foto principal da página inicial** a partir do `index.html`, com `fetchpriority="high"`. O script de pré-carregamento vem antes de qualquer folha de estilos, porque uma folha pendente bloqueia os scripts que vêm a seguir.
- **A página inicial vai no pacote principal**, sem carregamento diferido, para não acrescentar uma viagem de rede antes de pintar a primeira página.
- **O rodapé é pintado depois da primeira navegação.** Era o responsável por todo o CLS. O carrossel da última série também reserva o seu espaço enquanto carrega.

Resultado em telemóvel: **desempenho 73, CLS 0,001 e LCP 5,6 s**.

### Segunda ronda: tirar o que não fazia falta

- **Tipos de letra próprios.** Sirvo-os a partir do próprio domínio, sem a ida e volta ao Google Fonts.
- **Firebase fora das páginas públicas.** Ao rever o build vi que o pacote do Firebase pesava **563 kB (168 kB comprimidos)** e era pré-carregado em todas as páginas, e que cada visita abria ainda um iframe de autenticação da Google com cerca de **93 KiB**. Tudo isso para ler séries que são públicas. Agora as páginas públicas leem o Firestore com `fetch` contra a sua API REST, com as mesmas regras de segurança.
- **O login só é carregado quando faz falta:** uma marca local indica que nesse navegador já entrou um admin. Os visitantes nunca descarregam o Firebase Auth. E a marca não dá nenhuma permissão: a verificação real continua a ser o Firebase.

Resultado em desktop com rede 4G: **100 em Performance, Accessibility, Best Practices e SEO**.

### O que já vem de série

- **Imagens responsivas:** cada foto é servida pela Cloudinary com `srcset` em cinco larguras (480, 800, 1200, 1600 e 2400 px) e formato e qualidade automáticos.
- **Cada página carrega quando é visitada** (*lazy loading*), exceto a página inicial.

> 💡 A lição: **medir antes de otimizar**. O maior problema de CLS era um rodapé, e o maior peso, uma biblioteca que os visitantes nem sequer usavam.

---

## 🛡️ Segurança

- **Regras do Firestore que negam tudo por defeito.** O público só pode ler as séries publicadas, e as definições só aceitam os campos permitidos.
- **Uploads assinados:** o navegador nunca tem permissão para enviar para a Cloudinary por conta própria; cada upload é assinado por uma função que primeiro verifica que és admin.
- **Formulário de contacto** com limites de comprimento, HTML escapado e um campo armadilha: os bots preenchem-no, recebem um "OK" e nada é enviado.
- **Staging não é indexado:** os builds de staging levam `noindex` e um `robots.txt` que proíbe tudo.

---

## 🧪 Qualidade: a ordem não se negoceia, o linter impõe-na

Quando a IA escreve a maior parte do código, as convenções não podem depender de alguém se lembrar delas. Por isso transformei-as em regras: se o código não segue a ordem, **o lint falha**, seja quem for que o escreveu. As regras existem desde o primeiro dia do projeto.

**Cinco regras de ESLint próprias**, escritas para este projeto:

| Regra | O que obriga | Corrige-se sozinha? |
| --- | --- | --- |
| `component-decorator-order` | As propriedades de `@Component` sempre na mesma ordem: `standalone`, `changeDetection`, `imports`, `selector`, `styleUrl`, `templateUrl`... | ✅ |
| `inject-before-signals` | As chamadas a `inject()` vêm antes de qualquer outra propriedade da classe. | ✅ |
| `alphabetical-component-imports` | O array `imports` do componente, por ordem alfabética. | ✅ |
| `alphabetical-inputs-signals` | Os `input()` e os `signal()`, por ordem alfabética dentro do seu grupo. | ❌ |
| `alphabetical-interface-members` | Os membros de interfaces e tipos, por ordem alfabética. | ❌ |

As duas últimas só avisam, não reordenam sozinhas: nas interfaces, por exemplo, mover membros pode partir código que usa *spread* ou `Object.assign`, por isso prefiro que seja uma pessoa a decidir.

**E o resto da ordem, também automático:**

- **Imports** agrupados e ordenados: primeiro o Angular e as bibliotecas externas, depois os aliases internos (`@core`, `@features`...) e no fim os relativos.
- **Chaves de objetos** por ordem alfabética em dados, constantes, modelos e interfaces.
- **JSON de tradução** com as chaves ordenadas, sem comentários.
- **Prettier** com plugins que ordenam as propriedades CSS, os atributos HTML e as chaves dos JSON.
- **TypeScript estrito:** `any` é um erro, os tipos de retorno são obrigatórios e usa-se sempre `===`.

### O padrão dicionário

Há uma prática que peço sempre e que nenhum linter impõe: o **padrão dicionário**, conhecido em inglês como *object lookup* (e como *dispatch table* quando os valores são funções). Quando uma função traduz um valor noutro, nada de `switch` nem de `if/else` encadeados: um objeto tipado com `Record`, acesso por chave e um valor por defeito com `??`.

```typescript
const TRANSLATE_ERRORS: Record<TranslationError['reason'], string> = {
  failed: 'admin.editor.translate.errors.failed',
  limit: 'admin.editor.translate.errors.limit',
  'not-allowed': 'admin.editor.translate.errors.notAllowed',
};
```

Três vantagens:

- **Lê-se de relance:** todos os casos numa tabela, em vez de espalhados por ramos.
- **O TypeScript garante que não falta nenhum:** com `Record<TranslationError['reason'], string>`, se amanhã aparecer um motivo de erro novo, o código não compila até ter o seu texto.
- **Acrescentar um caso é acrescentar uma linha**, sem mexer na lógica.

Se em vez de um valor precisas de executar algo, os valores passam a ser funções: é a *dispatch table*. Há aqui uma armadilha que eu próprio tinha nos meus apontamentos:

```javascript
const LOKI_DEFAULT_DISFARCE = 'Loki';

const LOKI_DISFARCES = {
  Hulk: () => 'Thanos',
  Thor: () => 'Odin',
};

// ❌ Se o inimigo não estiver na tabela: TypeError, ... is not a function
const disfarce = LOKI_DISFARCES[enemy]() ? LOKI_DISFARCES[enemy]() : LOKI_DEFAULT_DISFARCE;

// ✅ Com ?.() nada é executado se não existir, e ?? põe o valor por defeito
const disfarce = LOKI_DISFARCES[enemy]?.() ?? LOKI_DEFAULT_DISFARCE;
```

Além de partir com uma chave desconhecida, a primeira versão executa a função duas vezes. E `??` é melhor do que o ternário: só usa o valor por defeito quando a chave não existe, não quando o resultado é um `''` ou um `0` válidos.

Não é dogma: nos templates uso `@switch` quando cada caso pinta algo diferente, e ainda fica algum `switch` onde cada ramo faz mais do que devolver um valor.

**E os testes:**

- **857 casos** em 117 ficheiros, com Vitest e JSDOM, também para as funções de `api/`.
- **Commits convencionais** validados por um script.

---

## 🐛 Cinco problemas reais (e como os resolvi)

### 1. Separadores que se partiam depois de cada deploy

Um separador aberto antes de um deploy pedia ficheiros do build anterior, que já não existiam. As páginas que carregam ao serem visitadas (galeria, Sobre, o painel) **não abriam e não diziam nada**.

A solução foi um gestor de erros de navegação que, se falhar o download de uma parte da app, recarrega essa página do zero para obter o build novo. Só o faz para erros de download e uma única vez seguida por página, por isso uma falha real não pode provocar um ciclo de recarregamentos.

### 2. Tirar o Firebase das páginas públicas

A poupança está contada na secção de desempenho; o delicado foi a segurança. Separei o login num store que é carregado a pedido, e a marca local que decide quando o carregar **não concede nada**: se alguém a falsificar, só consegue descarregar o Firebase Auth, porque a verificação real continua a ser o login e o documento de admin no Firestore.

### 3. As funções da Vercel e os módulos ES

As funções de `api/` falhavam na Vercel: como módulos ES nativos, os imports relativos precisam da extensão `.js`. Além da correção, acrescentei um teste que verifica todos os imports de `api/` para que não volte a acontecer.

### 4. Uma limpeza de fotos que não se pode enganar

Apagar fotos "órfãs" é fácil; apagar só as órfãs, nem tanto. A limpeza foi aprendendo com cada caso:

- Se não conseguir ler as séries, **não apaga nada**. Uma leitura falhada não significa que não haja fotos em uso.
- Só dá como apagadas as fotos que a Cloudinary **confirma**.
- Respeita a foto de perfil e as do cantinho do admin, que vivem na mesma pasta.
- Não toca em fotos com menos de 7 dias e apaga no máximo 100 por execução.

### 5. "A guardar…" para sempre

Ao guardar a foto de perfil com uma ligação lenta, se o guardar demorasse demasiado a app perguntava ao servidor se tinha chegado... sem limite de tempo para essa pergunta. Agora essa verificação tem o seu próprio limite de 5 segundos, e a leitura da sessão guardada no IndexedDB desiste aos 2 segundos, porque alguns navegadores nunca respondem.

---

## 📅 Dia a dia

| Dia | Commits | O que aconteceu |
| --- | --- | --- |
| 13 out | 1 | Projeto criado: Angular, i18n e ferramentas. |
| 14 out | 43 | Protótipo completo do site público e fotos a partir da Cloudinary. |
| 15 out | 75 | Regras do Firestore, login, uploads assinados, editor, tradução, temas, limpeza, página 404. **Primeira entrada em produção.** |
| 16 out | 3 | Tipos de letra próprios. |
| 19 out | 22 | Páginas públicas sem o SDK, login a pedido, definições do painel. |
| 20 out | 7 | A história do Sobre e ajustes em telemóvel. |
| 21 out | 23 | Ícone do Instagram, o cantinho do admin e o formulário de contacto. |
| 22 out | 3 | Afinação do email de contacto. |
| 26 out | 12 | Painel adaptado ao telemóvel, mostrar a palavra-passe no login e melhorias no cantinho do admin. |

---

## 🎯 Lições

1. **A velocidade vem do método, não só da IA.** Requisitos por escrito, testes primeiro, ramos e revisão: sem isso, 75 commits num dia seriam 75 problemas.
2. **A memória persistente muda o jogo.** Um agente que se lembra de decisões e erros de sessões anteriores não os repete.
3. **Verificar vale mais do que gerar.** Nada chegou a produção sem passar testes, lint e build.
4. **Os serviços gratuitos dão para muito** se desenhares a pensar nos seus limites (Cloudinary, Firebase, DeepL Free, Resend e Vercel).
5. **A segurança não se delega no frontend.** As regras do Firestore e as funções que verificam o admin é que protegem; a interface só acompanha.

> ⭐ **gentle-ai no GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). Se te for útil, dá-lhe uma estrela.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" src="https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/docs/assets/brand/built-with-gentle-ai.png" alt="Built with Gentle-AI" /></a></p>
