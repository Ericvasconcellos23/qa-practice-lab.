from playwright.sync_api import Page


class CarrinhoPage:
    def __init__(self, pagina: Page):
        self.pagina = pagina

        self.itens = pagina.get_by_test_id("cart-item")
        self.nomes_produtos = pagina.get_by_test_id("cart-item-name")
        self.total = pagina.get_by_test_id("cart-total")
        self.mensagem_vazio = pagina.get_by_test_id("empty-cart")
        self.botao_checkout = pagina.get_by_test_id("checkout")
        self.botao_continuar = pagina.get_by_test_id("continue-shopping")

    def remover_produto(self, produto_id: str):
        self.pagina.get_by_test_id(f"remove-{produto_id}").click()

    def ir_para_checkout(self):
        self.botao_checkout.click()

    def continuar_comprando(self):
        self.botao_continuar.click()