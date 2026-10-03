from playwright.sync_api import Page


class CheckoutPage:
    def __init__(self, pagina: Page):
        self.campo_nome = pagina.get_by_test_id("first-name")
        self.campo_sobrenome = pagina.get_by_test_id("last-name")
        self.campo_cep = pagina.get_by_test_id("postal-code")
        self.mensagem_erro = pagina.get_by_test_id("checkout-error")
        self.botao_continuar = pagina.get_by_test_id("continue-checkout")
        self.botao_cancelar = pagina.get_by_test_id("cancel-checkout")

    def preencher_dados(self, nome: str, sobrenome: str, cep: str):
        self.campo_nome.fill(nome)
        self.campo_sobrenome.fill(sobrenome)
        self.campo_cep.fill(cep)

    def continuar(self):
        self.botao_continuar.click()

    def cancelar(self):
        self.botao_cancelar.click()