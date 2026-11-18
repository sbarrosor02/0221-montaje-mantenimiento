"""Huella del contenido de una página de teoría, para saber si su PDF está al día.

Solo cuenta el contenido (de la cabecera al pie); se ignoran la barra del tema,
el anterior/siguiente y los botones, que cambia el generador de la web.
La usan generar_pdf_teoria.py (al crear el PDF) y actualizar_aula.py (para avisar).
"""
import hashlib
import json
import re
from pathlib import Path

REGISTRO = 'descargas/teoria/huellas.json'


def huella(html):
    i = html.find('<header class="cab">')
    j = html.find('<footer class="pie">')
    cuerpo = html[i if i >= 0 else 0:j if j >= 0 else len(html)]
    cuerpo = re.sub(r'<nav\b.*?</nav>', '', cuerpo, flags=re.S)
    cuerpo = re.sub(r'<div class="aula-herramientas">.*?</div>', '', cuerpo, flags=re.S)
    return hashlib.sha256(' '.join(cuerpo.split()).encode('utf-8')).hexdigest()[:16]


def leer_registro(web):
    ruta = Path(web) / REGISTRO
    return json.loads(ruta.read_text(encoding='utf-8')) if ruta.is_file() else {}


def pdf_desactualizado(web, ut, paginas):
    """Lista de páginas de teoría del tema que han cambiado desde que se generó su PDF."""
    web = Path(web)
    if not (web / 'descargas' / 'teoria' / ('ut%02d-teoria.pdf' % ut)).is_file():
        return []
    guardado = leer_registro(web).get('ut%02d' % ut, {}).get('paginas', {})
    cambiadas = []
    for p in paginas:
        f = web / 'temas' / p
        if f.is_file() and guardado.get(p) != huella(f.read_text(encoding='utf-8')):
            cambiadas.append(p)
    return cambiadas
