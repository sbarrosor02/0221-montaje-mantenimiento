"""Solucionario del tema 3 (boletines 1-5 y retos del configurador).

Uso:  python scripts/generar_ut03_solucionario.py

- Calcula todos los resultados numéricos (latencias, anchos de banda, PCIe, VRAM,
  densidad de píxeles, conectores de vídeo, alimentación de gráficas, rack).
- Lee las tablas de las calculadoras de la web (web/assets/ut03-interactivos.js) y
  comprueba que usan los mismos valores que este script.
- Si hay Node.js, ejecuta el decodificador de nombres y el configurador de la web
  para los ejercicios 2.1 y C1, y los incluye en el solucionario.
- Escribe temario/soluciones/ut03-ejercicios-solucionario.md (no se publica en la web).
"""
from pathlib import Path
import json
import math
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
JS = ROOT / 'web/assets/ut03-interactivos.js'
SALIDA = ROOT / 'temario/soluciones/ut03-ejercicios-solucionario.md'

PCIE = {1: 0.25, 2: 0.5, 3: 0.985, 4: 1.969, 5: 3.938, 6: 7.563, 7: 15.125}
CONECTORES = {'HDMI 2.0': 14.4, 'HDMI 2.1': 42.67, 'HDMI 2.2': 85.33, 'DisplayPort 1.4': 25.92,
              'DisplayPort 2.1 (UHBR13.5)': 52.22, 'DisplayPort 2.1 (UHBR20)': 77.37}


def es(x, d=2):
    """Número con coma decimal y sin ceros sobrantes."""
    t = f'{x:.{d}f}'
    if '.' in t:
        t = t.rstrip('0').rstrip('.')
    return t.replace('.', ',')


def contrastar_web():
    js = JS.read_text(encoding='utf-8')
    tabla = re.search(r'var PCIE = \{([^}]*)\}', js)[1]
    web = {int(k): float(v) for k, v in re.findall(r'(\d):\s*([\d.]+)', tabla)}
    assert web == PCIE, ('PCIe distinto en la web', web)
    for nombre, valor in CONECTORES.items():
        assert f"['{nombre}', {valor}]" in js, ('conector distinto en la web', nombre)
    assert 'gbps = r[1] * r[2] * hz * bpp * 1.07 / 1e9' in js
    assert 'ns = cl * 2000 / mts' in js and 'gbs = mts * 8 * can / 1000' in js
    print('calculadoras de la web: mismas tablas y fórmulas que el solucionario')


def node(codigo):
    if not shutil.which('node'):
        return None
    pre = "global.window={};global.document={readyState:'complete',querySelectorAll:()=>[]};"
    r = subprocess.run(['node', '-e', pre + codigo], capture_output=True, text=True, cwd=ROOT, check=True)
    return json.loads(r.stdout)


def main():
    contrastar_web()
    md = ['# Tema 3 · Solucionario de los boletines y del configurador', '',
          'Generado por `scripts/generar_ut03_solucionario.py`. No se publica en la web.',
          'Los resultados numéricos se calculan en el script y se contrastan con las calculadoras de la web.', '']

    # ------------------------------------------------------------ boletín 1
    md += ['## Boletín 1 · Placa base', '',
           '**1.1** 305 × 244 = ATX · 244 × 244 = micro-ATX · 170 × 170 = Mini-ITX · 305 × 330 = E-ATX.', '',
           '**1.2** Regla: una caja admite su formato y los más pequeños. a) Sí. b) No. c) Sí. d) No.', '',
           '**1.3** CPU_FAN: ventilador del disipador del procesador · ATX12V: alimentación EPS de 12 V del procesador · '
           'JFP1: panel frontal (botones y LED) · USB3_1: USB 3.x frontal (19 pines) · HD_AUDIO: audio frontal · '
           'CLR_CMOS: borrar los ajustes de la UEFI · ADD_GEN2: iluminación ARGB de 5 V (3 pines) · SYS_FAN2: ventilador de la caja.', '',
           '**1.4** Distribución Intel: PWR_LED + pin 2, PWR_LED – pin 4, PWR_SW pines 6 y 8, HDD_LED + pin 1, HDD_LED – pin 3, '
           'RESET pines 5 y 7. Tienen polaridad los LED; los botones no. Un LED al revés no se enciende, pero no se rompe. '
           'Siempre hay que contrastarlo con la serigrafía o el manual de la placa concreta.', '',
           '**1.5** Respuesta abierta: se corrige con el manual que haya usado cada alumno.', '']

    # ------------------------------------------------------------ boletín 2
    nombres = ['Core i7-14700KF', 'Core Ultra 9 285K', 'Ryzen 5 7600X', 'Ryzen 7 5700X3D', 'Core i5-13420H', 'Ryzen 5 8500G']
    deco = node("require('./web/assets/ut03-interactivos.js');console.log(JSON.stringify(" + json.dumps(nombres) + ".map(n=>[n,window.UT03.decodificar(n)])))")
    md += ['## Boletín 2 · Procesador y refrigeración', '', '**2.1** (salida del decodificador de la web)', '']
    if deco:
        for n, r in deco:
            assert 'error' not in r, n
            partes = '; '.join(f'{k}: {v.rstrip(".")}' for k, v in r['filas'][1:])
            md.append(f'- **{n}**: {partes}. Zócalo: {r["socket"]}')
    else:
        md.append('- (Node.js no disponible: ejecutar de nuevo con Node para incluir la salida.)')
    md += ['', '**2.2** a) El B (8600G), que tiene gráfica integrada; el A es KF, sin gráfica. '
           'b) El A: 181 W en turbo frente a 88 W de PPT (65 W × 1,35). c) Zócalo LGA 1700 con chipset Z (Z790 o Z690): '
           'solo con Z se puede subir el multiplicador. d) No: son arquitecturas distintas y el trabajo por ciclo (IPC) '
           'y el número de núcleos cambian. Hay que mirar pruebas de rendimiento.', '',
           '**2.3** El zócalo LGA es lo más delicado: sus pines están al aire en la placa y se doblan con facilidad. La tapa '
           'se deja puesta hasta colocar el procesador, se guarda (la exige la garantía) y se vuelve a poner si se quita el '
           'procesador. En un portátil el procesador es BGA: va soldado a la placa.', '']
    ppt = [(t, t * 1.35) for t in (65, 105, 120, 170)]
    md.append('**2.4** ' + ' · '.join(f'{t} W → {es(p, 2)} W ≈ {round(p)} W' for t, p in ppt) + '.')
    assert [round(p) for _, p in ppt] == [88, 142, 162, 230]
    md += ['', '**2.5** a) No: 95 W < 125 W. b) Cabe (155 ≤ 165 mm) y aguanta la base, pero en turbo (253 W > 180 W) bajará '
           'la frecuencia. c) No cabe: 168 > 165 mm. d) No cabe: radiador de 360 mm en una caja que admite 280 mm. '
           'Elegiría la torre (b) sabiendo que el procesador limitará su turbo. Al cliente le propondría una AIO de 280 mm '
           '(si existe para esa potencia) o cambiar de caja.', '',
           '**2.6** En modo PWM el conector da 12 V constantes y el ventilador de 3 pines no entiende la señal PWM: gira '
           'siempre al máximo. Hay que poner ese conector en modo DC (control por tensión) en la UEFI.', '']
    entra, sale = 3 * 60, 3 * 60
    md.append(f'**2.7** a) Delanteros: entrada; trasero y superiores: salida. b) Entran {entra} CFM y salen {sale} CFM: '
              f'presión equilibrada (neutra). Para presión positiva, bajar la velocidad de un ventilador de salida o quitarlo. '
              f'c) {entra} CFM × 1,7 ≈ {es(entra * 1.699, 0)} m³/h.')
    md += ['', '**2.8** Material: pulsera antiestática, alcohol isopropílico (90 % o más), paño sin pelusa o filtros de café, '
           'pasta nueva, destornillador. Pasos: apagar y desenchufar; quitar el disipador aflojando los tornillos en cruz '
           '(si está pegado, girarlo un poco antes de tirar; mejor con el equipo templado); limpiar procesador y base sin '
           'dejar restos; poner una gota del tamaño de un guisante en el centro; montar el disipador apretando en cruz y '
           'de forma progresiva; conectar CPU_FAN; comprobar temperaturas en la UEFI o con HWMonitor/HWiNFO.', '']

    # ------------------------------------------------------------ boletín 3
    md += ['## Boletín 3 · Memoria y expansión', '']
    ram = [('DDR4-2666 CL19', 2666, 19), ('DDR4-3200 CL16', 3200, 16), ('DDR5-5200 CL40', 5200, 40),
           ('DDR5-6000 CL36', 6000, 36), ('DDR5-6400 CL32', 6400, 32)]
    lat = sorted(((n, cl * 2000 / mts) for n, mts, cl in ram), key=lambda x: x[1])
    md.append('**3.1** Latencia = CL × 2000 ÷ MT/s. De menor a mayor: ' +
              ' < '.join(f'{n} ({es(v, 2)} ns)' for n, v in lat) + '.')
    md.append('')
    bw = lambda mts, c: mts * 8 * c / 1000
    md.append(f'**3.2** a) 5600 × 8 B × 2 = {es(bw(5600, 2), 1)} GB/s. b) {es(bw(5600, 1), 1)} GB/s. '
              f'c) {es(bw(3200, 2), 1)} GB/s.')
    md += ['', f'**3.3** DDR: 2400 MHz × 2 = {2400 * 2} MT/s, la velocidad estándar JEDEC. No está estropeado: falta activar '
           'el perfil XMP (Intel) o EXPO (AMD) en la UEFI para que vaya a 6000 MT/s.', '',
           '**3.4** Un módulo: A2. Dos: A2 y B2 (un canal cada uno). Cuatro: todas. Para 32 GB, mejor 2 × 16 GB (doble canal). '
           'Para 64 GB en DDR5, mejor 2 × 32 GB: con cuatro módulos la placa suele bajar la velocidad. Siempre según el manual.', '']
    def enlace(dg, dl, sg, sl):
        g, l = min(dg, sg), min(dl, sl)
        return g, l, PCIE[g] * l
    casos = [('a) SSD PCIe 4.0 x4', (4, 4, 4, 4)), ('b) SSD PCIe 5.0 x4', (5, 4, 5, 4)),
             ('c) gráfica 4.0 x8 en ranura 3.0 x16', (4, 8, 3, 16)), ('d) gráfica 5.0 x16 en ranura 4.0 x4', (5, 16, 4, 4))]
    textos = []
    for t, (dg, dl, sg, sl) in casos:
        g, l, v = enlace(dg, dl, sg, sl)
        textos.append(f'{t}: enlace PCIe {g}.0 x{l} = {es(v, 2)} GB/s')
    md.append('**3.5** ' + ' · '.join(textos) + '. La d) funciona, pero con una cuarta parte de carriles y media velocidad '
              'por carril: es mala ranura para la gráfica.')
    assert abs(enlace(4, 8, 3, 16)[2] - 7.88) < 0.01 and abs(enlace(5, 16, 4, 4)[2] - 7.876) < 0.01
    md += ['', '**3.6** NVMe 1 en M2_1. El segundo NVMe en M2_2 desactiva SATA6G_5 y 6: los dos discos duros van en '
           'SATA6G_1 a 4. La capturadora PCIe x4 va en PCIEX16_2 y M2_3 se deja libre (si se ocupa, la ranura queda en x2).', '',
           '**3.7** a) Llave M, ranura M.2 PCIe. b) Llave E (A+E), ranura M.2 para Wi-Fi, con sus antenas. c) Llave B+M; '
           'solo funciona en una ranura que admita SATA. El 22110 no cabe: mide 110 mm y la ranura llega a 80 mm.', '']

    # ------------------------------------------------------------ boletín 4
    md += ['## Boletín 4 · UEFI, gráfica, monitor y chasis', '',
           '**4.1** Firmware: memoria flash (no se pierde). Ajustes: CMOS/NVRAM. Hora: RTC alimentado por la pila. Si se '
           'agota la pila, se desajusta la hora y en muchas placas se pierden los ajustes. Clear CMOS devuelve los ajustes '
           'de fábrica; el firmware no cambia.', '',
           '**4.2** a) La UEFI no reconoce el procesador nuevo: actualizarla (con el antiguo o con BIOS Flashback). '
           'b) XMP inestable: Clear CMOS y probar sin XMP o con menos velocidad. c) El 5600 no tiene gráfica integrada: '
           'hace falta una tarjeta gráfica. d) No encuentra sistema operativo: reconectar el SSD o revisar el orden de arranque.', '',
           '**4.3** a) No: con MBR solo se aprovechan 2 TB, y además Windows 11 necesita GPT y UEFI. b) TPM (PTT/fTPM) '
           'activado, CSM desactivado (arranque UEFI) y Secure Boot activado. c) Secure Boot comprueba la firma de los '
           'gestores de arranque UEFI; el arranque Legacy del CSM no tiene ese mecanismo.', '']
    alim = [('a) 250 W, 2 × 8 pines', 250, 75 + 2 * 150), ('b) 140 W, 1 × 6 pines', 140, 75 + 75),
            ('c) 75 W, sin conector', 75, 75), ('d) 320 W, 1 × 8 pines', 320, 75 + 150)]
    md.append('**4.4** Ranura 75 W, 6 pines 75 W, 8 pines 150 W. ' + ' · '.join(f'{t}: dispone de {d} W → {"sí" if d >= w else "no"}' for t, w, d in alim) +
              '. La d) necesitaría dos conectores de 8 pines (375 W) o uno 12V-2×6.')
    assert [d >= w for _, w, d in alim] == [True, True, True, False]
    vram = [('a) 128 bits, 18 Gbit/s', 128, 18), ('b) 192 bits, 21 Gbit/s', 192, 21), ('c) 256 bits, 30 Gbit/s', 256, 30)]
    md += ['', '**4.5** ' + ' · '.join(f'{t}: {b} ÷ 8 × {v} = {es(b / 8 * v, 0)} GB/s' for t, b, v in vram) + '.']
    ppp = [('a) 24″ Full HD', 1920, 1080, 24), ('b) 27″ QHD', 2560, 1440, 27), ('c) 27″ 4K', 3840, 2160, 27), ('d) 32″ 4K', 3840, 2160, 32)]
    md += ['', '**4.6** ppp = √(ancho² + alto²) ÷ pulgadas. ' +
           ' · '.join(f'{t}: {es(math.hypot(w, h) / d, 1)} ppp' for t, w, h, d in ppp) + '. El más nítido es el 27″ 4K.']
    mon = [('a) 4K 144 Hz 10 bits', 3840, 2160, 144, 30), ('b) QHD 240 Hz 8 bits', 2560, 1440, 240, 24),
           ('c) Full HD 360 Hz 8 bits', 1920, 1080, 360, 24)]
    lineas = []
    for t, w, h, hz, bpp in mon:
        g = w * h * hz * bpp * 1.07 / 1e9
        valen = [c for c, v in CONECTORES.items() if v >= g]
        lineas.append(f'{t}: {es(g, 1)} Gbit/s → sirven {", ".join(valen)}')
    md += ['', '**4.7** ' + ' · '.join(lineas) + '.']
    md += ['', '**4.8** Caja 1: la gráfica cabe (320 ≤ 330 mm), pero el disipador no (158 > 155 mm). Caja 2: gráfica y '
           'disipador caben, pero solo tiene una bahía de 3,5″ para dos discos. Ninguna sirve del todo. La caja 2 es mejor '
           'base (malla con filtro, USB-C): se resuelve cambiando un disco de 3,5″ por un SSD de 2,5″ o M.2. Para su USB-C '
           'frontal la placa necesita el conector USB-C interno.', '',
           '**4.9** Placa: manual, cables SATA, tornillos y separadores M.2, antenas Wi-Fi, adaptador de panel frontal, '
           'embellecedor trasero, pegatinas; controladores en USB/DVD o en la web. Gráfica: guía rápida, adaptador de '
           'alimentación, soporte antipandeo. Disipador: anclajes y placa trasera para cada zócalo, pasta térmica, clips del '
           'ventilador, llave o destornillador. Orden de controladores: chipset, red (para tener internet), gráfica, sonido, '
           'Wi-Fi/Bluetooth y utilidades.', '',
           f'**4.10** 2U = 2 × 44,45 = {es(2 * 44.45, 1)} mm. 42U = {es(42 * 44.45, 1)} mm ≈ {es(42 * 44.45 / 1000, 2)} m.', '']

    # ------------------------------------------------------------ boletín 5
    placa = [
        (1, 'SOCKET AM5', 'Zócalo del procesador, LGA 1718', 'Procesador AMD Ryzen; encima va el disipador.'),
        (2, 'DDR5 DIMM_A1, A2, B1, B2', 'Ranuras de memoria DDR5 (288 contactos)', 'Módulos DIMM DDR5; dos canales (A y B).'),
        (3, 'PCIEX16(G5), PCIEX16(G4)', 'Ranuras PCIe de tamaño x16', 'Tarjeta gráfica (en la G5) y otras tarjetas de expansión.'),
        (4, 'CPU_FAN, CPU_OPT, AIO_PUMP, CHA_FAN1–4, W_PUMP+', 'Conectores de ventilador y de bomba (4 pines)',
         'CPU_FAN: ventilador del disipador · CPU_OPT: segundo ventilador del disipador · AIO_PUMP: bomba de una AIO · '
         'CHA_FAN: ventiladores de la caja · W_PUMP+: bomba de una refrigeración líquida a medida.'),
        (5, 'CPU_12V_1, CPU_12V_2, ATX_PWR', 'Conectores de alimentación',
         'ATX_PWR: 24 pines, alimentación principal de la placa · CPU_12V: dos EPS de 8 pines para el VRM del procesador.'),
        (6, 'M.2_1 a M.2_4 (SOCKET3)', 'Ranuras M.2 llave M', 'SSD NVMe (PCIe).'),
        (7, 'SATA6G_1, SATA6G_2', 'Puertos SATA de 6 Gbit/s', 'Discos duros, SSD de 2,5″ y grabadoras con cable SATA.'),
        (8, 'U20G_C6', 'Conector interno USB-C de 20 Gbit/s', 'USB-C del panel frontal de la caja.'),
        (9, 'U5G_1011', 'Conector interno USB de 5 Gbit/s (19 pines)', 'Dos USB-A frontales de 5 Gbit/s (puertos 10 y 11).'),
        (10, 'USB_1617, USB_1415', 'Conectores internos USB 2.0 (9 pines)', 'Dos puertos USB 2.0 cada uno: USB frontales lentos, lector de tarjetas, controladora de una AIO.'),
        (11, 'ADD_GEN 2_1, 2_2, 2_3', 'Conectores ARGB Gen2 (5 V, 3 pines)', 'Tiras y ventiladores con iluminación direccionable.'),
        (12, 'CHASSIS', 'Conector de intrusión del chasis', 'Sensor que avisa en la UEFI si se ha abierto la caja.'),
        (13, 'CLRTC', 'Puente Clear CMOS (2 pines)', 'Borrar los ajustes de la UEFI y volver a los de fábrica.'),
        (14, 'COM', 'Conector del puerto serie', 'Soporte con un puerto serie RS-232 (equipos industriales, consolas de red).'),
        (15, 'F_AUDIO', 'Audio del panel frontal (HD Audio)', 'Auriculares y micrófono de la caja.'),
        (16, 'F_PANEL', 'Panel frontal del sistema', 'Botones de encendido y reinicio y LED de encendido y de disco.'),
        (17, 'T_SENSOR', 'Conector de sonda de temperatura', 'Termistor para medir la temperatura de un punto de la caja.'),
        (18, 'CPU, DRAM, VGA, BOOT', 'LED de diagnóstico (Q-LED)', 'Indican en qué paso del POST se detiene el arranque.'),
        (19, 'BIOS_FLBK, FLBK_LED', 'Botón y LED de BIOS FlashBack', 'Actualizar la UEFI desde un USB sin procesador ni memoria.'),
    ]
    assert [n for n, *_ in placa] == list(range(1, 20))
    md += ['## Boletín 5 · Placas base reales', '',
           '### 5.1 ASUS TUF GAMING X870-PLUS WIFI', '',
           'Datos contrastados con el manual de la placa (esquema y *Specifications summary*) y con su página de '
           'especificaciones en asus.com (noviembre de 2026).', '',
           '#### Parte A · El esquema', '',
           '**A1)**', '', '| N.º | Rótulos | Qué es | Para qué sirve |', '|---|---|---|---|']
    md += [f'| {n} | {r} | {q} | {s} |' for n, r, q, s in placa]
    md += ['',
           '**A2)** Chipset AMD X870: el cuadrado «AMD X870» del centro a la derecha, entre la ranura M.2_2 (6) y los '
           'puertos SATA (7); en la placa real va bajo un disipador. Pila (BATTERY): abajo a la izquierda, justo encima de '
           'PCIEX16(G4) (3) y junto al anclaje 22110 de M.2_4 (6).', '',
           '**A3)** Zócalo SOCKET AM5 de AMD, tipo LGA de 1718 contactos: los contactos están en el zócalo (en la placa) y el '
           'procesador solo tiene superficies de contacto planas. Otros tipos: PGA, con los pines en el procesador (AM4, '
           'Ryzen 5000 y anteriores); BGA, procesador soldado a la placa (portátiles y mini PC); otros LGA, como LGA 1700 '
           'o LGA 1851 de Intel. En él se conecta el procesador; encima va el disipador, que se ancla a la placa. Admite '
           'Ryzen 7000, 8000 y 9000 (y Zen 6 cuando salga, según AMD), siempre con la UEFI actualizada. Se abre con la '
           'palanca, se coloca el procesador con el triángulo en la esquina marcada, sin hacer fuerza, y se cierra.', '',
           '**A4)** ATX_PWR (24 pines) y CPU_12V_1 y CPU_12V_2 (EPS de 8 pines cada uno). El procesador puede consumir más de '
           '200 W: el VRM convierte los 12 V de los EPS en la tensión de los núcleos (Vcore), y por el conector de 24 pines '
           'no pasaría esa corriente.', '',
           '**A5)** Cuatro ranuras DDR5. Un módulo DDR4 no entra: la muesca está en otro sitio. Con dos módulos, A2 y B2, '
           'las marcadas «1st» en el esquema (doble canal).', '',
           '**A6)** Disipador: CPU_FAN (y CPU_OPT si tiene un segundo ventilador). Bomba AIO: AIO_PUMP (va a máxima velocidad '
           'por defecto). Ventiladores de caja sin divisor: 4 (CHA_FAN1 a CHA_FAN4). W_PUMP+: bomba de una refrigeración '
           'líquida a medida, que admite más corriente.', '',
           '**A7)** Botones y LED → F_PANEL (16) · audio → F_AUDIO (15) · dos USB-A de 5 Gbit/s → U5G_1011 (9) · USB-C de '
           '20 Gbit/s → U20G_C6 (8) · lector de tarjetas → USB_1415 o USB_1617 (10).', '',
           '**A8)** Falla la memoria. Por orden: esperar unos minutos (el primer arranque con DDR5 hace el entrenamiento de '
           'memoria y tarda), comprobar que los módulos están bien insertados y con los pestillos cerrados, que están en A2 y '
           'B2, probar con un solo módulo en A2 (y luego el otro), hacer Clear CMOS si se había activado EXPO, y consultar la '
           'QVL de la placa.', '',
           '**A9)** LAN_U10G_34: RJ-45 de 2,5 Gbit/s y dos USB de 10 Gbit/s (puertos 3 y 4) · HDMI · USB_5: el único USB 2.0 '
           'trasero · U40G_EC1 y U40G_EC2: USB4 tipo C de 40 Gbit/s, también con salida de vídeo · U10G_8: USB de 10 Gbit/s · '
           'U5G_E1234: cuatro USB de 5 Gbit/s · M.2(WIFI): conectores de la antena Wi-Fi 7 y Bluetooth · AUDIO: conectores de '
           'audio · BIOS_FLBK: botón de BIOS FlashBack. El número es la velocidad en Gbit/s y la C indica tipo C. Cuadra con '
           'la ficha: 3 USB de 10 Gbit/s (34 y 8), 4 de 5 Gbit/s y 1 USB 2.0.', '',
           '#### Parte B · La ficha técnica', '',
           '1. ATX, 30,5 × 24,4 cm (12 × 9,6 pulgadas). Fila «Formato».',
           '2. AMD Ryzen 9000, 8000 y 7000 de sobremesa, porque son los que usan el zócalo AM5. Un Ryzen 5000 es AM4 (PGA, '
           'DDR4) y un Intel usa otro zócalo (LGA 1700, 1851…). Fila «Procesador».',
           '3. En la lista de procesadores compatibles (CPU support list) del centro de descargas de ASUS (nota de la fila '
           '«Procesador»). Hace falta porque un procesador puede necesitar una versión mínima de la UEFI.',
           '4. DDR5, ECC y no ECC, sin búfer (unbuffered). 4 ranuras DIMM. Fila «Memoria».',
           '5. 256 GB según la web de ASUS (la primera edición del manual decía 192 GB). Con 4 ranuras, módulos de 64 GB '
           '(4 × 64 GB). Se aceptan las dos cifras si se dice de dónde salen.',
           '6. Hasta 8000+ MT/s (OC). «OC» quiere decir que esas velocidades son de overclocking: no están garantizadas y '
           'dependen del procesador y de los módulos. EXPO es el perfil de AMD guardado en el módulo con su velocidad y '
           'latencias: se activa en la UEFI para que la memoria funcione a la velocidad que pone en la caja (si no, va a la '
           'velocidad estándar JEDEC).',
           '7. Doble canal (dual channel), no quad channel. Como mínimo 2 módulos, uno en cada canal (A2 y B2).',
           '8. AMD X870. No tiene puente norte y puente sur: el antiguo puente norte (controlador de memoria y PCIe para la '
           'gráfica) está dentro del procesador, y el chipset X870 hace el papel del antiguo puente sur. Se ve en la ficha: '
           'la memoria, PCIEX16(G5), M.2_1 y M.2_2 dependen del Ryzen; PCIEX16(G4), M.2_3, M.2_4 y los SATA, del chipset.',
           '9. La gráfica integrada está en el procesador; la placa solo tiene las salidas: 1 HDMI 2.1 y 2 USB4 tipo C con '
           'vídeo (fila «Gráficos»). Ryzen 7 9700X: sí, tiene gráfica integrada. Ryzen 5 7500F: no, la F indica que no tiene '
           'gráfica integrada; hace falta tarjeta gráfica.',
           '10. 2 puertos SATA de 6 Gb/s (fila «Almacenamiento»). Solo 2 discos duros SATA.',
           '11. 4 M.2 de llave M. M.2_1, M.2_2 y M.2_3: tipo 2280. M.2_4: 2242, 2260, 2280 y 22110. M.2_1 y M.2_2, al '
           'procesador (PCIe 5.0 x4); M.2_3 y M.2_4, al chipset (PCIe 4.0 x4).',
           '12. Dos ranuras de tamaño x16: PCIEX16(G5), PCIe 5.0 x16 del procesador (x8 si se usa M.2_2) y PCIEX16(G4), '
           'PCIe 4.0 en modo x4 del chipset (se desactiva si se usa M.2_4). G5 y G4 indican la generación PCIe: 5.0 y 4.0.',
           '13. Gráfica → PCIEX16(G5), a x16. SSD PCIe 5.0 → M.2_1 (no en M.2_2: dejaría la gráfica en x8). SSD 22110 → '
           'M.2_4, la única que admite 110 mm; al usarla se desactiva PCIEX16(G4). Discos duros → SATA6G_1 y SATA6G_2. La '
           'capturadora no tiene sitio: la única ranura libre, PCIEX16(G4), está desactivada por M.2_4. Solución: cambiar el '
           'SSD 22110 por uno 2280 (clonándolo) y ponerlo en M.2_3; así M.2_4 queda libre y la capturadora va en PCIEX16(G4) '
           'a x4, que le basta.',
           '14. Con un Ryzen 8000: la ranura PCIEX16(G5) pasa a PCIe 4.0 en modo x8/x4, M.2_1 pasa a PCIe 4.0 x4 y M.2_2 no '
           'funciona. Lo del chipset (PCIEX16(G4), M.2_3, M.2_4 y SATA) no cambia.',
           '15. 10 USB traseros: 2 USB4 de 40 Gbit/s (tipo C), 3 de 10 Gbit/s, 4 de 5 Gbit/s y 1 USB 2.0 (todos tipo A). El '
           'USB 2.0 es el rotulado USB_5 en el esquema.',
           '16. 7 frontales: 1 USB-C de 20 Gbit/s (conector U20G_C6), 2 de 5 Gbit/s (conector U5G_1011) y 4 USB 2.0 (dos '
           'conectores, USB_1415 y USB_1617).',
           '17. Ethernet Realtek de 2,5 Gbit/s, Wi-Fi 7 (802.11be) y Bluetooth 5.4. Códec de audio Realtek ALC1220P (7.1).',
           '18. Flash ROM de 256 Mb (megabits, 32 MB). El archivo de la UEFI que se descarga de ASUS hay que renombrarlo '
           'A5569.CAP para que la BIOS FlashBack lo reconozca en la memoria USB.',
           '19. La opción 3: DDR5 (la única que admite la placa), dos módulos para el doble canal, a una velocidad dentro de '
           'lo que admite y con perfil EXPO de AMD para activarla en la UEFI. Opción 1: DDR4, no encaja. Opción 2: un solo '
           'módulo, pierde el doble canal. Opción 4: 8800 MT/s supera lo que garantiza la ficha (8000+ solo con overclock y '
           'según procesador): más cara y puede no ser estable.', '']

    md += ['### 5.2 Busca tú la documentación: gymkana de placas', '',
           'Placas: MSI MAG B850 TOMAHAWK MAX WIFI y MSI PRO B760M-A DDR4. En clase se hace con la gymkana '
           '(`web/juegos/ut03-gymkana-placas.html`). Sus respuestas, que también resuelven la tabla comparativa, '
           'no se publican: están en el solucionario privado de la gymkana (carpeta `examenes/`, fuera del '
           'repositorio), porque el ganador obtiene 0,5 puntos en el examen.', '']

    # ------------------------------------------------------------ boletín 6
    # (n.º, nombre, generación/serie y arquitectura, zócalo, núcleos/hilos, gráfica, disipador en caja, memoria)
    cpus = [
        (1, 'Core i9-14900K', '14.ª gen. (Raptor Lake Refresh)', 'LGA 1700', '24 (8P+16E) / 32', 'UHD 770', 'No', 'DDR4 o DDR5'),
        (2, 'Core i7-14700F', '14.ª gen.', 'LGA 1700', '20 (8P+12E) / 28', 'No (F)', 'Sí', 'DDR4 o DDR5'),
        (3, 'Core i5-14600K', '14.ª gen.', 'LGA 1700', '14 (6P+8E) / 20', 'UHD 770', 'No', 'DDR4 o DDR5'),
        (4, 'Core i5-14400', '14.ª gen.', 'LGA 1700', '10 (6P+4E) / 16', 'UHD 730', 'Sí', 'DDR4 o DDR5'),
        (5, 'Core i3-14100', '14.ª gen.', 'LGA 1700', '4 (4P) / 8', 'UHD 730', 'Sí', 'DDR4 o DDR5'),
        (6, 'Core i7-12700K', '12.ª gen. (Alder Lake)', 'LGA 1700', '12 (8P+4E) / 20', 'UHD 770', 'No', 'DDR4 o DDR5'),
        (7, 'Core i5-12400F', '12.ª gen.', 'LGA 1700', '6 (6P) / 12', 'No (F)', 'Sí', 'DDR4 o DDR5'),
        (8, 'Ryzen 9 7950X', 'Serie 7000 (Zen 4)', 'AM5', '16 / 32', 'Radeon básica', 'No', 'DDR5'),
        (9, 'Ryzen 9 7900X', 'Serie 7000 (Zen 4)', 'AM5', '12 / 24', 'Radeon básica', 'No', 'DDR5'),
        (10, 'Ryzen 7 7800X3D', 'Serie 7000 (Zen 4, 3D V-Cache)', 'AM5', '8 / 16', 'Radeon básica', 'No', 'DDR5'),
        (11, 'Ryzen 7 7700', 'Serie 7000 (Zen 4)', 'AM5', '8 / 16', 'Radeon básica', 'Sí', 'DDR5'),
        (12, 'Ryzen 5 7600', 'Serie 7000 (Zen 4)', 'AM5', '6 / 12', 'Radeon básica', 'Sí', 'DDR5'),
        (13, 'Ryzen 5 5600X', 'Serie 5000 (Zen 3)', 'AM4', '6 / 12', 'No', 'Sí', 'DDR4'),
        (14, 'Ryzen 5 5500', 'Serie 5000 (Zen 3, PCIe 3.0)', 'AM4', '6 / 12', 'No', 'Sí', 'DDR4'),
        (15, 'Ryzen 3 4100', 'Serie 4000 (Zen 2, PCIe 3.0)', 'AM4', '4 / 8', 'No', 'Sí', 'DDR4'),
        (16, 'Pentium Gold G6405', '10.ª gen. (Comet Lake)', 'LGA 1200', '2 / 4', 'UHD 610', 'Sí', 'DDR4'),
        (17, 'Core i5-10400F', '10.ª gen. (Comet Lake)', 'LGA 1200', '6 / 12', 'No (F)', 'Sí', 'DDR4'),
        (18, 'Ryzen 7 5700G', 'Serie 5000 (Zen 3)', 'AM4', '8 / 16', 'Radeon Vega 8', 'Sí', 'DDR4'),
        (19, 'Athlon 3000G', 'Zen (2019)', 'AM4', '2 / 4', 'Radeon Vega 3', 'Sí', 'DDR4'),
        (20, 'Core Ultra 7 270K Plus', 'Serie 200S Plus (2026)', 'LGA 1851', '24 (8P+16E) / 24', 'Intel Graphics (Xe) y NPU', 'No', 'DDR5'),
        (21, 'Core Ultra 5 250K Plus', 'Serie 200S Plus (2026)', 'LGA 1851', '18 (6P+12E) / 18', 'Intel Graphics (Xe) y NPU', 'No', 'DDR5'),
        (22, 'Core Ultra 7 265K', 'Serie 200S (Arrow Lake, 2024)', 'LGA 1851', '20 (8P+12E) / 20', 'Intel Graphics (Xe) y NPU', 'No', 'DDR5'),
        (23, 'Ryzen 7 9850X3D', 'Serie 9000 (Zen 5, 3D V-Cache, 2026)', 'AM5', '8 / 16', 'Radeon básica', 'No', 'DDR5'),
        (24, 'Ryzen 7 9800X3D', 'Serie 9000 (Zen 5, 3D V-Cache)', 'AM5', '8 / 16', 'Radeon básica', 'No', 'DDR5'),
        (25, 'Ryzen 5 9600X', 'Serie 9000 (Zen 5)', 'AM5', '6 / 12', 'Radeon básica', 'No', 'DDR5'),
        (26, 'Ryzen 5 8600G', 'Serie 8000 (Zen 4)', 'AM5', '6 / 12', 'Radeon 760M', 'Sí', 'DDR5'),
        (27, 'Ryzen 9 9950X', 'Serie 9000 (Zen 5)', 'AM5', '16 / 32', 'Radeon básica', 'No', 'DDR5'),
    ]
    assert [c[0] for c in cpus] == list(range(1, 28))
    md += ['## Boletín 6 · Procesadores reales', '',
           'Datos de las páginas de producto de Intel y AMD y de análisis publicados (frecuencias, L3 y TDP vienen en el '
           'enunciado). «Radeon básica»: gráfica integrada de 2 núcleos de los Ryzen 7000 y 9000, para usar el escritorio, '
           'no para jugar. En Intel LGA 1700, DDR4 o DDR5 según la placa. Comprobar con la web del fabricante si algún '
           'alumno da otro dato del disipador: varía en algunas versiones.', '',
           '### 6.1 y 6.2 · Datos que hay que investigar', '',
           '| N.º | Procesador | Generación / serie | Zócalo | Núcleos / hilos | Gráfica integrada | Disipador en caja | Memoria |',
           '|---|---|---|---|---|---|---|---|']
    md += [f'| {n} | {a} | {b} | {c} | {d} | {e} | {f} | {g} |' for n, a, b, c, d, e, f, g in cpus]
    md += ['',
           'Placa: LGA 1700 → series 600 y 700 (Z690/Z790 para overclock de los K) · LGA 1200 → series 400 y 500 · '
           'LGA 1851 → serie 800 (Z890 para overclock) · AM4 → A320 a X570 (según la lista de compatibles) · AM5 → A620, '
           'B650, B850, X670, X870… Uso orientativo: i3, Pentium, Athlon, Ryzen 3 → ofimática; i5, Ryzen 5 → uso general y '
           'juegos; i7, i9, Ryzen 7 y 9, Core Ultra 7 → juegos exigentes y creación de contenido; X3D → juegos; G → equipos '
           'sin gráfica dedicada.', '',
           '### 6.3', '',
           '1. No pueden funcionar sin gráfica: i7-14700F, i5-12400F, i5-10400F (sufijo F de Intel) y Ryzen 5 5600X, Ryzen 5 '
           '5500 y Ryzen 3 4100 (Ryzen AM4 sin G). En AMD el sufijo no lo dice siempre: los AM4 solo tienen gráfica si llevan G '
           '(o son Athlon con G); los AM5 la llevan casi todos.',
           '2. Los Core Ultra serie 200 no tienen Hyper-Threading: cada núcleo atiende un hilo. El i9-14900K sí lo tiene en '
           'sus 8 núcleos P (8 × 2 + 16 = 32).',
           '3. En una placa AM4 B550 con DDR4: Ryzen 5 5600X, Ryzen 5 5500, Ryzen 3 4100 y Ryzen 7 5700G (con la UEFI '
           'actualizada). El Athlon 3000G también es AM4, pero las placas B550 no lo admiten (no está en su lista de '
           'compatibles). Los AM5 y los Intel no encajan.',
           '4. LGA 1200: Pentium Gold G6405, i5-10400F. LGA 1700: 1–7. AM4: 13–15, 18, 19. AM5: 8–12, 23–27. LGA 1851: 20–22. '
           'Ya no reciben procesadores nuevos de sobremesa: LGA 1200, LGA 1700 y AM4 (en AM4 AMD aún lanza alguna variante, '
           'pero sin arquitectura nueva). LGA 1851 tendrá relevo con LGA 1954.',
           '5. Traen disipador: i7-14700F, i5-14400, i3-14100, i5-12400F, Ryzen 7 7700, Ryzen 5 7600, los AM4 (5600X, 5500, '
           '4100, 5700G, 3000G), Pentium G6405, i5-10400F y Ryzen 5 8600G. No lo traen: los Intel K, los Core Ultra, los Ryzen '
           'X/X3D de AM5 y toda la serie 9000. Regla: los modelos desbloqueados o de mucho consumo y la serie 9000 se venden sin '
           'disipador.',
           '6. 35 W → PPT ≈ 47 W (Athlon 3000G): disipador básico. 65 W → ≈ 88 W (7700, 7600, 5600X, 5500, 4100, 5700G, 9600X, '
           '8600G): el de la caja o una torre sencilla. 120 W → 162 W (7800X3D, 9850X3D, 9800X3D): torre de gama media. '
           '170 W → ≈ 230 W (7950X, 7900X, 9950X): torre doble o líquida AIO de 240–360 mm.',
           '7. Por la caché 3D V-Cache: 96 MB de L3 frente a 32 MB. Los juegos usan mucho la caché, y tener los datos cerca '
           'compensa la menor frecuencia. La caché apilada también limita la temperatura, por eso la frecuencia es menor.',
           '8. Orientativo, se valora la justificación: (1) Pentium Gold G6405 o i3-14100 (con gráfica y disipador); entre '
           'los actuales, nada tan barato. (2) Ryzen 7 9850X3D (o 9800X3D). (3) Ryzen 9 9950X (o i9-14900K / Core Ultra 7 270K '
           'Plus). (4) Ryzen 5 8600G (Radeon 760M). (5) Ryzen 7 5700G si no tiene gráfica dedicada, o Ryzen 5 5600X si la '
           'tiene, con la UEFI actualizada.', '']

    # ------------------------------------------------------------ configurador
    md += ['## Retos del configurador (C1)', '', 'Problemas que detecta el configurador de la web en cada caso:', '']
    cfg = node("require('./web/assets/ut03-configurador.js');const C=window.UT03_CONFIG;console.log(JSON.stringify(Object.entries(C.CASOS).map(([n,s])=>[n,C.comprobar(s)])))")
    if cfg:
        for n, r in cfg:
            md.append(f'- **{n}** (consumo máximo estimado {r["consumo"]} W):')
            for nivel, titulo, texto in r['lista']:
                if nivel != 'ok':
                    md.append(f'  - {"✗" if nivel == "mal" else "!"} {titulo}. {texto}')
        md += ['', 'Soluciones mínimas: A) cambiar la placa por una AM5 con DDR5 (B650M). B) añadir una tarjeta gráfica o '
               'usar un procesador con gráfica integrada. C) dos módulos, disipador de perfil bajo o AIO de 240 mm, gráfica '
               'de 310 mm o menos y fuente SFX. D) anclajes para LGA 1700 (o disipador nuevo), placa Z si se quiere overclock '
               'y fuente de 850 W. E) es correcto.']
    SALIDA.write_text('\n'.join(md) + '\n', encoding='utf-8')
    print('solucionario:', SALIDA.relative_to(ROOT))


if __name__ == '__main__':
    main()
