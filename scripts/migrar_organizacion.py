#!/usr/bin/env python3
"""Migración única del 18/11/2026 (reorganización del aula). Ya ejecutada: se conserva como registro.

1. Parte cada utNN-ejercicios.html en una página por bloque (utNN-boletin-K.html, ut01-ejercicios-resueltos.html)
   y deja utNN-ejercicios.html como índice con un hueco <!-- aula:indice --> que rellena actualizar_aula.py.
2. Reescribe en toda la web los enlaces a utNN-ejercicios.html#id hacia la página donde ha quedado ese id.
3. Portadas de tema: sustituye Estudiar/Practicar/Entregar por <!-- aula:secciones --> y mete el mapa de
   criterios y el recorrido en un desplegable.
4. Crea utNN-examen.html (índice de «Preparar el examen») y escribe "secciones" en web/datos/temas.json.
"""
import json, re
from pathlib import Path

WEB = Path(__file__).resolve().parents[1] / 'web'
TEMAS = WEB / 'temas'


def plain(s):
    return ' '.join(re.sub(r'<[^>]+>', ' ', s).split())


def sin_ce(s):
    return re.sub(r'<span class="ce[^"]*">.*?</span>', '', s, flags=re.S)


def partes(src):
    """(antes_de_main, cabecera_hasta_subnav, cuerpo, pie) de una página ya generada."""
    i = src.index('<main class="envoltura" id="contenido" tabindex="-1">')
    j = src.index('</nav>', src.index('<nav class="subnav"')) + len('</nav>')
    k = src.index('  <nav class="nav-temas">')
    return src[:i], src[i:j], src[j:k], src[k:]


mapa_ids = {}      # (tema, id) -> página
bloques_tema = {}  # tema -> [(pagina, titulo, etiqueta, descripcion)]

for n in (1, 2, 3, 4):
    origen = TEMAS / ('ut%02d-ejercicios.html' % n)
    src = origen.read_text(encoding='utf-8')
    antes, cabecera, cuerpo, pie = partes(src)
    m0 = re.search(r'\n  <section\b', cuerpo)
    previo, resto = cuerpo[:m0.start()], cuerpo[m0.start():]
    secciones = re.findall(r'\n  <section\b[^>]*>.*?\n  </section>', resto, flags=re.S)
    assert ''.join(secciones).strip() and len(re.sub(r'\s', '', resto)) == len(re.sub(r'\s', '', ''.join(secciones))), n
    # descripciones del mapa de boletines (si existe) y retirada del mapa
    desc = {}
    mm = re.search(r'\n  <h2 id="apartado-mapa">.*?</ul>\n', previo, flags=re.S)
    if mm:
        for ancla, tit, d in re.findall(r'<a href="#([^"]+)"><strong>(.*?)</strong><span>(.*?)</span>', mm.group(0), flags=re.S):
            desc[ancla] = plain(d)
        previo = previo[:mm.start()] + '\n' + previo[mm.end():]
    bloques = []
    for sec in secciones:
        h2 = re.search(r'<h2 id="([^"]+)"[^>]*>(.*?)</h2>', sec, flags=re.S)
        titulo = plain(sin_ce(h2.group(2)))
        mb = re.match(r'Boletín (\d+)', titulo)
        pagina = ('ut%02d-boletin-%s.html' % (n, mb.group(1))) if mb else 'ut%02d-ejercicios-resueltos.html' % n
        etiqueta = ('Boletín ' + mb.group(1)) if mb else 'Resueltos'
        nombre = titulo.split(' · ', 1)[1] if ' · ' in titulo else titulo
        sec = re.sub(r'\n\s*<p class="volver">.*?</p>', '', sec, flags=re.S)
        for ident in re.findall(r'\bid="([^"]+)"', sec):
            mapa_ids[(n, ident)] = pagina
        bloques.append([pagina, titulo, etiqueta, nombre, desc.get(h2.group(1), ''), sec])
    bloques_tema[n] = bloques
    # páginas de cada bloque
    tema_txt = re.search(r'<p class="modulo">(.*?)</p>', cabecera).group(1)
    meta = re.search(r'<p class="meta">(.*?)</p>', cabecera).group(1)
    for pagina, titulo, etiqueta, nombre, d, sec in bloques:
        cab = re.sub(r'<h1>.*?</h1>', '<h1>' + titulo + '</h1>', cabecera, flags=re.S)
        cab = cab.replace('aria-current="page"', 'aria-current="true"')
        pag_antes = re.sub(r'<title>.*?</title>', '<title>' + titulo + ' · Tema %d · 0221 Montaje y mantenimiento</title>' % n, antes)
        (TEMAS / pagina).write_text(pag_antes + cab + '\n' + sec + '\n\n' + pie, encoding='utf-8')
    # índice
    indice = previo.rstrip() + '\n\n  <!-- aula:indice -->\n  <!-- /aula:indice -->\n\n'
    origen.write_text(antes + cabecera + indice + pie, encoding='utf-8')

# Enlaces: utNN-ejercicios.html#id -> página nueva; #id interno de un bloque que ahora está en otra página
def reescribir(texto, pagina_actual=None, tema_actual=None):
    def cambia(m):
        prefijo, n, ident = m.group(1), int(m.group(2)), m.group(3)
        dest = mapa_ids.get((n, ident))
        if not dest:
            return m.group(0)
        return 'href="' + prefijo + dest + '#' + ident + '"'
    texto = re.sub(r'href="((?:\.\./temas/|temas/)?)ut(\d\d)-ejercicios\.html#([^"]+)"', cambia, texto)
    if pagina_actual and tema_actual:
        def interno(m):
            ident = m.group(1)
            dest = mapa_ids.get((tema_actual, ident))
            if dest and dest != pagina_actual:
                return 'href="' + dest + '#' + ident + '"'
            if ident in ('apartado-mapa',):
                return 'href="ut%02d-ejercicios.html"' % tema_actual
            return m.group(0)
        texto = re.sub(r'href="#([^"]+)"', interno, texto)
    return texto

for f in list(WEB.rglob('*.html')) + [WEB / 'datos/temas.json']:
    t = f.read_text(encoding='utf-8')
    m = re.match(r'ut(\d\d)-', f.name)
    nuevo = reescribir(t, f.name if m else None, int(m.group(1)) if m else None)
    if nuevo != t:
        f.write_text(nuevo, encoding='utf-8')

# Portadas de tema
for n in (1, 2, 3, 4):
    f = TEMAS / ('ut%02d.html' % n)
    s = f.read_text(encoding='utf-8')
    i = s.index('  <h2 id="apartado-estudiar">')
    j = s.index('  <details class="ra-ce">')
    bloque = s[i:j]
    extra = ''
    for ancla in ('apartado-mapa-de-criterios', 'apartado-recorrido'):
        k = bloque.find('  <h2 id="%s">' % ancla)
        if k >= 0:
            fin = bloque.find('\n  <h2 id=', k + 5)
            extra += bloque[k:fin if fin >= 0 else len(bloque)].rstrip() + '\n'
    nuevo = '  <!-- aula:secciones -->\n  <!-- /aula:secciones -->\n\n'
    if extra:
        nuevo += ('  <details class="aula-plan"><summary>Qué se evalúa y en qué orden se trabaja</summary>\n'
                  + extra + '  </details>\n\n')
    s = s[:i] + nuevo + s[j:]
    # avisos «Ahora mismo» de la portada (se quitan: la portada solo organiza)
    s = re.sub(r'\n  <div class="tarjeta ahora">.*?\n  </div>\n', '\n', s, flags=re.S)
    f.write_text(s, encoding='utf-8')

# Páginas «Preparar el examen» (índice con hueco)
for n in (1, 2, 3, 4):
    base = (TEMAS / ('ut%02d-practicas.html' % n)).read_text(encoding='utf-8')
    antes, cabecera, cuerpo, pie = partes(base)
    cab = re.sub(r'<h1>.*?</h1>', '<h1>Preparar el examen — Tema %d</h1>' % n, cabecera, flags=re.S)
    cab = re.sub(r'(<p class="modulo">.*?)· Prácticas(</p>)', r'\1· Preparar el examen\2', cab)
    cab = cab.replace(' aria-current="page"', '')
    pag_antes = re.sub(r'<title>.*?</title>', '<title>Preparar el examen · Tema %d · 0221 Montaje y mantenimiento</title>' % n, antes)
    intro = ('\n  <p>Aquí tienes todo lo que sirve para preparar el examen del tema: tests que se corrigen '
             'solos, repasos y autoevaluaciones. No cuenta para la nota: repítelo tantas veces como quieras.</p>\n\n'
             '  <!-- aula:indice -->\n  <!-- /aula:indice -->\n\n')
    (TEMAS / ('ut%02d-examen.html' % n)).write_text(pag_antes + cab + intro + pie, encoding='utf-8')

# Secciones en temas.json
def item(etq, titulo, url, texto=''):
    return {'etiqueta': etq, 'titulo': titulo, 'url': url, 'texto': texto}

def boletines(n):
    return [item(b[2], b[3], b[0], b[4]) for b in bloques_tema[n]]

SECCIONES = {
    1: {'teoria': [item('Teoría', 'Elementos eléctricos y electrónicos', 'ut01-teoria.html', 'Magnitudes, ley de Ohm, circuitos, componentes y medidas'),
                   item('Seguridad', 'Seguridad y prevención de riesgos (PRL)', 'ut01-prl.html', 'Antes de trabajar en el taller')],
        'ejercicios': boletines(1) + [item('Taller', 'Taller de nudos', 'ut01-ejercicios-nudos.html', 'Resolver circuitos paso a paso')],
        'practicas': [item('Prácticas', 'Prácticas del tema 1', 'ut01-practicas.html', 'Enunciados, entregas y rúbricas'),
                      item('Informe', 'Guía del informe de la práctica 2', 'ut01-practicas-p2-informe.html', 'Cómo redactar el informe')],
        'examen': [item('Repaso', 'Repaso para el examen', 'ut01-ejercicios-repaso.html', 'Método paso a paso, tipos de ejercicio y simulacro de examen')]},
    2: {'teoria': [item('Teoría', 'Estructura funcional del ordenador y arquitectura de buses', 'ut02-teoria.html', 'Representación, puertas lógicas, Von Neumann, unidades funcionales, buses y ciclo de instrucción')],
        'ejercicios': boletines(2) + [item('Simulador', 'Simulador de CPU', 'ut02-ejercicios-cpu.html', 'Programa la máquina instrucción a instrucción')],
        'practicas': [item('Práctica', 'Práctica P4: del bloque a la pieza', 'ut02-practicas.html', 'Enunciado y rúbrica')],
        'examen': [item('Test', 'Test del tema 2', 'ut02-test.html', 'Preguntas al azar, se corrige solo'),
                   item('En la web', 'Circuitos y programas autocorregibles', 'ut02-ejercicios-web.html', 'Circuitos con valores y ejecución de programas, tipo examen'),
                   item('Autoevaluación', 'Autoevaluación de la teoría', 'ut02-teoria.html#apartado-autoevaluacion', 'Preguntas rápidas al final de los apuntes')]},
    3: {'teoria': [item('Teoría 1', 'Placa base, procesador, refrigeración, memoria y expansión', 'ut03-teoria.html', 'Apartados 3.1 a 3.7 · primera parte del examen'),
                   item('Teoría 2', 'BIOS/UEFI, gráfica, monitor, adaptadores, chasis y documentación', 'ut03-teoria-2.html', 'Apartados 3.8 a 3.13 · segunda parte del examen')],
        'ejercicios': boletines(3) + [item('Simulador', 'Simulador de UEFI', 'ut03-ejercicios-uefi.html', 'Siete misiones: arranque desde USB, XMP, Windows 11, virtualización…'),
                                      item('Configurador', '¿Son compatibles estas piezas?', 'ut03-ejercicios-configurador.html', 'Procesadores reales y cinco casos para diagnosticar')],
        'practicas': [item('Prácticas', 'Prácticas P5 a P8', 'ut03-practicas.html', 'Placa y manual, pasta térmica, UEFI real, adaptadores y chasis')],
        'examen': [item('Simulacro', 'Simulacro de test · 1.ª parte (3.1 a 3.7)', 'ut03-test-1.html', 'Preguntas al azar de la teoría 1, se corrige solo'),
                   item('Autoevaluación', 'Autoevaluación de la teoría 1', 'ut03-teoria.html#apartado-autoevaluacion', '3.1 a 3.7'),
                   item('Autoevaluación', 'Autoevaluación de la teoría 2', 'ut03-teoria-2.html#apartado-autoevaluacion', '3.8 a 3.13')]},
    4: {'teoria': [item('Teoría 1', 'Almacenamiento, cableado y fuente de alimentación', 'ut04-teoria.html', 'Discos, interfaces, fuente y SAI'),
                   item('Teoría 2', 'Ensamblaje del equipo', 'ut04-teoria-2.html', 'Preparación, montaje, puesta en marcha e informe')],
        'ejercicios': boletines(4),
        'practicas': [item('Prácticas', 'Prácticas P9 a P12', 'ut04-practicas.html', 'Recepción, discos y fuente, ensamblaje y puesta en marcha')],
        'examen': [item('Autoevaluación', 'Autoevaluación de la teoría 1', 'ut04-teoria.html#apartado-autoevaluacion', 'Almacenamiento y fuente'),
                   item('Autoevaluación', 'Autoevaluación de la teoría 2', 'ut04-teoria-2.html#apartado-autoevaluacion', 'Ensamblaje')]},
}
p = WEB / 'datos/temas.json'
datos = json.loads(p.read_text(encoding='utf-8'))
datos['destacados'] = []
for t in datos['temas']:
    if t['ut'] in SECCIONES:
        t['secciones'] = SECCIONES[t['ut']]
p.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('bloques:', {n: [b[0] for b in v] for n, v in bloques_tema.items()})
print('ids reubicados:', len(mapa_ids))
