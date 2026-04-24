# AGENTS.md

Regras obrigatórias para qualquer agente de IA que atue neste repositório.
Todas as instruções abaixo devem ser seguidas estritamente.

## Índice

**I. Fundamentos**
1. Contexto do projeto
2. Hierarquia de instruções
3. Autoridade e comportamento do agente
4. Texto e encoding
5. Idioma e comunicação

**II. Processo de trabalho**

6. Verificação antes de editar
7. Limite de alterações
8. Criação de arquivos
9. Execução de comandos
10. Validação e checklist final

**III. Código e arquitetura**

11. Regras gerais de código
12. Modularização
13. Layout e interface
14. Design system e tokens visuais
15. Referências visuais e fidelidade
16. Dados provisórios e placeholders

**IV. Entrega**

17. Commits
18. Documentação
19. Segurança

**Apêndices**

- A. Prompt de auditoria Lighthouse

---

## I. Fundamentos

### 1. Contexto do projeto

Além deste arquivo, o agente deve ler e seguir obrigatoriamente:

`./docs/ai/project-rules.md`

Esse arquivo contém:

- regras de negócio
- contratos entre sistemas
- contexto funcional
- restrições específicas do projeto
- decisões arquiteturais não universais

Dados institucionais do cliente ficam em:

`./docs/client-data.md`

Documentação por rota fica em:

`./docs/routes/`

### 2. Hierarquia de instruções

Ordem de prioridade, do mais alto para o mais baixo:

1. Solicitação atual do usuário
2. Referências visuais enviadas pelo usuário (prints, mockups)
3. `AGENTS.md`
4. `docs/ai/project-rules.md`
5. `docs/` e documentação das rotas
6. Padrões já existentes no código

Quando duas fontes de prioridade equivalente entrarem em conflito, pedir esclarecimento.

### 3. Autoridade e comportamento do agente

Este arquivo define o comportamento padrão dos agentes. Deve ser seguido em todos os casos.

O agente deve:

- perguntar quando houver dúvida real
- não assumir requisitos não informados
- não extrapolar o escopo
- seguir este arquivo rigorosamente

### 4. Texto e encoding

Padrão obrigatório: `UTF-8`. Todos os arquivos devem ser tratados como UTF-8. Nunca assumir outro encoding.

Todo texto deve suportar corretamente:

- acentuação em português
- caracteres especiais
- Unicode válido

É proibido:

- quebrar acentuação
- gerar caracteres corrompidos
- substituir caracteres válidos incorretamente

Se aparecerem caracteres estranhos:

1. reinterpretar o arquivo como UTF-8
2. verificar novamente

Se o problema persistir: não modificar essas linhas, não recriar o arquivo, informar o usuário com arquivo e linhas afetadas.

### 5. Idioma e comunicação

Idioma de código e conteúdo:

- português com grafia correta
- não truncar palavras
- não omitir acentuação
- evitar mistura desnecessária de idiomas
- manter consistência terminológica

Comunicação com o usuário:

- linguagem técnica, clara e objetiva
- sem emojis, tanto em mensagens quanto em UI, exceto quando o usuário pedir explicitamente
- sem redundância
- sem explicações desnecessárias

---

## II. Processo de trabalho

### 6. Verificação antes de editar

Antes de modificar qualquer arquivo:

1. ler o arquivo completo
2. confirmar o encoding
3. validar que o conteúdo corresponde ao esperado
4. entender dependências e impacto

Se houver inconsistência: parar, não reconstruir o arquivo, informar o usuário.

Se houver falha de patch por divergência de linhas: interromper a modificação, informar o usuário, não tentar contornar recriando conteúdo no escuro.

Se houver dúvida sobre contexto ou impacto: perguntar antes de alterar.

### 7. Limite de alterações

Modificar apenas o mínimo necessário para atender ao pedido.

É proibido:

- alterar lógica não relacionada
- renomear sem necessidade
- reorganizar estrutura sem pedido
- alterar configurações sem necessidade direta

Se alguma dessas mudanças for necessária: parar, explicar o motivo, pedir autorização.

### 8. Criação de arquivos

Não criar arquivos sem autorização.

Exceção: quando estritamente necessário para modularização ou clareza arquitetural.

Nesses casos: justificar a criação e explicar a estrutura.

### 9. Execução de comandos

Não executar comandos que alterem o ambiente sem autorização. Inclui:

- instalação global
- migrações de banco
- deploys
- `git push`
- `git push --force`
- `--no-verify` ou `--amend` em commits publicados

Comandos locais de verificação podem rodar livremente conforme `.claude/settings.local.json`. Inclui:

- `tsc`, `eslint`, `vite build`
- `git status`, `git diff`, `git log`

### 10. Validação e checklist final

Antes de concluir qualquer tarefa com mudança de UI ou código:

- `npx tsc -b` passa limpo
- `npx vite build` passa limpo
- lint sem novos erros (`npx eslint .`)
- escopo atendido corretamente
- nenhuma alteração desnecessária
- UTF-8 preservado
- português correto
- layout revisado em desktop e mobile
- impacto avaliado
- documentação atualizada quando aplicável
- modularização adequada
- nenhum arquivo cresceu desnecessariamente

---

## III. Código e arquitetura

### 11. Regras gerais de código

- não alterar código fora do escopo solicitado
- não refatorar sem autorização
- manter o padrão existente
- presumir UTF-8 sempre

### 12. Modularização

Limite de arquivo ideal: até 500 linhas. Se ultrapassar sem necessidade, modularizar.

Separação de responsabilidades:

- `src/hooks/` para lógica reutilizável
- `src/shared/lib/` para funções puras e helpers
- `src/shared/constants/` para conteúdo estático e dados do cliente
- `src/shared/css/` para tokens globais
- `src/components/` para UI compartilhada
- `src/sections/` para blocos de página reutilizáveis
- `src/pages/` para composição de páginas

Evitar:

- arquivos com múltiplas responsabilidades
- acoplamento alto

### 13. Layout e interface

Desktop:

- layout compacto
- alta densidade de informação
- evitar espaços desnecessários

Mobile:

- rolagem fluida é aceita
- hierarquia visual deve se manter legível
- áreas interativas com toque mínimo de `44 x 44 px`

Antes de finalizar alterações de interface:

- revisar alinhamento
- revisar responsividade em ao menos três breakpoints
- revisar consistência visual com as demais seções
- validar contraste de texto no mínimo em WCAG AA

### 14. Design system e tokens visuais

Fontes de verdade:

- cores: `src/shared/css/colors.css`
- tokens (fontes, raios, sombras, espaçamentos): `src/shared/css/tokens.css`
- estilos globais: `src/shared/css/base.css`
- componentes compartilhados: `src/components/`
- conteúdo institucional: `src/shared/constants/site.ts`
- contato e redes sociais: `src/shared/constants/contact.ts`

Criar novos tokens exige autorização explícita. Inclui:

- novas cores fora da paleta definida pelo cliente
- novos raios, sombras ou espaçamentos
- novas famílias tipográficas

Antes de adicionar um novo token: pedir confirmação e indicar onde ele seria aplicado.

Botões:

- nenhum botão visual deve ser criado com estilo hardcoded fora de `src/components/button/`
- variações recorrentes devem entrar no componente Button como nova prop de tom ou variante

Componentes compartilhados:

- cada um deve ter `Component.tsx` e `component.css` próprios
- props devem controlar variações visuais
- textos e dados não devem ficar hardcoded em componentes base

### 15. Referências visuais e fidelidade

Quando o usuário envia print, mockup, foto ou referência visual:

- a referência visual tem prioridade sobre descrições escritas em documentos
- reproduzir proporções, alinhamentos, tamanhos relativos e hierarquia da referência
- quando a referência conflita com um `docs/*.md`, seguir a referência e sinalizar o conflito

Se a referência vier de outra empresa, como exemplo de estilo e não do cliente atual:

- extrair estrutura, layout e comportamento
- aplicar a identidade visual do cliente atual, como cores, fontes e tom
- não copiar logos ou marcas de terceiros

### 16. Dados provisórios e placeholders

Enquanto o cliente não fornecer assets ou conteúdos finais:

- manter textos provisórios centralizados em `src/shared/constants/`
- evitar espalhar conteúdo do cliente em componentes base
- documentar qualquer informação confirmada em `docs/client-data.md`

Para imagens ausentes:

- usar placeholder estilizado controlado por prop opcional, como `src?: string`
- quando a prop vier preenchida, renderizar `<img>` com `loading="lazy"` e `decoding="async"` se estiver abaixo da dobra
- quando vazia, renderizar o placeholder

Para listas ainda não entregues (modalidades, eventos, etc.):

- criar entradas provisórias claramente identificáveis no arquivo de constantes
- sinalizar ao usuário quais campos precisam ser revisados

---

## IV. Entrega

### 17. Commits

Usar Conventional Commits:

```text
tipo(escopo): descrição
```

Tipos permitidos:

- `feat`
- `fix`
- `refactor`
- `docs`
- `style`
- `chore`
- `test`

Escopos atuais do projeto:

- seções da home: `hero`, `activities`, `audiences`, `schedule`, `contact`
- componentes compartilhados: `site-header`, `site-footer`, `whatsapp-float`, `button`, `container`, `section`, `feature-card`
- composição: `home`
- fundação visual: `design-system`
- código compartilhado: `core` (hooks e libs), `constants`
- dependências: `deps`
- infraestrutura do agente: `claude`, `agents`
- transversais: `a11y`, `seo`

Adicionar novo escopo no momento em que um novo módulo for criado.

Regras operacionais:

- a sugestão de commit deve aparecer no final da resposta quando houver modificação de arquivos
- commits granulares por grupo lógico, evitar commits monolíticos
- nunca usar `--no-verify`
- nunca usar `--amend` em commits já publicados
- nunca usar `push --force` em `main`

### 18. Documentação

Sempre documentar mudanças relevantes, incluindo:

- endpoints
- jobs
- integrações
- autenticação
- regras de negócio

Documentação mínima de backend:

- objetivo
- rota e método
- autenticação
- inputs
- outputs
- erros
- validações

Local da documentação: `docs/`.

Definição de pronto para backend:

- código atualizado
- documentação atualizada

### 19. Segurança

Este projeto deve ser tratado como ambiente de produção real, sujeito a pentest profissional.

Princípios:

- defesa em profundidade
- camadas independentes
- falha isolada não deve comprometer o sistema inteiro

Backend:

- nunca confiar no frontend
- toda validação deve existir no backend
- autenticação e autorização devem estar no backend

Tokens como JWT:

- definir expiração adequada
- usar refresh token
- aplicar rotação segura
- invalidar quando necessário
- proteger contra replay
- mitigar vazamento

---

## Apêndices

### A. Prompt de auditoria Lighthouse

Prompt pronto para uso em auditorias. Não é regra, apenas um recurso disponível quando o usuário pedir análise de performance, SEO, acessibilidade ou boas práticas do site.

> Você é um especialista em otimização web com foco nas melhores práticas do Google Lighthouse.
>
> Analise o site a seguir e proponha melhorias detalhadas para atingir pontuações altas (90+) nas seguintes categorias:
>
> - Performance
> - SEO
> - Acessibilidade (Accessibility)
> - Boas práticas (Best Practices)
>
> URL do site: [COLE A URL AQUI]
>
> Para cada categoria, faça:
>
> 1. Diagnóstico dos principais problemas
> 2. Explicação objetiva do impacto de cada problema
> 3. Soluções práticas e priorizadas (quick wins primeiro)
> 4. Exemplos técnicos quando possível (código, headers, configurações)
> 5. Ferramentas ou métricas para validação (Core Web Vitals, etc.)
>
> Requisitos importantes:
>
> - foque em otimizações modernas (2024+)
> - considere mobile-first
> - inclua melhorias em:
>   - Core Web Vitals (LCP, CLS, INP)
>   - otimização de imagens (WebP, lazy loading)
>   - cache e CDN
>   - minificação e compressão (gzip/brotli)
>   - JavaScript e CSS (code splitting, defer, async)
>   - acessibilidade (aria, contraste, semântica)
>   - SEO técnico (meta tags, structured data, sitemap, robots.txt)
> - seja direto, técnico e acionável
> - evite explicações genéricas
>
> Ao final, gere um checklist priorizado com as ações mais críticas para melhorar rapidamente o score do Lighthouse.
