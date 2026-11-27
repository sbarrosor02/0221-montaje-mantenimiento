# P9 · Servicio técnico: dos empresas de informática — Guía del profesor y solucionario

Tema 3, segunda parte (3.8 a 3.13). RA1, CE f, g, i, j, k. Página del alumnado:
`web/temas/ut03-practica-empresas.html`. **Este documento no se enlaza desde la web.**

## Organización

- Empresa A (3 personas): técnico/a, asesor/a, calidad. Empresa B (2): técnico/a y
  asesor/a, con revisión cruzada.
- 6 sesiones: 1 fundación · 2-4 jornadas de encargos · 5 avería real · 6 concurso.
- Reparto de encargos propuesto (cada persona firma al menos 2 averías y 1 cliente):

| Jornada | Empresa A (3) | Empresa B (2) |
|---|---|---|
| 2 | AV-01, AV-05, CL-01 | AV-03, CL-06 |
| 3 | AV-03, AV-07, CL-04 | AV-01, CL-02 |
| 4 | AV-04, AV-08, CL-06 | AV-04, CL-05 |
| Reserva / rápidos | AV-02, AV-06, AV-09, AV-10, AV-11, AV-12, CL-03, CL-07, CL-08 | ídem |

  Dar encargos distintos a cada empresa en la misma jornada evita que se copien; repetir
  alguno en jornadas distintas (AV-01, AV-03, AV-04, CL-06) permite comparar informes.
- La nota es individual: cada documento lleva quién lo hace y quién lo revisa. Revisar el
  cuadrante de roles para comprobar que todos han pasado por los tres papeles.

## Averías (AV): diagnóstico esperado

| Nº | Causa | Solución | Pruebas que deberían aparecer | CE |
|---|---|---|---|---|
| AV-01 | El i5-14400F **no tiene gráfica integrada**: el HDMI de la placa no da imagen. | Conectar el monitor a una salida de la RTX 4060. | Mirar el sufijo F; comprobar dónde está conectado el cable; LED VGA de la placa apagado. | i, j |
| AV-02 | El perfil EXPO/XMP a 6400 con módulos fuera de la QVL hace fallar el entrenamiento de memoria (LED DRAM). | **Clear CMOS** (puente o botón, o quitar la pila con el equipo desenchufado). Luego EXPO a una velocidad estable (6000) o actualizar UEFI; comprobar QVL. | Identificar el LED de diagnóstico; esperar el entrenamiento de memoria (puede tardar) antes de tocar nada; manual de la placa. | f |
| AV-03 | CSM activado (arranque Legacy), TPM desactivado y disco MBR: no cumple los requisitos de Windows 11. | Activar **TPM** (Intel PTT), desactivar **CSM** (modo UEFI), activar **Secure Boot**; convertir el disco a **GPT** (MBR2GPT o instalación limpia). | Comprobar en la UEFI; `tpm.msc` y `msinfo32` (modo BIOS, estado de arranque seguro); tipo de partición en Administración de discos. | f |
| AV-04 | Fuente insuficiente y de mala calidad; gráfica de 250 W alimentada con adaptador de Molex: al subir el consumo, la protección apaga el equipo. | Cambiar la fuente por una de calidad (650-750 W, 80 Plus Bronze o mejor) con cables PCIe propios. No usar adaptadores Molex. | Reproducir el fallo con carga (juego o prueba de estrés) frente a uso ligero; revisar temperaturas para descartar calor; mirar la etiqueta de la fuente. Calcular consumo: 75 W ranura + conectores. | j |
| AV-05 | Cable HDMI antiguo (HDMI 1.4 o de baja velocidad) y Windows a 60 Hz. | Usar **DisplayPort 1.4** (o HDMI 2.0 con cable de alta velocidad) conectado a la **gráfica** y poner 165 Hz en Configuración > Pantalla > Pantalla avanzada. | Mirar la frecuencia en Windows; probar otro cable/puerto; manual del monitor (qué entrada da 165 Hz). | i |
| AV-06 | Flujo de aire mal: todos los ventiladores sacan aire (presión negativa fuerte, el frontal no mete aire fresco) y el filtro está obstruido. | Delanteros **metiendo** aire, trasero sacando. Limpiar filtros y disipador. Revisar curva de ventiladores. Valorar un disipador mejor. | Mirar el sentido (flechas del marco del ventilador); medir temperaturas antes y después (HWiNFO). | g |
| AV-07 | SSD M.2 **SATA** en una ranura que solo admite **PCIe/NVMe**. | Usar una ranura M.2 que admita SATA (según el manual) o cambiar el SSD por uno NVMe. | Leer la etiqueta del SSD (SATA / NVMe) y el manual de la placa (qué admite cada ranura y qué comparte). | j, k |
| AV-08 | Sin controlador del fabricante; el Bluetooth necesita el **cable USB interno** a un conector USB 2.0 de la placa; sin antenas la señal es mala. | Conectar el cable USB 2.0 interno, poner las antenas, instalar el controlador del fabricante (Intel / Realtek / MediaTek). | Administrador de dispositivos; revisar lo que traía la caja (antenas, cable); manual de la tarjeta. | j, k |
| AV-09 | Código de pitidos: **depende del fabricante de la UEFI**. En AMI, 1 largo + 3 cortos suele indicar fallo de memoria; en otras, de vídeo. Tras una mudanza: RAM o gráfica desencajadas. | Consultar el manual; reasentar RAM y gráfica (equipo desenchufado, pulsera). Probar con un módulo. | Buscar la tabla de pitidos del manual; LED de diagnóstico si hay. Se valora que **no** dé por hecho el significado sin consultarlo. | f, j |
| AV-10 | **Pila CR2032** agotada: sin corriente, la CMOS/NVRAM pierde hora y ajustes. | Cambiar la pila (equipo desenchufado) y volver a configurar la UEFI. | Medir la pila con el polímetro (< 2,8 V aprox. = cambiar). | f |
| AV-11 | La gráfica (336 mm, 3 ranuras) no cabe en una caja que admite 300 mm. | Devolverla (desistimiento de 14 días en compras online) y elegir una de ≤ 300 mm y 2-2,5 ranuras, o cambiar de caja. | Medir con la regla; ficha técnica de la caja y de la gráfica. | g, j |
| AV-12 | Actualización de la UEFI interrumpida: firmware corrupto. | Usar **BIOS FlashBack**: archivo correcto renombrado en un USB (FAT32) en el puerto marcado, con la fuente conectada. Si no hay función de recuperación: servicio técnico del fabricante (RMA). | Manual de la placa, nombre de archivo exacto, puerto USB correcto. | f, k |

## Clientes (CL): qué esperar

Precios orientativos a noviembre de 2026; hay escasez de memoria y suben. Se valora sobre
todo **la justificación y las comprobaciones**, no el modelo exacto.

| Nº | Lo esencial de una buena propuesta | Errores típicos a vigilar |
|---|---|---|
| CL-01 | Gráfica de gama media-alta/alta para 1440p (RTX 5070 / RX 9070, o RTX 5070 Ti / RX 9070 XT si llega). CPU de 6-8 núcleos (Ryzen 5 9600X / 7 7800X3D…), 32 GB DDR5, NVMe 1 TB, fuente 750 W de calidad. **Monitor 1440p de 144-180 Hz** con DisplayPort. | Olvidar el monitor; gráfica de 8 GB; fuente justa; no comprobar longitud de gráfica. |
| CL-02 | Procesador **con gráfica integrada** (sin F), 16 GB, SSD 500 GB-1 TB, fuente pequeña de calidad, caja compacta silenciosa, monitor 24" IPS, **licencia Windows 11 Pro**. Presupuesto ×3. | Meter gráfica dedicada; elegir un procesador F; olvidar la licencia o multiplicar mal por 3. |
| CL-03 | 64 GB de RAM (mínimo 32), CPU de muchos núcleos, gráfica con buen codificador (NVIDIA RTX 50 con NVENC o RX 9070), varios SSD (sistema + proyectos), monitor IPS 27" 4K con buena cobertura sRGB/DCI-P3. | Monitor de juego TN/VA en vez de IPS de color; poca RAM. |
| CL-04 | Plataforma **AM5** (permite cambiar de procesador más adelante), 32 GB, gráfica media (RTX 5060 Ti 16 GB / RX 9060 XT 16 GB), fuente con margen para mejorar. Justificar la ampliabilidad. | Plataforma sin futuro; fuente sin margen. |
| CL-05 | Mini-ITX o caja HTPC pequeña; APU (Ryzen 7 8700G) o gráfica de perfil bajo; salida **HDMI 2.1** compatible con HDR 4K; disipador y fuente silenciosos (SFX). | Componentes que no caben (altura del disipador, longitud gráfica); salida que no da 4K HDR. |
| CL-06 | Gráfica de **≤ 300 mm**, ≤ ~220 W y con 1 o 2 conectores de 8 pines: RX 9060 XT 16 GB o RTX 5060 Ti 16 GB. Explicar que **PCIe 3.0** funciona (compatibilidad hacia atrás) con pérdida pequeña, mayor en tarjetas x8. Mantener la fuente de 550 W si los cálculos dan. | Elegir una gráfica larga o con 12V-2×6 sin comprobar la fuente; ignorar el PCIe 3.0 y que las x8 pierden más. |
| CL-07 | CPU de 8+ núcleos, gráfica NVIDIA (NVENC para emitir) de gama media-alta, 32 GB, **dos monitores** (uno de alta frecuencia), gráfica con suficientes salidas, posible capturadora/cámara. | Olvidar el segundo monitor o que la gráfica tenga salidas para los dos. |
| CL-08 | Prioridad: **VRAM**. RTX 5070 Ti / 5080 de 16 GB dentro de presupuesto (la 5090 de 32 GB lo supera). 64 GB de RAM, NVMe grande, fuente 850 W. Explicar por qué NVIDIA (CUDA) para IA. | Elegir por núcleos o por fps en vez de por VRAM; meter la 5090 sin cuadrar el presupuesto. |
| CL-09 | 8 puestos + profesor con **gráfica integrada**, eficientes; monitores 24"; para el profesor, salida para el **proyector** (HDMI) y quizá doble pantalla. Garantía, mismo modelo en todos (mantenimiento), licencias, mano de obra × 9, IVA. ~700 € por puesto. | Pasarse de presupuesto; olvidar la mano de obra de 9 equipos, las licencias o el proyector. |

## Sesión 5 · Cómo preparar la avería real

Preparar un equipo por empresa (equipo desenchufado y anotando lo que se hace). Dos o tres
averías por equipo, de dificultad creciente:

1. **Monitor en la salida de la placa** con procesador F o con gráfica dedicada → sin imagen.
2. **Cable de alimentación de la gráfica** sin conectar → sin imagen o aviso VGA.
3. **Módulo de RAM** medio sacado o en la ranura que no toca (A1 en vez de A2) → LED DRAM
   o un solo canal (comprobar en CPU-Z: modo *Single*).
4. **Orden de arranque** cambiado o **CSM** activado → no arranca Windows (y Secure Boot).
5. **Cable de ventilador** de CPU en CHA_FAN → aviso «CPU fan error» al arrancar.
6. **F_PANEL**: botón de encendido en el pin de reset → no enciende con el botón.
7. **Pila** quitada → hora y ajustes perdidos.

Revisar antes de que vuelvan a enchufar. Se evalúa el orden de las pruebas (de lo simple a
lo complejo, de lo externo a lo interno), la seguridad y el informe con fotos.

## Llamadas de última hora (para la centralita)

- CL-01: «Al final me quedo con mi monitor de 1080p, ¿qué cambiarías?» → bajar gráfica.
- CL-02: «Ahora son 4 equipos y el presupuesto total no cambia.»
- CL-04: «Mi tío me regala una caja micro-ATX que admite gráficas de 280 mm.»
- CL-06: «Mi fuente es de 450 W, me equivoqué.» → hay que cambiarla o elegir otra gráfica.
- AV-05: «Ahora la pantalla parpadea en negro de vez en cuando.» → cable DP de mala calidad.
- Cualquier presupuesto: «La gráfica que habéis elegido se ha agotado.» → alternativa.
- CL-09 (concurso): «La academia exige que los equipos tengan Wi-Fi.» → tarjeta o placa con Wi-Fi.

## Corrección rápida

- Informe de avería: ¿las pruebas van en orden lógico? ¿El diagnóstico está justificado
  con lo que se ve, o adivinado? ¿Consultan el manual (pitidos, QVL, ranuras)?
- Informe técnico: revisar que estén **las seis comprobaciones** (zócalo/chipset/UEFI,
  memoria/QVL, M.2, fuente y conectores, caja, salidas-monitor-cable).
- Presupuesto: base = PVP ÷ 1,21; IVA sobre la base; mano de obra incluida; enlace y fecha.
- Ortografía: hasta 1 punto según la programación.
