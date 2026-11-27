# P9 · Servicio técnico: dos empresas de informática — Guía del profesor y solucionario

Tema 3, segunda parte (3.8 a 3.13). RA1, CE f, g, i, j, k. Página del alumnado:
`web/temas/ut03-practica-empresas.html`. **Este documento no se enlaza desde la web.**

## Organización

- Empresa A (3 personas): técnico/a, asesor/a, calidad. Empresa B (2): técnico/a y
  asesor/a, con revisión cruzada.
- 6 sesiones: 1 fundación · 2-4 jornadas de encargos · 5 jornada de urgencias (individual, dos encargos sorpresa en el simulador) · 6 concurso (CL-12).
- **Todo es simulado.** Las averías se resuelven en el simulador de POST de la página (`web/assets/ut03-simulador-post.js`); los clientes los hace el profesor.
- Reparto de encargos propuesto (cada persona firma al menos 2 averías y 1 cliente):

| Jornada | Empresa A (3) | Empresa B (2) |
|---|---|---|
| 2 | AV-01, AV-05, CL-01 | AV-03, CL-06 |
| 3 | AV-03, AV-07, CL-04 | AV-01, CL-02 |
| 4 | AV-04, AV-08, CL-06 | AV-04, CL-05 |
| Reserva / rápidos | AV-02, AV-06, AV-09, AV-10, AV-11, AV-12, CL-03, CL-07…CL-11 | ídem |

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

## Ruta mínima en el simulador

El simulador comprueba la avería como resuelta solo si el equipo se ha vuelto a encender.
Cada acción cuenta como prueba; hacer cosas innecesarias (cambiar la fuente cuando no hace
falta, por ejemplo) no rompe nada pero aparece en el registro. Trabajar dentro con el
equipo enchufado o encendido no se ejecuta y suma un **aviso de seguridad**.

| Nº | Ruta mínima (≈ pruebas) | Trampa que detecta |
|---|---|---|
| AV-01 | Encender (sin señal, sin LED) → mirar a qué salida está el monitor → conectarlo a la gráfica → encender (4) | Abrir el equipo sin necesidad. |
| AV-02 | Encender (LED DRAM, reinicios) → QVL → apagar, desenchufar → Clear CMOS → encender en la UEFI → memoria a 6000 con EXPO → encender (≈ 9) | Volver a activar EXPO a 6400: vuelve a fallar. |
| AV-03 | Encender → comprobar requisitos / msinfo32 / tpm.msc → **convertir a GPT** → UEFI: quitar CSM, Secure Boot, TPM → encender (≈ 9) | Si quitan el CSM **antes** de convertir el disco: LED BOOT y «Reboot and Select proper Boot device». Tienen que volver a activar CSM, convertir y repetir. |
| AV-04 | Encender → jugar 15 min (se apaga, +12 V baja) → etiqueta de la fuente → revisar cables de la gráfica (adaptador Molex caliente) → cambiar la fuente → encender (≈ 6) | Cambiar la fuente sin diagnosticar antes. |
| AV-05 | Pantalla avanzada (60 Hz, máximo 60) → mirar el cable → cable DisplayPort → poner la frecuencia máxima (165) (≈ 4) | Solo cambiar los Hz en Windows: con HDMI antiguo no sube de 60. |
| AV-06 | Jugar 15 min (95 °C) → mirar ventiladores (sacan aire) y filtro → desenchufar → dar la vuelta a los delanteros + limpiar → encender (≈ 6) | Dar la vuelta a los ventiladores cuando ya estaban bien: los estropea. |
| AV-07 | Administración de discos (no aparece) → manual de ranuras M.2 → etiqueta del SSD (SATA) → moverlo a M2_2 **o** cambiarlo por NVMe → encender (≈ 5) | — |
| AV-08 | Administrador de dispositivos (controlador genérico, sin Bluetooth) → señal Wi-Fi débil → revisar tarjeta (cable USB suelto, antenas sin poner) → conectar USB + antenas → controlador del fabricante (≈ 7) | Solo instalar el controlador: el Bluetooth sigue sin aparecer. |
| AV-09 | Encender (LED DRAM + 1 largo y 3 cortos) → tabla de pitidos (memoria) → desenchufar → recolocar la memoria → encender (≈ 5) | Ir a por la gráfica sin consultar la tabla. |
| AV-10 | Encender (CMOS Checksum Error, 2009) → medir la pila (1,9 V) → cambiarla → encender → poner fecha y hora (≈ 6) | — |
| AV-11 | Medir el hueco (300 mm) → ficha de la gráfica (336 mm) → devolverla y pedir una de 290 mm → instalarla → encender (≈ 5) | Intentar instalar la de 336 mm. |
| AV-12 | Encender (LED CPU fijo) → manual de FlashBack → apagar → USB con la BIOS **del modelo exacto** → FlashBack (enchufado y apagado) → encender (≈ 6) | USB con la BIOS de otra placa del mismo chipset: no graba. Desenchufar el equipo: FlashBack necesita la fuente enchufada. |

## Clientes (CL): qué esperar

Presupuestos ajustados a propósito (precios de noviembre de 2026, con escasez de memoria):
en varios casos **no se puede cumplir todo**. Se valora que lo detecten, prioricen y lo
expliquen al cliente con alternativas y su coste. Si el mercado cambia mucho, ajusta la
cifra antes de repartir el encargo.

| Nº | La clave del encargo | Lo que debería aparecer | Errores típicos |
|---|---|---|---|
| CL-01 | Wi-Fi en la **placa** (no tarjeta), SATA para el SSD de 2 TB, 1440p con 1100 €. | Placa B650/B850 o B760/B860 «WIFI» (Wi-Fi 6E/7 + BT), gráfica de 12-16 GB de gama media-alta (RTX 5070 / RX 9070 si cabe; si no, 5060 Ti 16 GB / 9060 XT 16 GB explicando que a 1440p rendirá menos), 32 GB, NVMe pequeño + su SATA, caja blanca con cristal. Comprobar puertos SATA y cable. | Placa sin Wi-Fi; olvidar que el SSD SATA necesita cable y puerto; pasarse del presupuesto. |
| CL-02 | Dos monitores **sin gráfica**: placa con 2 salidas (HDMI + DP/HDMI) y procesador **sin F**. 600 € por equipo con monitor y licencia. | Core i3/i5 sin F o Ryzen 8000G; placa micro-ATX con 2 salidas de vídeo; 16 GB; SSD 500 GB; monitores 24"; **Windows 11 Pro ×3**; lector DNIe USB ×3; segundo monitor para el jefe. | Procesador F o Ryzen 7000/9000 pensando que basta su gráfica básica sin comprobar salidas de la placa; olvidar licencias o el monitor extra. |
| CL-03 | 64 GB + AV1 + USB4/Thunderbolt + USB-C frontal en 1700 €: muy justo. | Gráfica RTX 50 / RX 9000 (todas codifican AV1) de gama media; placa con **USB4** (X870, Z890 o con tarjeta Thunderbolt compatible) y conector USB-C frontal; caja con USB-C; 2 NVMe. Si no llega: proponer tarjeta Thunderbolt o dejar el 2.º NVMe para después, explicándolo. | Elegir placa sin USB4 ni cabecera para tarjeta Thunderbolt; caja sin USB-C frontal; gráfica antigua sin AV1. |
| CL-04 | Pensar en la **ampliación**: placa, fuente y caja definitivas ya. | AM5 (Ryzen 7000/9000 cambiables por futuros AM5), placa B650/B850, fuente de 750 W (300 W de gráfica + procesador + margen) con 12V-2×6 o 2-3 PCIe, caja con 330 mm para la gráfica; ahora gráfica integrada o barata. Justificar cada pieza «definitiva». | Fuente de 500 W; caja pequeña; plataforma sin recorrido. |
| CL-05 | < 10 L, HDMI 2.1 a 4K 120 Hz, Wi-Fi + BT, silencio, 700 €. | Caja Mini-ITX < 10 L (con fuente SFX), placa Mini-ITX con Wi-Fi; Ryzen 7 8700G (salida HDMI 2.1 desde la placa si la placa la tiene) o gráfica compacta con HDMI 2.1; disipador de perfil bajo que quepa (altura máxima de la caja). | No comprobar la versión HDMI de la **placa** (muchas son 2.0); disipador o gráfica que no caben. |
| CL-06 | ≤ 270 mm, 2 ranuras, **un solo 8 pines** (75 + 150 = 225 W), PCIe 3.0, monitor con DP. | RX 9060 XT 16 GB o RTX 5060 Ti de **2 ventiladores ≤ 270 mm** y un 8 pines; conectar por **DisplayPort** (el HDMI 1.4 no da 1080p 144 Hz fiable). Mencionar que las tarjetas **x8** (9060 XT y 5060 Ti son x8) pierden algo en PCIe 3.0: comprobar pruebas. Fuente de 500 W suficiente con el cálculo. | Modelo de 3 ventiladores de 300+ mm; usar HDMI; no calcular el consumo. |
| CL-07 | Comparar **placa nueva** vs **tarjetas**. | Opción A: tarjeta Wi-Fi PCIe (~30-40 €) + adaptador M.2 a PCIe x4 (~15 €) si hay ranura PCIe libre (ver carriles). Opción B: placa micro-ATX LGA1700 **DDR4** con Wi-Fi y 2 M.2 (~130-150 €), que obliga a desmontar todo. Recomendar A por precio/trabajo, salvo que no haya ranuras. | Elegir placa DDR5 (no sirve su memoria); no mirar si quedan ranuras PCIe libres. |
| CL-08 | Dos monitores (uno vertical VESA), NVENC, 2,5 GbE, 6 USB traseros, 1900 € con monitores. | Gráfica NVIDIA (NVENC) con 2+ salidas; monitor 1440p 165 Hz + 1080p con VESA o pie giratorio; placa con 2,5 GbE y 6+ USB traseros (contarlos en la ficha). | No contar los USB; monitor 2 sin VESA; gráfica AMD sin justificar el codificador. |
| CL-09 | Máxima VRAM con 2200 €: la 5090 (32 GB) no entra. | RTX 5070 Ti o 5080 (16 GB); 64 GB RAM; fuente ATX 3.x con 12V-2×6 nativo (850 W). Explicar por qué NVIDIA (CUDA) y que 16 GB es lo máximo dentro del presupuesto. | Meter la 5090; fuente con adaptador. |
| CL-10 | Equipos de 2017 sin soporte de Windows 11 (i5-7500 no está en la lista). | Por equipo: SSD SATA 2,5" 500 GB + 1 módulo DDR4-2400 de 8 GB (dual channel); comprobar ranuras libres (el 7050 SFF/MT tiene 4); clonar el disco. **Avisar**: Windows 10 sin soporte desde octubre de 2025 (ESU o cambiar de sistema), no pasan a Windows 11 oficialmente. Si no llega con 300 €, priorizar el SSD. | Comprar DDR5 o SO-DIMM; no avisar de Windows 10/11; no comprobar el formato (SFF/MT). |
| CL-11 | La GTX 1050 Ti sí da **4K a 60 Hz** por DP 1.4 o HDMI 2.0. | Monitor 27" 4K IPS con buena cobertura sRGB/Adobe RGB o DCI-P3 (calibrado de fábrica); cable DisplayPort; no hace falta cambiar la gráfica para editar fotos. | Venderle una gráfica innecesaria; cable HDMI antiguo. |
| CL-12 | 9 equipos + monitores + Wi-Fi + licencias + mano de obra + IVA con 5600 €: ~620 € por puesto. | Procesador con gráfica integrada, placa con Wi-Fi o tarjeta barata, 16 GB, SSD 500 GB, monitores 24", Windows 11 Pro ×9, mano de obra ×9, HDMI para el proyector. Mismo modelo en todos. | Olvidar el Wi-Fi, las licencias o la mano de obra; pasarse. |

## Llamadas de última hora (para la centralita)

- CL-01: «Al final me quedo con mi monitor de 1080p, ¿qué cambiarías?» → bajar gráfica.
- CL-02: «Ahora son 4 equipos y el presupuesto total no cambia.»
- CL-04: «Mi tío me regala una caja micro-ATX que admite gráficas de 280 mm.»
- CL-06: «Mi fuente es de 450 W, me equivoqué.» → hay que cambiarla o elegir otra gráfica.
- AV-05: «Ahora la pantalla parpadea en negro de vez en cuando.» → cable DP de mala calidad.
- Cualquier presupuesto: «La gráfica que habéis elegido se ha agotado.» → alternativa.
- CL-12 (concurso): «La academia quiere además una impresora en red para el aula y el presupuesto no sube.»
- CL-06: «Me he equivocado: la caja admite 250 mm.» → modelo compacto de un ventilador.
- CL-10: «Al final son 8 equipos.» → misma cantidad de dinero: priorizar.

## Corrección rápida

- Informe de avería: pegan el registro del simulador. ¿Las pruebas van en orden lógico?
  ¿Explican por qué hicieron cada una? ¿El diagnóstico se justifica con lo que se vio
  (LED, pitidos, mensajes) o lo adivinaron? ¿Consultaron el manual (pitidos, QVL, ranuras)?
  ¿Hay avisos de seguridad (trabajar enchufado)?
- Informe técnico: revisar que estén **las seis comprobaciones** (zócalo/chipset/UEFI,
  memoria/QVL, M.2, fuente y conectores, caja, salidas-monitor-cable).
- Presupuesto: base = PVP ÷ 1,21; IVA sobre la base; mano de obra incluida; enlace y fecha.
- Ortografía: hasta 1 punto según la programación.
