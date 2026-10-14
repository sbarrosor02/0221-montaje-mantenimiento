# Tema 2 · Solucionario de los circuitos lógicos

Generado por `scripts/generar_circuitos_logicos.py`. No se publica en la página del alumnado.
Cada tabla se ha obtenido simulando la red reconstruida desde el dibujo y se ha contrastado
con la expresión simplificada.

> Los circuitos 3 y 4 del boletín original dan **F = 0** para cualquier entrada. Se mantienen
> tal cual: obligan a simplificar en lugar de fiarse del dibujo.

## Circuito 1

**F = A'·B + B'·C'**

1. Puerta 1: A' (NOT de A).
2. Puerta 2: A'·B.
3. Puerta 3: NOR de B y C = (B + C)' = B'·C' (De Morgan).
4. Puerta 4: C'.
5. Puerta 5: B'·C'·C' = B'·C' (C'·C' = C').
6. Salida: F = A'·B + B'·C'.

| A | B | C | F |
|---|---|---|---|
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 |

## Circuito 2

**F = A·B + B'·C**

1. Puerta 1: A·B.
2. Puerta 2: B'.
3. Puerta 3: B + C (ojo: C cruza la bajada de B sin punto, no están unidas).
4. Puerta 4: B'·(B + C) = B'·B + B'·C = 0 + B'·C = B'·C.
5. Salida: F = A·B + B'·C.

| A | B | C | F |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

## Circuito 3

**F = 0 (siempre)**

1. Puerta 1: A'.  Puerta 2: A' + B.
2. Puerta 3: C'.  Puerta 4: B·C'.
3. Puerta 5: NOR = (A' + B)'·(B·C')'.
4. Salida: F = (A' + B)'·(B·C')'·(B·C'). Aparece X'·X con X = B·C', que vale 0.
5. F = 0 para cualquier combinación: la salida nunca se enciende.

| A | B | C | F |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 |

## Circuito 4

**F = 0 (siempre)**

1. Puerta 1: B'.  Puerta 2: A·B'.
2. Puerta 3: NAND = (A·B'·B')' = (A·B')'.
3. Puerta 4: B' + C.
4. Salida: NOR = [(A·B')']'·(B' + C)' = A·B'·B·C' (De Morgan: (B' + C)' = B·C').
5. Aparece B'·B = 0, así que F = 0 para cualquier combinación.

| A | B | C | F |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 |

## Circuito 5

**F = A·B' + A'·B  (es una XOR)**

1. Puertas 1 y 2: A' y B'.
2. Puerta 3: A·B'.  Puerta 4: A'·B.
3. Salida: F = A·B' + A'·B: vale 1 solo cuando A y B son distintas. Es una puerta XOR construida con AND, OR y NOT.

| A | B | F |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## Circuito 6

**F = A·B + A·C + B·C  (función mayoría)**

1. Puertas 1, 2 y 3: A·B, A·C y B·C.
2. Puerta 4: A·B + A·C.  Salida: F = A·B + A·C + B·C.
3. Vale 1 cuando al menos dos de las tres entradas valen 1 (votación por mayoría).

| A | B | C | F |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |
