# Diário Terapia

Diário minimalista com análise por IA: você escreve como foi o dia, escolhe o humor e recebe uma análise crítica curta com dicas. No fim do mês, gera um relatório mensal.

## Recursos

- Vários usuários no mesmo aparelho, cada um com nome e senha de 6 dígitos
- Exclusão de usuário (exige a senha dele) apagando todos os dados
- Calendário com marcação dos dias escritos
- Humor em 5 níveis (carinhas coloridas)
- Análise do dia e relatório mensal via API da Anthropic
- Backup criptografado (AES-GCM) para exportar e importar
- Funciona em modo claro e escuro e pode ser adicionado à tela inicial do celular

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (por exemplo, `diario-terapia`).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Em **Settings → Pages**, em *Build and deployment*, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)`, e salve.
4. Em alguns minutos o app estará em `https://SEU-USUARIO.github.io/diario-terapia/`.

## Ativar a análise por IA

Cada pessoa cola a própria chave da API da Anthropic (começa com `sk-ant-`) na seção **Análise por IA**, no fim da página inicial. A chave fica salva só no navegador do aparelho. O uso é cobrado na conta dona da chave. O modelo usado está na constante `MODEL` em `app.js`.

## Privacidade e limites

- Os diários ficam no `localStorage` do navegador, sem servidor. Limpar os dados do site ou trocar de celular apaga tudo, então use o backup.
- A senha de 6 dígitos bloqueia o acesso à tela, mas não criptografa os dados guardados no aparelho. Já o arquivo de backup é criptografado com uma senha separada (mínimo de 8 caracteres), que não pode ser recuperada.
- Como o app é 100% no navegador, a chave da API é usada diretamente do aparelho. Não coloque uma chave sua dentro do código nem compartilhe o site com ela embutida. Para distribuir a outras pessoas sem pedir chave, o ideal é criar um pequeno servidor intermediário que guarde a chave.
- O app oferece reflexões de apoio e não substitui psicólogo ou psiquiatra. Em crise, ligue 188 (CVV, 24 h).
