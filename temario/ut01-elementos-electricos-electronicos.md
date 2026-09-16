---
modulo: "0221"
ut: 1
titulo: "Elementos básicos eléctricos y electrónicos"
ra: []
ce: []
horas: 14
evaluacion: 1
---

# Tema 1 · Elementos básicos eléctricos y electrónicos

> **RA y CE pendientes de confirmar.** Este tema procede de los apuntes del
> curso 2023/24 (que lo situaban como Tema 1). Su contenido —fundamentos de
> electricidad, Ley de Ohm, componentes y aparatos de medida— corresponde a la
> parte de **medida de parámetros eléctricos** del módulo, no al RA1 "selección
> de componentes". Antes de dar el tema por cerrado hay que transcribir
> literalmente del Decreto 272/2009 el RA y los CE que evalúa.

Este tema es la base eléctrica del módulo: sin entender voltaje, corriente,
resistencia y la Ley de Ohm no se comprende el funcionamiento a nivel eléctrico
de un ordenador ni de los componentes que integra. Se apoya sobre él el resto
del curso (fuentes de alimentación, medida con el polímetro, diagnóstico de
averías).

## 1.1 Introducción

Hoy en día vivimos rodeados de aparatos que funcionan con electricidad. Su
funcionamiento se basa en una serie de leyes (Ley de Ohm, Leyes de Kirchhoff)
que relacionan tres magnitudes básicas: resistencia, intensidad y voltaje (o
diferencia de potencial).

Partiendo de estas leyes es posible construir todo tipo de aparatos eléctricos
y electrónicos, así como identificar gran parte de sus características y
limitaciones (amperaje necesario para su funcionamiento, voltaje, consumo
eléctrico, etc.).

Por eso este tema es imprescindible para comprender el funcionamiento eléctrico
de un ordenador. Durante el mismo aprenderemos los fundamentos de electricidad,
sus magnitudes y leyes, y los componentes electrónicos que hacen posible el
funcionamiento de los dispositivos actuales.

## 1.2 Conceptos de electricidad

La electricidad es una forma de energía que se genera por el movimiento de
partículas cargadas, como los electrones, a través de un conductor eléctrico
(por ejemplo, un cable). La materia está formada por átomos y estos, a su vez,
por:

- **Protones**: carga positiva.
- **Electrones**: carga negativa.
- **Neutrones**: sin carga.

La electricidad se engloba dentro de las **energías secundarias** (proviene de
transformar una energía primaria de la naturaleza). Para producirla se emplean
sistemas eléctricos: el conjunto de elementos que operan coordinadamente
(generación, transporte y distribución) para satisfacer la demanda de energía.

### 1.2.1 Diferencia de potencial

La diferencia de potencial, también llamada **voltaje** o tensión eléctrica, es
la cantidad de energía eléctrica por unidad de carga necesaria para transferir
una carga de un punto a otro. Es la "fuerza" que impulsa a los electrones a
moverse por el conductor.

Se mide en **voltios (V)**, en honor a Alessandro Volta. Ejemplos: una pila de
9 V tiene 9 voltios entre sus terminales; la red doméstica ronda 110 V o 220 V
según el país; en informática es común encontrar 5 V, 3,3 V o menos. Se mide con
un **voltímetro**, conectado entre los dos puntos del circuito.

### 1.2.2 Corriente eléctrica

La corriente eléctrica es el flujo de cargas (normalmente electrones) por un
conductor. Con el símil del río: si el voltaje es la "altura" que da energía, la
corriente es el "caudal". Se cuantifica con la **intensidad**, que indica cuánta
carga pasa por un punto en un segundo. Se mide en **amperios (A)**, en honor a
André-Marie Ampère, con un **amperímetro** colocado **en serie**.

Hay dos tipos principales:

- **Corriente continua (CC / DC)**: las cargas fluyen siempre en la misma
  dirección. Baterías y células solares. La mayoría de los equipos electrónicos
  la usan.
- **Corriente alterna (CA / AC)**: la dirección y la intensidad cambian
  periódicamente (forma sinusoidal). Es la que llega a las casas. Casi todos los
  aparatos electrónicos necesitan un transformador de alterna a continua.

### 1.2.3 Resistencia eléctrica

La resistencia es la oposición de un material al paso de la corriente. Se mide
en **ohmios (Ω)** con un **óhmetro**. Según su resistencia, los materiales se
clasifican en:

- **Conductores**: baja resistencia (cobre, aluminio, oro). Cables y pistas.
- **Aislantes**: alta resistencia (caucho, vidrio, plásticos). Recubren cables
  y separan componentes para evitar cortocircuitos.
- **Semiconductores**: resistencia intermedia y manipulable (temperatura, luz,
  impurezas). El silicio es el más usado: transistores y microchips.

Existen además los **superconductores**, que conducen sin resistencia a
temperaturas muy bajas.

Dos propiedades intrínsecas del material (no dependen de la geometría):

- **Resistividad (ρ)**: cuánto se opone el material al paso de corriente
  (Ω·m). Alta en aislantes, baja en conductores.
- **Conductividad (σ)**: inversa de la resistividad (S/m). Alta en conductores.
  Relación: σ = 1 / ρ.

Resistividad de metales comunes (Ω·m): plata 1,59×10⁻⁸ (mejor conductor), cobre
1,68×10⁻⁸, aluminio 2,82×10⁻⁸, hierro 9,71×10⁻⁸.

### 1.2.4 Definición de circuito eléctrico

Un circuito eléctrico es un sistema cerrado por el que fluye la corriente. Lo
componen fuentes de alimentación (generan la diferencia de potencial),
conductores (permiten el flujo) y componentes (resistencias, condensadores,
bobinas…) que modifican la corriente. Relacionando los tres conceptos:

- **V** (voltaje): la "fuerza" que impulsa la corriente (baterías, fuentes).
- **I** (corriente): el flujo de cargas; depende del voltaje y de la resistencia.
- **R** (resistencia): la oposición al flujo.

### 1.2.5 Ley de Ohm

Relaciona las tres magnitudes: **V = I × R**. Despejando: **I = V / R** y
**R = V / I**. Permite conocer una magnitud si se conocen las otras dos. Según
cómo se distribuyan los componentes, se distinguen tres tipos de circuito.

#### 1.2.5.1 Circuitos en serie

Todos los componentes en una única trayectoria; la corriente es la misma en todo
el circuito.

- **Resistencia total**: R = R₁ + R₂ + … + Rₙ
- **Intensidad**: I es la misma en todas partes (I = I₁ = I₂ = … = Iₙ)
- **Voltaje**: se reparte entre los componentes; en cada uno Vᵢ = I × Rᵢ

**Ejercicio 1 (resuelto en la web).** Serie con V = 9 V y R₁ = 1 Ω, R₂ = 2 Ω,
R₃ = 3 Ω. Calcula la resistencia total, la intensidad y el voltaje en cada
resistencia.

#### 1.2.5.2 Circuitos en paralelo

Los componentes ofrecen varias trayectorias; la corriente se reparte entre las
ramas, pero el voltaje es el mismo en todas.

- **Resistencia total**: 1/R = 1/R₁ + 1/R₂ + … + 1/Rₙ
- **Intensidad de cada rama**: Iᵢ = V / Rᵢ
- **Voltaje**: el mismo en todas las ramas (V₁ = V₂ = … = V)

**Ejercicio 2 (resuelto en la web).** Paralelo con V = 9 V y R₁ = 3 Ω,
R₂ = 4 Ω, R₃ = 12 Ω. Calcula la resistencia total, la intensidad de cada rama y
el voltaje en cada resistencia.

#### 1.2.5.3 Circuitos mixtos

Combinan tramos en serie y en paralelo. Pasos para resolverlos:

1. **Identificar subcircuitos** puramente en serie o en paralelo y resolver cada
   uno.
2. **Resistencia equivalente**: calcular la total con las equivalentes de los
   subcircuitos.
3. **Voltaje y corriente**: aplicar la Ley de Ohm en todo el circuito.

**Ejercicio 3 (resuelto en la web).** Mixto con V = 9 V, R₁ = 3 Ω en serie con
el paralelo de R₂ = 4 Ω y R₃ = 12 Ω. Calcula la resistencia del paralelo, la
total, la intensidad total y los voltajes en R₁ y en R₂/R₃.

### 1.2.6 Potencia eléctrica

La potencia es la energía que un dispositivo consume o genera por unidad de
tiempo. Se mide en **vatios (W)**:

- P = V × I
- Con la Ley de Ohm también: P = I² × R  y  P = V² / R

En informática es clave porque determina la eficiencia energética y el calor
generado.

## 1.3 Componentes eléctricos y electrónicos

> En la web se incluye una hoja con los **símbolos** normalizados de estos
> componentes (cable, interruptor, pila, batería, bombilla, amperímetro,
> voltímetro, condensador, resistencia, resistencia variable, diodo, LED,
> inductancia, motor, toma de tierra, fuente de corriente alterna).

### 1.3.1 Pilas y baterías

Almacenan energía química y la convierten en energía eléctrica. Una **pila**
suele ser una única celda; una **batería** es un conjunto de celdas en serie o
paralelo. Ambas tienen dos polos (positivo y negativo) y generan **corriente
continua**. Tipos: alcalinas (mandos, relojes), iones de litio (móviles,
portátiles, vehículos), plomo-ácido (SAI, automóviles).

Parámetros: **capacidad** (Ah), **voltaje nominal** y **corriente de descarga**.

### 1.3.2 Interruptores

Permiten o interrumpen el paso de la corriente. Dos contactos que pueden estar
**abiertos** (no pasa corriente) o **cerrados** (pasa). Tipos: unipolares,
bipolares, multipolares; de palanca, botón pulsador y deslizantes. Usos: control
de dispositivos, selección de modo y seguridad (corte de alimentación).

### 1.3.3 Pulsadores

Son un tipo de interruptor para activar una función (teclas de un teclado,
botones de un mando). Tres tipos: **acción momentánea** (solo mientras se
pulsa), **de enclavamiento** (cambia de estado y de posición) y **alterada**
(cambia de estado pero no de posición).

### 1.3.4 Fuentes de alimentación

Convierten la corriente alterna de la red en una o varias corrientes continuas
para los componentes del equipo (procesador, RAM, discos, periféricos).
Características: tipos de salida (+12 V, +5 V, +3,3 V), potencia (W), eficiencia,
tipo (ATX, microATX…), conectores (SATA, PCIe…), protecciones (sobretensión,
cortocircuito, sobrecarga) y refrigeración. Se estudian a fondo más adelante.

## 1.4 Resistencias

Componente diseñado para introducir una resistencia concreta al paso de la
corriente; disipa energía en forma de calor y regula la corriente. Características:

- **Valor nominal** (Ω), desde mili-ohmios hasta mega-ohmios.
- **Tolerancia**: margen de error (p. ej. 100 Ω ±5 % → entre 95 y 105 Ω).
- **Potencia** (W): energía máxima que puede disipar sin dañarse.
- **Tipo**: película de carbono, película metálica, alambre bobinado.
- **Coeficiente de temperatura**: cómo varía el valor con la temperatura.

En los ordenadores aparecen en fuentes de alimentación, placas base, tarjetas
gráficas y circuitos de interfaz (USB, HDMI, SATA).

> **Código de colores** (en la web, con tabla): las bandas de la resistencia
> codifican su valor. Negro 0, Marrón 1, Rojo 2, Naranja 3, Amarillo 4, Verde 5,
> Azul 6, Violeta 7, Gris 8, Blanco 9; multiplicador según potencia de diez;
> tolerancia Oro ±5 %, Plata ±10 %. Hay resistencias de 4, 5 y 6 bandas.

### 1.4.1 Resistencias SMD (Surface Mount Device)

Se montan directamente sobre la superficie de la placa (PCB), sin agujeros
pasantes. Son compactas y permiten diseños más densos y una producción más
eficiente.

### 1.4.2 Potenciómetros

Resistor **ajustable** de tres terminales con un contacto deslizante o giratorio
que forma un divisor de voltaje variable. Características: tipo de ajuste
(giratorio/deslizante), valor nominal (Ω), tolerancia, potencia (W) y linealidad
(lineal o logarítmico). Usos: volumen, brillo/contraste, velocidad de un
ventilador…

### 1.4.3 Condensadores (capacitores)

Almacenan energía en un campo eléctrico entre dos placas separadas por un
dieléctrico. Características: **capacidad** (faradios, F; en informática de pF a
mF), tipo de dieléctrico (cerámica, tantalio, polímeros), tolerancia, voltaje
máximo y **polaridad** (los electrolíticos son polares; los cerámicos no). Usos:
filtrado de alimentación, gestión de señales, arranque de motores y memoria
(DRAM). También tienen código de colores.

### 1.4.4 Diodos

Semiconductor de dos terminales (ánodo y cátodo) que deja pasar la corriente en
**una sola dirección** (válvula unidireccional). Características: umbral de
conducción (~0,7 V en silicio), corriente directa máxima, voltaje inverso máximo
y tipos (rectificadores, LED, Zener, Schottky…). Usos: rectificación (CA→CC),
regulación de voltaje (Zener), indicadores (LED) y protección contra retroceso.

El **LED** emite luz al aplicarle voltaje; en informática se usa sobre todo como
indicador de estado e iluminación.

### 1.4.5 Transistores

Semiconductor que actúa como **amplificador o interruptor**. Tres regiones:
emisor, base y colector (bipolares, BJT) o fuente, puerta y drenaje (efecto de
campo, FET/MOSFET). Un pequeño cambio en el terminal de control produce un gran
cambio en la corriente entre los otros dos. Usos: microprocesadores (millones de
transistores), regulación de potencia, amplificación y conmutación.

### 1.4.6 Circuitos integrados

Conjunto de componentes (transistores, resistencias, condensadores…)
interconectados y encapsulados en un único chip de silicio, con pines soldados a
la placa. En los equipos: microprocesadores, memorias RAM/ROM, tarjetas gráficas
y controladores. Escalas de integración por nº de transistores: SSI (10–100),
MSI (101–1.000), LSI (1.001–10.000), VLSI (10.001–100.000), ULSI
(100.001–1.000.000), GLSI (>1.000.000).

La **Ley de Moore** observó que el número de transistores de un chip se duplica
aproximadamente cada dos años; no es una ley física sino una tendencia empírica,
sorprendentemente precisa durante décadas y hoy en desaceleración.

## 1.5 Aparatos de medición

- **Voltímetro**: mide el voltaje entre dos puntos. Dos tomas (roja = positivo,
  negra = negativo). Analógico (aguja) o digital.
- **Amperímetro**: mide la intensidad. Se conecta **en serie**. Analógico o
  digital.
- **Óhmetro**: mide la resistencia entre dos puntos aplicando una corriente. Los
  de alta precisión usan cuatro terminales (contactos Kelvin) para descontar la
  resistencia de los cables.
- **Multímetro** (polímetro o tester): mide varias magnitudes (voltaje,
  intensidad, resistencia, capacidad…). Analógico, digital o híbrido.
- **Osciloscopio**: representa gráficamente señales eléctricas en el tiempo. Muy
  versátil.

## Ejercicios del tema

Los ejercicios de análisis de circuitos (Ley de Ohm: serie, paralelo y mixto)
están en `web/temas/ut01-ejercicios.html`: los tres resueltos de estos apuntes
más los dos boletines del curso 2023/24 (9 circuitos de repaso y 5 circuitos
mixtos). Los circuitos se redibujan como esquemas SVG originales.

## Nota de montaje (web)

Al publicar este tema: (1) `web/temas/ut01.html` (teoría, esta página),
(2) `web/temas/ut01-ejercicios.html` (ejercicios), (3) `web/datos/temas.json` y
(4) el `<li>` correspondiente en `web/index.html`. Las **prácticas evaluables**
(carpeta `practicas/`) se redactarán aparte, mejorando los enunciados actuales.
