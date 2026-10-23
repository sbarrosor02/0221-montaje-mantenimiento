"""Solucionario del tema 4 (boletines 1-4).

Uso:  python scripts/generar_ut04_solucionario.py

- Calcula los resultados numéricos (tiempos de copia, TBW, rangos de tolerancia,
  diagnóstico de las fuentes, potencia de la fuente y del SAI).
- Lee las tablas de los interactivos de la web (web/assets/ut04-interactivos.js) y
  comprueba que usan las mismas tolerancias, eficiencias y fórmulas.
- Lee los datos de los enunciados de web/temas/ut04-ejercicios.html para que el
  solucionario no se quede desfasado si cambia un dato.
- Si hay Node.js, ejecuta la función de tolerancias de la web con las medidas del
  ejercicio 2.4 y comprueba que da el mismo veredicto.
- Escribe temario/soluciones/ut04-ejercicios-solucionario.md (no se publica en la web).
"""
from pathlib import Path
import json
import math
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
JS = ROOT / 'web/assets/ut04-interactivos.js'
HTML = ROOT / 'web/temas/ut04-ejercicios.html'
SALIDA = ROOT / 'temario/soluciones/ut04-ejercicios-solucionario.md'

TOL = {'12v': (12, 0.05), '5v': (5, 0.05), '3v3': (3.3, 0.05), '5vsb': (5, 0.05), 'n12v': (-12, 0.10)}
NOMBRE = {'12v': '+12 V', '5v': '+5 V', '3v3': '+3,3 V', '5vsb': '5VSB', 'n12v': '–12 V'}
GOLD = 0.90


def es(x, d=2):
    """Número con coma decimal y sin ceros sobrantes."""
    t = f'{x:.{d}f}'
    if '.' in t:
        t = t.rstrip('0').rstrip('.')
    return t.replace('.', ',')


def rango(linea):
    v, t = TOL[linea]
    a, b = v * (1 - t), v * (1 + t)
    return min(a, b), max(a, b)


def dentro(linea, medida):
    lo, hi = rango(linea)
    return lo - 1e-9 <= medida <= hi + 1e-9


def contrastar_web():
    js = JS.read_text(encoding='utf-8')
    for k, (v, t) in TOL.items():
        vs = str(int(v)) if float(v).is_integer() else str(v)
        assert re.search(r"id: '%s', n: '[^']*', v: %s, t: %s \}" % (k, re.escape(vs), re.escape(f'{t:.2f}')), js), ('tolerancia distinta en la web', k)
    assert "['80 PLUS Gold', 0.90]" in js
    assert 'recomendada = Math.ceil(total * 1.3 / 50) * 50' in js and 'pared = total / e[1]' in js
    print('interactivos de la web: mismas tolerancias y fórmulas que el solucionario')


def leer_enunciados():
    h = HTML.read_text(encoding='utf-8')
    v = lambda s: float(s.replace(',', '.'))
    m = re.search(r'1\.2</span>.*?de (\d+) GB.*?a\) ([\d,]+) MB/s.*?b\) ([\d,]+) MB/s.*?c\) ([\d,]+) MB/s', h, re.S)
    copia = (v(m[1]), [v(m[2]), v(m[3]), v(m[4])])
    m = re.search(r'1\.3</span>.*?garantía de (\d+) TBW.*?escribe (\d+) GB al día', h, re.S)
    tbw = (v(m[1]), v(m[2]))
    fuentes = {}
    for f, a, b, c, d in re.findall(r'<tr><td>([ABC])</td><td>([\d,]+) V</td><td>([\d,]+) V</td><td>([\d,]+) V</td><td>([\d,]+) V</td></tr>', h):
        fuentes[f] = dict(zip(['12v', '5v', '3v3', '5vsb'], map(v, (a, b, c, d))))
    m = re.search(r'2\.6</span>.*?procesador de (\d+) W, una gráfica de (\d+) W y el resto consume (\d+) W', h, re.S)
    pot = [int(m[i]) for i in (1, 2, 3)]
    m = re.search(r'Un servidor consume (\d+) W\. ¿Sirve un SAI de (\d+) VA / (\d+) W\? ¿Y uno de (\d+) VA / (\d+) W\?', h)
    sai = [int(m[i]) for i in range(1, 6)]
    assert len(fuentes) == 3
    return copia, tbw, fuentes, pot, sai


def node_tolerancias(fuentes):
    if not shutil.which('node'):
        return None
    datos = json.dumps(fuentes)
    pre = "global.window={};global.document={readyState:'complete',querySelectorAll:()=>[]};"
    cod = pre + "require('./web/assets/ut04-interactivos.js');const f=" + datos + ";const r={};" \
          "for(const k in f){r[k]={};for(const l in f[k])r[k][l]=window.UT04.evaluar(l,f[k][l]).ok;}console.log(JSON.stringify(r));"
    r = subprocess.run(['node', '-e', cod], capture_output=True, text=True, cwd=ROOT, check=True)
    return json.loads(r.stdout)


def main():
    contrastar_web()
    (gb, velocidades), (tbw, gb_dia), fuentes, (cpu, gpu, resto), (srv, va1, w1, va2, w2) = leer_enunciados()

    md = ['# Tema 4 · Solucionario de los boletines', '',
          'Generado por `scripts/generar_ut04_solucionario.py`. No se publica en la web.',
          'Los datos se leen del enunciado y los resultados se contrastan con los interactivos de la web.', '']

    # ------------------------------------------------------------ boletín 1
    tiempos = [gb * 1000 / s for s in velocidades]
    dias = tbw * 1000 / gb_dia
    md += ['## Boletín 1 · Almacenamiento e interfaces', '',
           '**1.1** a) NVMe: el sistema y los proyectos de vídeo necesitan la máxima velocidad. '
           'b) HDD: el menor coste por TB para un gran volumen que no exige velocidad. '
           'c) SSD SATA de 2,5″: es lo único que admite esa bahía, y multiplica la velocidad del equipo. '
           'd) NVMe en la ranura M.2 libre: más rápido y sin cables (comprobar en el manual qué admite esa ranura).', '',
           f'**1.2** t = tamaño ÷ velocidad, con {es(gb, 0)} GB = {es(gb * 1000, 0)} MB. '
           + ' · '.join(f'{l}) {es(gb * 1000, 0)} ÷ {es(s, 0)} ≈ **{es(t, 1)} s**' for l, s, t in zip('abc', velocidades, tiempos))
           + f'. El NVMe es unas {es(tiempos[0] / tiempos[2], 0)} veces más rápido que el disco duro.', '',
           f'**1.3** {es(tbw, 0)} TB = {es(tbw * 1000, 0)} GB. {es(tbw * 1000, 0)} ÷ {es(gb_dia, 0)} = {es(dias, 0)} días '
           f'÷ 365 ≈ {es(dias / 365, 1)} → **{math.floor(dias / 365)} años**. Para un uso normal el desgaste no es un problema.', '',
           '**1.4** Los dos tienen el mismo tamaño, pero el M.2 SATA usa la interfaz SATA (unos 550 MB/s, llave B+M) y el NVMe '
           'usa PCIe x4 (llave M). No funcionan en cualquier ranura: algunas M.2 solo admiten NVMe y otras solo SATA. '
           'Se comprueba en el manual de la placa (especificaciones de cada ranura M.2).', '',
           '**1.5** Disco de 3,5″: SATA, cable de datos SATA y alimentación SATA. SSD NVMe: PCIe en ranura M.2, sin cables. '
           'Blu-ray interna: SATA, datos y alimentación SATA, en bahía de 5,25″. Disco externo de 20 Gbit/s: USB 20 Gbps '
           '(3.2 Gen 2×2) con conector USB-C. Memoria de 480 Mbit/s: USB 2.0, conector USB-A.', '',
           '**1.6** No. Los sectores reasignados (148) y sobre todo los pendientes (12) indican que la superficie se está '
           'degradando; además, 31 250 h son unos 3,6 años encendido sin parar. La temperatura es normal. '
           'Hay que hacer copia de los datos inmediatamente y sustituir el disco.', '']

    # ------------------------------------------------------------ boletín 2
    md += ['## Boletín 2 · Fuente de alimentación y SAI', '',
           '**2.1** Filtro EMI (impide que el ruido vuelva a la red) → rectificador y PFC (pasa a continua de unos 400 V y '
           'toma la corriente de forma eficiente) → conmutación y transformador (trocea a alta frecuencia, reduce la tensión '
           'y aísla de la red) → rectificación y filtrado de salida (deja una continua limpia de 12 V, y de ahí 5 y 3,3 V).', '',
           '**2.2** Amarillo +12 V (procesador, gráfica, ventiladores) · rojo +5 V (USB, lógica, discos de 2,5″) · '
           'naranja +3,3 V (chips de la placa, M.2, PCIe) · morado 5VSB (encendido desde reposo, USB con el equipo apagado) · '
           'verde PS_ON (encendido) · gris PWR_OK (tensiones estables).', '',
           '**2.3**', '', '| Línea | Tolerancia | Mínimo | Máximo |', '|---|---|---|---|']
    for k in ['12v', '5v', '3v3', 'n12v']:
        lo, hi = rango(k)
        md.append(f'| {NOMBRE[k]} | ± {es(TOL[k][1] * 100, 0)} % | {es(lo, 3).replace('-', '–')} V | {es(hi, 3).replace('-', '–')} V |')
    md += ['', '**2.4**', '', '| Fuente | ' + ' | '.join(NOMBRE[k] for k in ['12v', '5v', '3v3', '5vsb']) + ' | Diagnóstico |',
           '|---|---|---|---|---|---|']
    web = node_tolerancias(fuentes)
    diag = {}
    for f, med in fuentes.items():
        mal = [k for k in med if not dentro(k, med[k])]
        if web:
            assert all(web[f][k] == dentro(k, med[k]) for k in med), ('veredicto distinto en la web', f)
        celdas = [f"{es(med[k])} V {'✓' if dentro(k, med[k]) else '✗'}" for k in ['12v', '5v', '3v3', '5vsb']]
        diag[f] = 'Correcta: todas las líneas dentro de tolerancia.' if not mal else \
            'Defectuosa: fuera de tolerancia ' + ', '.join(NOMBRE[k] for k in mal) + '. No se monta; se sustituye.'
        md.append(f'| {f} | ' + ' | '.join(celdas) + f' | {diag[f]} |')
    md += ['', 'La fuente B, con +12 V bajo, causaría reinicios al exigir potencia al procesador o a la gráfica. '
           + ('(Veredictos contrastados con la función de tolerancias de la web.)' if web else '(Node no disponible: veredictos sin contrastar con la web.)'), '',
           '**2.5** Con la fuente desenchufada y el interruptor en O: conectar una carga (ventilador o disco) y un puente entre '
           'el verde (PS_ON) y un negro, o el comprobador. Polímetro en V⎓, rango 20 V, punta negra en un negro y roja en la '
           'línea (amarillo en un Molex o SATA). Revisión del profesor, enchufar, encender, medir sin tocar nada más. '
           'Apagar y desenchufar antes de retirar el puente.', '']
    total = cpu + gpu + resto
    rec = math.ceil(total * 1.3 / 50) * 50
    pared = total / GOLD
    md += [f'**2.6** a) {cpu} + {gpu} + {resto} = **{total} W**. '
           f'b) {total} × 1,3 = {es(total * 1.3, 1)} W → **{rec} W**. '
           f'c) {total} ÷ 0,90 ≈ **{es(pared, 0)} W** del enchufe; se pierden unos **{es(pared - total, 0)} W** en calor '
           '(mismo resultado que la calculadora de la web).', '']
    md += ['**2.7** a) Con red: entrada → filtro y AVR → salida; el cargador mantiene la batería. Sin red: batería → '
           'inversor → conmutador → salida. '
           f'b) {srv} W > {w1} W: el de {va1} VA **no sirve**. El de {va2} VA / {w2} W **sí** '
           f'(trabaja al {es(srv / w2 * 100, 0)} % de su capacidad). '
           'c) Entrada: alterna ≈ 230 V. Salida en batería: alterna ≈ 230 V (senoidal o casi senoidal según el tipo de SAI). '
           'Bornes de la batería: continua, 12,6–13,8 V.', '']

    # ------------------------------------------------------------ boletín 3
    md += ['## Boletín 3 · Preparar y montar', '',
           '**3.1** PH2 imantado (tornillos; cuidado de no rayar la placa), precisión PH0/PH1 (tornillo M.2), pulsera '
           'antiestática (descarga estática; pinza en metal sin pintar), pasta térmica y alcohol isopropílico (lejos de llamas, '
           'ventilación), paños sin pelusa, bridas y alicates de corte (cortar hacia fuera, sin dejar puntas), linterna, '
           'bandeja de tornillos, polímetro (medir solo con supervisión, puntas en buen estado).', '',
           '**3.2** Respuesta abierta: se corrige con el manual de la placa indicada.', '',
           '**3.3** Placa: correcta, pero la caja abollada se anota en el albarán del transportista y se revisa la placa con '
           'detalle antes de aceptarla. Memoria: DDR4 en lugar de DDR5, no es compatible con una B650: devolución. SSD: '
           'correcto. Fuente: 550 W Bronze en lugar de 650 W Gold: no es lo pedido, se reclama aunque funcionara. Caja: '
           'falta la bolsa de tornillos: se reclama el accesorio. Todo se comunica al proveedor antes de montar.', '',
           '**3.4** Ejemplos: componentes en bolsa antiestática y caja original; almacén seco, templado y sin sol directo; '
           'discos duros sin golpes ni apilados bajo peso; estanterías etiquetadas con registro de entradas y salidas, y lo '
           'más antiguo primero; baterías con carga parcial, en lugar fresco y lejos de material inflamable.', '',
           '**3.5** a) 6-32. b) M3. c) Separadores y tornillos (6-32 o M3 según la caja). d) Tornillo M2 o pestillo. '
           'e) 6-32. f) 6-32. Un 6-32 forzado en una rosca M3 la pasa y la estropea (y al revés el tornillo queda flojo).', '',
           '**3.6** Errores: 1) la fuente nunca se enchufa mientras se monta (riesgo eléctrico y de dañar componentes): '
           'se enchufa solo para el primer arranque. 2-3) procesador y disipador se montan fuera de la caja, antes de '
           'atornillar la placa (espacio, luz, sin riesgo de doblar pines). 4) A1 y A2 están en el mismo canal: para doble '
           'canal van normalmente en A2 y B2, según el manual.', '']

    # ------------------------------------------------------------ boletín 4
    md += ['## Boletín 4 · Arranque, diagnóstico e informe', '',
           '**4.1** 16 GB de 32: un módulo no está bien insertado o la ranura falla: apagar, desenchufar y reinsertarlo; si '
           'sigue, probar el módulo en otra ranura. 4800 MHz: es la velocidad por defecto; activar XMP/EXPO para llegar a '
           '6000. El SSD está bien. Fecha: ajustarla; si se pierde al apagar, cambiar la pila.', '',
           '**4.2** a) MemTest86: 0 errores. b) CrystalDiskMark: cerca de las velocidades de la ficha. c) HWiNFO o HWMonitor '
           'durante Cinebench u OCCT: por debajo de unos 85–90 °C. d) CPU-Z (pestaña Memory): «Dual». e) CrystalDiskInfo o '
           'smartctl: estado «Bueno», 0 sectores reasignados y pendientes.', '',
           '**4.3** a) Fallo de memoria: reinsertar los módulos, probar uno solo y en la ranura que indica el manual, '
           'comprobar compatibilidad (QVL). b) Memoria defectuosa: probar módulo a módulo para identificar el malo y '
           'sustituirlo. ' + f"c) La temperatura es normal; +12 V a 11,2 V está por debajo de {es(rango('12v')[0], 2)} V: la fuente no "
           'aguanta la carga; sustituirla. d) El disipador no hace contacto: plástico protector sin quitar, sin pasta, mal '
           'apretado o el ventilador desconectado. Apagar enseguida y revisar.', '',
           '**4.4** Datos generales; componentes con número de serie (tabla); recepción e incidencias (tabla y fotos de '
           'daños); proceso (fotos de cada fase); UEFI (fotos de las pantallas); medidas (tabla de tensiones); diagnóstico '
           '(capturas de MemTest86, SMART, CrystalDiskMark, temperaturas); conclusión.', '',
           '**4.5** Defectos: faltan datos generales (técnico, fecha, cliente); componentes sin marca, modelo ni número de '
           'serie («RAM 16», «disco SSD»); «funciona bien» sin pruebas ni resultados; «tensiones correctas» sin valores '
           'medidos. Reescritura de ejemplo: «Equipo montado por X el 12/11/2026 para el aula 2. Placa ASUS PRIME B650M-A '
           '(n.º s. …), 2 × 16 GB DDR5-6000 (…), SSD NVMe 1 TB (…). MemTest86: 1 pasada, 0 errores. SMART: bueno. '
           'Tensiones con polímetro: +12 V 12,04 V, +5 V 5,02 V, +3,3 V 3,32 V, todas dentro de tolerancia. Apto.»', '']

    SALIDA.write_text('\n'.join(md) + '\n', encoding='utf-8')
    for f, d in diag.items():
        print(f'fuente {f}: {d}')
    print('escrito', SALIDA.relative_to(ROOT))


if __name__ == '__main__':
    main()
