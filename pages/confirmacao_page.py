from playwright.sync_api import Page


class ConfirmacaoPage:
    def __init__(self, pagina: Page):
        self.mensagem_sucesso = pagina.get_by_test_id("order-success")
        self.total = pagina.get_by_test_id("order-total")
        self.botao_voltar = pagina.get_by_test_id("back-products")

    def voltar_aos_produtos(self):
        self.botao_voltar.click()