"""Solucionario de los programas del tema 2 y contraste con el simulador web.

Uso:  python scripts/generar_trazas_cpu.py [--web]

Solo biblioteca estándar para el solucionario. Para cada programa:
  - lo ejecuta con un modelo en Python de la misma máquina que web/assets/ut02-cpu.js
    (formato operación-dirección, 4 cifras decimales, 0000 = fin),
  - escribe la traza paso a paso (búsqueda, decodificación, ejecución) con los valores
    de CP, RI, RD, RM y AC en temario/soluciones/ut02-programas-solucionario.md,
  - con --web, abre web/temas/ut02-ejercicios-cpu.html en Chromium (Playwright), carga cada
    programa en el simulador y comprueba que el AC y la memoria finales coinciden.

Los seis programas son los del ejercicio 8 del boletín del profesor. Los retos R1-R3 son
programas que escribe el alumnado; aquí se guarda una solución posible.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SALIDA = ROOT / 'temario/soluciones/ut02-programas-solucionario.md'

ESTANDAR = {1: 'cargar', 2: 'almacenar', 3: 'sumar', 4: 'restar', 5: 'multiplicar', 6: 'dividir'}
LIBRO = {1: 'cargar', 2: 'restar', 3: 'almacenar'}

PROGRAMAS = [
    ('Programa 1', ESTANDAR, 100, {100: 1300, 101: 3301, 102: 2301, 300: 16, 301: 7}),
    ('Programa 2', ESTANDAR, 110, {110: 1302, 111: 4303, 112: 2303, 302: 13, 303: 10}),
    ('Programa 3', ESTANDAR, 110, {110: 1304, 111: 5305, 112: 2305, 304: 25, 305: 3}),
    ('Programa 4', ESTANDAR, 130, {130: 1309, 131: 6308, 132: 3307, 133: 4306, 134: 2309,
                                   306: 3, 307: 6, 308: 2, 309: 8}),
    ('Programa 5', ESTANDAR, 140, {140: 1310, 141: 3310, 142: 3313, 143: 4312, 144: 2312,
                                   310: 5, 311: 10, 312: 15, 313: 20}),
    ('Programa 6', ESTANDAR, 150, {150: 1317, 151: 5315, 152: 4316, 153: 5315, 154: 2314,
                                   314: 1, 315: 2, 316: 3, 317: 4}),
    ('Ejemplo de los apuntes', LIBRO, 250, {250: 1408, 251: 2409, 252: 3409, 408: 9, 409: 5}),
    # Retos del simulador: una solución posible de cada uno.
    ('Reto R1 · (A + B) × C', ESTANDAR, 100, {100: 1200, 101: 3201, 102: 5202, 103: 2203,
                                              200: 4, 201: 6, 202: 3}),
    ('Reto R2 · horas a minutos', ESTANDAR, 100, {100: 1200, 101: 5201, 102: 2202, 200: 3, 201: 60}),
    ('Reto R3 · media de tres notas', ESTANDAR, 100, {100: 1200, 101: 3201, 102: 3202, 103: 6203,
                                                     104: 2204, 200: 7, 201: 5, 202: 9, 203: 3}),
]

# Resultado esperado escrito a mano (AC final y celda guardada) para detectar errores del modelo.
ESPERADO = {
    'Programa 1': (23, 301), 'Programa 2': (3, 303), 'Programa 3': (75, 305),
    'Programa 4': (7, 309), 'Programa 5': (15, 312), 'Programa 6': (10, 314),
    'Ejemplo de los apuntes': (4, 409), 'Reto R1 · (A + B) × C': (30, 203),
    'Reto R2 · horas a minutos': (180, 202), 'Reto R3 · media de tres notas': (7, 204),
}


def f4(v):
    return ('-' if v < 0 else '') + str(abs(v)).zfill(4)


def ejecutar(juego, inicio, memoria):
    mem = dict(memoria)
    cp, ri, rd, rm, ac = inicio, None, None, None, 0
    pasos = []

    def anota(fase, texto):
        pasos.append((fase, cp, ri, rd, rm, ac, texto))

    for _ in range(100):
        rd = cp
        anota('Búsqueda', f'RD ← CP ({cp:03d}); la dirección sale por el bus de direcciones')
        rm = mem.get(rd, 0)
        anota('Búsqueda', f'Lectura de {rd:03d}: RM ← {f4(rm)}')
        ri = rm
        cp += 1
        anota('Búsqueda', f'RI ← RM ({f4(ri)}); CP ← {cp:03d}')
        if ri == 0:
            anota('Fin', '0000: fin del programa')
            return mem, ac, pasos
        op, d = divmod(ri, 1000)
        accion = juego[op]
        anota('Decodificación', f'Operación {op} = {accion}; dirección {d:03d}')
        rd = d
        anota('Ejecución', f'RD ← {d:03d}')
        if accion == 'almacenar':
            rm = ac
            anota('Ejecución', f'RM ← AC ({f4(ac)})')
            mem[rd] = rm
            anota('Ejecución', f'Escritura: M[{rd:03d}] ← {f4(rm)}')
            continue
        rm = mem.get(rd, 0)
        anota('Ejecución', f'Lectura de {rd:03d}: RM ← {f4(rm)}')
        antes = ac
        if accion == 'cargar':
            ac = rm
            anota('Ejecución', f'AC ← RM = {f4(ac)}')
        else:
            if accion == 'sumar':
                ac = antes + rm
            elif accion == 'restar':
                ac = antes - rm
            elif accion == 'multiplicar':
                ac = antes * rm
            elif accion == 'dividir':
                ac = int(antes / rm)
            signo = {'sumar': '+', 'restar': '−', 'multiplicar': '×', 'dividir': '÷'}[accion]
            anota('Ejecución', f'UAL: AC ← {antes} {signo} {rm} = {ac}')
    raise AssertionError('el programa no termina')


def celda(v, ancho):
    return '—' if v is None else (str(v).zfill(3) if ancho == 3 else f4(v))


def main():
    resultados = {}
    md = ['# Tema 2 · Solucionario de los programas (ejecución de instrucciones)', '',
          'Generado por `scripts/generar_trazas_cpu.py`. No se publica en la página del alumnado.',
          'Valores tras cada paso. CP = contador de programa, RI = registro de instrucción,',
          'RD = registro de direcciones, RM = registro de memoria, AC = acumulador.', '',
          'Juego de instrucciones del boletín: 1 cargar, 2 almacenar, 3 sumar, 4 restar, 5 multiplicar, 6 dividir.',
          'El ejemplo de los apuntes usa otro: 1 cargar, 2 restar, 3 almacenar.', '']
    for nombre, juego, inicio, memoria in PROGRAMAS:
        mem, ac, pasos = ejecutar(juego, inicio, memoria)
        ac_esp, celda_esp = ESPERADO[nombre]
        assert ac == ac_esp and mem[celda_esp] == ac_esp, (nombre, ac, mem)
        resultados[nombre] = (juego is LIBRO, inicio, memoria, ac, mem)
        escritas = sorted({int(t.split('M[')[1][:3]) for *_, t in pasos if t.startswith('Escritura')})
        def destino(d):
            if mem[d] == memoria.get(d, 0):
                return f'{d:03d} (ya contenía {f4(mem[d])}: se escribe, pero el valor no cambia)'
            return f'{d:03d} (pasa de {f4(memoria.get(d, 0))} a {f4(mem[d])})'
        md += [f'## {nombre}', '',
               'Memoria inicial: ' + ', '.join(f'{d:03d}: {f4(v)}' for d, v in sorted(memoria.items())), '',
               f'**Resultado:** AC = {ac}; se guarda en ' + ', '.join(destino(d) for d in escritas) + '.', '',
               '| Fase | CP | RI | RD | RM | AC | Qué sucede |', '|---|---|---|---|---|---|---|']
        for fase, cp, ri, rd, rm, acp, texto in pasos:
            md.append(f'| {fase} | {cp:03d} | {celda(ri, 4)} | {celda(rd, 3)} | {celda(rm, 4)} | {f4(acp)} | {texto} |')
        md.append('')
        print(f'{nombre}: AC = {ac}, celdas escritas {escritas}')
    SALIDA.write_text('\n'.join(md), encoding='utf-8')
    print('solucionario:', SALIDA.relative_to(ROOT))
    if '--web' in sys.argv:
        contrastar_web(resultados)


def contrastar_web(resultados):
    from playwright.sync_api import sync_playwright
    pagina = (ROOT / 'web/temas/ut02-ejercicios-cpu.html').as_uri()
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page()
        errores = []
        pg.on('pageerror', lambda e: errores.append(str(e)))
        pg.goto(pagina)
        pg.wait_for_function('document.querySelector(".cpu-sim").simulador')
        for nombre, (libro, inicio, memoria, ac, mem) in resultados.items():
            r = pg.evaluate('''([libro, inicio, memoria]) => {
                const s = document.querySelector('.cpu-sim').simulador;
                s.cargar(libro ? 'libro' : 'libre');
                s.base = {}; Object.entries(memoria).forEach(([k, v]) => { s.base[k] = v; });
                s.inicio = inicio; s.cargar(s.clave, true); s.hastaFinal();
                return { ac: s.est.AC, mem: s.mem, fin: s.fin, filas: s.traza.tBodies[0].rows.length };
            }''', [libro, inicio, {str(k): v for k, v in memoria.items()}])
            web_mem = {int(k): v for k, v in r['mem'].items()}
            assert r['fin'] and r['ac'] == ac and web_mem == mem, (nombre, r, ac, mem)
            print(f'web · {nombre}: coincide (AC = {r["ac"]}, {r["filas"]} instrucciones en la traza)')
        assert not errores, errores
        nav.close()


if __name__ == '__main__':
    main()
