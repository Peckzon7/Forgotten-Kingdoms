# Forgotten Kingdoms

RPG medieval 2D em HTML, CSS e JavaScript (ES Modules).

## Executar

1. Extraia a pasta do projeto.
2. Abra a pasta em um servidor local (por exemplo, a extensão Live Server do VS Code ou `python -m http.server 8000`).
3. Acesse `http://localhost:8000`.

> Não abra `index.html` diretamente como `file://`: os módulos JavaScript e o carregamento de recursos podem ser bloqueados pelo navegador.

## Controles

- **WASD / setas:** movimentar Kaelen.
- **J:** atacar.
- **E:** interagir.
- **Celular:** joystick virtual, botão de ataque e botão de interação.
- **Salvar / Carregar:** gravação local no primeiro slot; o sistema de saves suporta três slots e importação/exportação por arquivo via `SaveManager`.

## Estrutura

- `scripts/`: núcleo, renderização, controles, áudio e utilitários.
- `systems/`: combate, atributos, inventário, equipamentos, magia, missões, diálogos, localização e saves.
- `world/`: biomas, mapa, criaturas, NPCs, vilas, cidades e reinos.
- `data/`: dados iniciais de personagens, itens, equipamentos, magia, inimigos, dragões e 30 missões.
- `assets/`: diretórios reservados para arte e áudio.

## Estado desta versão

Os 43 módulos JavaScript estão preenchidos e foram verificados quanto à sintaxe e importação. A base jogável inclui movimentação, câmera, terreno de teste, criaturas, combate básico, HUD e gravação local. Arte final, mapas desenhados, animações completas, conteúdo narrativo integral, balanceamento e testes em dispositivos reais ainda precisam de produção e validação.

## Fonte incluída

A fonte `oi.ttf` foi adicionada em `assets/fonts/oi.ttf` e aplicada aos elementos de destaque da interface.

## Android

O projeto-fonte Android está em `android/`. Os artefatos internos finais do APK (`classes.dex`, bibliotecas nativas quando necessárias e assinatura `META-INF`) são gerados pela compilação; não são arquivos que devam ser preenchidos manualmente.
