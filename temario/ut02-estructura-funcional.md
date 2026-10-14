---
modulo: "0221"
ut: 2
titulo: "Estructura funcional del ordenador y arquitectura de buses"
ra: [RA1]
ce: [RA1.a, RA1.b]
horas: 6
evaluacion: 1
---

# Tema 2 · Estructura funcional del ordenador y arquitectura de buses

Documento de trabajo del profesor: correspondencia con la programación, decisiones sobre
los apuntes del curso 2023/24 y relación de materiales. El contenido para el alumnado está
en `web/temas/ut02*.html`.

## Programación 2026/27

UT2, 1.ª evaluación, 6 h, modalidad centro. Contenidos: bloques funcionales de un sistema
microinformático; arquitectura Von Neumann y flujo de información; buses de datos, control
y direcciones; funciones de la CPU, la memoria principal y los dispositivos de E/S;
representación de la información en sistemas digitales.

**RA1.** Selecciona los componentes que integran un equipo microinformático estándar,
describiendo sus funciones y comparando prestaciones de distintos fabricantes.

- a) Se han descrito los bloques que componen un equipo microinformático y sus funciones.
- b) Se ha reconocido la arquitectura de buses.

Las 6 h de la programación se amplían según el ritmo del grupo (unas 11 sesiones con la
P4). Las puertas lógicas no figuran en los contenidos de la UT2: se incluyen como base de
la UAL y no se evalúan por separado. El RA3 l) (componentes de electrónica digital) es de
la UT1 y, por la regla de criterios exclusivos de la programación, no se evalúa aquí.

## Cambios respecto a los apuntes de 2023/24

Se suprimen, de acuerdo con el profesor:

- conversión analógico-digital con comparadores y LDR (1.5);
- clasificación del software y software de aplicación (1.17);
- sistemas secuenciales y microprogramables en detalle (1.3.2 y 1.3.3); queda un resumen
  de combinacional y secuencial;
- niveles de Levy y organización estructural (1.8 y 1.16), que se repetían; quedan
  fusionados en una tabla breve (apartado 2.8).

Se amplían: buses (CE b: ancho, 2ⁿ direcciones, ancho de banda, buses actuales punto a punto
y serie), unidades KB/KiB, jerarquía de memoria con tiempos de acceso reales y ciclo de
instrucción con simulador.

Se corrigen:

- «Registro Intermedio (RI)» → Registro de **Instrucción**.
- Tabla de jerarquía de memoria con velocidades en kHz/MHz → tiempos de acceso (ns, µs, ms).
- E/S aislada descrita como «un bus por dispositivo» → espacio de direcciones de E/S propio,
  con instrucciones y señal de control específicas.
- Nombres de registros de memoria incoherentes entre texto y figuras (RD, RM, RO).
- Pie de la figura 1.20 («Distribución de la unidad de memoria» en el esquema de periférico).
- Apartados 1.12 y 1.13 con el mismo título.
- «0 y 1 = 0 V y 5 V»: se matiza con las tensiones actuales.
- Arduino citado como ejemplo de Von Neumann: su microcontrolador es Harvard.

## Materiales

| Material | Archivo | Verificación |
|---|---|---|
| Portada | `web/temas/ut02.html` | — |
| Teoría con piezas interactivas | `web/temas/ut02-teoria.html` | Pruebas de interacción en Chromium, 1440 y 390 px |
| Simulador de CPU y retos R1–R4 | `web/temas/ut02-ejercicios-cpu.html`, `web/assets/ut02-cpu.js` | `scripts/generar_trazas_cpu.py --web` |
| Boletines 1–4 | `web/temas/ut02-ejercicios.html` | — |
| Circuitos lógicos | `web/assets/img/logica/` | `scripts/generar_circuitos_logicos.py` |
| Práctica P4 | `web/temas/ut02-practicas.html` | — |
| Solucionarios | `temario/soluciones/ut02-*.md` | Los de circuitos y programas se generan por script |

`web/assets/ut02.css` y `web/assets/ut02-interactivos.js` son propios de este tema y **no**
forman parte de los archivos compartidos con 0223.

## Verificación de los circuitos lógicos

`generar_circuitos_logicos.py` sustituye al análisis nodal de los circuitos eléctricos.
Comprueba que cada cable es ortogonal, que cada red es conexa y toca exactamente sus
patillas, que dos redes distintas solo se cruzan en perpendicular y que ningún cable
atraviesa una puerta. Después reconstruye la red de puertas desde el dibujo, la compara con
la declarada y contrasta la tabla de verdad simulada con la expresión simplificada.

Los circuitos 1–4 reproducen la imagen del boletín original:

| Circuito | F |
|---|---|
| 1 | A'·B + B'·C' |
| 2 | A·B + B'·C |
| 3 | 0 (siempre) |
| 4 | 0 (siempre) |
| 5 (nuevo) | A ⊕ B |
| 6 (nuevo) | A·B + A·C + B·C (mayoría) |

En el original, la puerta central del circuito 1 es una **NOR** (OR con círculo), no una
NAND. Los circuitos 3 y 4 dan F = 0 para cualquier entrada; se mantienen como están dibujados.

## Boletín 4

Programas del ejercicio 8 del boletín del profesor. Resultados: P1 AC = 23 en 301 · P2 3 en
303 · P3 75 en 305 · P4 7 en 309 · P5 15 en 312 · P6 10 en 314. En el programa 5 la celda
312 ya contenía 0015: la escritura no cambia su valor. Conviene comentarlo en clase.
