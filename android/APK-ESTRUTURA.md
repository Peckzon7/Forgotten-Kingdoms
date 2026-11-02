# Estrutura do APK

Este ZIP contém o projeto-fonte Android e os arquivos do jogo em `app/src/main/assets/www/`.

- `AndroidManifest.xml`: já incluído em `app/src/main/`.
- `assets/`: HTML, CSS, JavaScript, dados, recursos e fonte do jogo.
- `res/`: recursos Android básicos.
- `classes.dex`: gerado pelo Android Gradle Plugin ao compilar.
- `lib/`: só aparece no APK se houver bibliotecas nativas `.so` para as ABIs usadas.
- `META-INF/`: metadados/assinatura são gerados durante o empacotamento e assinatura do APK.

Não foram criados `classes.dex`, `.so` ou assinaturas falsos: são artefatos binários produzidos pelo processo real de build.

Para compilar, abra a pasta `android/` no Android Studio com SDK 35 instalado e execute Build > Build Bundle(s) / APK(s) > Build APK(s).
