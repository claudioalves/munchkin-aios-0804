# Regras Munchkin — Fonte de Edição

Esta pasta contém os arquivos Markdown das regras do Munchkin.

## Como funciona

Os arquivos desta pasta são a **fonte editorial** (onde você edita as regras).
Para que o app as exiba, copie os arquivos para:

```
apps/web/public/regras-munchkin/
```

E atualize o `manifest.json` nessa pasta com a lista de arquivos na ordem desejada:

```json
{
  "files": [
    { "id": "01", "title": "Objetivo do Jogo", "filename": "01-objetivo.md" },
    { "id": "02", "title": "Como Jogar",        "filename": "02-como-jogar.md" },
    { "id": "03", "title": "Combate",            "filename": "03-combate.md" }
  ]
}
```

## Estrutura sugerida

```
regras-munchkin/
  01-objetivo.md
  02-como-jogar.md
  03-combate.md
  04-monstros.md
  05-itens.md
  06-racas-classes.md
  07-maldições.md
  08-modo-epico.md
```

## Formato

Markdown simples. Títulos com `#`, subtítulos com `##`, listas com `-`.
