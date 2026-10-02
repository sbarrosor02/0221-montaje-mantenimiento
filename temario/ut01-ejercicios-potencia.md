---
modulo: "0221"
ut: 1
tipo: "ejercicios"
titulo: "Boletín 3 · Potencia y energía (Tema 1)"
ra: ["RA3"]
ce: ["RA3.c", "RA3.d"]
evaluacion: 1
---

# Boletín 3 — Potencia y energía

> Publicado en `web/temas/ut01-ejercicios.html#b3`. Tres resueltos en la web
> (R4–R6) y doce ejercicios **sin solución en la página del alumnado**, como el
> resto de boletines. Solucionario abajo, para uso del profesor.

## Enfoque

Reutiliza circuitos que el alumnado ya conoce (R1, R2, R3, boletín 1 ej. 4,
boletín 2 ej. 4 y el panel de LED de la P2) para que el esfuerzo vaya a la
potencia y no a volver a reducir resistencias. Hilo conductor:
**conservación de la potencia** (P_fuente = Σ P), que sirve de autocomprobación,
y contexto informático (fuente ATX, servidor, standby, pila).

Los ejercicios 3 y 4 van en pareja a propósito: en serie disipa más la
resistencia **mayor** (I² · R, misma I); en paralelo, la **menor** (V² / R,
misma V).

## Solucionario

| # | Resultado |
|---|---|
| 1 | I = 60 / 230 ≈ **0,261 A**; R = 230² / 60 ≈ **882 Ω** |
| 2 | P = 12² / 100 = **1,44 W** > 0,25 W → se quema; comprar de **2 W** (o 3 W con margen doble) |
| 3 | I = 1,5 A → P = **2,25 / 4,5 / 6,75 W**; total 13,5 W = 9 · 1,5 ✔. En serie disipa más la mayor |
| 4 | P = 81/R → **27 / 20,25 / 6,75 W**; total 54 W = 9 · 6 ✔. En paralelo disipa más la menor |
| 5 | R = 45 Ω, I = 2 A → **40 / 20 / 8 / 32 / 80 W** (10, 5, 2, 8, 20 Ω); total **180 W** = 90 · 2 ✔ |
| 6 | R = V² / P = 25 / 0,25 = **100 Ω** |
| 7 | 6 ∥ 3 = 2 Ω; R_t = 6 Ω; **I = 2 A**. P₁ = P₄ = **8 W**; V_par = 4 V → P₂ = **2,67 W**, P₃ = **5,33 W**; total **24 W** = 12 · 2 ✔ |
| 8 | 300 + 50 + 26,4 = **376,4 W**; entrada 376,4 / 0,85 ≈ **443 W**; calor ≈ **66 W** (el ventilador lo evacua) |
| 9 | 0,4 · 8760 = **3504 kWh → 525,60 €/año**; standby 0,0005 · 8760 = **4,38 kWh → 0,66 €/año** |
| 10 | I_rama ≈ 13,6 mA. P_R = 3 · 0,0136 ≈ **41 mW** cada una; P_LED = 2 · 0,0136 ≈ **27 mW** cada uno; total 9 · 0,0273 ≈ **0,245 W**; en resistencias 82 mW → **33 %** |
| 11 | 500 / 21,2 ≈ **23,6 h**; E = 9 · 0,5 = **4,5 Wh** |
| 12 | R_eq = 9 Ω; I = 21 / 9 ≈ 2,33 A; **P = 49 W**. V(12 ∥ 12) = 14 V → **16,33 W** cada una. V(ramas) = 7 V → 20 + 4 Ω: I = 0,292 A → **1,70 W** (20 Ω) y **0,34 W** (4 Ω); 8 Ω: **6,125 W**; 6 Ω: **8,17 W**. Suma 49 W ✔ |

Cálculos verificados con script el 02/10/2026.
