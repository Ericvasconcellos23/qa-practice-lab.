from playwright.sync_api import Page


class ProdutosPage:
    def __init__(self, pagina: Page):
        self.pagina = pagina

        self.titulo = pagina.get_by_test_id("products-title")
        self.contador_carrinho = pagina.get_by_test_id("cart-count")
        self.botao_carrinho = pagina.get_by_test_id("open-cart")
        self.campo_busca = pagina.get_by_test_id("search")
        self.ordenacao = pagina.get_by_test_id("sort")
        self.cartoes = pagina.get_by_test_id("product-card")
        self.nomes_produtos = pagina.get_by_test_id("product-name")
        self.mensagem_sem_resultados = pagina.get_by_test_id("no-products")

    def adicionar_produto(self, produto_id: str):
        self.pagina.get_by_test_id(f"add-{produto_id}").click()

    def abrir_carrinho(self):
        self.botao_carrinho.click()

    def buscar(self, texto: str):
        self.campo_busca.fill(texto)

    def ordenar_por_menor_preco(self):
        self.ordenacao.select_option("asc")