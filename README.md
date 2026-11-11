# Diário Terapia

Diário minimalista com análise por IA, login por e-mail e senha, recuperação de senha e diário salvo na nuvem (Firebase).

## 1. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e crie um projeto (pode desativar o Google Analytics).
2. Em **Configurações do projeto → Seus apps**, adicione um app **Web** (`</>`), copie o bloco `firebaseConfig` e cole em `firebase-config.js`.
3. **Authentication → Começar → Método de login**: ative **E-mail/senha**.
4. **Authentication → Configurações → Domínios autorizados**: adicione `SEU-USUARIO.github.io`.
5. **Authentication → Modelos (Templates)**: em *Redefinição de senha*, altere o idioma para Português (Brasil) se quiser.
6. **Firestore Database → Criar banco de dados**: modo de produção, região `southamerica-east1` (São Paulo).
7. **Firestore → Regras**: cole o conteúdo de `firestore.rules` e publique. Elas garantem que cada pessoa leia e escreva só os próprios dados.

## 2. Publicar no GitHub Pages

Envie todos os arquivos para a raiz do repositório e ative **Settings → Pages → Deploy from a branch → main → / (root)**.

## 3. Como funciona

- Cadastro e login com e-mail e senha (mínimo de 8 caracteres). "Esqueci minha senha" envia um link por e-mail.
- Depois de entrar, cada aparelho pede um **PIN de 6 dígitos** local, que bloqueia o app. Se esquecer o PIN, saia da conta e entre de novo.
- O diário fica no Firestore e sincroniza entre aparelhos. Sair da conta não apaga nada da nuvem. **Excluir conta e dados** exige a senha e apaga tudo.
- **Importar diário antigo deste aparelho** (seção Conta) traz as entradas da versão antiga, que ficavam só no navegador.
- A **chave da API da Anthropic** para a análise por IA é colada em cada aparelho e fica só nele. O modelo está em `MODEL`, no `app.js`.
- Backup criptografado (AES-GCM) continua disponível.

## Privacidade

Os textos ficam no Firestore **sem criptografia de ponta a ponta**: as regras impedem outros usuários de lerem, mas quem administra o projeto Firebase consegue ver os dados no console. Para uso pessoal ou familiar isso costuma ser aceitável. Se quiser que nem o administrador consiga ler, é preciso criptografar no aparelho, e aí perder a senha significa perder o diário.

O app oferece reflexões de apoio e não substitui psicólogo ou psiquiatra. Em crise, ligue 188 (CVV, 24 h).
