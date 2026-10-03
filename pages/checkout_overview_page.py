from playwright.sync_api import Page


class CheckoutOverviewPage:
    def __init__(self, pagina: Page):
        self.total = pagina.get_by_test_id("overview-total")
        self.botao_finalizar = pagina.get_by_test_id("finish")

    def finalizar(self):
        self.botao_finalizar.click()