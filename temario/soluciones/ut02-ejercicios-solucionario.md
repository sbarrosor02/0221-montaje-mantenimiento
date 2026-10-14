# Tema 2 · Solucionario de los boletines 1 y 3

No se publica en la página del alumnado. Los boletines 2 y 4 tienen solucionario propio,
generado y verificado por script:

- Boletín 2 (circuitos lógicos): `ut02-circuitos-logicos-solucionario.md`
  (`scripts/generar_circuitos_logicos.py`).
- Boletín 4 y retos del simulador: `ut02-programas-solucionario.md`
  (`scripts/generar_trazas_cpu.py`).

## Boletín 1 · Representación de la información

**1.1** Zettabyte (ZB, 10²¹ B), yottabyte (YB, 10²⁴ B) y, desde 2022, ronnabyte
(RB, 10²⁷ B) y quettabyte (QB, 10³⁰ B). En el sistema IEC: zebibyte (ZiB, 2⁷⁰ B) y yobibyte
(YiB, 2⁸⁰ B). Para RB y QB todavía no hay prefijos binarios oficiales.

**1.2** Indican el tamaño de un dato o de un registro: *word* 16 bits, *dword* 32 bits y
*qword* 64 bits. Se usan en programación de bajo nivel y en la documentación de los
procesadores x86. En el Editor del Registro, **REG_DWORD** guarda un número entero de 32 bits
y **REG_QWORD** uno de 64 bits. Se usan muchísimo para activar o desactivar opciones (0 o 1)
y para guardar valores numéricos de configuración.

**1.3** a) 7 días → 3 bits (2³ = 8). b) 12 meses → 4 bits (2⁴ = 16). c) 30 alumnos →
5 bits (2⁵ = 32). d) 256 colores → 8 bits (2⁸ = 256, justo). e) 1000 matrículas → 10 bits
(2⁹ = 512 no llega; 2¹⁰ = 1024).

**1.4** 1010₂ = 10 · 1100 1000₂ = 128 + 64 + 8 = 200 · 0111 1111₂ = 127 ·
1 0000 0000₂ = 256.

**1.5** 13 = 0000 1101 · 100 = 0110 0100 · 255 = 1111 1111 · 170 = 1010 1010.

**1.6** 1011 1110 1110 1111₂ = BEEF₁₆ · 0001 1111₂ = 1F₁₆ · 1100 1010 1111 1110₂ = CAFE₁₆.
3A₁₆ = 0011 1010₂ · FF₁₆ = 1111 1111₂ · 0x2C0 = 0010 1100 0000₂.

**1.7** FF = 255 de rojo, 80 = 128 de verde, 00 = 0 de azul: un **naranja**.

**1.8** 128 × 32 = 4096 celdas de 1 byte = 4096 bytes = **4 KiB** (4096 / 1024).

**1.9** 500 GB = 500 × 10⁹ B / 2³⁰ ≈ **465,7 GiB**, que Windows muestra como «465 GB».
64 GB ≈ **59,6 GiB**. El fabricante cuenta en base 1000 y Windows en base 1024, aunque
escriba «GB». En la memoria USB, además, el sistema de archivos ocupa un poco.

**1.10** 4 bytes. H = 72 (0x48), o = 111 (0x6F), l = 108 (0x6C), a = 97 (0x61).

## Boletín 3 · Arquitectura y buses

**3.1** Las dos usan programa almacenado, CPU con UC y UAL, memoria y buses. Von Neumann usa
una sola memoria y un solo juego de buses para datos e instrucciones. Harvard usa dos
memorias, cada una con sus buses, y puede leer instrucción y dato a la vez. Un
microcontrolador ejecuta siempre el mismo programa grabado en su flash y necesita poca RAM,
así que separar memorias le da velocidad sin desperdiciar nada. En un PC cada programa
necesita una proporción distinta de código y datos, y una memoria única es más flexible.
Los PC usan Harvard modificada en la caché L1.

**3.2** CPU (UC, UAL y registros) → microprocesador. Memoria principal → módulos de RAM.
Unidad de E/S → chipset y controladores de la placa, tarjetas de expansión, puertos y
periféricos (incluidos los discos). Buses → pistas de la placa base, ranuras y conexiones
internas de los chips.

**3.3** Respuesta abierta: PC, portátil, móvil, consola, servidor. El cuello de botella
aparece porque la CPU espera a la memoria. Para reducirlo se usan cachés de varios niveles,
varios canales de memoria, buses más anchos y rápidos y la caché L1 separada en instrucciones
y datos.

**3.4** Es subir la frecuencia de reloj por encima de la de fábrica. El reloj marca el ritmo al
que el secuenciador de la UC genera las señales de control: más pulsos por segundo significan
más instrucciones por segundo. Riesgos: más consumo y más calor, inestabilidad (cuelgues,
pantallazos), menor vida útil y, a veces, pérdida de la garantía.

**3.5** 16 líneas → 2¹⁶ = 65 536 B = **64 KiB** · 20 → 1 048 576 B = **1 MiB** ·
32 → **4 GiB** · 36 → **64 GiB**.

**3.6** 8 GiB = 2³ × 2³⁰ = 2³³ B → **33 líneas**.

**3.7** DDR4-2666: 2666 × 10⁶ transferencias/s × 8 B = **21,3 GB/s** por canal y
**42,7 GB/s** con dos canales. DDR5-4800: 4800 × 8 = **38,4 GB/s** por canal y
**76,8 GB/s** con dos canales.

**3.8** La dirección 1F40₁₆ → bus de direcciones. El código ASCII → bus de datos. La orden de
escribir → bus de control. El aviso del teclado (petición de interrupción) → bus de control.
Los pulsos de reloj → bus de control.

**3.9** (1) A frecuencias muy altas, los bits de muchas líneas paralelas no llegan a la vez
(desfase), y con pocas líneas serie se puede subir mucho la velocidad. (2) En un bus compartido
solo habla un dispositivo cada vez. Con enlaces punto a punto cada dispositivo tiene su propio
canal y no compite con los demás. También ayudan los conectores y cables más pequeños y
baratos, con menos interferencias.
