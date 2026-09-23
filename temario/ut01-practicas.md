---
modulo: "0221"
ut: 1
tipo: "prácticas"
titulo: "Prácticas de circuitos eléctricos (Tema 1)"
ra: ["RA3"]
ce: ["RA3.b", "RA3.c", "RA3.d", "RA3.e"]
evaluacion: 1
---

# Prácticas del Tema 1 — Circuitos eléctricos

> Publicado en `web/temas/ut01-practicas.html`. Son las actividades
> **evaluables** del tema: montar y medir, frente a los *ejercicios*
> (`ut01-ejercicios.html`), que son de cálculo sobre el papel.

## P1 · Tinkercad y medidas con el multímetro

Práctica **introductoria al simulador** Tinkercad Circuits, muy guiada paso a
paso. El alumnado monta cuatro circuitos y mide en ellos **voltaje, intensidad y
resistencia** con el multímetro, comprobando la Ley de Ohm.

**Duración**: 2 sesiones. **Entrega**: PDF `P1_apellido_nombre.pdf` con capturas
de cada circuito simulando, tablas completas, cálculos y conclusiones.

### Por qué este orden de medidas

Es una progresión de dificultad real, no arbitraria:

1. **Voltaje** (voltímetro, en paralelo): se añade "al lado", sin tocar el
   circuito. Es lo más fácil.
2. **Intensidad** (amperímetro, en serie): obliga a **cortar** el circuito e
   intercalar el aparato. Es el concepto que más cuesta.
3. **Resistencia** (óhmetro): obliga a **quitar la alimentación** y, a ser
   posible, sacar el componente del circuito.

### Circuitos y valores (elegidos para que salgan números redondos)

| Circuito | Montaje | Resultados |
|---|---|---|
| 1 · Básico | 9 V + R = 100 Ω | I = 90 mA; V_R = 9 V |
| 2 · Serie | 9 V + 100 + 220 + 680 Ω | **R_t = 1000 Ω**; I = 9 mA; V = 0,9 / 1,98 / 6,12 V (suman 9 V) |
| 3 · Paralelo | 9 V + 1 kΩ ∥ 2 kΩ | V = 9 V en ambas; I₁ = 9 mA, I₂ = 4,5 mA, I_t = 13,5 mA; R_eq ≈ 667 Ω |
| 4 · Mixto (extra 1) | 9 V + 100 Ω en serie con (1 kΩ ∥ 1 kΩ) | R_par = 500 Ω; **R_t = 600 Ω**; I = 15 mA; V₁ = 1,5 V; V_par = 7,5 V |
| 5 · Mixto avanzado (extra 2) | 12 V + 200 Ω · (600 ∥ 300) · 100 Ω | R_par = 200 Ω; **R_t = 500 Ω**; I = 24 mA; V = 4,8 / 4,8 / 2,4 V (suman 12 V); I₂ = 8 mA, I₃ = 16 mA |
| 6 · LED (extra 3) | 9 V + R limitadora + LED rojo | R = (9−2)/0,02 = 350 Ω → se usa **330 Ω**; I ≈ 21 mA; V_LED ≈ 2 V; V_R ≈ 7 V |

La elección de 100 + 220 + 680 = 1000 Ω exactos y del mixto a 600 Ω es
deliberada: con números redondos, el alumno detecta **por sí mismo** si ha
cableado mal, sin depender del profesor.

### Errores típicos que hay que vigilar

- Conectar el **amperímetro en paralelo** con la fuente → cortocircuito (en
  Tinkercad sale humo/aviso; en el taller funde el fusible del polímetro). Está
  avisado expresamente en la página.
- Medir **resistencia con el circuito alimentado** → lectura falseada.
- Confundir la **unidad** en las propiedades de la resistencia (Ω frente a kΩ).
- No mirar si el multímetro da la corriente en **A o en mA**.

### Rúbrica (10 puntos)

| Criterio | Puntos |
|---|---|
| Circuito básico montado y simulando | 1,0 |
| Medida de voltaje correcta, voltímetro en paralelo | 1,5 |
| Medida de intensidad correcta, amperímetro en serie | 1,5 |
| Medida de resistencia correcta, sin alimentación | 1,0 |
| Serie: tabla completa y comprobación V₁+V₂+V₃ = 9 V | 2,0 |
| Paralelo: tabla completa y comprobación I₁+I₂ = I_total | 2,0 |
| Conclusiones y comparación medido/calculado | 1,0 |

### Puntos extra (Parte 7, voluntario: hasta 2 puntos)

| Reto | Qué añade | Extra |
|---|---|---|
| Extra 1 · Circuito mixto | Combinar serie y paralelo por primera vez | +0,5 |
| Extra 2 · Circuito mixto avanzado | Serie-paralelo-serie con 4 resistencias y 12 V; obliga a resolver por partes | +0,75 |
| Extra 3 · Tu primer LED | Polaridad, tensión directa fija y **resistencia limitadora** | +0,75 |

**Por qué el LED merece la pena.** Enseña lo que las resistencias solas no
pueden: que **no todo componente cumple la Ley de Ohm**. El LED se queda con una
tensión casi fija (~2 V en rojo), así que R se calcula con
**R = (V_fuente − V_LED) / I_LED**. Incluye dos experimentos:

1. LED al revés → no luce (un diodo solo conduce en un sentido).
2. LED sin resistencia a 9 V → **se quema** (Tinkercad lo simula con aviso). Es
   la lección que en el taller costaría un componente cada vez.

### Nota sobre Tinkercad

La interfaz cambia de vez en cuando el texto de los botones y el nombre de algún
componente. La página lo advierte para que el alumnado busque el equivalente en
lugar de bloquearse.

## Próximas prácticas

- **P2** — Montaje real en placa protoboard y medidas con el polímetro del taller.
- **P3** — Identificación de componentes y código de colores de resistencias.
