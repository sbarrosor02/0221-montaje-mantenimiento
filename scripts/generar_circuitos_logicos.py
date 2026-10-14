"""Genera y verifica los circuitos lógicos del tema 2.

Uso:  python scripts/generar_circuitos_logicos.py

Solo biblioteca estándar. Para cada circuito:
  - dibuja el SVG en web/assets/img/logica/ con el mismo estilo que los circuitos del tema 1,
  - comprueba la geometría del dibujo, el equivalente al análisis nodal de los circuitos
    eléctricos: cada cable es ortogonal, cada red es conexa y toca exactamente sus patillas,
    dos redes distintas solo se cruzan en perpendicular, nunca se tocan en un extremo,
    y ningún cable atraviesa una puerta,
  - reconstruye la red de puertas A PARTIR DEL DIBUJO y la compara con la red declarada,
  - calcula la tabla de verdad simulando la red y la contrasta con la expresión
    simplificada escrita a mano (falla con AssertionError si no coinciden),
  - escribe el solucionario en temario/soluciones/ut02-circuitos-logicos-solucionario.md.

Los circuitos 1 a 4 reproducen los del boletín del profesor (imagen «Circuito lógico 1-4»).
Los circuitos 3 y 4 dan F = 0 para cualquier entrada: así están dibujados en el original.
Los circuitos 5 y 6 son nuevos. El circuito «ejemplo» se resuelve en la teoría y no va al solucionario.
"""
from pathlib import Path
from html import escape
from itertools import product

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'web/assets/img/logica'
SOLUCIONARIO = ROOT / 'temario/soluciones/ut02-circuitos-logicos-solucionario.md'

STYLE = ('<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}'
         '.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}'
         '.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}'
         '.dato{font-weight:700;fill:#8a3d00}</style>')

BUBBLE = 4
# Puertas de dos entradas: cuerpo de 50 px de ancho y ±18 px de alto; entradas en y-10 e y+10.
INVERTIDAS = {'NAND', 'NOR', 'XNOR'}


def gate_pins(kind, x, y):
    """Patillas de una puerta: lista de entradas y salida."""
    if kind == 'NOT':
        return [(x, y)], (x + 40, y)
    out = x + 50 + (2 * BUBBLE if kind in INVERTIDAS else 0)
    return [(x, y - 10), (x, y + 10)], (out, y)


def gate_box(kind, x, y):
    if kind == 'NOT':
        return (x, y - 13, x + 40, y + 13)
    return (x, y - 19, gate_pins(kind, x, y)[1][0], y + 19)


def gate_svg(kind, x, y):
    parts = []
    if kind == 'NOT':
        parts.append(f'<path class="gate" d="M{x},{y - 13} L{x + 30},{y} L{x},{y + 13} Z"/>')
        parts.append(f'<circle class="gate" cx="{x + 30 + BUBBLE}" cy="{y}" r="{BUBBLE}"/>')
        return parts
    base = kind[1:] if kind in INVERTIDAS else kind
    if base == 'AND':
        parts.append(f'<path class="gate" d="M{x},{y - 18} H{x + 25} A25,18 0 0 1 {x + 25},{y + 18} H{x} Z"/>')
    else:  # OR, XOR
        parts.append(f'<path class="gate" d="M{x - 4},{y - 18} Q{x + 8},{y} {x - 4},{y + 18} '
                     f'Q{x + 28},{y + 18} {x + 50},{y} Q{x + 28},{y - 18} {x - 4},{y - 18} Z"/>')
        if base == 'XOR':
            parts.append(f'<path class="wire" d="M{x - 11},{y - 18} Q{x + 1},{y} {x - 11},{y + 18}"/>')
    if kind in INVERTIDAS:
        parts.append(f'<circle class="gate" cx="{x + 50 + BUBBLE}" cy="{y}" r="{BUBBLE}"/>')
    # Tramos cortos que unen la patilla con el cuerpo curvo de las OR.
    if base in ('OR', 'XOR'):
        for _, py in gate_pins(kind, x, y)[0]:
            parts.append(f'<path class="wire" d="M{x},{py} h4"/>')
    return parts


FUNCIONES = {
    'NOT': lambda a: 1 - a[0],
    'AND': lambda a: a[0] & a[1],
    'OR': lambda a: a[0] | a[1],
    'NAND': lambda a: 1 - (a[0] & a[1]),
    'NOR': lambda a: 1 - (a[0] | a[1]),
    'XOR': lambda a: a[0] ^ a[1],
    'XNOR': lambda a: 1 - (a[0] ^ a[1]),
}

# ---------------------------------------------------------------------------
# Definición de los circuitos.
#   entradas: {nombre: y} (el terminal se dibuja en x = 30)
#   puertas:  {id: (tipo, x, y, [señal de cada entrada])}
#   cables:   {señal: [polilíneas]}; la señal de una puerta es su id.
#   salida:   (señal, x final)
#   esperada: función de (A, B, C) escrita a mano a partir del original
# ---------------------------------------------------------------------------
CIRCUITOS = [
    {
        'n': 'ejemplo', 'ancho': 330, 'alto': 170,
        'titulo': 'Ejemplo resuelto de circuito lógico',
        'entradas': {'A': 40, 'B': 80, 'C': 140},
        'puertas': {
            'G1': ('OR', 120, 50, ['A', 'B']),
            'G2': ('NOT', 120, 140, ['C']),
            'G3': ('AND', 240, 95, ['G1', 'G2']),
        },
        'cables': {
            'A': [[(30, 40), (120, 40)]],
            'B': [[(30, 80), (100, 80), (100, 60), (120, 60)]],
            'C': [[(30, 140), (120, 140)]],
            'G1': [[(170, 50), (200, 50), (200, 85), (240, 85)]],
            'G2': [[(160, 140), (210, 140), (210, 105), (240, 105)]],
            'G3': [[(290, 95), (320, 95)]],
        },
        'salida': 'G3',
        'expresion': "F = (A + B)·C'",
        'esperada': lambda a, b, c: (a | b) & (1 - c),
        'pasos': [],
        'publico': True,
    },
    {
        'n': 1, 'ancho': 520, 'alto': 220,
        'titulo': 'Circuito lógico 1',
        'entradas': {'A': 40, 'B': 110, 'C': 150},
        'puertas': {
            'G1': ('NOT', 100, 40, ['A']),
            'G2': ('AND', 200, 50, ['G1', 'B']),
            'G3': ('NOR', 200, 120, ['B', 'C']),
            'G4': ('NOT', 160, 190, ['C']),
            'G5': ('AND', 300, 160, ['G3', 'G4']),
            'G6': ('OR', 410, 105, ['G2', 'G5']),
        },
        'cables': {
            'A': [[(30, 40), (100, 40)]],
            'B': [[(30, 110), (200, 110)], [(170, 110), (170, 60), (200, 60)]],
            'C': [[(30, 150), (80, 150)], [(80, 150), (80, 130), (200, 130)], [(80, 150), (80, 190), (160, 190)]],
            'G1': [[(140, 40), (200, 40)]],
            'G2': [[(250, 50), (380, 50), (380, 95), (410, 95)]],
            'G3': [[(258, 120), (275, 120), (275, 150), (300, 150)]],
            'G4': [[(200, 190), (285, 190), (285, 170), (300, 170)]],
            'G5': [[(350, 160), (390, 160), (390, 115), (410, 115)]],
            'G6': [[(460, 105), (490, 105)]],
        },
        'salida': 'G6',
        'expresion': "F = A'·B + B'·C'",
        'esperada': lambda a, b, c: ((1 - a) & b) | ((1 - b) & (1 - c)),
        'pasos': [
            "Puerta 1: A' (NOT de A).",
            "Puerta 2: A'·B.",
            "Puerta 3: NOR de B y C = (B + C)' = B'·C' (De Morgan).",
            "Puerta 4: C'.",
            "Puerta 5: B'·C'·C' = B'·C' (C'·C' = C').",
            "Salida: F = A'·B + B'·C'.",
        ],
    },
    {
        'n': 2, 'ancho': 560, 'alto': 300,
        'titulo': 'Circuito lógico 2',
        'entradas': {'A': 40, 'B': 90, 'C': 140},
        'puertas': {
            'G1': ('AND', 220, 50, ['A', 'B']),
            'G2': ('NOT', 200, 170, ['B']),
            'G3': ('OR', 220, 260, ['C', 'B']),
            'G4': ('AND', 330, 200, ['G2', 'G3']),
            'G5': ('OR', 440, 120, ['G1', 'G4']),
        },
        'cables': {
            'A': [[(30, 40), (220, 40)]],
            'B': [[(30, 90), (190, 90), (190, 60), (220, 60)], [(160, 90), (160, 170), (200, 170)],
                  [(120, 90), (120, 270), (220, 270)]],
            'C': [[(30, 140), (80, 140), (80, 250), (220, 250)]],
            'G1': [[(270, 50), (410, 50), (410, 110), (440, 110)]],
            'G2': [[(240, 170), (300, 170), (300, 190), (330, 190)]],
            'G3': [[(270, 260), (310, 260), (310, 210), (330, 210)]],
            'G4': [[(380, 200), (420, 200), (420, 130), (440, 130)]],
            'G5': [[(490, 120), (520, 120)]],
        },
        'salida': 'G5',
        'expresion': "F = A·B + B'·C",
        'esperada': lambda a, b, c: (a & b) | ((1 - b) & c),
        'pasos': [
            "Puerta 1: A·B.",
            "Puerta 2: B'.",
            "Puerta 3: B + C (ojo: C cruza la bajada de B sin punto, no están unidas).",
            "Puerta 4: B'·(B + C) = B'·B + B'·C = 0 + B'·C = B'·C.",
            "Salida: F = A·B + B'·C.",
        ],
    },
    {
        'n': 3, 'ancho': 540, 'alto': 200,
        'titulo': 'Circuito lógico 3',
        'entradas': {'A': 40, 'B': 100, 'C': 160},
        'puertas': {
            'G1': ('NOT', 90, 40, ['A']),
            'G2': ('OR', 200, 50, ['G1', 'B']),
            'G3': ('NOT', 90, 160, ['C']),
            'G4': ('AND', 200, 150, ['B', 'G3']),
            'G5': ('NOR', 310, 95, ['G2', 'G4']),
            'G6': ('AND', 420, 105, ['G5', 'G4']),
        },
        'cables': {
            'A': [[(30, 40), (90, 40)]],
            'B': [[(30, 100), (160, 100)], [(160, 60), (160, 140)], [(160, 60), (200, 60)], [(160, 140), (200, 140)]],
            'C': [[(30, 160), (90, 160)]],
            'G1': [[(130, 40), (200, 40)]],
            'G2': [[(250, 50), (280, 50), (280, 85), (310, 85)]],
            'G3': [[(130, 160), (200, 160)]],
            'G4': [[(250, 150), (290, 150)], [(290, 150), (290, 105), (310, 105)],
                   [(290, 150), (400, 150), (400, 115), (420, 115)]],
            'G5': [[(368, 95), (420, 95)]],
            'G6': [[(470, 105), (500, 105)]],
        },
        'salida': 'G6',
        'expresion': 'F = 0 (siempre)',
        'esperada': lambda a, b, c: 0,
        'pasos': [
            "Puerta 1: A'.  Puerta 2: A' + B.",
            "Puerta 3: C'.  Puerta 4: B·C'.",
            "Puerta 5: NOR = (A' + B)'·(B·C')'.",
            "Salida: F = (A' + B)'·(B·C')'·(B·C'). Aparece X'·X con X = B·C', que vale 0.",
            "F = 0 para cualquier combinación: la salida nunca se enciende.",
        ],
    },
    {
        'n': 4, 'ancho': 530, 'alto': 210,
        'titulo': 'Circuito lógico 4',
        'entradas': {'A': 40, 'B': 110, 'C': 170},
        'puertas': {
            'G1': ('NOT', 80, 110, ['B']),
            'G2': ('AND', 200, 50, ['A', 'G1']),
            'G3': ('NAND', 300, 75, ['G2', 'G1']),
            'G4': ('OR', 200, 160, ['G1', 'C']),
            'G5': ('NOR', 410, 120, ['G3', 'G4']),
        },
        'cables': {
            'A': [[(30, 40), (200, 40)]],
            'B': [[(30, 110), (80, 110)]],
            'C': [[(30, 170), (200, 170)]],
            'G1': [[(120, 110), (150, 110)], [(150, 60), (150, 150)], [(150, 60), (200, 60)],
                   [(150, 150), (200, 150)], [(150, 110), (280, 110), (280, 85), (300, 85)]],
            'G2': [[(250, 50), (270, 50), (270, 65), (300, 65)]],
            'G3': [[(358, 75), (385, 75), (385, 110), (410, 110)]],
            'G4': [[(250, 160), (395, 160), (395, 130), (410, 130)]],
            'G5': [[(468, 120), (500, 120)]],
        },
        'salida': 'G5',
        'expresion': 'F = 0 (siempre)',
        'esperada': lambda a, b, c: 0,
        'pasos': [
            "Puerta 1: B'.  Puerta 2: A·B'.",
            "Puerta 3: NAND = (A·B'·B')' = (A·B')'.",
            "Puerta 4: B' + C.",
            "Salida: NOR = [(A·B')']'·(B' + C)' = A·B'·B·C' (De Morgan: (B' + C)' = B·C').",
            "Aparece B'·B = 0, así que F = 0 para cualquier combinación.",
        ],
    },
    {
        'n': 5, 'ancho': 440, 'alto': 230,
        'titulo': 'Circuito lógico 5',
        'entradas': {'A': 40, 'B': 200},
        'puertas': {
            'G1': ('NOT', 110, 90, ['A']),
            'G2': ('NOT', 110, 150, ['B']),
            'G3': ('AND', 230, 50, ['A', 'G2']),
            'G4': ('AND', 230, 190, ['G1', 'B']),
            'G5': ('OR', 340, 120, ['G3', 'G4']),
        },
        'cables': {
            'A': [[(30, 40), (230, 40)], [(70, 40), (70, 90), (110, 90)]],
            'B': [[(30, 200), (230, 200)], [(90, 200), (90, 150), (110, 150)]],
            'G1': [[(150, 90), (170, 90), (170, 180), (230, 180)]],
            'G2': [[(150, 150), (190, 150), (190, 60), (230, 60)]],
            'G3': [[(280, 50), (310, 50), (310, 110), (340, 110)]],
            'G4': [[(280, 190), (320, 190), (320, 130), (340, 130)]],
            'G5': [[(390, 120), (420, 120)]],
        },
        'salida': 'G5',
        'expresion': "F = A·B' + A'·B  (es una XOR)",
        'esperada': lambda a, b, c: a ^ b,
        'pasos': [
            "Puertas 1 y 2: A' y B'.",
            "Puerta 3: A·B'.  Puerta 4: A'·B.",
            "Salida: F = A·B' + A'·B: vale 1 solo cuando A y B son distintas. Es una puerta XOR construida con AND, OR y NOT.",
        ],
    },
    {
        'n': 6, 'ancho': 520, 'alto': 250,
        'titulo': 'Circuito lógico 6',
        'entradas': {'A': 40, 'B': 100, 'C': 160},
        'puertas': {
            'G1': ('AND', 220, 50, ['A', 'B']),
            'G2': ('AND', 220, 130, ['A', 'C']),
            'G3': ('AND', 220, 210, ['B', 'C']),
            'G4': ('OR', 330, 90, ['G1', 'G2']),
            'G5': ('OR', 430, 150, ['G4', 'G3']),
        },
        'cables': {
            'A': [[(30, 40), (220, 40)], [(80, 40), (80, 120), (220, 120)]],
            'B': [[(30, 100), (110, 100)], [(110, 60), (110, 200)], [(110, 60), (220, 60)], [(110, 200), (220, 200)]],
            'C': [[(30, 160), (140, 160)], [(140, 140), (140, 220)], [(140, 140), (220, 140)], [(140, 220), (220, 220)]],
            'G1': [[(270, 50), (300, 50), (300, 80), (330, 80)]],
            'G2': [[(270, 130), (310, 130), (310, 100), (330, 100)]],
            'G3': [[(270, 210), (410, 210), (410, 160), (430, 160)]],
            'G4': [[(380, 90), (400, 90), (400, 140), (430, 140)]],
            'G5': [[(480, 150), (505, 150)]],
        },
        'salida': 'G5',
        'expresion': 'F = A·B + A·C + B·C  (función mayoría)',
        'esperada': lambda a, b, c: (a & b) | (a & c) | (b & c),
        'pasos': [
            "Puertas 1, 2 y 3: A·B, A·C y B·C.",
            "Puerta 4: A·B + A·C.  Salida: F = A·B + A·C + B·C.",
            "Vale 1 cuando al menos dos de las tres entradas valen 1 (votación por mayoría).",
        ],
    },
]


# ---------------------------------------------------------------------------
# Geometría
# ---------------------------------------------------------------------------
def segments(net_polylines):
    out = []
    for poly in net_polylines:
        for p, q in zip(poly, poly[1:]):
            assert p != q, ('segmento nulo', p)
            assert p[0] == q[0] or p[1] == q[1], ('cable no ortogonal', p, q)
            out.append((p, q))
    return out


def on_segment(pt, seg, interior=False):
    (x1, y1), (x2, y2) = seg
    x, y = pt
    if x1 == x2:
        inside = x == x1 and min(y1, y2) <= y <= max(y1, y2)
    else:
        inside = y == y1 and min(x1, x2) <= x <= max(x1, x2)
    if interior and pt in seg:
        return False
    return inside


def horizontal(seg):
    return seg[0][1] == seg[1][1]


def crossing(s, t):
    """Punto donde se cruzan dos segmentos, o None. Devuelve ('cruce'|'contacto', punto)."""
    if horizontal(s) == horizontal(t):
        # Paralelos: solo es aceptable que no compartan ningún punto.
        if horizontal(s) and s[0][1] == t[0][1] or not horizontal(s) and s[0][0] == t[0][0]:
            k = 0 if horizontal(s) else 1
            a1, a2 = sorted((s[0][k], s[1][k]))
            b1, b2 = sorted((t[0][k], t[1][k]))
            if max(a1, b1) <= min(a2, b2):
                return ('solape', s[0])
        return None
    h, v = (s, t) if horizontal(s) else (t, s)
    pt = (v[0][0], h[0][1])
    if on_segment(pt, h) and on_segment(pt, v):
        if pt in h or pt in v:
            return ('contacto', pt)
        return ('cruce', pt)
    return None


def verify_and_extract(c):
    """Comprueba el dibujo y reconstruye la red de puertas desde la geometría."""
    pins_in = {}   # punto -> (puerta, índice)
    pins_out = {}  # punto -> señal
    for name, y in c['entradas'].items():
        pins_out[(30, y)] = name
    for gid, (kind, x, y, _) in c['puertas'].items():
        ins, out = gate_pins(kind, x, y)
        for i, p in enumerate(ins):
            pins_in[p] = (gid, i)
        pins_out[out] = gid
    all_segs = {net: segments(polys) for net, polys in c['cables'].items()}

    # 1. Redes distintas: solo cruces perpendiculares limpios.
    nets = list(all_segs)
    crossings = []
    for i, n1 in enumerate(nets):
        for n2 in nets[i + 1:]:
            for s in all_segs[n1]:
                for t in all_segs[n2]:
                    r = crossing(s, t)
                    if r is None:
                        continue
                    assert r[0] == 'cruce', (c['n'], 'redes', n1, n2, 'se tocan en', r)
                    crossings.append((r[1], s if horizontal(s) else t))

    # 2. Ningún cable atraviesa una puerta (solo puede tocar su patilla desde fuera).
    for gid, (kind, x, y, _) in c['puertas'].items():
        x1, y1, x2, y2 = gate_box(kind, x, y)
        for net, segs in all_segs.items():
            for (p, q) in segs:
                lo_x, hi_x = sorted((p[0], q[0]))
                lo_y, hi_y = sorted((p[1], q[1]))
                if hi_x <= x1 or lo_x >= x2 or hi_y <= y1 or lo_y >= y2:
                    continue
                raise AssertionError((c['n'], 'el cable de', net, 'atraviesa', gid, (p, q)))

    # 3. Cada red es conexa y toca exactamente su fuente y sus destinos.
    extracted = {gid: [None] * len(gate_pins(k, x, y)[0]) for gid, (k, x, y, _) in c['puertas'].items()}
    junctions = []
    for net, segs in all_segs.items():
        # Conectividad entre segmentos de la misma red (extremos o derivaciones en T).
        parent = list(range(len(segs)))

        def find(i):
            while parent[i] != i:
                parent[i] = parent[parent[i]]
                i = parent[i]
            return i
        for i, s in enumerate(segs):
            for j in range(i + 1, len(segs)):
                t = segs[j]
                if any(on_segment(p, t) for p in s) or any(on_segment(p, s) for p in t):
                    parent[find(i)] = find(j)
        assert len({find(i) for i in range(len(segs))}) == 1, (c['n'], 'red partida', net)
        # Patillas tocadas por esta red.
        touched_out = {p for p in pins_out if any(on_segment(p, s) for s in segs)}
        touched_in = {p for p in pins_in if any(on_segment(p, s) for s in segs)}
        assert {pins_out[p] for p in touched_out} == {net}, (c['n'], 'fuente de', net, touched_out)
        for p in touched_in:
            gid, idx = pins_in[p]
            assert extracted[gid][idx] is None, (c['n'], 'patilla con dos redes', gid, idx)
            extracted[gid][idx] = net
        # Puntos de unión: extremo de un segmento en el interior de otro, o 3+ extremos.
        ends = {}
        for s in segs:
            for p in s:
                ends[p] = ends.get(p, 0) + 1
        for p, count in ends.items():
            if count >= 3 or any(on_segment(p, s, interior=True) for s in segs):
                junctions.append(p)
    # La salida F sale de la puerta indicada.
    salida = c['salida']
    for gid, ins in extracted.items():
        assert None not in ins, (c['n'], 'entrada al aire', gid, ins)
        assert ins == c['puertas'][gid][3], (c['n'], 'el dibujo no coincide con la red', gid, ins, c['puertas'][gid][3])
    return junctions, crossings, all_segs


def evaluate(c, values):
    signals = dict(values)
    pending = dict(c['puertas'])
    while pending:
        progress = False
        for gid, (kind, _, _, ins) in list(pending.items()):
            if all(s in signals for s in ins):
                signals[gid] = FUNCIONES[kind]([signals[s] for s in ins])
                del pending[gid]
                progress = True
        assert progress, (c['n'], 'realimentación o señal desconocida')
    return signals[c['salida']]


# ---------------------------------------------------------------------------
# Dibujo
# ---------------------------------------------------------------------------
HOP = 5


def horizontal_path(seg, hops):
    (x1, y), (x2, _) = seg
    direction = 1 if x2 > x1 else -1
    xs = sorted((h for h in hops), key=lambda h: h * direction)
    d = f'M{x1},{y}'
    for hx in xs:
        d += f' L{hx - direction * HOP},{y} A{HOP},{HOP} 0 0 {1 if direction > 0 else 0} {hx + direction * HOP},{y}'
    d += f' L{x2},{y}'
    return d


def draw(c, junctions, crossings, all_segs):
    body = []
    hops_by_seg = {}
    for pt, hseg in crossings:
        hops_by_seg.setdefault(hseg, []).append(pt[0])
    for net, segs in all_segs.items():
        for seg in segs:
            if horizontal(seg) and seg in hops_by_seg:
                body.append(f'<path class="wire" d="{horizontal_path(seg, hops_by_seg[seg])}"/>')
            else:
                (x1, y1), (x2, y2) = seg
                body.append(f'<path class="wire" d="M{x1},{y1} L{x2},{y2}"/>')
    for gid, (kind, x, y, _) in c['puertas'].items():
        body += gate_svg(kind, x, y)
    for x, y in sorted(set(junctions)):
        body.append(f'<circle class="node" cx="{x}" cy="{y}" r="3.6"/>')
    for name, y in c['entradas'].items():
        body.append(f'<circle class="open" cx="30" cy="{y}" r="4"/>')
        body.append(f'<text class="dato" x="22" y="{y + 5}" text-anchor="end">{name}</text>')
    out_net = all_segs[c['salida']]
    end = out_net[-1][1]
    body.append(f'<text class="dato" x="{end[0] + 8}" y="{end[1] + 5}">F</text>')
    entradas = ', '.join(c['entradas'])
    numero = {gid: str(i) for i, gid in enumerate(c['puertas'], 1)}
    legible = lambda s: s if s in c['entradas'] else 'la salida de la puerta ' + numero[s]
    desc = (f'Circuito combinacional con entradas {entradas} y salida F. ' +
            '; '.join(f'Puerta {numero[gid]}: {k} de {" y ".join(legible(s) for s in ins)}'
                      for gid, (k, _, _, ins) in c['puertas'].items()) +
            f'. F es la salida de la puerta {numero[c["salida"]]}. Un cruce con salto indica que los cables no están unidos.')
    ancho = max(x for segs in all_segs.values() for s in segs for x, _ in s) + 40
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 {ancho + 10} {c["alto"]}" role="img" '
            f'aria-labelledby="title desc">\n<title id="title">{escape(c["titulo"])}</title>\n'
            f'<desc id="desc">{escape(desc)}</desc>\n{STYLE}\n'
            f'<rect x="-10" width="100%" height="100%" fill="white"/>\n' + '\n'.join(body) + '\n</svg>\n')


# ---------------------------------------------------------------------------
def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    md = ['# Tema 2 · Solucionario de los circuitos lógicos', '',
          'Generado por `scripts/generar_circuitos_logicos.py`. No se publica en la página del alumnado.',
          'Cada tabla se ha obtenido simulando la red reconstruida desde el dibujo y se ha contrastado',
          'con la expresión simplificada.', '',
          '> Los circuitos 3 y 4 del boletín original dan **F = 0** para cualquier entrada. Se mantienen',
          '> tal cual: obligan a simplificar en lugar de fiarse del dibujo.', '']
    for c in CIRCUITOS:
        junctions, crossings, all_segs = verify_and_extract(c)
        names = list(c['entradas'])
        rows = []
        for values in product((0, 1), repeat=len(names)):
            assign = dict(zip(names, values))
            f = evaluate(c, assign)
            a, b, cc = assign.get('A', 0), assign.get('B', 0), assign.get('C', 0)
            assert f == c['esperada'](a, b, cc), (c['n'], assign, f)
            rows.append((values, f))
        (OUTPUT / f'circuito-{c["n"]}.svg').write_text(draw(c, junctions, crossings, all_segs), encoding='utf-8')
        if c.get('publico'):
            print(f'circuito {c["n"]}: dibujo y red coinciden; tabla verificada; {c["expresion"]} (ejemplo de la teoría)')
            continue
        md += [f'## Circuito {c["n"]}', '', f'**{c["expresion"]}**', '']
        md += [f'{i}. {p}' for i, p in enumerate(c['pasos'], 1)]
        md += ['', '| ' + ' | '.join(names) + ' | F |', '|' + '---|' * (len(names) + 1)]
        md += ['| ' + ' | '.join(map(str, v)) + f' | {f} |' for v, f in rows]
        md.append('')
        print(f'circuito {c["n"]}: dibujo y red coinciden; tabla verificada; {c["expresion"]}')
    SOLUCIONARIO.write_text('\n'.join(md), encoding='utf-8')
    print('solucionario:', SOLUCIONARIO.relative_to(ROOT))


if __name__ == '__main__':
    main()
