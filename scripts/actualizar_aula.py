from pathlib import Path
import re
import json
import html
import unicodedata

ROOT = Path(__file__).resolve().parents[2]
REPOS = [Path(__file__).resolve().parents[1].name]

def plain(value):
    return html.unescape(re.sub('<[^>]+>', '', value)).strip()

def escape(value):
    return html.escape(str(value), quote=True)

def slug(value):
    value = unicodedata.normalize('NFKD', plain(value)).encode('ascii', 'ignore').decode().lower()
    return re.sub('[^a-z0-9]+', '-', value).strip('-')

def sin_ce(value):
    """Quita las etiquetas de criterio (<span class="ce">CE e</span>) de un título."""
    return re.sub(r'<span class="ce[^"]*">.*?</span>', '', value, flags=re.S)

def headings(source):
    return [(match[0], plain(sin_ce(match[1]))) for match in re.findall(r'<h2\b[^>]*\bid="([^"]+)"[^>]*>(.*?)</h2>', source, re.S)]

def identify(source):
    used = set(re.findall(r'\bid="([^"]+)"', source))
    def add(match):
        if re.search(r'\bid=', match[1]):
            return match[0]
        target = 'apartado-' + slug(match[2])
        while target in used:
            target += '-mas'
        used.add(target)
        return '<h2' + match[1] + ' id="' + target + '">' + match[2] + '</h2>'
    return re.sub(r'<h2([^>]*)>(.*?)</h2>', add, source, flags=re.S)

def tema_de(name):
    """Número de tema a partir del nombre del archivo (ut02-teoria.html → 2)."""
    match = re.match(r'ut(\d\d)', name)
    return int(match[1]) if match else None

def seccion_de(source, name):
    """Apartado del tema según la barra .subnav (Teoría, Ejercicios…); vacío en la portada."""
    if re.fullmatch(r'ut\d\d\.html', name):
        return ''
    nav = re.search(r'<nav class="subnav".*?</nav>', source, re.S)
    if nav:
        actual = re.search(r'<a\b[^>]*aria-current="page"[^>]*>(.*?)</a>', nav[0], re.S)
        if actual:
            return plain(actual[1])
        # Subpágina (aria-current="true"): apartado padre con enlace y título corto de la página.
        padre = re.search(r'<a\b[^>]*href="([^"]+)"[^>]*aria-current="true"[^>]*>(.*?)</a>', nav[0], re.S)
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', source, re.S)
        if padre and h1:
            return (padre[1], plain(padre[2]), re.split(r'\s+[—·]\s+', plain(h1[1]))[0])
    return ''

def migas(source, tema):
    """Ruta «Inicio › Tema N › Apartado» al principio del contenido. Se regenera en cada ejecución."""
    source = re.sub(r'<nav class="aula-migas".*?</nav>', '', source, flags=re.S)
    if not tema:
        return source
    partes = ['<a href="../index.html">Inicio</a>']
    titulo = 'Tema %d · %s' % (tema['ut'], escape(tema['titulo']))
    if isinstance(tema.get('seccion'), tuple):
        enlace, padre, pagina = tema['seccion']
        partes.append('<a href="ut%02d.html">%s</a>' % (tema['ut'], titulo))
        partes.append('<a href="' + escape(enlace) + '">' + escape(padre) + '</a>')
        partes.append('<span aria-current="page">' + escape(pagina) + '</span>')
    elif tema.get('seccion'):
        partes.append('<a href="ut%02d.html">%s</a>' % (tema['ut'], titulo))
        partes.append('<span aria-current="page">' + escape(tema['seccion']) + '</span>')
    else:
        partes.append('<span aria-current="page">' + titulo + '</span>')
    nav = '<nav class="aula-migas" aria-label="Estás en">' + '<span aria-hidden="true">›</span>'.join(partes) + '</nav>'
    return source.replace('<main class="envoltura" id="contenido" tabindex="-1">', '<main class="envoltura" id="contenido" tabindex="-1">' + nav, 1)

def barra_superior(code, prefix, current, short_name):
    enlaces = [('Temas', 'index.html'), ('Buscar material', 'recursos.html')] if code == '0221' else [('Temas', 'index.html'), ('Apuntes', 'recursos.html?tipo=apuntes'), ('Ejercicios', 'recursos.html?tipo=ejercicios'), ('Prácticas', 'recursos.html?tipo=practicas'), ('Materiales', 'recursos.html')]
    html_barra = '<header class="aula-barra"><a class="aula-marca" href="' + prefix + 'index.html">' + code + ' / ' + short_name + '</a><nav aria-label="Navegación del módulo">'
    for label, target in enlaces:
        active = ' aria-current="page"' if current == target else ''
        html_barra += '<a href="' + prefix + target + '"' + active + '>' + label + '</a>'
    return html_barra + '</nav></header>'

def shell(source, code, current, short_name, tema=None):
    prefix = '../' if current.startswith('temas/') else ''
    source = identify(source)
    entries = headings(source)
    toc = ''.join('<li><a href="#' + escape(target) + '">' + escape(label) + '</a></li>' for target, label in entries if 'criterio' not in label.lower() and 'resultado de aprendizaje' not in label.lower())
    if current == 'recursos.html' or current.endswith('mapa-cinta.html'):
        toc = '<li><a href="#contenido">Consultar el material</a></li>'
    bloque_tema = ''
    if tema:
        bloque_tema = ('<a class="indice-tema" href="ut%02d.html"><span>Tema %d</span>%s</a>' % (tema['ut'], tema['ut'], escape(tema['titulo'])) +
                       '<a class="indice-material" href="../recursos.html?tema=%d">Todo el material del tema %d</a>' % (tema['ut'], tema['ut']))
    sidebar = '<aside class="aula-indice"><a class="indice-inicio" href="' + prefix + 'index.html">Inicio del módulo</a>' + bloque_tema + '<details open><summary>En esta página</summary><ul>' + toc + '</ul></details></aside>'
    if 'class="aula-layout"' in source:
        if code == '0221' and 'assets/organizacion.css' not in source:
            source = source.replace('</head>', '<link rel="stylesheet" href="' + prefix + 'assets/organizacion.css">\n</head>', 1)
        source = re.sub(r'<aside class="aula-indice">.*?</aside>', lambda match: sidebar, source, count=1, flags=re.S)
        if code == '0221':
            source = re.sub(r'<header class="aula-barra">.*?</header>', lambda match: barra_superior(code, prefix, current, short_name), source, count=1, flags=re.S)
        return migas(source, tema)
    source = source.replace('</head>', '<link rel="stylesheet" href="' + prefix + 'assets/aula.css">\n<script defer src="' + prefix + 'assets/aula.js"></script>\n' + ('<link rel="stylesheet" href="' + prefix + 'assets/organizacion.css">\n' if code == '0221' else '') + '</head>')
    top = '<a class="saltar" href="#contenido">Saltar al contenido</a>' + barra_superior(code, prefix, current, short_name)
    source = source.replace('<body>', '<body data-modulo="' + code + '">\n' + top)
    source = source.replace('<div class="envoltura">', '<div class="aula-layout">' + sidebar + '<main class="envoltura" id="contenido" tabindex="-1">', 1)
    last = source.rfind('\n</div>')
    if last < 0:
        raise ValueError(current)
    source = source[:last] + '\n</main></div>' + source[last + len('\n</div>'):]
    source = re.sub(r'(<header class="cab">.*?</header>)', r'\1\n<div class="aula-herramientas"><button type="button" data-imprimir hidden>Imprimir / guardar PDF</button></div>', source, count=1, flags=re.S)
    source = re.sub(r'<div class="ra-ce">(.*?)</div>', lambda match: '<details class="ra-ce"><summary>Qué se evalúa · RA y criterios</summary>' + match[1] + '</details>', source, flags=re.S)
    source = re.sub(r'(<table\b.*?</table>)', r'<div class="aula-tabla" role="region" aria-label="Tabla de datos; desplazamiento horizontal" tabindex="0">\1</div>', source, flags=re.S)
    return migas(source, tema)


# ---------------------------------------------------------------- organización por secciones (0221)
SECCIONES = [('teoria', 'Teoría', 'Los apuntes del tema.'),
             ('ejercicios', 'Ejercicios', 'Para practicar. No cuentan para la nota salvo que el profesor diga que se entregan.'),
             ('practicas', 'Prácticas', 'Evaluables. Lee el enunciado completo y la rúbrica antes de empezar.'),
             ('examen', 'Preparar el examen', 'Tests y repasos que se corrigen solos. Repítelos tantas veces como quieras.'),
             ('enclase', 'En clase', 'Juegos y competiciones que hacemos en el aula. Los abre el profesor cuando toca.')]

# Dentro de Ejercicios, los elementos con "grupo": "interactivo" van aparte de los boletines.
GRUPOS_EJERCICIOS = [('', 'Boletines'), ('interactivo', 'Simuladores e interactivos')]

def base_url(u):
    return u.split('#')[0]

def paginas_de(lista):
    vistas = []
    for it in lista:
        b = base_url(it['url'])
        if b not in vistas:
            vistas.append(b)
    return vistas

def destino_seccion(ut, clave, secc):
    """Adónde lleva cada sección en la barra del tema."""
    if clave == 'ejercicios':
        return 'ut%02d-ejercicios.html' % ut
    if clave == 'examen':
        return 'ut%02d-examen.html' % ut
    pags = paginas_de(secc.get(clave, []))
    return pags[0] if len(pags) == 1 else 'ut%02d.html#seccion-%s' % (ut, clave)

def seccion_de_pagina(ut, nombre, secc):
    if nombre == 'ut%02d-ejercicios.html' % ut:
        return 'ejercicios'
    if nombre == 'ut%02d-examen.html' % ut:
        return 'examen'
    for clave, _, _ in SECCIONES:
        if nombre in paginas_de(secc.get(clave, [])):
            return clave
    return ''

def pdf_teoria(web, ut):
    ruta = 'descargas/teoria/ut%02d-teoria.pdf' % ut
    return ruta if (web / ruta).is_file() else ''

def tarjetas(lista, prefijo=''):
    return '<ul class="lista-temas">' + ''.join(
        '<li><a href="' + escape(prefijo + it['url']) + '"><span class="ut">' + escape(it['etiqueta']) + '</span>' + escape(it['titulo']) +
        ('<br><span class="etq">' + escape(it['texto']) + '</span>' if it.get('texto') else '') + '</a></li>' for it in lista) + '</ul>'

def tarjetas_seccion(clave, lista, prefijo=''):
    if clave != 'ejercicios' or not any(it.get('grupo') for it in lista):
        return tarjetas(lista, prefijo)
    html = ''
    for grupo, titulo in GRUPOS_EJERCICIOS:
        parte = [it for it in lista if it.get('grupo', '') == grupo]
        if parte:
            html += '<h3 class="aula-grupo grupo-' + (grupo or 'boletines') + '">' + titulo + '</h3>' + tarjetas(parte, prefijo)
    return html

def rellenar(source, marca, contenido):
    return re.sub(r'<!-- aula:' + marca + r' -->.*?<!-- /aula:' + marca + r' -->',
                  lambda m: '<!-- aula:' + marca + ' -->\n' + contenido + '\n  <!-- /aula:' + marca + ' -->', source, count=1, flags=re.S)

def organizar(source, nombre, ut, titulo, secc, web, ids_boletines):
    actual = seccion_de_pagina(ut, nombre, secc)
    portada = nombre == 'ut%02d.html' % ut
    # barra del tema
    nav = '<nav class="subnav" aria-label="Apartados del tema %d">\n    <a href="ut%02d.html" class="inicio-tema"%s>Portada del tema</a>' % (ut, ut, ' aria-current="page"' if portada else '')
    for clave, etiqueta, _ in SECCIONES:
        if not secc.get(clave):
            continue
        destino = destino_seccion(ut, clave, secc)
        marca = ''
        if clave == actual:
            marca = ' aria-current="page"' if base_url(destino) == nombre else ' aria-current="true"'
        nav += '\n    <a href="' + destino + '" class="sec-' + clave + '"' + marca + '>' + etiqueta + '</a>'
    nav += '\n  </nav>'
    source = re.sub(r'<nav class="subnav".*?</nav>', lambda m: nav, source, count=1, flags=re.S)
    # portada del tema: las cuatro secciones
    if portada:
        html_s = '  <div class="aula-secciones">'
        for clave, etiqueta, ayuda in SECCIONES:
            lista = secc.get(clave)
            if not lista:
                continue
            html_s += '\n  <section class="aula-seccion sec-' + clave + '" aria-labelledby="seccion-' + clave + '"><h2 id="seccion-' + clave + '">' + etiqueta + '</h2><p class="meta">' + ayuda + '</p>' + tarjetas_seccion(clave, lista)
            if clave == 'teoria' and pdf_teoria(web, ut):
                html_s += '<p class="aula-descarga"><a href="../' + pdf_teoria(web, ut) + '" download>Descargar toda la teoría del tema en PDF</a> <span class="meta">para leerla sin conexión o imprimirla</span></p>'
            if clave == 'ejercicios':
                html_s += '<p class="aula-mas"><a href="ut%02d-ejercicios.html">Cómo trabajar los ejercicios del tema</a></p>' % ut
            html_s += '</section>'
        source = rellenar(source, 'secciones', html_s + '\n  </div>')
    # índices de ejercicios y de examen
    if nombre in ('ut%02d-ejercicios.html' % ut, 'ut%02d-examen.html' % ut):
        clave = 'ejercicios' if 'ejercicios' in nombre else 'examen'
        contenido = '  ' + tarjetas_seccion(clave, secc.get(clave, []))
        if clave == 'ejercicios' and ids_boletines:
            contenido += ('\n  <script>/* Enlaces antiguos (ejercicios.html#ancla) a la página nueva de cada boletín */\n  (function () { var m = ' +
                          json.dumps(ids_boletines, ensure_ascii=False, sort_keys=True) +
                          '; var h = decodeURIComponent(location.hash.slice(1)); if (h && m[h]) location.replace(m[h] + "#" + h); })();</script>')
        source = rellenar(source, 'indice', contenido)
    # botón de la teoría en PDF
    if actual == 'teoria' and pdf_teoria(web, ut) and nombre.startswith('ut%02d-teoria' % ut):
        herr = '<div class="aula-herramientas"><a class="aula-pdf" href="../' + pdf_teoria(web, ut) + '" download>Descargar la teoría en PDF</a><button type="button" data-imprimir hidden>Imprimir / guardar PDF</button></div>'
        source = re.sub(r'<div class="aula-herramientas">.*?</div>', lambda m: herr, source, count=1, flags=re.S)
    # anterior / siguiente: recorrido lineal del tema
    orden = [('ut%02d.html' % ut, 'Portada del tema')]
    for clave, etiqueta, _ in SECCIONES:
        lista = secc.get(clave, [])
        if not lista:
            continue
        if clave in ('ejercicios', 'examen'):
            orden.append(('ut%02d-%s.html' % (ut, clave), etiqueta))
        for it in lista:
            b = base_url(it['url'])
            if b not in [o[0] for o in orden] and (web / 'temas' / b).is_file():
                orden.append((b, it['etiqueta'] if it['etiqueta'].startswith(('Boletín', 'Teoría', 'P')) and len(it['etiqueta']) < 12 else it['titulo']))
    nombres = [o[0] for o in orden]
    if nombre in nombres:
        i = nombres.index(nombre)
        ant = '<a href="%s">&laquo; %s</a>' % (orden[i - 1][0], escape(orden[i - 1][1])) if i > 0 else '<span></span>'
        sig = '<a href="%s">%s &raquo;</a>' % (orden[i + 1][0], escape(orden[i + 1][1])) if i + 1 < len(orden) else '<span></span>'
        navt = '<nav class="nav-temas" aria-label="Página anterior y siguiente del tema">\n    ' + ant + '\n    ' + sig + '\n  </nav>'
        if '<nav class="nav-temas"' in source:
            source = re.sub(r'<nav class="nav-temas".*?</nav>', lambda m: navt, source, count=1, flags=re.S)
        else:
            source = source.replace('  <footer class="pie">', '  ' + navt + '\n\n  <footer class="pie">', 1)
    return source

def ids_de_boletines(web, ut):
    mapa = {}
    for f in sorted((web / 'temas').glob('ut%02d-boletin-*.html' % ut)) + sorted((web / 'temas').glob('ut%02d-ejercicios-resueltos.html' % ut)):
        s = f.read_text(encoding='utf-8')
        cuerpo = s[s.find('<nav class="subnav"'):]
        for ident in re.findall(r'\bid="([^"]+)"', cuerpo):
            if not ident.startswith(('contenido',)):
                mapa.setdefault(ident, f.name)
    return mapa

def document(title, content):
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' + escape(title) + '</title>\n<link rel="stylesheet" href="assets/estilo.css">\n</head>\n<body>\n<div class="envoltura">\n' + content + '\n<footer class="pie"><p>IES Valle del Jerte · CFGM Sistemas Microinformáticos y Redes · Curso 2026/2027</p></footer>\n</div>\n</body>\n</html>\n'

for repo in REPOS:
    web = ROOT / repo / 'web'
    data = json.loads((web / 'datos/temas.json').read_text(encoding='utf-8'))
    code = data['modulo']
    short_name = 'Montaje y mantenimiento' if code == '0221' else 'Aplicaciones ofimáticas'
    pages = {}
    titulos = {topic['ut']: topic['titulo'] for topic in data['temas']}
    secciones_por_tema = {topic['ut']: topic['secciones'] for topic in data['temas'] if topic.get('secciones')}
    for path in sorted((web / 'temas').glob('*.html')):
        source = path.read_text(encoding='utf-8')
        if code == '0223' and path.name.startswith('ut02') and 'class="subnav"' not in source:
            nav = '<nav class="subnav" aria-label="Apartados del tema 2">'
            for label, target in [('Portada del tema', 'ut02.html'), ('Apuntes', 'ut02.html#apartado-subtemas'), ('Ejercicios guiados', 'ut02-ejercicios.html'), ('Prácticas de control', 'ut02-practicas.html'), ('Mapa de Word', 'mapa-cinta.html')]:
                active = ' aria-current="page"' if target == path.name else ''
                nav += '<a href="' + target + '"' + active + '>' + label + '</a>'
            nav += '</nav>'
            source = re.sub(r'(<header class="cab">.*?</header>)', lambda match: match[1] + '\n' + nav, source, count=1, flags=re.S)
        numero = tema_de(path.name)
        secc_tema = secciones_por_tema.get(numero)
        if code == '0221' and secc_tema:
            source = organizar(source, path.name, numero, titulos[numero], secc_tema, web, ids_de_boletines(web, numero))
        tema = {'ut': numero, 'titulo': titulos[numero], 'seccion': seccion_de(source, path.name)} if numero in titulos else None
        source = shell(source, code, 'temas/' + path.name, short_name, tema)
        path.write_text(source, encoding='utf-8')
        pages[path.name] = source
    cards = []
    downloads = {}
    orden_tipos = ['apuntes', 'ejercicios', 'practicas', 'examen', 'consulta', 'descargas']
    def card(category, title, url, description, terms='', shortcuts='', ut=None):
        labels = {'apuntes': 'Apuntes', 'ejercicios': 'Ejercicios guiados / repaso', 'practicas': 'Prácticas evaluables', 'examen': 'Preparar el examen', 'consulta': 'Consulta', 'descargas': 'Descarga'}
        etiqueta_tema = ''
        if ut is not None:
            etiqueta_tema = '<span class="aula-tema">Tema ' + str(ut) + '</span><span class="aula-tema-titulo">' + escape(titulos.get(ut, '')) + '</span>'
            terms = 'tema ' + str(ut) + ' ' + titulos.get(ut, '') + ' ' + terms
        html_card = ('<li data-material="' + category + '" data-tema="' + ('' if ut is None else str(ut)) + '" data-busqueda="' + escape(terms) + '">' +
                     '<div class="aula-etiquetas">' + etiqueta_tema + '<span class="aula-tipo">' + labels[category] + '</span></div>' +
                     '<h2><a href="' + escape(url) + '">' + escape(title) + '</a></h2><p>' + escape(description) + '</p>' + shortcuts + '</li>')
        return ((ut if ut is not None else 99), orden_tipos.index(category), html_card)
    for name, source in pages.items():
        title = plain(re.search(r'<h1[^>]*>(.*?)</h1>', source, re.S)[1])
        section_list = headings(source)
        category = 'apuntes'
        nt = tema_de(name)
        if code == '0221' and nt in secciones_por_tema:
            if name in ('ut%02d-ejercicios.html' % nt, 'ut%02d-examen.html' % nt):
                continue  # índices: se llega desde la portada del tema
            clave = seccion_de_pagina(nt, name, secciones_por_tema[nt])
            category = {'teoria': 'apuntes', 'ejercicios': 'ejercicios', 'practicas': 'practicas', 'examen': 'examen'}.get(clave, 'apuntes')
        elif 'ejercicios' in name:
            category = 'ejercicios'
        elif 'practicas' in name and not (code == '0221' and nt in secciones_por_tema):
            category = 'practicas'
        if 'mapa-' in name or name == 'ut00.html':
            category = 'consulta'
        if re.fullmatch(r'ut(0[1-9]|[1-9][0-9])\.html', name) if code == '0221' else name == 'ut02.html':
            # Las portadas de tema se enlazan desde el inicio; no son material del catálogo.
            continue
        filtered = [(target, label) for target, label in section_list if not any(word in label.lower() for word in ['criterio', 'resultado de aprendizaje', 'pendiente', 'próximos', 'en esta página'])]
        shortcuts = '<div class="aula-atajos">' + ''.join('<a href="temas/' + name + '#' + target + '">' + escape(label) + '</a>' for target, label in filtered[:5]) + '</div>'
        description = 'Material de consulta para seguir las sesiones.'
        if category == 'ejercicios':
            description = 'Practica y comprueba lo aprendido. Actividades formativas; no cuentan para la nota.'
        if category == 'practicas':
            description = 'Consulta el enunciado, las condiciones de entrega y la rúbrica.'
        if category == 'examen':
            description = 'Tests y repasos para preparar el examen. Se corrigen solos.'
        search_terms = ' '.join(plain(sin_ce(text)) for text in re.findall(r'<h[23][^>]*>(.*?)</h[23]>', source, re.S))
        cards.append(card(category, title, 'temas/' + name, description, search_terms, shortcuts, tema_de(name)))
        if category == 'apuntes':
            for target, label in section_list:
                if 'prácticas del' in label.lower():
                    cards.append(card('practicas', title + ' · Prácticas del apartado', 'temas/' + name + '#' + target, 'Actividades incluidas en los apuntes. Consulta allí sus requisitos y criterios.', '', '', tema_de(name)))
        for target, label in re.findall(r'<a\b[^>]*href="([^"]+\.(?:docx|dotx|xlsx|pptx|odt|pdf|zip|png|jpg|svg))"[^>]*>(.*?)</a>', source, re.S):
            if target.startswith('../'):
                destination = target[3:]
                # Los esquemas SVG se consultan dentro de su ejercicio; listarlos sueltos llenaba el catálogo.
                if Path(destination).suffix == '.svg':
                    continue
                if (web / destination).is_file():
                    if Path(destination).suffix == '.svg':
                        svg = (web / destination).read_text(encoding='utf-8')
                        svg_title = re.search(r'<title\b[^>]*>(.*?)</title>', svg, re.S)
                        if svg_title:
                            label = svg_title[1]
                    downloads[destination] = (plain(label) or Path(destination).name, name)
    for target, (label, origin) in downloads.items():
        cards.append(card('descargas', label, target, 'Archivo ' + Path(target).suffix[1:].upper() + ' · ' + Path(target).name, '', '<p><a href="temas/' + origin + '">Ver el enunciado que utiliza este archivo</a></p>', tema_de(origin)))
    cards = [html_card for _, _, html_card in sorted(cards, key=lambda c: (c[0], c[1]))]
    filters = ''.join('<button type="button" data-filtro="' + value + '" aria-pressed="' + ('true' if value == 'todos' else 'false') + '">' + label + '</button>' for value, label in [('todos','Todos'), ('apuntes','Apuntes'), ('ejercicios','Ejercicios'), ('practicas','Prácticas')] + ([('examen','Preparar el examen')] if code == '0221' else []) + [('consulta','Consulta'), ('descargas','Descargas')])
    temas_catalogo = sorted({tema_de(name) for name in pages if tema_de(name) is not None and tema_de(name) in titulos})
    filtros_tema = ''.join('<button type="button" data-filtro-tema="' + value + '" aria-pressed="' + ('true' if value == 'todos' else 'false') + '"' + (' title="' + escape(titulos[int(value)]) + '"' if value != 'todos' else '') + '>' + label + '</button>' for value, label in [('todos', 'Todos los temas')] + [(str(n), 'Tema ' + str(n)) for n in temas_catalogo])
    catalogue = '<header class="cab"><p class="modulo">' + code + ' · ' + short_name + '</p><h1>Encuentra tu material</h1><p class="meta">Apuntes, ejercicios, prácticas y archivos de trabajo de todos los temas, en un solo lugar.</p></header><div class="aula-busqueda" hidden><label for="buscar-material">Buscar por título o apartado</label><input id="buscar-material" type="search" placeholder="Por ejemplo: estilos, tabla, circuito…"><p class="aula-filtros-titulo">Tema</p><div class="aula-filtros" aria-label="Filtrar por tema">' + filtros_tema + '</div><p class="aula-filtros-titulo">Tipo de material</p><div class="aula-filtros" aria-label="Filtrar por tipo">' + filters + '<button type="button" data-limpiar>Limpiar búsqueda</button></div><p id="estado-busqueda" role="status" aria-live="polite"></p></div><noscript><p>Todos los materiales están disponibles en la lista. Activa JavaScript para usar los filtros.</p></noscript><ul class="aula-catalogo">' + '\n'.join(cards) + '</ul>'
    (web / 'recursos.html').write_text(shell(document('Materiales · ' + short_name, catalogue), code, 'recursos.html', short_name), encoding='utf-8')
    home = '<header class="cab"><p class="modulo">IES Valle del Jerte · CFGM SMR · ' + code + '</p><h1>' + escape(data['titulo']) + '</h1><p class="meta">' + ('2.º curso · 6 h/semana' if code == '0221' else '1.º curso · 7 h/semana') + ' · Curso 2026/2027</p></header><p>Tu aula de consulta: estudia el tema, practica con los ejercicios y prepara las entregas que indique el profesor.</p>'
    if data.get('destacados'):
        home += '<section class="aula-ahora" aria-labelledby="ahora-titulo"><h2 id="ahora-titulo">Ahora en clase</h2><ul>'
        for item in data['destacados']:
            etiqueta = ('Tema ' + str(item['ut']) + ' · ' if 'ut' in item else '') + item['etiqueta']
            home += '<li><a href="' + escape(item['url']) + '"><span class="aula-tipo">' + escape(etiqueta) + '</span><strong>' + escape(item['titulo']) + '</strong><span>' + escape(item['texto']) + '</span></a></li>'
        home += '</ul></section>'
    home += '<nav class="ruta-estudio" aria-label="Qué necesitas hacer">'
    for label, target, description in [('Estudiar', 'apuntes', 'Apuntes y explicaciones por tema'), ('Practicar', 'ejercicios', 'Ejercicios para aprender y repasar'), ('Preparar una entrega', 'practicas', 'Enunciados, requisitos y rúbricas')]:
        home += '<a href="recursos.html?tipo=' + target + '"><strong>' + label + '</strong><span>' + description + '</span></a>'
    home += '</nav><p><a href="recursos.html">Buscar un material o descargar un archivo</a></p><h2>Recorrido del módulo</h2><p>Sigue el orden de los temas y las indicaciones del profesor. Los próximos contenidos se añadirán aquí.</p><ul class="lista-temas">'
    for topic in data['temas']:
        available = (web / ('temas/ut%02d.html' % topic['ut'])).exists()
        if not available:
            continue
        label = 'Diagnóstico inicial · no cuenta para la nota' if topic['ut'] == 0 else str(topic['horas']) + ' h · ' + topic['ra']
        if topic.get('estado') == 'en progreso':
            available_blocks = [str(block['ut']) for block in topic.get('subtemas', []) if block.get('estado') == 'publicado']
            label += ' · En desarrollo'
            if available_blocks:
                label += ' · Disponibles: ' + ', '.join(available_blocks)
        home += '<li><a href="temas/ut%02d.html"><span class="ut">Tema %s</span>%s<br><span class="etq">%s</span></a></li>' % (topic['ut'], topic['ut'], escape(topic['titulo']), escape(label))
    home += '</ul><h2>Antes de entregar</h2><p>Los ejercicios sirven para entrenar. En las prácticas, lee el enunciado completo, revisa los archivos que se piden y comprueba la rúbrica antes de entregar por el medio indicado en clase.</p>'
    if code == '0223':
        home += '<div class="tarjeta"><strong>¿No encuentras una opción de Word?</strong><p><a href="temas/mapa-cinta.html">Consulta el mapa de la cinta</a>: pestañas, grupos y atajos.</p></div>'
    else:
        home += '<div class="aviso"><strong>Antes de trabajar en el taller</strong><p>Revisa <a href="temas/ut01-prl.html">Seguridad y PRL</a> y sigue las instrucciones del profesor.</p></div>'
    if code == '0221':
        home = ('<header class="cab"><p class="modulo">IES Valle del Jerte · CFGM SMR · ' + code + '</p><h1>' + escape(data['titulo']) + '</h1><p class="meta">2.º curso · 6 h/semana · Curso 2026/2027</p></header>'
                '<p>Elige un tema. En cada uno encontrarás la teoría, los ejercicios, las prácticas, lo necesario para preparar el examen y los juegos que hacemos en clase.</p><ul class="aula-portada-temas">')
        for topic in data['temas']:
            if not (web / ('temas/ut%02d.html' % topic['ut'])).exists():
                continue
            n = topic['ut']
            detalle = 'Presentación del módulo y evaluación inicial · no cuenta para la nota' if n == 0 else str(topic['horas']) + ' h · ' + topic['ra'] + ' · ' + str(topic.get('evaluacion', '')) + '.ª evaluación'
            home += '<li class="tarjeta-tema"><a class="tema-principal" href="temas/ut%02d.html"><span class="tema-num">Tema %d</span><strong>%s</strong><span class="etq">%s</span></a>' % (n, n, escape(topic['titulo']), escape(detalle))
            secc = topic.get('secciones')
            if secc:
                home += '<nav class="tema-accesos" aria-label="Secciones del tema %d">' % n
                for clave, etiqueta, _ in SECCIONES:
                    if secc.get(clave):
                        home += '<a class="sec-' + clave + '" href="temas/' + destino_seccion(n, clave, secc) + '">' + etiqueta + '</a>'
                if pdf_teoria(web, n):
                    home += '<a class="sec-pdf" href="' + pdf_teoria(web, n) + '" download>Teoría en PDF</a>'
                home += '</nav>'
            home += '</li>'
        home += '</ul><p class="aula-buscar-portada"><a href="recursos.html">¿Buscas algo concreto? Busca en todo el material</a></p>'
    (web / 'index.html').write_text(shell(document(short_name, home), code, 'index.html', short_name), encoding='utf-8')
    print(repo, len(pages), 'páginas de contenido; catálogo:', len(cards), 'materiales')
