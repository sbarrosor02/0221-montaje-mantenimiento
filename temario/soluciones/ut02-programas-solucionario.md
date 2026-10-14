# Tema 2 · Solucionario de los programas (ejecución de instrucciones)

Generado por `scripts/generar_trazas_cpu.py`. No se publica en la página del alumnado.
Valores tras cada paso. CP = contador de programa, RI = registro de instrucción,
RD = registro de direcciones, RM = registro de memoria, AC = acumulador.

Juego de instrucciones del boletín: 1 cargar, 2 almacenar, 3 sumar, 4 restar, 5 multiplicar, 6 dividir.
El ejemplo de los apuntes usa otro: 1 cargar, 2 restar, 3 almacenar.

## Programa 1

Memoria inicial: 100: 1300, 101: 3301, 102: 2301, 300: 0016, 301: 0007

**Resultado:** AC = 23; se guarda en 301 (pasa de 0007 a 0023).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 100 | — | 100 | — | 0000 | RD ← CP (100); la dirección sale por el bus de direcciones |
| Búsqueda | 100 | — | 100 | 1300 | 0000 | Lectura de 100: RM ← 1300 |
| Búsqueda | 101 | 1300 | 100 | 1300 | 0000 | RI ← RM (1300); CP ← 101 |
| Decodificación | 101 | 1300 | 100 | 1300 | 0000 | Operación 1 = cargar; dirección 300 |
| Ejecución | 101 | 1300 | 300 | 1300 | 0000 | RD ← 300 |
| Ejecución | 101 | 1300 | 300 | 0016 | 0000 | Lectura de 300: RM ← 0016 |
| Ejecución | 101 | 1300 | 300 | 0016 | 0016 | AC ← RM = 0016 |
| Búsqueda | 101 | 1300 | 101 | 0016 | 0016 | RD ← CP (101); la dirección sale por el bus de direcciones |
| Búsqueda | 101 | 1300 | 101 | 3301 | 0016 | Lectura de 101: RM ← 3301 |
| Búsqueda | 102 | 3301 | 101 | 3301 | 0016 | RI ← RM (3301); CP ← 102 |
| Decodificación | 102 | 3301 | 101 | 3301 | 0016 | Operación 3 = sumar; dirección 301 |
| Ejecución | 102 | 3301 | 301 | 3301 | 0016 | RD ← 301 |
| Ejecución | 102 | 3301 | 301 | 0007 | 0016 | Lectura de 301: RM ← 0007 |
| Ejecución | 102 | 3301 | 301 | 0007 | 0023 | UAL: AC ← 16 + 7 = 23 |
| Búsqueda | 102 | 3301 | 102 | 0007 | 0023 | RD ← CP (102); la dirección sale por el bus de direcciones |
| Búsqueda | 102 | 3301 | 102 | 2301 | 0023 | Lectura de 102: RM ← 2301 |
| Búsqueda | 103 | 2301 | 102 | 2301 | 0023 | RI ← RM (2301); CP ← 103 |
| Decodificación | 103 | 2301 | 102 | 2301 | 0023 | Operación 2 = almacenar; dirección 301 |
| Ejecución | 103 | 2301 | 301 | 2301 | 0023 | RD ← 301 |
| Ejecución | 103 | 2301 | 301 | 0023 | 0023 | RM ← AC (0023) |
| Ejecución | 103 | 2301 | 301 | 0023 | 0023 | Escritura: M[301] ← 0023 |
| Búsqueda | 103 | 2301 | 103 | 0023 | 0023 | RD ← CP (103); la dirección sale por el bus de direcciones |
| Búsqueda | 103 | 2301 | 103 | 0000 | 0023 | Lectura de 103: RM ← 0000 |
| Búsqueda | 104 | 0000 | 103 | 0000 | 0023 | RI ← RM (0000); CP ← 104 |
| Fin | 104 | 0000 | 103 | 0000 | 0023 | 0000: fin del programa |

## Programa 2

Memoria inicial: 110: 1302, 111: 4303, 112: 2303, 302: 0013, 303: 0010

**Resultado:** AC = 3; se guarda en 303 (pasa de 0010 a 0003).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 110 | — | 110 | — | 0000 | RD ← CP (110); la dirección sale por el bus de direcciones |
| Búsqueda | 110 | — | 110 | 1302 | 0000 | Lectura de 110: RM ← 1302 |
| Búsqueda | 111 | 1302 | 110 | 1302 | 0000 | RI ← RM (1302); CP ← 111 |
| Decodificación | 111 | 1302 | 110 | 1302 | 0000 | Operación 1 = cargar; dirección 302 |
| Ejecución | 111 | 1302 | 302 | 1302 | 0000 | RD ← 302 |
| Ejecución | 111 | 1302 | 302 | 0013 | 0000 | Lectura de 302: RM ← 0013 |
| Ejecución | 111 | 1302 | 302 | 0013 | 0013 | AC ← RM = 0013 |
| Búsqueda | 111 | 1302 | 111 | 0013 | 0013 | RD ← CP (111); la dirección sale por el bus de direcciones |
| Búsqueda | 111 | 1302 | 111 | 4303 | 0013 | Lectura de 111: RM ← 4303 |
| Búsqueda | 112 | 4303 | 111 | 4303 | 0013 | RI ← RM (4303); CP ← 112 |
| Decodificación | 112 | 4303 | 111 | 4303 | 0013 | Operación 4 = restar; dirección 303 |
| Ejecución | 112 | 4303 | 303 | 4303 | 0013 | RD ← 303 |
| Ejecución | 112 | 4303 | 303 | 0010 | 0013 | Lectura de 303: RM ← 0010 |
| Ejecución | 112 | 4303 | 303 | 0010 | 0003 | UAL: AC ← 13 − 10 = 3 |
| Búsqueda | 112 | 4303 | 112 | 0010 | 0003 | RD ← CP (112); la dirección sale por el bus de direcciones |
| Búsqueda | 112 | 4303 | 112 | 2303 | 0003 | Lectura de 112: RM ← 2303 |
| Búsqueda | 113 | 2303 | 112 | 2303 | 0003 | RI ← RM (2303); CP ← 113 |
| Decodificación | 113 | 2303 | 112 | 2303 | 0003 | Operación 2 = almacenar; dirección 303 |
| Ejecución | 113 | 2303 | 303 | 2303 | 0003 | RD ← 303 |
| Ejecución | 113 | 2303 | 303 | 0003 | 0003 | RM ← AC (0003) |
| Ejecución | 113 | 2303 | 303 | 0003 | 0003 | Escritura: M[303] ← 0003 |
| Búsqueda | 113 | 2303 | 113 | 0003 | 0003 | RD ← CP (113); la dirección sale por el bus de direcciones |
| Búsqueda | 113 | 2303 | 113 | 0000 | 0003 | Lectura de 113: RM ← 0000 |
| Búsqueda | 114 | 0000 | 113 | 0000 | 0003 | RI ← RM (0000); CP ← 114 |
| Fin | 114 | 0000 | 113 | 0000 | 0003 | 0000: fin del programa |

## Programa 3

Memoria inicial: 110: 1304, 111: 5305, 112: 2305, 304: 0025, 305: 0003

**Resultado:** AC = 75; se guarda en 305 (pasa de 0003 a 0075).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 110 | — | 110 | — | 0000 | RD ← CP (110); la dirección sale por el bus de direcciones |
| Búsqueda | 110 | — | 110 | 1304 | 0000 | Lectura de 110: RM ← 1304 |
| Búsqueda | 111 | 1304 | 110 | 1304 | 0000 | RI ← RM (1304); CP ← 111 |
| Decodificación | 111 | 1304 | 110 | 1304 | 0000 | Operación 1 = cargar; dirección 304 |
| Ejecución | 111 | 1304 | 304 | 1304 | 0000 | RD ← 304 |
| Ejecución | 111 | 1304 | 304 | 0025 | 0000 | Lectura de 304: RM ← 0025 |
| Ejecución | 111 | 1304 | 304 | 0025 | 0025 | AC ← RM = 0025 |
| Búsqueda | 111 | 1304 | 111 | 0025 | 0025 | RD ← CP (111); la dirección sale por el bus de direcciones |
| Búsqueda | 111 | 1304 | 111 | 5305 | 0025 | Lectura de 111: RM ← 5305 |
| Búsqueda | 112 | 5305 | 111 | 5305 | 0025 | RI ← RM (5305); CP ← 112 |
| Decodificación | 112 | 5305 | 111 | 5305 | 0025 | Operación 5 = multiplicar; dirección 305 |
| Ejecución | 112 | 5305 | 305 | 5305 | 0025 | RD ← 305 |
| Ejecución | 112 | 5305 | 305 | 0003 | 0025 | Lectura de 305: RM ← 0003 |
| Ejecución | 112 | 5305 | 305 | 0003 | 0075 | UAL: AC ← 25 × 3 = 75 |
| Búsqueda | 112 | 5305 | 112 | 0003 | 0075 | RD ← CP (112); la dirección sale por el bus de direcciones |
| Búsqueda | 112 | 5305 | 112 | 2305 | 0075 | Lectura de 112: RM ← 2305 |
| Búsqueda | 113 | 2305 | 112 | 2305 | 0075 | RI ← RM (2305); CP ← 113 |
| Decodificación | 113 | 2305 | 112 | 2305 | 0075 | Operación 2 = almacenar; dirección 305 |
| Ejecución | 113 | 2305 | 305 | 2305 | 0075 | RD ← 305 |
| Ejecución | 113 | 2305 | 305 | 0075 | 0075 | RM ← AC (0075) |
| Ejecución | 113 | 2305 | 305 | 0075 | 0075 | Escritura: M[305] ← 0075 |
| Búsqueda | 113 | 2305 | 113 | 0075 | 0075 | RD ← CP (113); la dirección sale por el bus de direcciones |
| Búsqueda | 113 | 2305 | 113 | 0000 | 0075 | Lectura de 113: RM ← 0000 |
| Búsqueda | 114 | 0000 | 113 | 0000 | 0075 | RI ← RM (0000); CP ← 114 |
| Fin | 114 | 0000 | 113 | 0000 | 0075 | 0000: fin del programa |

## Programa 4

Memoria inicial: 130: 1309, 131: 6308, 132: 3307, 133: 4306, 134: 2309, 306: 0003, 307: 0006, 308: 0002, 309: 0008

**Resultado:** AC = 7; se guarda en 309 (pasa de 0008 a 0007).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 130 | — | 130 | — | 0000 | RD ← CP (130); la dirección sale por el bus de direcciones |
| Búsqueda | 130 | — | 130 | 1309 | 0000 | Lectura de 130: RM ← 1309 |
| Búsqueda | 131 | 1309 | 130 | 1309 | 0000 | RI ← RM (1309); CP ← 131 |
| Decodificación | 131 | 1309 | 130 | 1309 | 0000 | Operación 1 = cargar; dirección 309 |
| Ejecución | 131 | 1309 | 309 | 1309 | 0000 | RD ← 309 |
| Ejecución | 131 | 1309 | 309 | 0008 | 0000 | Lectura de 309: RM ← 0008 |
| Ejecución | 131 | 1309 | 309 | 0008 | 0008 | AC ← RM = 0008 |
| Búsqueda | 131 | 1309 | 131 | 0008 | 0008 | RD ← CP (131); la dirección sale por el bus de direcciones |
| Búsqueda | 131 | 1309 | 131 | 6308 | 0008 | Lectura de 131: RM ← 6308 |
| Búsqueda | 132 | 6308 | 131 | 6308 | 0008 | RI ← RM (6308); CP ← 132 |
| Decodificación | 132 | 6308 | 131 | 6308 | 0008 | Operación 6 = dividir; dirección 308 |
| Ejecución | 132 | 6308 | 308 | 6308 | 0008 | RD ← 308 |
| Ejecución | 132 | 6308 | 308 | 0002 | 0008 | Lectura de 308: RM ← 0002 |
| Ejecución | 132 | 6308 | 308 | 0002 | 0004 | UAL: AC ← 8 ÷ 2 = 4 |
| Búsqueda | 132 | 6308 | 132 | 0002 | 0004 | RD ← CP (132); la dirección sale por el bus de direcciones |
| Búsqueda | 132 | 6308 | 132 | 3307 | 0004 | Lectura de 132: RM ← 3307 |
| Búsqueda | 133 | 3307 | 132 | 3307 | 0004 | RI ← RM (3307); CP ← 133 |
| Decodificación | 133 | 3307 | 132 | 3307 | 0004 | Operación 3 = sumar; dirección 307 |
| Ejecución | 133 | 3307 | 307 | 3307 | 0004 | RD ← 307 |
| Ejecución | 133 | 3307 | 307 | 0006 | 0004 | Lectura de 307: RM ← 0006 |
| Ejecución | 133 | 3307 | 307 | 0006 | 0010 | UAL: AC ← 4 + 6 = 10 |
| Búsqueda | 133 | 3307 | 133 | 0006 | 0010 | RD ← CP (133); la dirección sale por el bus de direcciones |
| Búsqueda | 133 | 3307 | 133 | 4306 | 0010 | Lectura de 133: RM ← 4306 |
| Búsqueda | 134 | 4306 | 133 | 4306 | 0010 | RI ← RM (4306); CP ← 134 |
| Decodificación | 134 | 4306 | 133 | 4306 | 0010 | Operación 4 = restar; dirección 306 |
| Ejecución | 134 | 4306 | 306 | 4306 | 0010 | RD ← 306 |
| Ejecución | 134 | 4306 | 306 | 0003 | 0010 | Lectura de 306: RM ← 0003 |
| Ejecución | 134 | 4306 | 306 | 0003 | 0007 | UAL: AC ← 10 − 3 = 7 |
| Búsqueda | 134 | 4306 | 134 | 0003 | 0007 | RD ← CP (134); la dirección sale por el bus de direcciones |
| Búsqueda | 134 | 4306 | 134 | 2309 | 0007 | Lectura de 134: RM ← 2309 |
| Búsqueda | 135 | 2309 | 134 | 2309 | 0007 | RI ← RM (2309); CP ← 135 |
| Decodificación | 135 | 2309 | 134 | 2309 | 0007 | Operación 2 = almacenar; dirección 309 |
| Ejecución | 135 | 2309 | 309 | 2309 | 0007 | RD ← 309 |
| Ejecución | 135 | 2309 | 309 | 0007 | 0007 | RM ← AC (0007) |
| Ejecución | 135 | 2309 | 309 | 0007 | 0007 | Escritura: M[309] ← 0007 |
| Búsqueda | 135 | 2309 | 135 | 0007 | 0007 | RD ← CP (135); la dirección sale por el bus de direcciones |
| Búsqueda | 135 | 2309 | 135 | 0000 | 0007 | Lectura de 135: RM ← 0000 |
| Búsqueda | 136 | 0000 | 135 | 0000 | 0007 | RI ← RM (0000); CP ← 136 |
| Fin | 136 | 0000 | 135 | 0000 | 0007 | 0000: fin del programa |

## Programa 5

Memoria inicial: 140: 1310, 141: 3310, 142: 3313, 143: 4312, 144: 2312, 310: 0005, 311: 0010, 312: 0015, 313: 0020

**Resultado:** AC = 15; se guarda en 312 (ya contenía 0015: se escribe, pero el valor no cambia).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 140 | — | 140 | — | 0000 | RD ← CP (140); la dirección sale por el bus de direcciones |
| Búsqueda | 140 | — | 140 | 1310 | 0000 | Lectura de 140: RM ← 1310 |
| Búsqueda | 141 | 1310 | 140 | 1310 | 0000 | RI ← RM (1310); CP ← 141 |
| Decodificación | 141 | 1310 | 140 | 1310 | 0000 | Operación 1 = cargar; dirección 310 |
| Ejecución | 141 | 1310 | 310 | 1310 | 0000 | RD ← 310 |
| Ejecución | 141 | 1310 | 310 | 0005 | 0000 | Lectura de 310: RM ← 0005 |
| Ejecución | 141 | 1310 | 310 | 0005 | 0005 | AC ← RM = 0005 |
| Búsqueda | 141 | 1310 | 141 | 0005 | 0005 | RD ← CP (141); la dirección sale por el bus de direcciones |
| Búsqueda | 141 | 1310 | 141 | 3310 | 0005 | Lectura de 141: RM ← 3310 |
| Búsqueda | 142 | 3310 | 141 | 3310 | 0005 | RI ← RM (3310); CP ← 142 |
| Decodificación | 142 | 3310 | 141 | 3310 | 0005 | Operación 3 = sumar; dirección 310 |
| Ejecución | 142 | 3310 | 310 | 3310 | 0005 | RD ← 310 |
| Ejecución | 142 | 3310 | 310 | 0005 | 0005 | Lectura de 310: RM ← 0005 |
| Ejecución | 142 | 3310 | 310 | 0005 | 0010 | UAL: AC ← 5 + 5 = 10 |
| Búsqueda | 142 | 3310 | 142 | 0005 | 0010 | RD ← CP (142); la dirección sale por el bus de direcciones |
| Búsqueda | 142 | 3310 | 142 | 3313 | 0010 | Lectura de 142: RM ← 3313 |
| Búsqueda | 143 | 3313 | 142 | 3313 | 0010 | RI ← RM (3313); CP ← 143 |
| Decodificación | 143 | 3313 | 142 | 3313 | 0010 | Operación 3 = sumar; dirección 313 |
| Ejecución | 143 | 3313 | 313 | 3313 | 0010 | RD ← 313 |
| Ejecución | 143 | 3313 | 313 | 0020 | 0010 | Lectura de 313: RM ← 0020 |
| Ejecución | 143 | 3313 | 313 | 0020 | 0030 | UAL: AC ← 10 + 20 = 30 |
| Búsqueda | 143 | 3313 | 143 | 0020 | 0030 | RD ← CP (143); la dirección sale por el bus de direcciones |
| Búsqueda | 143 | 3313 | 143 | 4312 | 0030 | Lectura de 143: RM ← 4312 |
| Búsqueda | 144 | 4312 | 143 | 4312 | 0030 | RI ← RM (4312); CP ← 144 |
| Decodificación | 144 | 4312 | 143 | 4312 | 0030 | Operación 4 = restar; dirección 312 |
| Ejecución | 144 | 4312 | 312 | 4312 | 0030 | RD ← 312 |
| Ejecución | 144 | 4312 | 312 | 0015 | 0030 | Lectura de 312: RM ← 0015 |
| Ejecución | 144 | 4312 | 312 | 0015 | 0015 | UAL: AC ← 30 − 15 = 15 |
| Búsqueda | 144 | 4312 | 144 | 0015 | 0015 | RD ← CP (144); la dirección sale por el bus de direcciones |
| Búsqueda | 144 | 4312 | 144 | 2312 | 0015 | Lectura de 144: RM ← 2312 |
| Búsqueda | 145 | 2312 | 144 | 2312 | 0015 | RI ← RM (2312); CP ← 145 |
| Decodificación | 145 | 2312 | 144 | 2312 | 0015 | Operación 2 = almacenar; dirección 312 |
| Ejecución | 145 | 2312 | 312 | 2312 | 0015 | RD ← 312 |
| Ejecución | 145 | 2312 | 312 | 0015 | 0015 | RM ← AC (0015) |
| Ejecución | 145 | 2312 | 312 | 0015 | 0015 | Escritura: M[312] ← 0015 |
| Búsqueda | 145 | 2312 | 145 | 0015 | 0015 | RD ← CP (145); la dirección sale por el bus de direcciones |
| Búsqueda | 145 | 2312 | 145 | 0000 | 0015 | Lectura de 145: RM ← 0000 |
| Búsqueda | 146 | 0000 | 145 | 0000 | 0015 | RI ← RM (0000); CP ← 146 |
| Fin | 146 | 0000 | 145 | 0000 | 0015 | 0000: fin del programa |

## Programa 6

Memoria inicial: 150: 1317, 151: 5315, 152: 4316, 153: 5315, 154: 2314, 314: 0001, 315: 0002, 316: 0003, 317: 0004

**Resultado:** AC = 10; se guarda en 314 (pasa de 0001 a 0010).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 150 | — | 150 | — | 0000 | RD ← CP (150); la dirección sale por el bus de direcciones |
| Búsqueda | 150 | — | 150 | 1317 | 0000 | Lectura de 150: RM ← 1317 |
| Búsqueda | 151 | 1317 | 150 | 1317 | 0000 | RI ← RM (1317); CP ← 151 |
| Decodificación | 151 | 1317 | 150 | 1317 | 0000 | Operación 1 = cargar; dirección 317 |
| Ejecución | 151 | 1317 | 317 | 1317 | 0000 | RD ← 317 |
| Ejecución | 151 | 1317 | 317 | 0004 | 0000 | Lectura de 317: RM ← 0004 |
| Ejecución | 151 | 1317 | 317 | 0004 | 0004 | AC ← RM = 0004 |
| Búsqueda | 151 | 1317 | 151 | 0004 | 0004 | RD ← CP (151); la dirección sale por el bus de direcciones |
| Búsqueda | 151 | 1317 | 151 | 5315 | 0004 | Lectura de 151: RM ← 5315 |
| Búsqueda | 152 | 5315 | 151 | 5315 | 0004 | RI ← RM (5315); CP ← 152 |
| Decodificación | 152 | 5315 | 151 | 5315 | 0004 | Operación 5 = multiplicar; dirección 315 |
| Ejecución | 152 | 5315 | 315 | 5315 | 0004 | RD ← 315 |
| Ejecución | 152 | 5315 | 315 | 0002 | 0004 | Lectura de 315: RM ← 0002 |
| Ejecución | 152 | 5315 | 315 | 0002 | 0008 | UAL: AC ← 4 × 2 = 8 |
| Búsqueda | 152 | 5315 | 152 | 0002 | 0008 | RD ← CP (152); la dirección sale por el bus de direcciones |
| Búsqueda | 152 | 5315 | 152 | 4316 | 0008 | Lectura de 152: RM ← 4316 |
| Búsqueda | 153 | 4316 | 152 | 4316 | 0008 | RI ← RM (4316); CP ← 153 |
| Decodificación | 153 | 4316 | 152 | 4316 | 0008 | Operación 4 = restar; dirección 316 |
| Ejecución | 153 | 4316 | 316 | 4316 | 0008 | RD ← 316 |
| Ejecución | 153 | 4316 | 316 | 0003 | 0008 | Lectura de 316: RM ← 0003 |
| Ejecución | 153 | 4316 | 316 | 0003 | 0005 | UAL: AC ← 8 − 3 = 5 |
| Búsqueda | 153 | 4316 | 153 | 0003 | 0005 | RD ← CP (153); la dirección sale por el bus de direcciones |
| Búsqueda | 153 | 4316 | 153 | 5315 | 0005 | Lectura de 153: RM ← 5315 |
| Búsqueda | 154 | 5315 | 153 | 5315 | 0005 | RI ← RM (5315); CP ← 154 |
| Decodificación | 154 | 5315 | 153 | 5315 | 0005 | Operación 5 = multiplicar; dirección 315 |
| Ejecución | 154 | 5315 | 315 | 5315 | 0005 | RD ← 315 |
| Ejecución | 154 | 5315 | 315 | 0002 | 0005 | Lectura de 315: RM ← 0002 |
| Ejecución | 154 | 5315 | 315 | 0002 | 0010 | UAL: AC ← 5 × 2 = 10 |
| Búsqueda | 154 | 5315 | 154 | 0002 | 0010 | RD ← CP (154); la dirección sale por el bus de direcciones |
| Búsqueda | 154 | 5315 | 154 | 2314 | 0010 | Lectura de 154: RM ← 2314 |
| Búsqueda | 155 | 2314 | 154 | 2314 | 0010 | RI ← RM (2314); CP ← 155 |
| Decodificación | 155 | 2314 | 154 | 2314 | 0010 | Operación 2 = almacenar; dirección 314 |
| Ejecución | 155 | 2314 | 314 | 2314 | 0010 | RD ← 314 |
| Ejecución | 155 | 2314 | 314 | 0010 | 0010 | RM ← AC (0010) |
| Ejecución | 155 | 2314 | 314 | 0010 | 0010 | Escritura: M[314] ← 0010 |
| Búsqueda | 155 | 2314 | 155 | 0010 | 0010 | RD ← CP (155); la dirección sale por el bus de direcciones |
| Búsqueda | 155 | 2314 | 155 | 0000 | 0010 | Lectura de 155: RM ← 0000 |
| Búsqueda | 156 | 0000 | 155 | 0000 | 0010 | RI ← RM (0000); CP ← 156 |
| Fin | 156 | 0000 | 155 | 0000 | 0010 | 0000: fin del programa |

## Ejemplo de los apuntes

Memoria inicial: 250: 1408, 251: 2409, 252: 3409, 408: 0009, 409: 0005

**Resultado:** AC = 4; se guarda en 409 (pasa de 0005 a 0004).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 250 | — | 250 | — | 0000 | RD ← CP (250); la dirección sale por el bus de direcciones |
| Búsqueda | 250 | — | 250 | 1408 | 0000 | Lectura de 250: RM ← 1408 |
| Búsqueda | 251 | 1408 | 250 | 1408 | 0000 | RI ← RM (1408); CP ← 251 |
| Decodificación | 251 | 1408 | 250 | 1408 | 0000 | Operación 1 = cargar; dirección 408 |
| Ejecución | 251 | 1408 | 408 | 1408 | 0000 | RD ← 408 |
| Ejecución | 251 | 1408 | 408 | 0009 | 0000 | Lectura de 408: RM ← 0009 |
| Ejecución | 251 | 1408 | 408 | 0009 | 0009 | AC ← RM = 0009 |
| Búsqueda | 251 | 1408 | 251 | 0009 | 0009 | RD ← CP (251); la dirección sale por el bus de direcciones |
| Búsqueda | 251 | 1408 | 251 | 2409 | 0009 | Lectura de 251: RM ← 2409 |
| Búsqueda | 252 | 2409 | 251 | 2409 | 0009 | RI ← RM (2409); CP ← 252 |
| Decodificación | 252 | 2409 | 251 | 2409 | 0009 | Operación 2 = restar; dirección 409 |
| Ejecución | 252 | 2409 | 409 | 2409 | 0009 | RD ← 409 |
| Ejecución | 252 | 2409 | 409 | 0005 | 0009 | Lectura de 409: RM ← 0005 |
| Ejecución | 252 | 2409 | 409 | 0005 | 0004 | UAL: AC ← 9 − 5 = 4 |
| Búsqueda | 252 | 2409 | 252 | 0005 | 0004 | RD ← CP (252); la dirección sale por el bus de direcciones |
| Búsqueda | 252 | 2409 | 252 | 3409 | 0004 | Lectura de 252: RM ← 3409 |
| Búsqueda | 253 | 3409 | 252 | 3409 | 0004 | RI ← RM (3409); CP ← 253 |
| Decodificación | 253 | 3409 | 252 | 3409 | 0004 | Operación 3 = almacenar; dirección 409 |
| Ejecución | 253 | 3409 | 409 | 3409 | 0004 | RD ← 409 |
| Ejecución | 253 | 3409 | 409 | 0004 | 0004 | RM ← AC (0004) |
| Ejecución | 253 | 3409 | 409 | 0004 | 0004 | Escritura: M[409] ← 0004 |
| Búsqueda | 253 | 3409 | 253 | 0004 | 0004 | RD ← CP (253); la dirección sale por el bus de direcciones |
| Búsqueda | 253 | 3409 | 253 | 0000 | 0004 | Lectura de 253: RM ← 0000 |
| Búsqueda | 254 | 0000 | 253 | 0000 | 0004 | RI ← RM (0000); CP ← 254 |
| Fin | 254 | 0000 | 253 | 0000 | 0004 | 0000: fin del programa |

## Reto R1 · (A + B) × C

Memoria inicial: 100: 1200, 101: 3201, 102: 5202, 103: 2203, 200: 0004, 201: 0006, 202: 0003

**Resultado:** AC = 30; se guarda en 203 (pasa de 0000 a 0030).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 100 | — | 100 | — | 0000 | RD ← CP (100); la dirección sale por el bus de direcciones |
| Búsqueda | 100 | — | 100 | 1200 | 0000 | Lectura de 100: RM ← 1200 |
| Búsqueda | 101 | 1200 | 100 | 1200 | 0000 | RI ← RM (1200); CP ← 101 |
| Decodificación | 101 | 1200 | 100 | 1200 | 0000 | Operación 1 = cargar; dirección 200 |
| Ejecución | 101 | 1200 | 200 | 1200 | 0000 | RD ← 200 |
| Ejecución | 101 | 1200 | 200 | 0004 | 0000 | Lectura de 200: RM ← 0004 |
| Ejecución | 101 | 1200 | 200 | 0004 | 0004 | AC ← RM = 0004 |
| Búsqueda | 101 | 1200 | 101 | 0004 | 0004 | RD ← CP (101); la dirección sale por el bus de direcciones |
| Búsqueda | 101 | 1200 | 101 | 3201 | 0004 | Lectura de 101: RM ← 3201 |
| Búsqueda | 102 | 3201 | 101 | 3201 | 0004 | RI ← RM (3201); CP ← 102 |
| Decodificación | 102 | 3201 | 101 | 3201 | 0004 | Operación 3 = sumar; dirección 201 |
| Ejecución | 102 | 3201 | 201 | 3201 | 0004 | RD ← 201 |
| Ejecución | 102 | 3201 | 201 | 0006 | 0004 | Lectura de 201: RM ← 0006 |
| Ejecución | 102 | 3201 | 201 | 0006 | 0010 | UAL: AC ← 4 + 6 = 10 |
| Búsqueda | 102 | 3201 | 102 | 0006 | 0010 | RD ← CP (102); la dirección sale por el bus de direcciones |
| Búsqueda | 102 | 3201 | 102 | 5202 | 0010 | Lectura de 102: RM ← 5202 |
| Búsqueda | 103 | 5202 | 102 | 5202 | 0010 | RI ← RM (5202); CP ← 103 |
| Decodificación | 103 | 5202 | 102 | 5202 | 0010 | Operación 5 = multiplicar; dirección 202 |
| Ejecución | 103 | 5202 | 202 | 5202 | 0010 | RD ← 202 |
| Ejecución | 103 | 5202 | 202 | 0003 | 0010 | Lectura de 202: RM ← 0003 |
| Ejecución | 103 | 5202 | 202 | 0003 | 0030 | UAL: AC ← 10 × 3 = 30 |
| Búsqueda | 103 | 5202 | 103 | 0003 | 0030 | RD ← CP (103); la dirección sale por el bus de direcciones |
| Búsqueda | 103 | 5202 | 103 | 2203 | 0030 | Lectura de 103: RM ← 2203 |
| Búsqueda | 104 | 2203 | 103 | 2203 | 0030 | RI ← RM (2203); CP ← 104 |
| Decodificación | 104 | 2203 | 103 | 2203 | 0030 | Operación 2 = almacenar; dirección 203 |
| Ejecución | 104 | 2203 | 203 | 2203 | 0030 | RD ← 203 |
| Ejecución | 104 | 2203 | 203 | 0030 | 0030 | RM ← AC (0030) |
| Ejecución | 104 | 2203 | 203 | 0030 | 0030 | Escritura: M[203] ← 0030 |
| Búsqueda | 104 | 2203 | 104 | 0030 | 0030 | RD ← CP (104); la dirección sale por el bus de direcciones |
| Búsqueda | 104 | 2203 | 104 | 0000 | 0030 | Lectura de 104: RM ← 0000 |
| Búsqueda | 105 | 0000 | 104 | 0000 | 0030 | RI ← RM (0000); CP ← 105 |
| Fin | 105 | 0000 | 104 | 0000 | 0030 | 0000: fin del programa |

## Reto R2 · horas a minutos

Memoria inicial: 100: 1200, 101: 5201, 102: 2202, 200: 0003, 201: 0060

**Resultado:** AC = 180; se guarda en 202 (pasa de 0000 a 0180).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 100 | — | 100 | — | 0000 | RD ← CP (100); la dirección sale por el bus de direcciones |
| Búsqueda | 100 | — | 100 | 1200 | 0000 | Lectura de 100: RM ← 1200 |
| Búsqueda | 101 | 1200 | 100 | 1200 | 0000 | RI ← RM (1200); CP ← 101 |
| Decodificación | 101 | 1200 | 100 | 1200 | 0000 | Operación 1 = cargar; dirección 200 |
| Ejecución | 101 | 1200 | 200 | 1200 | 0000 | RD ← 200 |
| Ejecución | 101 | 1200 | 200 | 0003 | 0000 | Lectura de 200: RM ← 0003 |
| Ejecución | 101 | 1200 | 200 | 0003 | 0003 | AC ← RM = 0003 |
| Búsqueda | 101 | 1200 | 101 | 0003 | 0003 | RD ← CP (101); la dirección sale por el bus de direcciones |
| Búsqueda | 101 | 1200 | 101 | 5201 | 0003 | Lectura de 101: RM ← 5201 |
| Búsqueda | 102 | 5201 | 101 | 5201 | 0003 | RI ← RM (5201); CP ← 102 |
| Decodificación | 102 | 5201 | 101 | 5201 | 0003 | Operación 5 = multiplicar; dirección 201 |
| Ejecución | 102 | 5201 | 201 | 5201 | 0003 | RD ← 201 |
| Ejecución | 102 | 5201 | 201 | 0060 | 0003 | Lectura de 201: RM ← 0060 |
| Ejecución | 102 | 5201 | 201 | 0060 | 0180 | UAL: AC ← 3 × 60 = 180 |
| Búsqueda | 102 | 5201 | 102 | 0060 | 0180 | RD ← CP (102); la dirección sale por el bus de direcciones |
| Búsqueda | 102 | 5201 | 102 | 2202 | 0180 | Lectura de 102: RM ← 2202 |
| Búsqueda | 103 | 2202 | 102 | 2202 | 0180 | RI ← RM (2202); CP ← 103 |
| Decodificación | 103 | 2202 | 102 | 2202 | 0180 | Operación 2 = almacenar; dirección 202 |
| Ejecución | 103 | 2202 | 202 | 2202 | 0180 | RD ← 202 |
| Ejecución | 103 | 2202 | 202 | 0180 | 0180 | RM ← AC (0180) |
| Ejecución | 103 | 2202 | 202 | 0180 | 0180 | Escritura: M[202] ← 0180 |
| Búsqueda | 103 | 2202 | 103 | 0180 | 0180 | RD ← CP (103); la dirección sale por el bus de direcciones |
| Búsqueda | 103 | 2202 | 103 | 0000 | 0180 | Lectura de 103: RM ← 0000 |
| Búsqueda | 104 | 0000 | 103 | 0000 | 0180 | RI ← RM (0000); CP ← 104 |
| Fin | 104 | 0000 | 103 | 0000 | 0180 | 0000: fin del programa |

## Reto R3 · media de tres notas

Memoria inicial: 100: 1200, 101: 3201, 102: 3202, 103: 6203, 104: 2204, 200: 0007, 201: 0005, 202: 0009, 203: 0003

**Resultado:** AC = 7; se guarda en 204 (pasa de 0000 a 0007).

| Fase | CP | RI | RD | RM | AC | Qué sucede |
|---|---|---|---|---|---|---|
| Búsqueda | 100 | — | 100 | — | 0000 | RD ← CP (100); la dirección sale por el bus de direcciones |
| Búsqueda | 100 | — | 100 | 1200 | 0000 | Lectura de 100: RM ← 1200 |
| Búsqueda | 101 | 1200 | 100 | 1200 | 0000 | RI ← RM (1200); CP ← 101 |
| Decodificación | 101 | 1200 | 100 | 1200 | 0000 | Operación 1 = cargar; dirección 200 |
| Ejecución | 101 | 1200 | 200 | 1200 | 0000 | RD ← 200 |
| Ejecución | 101 | 1200 | 200 | 0007 | 0000 | Lectura de 200: RM ← 0007 |
| Ejecución | 101 | 1200 | 200 | 0007 | 0007 | AC ← RM = 0007 |
| Búsqueda | 101 | 1200 | 101 | 0007 | 0007 | RD ← CP (101); la dirección sale por el bus de direcciones |
| Búsqueda | 101 | 1200 | 101 | 3201 | 0007 | Lectura de 101: RM ← 3201 |
| Búsqueda | 102 | 3201 | 101 | 3201 | 0007 | RI ← RM (3201); CP ← 102 |
| Decodificación | 102 | 3201 | 101 | 3201 | 0007 | Operación 3 = sumar; dirección 201 |
| Ejecución | 102 | 3201 | 201 | 3201 | 0007 | RD ← 201 |
| Ejecución | 102 | 3201 | 201 | 0005 | 0007 | Lectura de 201: RM ← 0005 |
| Ejecución | 102 | 3201 | 201 | 0005 | 0012 | UAL: AC ← 7 + 5 = 12 |
| Búsqueda | 102 | 3201 | 102 | 0005 | 0012 | RD ← CP (102); la dirección sale por el bus de direcciones |
| Búsqueda | 102 | 3201 | 102 | 3202 | 0012 | Lectura de 102: RM ← 3202 |
| Búsqueda | 103 | 3202 | 102 | 3202 | 0012 | RI ← RM (3202); CP ← 103 |
| Decodificación | 103 | 3202 | 102 | 3202 | 0012 | Operación 3 = sumar; dirección 202 |
| Ejecución | 103 | 3202 | 202 | 3202 | 0012 | RD ← 202 |
| Ejecución | 103 | 3202 | 202 | 0009 | 0012 | Lectura de 202: RM ← 0009 |
| Ejecución | 103 | 3202 | 202 | 0009 | 0021 | UAL: AC ← 12 + 9 = 21 |
| Búsqueda | 103 | 3202 | 103 | 0009 | 0021 | RD ← CP (103); la dirección sale por el bus de direcciones |
| Búsqueda | 103 | 3202 | 103 | 6203 | 0021 | Lectura de 103: RM ← 6203 |
| Búsqueda | 104 | 6203 | 103 | 6203 | 0021 | RI ← RM (6203); CP ← 104 |
| Decodificación | 104 | 6203 | 103 | 6203 | 0021 | Operación 6 = dividir; dirección 203 |
| Ejecución | 104 | 6203 | 203 | 6203 | 0021 | RD ← 203 |
| Ejecución | 104 | 6203 | 203 | 0003 | 0021 | Lectura de 203: RM ← 0003 |
| Ejecución | 104 | 6203 | 203 | 0003 | 0007 | UAL: AC ← 21 ÷ 3 = 7 |
| Búsqueda | 104 | 6203 | 104 | 0003 | 0007 | RD ← CP (104); la dirección sale por el bus de direcciones |
| Búsqueda | 104 | 6203 | 104 | 2204 | 0007 | Lectura de 104: RM ← 2204 |
| Búsqueda | 105 | 2204 | 104 | 2204 | 0007 | RI ← RM (2204); CP ← 105 |
| Decodificación | 105 | 2204 | 104 | 2204 | 0007 | Operación 2 = almacenar; dirección 204 |
| Ejecución | 105 | 2204 | 204 | 2204 | 0007 | RD ← 204 |
| Ejecución | 105 | 2204 | 204 | 0007 | 0007 | RM ← AC (0007) |
| Ejecución | 105 | 2204 | 204 | 0007 | 0007 | Escritura: M[204] ← 0007 |
| Búsqueda | 105 | 2204 | 105 | 0007 | 0007 | RD ← CP (105); la dirección sale por el bus de direcciones |
| Búsqueda | 105 | 2204 | 105 | 0000 | 0007 | Lectura de 105: RM ← 0000 |
| Búsqueda | 106 | 0000 | 105 | 0000 | 0007 | RI ← RM (0000); CP ← 106 |
| Fin | 106 | 0000 | 105 | 0000 | 0007 | 0000: fin del programa |
