"""Genera los esquemas de los boletines 4 y 5 del tema 1 y los datos del taller de nudos.

Uso:  python scripts/generar_boletines_4_5.py

Solo biblioteca estándar. Para cada circuito:
  - dibuja el SVG en web/assets/img/circuitos/ (mismo estilo que generar_circuitos.py),
  - resuelve la red por análisis nodal y la contrasta con la reducción serie/paralelo
    escrita a mano (falla con AssertionError si no coinciden),
  - en el boletín 5 exporta la geometría a web/assets/circuitos-nudos.js para el taller.
"""
from pathlib import Path
from html import escape
import json
import math

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'web/assets/img/circuitos'
DATOS = ROOT / 'web/assets/circuitos-nudos.js'
SUB = '₀₁₂₃₄₅₆₇₈₉'
STYLE = ('<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}'
         '.source{fill:white;stroke:#24364a;stroke-width:2.2}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}'
         'text{font:15px sans-serif;fill:#24364a}.dato{font-weight:600;fill:#8a3d00}</style>')
ZIGZAG = 'L-25,-8 L-15,8 L-5,-8 L5,8 L15,-8 L25,8 L30,0'


def sub(n):
    return ''.join(SUB[int(c)] for c in str(n))


def fmt(v):
    if v >= 1000:
        return ('%g' % (v / 1000)).replace('.', ',') + ' kΩ'
    return ('%g' % v).replace('.', ',') + ' Ω'


def parallel(*values):
    return 1 / sum(1 / value for value in values)


def svg_document(width, height, title, description, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}" role="img" aria-labelledby="title desc">\n'
            f'<title id="title">{escape(title)}</title>\n<desc id="desc">{escape(description)}</desc>\n{STYLE}\n'
            '<rect width="100%" height="100%" fill="white"/>\n' + '\n'.join(body) + '\n</svg>\n')


def source_svg(x1, y1, x2, y2, label):
    """Fuente con el borne + en (x2, y2)."""
    length = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    px, py = cx + ux * 8, cy + uy * 8
    mx, my = cx - ux * 8, cy - uy * 8
    return [f'<path class="wire" d="M{x1:.1f},{y1:.1f} L{cx - ux * 17:.1f},{cy - uy * 17:.1f} M{cx + ux * 17:.1f},{cy + uy * 17:.1f} L{x2:.1f},{y2:.1f}"/>',
            f'<circle class="source" cx="{cx:.1f}" cy="{cy:.1f}" r="17"/>',
            f'<path class="wire" d="M{px - 4:.1f},{py:.1f} h8 M{px:.1f},{py - 4:.1f} v8 M{mx - 4:.1f},{my:.1f} h8"/>',
            f'<text class="dato" x="{cx - 25:.1f}" y="{cy + 5:.1f}" text-anchor="end">{escape(label)}</text>']


def resistor_svg(x1, y1, x2, y2, t=.5):
    length = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    cx, cy = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
    angle = math.degrees(math.atan2(uy, ux))
    return [f'<path class="wire" d="M{x1:.1f},{y1:.1f} L{cx - ux * 30:.1f},{cy - uy * 30:.1f} M{cx + ux * 30:.1f},{cy + uy * 30:.1f} L{x2:.1f},{y2:.1f}"/>',
            f'<path class="wire" transform="translate({cx:.1f},{cy:.1f}) rotate({angle:.1f})" d="M-30,0 {ZIGZAG}"/>'], (cx, cy, ux, uy)


# ---------------------------------------------------------------------------
# Boletín 4: circuitos mixtos avanzados, dibujados de forma ordenada
# ---------------------------------------------------------------------------
class R:
    def __init__(self, value, number, label=None):
        self.value, self.number = value, number
        self.label = label or f'R{sub(number)} = {fmt(value)}'
        self.width, self.above, self.below = 116, 36, 14

    def req(self):
        return self.value

    def draw(self, x, y, out):
        out.append(f'<path class="wire" d="M{x},{y} h28 M{x + 88},{y} h28"/>')
        out.append(f'<path class="wire" transform="translate({x + 58},{y})" d="M-30,0 {ZIGZAG}"/>')
        out.append(f'<text x="{x + 58}" y="{y - 17}" text-anchor="middle">{escape(self.label)}</text>')


class S:
    def __init__(self, *items):
        self.items = items
        self.width = sum(i.width for i in items)
        self.above = max(i.above for i in items)
        self.below = max(i.below for i in items)

    def req(self):
        return sum(i.req() for i in self.items)

    def draw(self, x, y, out):
        for item in self.items:
            item.draw(x, y, out)
            x += item.width


class P:
    GAP, PAD = 16, 20

    def __init__(self, *items):
        self.items = items
        self.width = max(i.width for i in items) + 2 * self.PAD
        self.above = items[0].above
        self.offsets = [0]
        for previous, item in zip(items, items[1:]):
            self.offsets.append(self.offsets[-1] + previous.below + self.GAP + item.above)
        self.below = self.offsets[-1] + items[-1].below

    def req(self):
        return parallel(*(i.req() for i in self.items))

    def draw(self, x, y, out):
        inner = self.width - 2 * self.PAD
        left, right = x + self.PAD, x + self.width - self.PAD
        out.append(f'<path class="wire" d="M{x},{y} H{left} M{right},{y} H{x + self.width} M{left},{y} v{self.offsets[-1]} M{right},{y} v{self.offsets[-1]}"/>')
        for item, offset in zip(self.items, self.offsets):
            extra = (inner - item.width) / 2
            item.draw(left + extra, y + offset, out)
            if extra:
                out.append(f'<path class="wire" d="M{left},{y + offset} h{extra} M{right - extra},{y + offset} h{extra}"/>')
        out.append(f'<circle class="node" cx="{left}" cy="{y}" r="3.5"/><circle class="node" cx="{right}" cy="{y}" r="3.5"/>')


def ordered_svg(tree, sources, note=None):
    out = []
    left = 80
    x0 = left + 34
    y = tree.above + 14
    bottom = y + max(tree.below, 100) + 30
    width = x0 + tree.width + 36
    tree.draw(x0, y, out)
    out.append(f'<path class="wire" d="M{left},{y} H{x0} M{x0 + tree.width},{y} h16 V{bottom} H{left}"/>')
    segment = (bottom - y) / len(sources)
    for index, label in enumerate(sources):
        top = y + segment * index
        out += source_svg(left, top + segment, left, top, label)
    if note:
        out.append(f'<text class="dato" x="{x0 + tree.width / 2}" y="{bottom + 22}" text-anchor="middle">{escape(note)}</text>')
    return width, bottom + 34, out


B4 = [
    dict(title='Tres niveles de anidamiento', sources=['24 V'], volts=24,
         tree=S(R(2, 1), P(S(R(4, 2), P(R(12, 3), R(6, 4))), R(8, 5)), P(R(3, 6), R(6, 7))),
         expected=2 + parallel(4 + parallel(12, 6), 8) + parallel(3, 6),
         desc='Fuente de 24 V. R1 de 2 ohmios en serie con dos ramas en paralelo (R2 de 4 ohmios en serie con el paralelo de R3 de 12 y R4 de 6; y R5 de 8 ohmios) y en serie con el paralelo de R6 de 3 y R7 de 6 ohmios.',
         ask=['La resistencia equivalente y la intensidad que suministra la fuente.', 'La tensión en R₁, en el bloque central y en el paralelo R₆∥R₇.', 'La intensidad que atraviesa cada una de las siete resistencias.']),
    dict(title='Tres ramas y once resistencias', sources=['60 V'], volts=60,
         tree=S(R(5, 1), P(S(R(10, 2), P(R(30, 3), R(15, 4))), S(P(R(20, 5), R(20, 6)), R(10, 7)), R(10, 8)), P(R(40, 9), R(10, 10)), R(2, 11)),
         expected=5 + parallel(10 + parallel(30, 15), parallel(20, 20) + 10, 10) + parallel(40, 10) + 2,
         desc='Fuente de 60 V. R1 de 5 ohmios en serie con tres ramas en paralelo (R2 de 10 más el paralelo de R3 de 30 y R4 de 15; el paralelo de R5 y R6 de 20 más R7 de 10; y R8 de 10), el paralelo de R9 de 40 y R10 de 10, y R11 de 2 ohmios.',
         ask=['La intensidad suministrada por la fuente de 60 V.', 'La intensidad de cada una de las tres ramas del bloque central.', 'La tensión y la intensidad en R₉ y en R₁₀.']),
    dict(title='Fuente desconocida y unidades mezcladas', sources=['? V'], volts=20, note='I total = 5 mA',
         tree=S(R(1200, 1), P(S(R(2200, 2), R(1800, 3)), S(R(1000, 4), P(R(6000, 5), R(3000, 6)), R(1000, 7))), R(800, 8)),
         expected=1200 + parallel(2200 + 1800, 1000 + parallel(6000, 3000) + 1000) + 800,
         desc='Fuente desconocida con una corriente total de 5 mA. R1 de 1,2 kiloohmios en serie con dos ramas en paralelo (R2 de 2,2 más R3 de 1,8 kiloohmios; y R4 de 1 kiloohmio más el paralelo de R5 de 6 y R6 de 3 kiloohmios más R7 de 1 kiloohmio) y en serie con R8 de 800 ohmios.',
         ask=['El voltaje de la fuente, sabiendo que suministra <strong>5 mA</strong>.', 'La intensidad de cada rama del paralelo.', 'La intensidad que pasa por R₅ y por R₆.']),
    dict(title='Red en escalera', sources=['36 V'], volts=36,
         tree=S(R(6, 1), P(R(6, 2), S(R(3, 3), P(R(6, 4), S(R(3, 5), P(R(6, 6), S(R(4, 7), P(R(6, 8), R(3, 9))))))))),
         expected=6 + parallel(6, 3 + parallel(6, 3 + parallel(6, 4 + parallel(6, 3)))),
         desc='Fuente de 36 V. R1 de 6 ohmios en serie con una escalera: R2 de 6 en paralelo con R3 de 3 más el paralelo de R4 de 6 con R5 de 3 más el paralelo de R6 de 6 con R7 de 4 más el paralelo de R8 de 6 y R9 de 3 ohmios.',
         ask=['La intensidad suministrada por la fuente de 36 V.', 'La intensidad que atraviesa R₇.', 'La tensión y la intensidad en R₉.']),
    dict(title='Dos fuentes en serie y balance de potencias', sources=['9 V', '15 V'], volts=24,
         tree=S(P(S(R(8, 1), R(4, 2)), R(6, 3), R(4, 4)), R(4, 5), P(S(R(6, 6), P(R(4, 7), R(12, 8))), R(18, 9))),
         expected=parallel(12, 6, 4) + 4 + parallel(6 + parallel(4, 12), 18),
         desc='Fuentes de 9 V y 15 V en serie. Primer bloque en paralelo: R1 de 8 más R2 de 4; R3 de 6; R4 de 4 ohmios. En serie con R5 de 4 ohmios y con el paralelo de R6 de 6 más el paralelo de R7 de 4 y R8 de 12, y R9 de 18 ohmios.',
         ask=['La intensidad total que circula por las fuentes.', 'La potencia que disipa cada una de las nueve resistencias.', 'La potencia que entregan las fuentes. Comprueba la conservación de la potencia.', '¿Qué resistencias no podrían ser de 1 W?']),
    dict(title='Problema inverso: la resistencia que falta', sources=['28 V'], volts=28, note='I total = 2 A',
         tree=S(R(3, 1), P(S(R(8, 'x', 'Rₓ = ? Ω'), R(4, 2)), R(12, 3)), P(R(10, 4), S(R(6, 5), P(R(8, 6), R(8, 7))))),
         expected=3 + parallel(8 + 4, 12) + parallel(10, 6 + parallel(8, 8)),
         desc='Fuente de 28 V con una corriente total de 2 A. R1 de 3 ohmios en serie con el paralelo de Rx desconocida más R2 de 4, y R3 de 12; en serie con el paralelo de R4 de 10 y R5 de 6 más el paralelo de R6 y R7 de 8 ohmios.',
         ask=['El valor de Rₓ para que la fuente de 28 V suministre exactamente <strong>2 A</strong>.', 'La intensidad que pasa por Rₓ y la tensión entre sus terminales.', 'La potencia que disipa Rₓ. ¿Sirve una resistencia de ½ W?']),
]

# ---------------------------------------------------------------------------
# Boletín 5: circuitos enrevesados, geometría libre
# ---------------------------------------------------------------------------
U = 62


class Free:
    def __init__(self, title, points, wires, resistors, sources, expected, desc, ask, open_ends=(), names=None, terminals=None):
        self.title, self.points, self.wires = title, points, wires
        self.terminals = terminals or (sources[0][0], sources[0][1])
        self.resistors, self.sources = resistors, sources
        self.expected, self.desc, self.ask = expected, desc, ask
        self.open_ends = list(open_ends)
        self.names = names or {}

    def name(self, number):
        return self.names.get(number, number)

    def groups(self):
        parent = {p: p for p in self.points}

        def root(p):
            while parent[p] != p:
                p = parent[p]
            return p
        for wire in self.wires:
            for a, b in zip(wire, wire[1:]):
                parent[root(a)] = root(b)
        groups = {}
        for p in self.points:
            groups.setdefault(root(p), []).append(p)
        return root, list(groups.values())

    def solve(self):
        """Análisis nodal modificado con fuentes ideales. Devuelve I total y corriente de cada resistencia."""
        root, _ = self.groups()
        nodes = sorted({root(p) for p in self.points})
        ground = root(self.sources[0][0])
        unknown = [n for n in nodes if n != ground]
        size = len(unknown) + len(self.sources)
        a = [[0.0] * (size + 1) for _ in range(size)]
        index = {n: i for i, n in enumerate(unknown)}
        for number, p, q, ohm, *_ in self.resistors:
            g = 1 / ohm
            i, j = index.get(root(p)), index.get(root(q))
            if i is not None:
                a[i][i] += g
            if j is not None:
                a[j][j] += g
            if i is not None and j is not None:
                a[i][j] -= g
                a[j][i] -= g
        for k, (neg, pos, label, volts) in enumerate(self.sources):
            row = len(unknown) + k
            i, j = index.get(root(pos)), index.get(root(neg))
            if i is not None:
                a[i][row] += 1
                a[row][i] += 1
            if j is not None:
                a[j][row] -= 1
                a[row][j] -= 1
            a[row][-1] = volts
        for col in range(size):
            pivot = max(range(col, size), key=lambda r: abs(a[r][col]))
            a[col], a[pivot] = a[pivot], a[col]
            assert abs(a[col][col]) > 1e-12, (self.title, 'red singular')
            scale = a[col][col]
            a[col] = [v / scale for v in a[col]]
            for r in range(size):
                if r != col and a[r][col]:
                    f = a[r][col]
                    a[r] = [v - f * w for v, w in zip(a[r], a[col])]
        voltage = {ground: 0.0}
        voltage.update({n: a[i][-1] for n, i in index.items()})
        currents = {self.name(n): abs(voltage[root(p)] - voltage[root(q)]) / ohm for n, p, q, ohm, *_ in self.resistors}
        return abs(a[len(unknown)][-1]), currents

    def svg(self):
        xs = [p[0] for p in self.points.values()]
        ys = [p[1] for p in self.points.values()]
        mx, my = min(xs) - 1.5, min(ys) - 0.9
        width, height = (max(xs) - mx + 2.1) * U, (max(ys) - my + 0.9) * U
        pos = {k: ((x - mx) * U, (y - my) * U) for k, (x, y) in self.points.items()}
        out, degree = [], {p: 0 for p in self.points}
        for wire in self.wires:
            out.append('<polyline class="wire" points="' + ' '.join('%.1f,%.1f' % pos[p] for p in wire) + '"/>')
            for a, b in zip(wire, wire[1:]):
                degree[a] += 1
                degree[b] += 1
        for number, p, q, ohm, *opt in self.resistors:
            opt = opt[0] if opt else {}
            degree[p] += 1
            degree[q] += 1
            parts, (cx, cy, ux, uy) = resistor_svg(*pos[p], *pos[q], opt.get('t', .5))
            out += parts
            label = f'R{sub(self.name(number))} = {fmt(ohm)}'
            nx, ny = -uy, ux
            if ny > 0 or (abs(ny) < 1e-9 and nx > 0):
                nx, ny = -nx, -ny
            if opt.get('side') == 'b':
                nx, ny = -nx, -ny
            if abs(uy) > .95:
                anchor, lx, ly = ('start' if nx > 0 else 'end'), cx + nx * 18, cy + 5
            elif abs(ux) > .95:
                anchor, lx, ly = 'middle', cx, cy + ny * 19 + (5 if ny > 0 else 0)
            else:
                anchor, lx, ly = ('start' if nx > 0 else 'end'), cx + nx * 24, cy + ny * 20 + 5
            out.append(f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="{anchor}">{label}</text>')
        for neg, pos_, label, volts in self.sources:
            degree[neg] += 1
            degree[pos_] += 1
            out += source_svg(*pos[neg], *pos[pos_], label)
        for p, d in degree.items():
            if d >= 3:
                out.append('<circle class="node" cx="%.1f" cy="%.1f" r="3.8"/>' % pos[p])
        for p in self.open_ends:
            out.append('<circle class="open" cx="%.1f" cy="%.1f" r="4.5"/>' % pos[p])
        return width, height, out

    def data(self, volts):
        _, groups = self.groups()
        return {
            'V': volts,
            'bornes': list(self.terminals),
            'titulo': self.title,
            'puntos': self.points,
            'cables': self.wires,
            'resistencias': [{'id': n, 'nombre': self.name(n), 'a': p, 'b': q, 'ohm': ohm, **(opt[0] if opt else {})} for n, p, q, ohm, *opt in self.resistors],
            'fuentes': [{'neg': a, 'pos': b, 'etiqueta': lab, 'V': v} for a, b, lab, v in self.sources],
            'abiertos': self.open_ends,
            'nudos': groups,
        }


B5 = [
    Free('La rama que parece paralela',
         dict(s0=(0, 4), s1=(0, 0), p1=(1, 0), p2=(3, 0), t4=(4.5, 0), t6=(6, 0), t9=(9.5, 0), b4=(4.5, 4), b5=(5.2, 4), b7=(7.2, 4), b8=(8, 4), b9=(9.5, 4)),
         [['s1', 'p1'], ['p2', 't4', 't6', 't9'], ['s0', 'b4', 'b5'], ['b7', 'b8', 'b9']],
         [(1, 'p1', 'p2', 3), (2, 't4', 'b4', 6), (5, 'b5', 'b7', 2, {'side': 'b'}), (3, 't6', 'b8', 6, {'t': .45}), (4, 't9', 'b9', 12)],
         [('s0', 's1', '18 V', 18)], 3 + parallel(6, 2 + parallel(6, 12)),
         'Fuente de 18 V y R1 de 3 ohmios en el cable superior. Del cable superior bajan R2 de 6 ohmios en vertical, R3 de 6 ohmios en diagonal y R4 de 12 ohmios en vertical. En el cable inferior, entre la bajada de R2 y la de R3, está R5 de 2 ohmios.',
         ['Marca con una letra cada nudo. ¿Entre qué dos nudos está conectada cada resistencia?', 'La resistencia equivalente y la intensidad total.', 'La intensidad por R₅ y la tensión en R₂.']),
    Free('Cortocircuito escondido y rama abierta',
         dict(s0=(0, 4.5), s1=(0, 0), p1=(0.8, 0), p2=(2.8, 0), n=(3.5, 0), m=(6, 0), n2=(3.5, 1.6), m2=(6, 1.6), x=(7, 0), x2=(7, 2.4), y2=(8.6, 2.4), y=(8.6, 0), z=(10, 0), z2=(10, 2.6), w=(11.2, 0), w2=(11.2, 4.5)),
         [['s1', 'p1'], ['p2', 'n', 'n2'], ['m', 'm2'], ['m', 'x', 'y', 'z', 'w'], ['x2', 'y2', 'y'], ['w2', 's0']],
         [(1, 'p1', 'p2', 4), (2, 'n', 'm', 12), (3, 'n2', 'm2', 6, {'side': 'b'}), (4, 'x', 'x2', 8, {'side': 'b'}), (5, 'z', 'z2', 100), (6, 'w', 'w2', 4, {'side': 'b'})],
         [('s0', 's1', '24 V', 24)], 4 + parallel(12, 6) + 4,
         'Fuente de 24 V. En el cable superior, R1 de 4 ohmios y el paralelo de R2 de 12 y R3 de 6 ohmios. Después baja R4 de 8 ohmios, cuyo extremo inferior se une con un cable que vuelve a subir al cable superior. R5 de 100 ohmios baja y termina en un extremo libre. R6 de 4 ohmios baja por la derecha hasta el cable de retorno.',
         ['La resistencia equivalente y la intensidad total.', '¿Qué corriente pasa por R₄? ¿Y por R₅? Justifica la respuesta.', 'La potencia que disipa cada resistencia y la que entrega la fuente.'], open_ends=['z2']),
    Free('La falsa estrella',
         dict(s0=(0, 5), s1=(0, 0), A=(2, 0), C=(8, 0), D=(5, 5), E=(5, 1.9), q=(1, 0), q2=(1, 1.9), f1=(1, 5), f2=(3, 5)),
         [['s1', 'q', 'A'], ['q', 'q2', 'E'], ['s0', 'f1'], ['f2', 'D']],
         [(1, 'f1', 'f2', 3, {'side': 'b'}), (2, 'A', 'C', 12, {'t': .62}), (3, 'E', 'C', 6, {'t': .55, 'side': 'b'}), (4, 'C', 'D', 8, {'side': 'b'}), (5, 'A', 'D', 12, {'t': .58}), (6, 'E', 'D', 6, {'t': .6, 'side': 'b'})],
         [('s0', 's1', '18 V', 18)], 3 + parallel(12, 6, parallel(12, 6) + 8),
         'Fuente de 18 V. Triángulo con R2 de 12 ohmios en el lado superior, R4 de 8 ohmios en el lado derecho y R5 de 12 ohmios en el izquierdo. Desde un punto central salen R3 de 6 ohmios hacia el vértice derecho y R6 de 6 ohmios hacia el inferior. Un cable une el punto central con el cable de la fuente y cruza R5 sin punto de conexión. R1 de 3 ohmios está en el cable inferior.',
         ['Parece una estrella dentro de un triángulo. Sigue el cable que sale del centro: ¿a qué nudo llega? ¿Cuántos nudos distintos hay?', 'La resistencia equivalente y la intensidad total.', 'La intensidad que pasa por cada una de las seis resistencias.']),
    Free('En fila, pero no en serie',
         dict(s0=(0, 4), s1=(0, 0), p1=(0.8, 0), p2=(2.8, 0), q1=(0.8, 4), q2=(2.8, 4), T4=(4, 0), T8=(8, 0), m1=(4, 2), m2=(6, 2), m3=(8, 2), m4=(10, 2), B6=(6, 4), B10=(10, 4)),
         [['s1', 'p1'], ['p2', 'T4', 'T8'], ['T4', 'm1'], ['T8', 'm3'], ['s0', 'q1'], ['q2', 'B6', 'B10'], ['m2', 'B6'], ['m4', 'B10']],
         [(1, 'p1', 'p2', 3), (5, 'q1', 'q2', 1, {'side': 'b'}), (2, 'm1', 'm2', 6, {'side': 'b'}), (3, 'm2', 'm3', 12, {'side': 'b'}), (4, 'm3', 'm4', 4, {'side': 'b'})],
         [('s0', 's1', '12 V', 12)], 3 + parallel(6, 12, 4) + 1,
         'Fuente de 12 V con R1 de 3 ohmios arriba y R5 de 1 ohmio abajo. En el centro, R2 de 6, R3 de 12 y R4 de 4 ohmios están dibujadas en fila. Sus puntos de unión se conectan alternativamente al cable superior y al inferior.',
         ['R₂, R₃ y R₄ están dibujadas una detrás de otra. ¿Están en serie? Razónalo con los nudos.', 'La resistencia equivalente y la intensidad total.', 'Si se retira R₃, ¿cuánto vale la nueva intensidad total?']),
    Free('Diagonales cruzadas y fuentes enfrentadas',
         dict(s0=(0, 5), sm=(0, 2.5), s1=(0, 0), K1=(3, 0), K2=(9, 0), K3=(9, 5), K4=(3, 5), b1=(0.6, 5), b2=(2.4, 5)),
         [['s1', 'K1'], ['s0', 'b1'], ['b2', 'K4', 'K3']],
         [(1, 'b1', 'b2', 2, {'side': 'b'}), (2, 'K1', 'K2', 8), (3, 'K2', 'K3', 12), (4, 'K1', 'K3', 6, {'t': .27}), (5, 'K2', 'K4', 6, {'t': .27, 'side': 'b'})],
         [('sm', 's1', '36 V', 36), ('sm', 's0', '6 V', 6)], 2 + parallel(6, 8 + parallel(12, 6)),
         'Dos fuentes, de 36 V y de 6 V, enfrentadas en el lado izquierdo, con R1 de 2 ohmios en el cable inferior. Rectángulo con R2 de 8 ohmios arriba, R3 de 12 ohmios a la derecha y un cable abajo. Dos diagonales, R4 y R5 de 6 ohmios, se cruzan en el centro sin punto de conexión.',
         ['¿Qué tensión neta aplican las dos fuentes? Fíjate en su polaridad.', 'La resistencia equivalente y la intensidad total.', 'La potencia de cada resistencia. ¿Cuánta potencia entrega la fuente de 36 V y qué le ocurre a la de 6 V?'],
         terminals=('s0', 's1')),
    Free('Reto: el puente equilibrado',
         dict(s0=(0, 6.2), s1=(0, 2.5), A=(2.2, 2.5), Cn=(5, 0), D=(5, 5), B=(7.8, 2.5), r1=(9, 2.5), r2=(9, 6.2)),
         [['B', 'r1', 'r2', 's0']],
         [(6, 's1', 'A', 2), (1, 'A', 'Cn', 6), (2, 'Cn', 'B', 12), (3, 'A', 'D', 3, {'side': 'b'}), (4, 'D', 'B', 6, {'side': 'b'}), (7, 'Cn', 'D', 10)],
         [('s0', 's1', '16 V', 16)], 2 + parallel(6 + 12, 3 + 6),
         'Fuente de 16 V con R6 de 2 ohmios. Rombo: R1 de 6 y R2 de 12 ohmios por arriba, R3 de 3 y R4 de 6 ohmios por abajo, y R5 de 10 ohmios en vertical entre el vértice superior y el inferior.',
         ['R₅ no está ni en serie ni en paralelo con ninguna otra. Calcula R₁/R₂ y R₃/R₄. ¿Qué observas?', 'Suponiendo que por R₅ no pasa corriente, calcula la resistencia equivalente y la intensidad total.', 'Comprueba que la tensión del vértice superior coincide con la del inferior (respecto al borne −).', 'Si R₄ fuese de 12 Ω, ¿seguiría sin pasar corriente por R₅?'],
         names={7: 5}),
]
B5_VOLTS = [18, 24, 18, 12, 30, 16]


def generate():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    report = []
    for k, c in enumerate(B4, 1):
        assert math.isclose(c['tree'].req(), c['expected'], rel_tol=1e-12), c['title']
        width, height, body = ordered_svg(c['tree'], c['sources'], c.get('note'))
        name = f'boletin-4-{k}'
        (OUTPUT / (name + '.svg')).write_text(svg_document(width, height, f'Boletín 4, ejercicio {k}: {c["title"]}', c['desc'], body), encoding='utf-8')
        report.append({'archivo': name, 'R_equivalente_ohm': c['expected'], 'I_amperios': c['volts'] / c['expected']})
    taller = []
    for k, (c, volts) in enumerate(zip(B5, B5_VOLTS), 1):
        current, _ = c.solve()
        assert math.isclose(volts / current, c.expected, rel_tol=1e-9), (c.title, volts / current, c.expected)
        width, height, body = c.svg()
        name = f'boletin-5-{k}'
        (OUTPUT / (name + '.svg')).write_text(svg_document(width, height, f'Boletín 5, ejercicio {k}: {c.title}', c.desc, body), encoding='utf-8')
        report.append({'archivo': name, 'R_equivalente_ohm': c.expected, 'I_amperios': current})
        taller.append(c.data(volts))
    DATOS.write_text('// Generado por scripts/generar_boletines_4_5.py. No editar a mano.\n'
                     'window.CIRCUITOS_NUDOS = ' + json.dumps(taller, ensure_ascii=False) + ';\n', encoding='utf-8')
    return report


if __name__ == '__main__':
    print(json.dumps(generate(), indent=2, ensure_ascii=False))
