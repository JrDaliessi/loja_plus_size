# Design System — Loja Plus Size
## Identidade Visual: Purple Noir

## 1. Conceito visual

A proposta visual da loja plus size segue a mesma linha sofisticada dos projetos FinControl e CurriculoWeb, mas com identidade própria voltada para o universo da moda.

A direção escolhida combina:

- fundo escuro;
- alto contraste;
- aparência premium;
- violeta e roxo como cores principais;
- lavanda como cor de apoio;
- magenta em pequenos detalhes;
- brilho controlado;
- estética moderna e elegante;
- fotografia de moda como protagonista.

O objetivo não é criar uma loja totalmente roxa, mas utilizar o roxo como cor de identidade e destaque.

A proporção visual sugerida é:

```text
70% → preto / grafite / ameixa muito escuro
20% → superfícies e cinzas arroxeados
 8% → violeta
 2% → lavanda / magenta
```

Quanto menos o roxo for utilizado de maneira indiscriminada, maior será seu impacto visual.

---

# 2. Nome interno da paleta

## Purple Noir

A identidade visual pode ser chamada internamente de:

**Purple Noir**

A intenção é transmitir:

- sofisticação;
- elegância;
- modernidade;
- confiança;
- exclusividade;
- moda;
- tecnologia sem excesso;
- identidade feminina sem depender do rosa tradicional.

---

# 3. Paleta principal — Dark Luxury

| Papel | Cor | Hex |
|---|---|---|
| Fundo principal | Preto ameixa | `#0B0710` |
| Fundo secundário | Roxo carvão | `#15101C` |
| Surface / Card | Berinjela escuro | `#21152B` |
| Roxo principal | Violeta premium | `#8B5CF6` |
| Roxo forte | Roxo imperial | `#6D28D9` |
| Destaque claro | Lavanda | `#C4B5FD` |
| Accent especial | Magenta suave | `#D946EF` |
| Texto principal | Branco quente | `#F8F5FA` |
| Texto secundário | Lilás acinzentado | `#B8AFC1` |
| Bordas | Roxo grafite | `#35263F` |
| Sucesso | Verde suave | `#6EE7B7` |
| Erro | Rosa avermelhado | `#FB7185` |

Representação:

```text
FUNDO
#0B0710

       ↓

CARD
#15101C / #21152B

       ↓

ROXO PRINCIPAL
#8B5CF6

       ↓

DESTAQUE
#C4B5FD

       ↓

ACCENT
#D946EF

       ↓

TEXTO
#F8F5FA
```

---

# 4. Família principal de roxos

A família principal da identidade deverá utilizar:

```text
Roxo Imperial
#6D28D9

     ↓

Violeta Premium
#8B5CF6

     ↓

Lavanda
#C4B5FD
```

Essas três cores possuem funções distintas.

## `#6D28D9`

Usar para:

- estados ativos;
- hover;
- botões secundários fortes;
- indicadores;
- detalhes de profundidade.

## `#8B5CF6`

Cor principal da marca.

Usar para:

- CTA;
- links importantes;
- tamanho selecionado;
- preço promocional;
- foco de campos;
- badges;
- componentes selecionados.

## `#C4B5FD`

Usar para:

- textos auxiliares;
- fundos discretos;
- tags;
- estados suaves;
- ícones;
- detalhes editoriais.

---

# 5. Accent magenta

Cor:

```text
#D946EF
```

Ela deve aparecer apenas pontualmente.

Exemplos:

- campanhas especiais;
- lançamentos;
- pequenos detalhes do logo;
- gradientes;
- coleções premium;
- indicadores especiais.

Não deve substituir o violeta como cor principal.

---

# 6. Gradiente da marca

Gradiente recomendado:

```css
linear-gradient(
  135deg,
  #6D28D9 0%,
  #8B5CF6 50%,
  #D946EF 100%
)
```

Aplicações recomendadas:

- elementos do logo;
- CTA especial;
- banner de coleção;
- bordas selecionadas;
- indicadores premium;
- campanhas;
- detalhes de hero section.

Evitar utilizar esse gradiente como fundo de todas as páginas.

---

# 7. Botão principal

Estado padrão:

```css
background: #8B5CF6;
color: #FFFFFF;
```

Hover:

```css
background: #7C3AED;
```

Glow discreto:

```css
box-shadow:
  0 0 20px rgba(139, 92, 246, 0.20);
```

O brilho deverá ser usado com moderação.

Aplicações:

- Comprar;
- Adicionar ao carrinho;
- Finalizar compra;
- Criar conta;
- CTA de campanhas;
- ações principais.

---

# 8. Cards de produtos

Estrutura visual:

```text
┌─────────────────────────────┐
│                             │
│          FOTO               │
│                             │
├─────────────────────────────┤
│ Vestido Midi Alice          │
│ ★ 4,9                       │
│                             │
│ R$ 189,90                   │
│ 4x de R$ 47,48              │
│                             │
│ G1 G2 [G3] G4 G5            │
└─────────────────────────────┘
```

## Card Dark Luxury

Fundo:

```text
#15101C
```

Surface secundária:

```text
#21152B
```

Borda:

```text
#35263F
```

Título:

```text
#F8F5FA
```

Texto secundário:

```text
#B8AFC1
```

Preço:

```text
#F8F5FA
```

Promoção:

```text
#C4B5FD
```

---

# 9. Seleção de tamanho

Exemplo:

```text
G1  G2  [ G3 ]  G4  G5
         ↑
      #8B5CF6
```

O tamanho selecionado deve ter:

- fundo violeta;
- texto branco;
- borda destacada;
- leve glow opcional.

Tamanhos indisponíveis devem possuir:

- menor opacidade;
- risco visual;
- cursor desabilitado;
- tooltip ou indicação de indisponibilidade.

---

# 10. Light Editorial

A loja não deve ser completamente escura.

Para catálogo, produtos e páginas editoriais, recomenda-se utilizar também um modo claro sofisticado.

## Paleta Light Editorial

| Papel | Hex |
|---|---|
| Fundo | `#FAF8FB` |
| Card | `#FFFFFF` |
| Texto principal | `#1A121F` |
| Texto secundário | `#6F6574` |
| Roxo principal | `#7C3AED` |
| Lavanda | `#EDE9FE` |
| Borda | `#E8E1EB` |

A função dessa camada é permitir que:

- fotografias tenham mais destaque;
- catálogo fique mais leve;
- páginas extensas sejam confortáveis de visualizar;
- a loja mantenha caráter editorial.

---

# 11. Dois ambientes dentro do mesmo Design System

## Dark Luxury

Utilizar principalmente em:

- header;
- hero section;
- banners;
- login;
- cadastro;
- Minha Conta;
- administração;
- campanhas especiais;
- coleções premium.

Paleta:

```text
#0B0710
#15101C
#21152B
#8B5CF6
#C4B5FD
#F8F5FA
```

---

## Light Editorial

Utilizar principalmente em:

- catálogo;
- resultados de busca;
- página de produto;
- blog;
- páginas de categorias;
- filtros;
- conteúdos editoriais.

Paleta:

```text
Fundo            #FAF8FB
Card             #FFFFFF
Texto            #1A121F
Texto secundário #6F6574
Roxo             #7C3AED
Lavanda          #EDE9FE
Borda            #E8E1EB
```

---

# 12. Fluxo visual sugerido

A experiência pode alternar os dois estilos:

```text
HOME / HERO
Dark Luxury

       ↓

CATÁLOGO
Light Editorial

       ↓

COLEÇÃO ESPECIAL
Dark Luxury

       ↓

PRODUTOS
Light Editorial
```

Isso evita monotonia e cria uma experiência mais editorial.

---

# 13. Texto e contraste

Evitar branco puro em excesso.

Em áreas escuras, utilizar:

```text
Texto principal
#F8F5FA
```

em vez de:

```text
#FFFFFF
```

Texto secundário:

```text
#B8AFC1
```

Essa combinação reduz o contraste agressivo e mantém uma aparência mais elegante.

---

# 14. Bordas

Borda principal Dark:

```text
#35263F
```

Borda Light:

```text
#E8E1EB
```

As bordas devem ser discretas.

Evitar:

- linhas muito claras;
- bordas pesadas;
- excesso de caixas.

---

# 15. Glow

O glow deve ser tratado como elemento premium e não como efeito padrão.

Utilizar principalmente em:

- CTA;
- item selecionado;
- foco;
- badge premium;
- campanha especial.

Exemplo:

```css
box-shadow:
  0 0 20px rgba(139, 92, 246, 0.20);
```

Evitar glow em:

- todos os cards;
- todos os textos;
- fundo inteiro;
- navegação comum.

---

# 16. Header

Sugestão:

```text
Background
#0B0710

Texto
#F8F5FA

Links secundários
#B8AFC1

Link ativo
#C4B5FD

CTA
#8B5CF6
```

O header deve ser:

- minimalista;
- sofisticado;
- responsivo;
- com alta legibilidade;
- sem excesso de efeitos.

---

# 17. Hero section

A home poderá começar com uma área Dark Luxury.

Elementos:

- foto editorial;
- título forte;
- texto curto;
- CTA violeta;
- gradiente discreto;
- fundo ameixa/preto.

Exemplo conceitual:

```text
───────────────────────────────────────────────

           NOVA COLEÇÃO

      Moda que acompanha você.

     Conforto, estilo e confiança
          em todos os tamanhos.

      [ CONHECER COLEÇÃO ]

───────────────────────────────────────────────
```

---

# 18. Fotografia

A fotografia deve continuar sendo protagonista.

Evitar:

- filtros roxos fortes sobre as modelos;
- excesso de overlays;
- fundos que alterem a cor real da roupa.

Priorizar:

- cores reais;
- iluminação natural;
- diversidade de corpos;
- detalhes do tecido;
- fotos editoriais;
- fotos de corpo inteiro;
- frente;
- lateral;
- costas.

O Design System deverá complementar a fotografia, não competir com ela.

---

# 19. Admin

A administração poderá utilizar predominantemente o modo Dark Luxury.

Isso cria continuidade com o estilo do FinControl e diferencia claramente:

```text
Loja pública
→ editorial / moda

Admin
→ sistema / dashboard
```

No admin:

```text
Background
#0B0710

Sidebar
#15101C

Cards
#21152B

Primary
#8B5CF6

Active
#6D28D9

Text
#F8F5FA

Muted
#B8AFC1
```

---

# 20. Estados do sistema

## Sucesso

```text
#6EE7B7
```

## Erro

```text
#FB7185
```

## Informação

Pode utilizar:

```text
#8B5CF6
```

## Atenção

Utilizar âmbar moderado, sem competir com a identidade principal.

---

# 21. Direção visual geral

A aparência deve transmitir:

```text
MODA
+
ELEGÂNCIA
+
CONFIANÇA
+
INCLUSÃO
+
TECNOLOGIA
+
SOFISTICAÇÃO
```

Não deve transmitir:

```text
GAME
NEON EXCESSIVO
DASHBOARD GENÉRICO
SITE TODO ROXO
VISUAL INFANTIL
```

---

# 22. Resumo da identidade Purple Noir

```text
Purple Noir

Background       #0B0710
Background Soft  #15101C
Surface          #21152B

Primary          #8B5CF6
Primary Strong   #6D28D9
Primary Soft     #C4B5FD

Accent           #D946EF

Foreground       #F8F5FA
Muted            #B8AFC1

Border           #35263F
```

A identidade deverá manter a essência visual dos outros projetos — fundo escuro, contraste, cor vibrante e brilho controlado — mas com uma personalidade própria relacionada a moda, elegância e experiência editorial.

---

# 23. Direção recomendada

A direção principal recomendada para o projeto é:

> **Dark Luxury + Light Editorial**

com a paleta:

> **Purple Noir**

A combinação permite criar uma loja moderna e marcante sem prejudicar a apresentação das roupas.

O roxo será utilizado como identidade, não como fundo dominante.

A fotografia continuará sendo a protagonista do e-commerce, enquanto a paleta cria reconhecimento de marca e sofisticação.
