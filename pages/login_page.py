class LoginPage:
    """Centraliza as ações da tela de login (Page Object Model)."""
    def __init__(self, pagina, base_url="http://localhost:8000"):
        self.pagina = pagina
        self.base_url = base_url

    def abrir(self):
        self.pagina.goto(self.base_url)

    def fazer_login(self, email, senha):
        self.pagina.get_by_test_id("email").fill(email)
        self.pagina.get_by_test_id("password").fill(senha)
        self.pagina.get_by_test_id("login-button").click()
