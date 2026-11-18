#!/usr/bin/env python3
"""Genera la teoría de cada tema en PDF para imprimir: web/descargas/teoria/utNN-teoria.pdf.

Imprime con Chrome (Playwright) las páginas de teoría de cada tema tal como
aparecen en temas.json → secciones → teoria, con el estilo de impresión de la
web (@media print), y las une en un único PDF con marcadores.

Requisitos (solo para quien genera los PDF, no para el alumnado):
    pip install playwright pypdf
    playwright install chromium      # o bien CHROME=/ruta/a/google-chrome

Uso:
    python scripts/generar_pdf_teoria.py          # todos los temas
    python scripts/generar_pdf_teoria.py 3        # solo el tema 3

Después ejecuta scripts/actualizar_aula.py para que aparezcan los enlaces de
descarga (solo se enlazan los PDF que existen). Vuelve a generar el PDF cada vez
que cambies la teoría de un tema.
"""
import datetime
import json
import os
import sys
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from huella_teoria import REGISTRO, huella, leer_registro  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
WEB = RAIZ / 'web'
SALIDA = WEB / 'descargas' / 'teoria'

# Ajustes solo para el PDF: todo desplegado, sin botones ni widgets de práctica.
CSS_PDF = """
details { display: block; }
details > summary { list-style: none; }
details > summary::-webkit-details-marker { display: none; }
button, .aula-pdf, .nav-temas, .volver-mapa, .aula-plan, .autoevaluacion-acciones,
input[type=range] { display: none !important; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
"""

# Las actividades interactivas no sirven en papel: se deja su título y explicación
# y se sustituye el resto por un aviso para hacerlas en la web.
JS_PDF = """
document.querySelectorAll('details').forEach(d => d.open = true);
document.querySelectorAll('.interactivo').forEach(caja => {
  if (!caja.querySelector('input, select, textarea, button, [draggable]')) return;
  let quitar = false;
  [...caja.children].forEach(hijo => {
    if (!quitar && hijo.matches('input, select, textarea, button, [draggable]') ||
        hijo.querySelector && hijo.querySelector('input, select, textarea, button, [draggable]')) quitar = true;
    if (quitar) {
      // Las figuras (por ejemplo, la placa base interactiva) sí se imprimen.
      const figuras = hijo.matches('svg') ? [] : [...hijo.querySelectorAll('svg')].filter(g => g.getBoundingClientRect().width > 200);
      figuras.forEach(g => caja.insertBefore(g, hijo));
      hijo.remove();
    }
  });
  const nota = document.createElement('p');
  nota.innerHTML = '<em>Actividad interactiva: hazla en la web del módulo, en esta misma página de teoría.</em>';
  caja.appendChild(nota);
});
"""

PIE = ('<div style="font-size:8px;width:100%;padding:0 12mm;color:#555;display:flex;justify-content:space-between">'
       '<span>{titulo} · versión del {fecha}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')


def generar(tema, navegador, tmp):
    paginas = [i['url'].split('#')[0] for i in tema.get('secciones', {}).get('teoria', [])]
    if not paginas:
        return None
    ut = '%02d' % tema['ut']
    titulo = 'Tema %d · %s · 0221 Montaje y mantenimiento de equipo' % (tema['ut'], tema['titulo'])
    hoy = datetime.date.today()
    escritor = PdfWriter()
    pg = navegador.new_page()
    for n, url in enumerate(paginas):
        pg.goto((WEB / 'temas' / url).as_uri(), wait_until='load')
        pg.add_style_tag(content=CSS_PDF)
        pg.evaluate(JS_PDF)
        pg.wait_for_timeout(300)
        h1 = pg.inner_text('h1')
        parte = Path(tmp) / ('%s-%d.pdf' % (ut, n))
        pg.pdf(path=str(parte), format='A4', print_background=True,
               margin={'top': '14mm', 'bottom': '16mm', 'left': '14mm', 'right': '14mm'},
               display_header_footer=True, header_template='<span></span>',
               footer_template=PIE.format(titulo=titulo.replace('&', '&amp;'), fecha=hoy.strftime('%d/%m/%Y')))
        inicio = len(escritor.pages)
        escritor.append(PdfReader(str(parte)))
        escritor.add_outline_item(h1, inicio)
    pg.close()
    escritor.add_metadata({'/Title': titulo, '/Author': 'IES Valle del Jerte · Departamento de Informática'})
    SALIDA.mkdir(parents=True, exist_ok=True)
    destino = SALIDA / ('ut%s-teoria.pdf' % ut)
    with open(destino, 'wb') as f:
        escritor.write(f)
    # Huella de cada página: actualizar_aula.py avisa si la teoría cambia después.
    registro = leer_registro(WEB)
    registro['ut%s' % ut] = {'fecha': hoy.isoformat(), 'paginas': {
        p: huella((WEB / 'temas' / p).read_text(encoding='utf-8')) for p in paginas}}
    (WEB / REGISTRO).write_text(json.dumps(registro, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')
    return destino, len(escritor.pages)


def main():
    datos = json.loads((WEB / 'datos' / 'temas.json').read_text(encoding='utf-8'))
    solo = {int(a) for a in sys.argv[1:]}
    opciones = {'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}
    with sync_playwright() as p, tempfile.TemporaryDirectory() as tmp:
        navegador = p.chromium.launch(**opciones)
        for tema in datos['temas']:
            if solo and tema['ut'] not in solo:
                continue
            r = generar(tema, navegador, tmp)
            if r:
                print('%s · %d páginas · %d KB' % (r[0].relative_to(RAIZ), r[1], r[0].stat().st_size // 1024))
        navegador.close()


if __name__ == '__main__':
    main()
