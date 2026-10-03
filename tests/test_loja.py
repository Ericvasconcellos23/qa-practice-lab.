import pytest
from playwright.sync_api import expect
from pages.login_page import LoginPage


def entrar(pagina, base_url):
    login = LoginPage(pagina, base_url)
    login.abrir()
    login.fazer_login("qa@treino.com", "Teste123!")


def test_login_valido(pagina, base_url):
    entrar(pagina, base_url)
    expect(pagina.get_by_test_id("products-title")).to_be_visible()


@pytest.mark.parametrize("email,senha,mensagem", [
    ("qa@treino.com", "errada", "E-mail ou senha inválidos."),
    ("", "Teste123!", "E-mail é obrigatório."),
    ("qa@treino.com", "", "Senha é obrigatória."),
])
def test_login_invalido(pagina, base_url, email, senha, mensagem):
    login = LoginPage(pagina, base_url)
    login.abrir()
    login.fazer_login(email, senha)
    expect(pagina.get_by_test_id("login-error")).to_have_text(mensagem)


def test_remover_unico_produto(pagina, base_url):
    entrar(pagina, base_url)
    pagina.get_by_test_id("add-mochila").click()
    expect(pagina.get_by_test_id("cart-count")).to_have_text("1")
    pagina.get_by_test_id("open-cart").click()
    pagina.get_by_test_id("remove-mochila").click()
    expect(pagina.get_by_test_id("empty-cart")).to_be_visible()
    expect(pagina.get_by_test_id("checkout")).to_be_disabled()


def test_nome_obrigatorio(pagina, base_url):
    entrar(pagina, base_url)
    pagina.get_by_test_id("add-mochila").click()
    pagina.get_by_test_id("open-cart").click()
    pagina.get_by_test_id("checkout").click()
    pagina.get_by_test_id("continue-checkout").click()
    expect(pagina.get_by_test_id("checkout-error")).to_have_text("Nome é obrigatório.")


def test_compra_completa(pagina, base_url):
    entrar(pagina, base_url)
    pagina.get_by_test_id("add-mochila").click()
    pagina.get_by_test_id("add-teclado").click()
    expect(pagina.get_by_test_id("cart-count")).to_have_text("2")
    pagina.get_by_test_id("open-cart").click()
    expect(pagina.get_by_test_id("cart-total")).to_contain_text("219,80")
    pagina.get_by_test_id("checkout").click()
    pagina.get_by_test_id("first-name").fill("Pessoa")
    pagina.get_by_test_id("last-name").fill("Teste")
    pagina.get_by_test_id("postal-code").fill("12345-678")
    pagina.get_by_test_id("continue-checkout").click()
    expect(pagina.get_by_test_id("overview-total")).to_contain_text("219,80")
    pagina.get_by_test_id("finish").click()
    expect(pagina.get_by_test_id("order-success")).to_have_text("Pedido realizado com sucesso!")
    expect(pagina.get_by_test_id("order-total")).to_contain_text("219,80")
    pagina.get_by_test_id("back-products").click()
    expect(pagina.get_by_test_id("cart-count")).to_have_text("0")
