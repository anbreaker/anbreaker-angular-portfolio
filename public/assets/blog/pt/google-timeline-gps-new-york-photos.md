## 🗺️ Introdução: um mapa vazio

Tinha acabado de carregar um ano inteiro de fotos do telemóvel para o meu servidor [Immich](https://immich.app/), a alternativa auto-alojada ao Google Fotos. A primeira coisa que fiz, como toda a gente, foi abrir o mapa para ver as viagens. E lá estava o buraco: **nem uma única foto da viagem a Nova Iorque** (de 24 de outubro a 8 de novembro de 2025). Quase duas mil fotos e vídeos, todos com a etiqueta *"sem localização"*.

As fotos não se tinham perdido. O que se tinha perdido era **onde** as tirei.

> 💡 Spoiler: 1855 de 1928 fotos (96 %) voltaram ao mapa em cerca de 30 segundos, sem modificar um único ficheiro original. A peça-chave foi algo que eu nunca tinha olhado: o histórico da Cronologia do Google Maps.

---

## 🤖 Como trabalhei: a iterar com agentes

Também não fiz isto sozinho. Trabalhei no terminal com agentes de IA (Claude Code) configurados com o [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), uma ferramenta de código aberto ([site oficial](https://gentle-ai.gentlemanprogramming.com/)) que configura os agentes que já usas com memória persistente, Organic-Driven Development, skills e orquestração de sub-agentes, sem te prender a nenhum.

**O que o gentle-ai trouxe neste caso:**

- **Engram:** memória persistente entre sessões. O trabalho técnico foi feito na sessão do meu servidor e este artigo foi escrito dias depois a partir de outro projeto, com base nas notas e nos resultados que o agente tinha guardado.
- **ODD (Organic-Driven Development):** um fluxo leve, sem commits nem alterações irreversíveis sem a minha permissão explícita.
- **Verificar antes de agir:** cada passo que mexia em dados reais começou com um teste pequeno e verificável.

O gentle-ai foi criado por [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming), e a regra dele para trabalhar com IA encaixa em todo este artigo: *"verifying beats generating"*, ou seja, verificar vale mais do que gerar. Aqui, literalmente: antes de gerar uma única coordenada, verificámos onde se tinha perdido a original.

> ⭐ **gentle-ai no GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). Se te for útil, dá-lhe uma estrela: ajuda mais pessoas a encontrá-lo.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" height="95" loading="lazy" src="/assets/images/built-with-gentle-ai.webp" alt="Built with Gentle-AI" /></a></p>

A divisão foi clara:

- 🤖 **O agente:** verificou o EXIF das fotos no servidor, consultou a base de dados do Immich, analisou o formato da exportação da Cronologia, escreveu o script de correspondência, montou o servidor local e enviou os pedidos à API do Immich, primeiro com 5 fotos de teste e depois em lotes.
- 🙋 **Eu:** verifiquei os originais no telemóvel, exportei a Cronologia e passei-a para o computador por cabo, validei no mapa que as amostras caíam onde eu me lembrava e dei luz verde a cada passo que modificava dados.

---

## 🔍 Diagnóstico: onde se perdeu o dado?

Antes de corrigir fosse o que fosse, queria saber **em que ponto** a localização tinha desaparecido. Há dois suspeitos razoáveis:

1. **O carregamento.** Desde o Android 10, o sistema remove as coordenadas GPS dos ficheiros entregues a apps que não têm a permissão de *acesso à localização dos ficheiros multimédia*. Se a app de carregamento não a tiver, as fotos chegam ao servidor "limpas".
2. **A câmara.** O GPS nunca chegou a ser guardado.

Verifiquei 50 fotos ao acaso de outubro e novembro de 2025 no servidor com o `exiftool`: **0 de 50 tinham GPS**. Já o modelo da câmara, a data e o fuso horário estavam intactos.

Depois olhei para os originais no próprio telemóvel (Galeria → detalhes): **também não tinham localização**. Caso encerrado: não foi o carregamento, a câmara nunca escreveu o GPS. Num OnePlus as causas habituais são o interruptor *"guardar localização"* da câmara desligado (algumas atualizações do OxygenOS repõem-no), a app da câmara sem permissão de localização (falha em silêncio) ou a localização desligada durante a viagem.

> ⚠️ Se as tuas fotos têm GPS no telemóvel mas não no servidor, o problema é o outro: verifica a permissão de localização multimédia da app que as carrega.

---

## 💡 A ideia: o telemóvel sabia onde eu estava

A câmara não guardou a localização, mas **o telemóvel registou-a**. A Cronologia do Google Maps tinha a viagem inteira: cada visita, cada percurso a pé, cada ferry.

Por isso o plano era simples de enunciar: para cada foto, pegar na hora exata e perguntar à Cronologia **onde é que eu estava nesse momento**.

---

## 📤 Passo 1: verificar e exportar a Cronologia

Desde 2024, a Cronologia **é guardada no dispositivo**, não na nuvem. Isso tem duas consequências importantes:

- **Verifica primeiro:** Google Maps → o teu perfil → *A sua cronologia* → calendário → escolhe um dia da viagem. Se vês os percursos, os dados estão lá.
- **Desativa a eliminação automática antes de mais nada.** As definições da Cronologia têm uma opção de *eliminação automática* que nas contas novas costuma vir com 3 meses. Desativei-a antes de mexer em mais alguma coisa.

Para a exportar: **Definições do Android → Localização → Serviços de localização → Cronologia → Exportar dados da Cronologia**. O resultado foi um JSON de **19 MB**.

> 🔒 Atenção à privacidade: esse ficheiro é **o teu histórico de localizações completo**. Passei-o para o computador por cabo, apliquei-lhe `chmod 600` e nunca o enviei por chat nem por email.

---

## 🧬 Passo 2: perceber o formato

O JSON tem três chaves principais: `semanticSegments`, `rawSignals` e `userLocationProfile`. As duas primeiras são as que interessam:

- **`semanticSegments`** (10 760 no meu caso) contêm:
  - **`visit`**: um sítio onde estiveste, com hora de início e de fim e a respetiva `placeLocation.latLng`.
  - **`timelinePath`**: uma lista de pontos `{ point, time }` enquanto te deslocavas.
  - **`activity`**: os segmentos de deslocação.
- **`rawSignals`** (24 408): posições em bruto com `timestamp` e `LatLng`.

Um pormenor curioso: as coordenadas vêm como texto, com o símbolo de grau incluído:

```json
{ "point": "40.7529°, -73.9785°", "time": "2025-10-27T15:42:00.000-04:00" }
```

A cobertura era boa: entre 58 e 117 pontos por dia de viagem. Basta fazer a média das posições por dia para ver a viagem desenhada: os dias em Nova Iorque agrupam-se à volta de `40.76, -74.01`, e o voo de regresso dá uma média a meio do Atlântico. 🛫

---

## 🕐 Passo 3: a hora de cada foto (em UTC)

Este é o passo que decide se tudo funciona ou não. O campo EXIF `DateTimeOriginal` guarda a hora **local**, mas a Cronologia trabalha com instantes absolutos. Para os cruzar precisas de UTC.

Felizmente, o meu OnePlus também escreve **`OffsetTimeOriginal`** (`+01:00`, `+02:00`, `-04:00`...), por isso a conversão para UTC é exata. Sem esse campo terias de adivinhar o fuso horário de cada dia, e numa viagem com mudança de fuso isso é uma fonte garantida de erros.

Tirei da base de dados do Immich a lista de recursos do período da viagem (id, nome do ficheiro e hora UTC): **1971 recursos, 1928 sem GPS**.

---

## 🧮 Passo 4: o algoritmo de correspondência

Para cada foto com hora `t` (UTC), por esta ordem:

1. Se `t` cai **dentro de uma visita** → uso a localização desse sítio.
2. Se não, pego nos pontos do percurso imediatamente antes e depois de `t`. Se estiverem separados por **30 minutos ou menos** → **interpolação linear** entre os dois.
3. Se não, o **ponto mais próximo**, desde que esteja a **60 minutos ou menos**.
4. Se não → **fica sem localização**. Prefiro um buraco a um dado inventado.

O script completo cabe em cerca de 60 linhas de Python sem dependências:

```python
import json, sys, bisect
from datetime import datetime, timezone

def parse_t(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)

def parse_ll(s):
    a, b = s.replace("°", "").replace("geo:", "").split(",")
    return float(a), float(b)

timeline = json.load(open(sys.argv[1]))
points, visits = [], []
for seg in timeline["semanticSegments"]:
    for p in seg.get("timelinePath", []):
        points.append((parse_t(p["time"]), *parse_ll(p["point"])))
    v = seg.get("visit")
    if v:
        la, lo = parse_ll(v["topCandidate"]["placeLocation"]["latLng"])
        visits.append((parse_t(seg["startTime"]), parse_t(seg["endTime"]), la, lo))
for r in timeline.get("rawSignals", []):
    pos = r.get("position")
    if pos and "LatLng" in pos and "timestamp" in pos:
        points.append((parse_t(pos["timestamp"]), *parse_ll(pos["LatLng"])))
points.sort()
times = [p[0] for p in points]

def locate(t):
    for start, end, la, lo in visits:
        if start <= t <= end:
            return la, lo, "visit"
    i = bisect.bisect_left(times, t)
    before = points[i - 1] if i > 0 else None
    after = points[i] if i < len(points) else None
    if before and after:
        gap = (after[0] - before[0]).total_seconds()
        if gap <= 30 * 60:
            f = 0 if gap == 0 else (t - before[0]).total_seconds() / gap
            return (before[1] + f * (after[1] - before[1]),
                    before[2] + f * (after[2] - before[2]), "interp")
    best = min((p for p in (before, after) if p),
               key=lambda p: abs((p[0] - t).total_seconds()))
    if abs((best[0] - t).total_seconds()) <= 60 * 60:
        return best[1], best[2], "nearest"
    return None
```

A entrada são dois ficheiros: a exportação da Cronologia e uma listagem `id|nome|hora_utc|fuso|latitude` dos recursos. A saída é um JSON com a coordenada e o método usado para cada foto, o que me permitiu rever os resultados antes de aplicar o que quer que fosse.

---

## ✍️ Passo 5: aplicar a localização sem tocar nos originais

Tinha duas opções: reescrever o EXIF dos ficheiros ou dizer ao Immich qual era a localização. Escolhi a segunda, através da API:

```http
PUT /api/assets/{id}
Content-Type: application/json

{ "latitude": 40.758, "longitude": -73.9855 }
```

É exatamente o que a interface web faz com *"Editar localização"*, mas em lote. Vantagens:

- **Os originais ficam intactos** e a alteração é reversível.
- **Não gera duplicados.** Se tivesse reetiquetado os ficheiros no telemóvel, o checksum mudaria e a app do Immich voltaria a carregá-los como fotos novas.

No fim nem precisei de uma API key: enviei os pedidos a partir de um separador do navegador com a sessão do Immich iniciada. Os dados emparelhados eram servidos por um mini servidor HTTP em `localhost` (com CORS e o cabeçalho `Access-Control-Allow-Private-Network`), por isso as coordenadas não passaram por mais nenhum sítio.

E fui com cuidado:

- **Primeiro 5 fotos de teste**, verificadas uma a uma no mapa.
- Depois o resto **em lotes de 400**, com 4 pedidos em paralelo.
- Saltando qualquer recurso que já tivesse latitude, para não pisar nada.

---

## 📊 Resultados

| Método | Fotos |
|---|---|
| Dentro de uma visita | 991 |
| Interpolação (≤ 30 min) | 805 |
| Ponto mais próximo (≤ 60 min) | 59 |
| Sem dados | 73 |

**1855 de 1928 fotos (96 %) recuperaram a localização**, em cerca de 30 segundos e com **0 falhas**. As 73 restantes são da tarde do voo de ida: a Cronologia não tem pontos a 10 000 metros, e ficaram vazias de propósito.

Verifiquei amostras ao acaso contra sítios de que me lembrava: Times Square, o Financial District, a Estátua da Liberdade e a Grand Central, onde uma foto e um vídeo tirados com 30 minutos de diferença caíram na mesma visita. Tudo batia certo.

Uma curiosidade para quem usa o Immich: a geocodificação inversa dá a cada sítio o nome da **cidade mais próxima** na sua base de dados (GeoNames), por isso uma foto de Times Square aparece como *"Weehawken"*, do outro lado do rio. O pin está certo; só o nome engana.

---

## 🔁 Segunda passagem: a biblioteca inteira

Se funcionava com Nova Iorque, porque não com tudo o resto? Repeti o processo com **todas as fotos de câmara sem GPS desde setembro de 2024**, que é quando começa a minha Cronologia.

Com um filtro importante: **excluí os recursos sem modelo de câmara no EXIF** (capturas de ecrã, transferências). Etiquetar uma captura de ecrã com *"onde eu estava quando a fiz"* é um dado falso, não um dado recuperado.

- 1052 candidatas → 679 por visita, 134 interpoladas, 93 por ponto mais próximo e 146 sem dados.
- **906 recuperadas (86 %)** em 14 segundos, sem falhas.

Agrupar os resultados por dia e calcular o centro de cada grupo deu uma revisão rápida das viagens do último ano: Serra da Estrela, Lisboa, Guarda, Madrid, Cáceres, Évora, duas escapadinhas ao Algarve...

---

## 🌅 A reviravolta final: a viagem de que não me lembrava

E então apareceu algo que eu não esperava. Entre 14 e 16 de setembro de 2024, a Cronologia punha-me **no Algarve**. Eu não me lembrava desse fim de semana. A Cronologia lembrava-se: foi mesmo antes da Serra da Estrela (17–20 de setembro), e as fotos confirmavam-no.

---

## 🧠 Lições

- **Descobre onde se perde o dado antes de o corrigir.** Comparar a cópia do servidor com o original do telemóvel disse-me que o problema era a câmara, não o carregamento.
- **O fuso horário do EXIF é tudo.** Com `OffsetTimeOriginal` o cruzamento é exato; sem ele, é uma aposta.
- **Limiares conservadores.** Mais vale deixar 73 fotos sem localização do que pôr 73 pins falsos.
- **Não reetiquetes os originais se usas um servidor de fotos.** O checksum muda e acabas com duplicados.
- **Exporta a tua Cronologia cedo.** Agora vive no dispositivo e pode apagar-se sozinha.
- **Verifica hoje se a tua câmara guarda a localização.** Tira uma foto, vê os detalhes e poupa-te a este artigo. 📸
