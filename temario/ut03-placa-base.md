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
| c) Microprocesadores | 3.3 | Boletines 2, 5 y 6, configurador | P6 |
| d) Disipadores y ventiladores | 3.5 | Boletines 2 y 6, configurador | P6 |
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
| Boletines 1–6 | `web/temas/ut03-ejercicios.html` | — |
| Solucionario | `temario/soluciones/ut03-ejercicios-solucionario.md` | `scripts/generar_ut03_solucionario.py` contrasta tablas y fórmulas con la web |
| Prácticas P5–P8 | `web/temas/ut03-practicas.html` | — |
| Concurso de clase (3.1–3.3.3) | `web/juegos/ut03-concurso.html` | Partida completa automática en Chromium, 1440 y 390 px |

## Boletín 5 · Placas base reales

Un ejercicio por placa real, con el mismo formato que el examen del tema (ejercicios de
esquema y de ficha técnica):

- **Parte A · El esquema** (imagen recortada del *Motherboard layout* del manual, en
  `web/assets/img/placas/`, con la fuente en el pie): tabla de los números, chipset y pila
  rodeados en una captura (sin número en el esquema), «el componente 1 a fondo» (zócalo:
  tipo, otros tipos, qué admite) y preguntas de alimentación, memoria, ventiladores, panel
  frontal, Q-LED y panel trasero.
- **Parte B · La ficha técnica**: el *Specifications summary* traducido y resumido en una
  tabla, con sus notas, y unas 19 preguntas de búsqueda de datos y de razonamiento con
  ellos (procesadores compatibles y por qué, memoria y doble canal, chipset frente a puente
  norte/sur, gráfica integrada, SATA, M.2, PCIe y carriles compartidos, cambios con un
  Ryzen 8000, USB, BIOS y elección de memoria entre varias opciones).

El 5.2 se hace en clase como **gymkana** (`web/juegos/ut03-gymkana-placas.html`) con MSI
MAG B850 TOMAHAWK MAX WIFI y MSI PRO B760M-A DDR4 (los manuales que tiene el profesor). En
casa se puede repetir con las partes A y B y una tabla comparativa.

- Individual, unas 2 horas. Clave de salida para empezar (la dice el profesor). Cada placa
  se desbloquea con la página donde empieza «Overview of Components» del manual exacto
  (27 y 23 en las versiones usadas); la clave del profesorado desbloquea si otra versión
  del manual tiene otra numeración.
- Cada alumno recibe 17 preguntas al azar con el mismo reparto: por placa, 4 de ficha y 3
  de esquema, y 3 retos que cruzan las dos placas (banco de 68). Puntos: 10/6/3 según el
  intento (2 intentos en las de opción); la pista cuesta 3. Empate: menos tiempo.
- Al terminar: informe imprimible en PDF (`<usuario>_gymkana.pdf`) con todas las
  respuestas y un código de ranking con suma de control. El panel «Profesorado» comprueba
  los códigos y ordena el ranking. Premio: 0,5 puntos en el examen.
- Las respuestas van en la página como huellas (cyrb53 con sal), no en claro. El banco, las
  claves, el generador y el solucionario están en `examenes/gymkana-placas/` (no se
  publica). Regenerar: `python3 examenes/gymkana-placas/generar.py`.

La placa del examen no se usa en la web (el repositorio es público). Para añadir una
placa: nuevo `ej-5-N` en `web/temas/ut03-boletin-5.html` con sus partes A y B antes del
recuadro «Entrega», su imagen en `img/placas/`, su solución en
`scripts/generar_ut03_solucionario.py` y el recuento en el `texto` del boletín 5 en
`web/datos/temas.json` → `secciones` → `ejercicios`. Contrastar la ficha con la web del fabricante: cambia (en la 5.1, la
memoria máxima pasó de 192 a 256 GB).

| Ejercicio | Placa | Fuente |
|---|---|---|
| 5.1 | ASUS TUF GAMING X870-PLUS WIFI (AM5, X870, ATX) | Manual de usuario, apartado 1.2; ficha técnica en asus.com |
| 5.2 | MSI MAG B850 TOMAHAWK MAX WIFI, MSI PRO B760M-A DDR4 (gymkana) | Manuales de usuario de MSI; solucionario privado en `examenes/gymkana-placas/` |

`ut03.css`, `ut03-interactivos.js`, `ut03-uefi.js` y `ut03-configurador.js` son propios
de este tema. Las páginas también cargan `ut02.css` (clases comunes) y
`ut02-interactivos.js` (cuestionarios).

## Boletín 6 · Procesadores reales

Adaptación de la hoja «Análisis de especificaciones comerciales» de cursos anteriores (era
del antiguo tema 4; ahora el procesador está en este tema). El alumnado saca toda la
información de un procesador a partir de su descripción comercial
(`nombre base/turbo GHz Box (L3: x MB, y W)`): lo que se deduce del nombre y lo que hay que
investigar en intel.es o amd.com. La página explica cada parte de la descripción, da la
ficha de análisis ampliada (sufijo, núcleos e hilos, disipador en caja, memoria y placa) y
un ejemplo resuelto con un procesador que no está en las listas (Ryzen 7 9700X).

- 6.1: los 19 procesadores de la hoja original, sin cambios (12.ª–14.ª gen. de Intel, LGA
  1200, AM4 y Ryzen 7000): siguen llegando al taller.
- 6.2: 8 actuales (Core Ultra 200S y 200S Plus, Ryzen 9000, 9000X3D y 8600G). Datos
  contrastados con las páginas de producto y análisis publicados (noviembre de 2026).
- 6.3: comparar y elegir (sin gráfica, Hyper-Threading en Core Ultra, compatibilidad AM4
  B550, zócalos cerrados, disipador en caja, PPT y refrigeración, X3D, elección por cliente).
- Entrega `<usuario>_E36.zip`. Solucionario con la tabla de datos de los 27.

## Concurso de clase

Copia del motor de `web/juegos/ut02-concurso.html` (modos, puntuación, podio, premios y
tarjetas imprimibles iguales) con su propio banco y sus propias claves de almacenamiento
(`concurso-ut03-*`), así que no se mezcla con la partida del tema 2. Solo entra la teoría
1 hasta el 3.3.3: 7 preguntas de formatos, 9 de conectores internos, 5 del panel frontal,
7 de características del procesador, 7 de zócalos y 6 de nombres. No repite las preguntas
de la autoevaluación de la teoría. Si se cambia el motor en uno de los dos concursos, hay
que replicarlo en el otro. Las preguntas de zócalos y nombres usan los datos de la revisión
del 06/11/2026 (Core Ultra 200S Plus, LGA 1954 y AM5 hasta 2029).

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

## Simulacro de test · 1.ª parte (18/11/2026)

El examen del tema 3 se divide en dos. Para la primera parte (teoría 1, apartados 3.1 a
3.7) hay un simulacro autocorregible: `web/temas/ut03-test-1.html` con el banco en
`web/assets/ut03-test-1.js` (65 preguntas: 3.1 ×6, 3.2 ×8, 3.3 ×14, 3.4 ×7, 3.5 ×11,
3.6 ×10, 3.7 ×9; cada una con su CE). Saca 30 preguntas al azar con las opciones
barajadas. Está en la sección «Preparar el examen». Para la segunda parte (3.8 a 3.13)
se puede hacer `ut03-test-2` con el mismo motor.

## Modelos actuales de tarjetas gráficas (27/11/2026)

Teoría 2, apartado 3.9.2: cómo se lee el nombre (generación y gama) y tablas de NVIDIA
GeForce RTX 50 (5050 a 5090), AMD Radeon RX 9000 (9050 a 9070 XT) e Intel Arc B (B570,
B580), con núcleos, VRAM, bus, consumo y uso; equivalencias entre marcas y ejemplo de
nombre comercial de un ensamblador. Situación a noviembre de 2026: NVIDIA no ha lanzado
las RTX 50 Super y la Arc B770 no llegó a salir. Revisar las tablas cada curso.
Autoevaluación: preguntas 11 y 12 nuevas.

## P9 · Servicio técnico: dos empresas de informática (27/11/2026)

Caso práctico en grupo con nota individual para la segunda parte del tema (CE f, g, i, j,
k): `web/temas/ut03-practica-empresas.html`, enlazada desde Prácticas. Empresa A (3) y
empresa B (2) con roles rotativos (técnico/a, asesor/a, calidad), 6 sesiones: fundación,
tres jornadas de encargos (banco de 12 averías y 9 clientes), avería real en el taller y
concurso entre empresas (CL-09). Documentos: registro, informe de avería, informe técnico,
presupuesto con IVA y hoja de entrega. Guía del profesor, diagnósticos, preparación de la
avería real y llamadas de última hora en `temario/soluciones/ut03-p9-solucionario.md`.
