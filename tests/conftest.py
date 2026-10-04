import os
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture
def pagina():
    # Um novo contexto por teste evita compartilhar carrinho e sessão.
    with sync_playwright() as p:
        navegador = p.chromium.launch(
                headless=False,
                slow_mo=700,
            )
        contexto = navegador.new_context()
        pagina = contexto.new_page()
        yield pagina
        contexto.close()
        navegador.close()

@pytest.fixture
def base_url():
    return os.getenv("BASE_URL", "http://localhost:8000")
