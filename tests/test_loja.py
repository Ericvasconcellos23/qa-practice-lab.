import pytest
from playwright.sync_api import expect
from pages.login_page import LoginPage
from pages.produtos_page import ProdutosPage
from pages.carrinho_page import CarrinhoPage
from pages.checkout_page import CheckoutPage
from pages.checkout_overview_page import CheckoutOverviewPage
from pages.confirmacao_page import ConfirmacaoPage

def entrar(pagina, base_url):
    login = LoginPage(pagina, base_url)
    login.abrir()
    login.fazer_login("qa@treino.com", "Teste123!")


def test_login_valido(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    expect(produtos.titulo).to_be_visible()


@pytest.mark.parametrize("email,senha,mensagem", [
    ("qa@treino.com", "errada", "E-mail ou senha inválidos."),
    ("", "Teste123!", "E-mail é obrigatório."),
    ("qa@treino.com", "", "Senha é obrigatória."),
])
def test_login_invalido(pagina, base_url, email, senha, mensagem):
    login = LoginPage(pagina, base_url)
    login.abrir()
    login.fazer_login(email, senha)
    expect(login.mensagem_erro).to_have_text(mensagem)


def test_remover_unico_produto(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.adicionar_produto("mochila")

    expect(produtos.contador_carrinho).to_have_text("1")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)
    carrinho.remover_produto("mochila")

    expect(carrinho.itens).to_have_count(0)
    expect(carrinho.mensagem_vazio).to_be_visible()
    expect(carrinho.total).to_contain_text("0,00")
    expect(carrinho.botao_checkout).to_be_disabled()


def test_nome_obrigatorio(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.adicionar_produto("mochila")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)
    carrinho.ir_para_checkout()

    checkout = CheckoutPage(pagina)

    # Deixa apenas o nome vazio para isolar essa validação.
    checkout.preencher_dados("", "Teste", "12345-678")
    checkout.continuar()

    expect(checkout.mensagem_erro).to_have_text(
        "Nome é obrigatório."
    )
    expect(checkout.campo_nome).to_be_visible()


def test_compra_completa(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.adicionar_produto("mochila")
    produtos.adicionar_produto("teclado")
    expect(produtos.contador_carrinho).to_have_text("2")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)
    expect(carrinho.total).to_contain_text("219,80")
    carrinho.ir_para_checkout()

    checkout = CheckoutPage(pagina)
    checkout.preencher_dados("Pessoa", "Teste", "12345-678")
    checkout.continuar()

    revisao = CheckoutOverviewPage(pagina)
    expect(revisao.total).to_contain_text("219,80")
    revisao.finalizar()

    confirmacao = ConfirmacaoPage(pagina)
    expect(confirmacao.mensagem_sucesso).to_have_text(
        "Pedido realizado com sucesso!"
    )
    expect(confirmacao.total).to_contain_text("219,80")
    confirmacao.voltar_aos_produtos()

    expect(produtos.contador_carrinho).to_have_text("0")

def test_cancelar_checkout(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.adicionar_produto("mochila")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)
    carrinho.ir_para_checkout()

    checkout = CheckoutPage(pagina)
    expect(checkout.campo_nome).to_be_visible()
    checkout.cancelar()

    expect(carrinho.itens).to_have_count(1)
    expect(carrinho.nomes_produtos).to_have_text(
        "Mochila de trabalho"
    )
    expect(carrinho.total).to_contain_text("129,90")
    expect(carrinho.botao_checkout).to_be_enabled()

def test_sobrenome_obrigatorio(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.adicionar_produto("mochila")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)
    carrinho.ir_para_checkout()

    checkout = CheckoutPage(pagina)
    checkout.preencher_dados("Pessoa", "", "12345-678")
    checkout.continuar()

    expect(checkout.mensagem_erro).to_have_text(
        "Sobrenome é obrigatório."
    )
    expect(checkout.campo_sobrenome).to_be_visible()


@pytest.mark.parametrize(
    "cep, mensagem",
    [
        ("", "CEP é obrigatório."),
        ("123", "CEP deve ter 8 dígitos."),
    ],
)
def test_cep_invalido(pagina, base_url, cep, mensagem):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.adicionar_produto("mochila")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)
    carrinho.ir_para_checkout()

    checkout = CheckoutPage(pagina)
    checkout.preencher_dados("Pessoa", "Teste", cep)
    checkout.continuar()

    expect(checkout.mensagem_erro).to_have_text(mensagem)
    expect(checkout.campo_cep).to_be_visible()

def test_busca_sem_resultado(pagina, base_url):
    entrar(pagina, base_url)

    produtos = ProdutosPage(pagina)
    produtos.buscar("produto inexistente")

    expect(produtos.mensagem_sem_resultados).to_have_text(
        "Nenhum produto encontrado."
    )
    expect(produtos.cartoes).to_have_count(0)

def test_dois_produtos_no_carrinho(pagina, base_url):
    entrar(pagina, base_url)
    produtos = ProdutosPage(pagina)

    produtos.adicionar_produto("mochila")
    produtos.adicionar_produto("teclado")

    expect(produtos.contador_carrinho).to_have_text("2")
    produtos.abrir_carrinho()

    carrinho = CarrinhoPage(pagina)

    expect(carrinho.itens).to_have_count(2)
    expect(carrinho.nomes_produtos).to_have_text(
        ["Mochila de trabalho", "Teclado compacto"]
    )
    expect(carrinho.total).to_contain_text("219,80")

    # Mochila: R$ 129,90 + teclado: R$ 89,90.
    expect(pagina.get_by_test_id("cart-total")).to_contain_text("219,80")

def test_ordenar_por_menor_preco(pagina, base_url):
    entrar(pagina, base_url)
    produtos = ProdutosPage(pagina)

    produtos.ordenar_por_menor_preco()

    expect(produtos.cartoes).to_have_count(4)
    expect(produtos.nomes_produtos).to_have_text(
        [
            "Caderno de testes",
            "Mouse sem fio",
            "Teclado compacto",
            "Mochila de trabalho",
        ]
    )