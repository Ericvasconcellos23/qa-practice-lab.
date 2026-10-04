# QA Practice Lab

Laboratório educacional de automação Web para Eric Vasconcellos. Loja fictícia com login, produtos, busca, ordenação, carrinho e checkout. Criado com assistência de IA a partir dos fluxos já praticados no projeto anterior. Estude, execute e altere os exemplos antes de apresentá-los como experiência própria.

## Tecnologias e limites

- HTML: estrutura da interface; CSS: apresentação responsiva.
- JavaScript sem framework: regras no navegador, usando sessionStorage.
- Python: linguagem dos exemplos de teste.
- Playwright: interação com navegador e assertions com espera automática.
- Pytest: execução, fixtures e parametrização.
- Page Object Model: seletores e ações organizados em classes para login,
  produtos, carrinho, checkout, revisão do pedido e confirmação.
  Os testes mantêm as verificações dos resultados esperados.
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

A suíte contém 14 casos coletáveis, incluindo os casos parametrizados.
A execução completa passou no Windows com Python 3.13.2 e Pytest 9.1.1
em 03/10/2026. Após o último ajuste no Page Object de login, os três
casos de login inválido também passaram.

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

## Cobertura atual da automação

A suíte automatizada possui 14 casos de teste executados com Pytest e Playwright.

Os principais cenários cobertos são:

- Login válido.
- Login com senha incorreta.
- Login com e-mail vazio.
- Login com senha vazia.
- Remoção de produto do carrinho.
- Validação de nome obrigatório no checkout.
- Validação de sobrenome obrigatório.
- Validação de CEP vazio e inválido.
- Fluxo completo de compra.
- Cancelamento do checkout.
- Busca por produto inexistente.
- Adição de múltiplos produtos ao carrinho.
- Ordenação de produtos por menor preço.

Os testes Web utilizam Page Object Model (POM) para separar as interações com as páginas da lógica dos testes.

### Resultado da última execução

Ambiente utilizado:

- Windows
- Python 3.13.2
- Pytest 9.1.1
- Playwright com Chromium

Resultado:

```text
collected 14 items

tests/test_loja.py .............. [100%]

14 passed