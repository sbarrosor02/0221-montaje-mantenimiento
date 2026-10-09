"""Genera los esquemas del repaso para el examen de circuitos (tema 1).

Uso:  python scripts/generar_repaso_examen.py

Dos tipos de circuito, con el formato del examen de 2024:
  Tipo 1 · bloque de tres ramas (con una unión intermedia), dos resistencias en
           serie y un paralelo final.
  Tipo 2 · la fuente en una rama central, en serie con una resistencia; a un
           lado una «escalera» y al otro resistencias en paralelo.
Cada red se resuelve por análisis nodal y se contrasta con su reducción
serie/paralelo. Escribe los SVG en web/assets/img/circuitos/ y muestra los
resultados (los que aparecen en «Comprueba tu resultado»).
"""
from pathlib import Path
import json
import math
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar_boletines_4_5 import Free, OUTPUT, parallel, svg_document  # noqa: E402


def tipo1(titulo, V, top, mid, bot, r8, serie, par, corto=False):
    """top = (R1, R2, R3) · bot = (R4, R5) · mid = (R6, R7) · r8 · serie = (R9, R10) · par = (R11 abajo, R12 arriba)."""
    pts = dict(s0=(0, 4.4), s1=(0, 0), L0=(1.5, 0), L1=(1.5, 1.6), L2=(1.5, 3), a1=(3.3, 0), a2=(5.1, 0), M0=(6.9, 0),
               m1=(3.3, 1.6), X=(5.1, 1.6), M1=(6.9, 1.6), b1=(3.3, 3), Y=(5.1, 3),
               n1=(8.7, 1.6), N=(10.5, 1.6), Nu=(10.5, 0.8), Nd=(10.5, 2.4), Eu=(12.3, 0.8), Ed=(12.3, 2.4), Er=(12.3, 4.4))
    wires = [['s1', 'L0'], ['L0', 'L1', 'L2'], ['M0', 'M1'], ['Y', 'X'], ['Nu', 'N', 'Nd'], ['Eu', 'Ed', 'Er', 's0']]
    if corto:
        pts['Mb'] = (6.9, 3)
        wires.append(['Y', 'Mb', 'M1'])
    res = [(1, 'L0', 'a1', top[0]), (2, 'a1', 'a2', top[1]), (3, 'a2', 'M0', top[2]),
           (4, 'L2', 'b1', bot[0]), (5, 'b1', 'Y', bot[1]),
           (6, 'L1', 'm1', mid[0]), (7, 'm1', 'X', mid[1]), (8, 'X', 'M1', r8),
           (9, 'M1', 'n1', serie[0]), (10, 'n1', 'N', serie[1]),
           (12, 'Nu', 'Eu', par[1]), (11, 'Nd', 'Ed', par[0])]
    rama = parallel(mid[0] + mid[1], bot[0] + bot[1])
    if corto:
        bloque = parallel(sum(top), rama)
    else:
        bloque = parallel(sum(top), rama + r8)
    esperado = bloque + serie[0] + serie[1] + parallel(*par)
    return Free(titulo, pts, wires, res, [('s0', 's1', fmtv(V), V)], esperado, '', [])


def tipo2(titulo, V, r1, r2, r3, r4, r5, derecha, r9=None):
    """Escalera izquierda: R3 + (R4 ∥ (R1 + R2)) · fuente con R5 · derecha: [R9 +] (R6 ∥ R7 [∥ R8])."""
    pts = dict(P=(0, 0), Pb=(0, 4), Q=(2, 0), Qb=(2, 4), T=(4, 0), F=(4, 2), Tb=(4, 4))
    res = [(1, 'P', 'Pb', r1), (2, 'P', 'Q', r2), (4, 'Q', 'Qb', r4), (3, 'Q', 'T', r3), (5, 'T', 'F', r5)]
    arriba, abajo = ([] if r9 else ['T']), ['Pb', 'Qb', 'Tb']
    for n, valor in enumerate(derecha):
        pts[f'u{n}'], pts[f'd{n}'] = (6 + 2 * n, 0), (6 + 2 * n, 4)
        res.append((6 + n, f'u{n}', f'd{n}', valor))
        arriba.append(f'u{n}')
        abajo.append(f'd{n}')
    if r9:
        res.append((9, 'T', 'u0', r9))
    wires = [abajo] + ([arriba] if len(arriba) > 1 else [])
    izquierda = r3 + parallel(r4, r1 + r2)
    lado = parallel(*derecha) + (r9 or 0)
    esperado = r5 + parallel(izquierda, lado)
    return Free(titulo, pts, wires, res, [('Tb', 'F', fmtv(V), V)], esperado, '', [])


def fmtv(V):
    return ('%g' % V).replace('.', ',') + ' V'


k = 1000
CIRCUITOS = [
    # nombre, circuito, tensión, resistencias por las que se pregunta la corriente
    ('repaso-1', tipo1('Bloque de ramas', 24, (2, 2, 2), (1, 5), (4, 2), 3, (3, 2), (12, 6)), 24, [11, 12, 4]),
    ('repaso-2', tipo1('Bloque de ramas con resistencia escondida', 20, (2, 2, 2), (2, 4), (4, 2), 5, (4, 2), (6, 3), corto=True), 20, [8, 11, 12]),
    ('repaso-3', tipo1('Bloque de ramas en kiloohmios', 12, (1 * k, 2 * k, 3 * k), (4 * k, 2 * k), (3 * k, 3 * k), 3 * k, (1 * k, 2 * k), (12 * k, 12 * k)), 12, [11, 8, 1]),
    ('repaso-4', tipo2('Fuente en medio', 12, 2 * k, 4 * k, 4 * k, 3 * k, 2 * k, [6 * k, 12 * k, 12 * k]), 12, [4, 6]),
    ('repaso-5', tipo2('Fuente en medio con dos ramas', 24, 1 * k, 2 * k, 2 * k, 6 * k, 1 * k, [12 * k, 6 * k]), 24, [3, 7]),
    ('repaso-6', tipo2('Fuente en medio con serie a la derecha', 18, 2 * k, 1 * k, 1 * k, 6 * k, 3 * k, [2 * k, 2 * k], r9=2 * k), 18, [9, 4]),
    ('simulacro-1', tipo1('Simulacro · ejercicio 1', 30, (4, 4, 4), (2, 4), (3, 3), 9, (3, 2), (6, 12)), 30, [11, 12, 1]),
    ('simulacro-2', tipo2('Simulacro · ejercicio 2', 15, 3 * k, 1 * k, 2 * k, 4 * k, 1 * k, [12 * k, 6 * k]), 15, [4, 7]),
]


def generate():
    resultados = {}
    for nombre, c, V, preguntas in CIRCUITOS:
        I, corrientes = c.solve()
        assert math.isclose(V / I, c.expected, rel_tol=1e-9), (nombre, V / I, c.expected)
        w, h, body = c.svg()
        (OUTPUT / (nombre + '.svg')).write_text(svg_document(w, h, 'Repaso para el examen: ' + c.title, descripcion(c), body), encoding='utf-8')
        resultados[nombre] = {'R_total': c.expected, 'I_total': I, 'I': {f'R{n}': corrientes[n] for n in preguntas}}
    return resultados


def descripcion(c):
    partes = [f'R{n} de {v:g} ohmios' if v < 1000 else f'R{n} de {v / 1000:g} kiloohmios' for n, _, _, v, *_ in sorted(c.resistors)]
    return f'Circuito alimentado a {c.sources[0][2]} con ' + ', '.join(partes) + '.'


if __name__ == '__main__':
    print(json.dumps(generate(), indent=1, ensure_ascii=False))
