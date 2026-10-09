# Circuitos de los boletines · revisión del 23/09/2026

## Fuentes y correspondencia

Se han inspeccionado las páginas renderizadas de los PDF aportados por el profesor:

- `MME_TEMA1_EJERCICIOS-1.pdf`, página 4: circuito de 45 V, último ejercicio.
- `Ejercicios_circuitos_mixtos.pdf`, páginas 1–5: cinco circuitos manuscritos.

El primer PDF repite «Ejercicio 4». La web mantiene su numeración correlativa
1–10: el nuevo 10 corresponde al 9 del original. El ejercicio web 9, de 6 A,
corresponde al 8 original. No son dos versiones del mismo circuito.

Se conservan resistencias, valores, ramas y posición relativa de los grupos.
Los símbolos +/− fijan una polaridad de referencia en las fuentes manuscritas
que solo mostraban un círculo; no alteran la intensidad total en valor absoluto.
Los dibujos nuevos están en `web/assets/img/circuitos/` y contienen título y
descripción accesibles, además de las descripciones HTML de las imágenes.

## Verificación eléctrica

`python scripts/generar_circuitos.py` regenera los seis SVG y comprueba sus redes.
El script construye la conectividad a partir de los extremos de resistencias,
fuentes y segmentos de conductor usados para dibujar. Rechaza resistencias y
fuentes cortocircuitadas y redes singulares. Resuelve las tensiones de los nodos
para una fuente de 1 V y contrasta la resistencia equivalente con una reducción
serie/paralelo calculada por separado a partir de la lectura del original.

En las expresiones siguientes, `||` indica paralelo y `+` indica serie.

| Esquema | Reducción contrastada | R equivalente |
|---|---|---|
| B1, 10 | 1,5 + (6,2 || 120 || (3,3 + (820 || 430))) | 7,276081 Ω |
| B2, 1 | 1000 + 3000 + ((8,2 + 160) || (16 + 75 + (82 || 150))) + (51 || 130) | 4114,215876 Ω |
| B2, 2 | 1 + (12,5 || 50) + 1 + (20 || 20) | 22 Ω |
| B2, 3 | (4 + (16 || (10 + 20 + 18) || 24)) || ((12 || 4) + 3) | 4 Ω |
| B2, 4 | (12 || 12) + ((20 + 4) || 8 || 6) | 9 Ω |
| B2, 5 | 4 + (4 || (3 + ((20 + 16) || ((12 || 4) + 6)))) | 6,873239 Ω |

Valores de contraste: B1-10, 6,184648 A; B2-1, 246,852953 V;
B2-2, 5 A; B2-3, 6 A; B2-4, 2,333333 A; B2-5, 5,092213 A.
Este documento es documentación técnica del repositorio, no un archivo privado.
No se añaden soluciones a los ejercicios sin resolver en la página del alumnado.

## Correcciones de los esquemas existentes

- Resuelto R2, en teoría y ejercicios: eliminado el conductor lateral que unía
  directamente los dos raíles y cortocircuitaba las tres resistencias.
- Ejercicio web 9: conectada la quinta resistencia de 1 kΩ a ambos raíles;
  eliminado el cable que atravesaba su símbolo. La fuente se conserva a la
  izquierda, posición equivalente a la del original, con explicación expresa.
- Resuelto R3: ampliado el encuadre para que las etiquetas de la derecha quepan.

## Presentación y mantenimiento

Las imágenes nuevas permiten abrir el SVG completo y descargarlo. En pantallas
estrechas tienen desplazamiento horizontal propio para mantener legibles los
valores; al imprimir se ajustan al ancho de página. El antiguo enlace a la
sección de pendientes se conserva como ancla de entrada al boletín 2.

Después de modificar títulos o apartados, ejecutar también
`python scripts/actualizar_aula.py` para regenerar el índice y el catálogo.

## Boletines 4 y 5 · revisión del 09/10/2026

`python scripts/generar_boletines_4_5.py` genera los doce SVG
(`boletin-4-N.svg`, `boletin-5-N.svg`) y `web/assets/circuitos-nudos.js`, que
son los datos del taller de nudos. Solo usa la biblioteca estándar.

- **Boletín 4**: circuitos dibujados de forma ordenada a partir de su
  expresión serie/paralelo. El script comprueba que el dibujo y la expresión
  dan la misma resistencia equivalente.
- **Boletín 5**: geometría libre (diagonales, cruces sin punto, cortocircuitos,
  ramas abiertas y un puente equilibrado). Cada red se resuelve por análisis
  nodal modificado, con fuentes ideales, y se contrasta con la reducción
  escrita a mano.

| Esquema | Reducción contrastada | R equivalente | I |
|---|---|---|---|
| B4, 1 | 2 + ((4 + (12 \|\| 6)) \|\| 8) + (3 \|\| 6) | 8 Ω | 3 A |
| B4, 2 | 5 + ((10 + (30 \|\| 15)) \|\| ((20 \|\| 20) + 10) \|\| 10) + (40 \|\| 10) + 2 | 20 Ω | 3 A |
| B4, 3 | 1200 + ((2200 + 1800) \|\| (1000 + (6000 \|\| 3000) + 1000)) + 800 | 4 kΩ | 5 mA (20 V) |
| B4, 4 | escalera 6 + (6 \|\| (3 + (6 \|\| (3 + (6 \|\| (4 + (6 \|\| 3))))))) | 9 Ω | 4 A |
| B4, 5 | ((8 + 4) \|\| 6 \|\| 4) + 4 + ((6 + (4 \|\| 12)) \|\| 18) | 12 Ω | 2 A |
| B4, 6 | 3 + ((Rx + 4) \|\| 12) + (10 \|\| (6 + (8 \|\| 8))), con Rx = 8 | 14 Ω | 2 A |
| B5, 1 | 3 + (6 \|\| (2 + (6 \|\| 12))) | 6 Ω | 3 A |
| B5, 2 | 4 + (12 \|\| 6) + 4; R4 cortocircuitada y R5 abierta | 12 Ω | 2 A |
| B5, 3 | 3 + (12 \|\| 6 \|\| ((12 \|\| 6) + 8)) | 6 Ω | 3 A |
| B5, 4 | 3 + (6 \|\| 12 \|\| 4) + 1 | 6 Ω | 2 A |
| B5, 5 | 2 + (6 \|\| (8 + (12 \|\| 6))), fuentes 36 − 6 = 30 V | 6 Ω | 5 A |
| B5, 6 | 2 + ((6 + 12) \|\| (3 + 6)); puente equilibrado, R5 sin corriente | 8 Ω | 2 A |

Como en los boletines anteriores, la página del alumnado no incluye las
soluciones. Los solucionarios para el profesor están en `temario/soluciones/`:
enunciados con solucionario de los dos boletines y la resolución paso a paso
del boletín 5 con los nudos coloreados.

### Taller de nudos

`web/temas/ut01-ejercicios-nudos.html` + `web/assets/taller-nudos.js`.
Sin dependencias ni red, y funciona abriendo el HTML desde el disco, porque
los datos se cargan como script y no con `fetch`. No guarda nada.

1. **Colorear nudos**: cada cable y cada patilla es un trozo pintable. Al
   pintar un cable se pintan las patillas que lo tocan, pero no los cables
   que llegan por otro camino. «Comprobar» detecta trozos sin pintar, nudos
   con dos colores y colores repetidos en nudos distintos.
2. **Reducir**: el alumno selecciona resistencias y elige serie, paralelo o
   «no conduce». El taller valida la relación con los nudos (paralelo:
   mismos dos nudos; serie: cadena cuyos nudos intermedios no tienen otras
   ramas ni la fuente; quitar: cortocircuito, extremo libre o corriente nula
   calculada, como en el puente equilibrado) y pide el valor equivalente con
   un 1 % de tolerancia. El botón de pista redibuja el estado actual de forma
   ordenada.
3. **Intensidad total** con la Ley de Ohm.

Para añadir circuitos al taller, se añade un objeto `Free` a `B5` en el
script y se vuelve a ejecutar.
