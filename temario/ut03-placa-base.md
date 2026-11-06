---
modulo: "0221"
ut: 3
titulo: "Placa base, microprocesador, memoria, adaptadores y chasis"
ra: [RA1]
ce: [RA1.c, RA1.d, RA1.e, RA1.f, RA1.g, RA1.i, RA1.j, RA1.k]
horas: 16
evaluacion: 1
---

# Tema 3 · Placa base, microprocesador, memoria, adaptadores y chasis

Documento de trabajo del profesor: correspondencia con la programación, decisiones
sobre los apuntes de 2024/25 y relación de materiales. El contenido para el alumnado
está en `web/temas/ut03*.html`.

## Programación 2026/27

UT3, 1.ª evaluación, 16 h, modalidad centro, RA1 c), d), e), f), g), i), j), k).
Contenidos: tipos y formatos de placa base; microprocesadores, zócalos y chipsets;
disipadores y ventiladores; BIOS/UEFI y configuración básica; módulos de memoria y
compatibilidades; tarjetas de expansión (vídeo, red, sonido); adaptador gráfico y
monitor; tipos de chasis; documentación, controladores y utilidades.

La memoria está en los contenidos de la UT3, pero el CE h) (identificar y manipular
módulos de memoria, discos y controladoras) está asignado a la UT4. Por la regla de
criterios exclusivos de la programación, aquí se explica la memoria (tipos,
compatibilidad, canales, latencia, XMP/EXPO) y su manipulación se evalúa en la UT4.
Las 16 h se amplían según el ritmo del grupo (unas 18–20 sesiones con las prácticas).

## Mapa de criterios

| CE | Teoría | Practicar | Práctica |
|---|---|---|---|
| c) Microprocesadores | 3.3 | Boletín 2, configurador | P6 |
| d) Disipadores y ventiladores | 3.5 | Boletín 2, configurador | P6 |
| e) Configuración de la placa base | 3.1, 3.2, 3.4, 3.6, 3.7 | Boletines 1, 3 y 5, configurador | P5 |
| f) BIOS/UEFI | 3.8 | Boletines 4 y 5, simulador de UEFI | P7 |
| g) Chasis | 3.1, 3.12 | Boletines 1 y 4, configurador | P8 |
| i) Adaptador gráfico y monitor | 3.9, 3.10 | Boletín 4, configurador | P8 |
| j) Adaptadores | 3.7, 3.9, 3.11 | Boletines 3 y 4 | P8 |
| k) Documentación, controladores y utilidades | 3.13 | Boletines 1, 3, 4 y 5 | P5 |

## Cambios respecto a los apuntes de 2024/25

Los apuntes solo trataban la placa base (factores de forma, socket, chipset, BIOS,
RAM, ranuras y conectores).

**Se resume:** la historia de los factores de forma (AT, Baby-AT, BTX, Flex-ATX,
Nano/Pico-ITX) queda en una tabla desplegable; ISA, PCI y AGP, en una línea.

**Se suprime:** la especulación sobre FPGA en el PCH; la comparativa de
memorybenchmark.net.

**Se amplía o se introduce:** características del procesador (CE c); chipset y
gamas actuales; refrigeración completa (CE d, no estaba); DDR4/DDR5 rehecho, con
latencia en ns, canales, XMP/EXPO y QVL; PCIe con tabla de versiones 1.0–7.0 y
compatibilidad; M.2 con llaves B, M y E; BIOS/UEFI ampliada (POST, CMOS y pila,
Legacy frente a UEFI, CSM, Secure Boot, TPM, diagnóstico, actualización, Clear
CMOS); adaptador gráfico y monitor (CE i, no estaba); otras tarjetas e instalación
(CE j); chasis (CE g, no estaba); documentación, controladores, utilidades y
accesorios (CE k, no estaba).

**Se corrige:**

- «Los datos de la BIOS se borran sin corriente»: el firmware está en flash; la pila
  mantiene el reloj y, según la placa, los ajustes.
- Socket AM5 presentado con AM3/AM4 como PGA sin más: AM5 es LGA 1718.
- «LGA 1851 desde la decimoquinta generación»: es Core Ultra serie 200.
- Texto copiado sin sentido sobre Quad Channel («caché de 8 MB…») y DDR4 «desarrollada
  por Samsung»; Dual Channel no exige mismo fabricante.
- «DDR5 integra ECC»: es on-die ECC, distinto de los módulos ECC.
- «64 GB por circuito integrado»: son 64 Gbit por chip.
- SO-DIMM con pines y capacidades de DDR/DDR2/DDR3; latencias CAS de DDR1.
- «PCIe trabaja a 0,8 V y 133 MHz»: incorrecto. Velocidades por carril actualizadas.
- Thunderbolt 4 a 80 Gbit/s: son 40 Gbit/s (80 es Thunderbolt 5).
- ARGB «con dos pines de comunicación»: lleva 5 V, datos y masa.
- «3.5v» en el conector ATX: 3,3 V.
- SLI/CrossFire se presentaba como vigente: abandonado en consumo.

## Materiales

| Material | Archivo | Verificación |
|---|---|---|
| Portada con mapa de criterios | `web/temas/ut03.html` | — |
| Teoría 1 (c, d, e, j) | `web/temas/ut03-teoria.html` | Interacción en Chromium, 1440 y 390 px |
| Teoría 2 (f, g, i, j, k) | `web/temas/ut03-teoria-2.html` | Interacción en Chromium, 1440 y 390 px |
| Simulador de UEFI | `web/temas/ut03-ejercicios-uefi.html`, `web/assets/ut03-uefi.js` | Misiones completadas automáticamente |
| Configurador | `web/temas/ut03-ejercicios-configurador.html`, `web/assets/ut03-configurador.js` | Las 322 560 combinaciones sin errores; casos A–E |
| Boletines 1–5 | `web/temas/ut03-ejercicios.html` | — |
| Solucionario | `temario/soluciones/ut03-ejercicios-solucionario.md` | `scripts/generar_ut03_solucionario.py` contrasta tablas y fórmulas con la web |
| Prácticas P5–P8 | `web/temas/ut03-practicas.html` | — |

## Boletín 5 · Placas base reales

Un ejercicio por placa real, con el esquema numerado de su manual (imagen en
`web/assets/img/placas/`, recortada del PDF del fabricante y con la fuente citada en
el pie). Cada placa lleva la tabla de los números del esquema y preguntas de lectura
del manual (alimentación, memoria, ventiladores, panel frontal, reparto de carriles
PCIe/M.2, Q-LED, panel trasero y BIOS Flashback). Las especificaciones que se dan en el
enunciado se han contrastado con la ficha técnica del fabricante. Para añadir una
placa: nuevo `ej-5-N` antes del recuadro «Entrega», su imagen en `img/placas/`, su
solución en `scripts/generar_ut03_solucionario.py` y el recuento en el mapa de boletines.

| Ejercicio | Placa | Fuente |
|---|---|---|
| 5.1 | ASUS TUF GAMING X870-PLUS WIFI (AM5, X870, ATX) | Manual de usuario, apartado 1.2; ficha técnica en asus.com |

`ut03.css`, `ut03-interactivos.js`, `ut03-uefi.js` y `ut03-configurador.js` son propios
de este tema. Las páginas también cargan `ut02.css` (clases comunes) y
`ut02-interactivos.js` (cuestionarios).

## Datos que caducan

Revisar cada curso: zócalos y chipsets actuales, velocidades de DDR5, versiones de PCIe,
HDMI 2.2 (equipos llegando) y los procesadores del configurador.

Revisión del 06/11/2026 (teoría 3.3–3.4, resumen y decodificador de nombres):

- Intel: Core Ultra 200S Plus (250K Plus y 270K Plus, marzo de 2026) en LGA 1851.
  Core Ultra 400 «Nova Lake» en LGA 1954 con chipsets serie 900: Intel la anunció para
  finales de 2026; las filtraciones sitúan la venta a principios de 2027. Los nombres
  Z990, Z970 y B960 son filtrados, no oficiales: confirmar cuando salgan.
- AMD: Ryzen 7 9850X3D y Ryzen 9 9950X3D2 (2026) y Ryzen AI 400 de sobremesa (AM5, solo
  en equipos de marca). Zen 6 «Olympic Ridge» confirmado en AM5, previsto para 2027; el
  nombre Ryzen 10000 no es oficial. AM5 confirmado hasta 2029. Chipset B840 añadido
  a la gama básica.
- El decodificador reconoce «Plus», la serie 4 de Core Ultra, Ryzen de cinco cifras
  (10000), X3D2 y Ryzen AI (G y GE en AM5; el resto, BGA).
- No se ha tocado el configurador: sus procesadores siguen siendo válidos y cambiarlos
  obliga a repetir la prueba de todas las combinaciones.
