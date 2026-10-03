const products = [
    {
        id: 'mochila',
        name: 'Mochila de trabalho',
        price: 129.9,
        category: 'Acessórios',
        desc: 'Compartimento para notebook e acessórios.'
    },
    {
        id: 'teclado',
        name: 'Teclado compacto',
        price: 89.9,
        category: 'Periféricos',
        desc: 'Uma mesa organizada começa pelo básico.'
    },
    {
        id: 'mouse',
        name: 'Mouse sem fio',
        price: 59.9,
        category: 'Periféricos',
        desc: 'Precisão para a rotina de trabalho.'
    },
    {
        id: 'caderno',
        name: 'Caderno de testes',
        price: 24.9,
        category: 'Acessórios',
        desc: 'Espaço para cenários, ideias e evidências.'
    }
];

const money = n =>
    n.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

let state;

try {
    state = JSON.parse(sessionStorage.getItem('qa-lab'));
} catch {}

state = state || {
    logged: false,
    cart: [],
    step: 'login',
    customer: {},
    order: null
};

const app = document.querySelector('#app');

const save = () =>
    sessionStorage.setItem('qa-lab', JSON.stringify(state));

const total = () =>
    products
        .filter(p => state.cart.includes(p.id))
        .reduce((a, p) => a + p.price, 0);


// ======================================================
// COMPONENTES
// ======================================================

function intro(k, title, desc) {
    return `
        <div class="intro">
            <div class="eyebrow">${k}</div>

            <h1>${title}</h1>

            <p class="lead">
                ${desc}
            </p>
        </div>
    `;
}


function side() {
    return `
        <div class="card">

            <h2>Seu roteiro de treino</h2>

            <div class="stat">
                <strong>01 / Autenticação</strong>
                <span class="muted">
                    Login válido, inválido e campos vazios.
                </span>
            </div>

            <div class="stat">
                <strong>02 / Carrinho</strong>
                <span class="muted">
                    Adicionar, remover e conferir o total.
                </span>
            </div>

            <div class="stat">
                <strong>03 / Checkout</strong>
                <span class="muted">
                    Campos obrigatórios e pedido concluído.
                </span>
            </div>

            <div class="hint">
                Seletores previsíveis
                <br>

                <code>data-testid</code>

                <p class="muted">
                    Cada ação tem um identificador para seus testes
                    com Playwright.
                </p>
            </div>

            <button
                class="secondary"
                style="width:100%; margin-top:20px"
                data-testid="reset"
                onclick="reset()"
            >
                Reiniciar laboratório
            </button>

        </div>
    `;
}


// ======================================================
// ESTADO DA APLICAÇÃO
// ======================================================

function reset() {
    state = {
        logged: false,
        cart: [],
        step: 'login',
        customer: {},
        order: null
    };

    save();
    render();
}


function goto(step) {
    state.step = step;

    save();
    render();
}


// ======================================================
// LABORATÓRIO
// ======================================================

function laboratory() {

    let content = '';

    // LOGIN
    if (!state.logged) {

        content = `
            <div class="login">

                <h2>Entre na loja de treino</h2>

                <p class="muted">
                    Use a conta fictícia abaixo para começar.
                </p>

                <form id="login-form" novalidate>

                    <label for="email">
                        E-mail
                    </label>

                    <input
                        id="email"
                        type="email"
                        autocomplete="username"
                        data-testid="email"
                        placeholder="qa@treino.com"
                    >

                    <label for="password">
                        Senha
                    </label>

                    <input
                        id="password"
                        type="password"
                        autocomplete="current-password"
                        data-testid="password"
                        placeholder="Digite a senha de treino"
                    >

                    <p
                        id="login-error"
                        role="alert"
                        data-testid="login-error"
                        hidden
                    ></p>

                    <div class="actions">
                        <button
                            type="submit"
                            data-testid="login-button"
                        >
                            Entrar na loja
                        </button>
                    </div>

                </form>

                <div class="hint">
                    CONTA PARA TESTES
                    <br>

                    E-mail:
                    <code>qa@treino.com</code>

                    <br>

                    Senha:
                    <code>Teste123!</code>

                    <br>

                    <span class="muted">
                        Credenciais públicas e fictícias.
                    </span>
                </div>

            </div>
        `;
    }

    // PRODUTOS
    else if (state.step === 'products') {

        content = `
            <div class="panel-head">

                <h2 data-testid="products-title">
                    Produtos
                </h2>

                <button
                    onclick="goto('cart')"
                    data-testid="open-cart"
                >
                    Carrinho

                    <span data-testid="cart-count">
                        ${state.cart.length}
                    </span>
                </button>

            </div>

            <div class="filters">

                <input
                    aria-label="Buscar produto"
                    id="search"
                    data-testid="search"
                    placeholder="Buscar produto"
                >

                <select
                    id="sort"
                    aria-label="Ordenar produtos"
                    data-testid="sort"
                >
                    <option value="default">
                        Ordem original
                    </option>

                    <option value="asc">
                        Menor preço
                    </option>

                    <option value="desc">
                        Maior preço
                    </option>
                </select>

            </div>

            <div
                class="cards"
                id="products"
            ></div>

            <div class="actions">

                <button
                    class="link"
                    onclick="logout()"
                    data-testid="logout"
                >
                    Sair da conta
                </button>

            </div>
        `;
    }

    // CARRINHO
    else if (state.step === 'cart') {

        content = `
            <h2>Seu carrinho</h2>

            ${
                state.cart.length
                    ? products
                        .filter(p => state.cart.includes(p.id))
                        .map(p => `
                            <div
                                class="row"
                                data-testid="cart-item"
                            >

                                <div>
                                    <strong data-testid="cart-item-name">
                                        ${p.name}
                                    </strong>

                                    <span class="muted">
                                        ${money(p.price)}
                                    </span>
                                </div>

                                <button
                                    class="secondary"
                                    data-testid="remove-${p.id}"
                                    onclick="toggle('${p.id}')"
                                >
                                    Remover
                                </button>

                            </div>
                        `)
                        .join('')
                    : `
                        <p
                            class="muted"
                            data-testid="empty-cart"
                        >
                            Seu carrinho está vazio.
                        </p>
                    `
            }

            <div class="row">

                <strong>Total</strong>

                <strong data-testid="cart-total">
                    ${money(total())}
                </strong>

            </div>

            <div class="actions">

                <button
                    class="secondary"
                    onclick="goto('products')"
                    data-testid="continue-shopping"
                >
                    Continuar comprando
                </button>

                <button
                    onclick="goto('checkout')"
                    data-testid="checkout"
                    ${!state.cart.length ? 'disabled' : ''}
                >
                    Ir para checkout
                </button>

            </div>
        `;
    }

    // CHECKOUT
    else if (state.step === 'checkout') {

        content = `
            <h2>Dados do pedido</h2>

            <p class="muted">
                Utilize apenas dados fictícios.
            </p>

            <form
                id="checkout-form"
                novalidate
            >

                <label for="first-name">
                    Nome
                </label>

                <input
                    id="first-name"
                    data-testid="first-name"
                >

                <label for="last-name">
                    Sobrenome
                </label>

                <input
                    id="last-name"
                    data-testid="last-name"
                >

                <label for="postal-code">
                    CEP
                </label>

                <input
                    id="postal-code"
                    data-testid="postal-code"
                    placeholder="00000-000"
                    inputmode="numeric"
                >

                <p
                    id="checkout-error"
                    role="alert"
                    data-testid="checkout-error"
                    hidden
                ></p>

                <div class="actions">

                    <button
                        type="submit"
                        data-testid="continue-checkout"
                    >
                        Revisar pedido
                    </button>

                    <button
                        type="button"
                        class="secondary"
                        onclick="goto('cart')"
                        data-testid="cancel-checkout"
                    >
                        Cancelar
                    </button>

                </div>

            </form>
        `;
    }

    // VISÃO GERAL
    else if (state.step === 'overview') {

        content = `
            <h2>Revise seu pedido</h2>

            <p class="muted">
                ${escapeHTML(state.customer.first)}
                ${escapeHTML(state.customer.last)}
                · CEP ${escapeHTML(state.customer.cep)}
            </p>

            ${
                products
                    .filter(p => state.cart.includes(p.id))
                    .map(p => `
                        <div class="row">
                            <strong>
                                ${p.name}
                            </strong>

                            <span>
                                ${money(p.price)}
                            </span>
                        </div>
                    `)
                    .join('')
            }

            <div class="row">

                <strong>
                    Total · sem frete
                </strong>

                <strong data-testid="overview-total">
                    ${money(total())}
                </strong>

            </div>

            <div class="actions">

                <button
                    onclick="finish()"
                    data-testid="finish"
                >
                    Finalizar pedido fictício
                </button>

                <button
                    class="secondary"
                    onclick="goto('cart')"
                    data-testid="cancel-overview"
                >
                    Cancelar
                </button>

            </div>
        `;
    }

    // SUCESSO
    else {

        content = `
            <div class="success">

                <span class="eyebrow">
                    FLUXO CONCLUÍDO
                </span>

                <h2
                    data-testid="order-success"
                    style="margin-top:15px"
                >
                    Pedido realizado com sucesso!
                </h2>

                <p class="text-small">
                    Pedido fictício

                    <strong data-testid="order-id">
                        ${state.order.id}
                    </strong>
                </p>

                <p>
                    Total:

                    <strong data-testid="order-total">
                        ${money(state.order.total)}
                    </strong>
                </p>

                <p class="muted">
                    Nenhum pagamento ou entrega será realizado.
                </p>

                <button
                    onclick="goto('products')"
                    data-testid="back-products"
                >
                    Voltar aos produtos
                </button>

            </div>
        `;
    }

    return (
        intro(
            '01 / LABORATÓRIO',
            'Uma loja. Muitos cenários.',
            'Pratique testes em um fluxo completo de compra. Comece pelo login e avance no seu ritmo.'
        )
        +
        `
            <div class="stepbar">
                <b>01 Login</b>
                <span>/</span>

                <b>02 Produtos</b>
                <span>/</span>

                <b>03 Carrinho</b>
                <span>/</span>

                <b>04 Checkout</b>
            </div>

            <div class="grid">

                <section
                    class="panel"
                    aria-label="Loja de treino"
                >
                    ${content}
                </section>

                ${side()}

            </div>
        `
    );
}


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function escapeHTML(s) {
    return s.replace(
        /[&<>"']/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c])
    );
}


function logout() {
    state.logged = false;
    state.step = 'login';

    save();
    render();
}


function toggle(id) {

    if (state.cart.includes(id)) {
        state.cart = state.cart.filter(x => x !== id);
    } else {
        state.cart.push(id);
    }

    save();

    if (state.step === 'products') {

        document.querySelector(
            '[data-testid="cart-count"]'
        ).textContent = state.cart.length;

        drawProducts();

    } else {
        render();
    }
}


function finish() {

    state.order = {
        id: 'QA-001',
        total: total()
    };

    state.cart = [];
    state.step = 'success';

    save();
    render();
}


// ======================================================
// PRODUTOS
// ======================================================

function drawProducts() {

    let ps = products.filter(p =>
        p.name
            .toLowerCase()
            .includes(
                document
                    .querySelector('#search')
                    .value
                    .trim()
                    .toLowerCase()
            )
    );

    const sort =
        document.querySelector('#sort').value;

    if (sort !== 'default') {

        ps.sort((a, b) =>
            sort === 'asc'
                ? a.price - b.price
                : b.price - a.price
        );
    }

    document.querySelector('#products').innerHTML =
        ps.length
            ? ps.map(p => `
                <article
                    class="product"
                    data-testid="product-card"
                >

                    <span class="num">
                        ${p.category.toUpperCase()}
                    </span>

                    <h3 data-testid="product-name">
                        ${p.name}
                    </h3>

                    <p class="muted">
                        ${p.desc}
                    </p>

                    <div
                        class="price"
                        data-testid="product-price"
                    >
                        ${money(p.price)}
                    </div>

                    <button
                        data-testid="add-${p.id}"
                        class="${
                            state.cart.includes(p.id)
                                ? 'secondary'
                                : ''
                        }"
                        onclick="toggle('${p.id}')"
                    >
                        ${
                            state.cart.includes(p.id)
                                ? 'Remover do carrinho'
                                : 'Adicionar ao carrinho'
                        }
                    </button>

                </article>
            `).join('')

            : `
                <p
                    data-testid="no-products"
                    class="muted"
                >
                    Nenhum produto encontrado.
                </p>
            `;
}


// ======================================================
// CASOS DE TESTE
// ======================================================

const cases = [
    [
        'CT-001',
        'Login válido',
        'qa@treino.com / Teste123!',
        'Produtos visíveis.'
    ],
    [
        'CT-002',
        'Senha incorreta',
        'qa@treino.com / errada',
        'E-mail ou senha inválidos.'
    ],
    [
        'CT-003',
        'E-mail vazio',
        'E-mail em branco',
        'E-mail é obrigatório.'
    ],
    [
        'CT-004',
        'Senha vazia',
        'E-mail válido; senha em branco',
        'Senha é obrigatória.'
    ],
    [
        'CT-005',
        'Dois produtos',
        'Mochila + teclado',
        'Badge 2; total R$ 219,80.'
    ],
    [
        'CT-006',
        'Remover produto',
        'Remover mochila do carrinho',
        'Item e total atualizados.'
    ],
    [
        'CT-007',
        'Carrinho vazio',
        'Nenhum produto',
        'Checkout desabilitado.'
    ],
    [
        'CT-008',
        'Nome vazio',
        'Checkout sem nome',
        'Nome é obrigatório.'
    ],
    [
        'CT-009',
        'Sobrenome vazio',
        'Nome preenchido; sobrenome vazio',
        'Sobrenome é obrigatório.'
    ],
    [
        'CT-010',
        'CEP vazio ou inválido',
        'Demais campos preenchidos',
        'CEP é obrigatório. / CEP deve ter 8 dígitos.'
    ],
    [
        'CT-011',
        'Cancelar checkout',
        'Carrinho com um produto',
        'Volta ao carrinho e preserva itens.'
    ],
    [
        'CT-012',
        'Compra completa',
        'Dados válidos; finalizar',
        'Sucesso; total preservado; carrinho vazio.'
    ],
    [
        'CT-013',
        'Busca sem resultado',
        'Buscar inexistente',
        'Nenhum produto encontrado.'
    ],
    [
        'CT-014',
        'Ordenação',
        'Selecionar menor preço',
        'Preços em ordem crescente.'
    ]
];


// ======================================================
// CENÁRIOS
// ======================================================

function scenarios() {

    return (
        intro(
            '02 / ESPECIFICAÇÃO',
            'O que vamos testar?',
            'Regras explícitas para comparar o resultado esperado com o comportamento observado.'
        )
        +
        `
            <div class="panel wide">

                <h2>Regras da aplicação</h2>

                <ul class="text-small">

                    <li>
                        E-mail: espaços nas extremidades são removidos
                        e maiúsculas são aceitas. Senha: comparação exata.
                    </li>

                    <li>
                        Validação de login: primeiro e-mail vazio,
                        depois senha vazia, depois credenciais.
                    </li>

                    <li>
                        Cada produto pode aparecer uma única vez no carrinho.
                        Sem frete ou descontos.
                    </li>

                    <li>
                        Checkout: nome e sobrenome não podem conter apenas
                        espaços. CEP aceita 8 dígitos ou o formato 00000-000.
                    </li>

                    <li>
                        Erros do checkout aparecem na ordem:
                        nome, sobrenome, CEP.
                    </li>

                    <li>
                        Atualizar a página preserva o estado na mesma aba.
                        Reiniciar limpa tudo. Não existe conta real nem
                        banco de dados.
                    </li>

                </ul>

            </div>

            <div class="panel">

                <h2>Casos de teste · versão 1</h2>

                <div class="table-wrap">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cenário</th>
                                <th>Ação / dados</th>
                                <th>Resultado esperado</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${
                                cases.map(c => `
                                    <tr>
                                        ${
                                            c.map(v =>
                                                `<td>${v}</td>`
                                            ).join('')
                                        }
                                    </tr>
                                `).join('')
                            }
                        </tbody>

                    </table>

                </div>

                <p class="muted">
                    Estes são casos planejados. Registre o status,
                    a evidência e eventuais defeitos após sua própria execução.
                </p>

            </div>

            <div
                class="panel"
                style="margin-top:22px"
            >

                <h2>Exemplo BDD</h2>

                <pre>Dado que estou autenticado na loja
E adicionei a mochila ao carrinho
Quando removo a mochila
Então o carrinho deve ficar vazio
E o checkout deve estar desabilitado</pre>

                <p class="muted">
                    BDD descreve o comportamento esperado.
                    Aqui usamos a escrita Dado / Quando / Então;
                    não foi instalado Cucumber.
                </p>

            </div>
        `
    );
}


// ======================================================
// GUIA TÉCNICO
// ======================================================

function guide() {

    return (
        intro(
            '03 / GUIA TÉCNICO',
            'Entender antes de automatizar.',
            'Comece com as ferramentas que você já praticou. A aplicação também pode ser testada por outras ferramentas, quando você decidir estudá-las.'
        )
        +
        `
            <div class="tech">

                <div class="card">
                    <h2>HTML + CSS</h2>

                    <p class="muted">
                        HTML organiza os elementos da página.
                        CSS define aparência, espaçamento e adaptação ao celular.
                    </p>

                    <span class="pill">
                        Construção do site
                    </span>
                </div>

                <div class="card">
                    <h2>JavaScript</h2>

                    <p class="muted">
                        Controla login, busca, carrinho e validações
                        no navegador. O código está em dist/app.js para estudo.
                    </p>

                    <span class="pill">
                        Construção do site
                    </span>
                </div>

                <div class="card">
                    <h2>Python</h2>

                    <p class="muted">
                        Linguagem usada nos exemplos de automação.
                        É a continuação do seu projeto anterior.
                    </p>

                    <span class="pill">
                        Trilha principal de testes
                    </span>
                </div>

                <div class="card">
                    <h2>Playwright</h2>

                    <p class="muted">
                        Abre o navegador, interage com a tela e verifica
                        resultados usando seletores estáveis.
                    </p>

                    <span class="pill">
                        Automação Web
                    </span>
                </div>

                <div class="card">
                    <h2>Pytest</h2>

                    <p class="muted">
                        Organiza a execução dos testes e reutiliza
                        a preparação por meio de fixtures.
                    </p>

                    <span class="pill">
                        Execução e fixtures
                    </span>
                </div>

                <div class="card">
                    <h2>Page Object Model</h2>

                    <p class="muted">
                        Separa as ações da página das verificações dos testes.
                        O exemplo de login mostra essa organização.
                    </p>

                    <span class="pill">
                        Organização do código
                    </span>
                </div>

            </div>

            <div
                class="panel"
                style="margin-top:22px"
            >

                <h2>Seu primeiro teste</h2>

                <pre>def test_login_valido(pagina):
    login = LoginPage(pagina)
    login.abrir()
    login.fazer_login("qa@treino.com", "Teste123!")
    expect(
        pagina.get_by_test_id("products-title")
    ).to_be_visible()</pre>

                <p class="muted">
                    O arquivo completo, com imports, fixture e Page Object,
                    está no pacote do projeto.
                </p>

                <div class="notice">
                    Requests e SQL não são usados nesta versão:
                    a loja não oferece API nem banco de dados.
                    Os testes aqui são de interface.
                    Não descreva esta suíte como uma pirâmide completa de testes.
                </div>

                <h3>
                    Outras linguagens como próximos estudos
                </h3>

                <p class="text-small">
                    Os mesmos elementos HTML podem ser automatizados
                    com JavaScript ou TypeScript usando Playwright,
                    e com Java usando Selenium. São possibilidades futuras;
                    não representam competências que você já demonstrou
                    nem suítes implementadas neste projeto.
                </p>

            </div>
        `
    );
}


// ======================================================
// PORTFÓLIO
// ======================================================

function portfolio() {

    return (
        intro(
            '04 / PORTFÓLIO',
            'Mostre o que você consegue explicar.',
            'Um projeto de aprendizado cresce junto com suas evidências. O código gerado é um ponto de partida para você estudar e evoluir.'
        )
        +
        `
            <div class="grid">

                <div class="panel">

                    <h2>QA Practice Lab</h2>

                    <p class="text-small">
                        Laboratório educacional para praticar testes de login,
                        catálogo, carrinho e checkout. A aplicação foi criada
                        com assistência de IA, com base nos fluxos que Eric já
                        praticou em seu projeto de automação.
                    </p>

                    <div class="notice">
                        Não há resultados de execução do Eric registrados aqui.
                        Antes de divulgar competências, execute os exemplos,
                        entenda o código e acrescente suas próprias evidências.
                    </div>

                    <h3>
                        Como levar para o GitHub
                    </h3>

                    <ol class="text-small">

                        <li>
                            Baixe e extraia o código completo.
                        </li>

                        <li>
                            Leia o README e rode a loja localmente.
                        </li>

                        <li>
                            Instale as dependências e execute os testes Python.
                        </li>

                        <li>
                            Registre os resultados e ajuste os casos de teste.
                        </li>

                        <li>
                            Crie um novo repositório e publique os arquivos
                            com seus próprios commits.
                        </li>

                    </ol>

                    <a
                        class="button"
                        href="qa-practice-lab.zip"
                        download
                        data-testid="download-source"
                    >
                        Baixar código + testes + documentação
                    </a>

                    <h3>
                        Como apresentar após executar
                    </h3>

                    <p class="text-small">
                        “Usei uma loja educacional criada com assistência
                        de IA para praticar automação Web em Python.
                        Organizei testes com Pytest e Page Object Model,
                        usei Playwright para interagir com a interface
                        e comparei os resultados com casos documentados.”
                    </p>

                    <p class="muted">
                        Use essa descrição somente depois de realizar
                        e compreender essas etapas. Inclua o número real
                        de testes executados e o link das evidências.
                    </p>

                </div>

                <div class="card">

                    <h2>Checklist de autoria</h2>

                    <div class="stat">
                        <strong>Conhecer o fluxo</strong>

                        <span class="muted">
                            Explicar cada regra de negócio.
                        </span>
                    </div>

                    <div class="stat">
                        <strong>Entender o teste</strong>

                        <span class="muted">
                            Explicar fixture, ação e assertion.
                        </span>
                    </div>

                    <div class="stat">
                        <strong>Guardar evidências</strong>

                        <span class="muted">
                            Relatar resultados reais.
                        </span>
                    </div>

                    <div class="stat">
                        <strong>Documentar limites</strong>

                        <span class="muted">
                            Simulação no navegador, sem API.
                        </span>
                    </div>

                </div>

            </div>
        `
    );
}


// ======================================================
// RENDERIZAÇÃO / NAVEGAÇÃO
// ======================================================

function render() {

    const route =
        (location.hash || '#laboratorio').slice(1);

    document
        .querySelectorAll('nav a')
        .forEach(a =>
            a.classList.toggle(
                'active',
                a.hash === '#' + route
            )
        );

    app.innerHTML = (
        {
            cenarios: scenarios,
            guia: guide,
            portfolio: portfolio
        }[route] || laboratory
    )();

    if (
        route === 'laboratorio' ||
        !['cenarios', 'guia', 'portfolio'].includes(route)
    ) {
        bind();
    }
}


// ======================================================
// ERROS
// ======================================================

function error(id, message) {

    const p =
        document.getElementById(id);

    p.hidden = false;
    p.className = 'error';
    p.textContent = message;
}


// ======================================================
// EVENTOS
// ======================================================

function bind() {

    // LOGIN
    document
        .querySelector('#login-form')
        ?.addEventListener('submit', e => {

            e.preventDefault();

            const email =
                document
                    .querySelector('#email')
                    .value
                    .trim()
                    .toLowerCase();

            const pass =
                document
                    .querySelector('#password')
                    .value;

            if (!email) {
                return error(
                    'login-error',
                    'E-mail é obrigatório.'
                );
            }

            if (!pass) {
                return error(
                    'login-error',
                    'Senha é obrigatória.'
                );
            }

            if (
                email !== 'qa@treino.com' ||
                pass !== 'Teste123!'
            ) {
                return error(
                    'login-error',
                    'E-mail ou senha inválidos.'
                );
            }

            state.logged = true;
            state.step = 'products';

            save();
            render();
        });


    // PRODUTOS
    if (document.querySelector('#products')) {

        drawProducts();

        document
            .querySelector('#search')
            .addEventListener(
                'input',
                drawProducts
            );

        document
            .querySelector('#sort')
            .addEventListener(
                'change',
                drawProducts
            );
    }


    // CHECKOUT
    document
        .querySelector('#checkout-form')
        ?.addEventListener('submit', e => {

            e.preventDefault();

            const first =
                document
                    .querySelector('#first-name')
                    .value
                    .trim();

            const last =
                document
                    .querySelector('#last-name')
                    .value
                    .trim();

            const cep =
                document
                    .querySelector('#postal-code')
                    .value
                    .trim();

            if (!first) {
                return error(
                    'checkout-error',
                    'Nome é obrigatório.'
                );
            }

            if (!last) {
                return error(
                    'checkout-error',
                    'Sobrenome é obrigatório.'
                );
            }

            if (!cep) {
                return error(
                    'checkout-error',
                    'CEP é obrigatório.'
                );
            }

            if (!/^\d{8}$|^\d{5}-\d{3}$/.test(cep)) {
                return error(
                    'checkout-error',
                    'CEP deve ter 8 dígitos.'
                );
            }

            state.customer = {
                first,
                last,
                cep
            };

            goto('overview');
        });
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

window.addEventListener(
    'hashchange',
    render
);

render();