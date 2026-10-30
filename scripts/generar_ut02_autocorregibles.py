"""Ejercicios autocorregibles del tema 2: circuitos con valores y ejecución de programas.

Uso:  python scripts/generar_ut02_autocorregibles.py

Solo biblioteca estándar (Node.js opcional, para contrastar con la web).

Circuitos (bloque 5):
  - se dibujan con las mismas funciones que scripts/generar_circuitos_logicos.py y pasan su
    misma verificación: cables ortogonales, redes conexas que tocan exactamente sus patillas,
    cruces solo en perpendicular y red de puertas reconstruida A PARTIR DEL DIBUJO,
  - cada puerta lleva su número en un círculo y cada entrada un hueco para su valor; el script
    comprueba que ni los números ni los valores pisan un cable,
  - la tabla de verdad se contrasta con la expresión escrita a mano.
Programas (bloque 6):
  - se ejecutan con el modelo de scripts/generar_trazas_cpu.py (la misma máquina que el
    simulador) y se comprueba el resultado escrito a mano.
Contraste con la web: si hay Node, carga web/assets/ut02-practica.js y comprueba que calcula
lo mismo (todas las combinaciones de entradas de cada circuito y todas las filas de cada traza).

Escribe:
  - web/assets/img/logica/valores-N.svg (esquemas descargables),
  - web/assets/ut02-practica-datos.js (datos que usan los ejercicios de la web),
  - temario/soluciones/ut02-autocorregibles-solucionario.md (no se publica en la web).
"""
from pathlib import Path
from itertools import product
import json
import shutil
import subprocess
import sys
sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import generar_circuitos_logicos as gl  # noqa: E402
import generar_trazas_cpu as gt  # noqa: E402

DATOS = ROOT / 'web/assets/ut02-practica-datos.js'
SOLUCIONARIO = ROOT / 'temario/soluciones/ut02-autocorregibles-solucionario.md'
JS = ROOT / 'web/assets/ut02-practica.js'

# ---------------------------------------------------------------------------
# Circuitos. Mismo formato que generar_circuitos_logicos.py, más:
#   nivel:   1 a 4
#   valores: valores de partida de las entradas (la web permite cambiarlos)
# ---------------------------------------------------------------------------
CIRCUITOS = [
    {
        'n': 'v1', 'ancho': 300, 'alto': 130, 'nivel': 1,
        'titulo': 'Circuito 5.1',
        'entradas': {'A': 40, 'B': 100},
        'puertas': {
            'G1': ('AND', 120, 60, ['A', 'B']),
            'G2': ('NOT', 200, 60, ['G1']),
        },
        'cables': {
            'A': [[(30, 40), (90, 40), (90, 50), (120, 50)]],
            'B': [[(30, 100), (100, 100), (100, 70), (120, 70)]],
            'G1': [[(170, 60), (200, 60)]],
            'G2': [[(240, 60), (270, 60)]],
        },
        'salida': 'G2',
        'expresion': "F = (A·B)'  (equivale a una NAND)",
        'esperada': lambda a, b, c: 1 - (a & b),
        'valores': {'A': 1, 'B': 1},
    },
    {
        'n': 'v2', 'ancho': 340, 'alto': 160, 'nivel': 1,
        'titulo': 'Circuito 5.2',
        'entradas': {'A': 40, 'B': 110},
        'puertas': {
            'G1': ('OR', 130, 50, ['A', 'B']),
            'G2': ('NOT', 130, 130, ['B']),
            'G3': ('AND', 240, 90, ['G1', 'G2']),
        },
        'cables': {
            'A': [[(30, 40), (130, 40)]],
            'B': [[(30, 110), (100, 110)], [(100, 60), (100, 130)], [(100, 60), (130, 60)], [(100, 130), (130, 130)]],
            'G1': [[(180, 50), (210, 50), (210, 80), (240, 80)]],
            'G2': [[(170, 130), (220, 130), (220, 100), (240, 100)]],
            'G3': [[(290, 90), (320, 90)]],
        },
        'salida': 'G3',
        'expresion': "F = (A + B)·B' = A·B'",
        'esperada': lambda a, b, c: a & (1 - b),
        'valores': {'A': 1, 'B': 0},
    },
    {
        'n': 'v3', 'ancho': 350, 'alto': 170, 'nivel': 2,
        'titulo': 'Circuito 5.3',
        'entradas': {'A': 40, 'B': 90, 'C': 140},
        'puertas': {
            'G1': ('AND', 140, 50, ['A', 'B']),
            'G2': ('NOT', 140, 140, ['C']),
            'G3': ('OR', 250, 95, ['G1', 'G2']),
        },
        'cables': {
            'A': [[(30, 40), (140, 40)]],
            'B': [[(30, 90), (110, 90), (110, 60), (140, 60)]],
            'C': [[(30, 140), (140, 140)]],
            'G1': [[(190, 50), (220, 50), (220, 85), (250, 85)]],
            'G2': [[(180, 140), (230, 140), (230, 105), (250, 105)]],
            'G3': [[(300, 95), (330, 95)]],
        },
        'salida': 'G3',
        'expresion': "F = A·B + C'",
        'esperada': lambda a, b, c: (a & b) | (1 - c),
        'valores': {'A': 0, 'B': 1, 'C': 1},
    },
    {
        'n': 'v4', 'ancho': 410, 'alto': 210, 'nivel': 2,
        'titulo': 'Circuito 5.4',
        'entradas': {'A': 40, 'B': 110, 'C': 180},
        'puertas': {
            'G1': ('NOT', 90, 80, ['B']),
            'G2': ('OR', 200, 50, ['A', 'G1']),
            'G3': ('OR', 200, 160, ['B', 'C']),
            'G4': ('AND', 310, 105, ['G2', 'G3']),
        },
        'cables': {
            'A': [[(30, 40), (200, 40)]],
            'B': [[(30, 110), (70, 110)], [(70, 80), (70, 150)], [(70, 80), (90, 80)], [(70, 150), (200, 150)]],
            'C': [[(30, 180), (170, 180), (170, 170), (200, 170)]],
            'G1': [[(130, 80), (170, 80), (170, 60), (200, 60)]],
            'G2': [[(250, 50), (280, 50), (280, 95), (310, 95)]],
            'G3': [[(250, 160), (290, 160), (290, 115), (310, 115)]],
            'G4': [[(360, 105), (390, 105)]],
        },
        'salida': 'G4',
        'expresion': "F = (A + B')·(B + C)",
        'esperada': lambda a, b, c: (a | (1 - b)) & (b | c),
        'valores': {'A': 0, 'B': 0, 'C': 1},
    },
    {
        'n': 'v5', 'ancho': 370, 'alto': 180, 'nivel': 3,
        'titulo': 'Circuito 5.5',
        'entradas': {'A': 40, 'B': 90, 'C': 150},
        'puertas': {
            'G1': ('NAND', 140, 60, ['A', 'B']),
            'G2': ('NOR', 260, 90, ['G1', 'C']),
        },
        'cables': {
            'A': [[(30, 40), (110, 40), (110, 50), (140, 50)]],
            'B': [[(30, 90), (120, 90), (120, 70), (140, 70)]],
            'C': [[(30, 150), (230, 150), (230, 100), (260, 100)]],
            'G1': [[(198, 60), (220, 60), (220, 80), (260, 80)]],
            'G2': [[(318, 90), (350, 90)]],
        },
        'salida': 'G2',
        'expresion': "F = ((A·B)' + C)' = A·B·C'",
        'esperada': lambda a, b, c: a & b & (1 - c),
        'valores': {'A': 1, 'B': 1, 'C': 0},
    },
    {
        'n': 'v6', 'ancho': 380, 'alto': 180, 'nivel': 3,
        'titulo': 'Circuito 5.6',
        'entradas': {'A': 40, 'B': 100, 'C': 150},
        'puertas': {
            'G1': ('XOR', 150, 50, ['A', 'B']),
            'G2': ('OR', 150, 140, ['B', 'C']),
            'G3': ('NAND', 270, 95, ['G1', 'G2']),
        },
        'cables': {
            'A': [[(30, 40), (150, 40)]],
            'B': [[(30, 100), (110, 100)], [(110, 60), (110, 130)], [(110, 60), (150, 60)], [(110, 130), (150, 130)]],
            'C': [[(30, 150), (150, 150)]],
            'G1': [[(200, 50), (230, 50), (230, 85), (270, 85)]],
            'G2': [[(200, 140), (240, 140), (240, 105), (270, 105)]],
            'G3': [[(328, 95), (360, 95)]],
        },
        'salida': 'G3',
        'expresion': "F = ((A ⊕ B)·(B + C))'",
        'esperada': lambda a, b, c: 1 - ((a ^ b) & (b | c)),
        'valores': {'A': 0, 'B': 1, 'C': 0},
    },
    {
        'n': 'v7', 'ancho': 510, 'alto': 190, 'nivel': 4,
        'titulo': 'Circuito 5.7',
        'entradas': {'A': 40, 'B': 100, 'C': 160},
        'puertas': {
            'G1': ('AND', 220, 50, ['A', 'C']),
            'G2': ('NOT', 130, 100, ['B']),
            'G3': ('XOR', 220, 150, ['B', 'C']),
            'G4': ('OR', 310, 80, ['G1', 'G2']),
            'G5': ('AND', 410, 115, ['G4', 'G3']),
        },
        'cables': {
            'A': [[(30, 40), (220, 40)]],
            'B': [[(30, 100), (130, 100)], [(110, 100), (110, 140), (220, 140)]],
            'C': [[(30, 160), (90, 160)], [(90, 160), (90, 60), (220, 60)], [(90, 160), (220, 160)]],
            'G1': [[(270, 50), (290, 50), (290, 70), (310, 70)]],
            'G2': [[(170, 100), (295, 100), (295, 90), (310, 90)]],
            'G3': [[(270, 150), (395, 150), (395, 125), (410, 125)]],
            'G4': [[(360, 80), (385, 80), (385, 105), (410, 105)]],
            'G5': [[(460, 115), (490, 115)]],
        },
        'salida': 'G5',
        'expresion': "F = (A·C + B')·(B ⊕ C)",
        'esperada': lambda a, b, c: ((a & c) | (1 - b)) & (b ^ c),
        'valores': {'A': 1, 'B': 0, 'C': 1},
    },
    {
        'n': 'v8', 'ancho': 470, 'alto': 190, 'nivel': 4,
        'titulo': 'Circuito 5.8',
        'entradas': {'A': 40, 'B': 160},
        'puertas': {
            'G1': ('NAND', 130, 100, ['A', 'B']),
            'G2': ('NAND', 250, 50, ['A', 'G1']),
            'G3': ('NAND', 250, 150, ['G1', 'B']),
            'G4': ('NAND', 360, 100, ['G2', 'G3']),
        },
        'cables': {
            'A': [[(30, 40), (250, 40)], [(80, 40), (80, 90), (130, 90)]],
            'B': [[(30, 160), (250, 160)], [(100, 160), (100, 110), (130, 110)]],
            'G1': [[(188, 100), (210, 100)], [(210, 60), (210, 140)], [(210, 60), (250, 60)], [(210, 140), (250, 140)]],
            'G2': [[(308, 50), (330, 50), (330, 90), (360, 90)]],
            'G3': [[(308, 150), (335, 150), (335, 110), (360, 110)]],
            'G4': [[(418, 100), (450, 100)]],
        },
        'salida': 'G4',
        'expresion': 'F = A ⊕ B  (una XOR hecha solo con NAND)',
        'esperada': lambda a, b, c: a ^ b,
        'valores': {'A': 1, 'B': 0},
    },
]

# ---------------------------------------------------------------------------
# Programas. Juego de instrucciones del boletín: 1 cargar, 2 almacenar, 3 sumar,
# 4 restar, 5 multiplicar, 6 dividir. 0000 = fin.
#   esperado: (AC final, {celda: valor final}) escrito a mano
# ---------------------------------------------------------------------------
PROGRAMAS = [
    {'n': 1, 'titulo': 'Programa 6.1', 'nivel': 1, 'inicio': 200,
     'memoria': {200: 1210, 201: 3211, 202: 2212, 210: 8, 211: 5},
     'esperado': (13, {212: 13})},
    {'n': 2, 'titulo': 'Programa 6.2', 'nivel': 1, 'inicio': 300,
     'memoria': {300: 1320, 301: 4321, 302: 5322, 303: 2323, 320: 20, 321: 6, 322: 3},
     'esperado': (42, {323: 42})},
    {'n': 3, 'titulo': 'Programa 6.3', 'nivel': 2, 'inicio': 150,
     'memoria': {150: 1170, 151: 3171, 152: 3172, 153: 6173, 154: 2174, 170: 7, 171: 8, 172: 9, 173: 3},
     'esperado': (8, {174: 8})},
    {'n': 4, 'titulo': 'Programa 6.4', 'nivel': 2, 'inicio': 400,
     'memoria': {400: 1450, 401: 6451, 402: 2452, 403: 5451, 404: 2453, 450: 17, 451: 5},
     'esperado': (15, {452: 3, 453: 15})},
    {'n': 5, 'titulo': 'Programa 6.5', 'nivel': 3, 'inicio': 120,
     'memoria': {120: 1140, 121: 3140, 122: 2140, 123: 3140, 124: 2141, 140: 6},
     'esperado': (24, {140: 12, 141: 24})},
    {'n': 6, 'titulo': 'Programa 6.6', 'nivel': 3, 'inicio': 500,
     'memoria': {500: 1520, 501: 4521, 502: 2522, 503: 4521, 504: 3520, 505: 2523, 520: 4, 521: 10},
     'esperado': (-12, {522: -6, 523: -12})},
]

ESTILO_EXTRA = ('<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}'
                '.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}'
                '.valor{font:bold 15px sans-serif;fill:#b4232c}</style>')


def caja_toca_cables(caja, all_segs):
    x1, y1, x2, y2 = caja
    for segs in all_segs.values():
        for (p, q) in segs:
            lo_x, hi_x = sorted((p[0], q[0]))
            lo_y, hi_y = sorted((p[1], q[1]))
            if hi_x < x1 or lo_x > x2 or hi_y < y1 or lo_y > y2:
                continue
            return True
    return False


def caja_toca_puertas(caja, c, salvo=None):
    x1, y1, x2, y2 = caja
    for gid, (kind, x, y, _) in c['puertas'].items():
        if gid == salvo:
            continue
        a1, b1, a2, b2 = gl.gate_box(kind, x, y)
        if not (a2 < x1 or a1 > x2 or b2 < y1 or b1 > y2):
            return True
    return False


def extras(c, all_segs):
    """Números de puerta y huecos de valor, sin pisar cables ni otras puertas."""
    partes = []
    for i, (gid, (kind, x, y, _)) in enumerate(c['puertas'].items(), 1):
        x1, y1, x2, y2 = gl.gate_box(kind, x, y)
        cx = (x1 + x2) // 2 - (4 if kind == 'NOT' else 0)
        for cy in (y1 - 13, y2 + 13):
            caja = (cx - 10, cy - 10, cx + 10, cy + 10)
            if not caja_toca_cables(caja, all_segs) and not caja_toca_puertas(caja, c):
                break
        else:
            raise AssertionError((c['n'], 'no hay sitio para el número de', gid))
        partes.append(f'<g class="puerta-num" data-g="{gid}"><circle cx="{cx}" cy="{cy}" r="9"/>'
                      f'<text x="{cx}" y="{cy + 4}" text-anchor="middle">{i}</text></g>')
    for nombre, y in c['entradas'].items():
        caja = (36, y - 19, 52, y - 4)
        assert not caja_toca_cables(caja, all_segs) and not caja_toca_puertas(caja, c), (c['n'], 'valor de', nombre)
        partes.append(f'<text class="valor" data-in="{nombre}" x="38" y="{y - 6}"></text>')
    return partes


def circuito(c):
    junctions, crossings, all_segs = gl.verify_and_extract(c)
    svg = gl.draw(c, junctions, crossings, all_segs)
    svg = svg.replace('</style>\n', '</style>\n' + ESTILO_EXTRA + '\n', 1)
    svg = svg.replace('\n</svg>', '\n' + '\n'.join(extras(c, all_segs)) + '\n</svg>')
    nombres = list(c['entradas'])
    tabla = []
    for vals in product((0, 1), repeat=len(nombres)):
        asig = dict(zip(nombres, vals))
        f = gl.evaluate(c, asig)
        assert f == c['esperada'](asig.get('A', 0), asig.get('B', 0), asig.get('C', 0)), (c['n'], asig, f)
        tabla.append((asig, senales(c, asig)))
    return svg, tabla


def svg_web(svg, n):
    """Versión para incrustar en la página: ids propios (varias figuras en la misma página)."""
    svg = svg.replace('aria-labelledby="title desc"', f'aria-labelledby="t-{n} d-{n}"')
    return svg.replace('id="title"', f'id="t-{n}"').replace('id="desc"', f'id="d-{n}"')


def senales(c, asig):
    s = dict(asig)
    for gid, (kind, _, _, ins) in c['puertas'].items():  # están declaradas en orden de cálculo
        s[gid] = gl.FUNCIONES[kind]([s[x] for x in ins])
    return {g: s[g] for g in c['puertas']}


def traza(p):
    """Filas al terminar cada instrucción, como la traza del simulador: dir, CP, RI, RD, RM, AC."""
    mem = dict(p['memoria'])
    cp, ac, filas = p['inicio'], 0, []
    while True:
        ri = mem.get(cp, 0)
        if ri == 0:
            break
        op, d = divmod(ri, 1000)
        accion = gt.ESTANDAR[op]
        if accion == 'almacenar':
            rm = ac
            mem[d] = ac
        else:
            rm = mem.get(d, 0)
            ac = {'cargar': lambda: rm, 'sumar': lambda: ac + rm, 'restar': lambda: ac - rm,
                  'multiplicar': lambda: ac * rm, 'dividir': lambda: int(ac / rm)}[accion]()
        filas.append({'dir': cp, 'CP': cp + 1, 'RI': ri, 'RD': d, 'RM': rm, 'AC': ac, 'accion': accion})
        cp += 1
    return filas, mem, ac


def node(codigo):
    if not shutil.which('node'):
        return None
    pre = "global.window={};global.document={readyState:'complete',querySelectorAll:()=>[]};"
    r = subprocess.run(['node', '-e', pre + codigo], capture_output=True, text=True, cwd=ROOT, check=True)
    return json.loads(r.stdout)


def main():
    datos = {'circuitos': [], 'programas': []}
    md = ['# Tema 2 · Solucionario de los ejercicios autocorregibles (bloques 5 y 6)', '',
          'Generado por `scripts/generar_ut02_autocorregibles.py`. No se publica en la web.',
          'La web corrige con cualquier combinación de entradas; aquí van las de partida y la tabla completa.', '',
          '## Bloque 5 · Circuitos con valores', '']
    tablas = {}
    for c in CIRCUITOS:
        svg, tabla = circuito(c)
        tablas[c['n']] = tabla
        (gl.OUTPUT / f'valores-{c["n"][1:]}.svg').write_text(svg, encoding='utf-8')
        datos['circuitos'].append({
            'id': c['n'], 'titulo': c['titulo'], 'nivel': c['nivel'],
            'entradas': list(c['entradas']), 'valores': c['valores'],
            'puertas': [{'id': g, 'tipo': k, 'ins': ins} for g, (k, _, _, ins) in c['puertas'].items()],
            'salida': c['salida'], 'svg': svg_web(svg, c['n']),
            'descarga': f'../assets/img/logica/valores-{c["n"][1:]}.svg'})
        num = {g: i for i, g in enumerate(c['puertas'], 1)}
        s = senales(c, c['valores'])
        md += [f'### {c["titulo"]} · nivel {c["nivel"]}', '', f'**{c["expresion"]}**', '',
               'Valores de partida: ' + ', '.join(f'{k} = {v}' for k, v in c['valores'].items()) + ' → '
               + ', '.join(f'puerta {num[g]} = {s[g]}' for g in c['puertas']) + f'; **F = {s[c["salida"]]}**.', '',
               '| ' + ' | '.join(c['entradas']) + ' | ' + ' | '.join(f'P{num[g]}' for g in c['puertas']) + ' | F |',
               '|' + '---|' * (len(c['entradas']) + len(c['puertas']) + 1)]
        for asig, sg in tabla:
            md.append('| ' + ' | '.join(str(asig[k]) for k in c['entradas']) + ' | '
                      + ' | '.join(str(sg[g]) for g in c['puertas']) + f' | {sg[c["salida"]]} |')
        md.append('')
        print(f'{c["titulo"]}: dibujo y red coinciden; tabla verificada; {c["expresion"]}')

    md += ['## Bloque 6 · Ejecución de programas', '',
           'Valores al terminar cada instrucción (como la traza del simulador).', '']
    trazas = {}
    for p in PROGRAMAS:
        filas, mem, ac = traza(p)
        mem_gt, ac_gt, _ = gt.ejecutar(gt.ESTANDAR, p['inicio'], p['memoria'])
        assert (mem, ac) == (mem_gt, ac_gt), (p['titulo'], 'el modelo no coincide con generar_trazas_cpu.py')
        ac_esp, celdas = p['esperado']
        assert ac == ac_esp and all(mem[k] == v for k, v in celdas.items()), (p['titulo'], ac, mem)
        escritas = sorted({f['RD'] for f in filas if f['accion'] == 'almacenar'})
        assert escritas == sorted(celdas), (p['titulo'], escritas)
        trazas[p['n']] = filas
        datos['programas'].append({'id': p['n'], 'titulo': p['titulo'], 'nivel': p['nivel'], 'inicio': p['inicio'],
                                   'memoria': {str(k): v for k, v in sorted(p['memoria'].items())}})
        md += [f'### {p["titulo"]} · nivel {p["nivel"]}', '',
               'Memoria: ' + ', '.join(f'{d:03d}: {gt.f4(v)}' for d, v in sorted(p['memoria'].items())) + '. '
               f'Empieza en {p["inicio"]}.', '',
               '| Instrucción | CP | RI | RD | RM | AC |', '|---|---|---|---|---|---|']
        md += [f'| {f["dir"]:03d} | {f["CP"]:03d} | {gt.f4(f["RI"])} | {f["RD"]:03d} | {gt.f4(f["RM"])} | {gt.f4(f["AC"])} |'
               for f in filas]
        md += ['', 'Memoria final: ' + ', '.join(f'{d:03d} = {mem[d]}' for d in escritas) + f'. AC = {ac}.', '']
        print(f'{p["titulo"]}: {len(filas)} instrucciones, AC = {ac}, celdas {escritas}')

    DATOS.write_text('/* Generado por scripts/generar_ut02_autocorregibles.py. No editar a mano. */\n'
                     'window.UT02_PRACTICA = ' + json.dumps(datos, ensure_ascii=False, indent=1) + ';\n',
                     encoding='utf-8')
    SOLUCIONARIO.write_text('\n'.join(md), encoding='utf-8')
    contrastar_web(tablas, trazas)
    print('datos:', DATOS.relative_to(ROOT), '· solucionario:', SOLUCIONARIO.relative_to(ROOT))


def contrastar_web(tablas, trazas):
    casos = {n: [a for a, _ in t] for n, t in tablas.items()}
    r = node(f"require('./{DATOS.relative_to(ROOT)}');require('./{JS.relative_to(ROOT)}');"
             "const D=window.UT02_PRACTICA, P=window.UT02P, casos=" + json.dumps(casos) + ";"
             "const c={};D.circuitos.forEach(x=>{c[x.id]=casos[x.id].map(v=>P.evaluarCircuito(x,v))});"
             "const p={};D.programas.forEach(x=>{p[x.id]=P.ejecutarPrograma(x)});"
             "console.log(JSON.stringify({c,p}))")
    if r is None:
        print('Node no disponible: sin contraste con la web')
        return
    for n, tabla in tablas.items():
        for (asig, sg), web in zip(tabla, r['c'][n]):
            assert web == sg, (n, asig, web, sg)
    for n, filas in trazas.items():
        web = r['p'][str(n)]['filas']
        assert [{k: f[k] for k in ('dir', 'CP', 'RI', 'RD', 'RM', 'AC')} for f in filas] == web, (n, web)
    print('web: ut02-practica.js calcula lo mismo en', sum(len(t) for t in tablas.values()),
          'combinaciones de entradas y', sum(len(f) for f in trazas.values()), 'filas de traza')


if __name__ == '__main__':
    main()
