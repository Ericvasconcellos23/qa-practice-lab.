# Plano de testes — v1

Objetivo: verificar o fluxo de compra fictícia e suas validações.
Escopo: login, catálogo, busca, ordenação, adicionar/remover, total, checkout, cancelamento e sucesso.
Fora do escopo: API, banco, segurança de autenticação, pagamento, entrega e desempenho em produção.
Pré-condições: aplicação local acessível; Chromium instalado; dados fictícios.
Abordagem: execução manual exploratória e dos casos documentados; automação dos fluxos críticos em Python/Playwright/Pytest.
Critério de conclusão: casos planejados executados, resultados registrados e defeitos relevantes documentados. Não existe execução do usuário registrada ainda.

## Regras

E-mail normalizado por trim e lowercase; senha exata. Validações: e-mail vazio, senha vazia, credenciais. Produto único no carrinho. Total é soma dos preços sem frete. Checkout: nome, sobrenome e CEP obrigatórios nessa ordem; CEP com 8 dígitos ou 00000-000. Cancelar preserva carrinho. Concluir limpa carrinho e preserva total na confirmação. Reiniciar limpa sessão.

## Registro de execução

| Caso | Ambiente/versão | Data | Resultado observado | Status | Evidência |
|---|---|---|---|---|---|
| CT-001 a CT-014 (aba do site) | A preencher | A preencher | A preencher | Não executado pelo autor | A preencher |

## Modelo de defeito

Título, caso relacionado, versão, navegador, pré-condições, dados fictícios, passos numerados, resultado esperado, resultado obtido, evidência e impacto. Registre apenas falhas que realmente observar.

## Evolução sugerida

Automatizar busca, ordenação, cancelamento e demais campos obrigatórios. Criar Page Objects para carrinho e checkout. Integrar evidências/Allure apenas depois de compreender o fluxo básico. API e banco exigem uma nova implementação real, não uma descrição no README.
