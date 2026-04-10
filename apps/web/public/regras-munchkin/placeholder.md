# Bem-vindo ao Visualizador de Regras

As regras do Munchkin ainda não foram adicionadas.

## Como adicionar as regras

1. Coloque seus arquivos `.md` nesta pasta: `apps/web/public/regras-munchkin/`
2. Edite o arquivo `manifest.json` na mesma pasta para listar os arquivos na ordem desejada:

```json
{
  "files": [
    { "id": "01", "title": "Objetivo do Jogo", "filename": "01-objetivo.md" },
    { "id": "02", "title": "Como jogar", "filename": "02-como-jogar.md" }
  ]
}
```

3. Salve e recarregue o app.

## Formato suportado

Os arquivos são Markdown simples. Use:

- `#` para títulos de seção
- `##` para subtítulos
- `###` para sub-subtítulos
- `-` ou `*` para listas
- `**texto**` para negrito
- Parágrafos separados por linha em branco

---

*O campo de busca acima destaca todas as ocorrências da palavra pesquisada. Use as setas ↑ ↓ para navegar entre elas.*
