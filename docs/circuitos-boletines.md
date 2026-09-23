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
