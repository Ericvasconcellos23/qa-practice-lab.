# QA Practice Lab

Laboratório educacional de automação Web para Eric Vasconcellos. Loja fictícia com login, produtos, busca, ordenação, carrinho e checkout. Criado com assistência de IA a partir dos fluxos já praticados no projeto anterior. Estude, execute e altere os exemplos antes de apresentá-los como experiência própria.

## Tecnologias e limites

- HTML: estrutura da interface; CSS: apresentação responsiva.
- JavaScript sem framework: regras no navegador, usando sessionStorage.
- Python: linguagem dos exemplos de teste.
- Playwright: interação com navegador e assertions com espera automática.
- Pytest: execução, fixtures e parametrização.
- Page Object Model: exemplo em pages/login_page.py; o restante das ações está nos testes e pode ser refatorado como exercício.
- Casos de teste e escrita BDD: especificação do comportamento. Não usamos Cucumber.

Não há backend, API, SQL, contas reais ou pagamentos. Login é uma simulação, não um mecanismo seguro de autenticação. A sessão é isolada por aba. O número de pedido QA-001 é fixo para testes determinísticos. Testes Web não representam uma pirâmide completa. JavaScript/TypeScript com Playwright e Java com Selenium são trilhas futuras, não implementadas nem atribuídas ao autor. Não há ranking de linguagens do mercado neste projeto.

## Rodar no Windows / PowerShell

Na pasta extraída, abra dois terminais:

Terminal 1 — servir a loja (mantenha aberto):

```powershell
python -m http.server 8000 --directory dist
```

Acesse http://localhost:8000. Credenciais fictícias: qa@treino.com / Teste123!

Terminal 2 — ambiente de testes:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m playwright install chromium
python -m pytest -v
```

Se a ativação for bloqueada pelo PowerShell, use diretamente `.\.venv\Scripts\python.exe` no lugar de `python`, sem alterar políticas do sistema.

A suíte contém 7 casos coletáveis (incluindo as 3 variações do login inválido). Isso é quantidade planejada, não resultado de execução. As dependências possuem intervalos de versão; após instalar, registre as versões realmente usadas com `python -m pip freeze`.

Opcional: definir outra URL no terminal dos testes:

```powershell
$env:BASE_URL = "https://SEU-SITE"
python -m pytest -v
```

Um site privado que exige login do provedor não aceita esses exemplos diretamente. Use a versão local ou um endereço público autorizado.

## Entender o primeiro teste

1. A fixture abre Chromium em um contexto novo.
2. LoginPage centraliza seletores e ações da tela de login.
3. O teste envia credenciais fictícias.
4. expect verifica o título Produtos: esse é o resultado esperado.
5. A fixture fecha o navegador. Cada teste começa sem estado anterior.

## Documentação e prática

Abra a aba Casos de teste na loja e docs/plano-de-testes.md. Execute primeiro manualmente e depois automatize. Registre versão, ambiente, data, resultado real e evidência. Adicione novos testes para os casos ainda não automatizados. O caso de defeito deve descrever esperado, obtido, passos e evidências; não invente um defeito encontrado.

## GitHub

Crie um repositório novo (por exemplo qa-practice-lab). Não sobrescreva trabalho-qa. Depois de estudar e validar:

```powershell
git init
git add .
git commit -m "feat: add educational QA practice lab"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/qa-practice-lab.git
git push -u origin main
```

O upload ao GitHub não foi realizado automaticamente. GitHub Pages pode servir a pasta dist, mas a publicação lá precisa ser configurada separadamente.

## Apresentação honesta

Após executar e entender: "Usei uma loja educacional criada com assistência de IA para praticar testes Web em Python com Playwright e Pytest. Documentei cenários e utilizei Page Object Model no login." Acrescente seus resultados reais, sua contribuição e o link do repositório. Não declare domínio de tecnologias só porque aparecem no código gerado.

## Ampliação da suíte — 03/10/2026

- Adicionado teste de cancelamento do checkout.
- Verificado o retorno ao carrinho com produto e total preservados.
- Resultado da execução completa: 8 testes aprovados.

## Validação de sobrenome — 03/10/2026

- Adicionado teste de sobrenome obrigatório no checkout.
- Verificada a mensagem de erro e a permanência no checkout.
- Resultado da execução completa: 9 testes aprovados.

## Validação de CEP — 03/10/2026

- Adicionados dois casos parametrizados: CEP vazio e CEP inválido.
- Verificadas as mensagens de erro e a permanência no checkout.
- Resultado da execução completa: 11 testes aprovados.

## Busca sem resultado — 03/10/2026

- Adicionado teste de busca por produto inexistente.
- Verificada a mensagem “Nenhum produto encontrado.”
- Confirmado que nenhum cartão de produto é exibido.
- Resultado da execução completa: 12 testes aprovados.

## Dois produtos no carrinho — 03/10/2026

- Verificados os nomes dos produtos, a quantidade e o total de R$ 219,80.
- Resultado da execução completa: 13 testes aprovados.

