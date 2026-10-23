# Tema 4 · Solucionario de los boletines

Generado por `scripts/generar_ut04_solucionario.py`. No se publica en la web.
Los datos se leen del enunciado y los resultados se contrastan con los interactivos de la web.

## Boletín 1 · Almacenamiento e interfaces

**1.1** a) NVMe: el sistema y los proyectos de vídeo necesitan la máxima velocidad. b) HDD: el menor coste por TB para un gran volumen que no exige velocidad. c) SSD SATA de 2,5″: es lo único que admite esa bahía, y multiplica la velocidad del equipo. d) NVMe en la ranura M.2 libre: más rápido y sin cables (comprobar en el manual qué admite esa ranura).

**1.2** t = tamaño ÷ velocidad, con 30 GB = 30000 MB. a) 30000 ÷ 180 ≈ **166,7 s** · b) 30000 ÷ 520 ≈ **57,7 s** · c) 30000 ÷ 5000 ≈ **6 s**. El NVMe es unas 28 veces más rápido que el disco duro.

**1.3** 600 TB = 600000 GB. 600000 ÷ 40 = 15000 días ÷ 365 ≈ 41,1 → **41 años**. Para un uso normal el desgaste no es un problema.

**1.4** Los dos tienen el mismo tamaño, pero el M.2 SATA usa la interfaz SATA (unos 550 MB/s, llave B+M) y el NVMe usa PCIe x4 (llave M). No funcionan en cualquier ranura: algunas M.2 solo admiten NVMe y otras solo SATA. Se comprueba en el manual de la placa (especificaciones de cada ranura M.2).

**1.5** Disco de 3,5″: SATA, cable de datos SATA y alimentación SATA. SSD NVMe: PCIe en ranura M.2, sin cables. Blu-ray interna: SATA, datos y alimentación SATA, en bahía de 5,25″. Disco externo de 20 Gbit/s: USB 20 Gbps (3.2 Gen 2×2) con conector USB-C. Memoria de 480 Mbit/s: USB 2.0, conector USB-A.

**1.6** No. Los sectores reasignados (148) y sobre todo los pendientes (12) indican que la superficie se está degradando; además, 31 250 h son unos 3,6 años encendido sin parar. La temperatura es normal. Hay que hacer copia de los datos inmediatamente y sustituir el disco.

## Boletín 2 · Fuente de alimentación y SAI

**2.1** Filtro EMI (impide que el ruido vuelva a la red) → rectificador y PFC (pasa a continua de unos 400 V y toma la corriente de forma eficiente) → conmutación y transformador (trocea a alta frecuencia, reduce la tensión y aísla de la red) → rectificación y filtrado de salida (deja una continua limpia de 12 V, y de ahí 5 y 3,3 V).

**2.2** Amarillo +12 V (procesador, gráfica, ventiladores) · rojo +5 V (USB, lógica, discos de 2,5″) · naranja +3,3 V (chips de la placa, M.2, PCIe) · morado 5VSB (encendido desde reposo, USB con el equipo apagado) · verde PS_ON (encendido) · gris PWR_OK (tensiones estables).

**2.3**

| Línea | Tolerancia | Mínimo | Máximo |
|---|---|---|---|
| +12 V | ± 5 % | 11,4 V | 12,6 V |
| +5 V | ± 5 % | 4,75 V | 5,25 V |
| +3,3 V | ± 5 % | 3,135 V | 3,465 V |
| –12 V | ± 10 % | –13,2 V | –10,8 V |

**2.4**

| Fuente | +12 V | +5 V | +3,3 V | 5VSB | Diagnóstico |
|---|---|---|---|---|---|
| A | 12,11 V ✓ | 5,04 V ✓ | 3,35 V ✓ | 5,02 V ✓ | Correcta: todas las líneas dentro de tolerancia. |
| B | 11,21 V ✗ | 4,98 V ✓ | 3,31 V ✓ | 5,05 V ✓ | Defectuosa: fuera de tolerancia +12 V. No se monta; se sustituye. |
| C | 12,06 V ✓ | 5,27 V ✗ | 3,11 V ✗ | 4,96 V ✓ | Defectuosa: fuera de tolerancia +5 V, +3,3 V. No se monta; se sustituye. |

La fuente B, con +12 V bajo, causaría reinicios al exigir potencia al procesador o a la gráfica. (Veredictos contrastados con la función de tolerancias de la web.)

**2.5** Con la fuente desenchufada y el interruptor en O: conectar una carga (ventilador o disco) y un puente entre el verde (PS_ON) y un negro, o el comprobador. Polímetro en V⎓, rango 20 V, punta negra en un negro y roja en la línea (amarillo en un Molex o SATA). Revisión del profesor, enchufar, encender, medir sin tocar nada más. Apagar y desenchufar antes de retirar el puente.

**2.6** a) 125 + 285 + 70 = **480 W**. b) 480 × 1,3 = 624 W → **650 W**. c) 480 ÷ 0,90 ≈ **533 W** del enchufe; se pierden unos **53 W** en calor (mismo resultado que la calculadora de la web).

**2.7** a) Con red: entrada → filtro y AVR → salida; el cargador mantiene la batería. Sin red: batería → inversor → conmutador → salida. b) 450 W > 390 W: el de 650 VA **no sirve**. El de 1000 VA / 600 W **sí** (trabaja al 75 % de su capacidad). c) Entrada: alterna ≈ 230 V. Salida en batería: alterna ≈ 230 V (senoidal o casi senoidal según el tipo de SAI). Bornes de la batería: continua, 12,6–13,8 V.

## Boletín 3 · Preparar y montar

**3.1** PH2 imantado (tornillos; cuidado de no rayar la placa), precisión PH0/PH1 (tornillo M.2), pulsera antiestática (descarga estática; pinza en metal sin pintar), pasta térmica y alcohol isopropílico (lejos de llamas, ventilación), paños sin pelusa, bridas y alicates de corte (cortar hacia fuera, sin dejar puntas), linterna, bandeja de tornillos, polímetro (medir solo con supervisión, puntas en buen estado).

**3.2** Respuesta abierta: se corrige con el manual de la placa indicada.

**3.3** Placa: correcta, pero la caja abollada se anota en el albarán del transportista y se revisa la placa con detalle antes de aceptarla. Memoria: DDR4 en lugar de DDR5, no es compatible con una B650: devolución. SSD: correcto. Fuente: 550 W Bronze en lugar de 650 W Gold: no es lo pedido, se reclama aunque funcionara. Caja: falta la bolsa de tornillos: se reclama el accesorio. Todo se comunica al proveedor antes de montar.

**3.4** Ejemplos: componentes en bolsa antiestática y caja original; almacén seco, templado y sin sol directo; discos duros sin golpes ni apilados bajo peso; estanterías etiquetadas con registro de entradas y salidas, y lo más antiguo primero; baterías con carga parcial, en lugar fresco y lejos de material inflamable.

**3.5** a) 6-32. b) M3. c) Separadores y tornillos (6-32 o M3 según la caja). d) Tornillo M2 o pestillo. e) 6-32. f) 6-32. Un 6-32 forzado en una rosca M3 la pasa y la estropea (y al revés el tornillo queda flojo).

**3.6** Errores: 1) la fuente nunca se enchufa mientras se monta (riesgo eléctrico y de dañar componentes): se enchufa solo para el primer arranque. 2-3) procesador y disipador se montan fuera de la caja, antes de atornillar la placa (espacio, luz, sin riesgo de doblar pines). 4) A1 y A2 están en el mismo canal: para doble canal van normalmente en A2 y B2, según el manual.

## Boletín 4 · Arranque, diagnóstico e informe

**4.1** 16 GB de 32: un módulo no está bien insertado o la ranura falla: apagar, desenchufar y reinsertarlo; si sigue, probar el módulo en otra ranura. 4800 MHz: es la velocidad por defecto; activar XMP/EXPO para llegar a 6000. El SSD está bien. Fecha: ajustarla; si se pierde al apagar, cambiar la pila.

**4.2** a) MemTest86: 0 errores. b) CrystalDiskMark: cerca de las velocidades de la ficha. c) HWiNFO o HWMonitor durante Cinebench u OCCT: por debajo de unos 85–90 °C. d) CPU-Z (pestaña Memory): «Dual». e) CrystalDiskInfo o smartctl: estado «Bueno», 0 sectores reasignados y pendientes.

**4.3** a) Fallo de memoria: reinsertar los módulos, probar uno solo y en la ranura que indica el manual, comprobar compatibilidad (QVL). b) Memoria defectuosa: probar módulo a módulo para identificar el malo y sustituirlo. c) La temperatura es normal; +12 V a 11,2 V está por debajo de 11,4 V: la fuente no aguanta la carga; sustituirla. d) El disipador no hace contacto: plástico protector sin quitar, sin pasta, mal apretado o el ventilador desconectado. Apagar enseguida y revisar.

**4.4** Datos generales; componentes con número de serie (tabla); recepción e incidencias (tabla y fotos de daños); proceso (fotos de cada fase); UEFI (fotos de las pantallas); medidas (tabla de tensiones); diagnóstico (capturas de MemTest86, SMART, CrystalDiskMark, temperaturas); conclusión.

**4.5** Defectos: faltan datos generales (técnico, fecha, cliente); componentes sin marca, modelo ni número de serie («RAM 16», «disco SSD»); «funciona bien» sin pruebas ni resultados; «tensiones correctas» sin valores medidos. Reescritura de ejemplo: «Equipo montado por X el 12/11/2026 para el aula 2. Placa ASUS PRIME B650M-A (n.º s. …), 2 × 16 GB DDR5-6000 (…), SSD NVMe 1 TB (…). MemTest86: 1 pasada, 0 errores. SMART: bueno. Tensiones con polímetro: +12 V 12,04 V, +5 V 5,02 V, +3,3 V 3,32 V, todas dentro de tolerancia. Apto.»

