---
modulo: "0221"
ut: 4
titulo: "Almacenamiento, fuente de alimentación y ensamblaje del equipo"
ra: [RA1, RA2, RA3, RA8]
ce: [RA1.h, RA2.a, RA2.b, RA2.c, RA2.d, RA2.e, RA2.f, RA2.g, RA2.h, RA2.i, RA2.j, RA3.f, RA3.g, RA3.h, RA3.i, RA3.j, RA8.b, RA8.e, RA8.h]
horas: 40
evaluacion: 1
---

# Tema 4 · Almacenamiento, fuente de alimentación y ensamblaje del equipo

Documento de trabajo del profesor: correspondencia con la programación, decisiones
y relación de materiales. El contenido para el alumnado está en
`web/temas/ut04*.html`. No había apuntes de cursos anteriores: el tema se ha
construido a partir de la programación 2026/27 y está pendiente de revisión.

## Programación 2026/27

- **UT4** (18 h): RA1 h; RA3 f, g, h, i, j. Discos duros, SSD, NVMe y unidades
  ópticas; controladoras y soportes auxiliares; conectores SATA, M.2, NVMe, USB;
  fuentes ATX (bloques, tensiones y conectores); medida de tensiones; SAI (bloques y
  medida de señales); cableado interno y externo.
- **UT5** (22 h): RA2 a–j; RA8 b, e, h. Herramientas y normas de montaje;
  manuales y verificación del material; almacenaje; ensamblado de placa,
  procesador y refrigeración; memoria, discos y unidades ópticas; buses,
  periféricos y cableado; BIOS y utilidades de diagnóstico; informe de montaje.

## Decisiones

- **Se unen la UT4 y la UT5 en un solo tema.** Los discos y la fuente se montan,
  y sus tensiones se miden, dentro de las prácticas de ensamblaje. Así se gana
  tiempo en la 1.ª evaluación (quedaban unas 48 h para 56 programadas) sin dejar
  ningún criterio fuera. Horas de referencia: 40 (18 + 22); en la práctica, unas
  30–32 h de clase.
- **SAI mínimo.** Se tratan también en otro módulo del ciclo, pero RA3 i) y j) son
  de este módulo y deben evaluarse. Un apartado corto (4.6: bloques, tipos, VA y W,
  puntos de medida) y una parte breve en P12 (medidas en entrada, salida con red,
  salida en batería y bornes con el SAI abierto por el profesor).
- **No se abre ninguna fuente.** Los bloques (RA3 f) se identifican sobre fotos del
  interior que aporta el profesor. Las tensiones se miden con la fuente suelta
  (puente PS_ON con carga, P10) y en el equipo montado (P11), para comparar.
- **RA1 h** se acredita en P10 (identificar discos y controladoras) y P11
  (manipular memoria y discos), como se avisó en el tema 3.
- **RA8 h** (orden y limpieza) se observa en todas las prácticas; RA8 e en P9;
  RA8 b en P10 y P11.

## Mapa de criterios

| CE | Teoría | Practicar | Práctica |
|---|---|---|---|
| RA1 h) Memoria, discos y controladoras | 4.1, 4.2 | Boletín 1 | P10, P11 |
| RA2 a) Herramientas | 4.7 | Boletín 3 | P9 |
| RA2 b) Documentación | 4.8 | Boletín 3 | P9 |
| RA2 c) Recepción | 4.8 | Boletín 3 | P9 |
| RA2 d) Almacenaje | 4.9 | Boletín 3 | P9 |
| RA2 e) Chasis y fijaciones | 4.10 | Boletín 3 | P11 |
| RA2 f) Placa, procesador, refrigeración | 4.11 | Boletín 3, ordena el montaje | P11 |
| RA2 g) Memoria, discos, otros | 4.11 | Boletín 3, ordena el montaje | P11 |
| RA2 h) Configuración de la placa | 4.12 | Boletín 4 | P12 |
| RA2 i) Diagnóstico | 4.13 | Boletín 4 | P12 |
| RA2 j) Informe de montaje | 4.14 | Boletín 4 | P12 |
| RA3 f) Bloques de la F.A. | 4.4 | Boletín 2 | P10 |
| RA3 g) Tensiones de la F.A. | 4.4 | Boletín 2, conector 24 pines, potencia | P10 |
| RA3 h) Medida de tensiones | 4.5 | Boletín 2, tolerancias | P10, P11 |
| RA3 i) Bloques del SAI | 4.6 | Boletín 2 | P12 |
| RA3 j) Medidas en el SAI | 4.6 | Boletín 2 | P12 |
| RA8 b) Máquinas con seguridad | 4.11 | Boletín 3 | P10, P11 |
| RA8 e) Herramientas y protección | 4.7 | Boletín 3 | P9 |
| RA8 h) Orden y limpieza | 4.7 | — | P9–P12 |

## Material del profesor para las prácticas

- Un lote por pareja con hoja de pedido. En P9 conviene «preparar» alguna
  incidencia (un componente distinto del pedido, un accesorio que falta).
- Caja de despiece con HDD de 3,5″ y 2,5″, SSD SATA, SSD M.2 y unidad óptica.
- Fotos del interior de una fuente con los bloques visibles (de una fuente
  desechada abierta y descargada por el profesor, o del fabricante).
- Puentes PS_ON o comprobador de fuentes; ventiladores o discos viejos como carga.
- Memoria USB del taller con Ventoy y MemTest86 (y, si se quiere, CrystalDiskInfo,
  CrystalDiskMark, CPU-Z y HWiNFO en un entorno portátil).
- Un SAI del taller para P12.

## Materiales

- Portada: `web/temas/ut04.html`.
- Teoría 1 (4.1–4.6): `web/temas/ut04-teoria.html`. Interactivos: conector de 24
  pines (explorar y «Encuéntralo»), tolerancias, potencia de la fuente.
- Teoría 2 (4.7–4.14): `web/temas/ut04-teoria-2.html`. Interactivo: ordena el
  montaje.
- Ejercicios: `web/temas/ut04-ejercicios.html` (4 boletines, 24 ejercicios).
  Solucionario: `temario/soluciones/ut04-ejercicios-solucionario.md`, generado por
  `scripts/generar_ut04_solucionario.py`, que lee los datos del enunciado y contrasta
  tolerancias, eficiencias y fórmulas con `web/assets/ut04-interactivos.js`.
- Prácticas P9–P12: `web/temas/ut04-practicas.html`, con rúbrica de 10 puntos y
  CE en cada fila.
- Recursos propios: `web/assets/ut04.css` y `web/assets/ut04-interactivos.js`. Las
  páginas del tema cargan también `ut02.css`, `ut03.css` y `ut02-interactivos.js`
  (cuestionarios y estilos de los interactivos). No se ha modificado ningún recurso
  compartido.
