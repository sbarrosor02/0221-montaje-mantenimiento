# Tema 3 · Solucionario de los boletines y del configurador

Generado por `scripts/generar_ut03_solucionario.py`. No se publica en la web.
Los resultados numéricos se calculan en el script y se contrastan con las calculadoras de la web.

## Boletín 1 · Placa base

**1.1** 305 × 244 = ATX · 244 × 244 = micro-ATX · 170 × 170 = Mini-ITX · 305 × 330 = E-ATX.

**1.2** Regla: una caja admite su formato y los más pequeños. a) Sí. b) No. c) Sí. d) No.

**1.3** CPU_FAN: ventilador del disipador del procesador · ATX12V: alimentación EPS de 12 V del procesador · JFP1: panel frontal (botones y LED) · USB3_1: USB 3.x frontal (19 pines) · HD_AUDIO: audio frontal · CLR_CMOS: borrar los ajustes de la UEFI · ADD_GEN2: iluminación ARGB de 5 V (3 pines) · SYS_FAN2: ventilador de la caja.

**1.4** Distribución Intel: PWR_LED + pin 2, PWR_LED – pin 4, PWR_SW pines 6 y 8, HDD_LED + pin 1, HDD_LED – pin 3, RESET pines 5 y 7. Tienen polaridad los LED; los botones no. Un LED al revés no se enciende, pero no se rompe. Siempre hay que contrastarlo con la serigrafía o el manual de la placa concreta.

**1.5** Respuesta abierta: se corrige con el manual que haya usado cada alumno.

## Boletín 2 · Procesador y refrigeración

**2.1** (salida del decodificador de la web)

- **Core i7-14700KF**: Gama: Core i7 (media-alta); Generación: 14.ª generación (las primeras cifras del número: 14); Modelo (SKU): 700: dentro de la misma gama, número más alto = más rendimiento; Sufijo: KF: Desbloqueado y sin gráfica integrada: necesita una tarjeta gráfica dedicada. Zócalo: LGA 1700 (placas con chipset de las series 600 o 700). Según la placa, DDR4 o DDR5.
- **Core Ultra 9 285K**: Gama: Core Ultra 9 (alta); Serie: Serie 2 (la primera cifra del número). Con el nombre «Core Ultra», Intel cambió la numeración en 2023; Modelo (SKU): 85: más alto = más rendimiento dentro de la gama; Sufijo: K: Multiplicador desbloqueado: permite overclocking (con placa Z). Trae gráfica integrada. Zócalo: LGA 1851 (placas con chipset serie 800: Z890, B860, H810). Solo DDR5.
- **Ryzen 5 7600X**: Gama: Ryzen 5 (media); Serie: 7000 (primera cifra). Cada serie suele traer arquitectura nueva: 5000 = Zen 3, 7000 = Zen 4, 9000 = Zen 5. La serie 8000 de sobremesa es Zen 4, casi toda con gráfica integrada potente (G); Segmento: 6 (segunda cifra): 1–3 básico, 4–6 medio, 7–9 alto; Sufijo: X: Más frecuencia y consumo que la versión sin X. Zócalo: AM5 (LGA 1718, contactos en la placa). Solo DDR5. Chipsets A620, B650, X670, B850, X870…
- **Ryzen 7 5700X3D**: Gama: Ryzen 7 (media-alta); Serie: 5000 (primera cifra). Cada serie suele traer arquitectura nueva: 5000 = Zen 3, 7000 = Zen 4, 9000 = Zen 5. La serie 8000 de sobremesa es Zen 4, casi toda con gráfica integrada potente (G); Segmento: 7 (segunda cifra): 1–3 básico, 4–6 medio, 7–9 alto; Sufijo: X3D: Lleva caché 3D V-Cache (mucha más caché L3 apilada). Destaca en juegos. Zócalo: AM4 (PGA, pines en el procesador). DDR4. Chipsets A320 a X570.
- **Core i5-13420H**: Gama: Core i5 (media); Generación: 13.ª generación (las primeras cifras del número: 13); Modelo (SKU): 420: dentro de la misma gama, número más alto = más rendimiento; Sufijo: H: Portátil de alto rendimiento. Va soldado a la placa (BGA). Zócalo: BGA: soldado a la placa del portátil, no se puede cambiar.
- **Ryzen 5 8500G**: Gama: Ryzen 5 (media); Serie: 8000 (primera cifra). Cada serie suele traer arquitectura nueva: 5000 = Zen 3, 7000 = Zen 4, 9000 = Zen 5. La serie 8000 de sobremesa es Zen 4, casi toda con gráfica integrada potente (G); Segmento: 5 (segunda cifra): 1–3 básico, 4–6 medio, 7–9 alto; Sufijo: G: APU: gráfica integrada potente. Puede funcionar sin tarjeta gráfica dedicada. Zócalo: AM5 (LGA 1718, contactos en la placa). Solo DDR5. Chipsets A620, B650, X670, B850, X870…

**2.2** a) El B (8600G), que tiene gráfica integrada; el A es KF, sin gráfica. b) El A: 181 W en turbo frente a 88 W de PPT (65 W × 1,35). c) Zócalo LGA 1700 con chipset Z (Z790 o Z690): solo con Z se puede subir el multiplicador. d) No: son arquitecturas distintas y el trabajo por ciclo (IPC) y el número de núcleos cambian. Hay que mirar pruebas de rendimiento.

**2.3** El zócalo LGA es lo más delicado: sus pines están al aire en la placa y se doblan con facilidad. La tapa se deja puesta hasta colocar el procesador, se guarda (la exige la garantía) y se vuelve a poner si se quita el procesador. En un portátil el procesador es BGA: va soldado a la placa.

**2.4** 65 W → 87,75 W ≈ 88 W · 105 W → 141,75 W ≈ 142 W · 120 W → 162 W ≈ 162 W · 170 W → 229,5 W ≈ 230 W.

**2.5** a) No: 95 W < 125 W. b) Cabe (155 ≤ 165 mm) y aguanta la base, pero en turbo (253 W > 180 W) bajará la frecuencia. c) No cabe: 168 > 165 mm. d) No cabe: radiador de 360 mm en una caja que admite 280 mm. Elegiría la torre (b) sabiendo que el procesador limitará su turbo. Al cliente le propondría una AIO de 280 mm (si existe para esa potencia) o cambiar de caja.

**2.6** En modo PWM el conector da 12 V constantes y el ventilador de 3 pines no entiende la señal PWM: gira siempre al máximo. Hay que poner ese conector en modo DC (control por tensión) en la UEFI.

**2.7** a) Delanteros: entrada; trasero y superiores: salida. b) Entran 180 CFM y salen 180 CFM: presión equilibrada (neutra). Para presión positiva, bajar la velocidad de un ventilador de salida o quitarlo. c) 180 CFM × 1,7 ≈ 306 m³/h.

**2.8** Material: pulsera antiestática, alcohol isopropílico (90 % o más), paño sin pelusa o filtros de café, pasta nueva, destornillador. Pasos: apagar y desenchufar; quitar el disipador aflojando los tornillos en cruz (si está pegado, girarlo un poco antes de tirar; mejor con el equipo templado); limpiar procesador y base sin dejar restos; poner una gota del tamaño de un guisante en el centro; montar el disipador apretando en cruz y de forma progresiva; conectar CPU_FAN; comprobar temperaturas en la UEFI o con HWMonitor/HWiNFO.

## Boletín 3 · Memoria y expansión

**3.1** Latencia = CL × 2000 ÷ MT/s. De menor a mayor: DDR4-3200 CL16 (10 ns) < DDR5-6400 CL32 (10 ns) < DDR5-6000 CL36 (12 ns) < DDR4-2666 CL19 (14,25 ns) < DDR5-5200 CL40 (15,38 ns).

**3.2** a) 5600 × 8 B × 2 = 89,6 GB/s. b) 44,8 GB/s. c) 51,2 GB/s.

**3.3** DDR: 2400 MHz × 2 = 4800 MT/s, la velocidad estándar JEDEC. No está estropeado: falta activar el perfil XMP (Intel) o EXPO (AMD) en la UEFI para que vaya a 6000 MT/s.

**3.4** Un módulo: A2. Dos: A2 y B2 (un canal cada uno). Cuatro: todas. Para 32 GB, mejor 2 × 16 GB (doble canal). Para 64 GB en DDR5, mejor 2 × 32 GB: con cuatro módulos la placa suele bajar la velocidad. Siempre según el manual.

**3.5** a) SSD PCIe 4.0 x4: enlace PCIe 4.0 x4 = 7,88 GB/s · b) SSD PCIe 5.0 x4: enlace PCIe 5.0 x4 = 15,75 GB/s · c) gráfica 4.0 x8 en ranura 3.0 x16: enlace PCIe 3.0 x8 = 7,88 GB/s · d) gráfica 5.0 x16 en ranura 4.0 x4: enlace PCIe 4.0 x4 = 7,88 GB/s. La d) funciona, pero con una cuarta parte de carriles y media velocidad por carril: es mala ranura para la gráfica.

**3.6** NVMe 1 en M2_1. El segundo NVMe en M2_2 desactiva SATA6G_5 y 6: los dos discos duros van en SATA6G_1 a 4. La capturadora PCIe x4 va en PCIEX16_2 y M2_3 se deja libre (si se ocupa, la ranura queda en x2).

**3.7** a) Llave M, ranura M.2 PCIe. b) Llave E (A+E), ranura M.2 para Wi-Fi, con sus antenas. c) Llave B+M; solo funciona en una ranura que admita SATA. El 22110 no cabe: mide 110 mm y la ranura llega a 80 mm.

## Boletín 4 · UEFI, gráfica, monitor y chasis

**4.1** Firmware: memoria flash (no se pierde). Ajustes: CMOS/NVRAM. Hora: RTC alimentado por la pila. Si se agota la pila, se desajusta la hora y en muchas placas se pierden los ajustes. Clear CMOS devuelve los ajustes de fábrica; el firmware no cambia.

**4.2** a) La UEFI no reconoce el procesador nuevo: actualizarla (con el antiguo o con BIOS Flashback). b) XMP inestable: Clear CMOS y probar sin XMP o con menos velocidad. c) El 5600 no tiene gráfica integrada: hace falta una tarjeta gráfica. d) No encuentra sistema operativo: reconectar el SSD o revisar el orden de arranque.

**4.3** a) No: con MBR solo se aprovechan 2 TB, y además Windows 11 necesita GPT y UEFI. b) TPM (PTT/fTPM) activado, CSM desactivado (arranque UEFI) y Secure Boot activado. c) Secure Boot comprueba la firma de los gestores de arranque UEFI; el arranque Legacy del CSM no tiene ese mecanismo.

**4.4** Ranura 75 W, 6 pines 75 W, 8 pines 150 W. a) 250 W, 2 × 8 pines: dispone de 375 W → sí · b) 140 W, 1 × 6 pines: dispone de 150 W → sí · c) 75 W, sin conector: dispone de 75 W → sí · d) 320 W, 1 × 8 pines: dispone de 225 W → no. La d) necesitaría dos conectores de 8 pines (375 W) o uno 12V-2×6.

**4.5** a) 128 bits, 18 Gbit/s: 128 ÷ 8 × 18 = 288 GB/s · b) 192 bits, 21 Gbit/s: 192 ÷ 8 × 21 = 504 GB/s · c) 256 bits, 30 Gbit/s: 256 ÷ 8 × 30 = 960 GB/s.

**4.6** ppp = √(ancho² + alto²) ÷ pulgadas. a) 24″ Full HD: 91,8 ppp · b) 27″ QHD: 108,8 ppp · c) 27″ 4K: 163,2 ppp · d) 32″ 4K: 137,7 ppp. El más nítido es el 27″ 4K.

**4.7** a) 4K 144 Hz 10 bits: 38,3 Gbit/s → sirven HDMI 2.1, HDMI 2.2, DisplayPort 2.1 (UHBR13.5), DisplayPort 2.1 (UHBR20) · b) QHD 240 Hz 8 bits: 22,7 Gbit/s → sirven HDMI 2.1, HDMI 2.2, DisplayPort 1.4, DisplayPort 2.1 (UHBR13.5), DisplayPort 2.1 (UHBR20) · c) Full HD 360 Hz 8 bits: 19,2 Gbit/s → sirven HDMI 2.1, HDMI 2.2, DisplayPort 1.4, DisplayPort 2.1 (UHBR13.5), DisplayPort 2.1 (UHBR20).

**4.8** Caja 1: la gráfica cabe (320 ≤ 330 mm), pero el disipador no (158 > 155 mm). Caja 2: gráfica y disipador caben, pero solo tiene una bahía de 3,5″ para dos discos. Ninguna sirve del todo. La caja 2 es mejor base (malla con filtro, USB-C): se resuelve cambiando un disco de 3,5″ por un SSD de 2,5″ o M.2. Para su USB-C frontal la placa necesita el conector USB-C interno.

**4.9** Placa: manual, cables SATA, tornillos y separadores M.2, antenas Wi-Fi, adaptador de panel frontal, embellecedor trasero, pegatinas; controladores en USB/DVD o en la web. Gráfica: guía rápida, adaptador de alimentación, soporte antipandeo. Disipador: anclajes y placa trasera para cada zócalo, pasta térmica, clips del ventilador, llave o destornillador. Orden de controladores: chipset, red (para tener internet), gráfica, sonido, Wi-Fi/Bluetooth y utilidades.

**4.10** 2U = 2 × 44,45 = 88,9 mm. 42U = 1866,9 mm ≈ 1,87 m.

## Retos del configurador (C1)

Problemas que detecta el configurador de la web en cada caso:

- **Caso A** (consumo máximo estimado 383 W):
  - ✗ Zócalo incompatible. El AMD Ryzen 5 7600 usa AM5 y la placa es AM4. No encaja físicamente.
  - ✗ Tipo de memoria incompatible. La placa solo admite DDR4 y los módulos son DDR5. La muesca está en otro sitio: no entran.
- **Caso B** (consumo máximo estimado 223 W):
  - ! Revisa la versión de la UEFI. El procesador es posterior a la placa (2024 frente a 2023). Comprueba en la lista de procesadores compatibles qué versión de UEFI necesita: puede que haya que actualizarla antes de montarlo.
  - ! Velocidad por encima de la oficial. El procesador admite oficialmente DDR5-4800. Para llegar a 6000 MT/s hay que activar el perfil XMP en la UEFI. Suele funcionar, pero no está garantizado.
  - ✗ Sin salida de imagen. El Intel Core i5-14400F no tiene gráfica integrada y no hay tarjeta gráfica. El equipo no dará imagen.
- **Caso C** (consumo máximo estimado 597 W):
  - ! Revisa la versión de la UEFI. El procesador es posterior a la placa (2024 frente a 2022). Comprueba en la lista de procesadores compatibles qué versión de UEFI necesita: puede que haya que actualizarla antes de montarlo.
  - ✗ Faltan ranuras de memoria. Son 4 módulos y la placa solo tiene 2 ranuras.
  - ! Cuatro módulos DDR5. Con cuatro módulos DDR5 la placa suele bajar la velocidad. Para 64 GB es mejor 2 × 32 GB.
  - ! Velocidad por encima de la oficial. El procesador admite oficialmente DDR5-5600. Para llegar a 6000 MT/s hay que activar el perfil EXPO en la UEFI. Suele funcionar, pero no está garantizado.
  - ✗ El disipador no cabe. Mide 155 mm y la caja admite disipadores de hasta 70 mm.
  - ✗ La gráfica no cabe. Mide 336 mm y la caja admite hasta 310 mm.
  - ✗ La fuente no cabe. La caja solo admite fuentes SFX, más pequeñas que las ATX.
- **Caso D** (consumo máximo estimado 628 W):
  - ! Revisa la versión de la UEFI. El procesador es posterior a la placa (2023 frente a 2022). Comprueba en la lista de procesadores compatibles qué versión de UEFI necesita: puede que haya que actualizarla antes de montarlo.
  - ! Overclock no disponible. El procesador está desbloqueado (K), pero con un chipset H610 no se puede subir su multiplicador. Hace falta una placa Z.
  - ! VRM justo para este procesador. Las placas básicas tienen un VRM sencillo. Con 253 W en turbo se calentará y puede bajar la frecuencia.
  - ! Velocidad por encima de la oficial. El procesador admite oficialmente DDR4-3200. Para llegar a 3600 MT/s hay que activar el perfil XMP en la UEFI. Suele funcionar, pero no está garantizado.
  - ✗ El disipador no tiene anclajes para LGA 1700. Solo trae anclajes para LGA 1200, AM4, AM5. LGA 1700 y LGA 1851 tienen otra separación de tornillos que LGA 1200.
  - ! Refrigeración justa en turbo. En turbo el procesador llega a 253 W y el disipador admite 150 W. Funcionará, pero con carga alta bajará la frecuencia (thermal throttling).
  - ! Fuente justa. Consumo máximo estimado: 628 W. Conviene un margen del 25 % o más (unos 800 W).
- **Caso E** (consumo máximo estimado 233 W):
  - ! Revisa la versión de la UEFI. El procesador es posterior a la placa (2024 frente a 2022). Comprueba en la lista de procesadores compatibles qué versión de UEFI necesita: puede que haya que actualizarla antes de montarlo.
  - ! Velocidad por encima de la oficial. El procesador admite oficialmente DDR5-5200. Para llegar a 6000 MT/s hay que activar el perfil EXPO en la UEFI. Suele funcionar, pero no está garantizado.

Soluciones mínimas: A) cambiar la placa por una AM5 con DDR5 (B650M). B) añadir una tarjeta gráfica o usar un procesador con gráfica integrada. C) dos módulos, disipador de perfil bajo o AIO de 240 mm, gráfica de 310 mm o menos y fuente SFX. D) anclajes para LGA 1700 (o disipador nuevo), placa Z si se quiere overclock y fuente de 850 W. E) es correcto.
