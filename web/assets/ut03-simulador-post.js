/* Simulador de POST y averías · P9 · Tema 3 · 0221
   Se monta en <div data-simulador-post></div>. Todo es simulado: no hay que tocar ningún equipo real.
   Las soluciones NO están escritas aquí como texto: cada encargo solo define su estado inicial y
   la condición de «arreglado». El alumnado tiene que deducir la causa con las pruebas. */
(function () {
  'use strict';

  // ------------------------------------------------------------ estado de un equipo sano
  function base() {
    return {
      enchufado: true, modo: 'apagado',          // apagado | post-fallo | uefi | windows | sin-arranque
      cpu: 'Core i5-14600K', cpuF: false, placa: 'B760', bios: 'AMI',
      monitor: 'grafica', cable: 'dp', hzWin: 165, hzMax: 165, resol: '2560 × 1440',
      ram: 'ok', expo: 'off', ramQVL: true,
      gpu: 'RTX 5060 Ti', gpuAsiento: true, gpuAlim: 'ok', gpuW: 180,
      fuenteW: 750, fuenteBuena: true,
      pilaV: 3.05, ajustesPerdidos: false,
      csm: false, tpm: true, secure: true, disco: 'GPT',
      vent: 'ok', filtro: 'limpio',
      ssd: null, wifi: null,
      gpuNueva: null, biosCorrupta: false, usbFlash: null,
      pitidosMem: '1 largo y 3 cortos', pitidosVid: '1 largo y 8 cortos',
      apagaConCarga: false, extra: {}
    };
  }

  // ------------------------------------------------------------ encargos (mismos números que la página)
  var ENCARGOS = [
    { id: 'AV-01', t: 'Sin señal en un equipo recién montado', cliente: '«Me he montado el ordenador yo mismo. Enciende, los ventiladores giran, pero la pantalla dice "sin señal".»',
      equipo: 'Core i5-14400F, placa B760, RTX 4060. Monitor conectado por HDMI.',
      ini: { cpu: 'Core i5-14400F', cpuF: true, monitor: 'placa', cable: 'hdmi', gpu: 'RTX 4060', hzMax: 144, hzWin: 144 },
      ok: function (s) { return s.monitor === 'grafica'; } },
    { id: 'AV-02', t: 'No arranca después de tocar la memoria en la BIOS', cliente: '«Toqué una opción de la BIOS para que la memoria fuera más rápida y ahora no arranca. Se queda encendida una luz que pone DRAM.»',
      equipo: 'Ryzen 5 7600, placa B650, 2 × 16 GB DDR5-6400.',
      ini: { cpu: 'Ryzen 5 7600', placa: 'B650', expo: '6400', ramQVL: false },
      ok: function (s) { return s.expo !== '6400' && s.modo !== 'post-fallo'; } },
    { id: 'AV-03', t: 'Windows 11 dice que el PC no cumple los requisitos', cliente: '«Quiero poner Windows 11 y me dice que este PC no cumple los requisitos. El ordenador es bastante nuevo.»',
      equipo: 'Core i5-12400, placa H610, Windows 10.',
      ini: { cpu: 'Core i5-12400', placa: 'H610', csm: true, tpm: false, secure: false, disco: 'MBR' },
      ok: function (s) { return !s.csm && s.tpm && s.secure && s.disco === 'GPT'; } },
    { id: 'AV-04', t: 'Se apaga al jugar', cliente: '«Cuando juego, a los diez minutos se apaga de golpe. Navegando por internet nunca pasa.»',
      equipo: 'Gráfica nueva de 250 W. Fuente que venía con la caja.',
      ini: { gpu: 'RX 9070', gpuW: 250, fuenteW: 450, fuenteBuena: false, gpuAlim: 'molex' },
      ok: function (s) { return s.fuenteBuena && s.fuenteW >= 650 && s.gpuAlim === 'ok'; } },
    { id: 'AV-05', t: 'El monitor nuevo de 165 Hz va igual que el viejo', cliente: '«Me he comprado un monitor de 165 Hz y en el ratón noto que va igual que el viejo.»',
      equipo: 'Monitor 27" 1440p 165 Hz con HDMI 2.0 y DisplayPort 1.4. Conectado con el cable del monitor antiguo.',
      ini: { cable: 'hdmi-viejo', hzWin: 60 },
      ok: function (s) { return s.cable === 'dp' && s.hzWin === 165; } },
    { id: 'AV-06', t: 'Mucho ruido y 95 °C jugando', cliente: '«Hace muchísimo ruido y el procesador llega a 95 °C jugando.»',
      equipo: 'Caja con 3 ventiladores delanteros y 1 trasero. Disipador de serie.',
      ini: { vent: 'sacan', filtro: 'sucio' },
      ok: function (s) { return s.vent === 'ok' && s.filtro === 'limpio'; } },
    { id: 'AV-07', t: 'El SSD M.2 nuevo no aparece', cliente: '«He puesto un SSD M.2 nuevo y no aparece por ningún sitio, ni en la BIOS.»',
      equipo: 'Placa B760 con dos ranuras M.2. SSD de 1 TB comprado por internet.',
      ini: { ssd: { tipo: 'SATA', ranura: 'M2_1' } },
      ok: function (s) { return s.ssd && (s.ssd.ranura === 'M2_2' || s.ssd.tipo === 'NVMe'); } },
    { id: 'AV-08', t: 'Wi-Fi a ratos y sin Bluetooth', cliente: '«He instalado una tarjeta Wi-Fi con Bluetooth. El Wi-Fi funciona a ratos y el Bluetooth no aparece.»',
      equipo: 'Tarjeta Wi-Fi 6E con Bluetooth en una ranura PCIe x1.',
      ini: { wifi: { driver: false, usb: false, antenas: false } },
      ok: function (s) { return s.wifi.driver && s.wifi.usb && s.wifi.antenas; } },
    { id: 'AV-09', t: 'Pitidos y sin imagen tras una mudanza', cliente: '«Al encender pita: un pitido largo y tres cortos, y no sale imagen.»',
      equipo: 'Equipo de sobremesa con tarjeta gráfica. Se movió de casa la semana pasada.',
      ini: { ram: 'suelta' },
      ok: function (s) { return s.ram === 'ok'; } },
    { id: 'AV-10', t: 'Pierde la hora y la configuración', cliente: '«Cada vez que desenchufo la regleta, el ordenador se pone en 2009 y tengo que volver a configurar la BIOS.»',
      equipo: 'Equipo de 2018.',
      ini: { pilaV: 1.9, ajustesPerdidos: true, cpu: 'Core i5-8400', placa: 'B360', gpu: 'GTX 1060', gpuW: 120, cable: 'hdmi', hzMax: 60, hzWin: 60, resol: '1920 × 1080' },
      ok: function (s) { return s.pilaV >= 3; } },
    { id: 'AV-11', t: 'La gráfica nueva no entra en la caja', cliente: '«He comprado una gráfica nueva por internet y no entra en la caja.»',
      equipo: 'Caja micro-ATX. Gráfica comprada hace 5 días.',
      ini: { gpuNueva: { mm: 336, ranuras: 3, instalada: false }, extra: { cajaMax: 300 } },
      ok: function (s) { return s.gpuNueva && s.gpuNueva.mm <= 300 && s.gpuNueva.instalada; } },
    { id: 'AV-12', t: 'No enciende tras cortarse la luz actualizando la BIOS', cliente: '«Estaba actualizando la BIOS, se fue la luz y ahora no enciende nada en pantalla.»',
      equipo: 'Placa ASUS de gama media (ROG STRIX B650-A).',
      ini: { biosCorrupta: true, placa: 'ROG STRIX B650-A', cpu: 'Ryzen 7 7700' },
      ok: function (s) { return !s.biosCorrupta; } }
  ];

  // ------------------------------------------------------------ utilidades
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function mmss(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }

  // ------------------------------------------------------------ simulación del POST
  // Devuelve qué se ve al encender: LED encendido, pitidos, monitor y a dónde llega.
  function post(s) {
    if (!s.enchufado) return { led: null, pit: '', pan: '(apagado)', fin: 'apagado', txt: 'No pasa nada: el equipo está desenchufado.' };
    if (s.biosCorrupta) return { led: 'CPU', pit: '', pan: 'Sin señal', fin: 'post-fallo', txt: 'Los ventiladores giran al máximo. El LED CPU se queda encendido fijo. No hay pitidos ni imagen.' };
    if (s.ram === 'suelta') return { led: 'DRAM', pit: s.pitidosMem, pan: 'Sin señal', fin: 'post-fallo', txt: 'Se enciende el LED DRAM y se oyen pitidos: ' + s.pitidosMem + '. No sale imagen.' };
    if (s.expo === '6400' && !s.ramQVL) return { led: 'DRAM', pit: '', pan: 'Sin señal', fin: 'post-fallo', txt: 'El LED DRAM se queda encendido. El equipo se apaga y se vuelve a encender solo tres veces y sigue igual. No sale imagen.' };
    if (s.gpuNueva && !s.gpuNueva.instalada && s.extra.sinGpu) return { led: 'VGA', pit: s.pitidosVid, pan: 'Sin señal', fin: 'post-fallo', txt: 'LED VGA encendido y pitidos: ' + s.pitidosVid + '.' };
    if (!s.gpuAsiento || s.gpuAlim === 'suelta') return { led: 'VGA', pit: s.pitidosVid, pan: 'Sin señal', fin: 'post-fallo', txt: 'Se enciende el LED VGA y se oyen pitidos: ' + s.pitidosVid + '. No sale imagen.' };
    var conImagen = s.monitor === 'grafica';
    if (!conImagen) return { led: null, pit: '1 corto', pan: 'Sin señal', fin: 'sin-imagen', txt: 'Un pitido corto (POST correcto). Ningún LED de diagnóstico encendido. El monitor muestra «Sin señal · HDMI».' };
    if (s.pilaV < 2.5) return { led: null, pit: '1 corto', pan: 'CMOS Checksum Error — Defaults Loaded. Fecha: 01/01/2009. Press F1 to Run SETUP', fin: 'aviso-cmos', txt: 'Un pitido corto y un mensaje en pantalla: «CMOS Checksum Error — Defaults Loaded». La fecha es 01/01/2009.' };
    return { led: null, pit: '1 corto', pan: 'Logotipo del fabricante', fin: 'ok', txt: 'Un pitido corto. Sin LED de diagnóstico encendido. Sale el logotipo del fabricante.' };
  }
  function arrancaWindows(s) {
    if (!s.csm && s.disco === 'MBR') return false;
    return true;
  }

  // ------------------------------------------------------------ acciones
  // Cada acción: grupo, texto del botón, cuándo se puede (cond) y qué hace (run → texto del resultado).
  var GRUPOS = [
    ['fuera', 'Por fuera'], ['dentro', 'Dentro del equipo'], ['uefi', 'En la UEFI'],
    ['win', 'En Windows'], ['doc', 'Documentación']
  ];
  function apagado(s) { return s.modo === 'apagado' || s.modo === 'post-fallo' || s.modo === 'sin-imagen'; }

  var ACCIONES = [
    // --- por fuera
    { g: 'fuera', b: 'Mirar a qué salida está conectado el monitor', run: function (s) {
      return s.monitor === 'placa' ? 'El cable está en el HDMI del panel trasero de la <b>placa base</b>. La tarjeta gráfica tiene 3 DisplayPort y 1 HDMI libres.' : 'El monitor está conectado a una salida de la <b>tarjeta gráfica</b>.'; } },
    { g: 'fuera', b: 'Conectar el monitor a la tarjeta gráfica', run: function (s) { s.monitor = 'grafica'; return 'Conectas el cable a una salida de la tarjeta gráfica.'; } },
    { g: 'fuera', b: 'Mirar el cable del monitor', run: function (s) {
      return { 'hdmi-viejo': 'Es un cable HDMI antiguo, sin la etiqueta «High Speed» ni «Premium». El monitor trae en la caja un cable DisplayPort sin usar.', 'hdmi': 'Cable HDMI de alta velocidad.', 'dp': 'Cable DisplayPort 1.4.' }[s.cable]; } },
    { g: 'fuera', b: 'Cambiar al cable DisplayPort del monitor', run: function (s) { if (s.cable === 'dp') return 'Ya está conectado con DisplayPort. No cambia nada.'; s.cable = 'dp'; return 'Conectas el monitor con el cable DisplayPort que venía en su caja.'; } },
    { g: 'fuera', b: 'Leer la etiqueta de la fuente', run: function (s) {
      return s.fuenteBuena ? 'Fuente de ' + s.fuenteW + ' W, 80 Plus Gold. Línea de +12 V de ' + Math.round(s.fuenteW * 0.95 / 12) + ' A. Tiene cables PCIe de 8 pines y 12V-2×6.' :
        'Fuente genérica de «' + s.fuenteW + ' W» sin certificación 80 Plus. Línea de +12 V: 22 A (264 W). No tiene cables PCIe: solo Molex y SATA.'; } },
    { g: 'fuera', b: 'Escuchar y mirar los ventiladores con el equipo encendido', cond: function (s) { return !apagado(s); }, run: function (s) {
      return s.vent === 'sacan' ? 'Los tres ventiladores delanteros tienen las flechas del marco apuntando hacia fuera de la caja: <b>sacan aire</b>, igual que el trasero. Por el frontal casi no entra aire.' : 'Los delanteros meten aire y el trasero lo saca.'; } },
    { g: 'fuera', b: 'Mirar el filtro frontal', run: function (s) { return s.filtro === 'sucio' ? 'El filtro está cubierto de polvo y pelusa.' : 'Filtro limpio.'; } },
    { g: 'fuera', b: 'Pulsar el botón BIOS FlashBack (con el USB puesto)', cond: function (s) { return /ROG|ASUS/.test(s.placa); }, run: function (s) {
      if (!s.enchufado) return 'No pasa nada: FlashBack necesita que la fuente esté enchufada (con el equipo apagado).';
      if (s.modo !== 'apagado') return 'Primero apaga el equipo: FlashBack se usa con el equipo apagado.';
      if (!s.usbFlash) return 'El LED de FlashBack parpadea tres veces y se queda fijo: no encuentra ningún archivo válido en el USB.';
      if (s.usbFlash === 'otra') return 'El LED parpadea y se queda fijo: el archivo no es de este modelo de placa. No se graba nada.';
      s.biosCorrupta = false; return 'El LED de FlashBack parpadea durante unos minutos y se apaga. Ha terminado de grabar el firmware.'; } },
    { g: 'fuera', b: 'Preparar un USB con la BIOS del modelo exacto (FAT32, archivo renombrado según el manual)', cond: function (s) { return /ROG|ASUS/.test(s.placa); }, run: function (s) { s.usbFlash = 'exacta'; return 'Descargas de la web de ASUS la BIOS de la ROG STRIX B650-A, la renombras con el nombre que indica el manual y la copias a un USB en FAT32. Lo pones en el puerto marcado como «BIOS FlashBack».'; } },
    { g: 'fuera', b: 'Preparar un USB con la BIOS de otra placa del mismo chipset', cond: function (s) { return /ROG|ASUS/.test(s.placa); }, run: function (s) { s.usbFlash = 'otra'; return 'Copias al USB la BIOS de una placa B650 de otro modelo.'; } },
    { g: 'fuera', b: 'Medir el hueco para la gráfica dentro de la caja', cond: function (s) { return !!s.gpuNueva; }, run: function (s) { return 'Con la regla: desde la parte trasera hasta el soporte del ventilador frontal hay <b>' + s.extra.cajaMax + ' mm</b>. La ficha de la caja dice lo mismo.'; } },
    { g: 'fuera', b: 'Mirar la ficha de la gráfica nueva', cond: function (s) { return !!s.gpuNueva; }, run: function (s) { return 'Longitud: <b>' + s.gpuNueva.mm + ' mm</b>. Grosor: ' + s.gpuNueva.ranuras + ' ranuras. Consumo: 220 W, un conector de 8 pines. Comprada por internet hace 5 días.'; } },
    { g: 'fuera', b: 'Devolver la gráfica y pedir un modelo de 2 ranuras y 290 mm con el mismo chip', cond: function (s) { return !!s.gpuNueva && s.gpuNueva.mm > 300; }, run: function (s) { s.gpuNueva = { mm: 290, ranuras: 2, instalada: false }; return 'La tienda acepta la devolución (estás dentro de los 14 días). Llega el nuevo modelo: 290 mm y 2 ranuras.'; } },

    // --- dentro (hay que desenchufar antes)
    { g: 'dentro', i: true, b: 'Sacar y volver a colocar los módulos de memoria', run: function (s) { var r = s.ram === 'suelta'; s.ram = 'ok'; return r ? 'Uno de los módulos estaba <b>medio salido</b> de su ranura. Los colocas bien hasta que encajan los dos cierres.' : 'Los módulos estaban bien colocados. Los vuelves a encajar igual.'; } },
    { g: 'dentro', i: true, b: 'Mirar la etiqueta de los módulos de memoria', run: function (s) { return '2 × 16 GB DDR5' + (s.expo !== 'off' || !s.ramQVL ? '-6400 CL32, perfil EXPO a 6400 MT/s.' : '-5600.'); } },
    { g: 'dentro', i: true, b: 'Sacar y volver a colocar la tarjeta gráfica', run: function (s) { s.gpuAsiento = true; return 'La sacas y la vuelves a colocar hasta que encaja el cierre de la ranura PCIe x16.'; } },
    { g: 'dentro', i: true, b: 'Revisar los cables de alimentación de la gráfica', run: function (s) {
      if (s.gpuAlim === 'molex') return 'La gráfica (' + s.gpuW + ' W) está alimentada con un <b>adaptador de dos Molex a 8 pines PCIe</b>. El adaptador está caliente y el plástico, algo amarillento.';
      if (s.gpuAlim === 'suelta') { s.gpuAlim = 'ok'; return 'El conector estaba suelto. Lo encajas hasta que hace clic.'; }
      return 'Conectada con cables PCIe de la propia fuente, bien encajados.'; } },
    { g: 'dentro', i: true, b: 'Cambiar la fuente por una de 750 W 80 Plus Gold y alimentar la gráfica con sus cables PCIe', run: function (s) { if (s.fuenteBuena) return 'Cambias la fuente por otra igual de buena. El equipo funciona exactamente igual que antes: no era necesario (son 110 € para el cliente).'; s.fuenteBuena = true; s.fuenteW = 750; s.gpuAlim = 'ok'; return 'Instalas la fuente nueva y conectas la gráfica con sus cables PCIe de 8 pines. Quitas el adaptador de Molex.'; } },
    { g: 'dentro', i: true, b: 'Medir la pila con el polímetro', run: function (s) { return 'La pila CR2032 marca <b>' + s.pilaV.toFixed(2).replace('.', ',') + ' V</b>. Una pila nueva da unos 3 V.'; } },
    { g: 'dentro', i: true, b: 'Cambiar la pila por una CR2032 nueva', run: function (s) { s.pilaV = 3.1; return 'Pones una pila CR2032 nueva (3,1 V). Habrá que volver a poner la fecha y los ajustes de la UEFI.'; } },
    { g: 'dentro', i: true, b: 'Hacer Clear CMOS (puente de la placa)', run: function (s) { s.expo = 'off'; s.csm = s.extra.csmFabrica != null ? s.extra.csmFabrica : s.csm; return 'Haces el puente CLR_CMOS con un destornillador unos segundos. La UEFI vuelve a los valores de fábrica (perfil EXPO desactivado).'; } },
    { g: 'dentro', i: true, b: 'Dar la vuelta a los ventiladores delanteros', run: function (s) { if (s.vent === 'sacan') { s.vent = 'ok'; return 'Das la vuelta a los tres ventiladores delanteros: ahora meten aire. El trasero sigue sacándolo.'; } s.vent = 'sacan'; return 'Das la vuelta a los tres ventiladores delanteros: ahora <b>sacan</b> aire, igual que el trasero.'; } },
    { g: 'dentro', i: true, b: 'Limpiar el filtro y los disipadores', run: function (s) { s.filtro = 'limpio'; return 'Limpias el filtro frontal y el disipador con aire comprimido, sujetando las aspas para que no giren.'; } },
    { g: 'dentro', i: true, b: 'Mirar la etiqueta del SSD M.2', cond: function (s) { return !!s.ssd; }, run: function (s) { return s.ssd.tipo === 'NVMe' ? 'Etiqueta: «M.2 2280 NVMe PCIe 4.0 x4 · 1 TB». Una muesca (llave M).' : 'Etiqueta: «M.2 2280 <b>SATA</b> III 6 Gb/s · 1 TB». Tiene dos muescas (llave B+M).'; } },
    { g: 'dentro', i: true, b: 'Mover el SSD de la ranura M2_1 a la M2_2', cond: function (s) { return s.ssd && s.ssd.ranura === 'M2_1'; }, run: function (s) { s.ssd.ranura = 'M2_2'; return 'Pasas el SSD a la ranura M2_2 y lo fijas con su tornillo.'; } },
    { g: 'dentro', i: true, b: 'Cambiar el SSD por uno NVMe de 1 TB', cond: function (s) { return !!s.ssd; }, run: function (s) { if (s.ssd.tipo === 'NVMe') return 'Ya es NVMe.'; s.ssd.tipo = 'NVMe'; return 'El cliente compra un SSD NVMe de 1 TB (unos 20 € más) y lo pones en M2_1. Habrá que devolver el SATA.'; } },
    { g: 'dentro', i: true, b: 'Revisar la tarjeta Wi-Fi', cond: function (s) { return !!s.wifi; }, run: function (s) { return 'Tarjeta PCIe x1 bien encajada. De la tarjeta sale un cable USB que <b>no está conectado</b> a nada. En la caja de la tarjeta hay dos antenas sin usar.'; } },
    { g: 'dentro', i: true, b: 'Conectar el cable USB de la tarjeta Wi-Fi a un conector USB 2.0 de la placa', cond: function (s) { return !!s.wifi; }, run: function (s) { if (s.wifi.usb) return 'Ya estaba conectado.'; s.wifi.usb = true; return 'Conectas el cable al conector USB 2.0 interno (9 pines) de la placa.'; } },
    { g: 'fuera', b: 'Poner las antenas de la tarjeta Wi-Fi', cond: function (s) { return !!s.wifi; }, run: function (s) { if (s.wifi.antenas) return 'Ya están puestas.'; s.wifi.antenas = true; return 'Enroscas las dos antenas en la tarjeta, por la parte trasera de la caja.'; } },
    { g: 'dentro', i: true, b: 'Instalar la gráfica nueva', cond: function (s) { return s.gpuNueva && !s.gpuNueva.instalada; }, run: function (s) {
      if (s.gpuNueva.mm > s.extra.cajaMax) return 'No entra: la gráfica choca con los ventiladores frontales antes de llegar a la ranura.';
      s.gpuNueva.instalada = true; return 'La gráfica entra, encaja en la ranura y conectas su cable de 8 pines.'; } },

    // --- UEFI
    { g: 'uefi', u: true, b: 'Ver la información del sistema', run: function (s) { return 'Procesador: ' + s.cpu + ' · Placa: ' + s.placa + ' · Memoria: 32 GB' + (s.expo !== 'off' ? ' a ' + s.expo + ' MT/s (EXPO)' : ' a la velocidad estándar') + ' · Fecha: ' + (s.pilaV < 2.5 ? '01/01/2009' : 'correcta') + '.'; } },
    { g: 'uefi', u: true, b: 'Ver el modo de arranque (CSM) y el arranque seguro', run: function (s) { return 'CSM: <b>' + (s.csm ? 'activado' : 'desactivado') + '</b> · Secure Boot: <b>' + (s.secure ? 'activado' : 'desactivado') + '</b>' + (s.csm ? ' (no se puede activar con CSM activado)' : '') + '.'; } },
    { g: 'uefi', u: true, b: 'Desactivar CSM (arranque solo UEFI)', run: function (s) { if (!s.csm) return 'CSM ya estaba desactivado.'; s.csm = false; return 'CSM desactivado. Guardas y sales.'; } },
    { g: 'uefi', u: true, b: 'Activar CSM (arranque Legacy)', run: function (s) { if (s.csm) return 'CSM ya estaba activado.'; s.csm = true; s.secure = false; return 'CSM activado. Secure Boot se desactiva solo. Guardas y sales.'; } },
    { g: 'uefi', u: true, b: 'Activar Secure Boot', run: function (s) { if (s.secure) return 'Secure Boot ya estaba activado.'; if (s.csm) return 'No te deja: Secure Boot necesita CSM desactivado.'; s.secure = true; return 'Secure Boot activado.'; } },
    { g: 'uefi', u: true, b: 'Ver la seguridad (TPM / Intel PTT / AMD fTPM)', run: function (s) { return 'TPM del procesador: <b>' + (s.tpm ? 'activado' : 'desactivado') + '</b>.'; } },
    { g: 'uefi', u: true, b: 'Activar el TPM del procesador', run: function (s) { if (s.tpm) return 'El TPM ya estaba activado.'; s.tpm = true; return 'TPM (Intel PTT) activado.'; } },
    { g: 'uefi', u: true, b: 'Activar EXPO a 6400 MT/s', run: function (s) { if (!/B650|ROG/.test(s.placa)) return 'Esta placa Intel usa perfiles XMP, y la memoria ya funciona a su velocidad. No cambias nada.'; s.expo = '6400'; return 'Perfil EXPO a 6400 MT/s activado. Guardas y sales.'; } },
    { g: 'uefi', u: true, b: 'Poner la memoria a 6000 MT/s con EXPO', run: function (s) { if (!/B650|ROG/.test(s.placa)) return 'Esta placa Intel usa perfiles XMP, y la memoria ya funciona a su velocidad. No cambias nada.'; s.expo = '6000'; return 'Memoria a 6000 MT/s con las latencias de EXPO. Guardas y sales.'; } },
    { g: 'uefi', u: true, b: 'Poner la fecha y la hora', run: function (s) { s.ajustesPerdidos = false; return 'Pones la fecha y la hora correctas y guardas.'; } },

    // --- Windows
    { g: 'win', w: true, b: 'Abrir la información del sistema (msinfo32)', run: function (s) { return 'Modo de BIOS: <b>' + (s.csm ? 'Heredado (Legacy)' : 'UEFI') + '</b> · Estado de arranque seguro: <b>' + (s.secure ? 'Activado' : 'Desactivado') + '</b>.'; } },
    { g: 'win', w: true, b: 'Abrir la consola del TPM (tpm.msc)', run: function (s) { return s.tpm ? 'TPM listo para usarse. Versión de especificación: 2.0.' : 'No se encuentra un TPM compatible.'; } },
    { g: 'win', w: true, b: 'Abrir Administración de discos', run: function (s) {
      var t = 'Disco 0: estilo de partición <b>' + s.disco + '</b>.';
      if (s.ssd) t += (s.ssd.ranura === 'M2_1' && s.ssd.tipo === 'SATA') ? ' No aparece ningún disco nuevo.' : ' Disco 1: 1 TB sin inicializar (el SSD nuevo).';
      return t; } },
    { g: 'win', w: true, b: 'Convertir el disco a GPT (MBR2GPT)', run: function (s) { if (s.disco === 'GPT') return 'mbr2gpt: «Disk layout validation failed»: el disco ya es GPT. No cambia nada.'; s.disco = 'GPT'; return 'mbr2gpt /convert /allowFullOS → «Conversion completed successfully». El disco ya es GPT. Para arrancar habrá que usar el modo UEFI.'; } },
    { g: 'win', w: true, b: 'Comprobar si cumple los requisitos de Windows 11', run: function (s) {
      var f = []; if (!s.tpm) f.push('TPM 2.0'); if (s.csm || !s.secure) f.push('arranque seguro (UEFI + Secure Boot)');
      return f.length ? 'No cumple: falta ' + f.join(' y ') + '.' : 'Este equipo cumple los requisitos de Windows 11.'; } },
    { g: 'win', w: true, b: 'Abrir Configuración > Pantalla > Pantalla avanzada', run: function (s) {
      var max = s.cable === 'dp' ? s.hzMax : (s.cable === 'hdmi' ? Math.min(s.hzMax, 144) : 60);
      return 'Resolución ' + s.resol + ' · Frecuencia actual: <b>' + s.hzWin + ' Hz</b> · Disponibles: ' + (max === 60 ? '60 Hz' : '60, 120, ' + max + ' Hz') + '.'; } },
    { g: 'win', w: true, b: 'Poner la frecuencia más alta disponible', run: function (s) { var max = s.cable === 'dp' ? s.hzMax : (s.cable === 'hdmi' ? Math.min(s.hzMax, 144) : 60); s.hzWin = max; return 'Frecuencia cambiada a ' + max + ' Hz.'; } },
    { g: 'win', w: true, b: 'Jugar 15 minutos con el monitor de temperaturas (HWiNFO)', run: function (s) {
      if (!s.fuenteBuena || s.gpuAlim === 'molex') { s.modo = 'apagado'; return 'A los 9 minutos el equipo <b>se apaga de golpe</b>, sin pantallazo azul. Justo antes, la gráfica consumía 248 W y la línea de +12 V bajaba a 11,3 V.'; }
      if (s.vent === 'sacan' || s.filtro === 'sucio') return 'Procesador: <b>' + (s.vent === 'sacan' && s.filtro === 'sucio' ? 95 : 86) + ' °C</b> y bajando la frecuencia (thermal throttling). Ventiladores al máximo, mucho ruido.';
      return 'Todo estable: procesador a 72 °C, gráfica a 68 °C, ' + s.gpuW + ' W.'; } },
    { g: 'win', w: true, b: 'Abrir el Administrador de dispositivos', run: function (s) {
      var t = [];
      if (s.wifi) { t.push(s.wifi.driver ? 'Adaptadores de red: Intel Wi-Fi 6E AX210 (controlador del fabricante).' : 'Adaptadores de red: «Controlador de red genérico» con un aviso amarillo.'); t.push(s.wifi.usb ? 'Bluetooth: Intel Wireless Bluetooth.' : 'No aparece ningún dispositivo Bluetooth.'); }
      if (s.ssd) t.push(s.ssd.tipo === 'NVMe' ? 'Unidades de disco: SSD NVMe 1 TB.' : (s.ssd.ranura === 'M2_2' ? 'Unidades de disco: SSD SATA 1 TB.' : 'Unidades de disco: solo el disco del sistema.'));
      return t.length ? t.join(' ') : 'Todo correcto, sin avisos.'; } },
    { g: 'win', w: true, b: 'Instalar el controlador de la tarjeta Wi-Fi desde la web del fabricante', cond: function (s) { return !!s.wifi; }, run: function (s) { if (s.wifi.driver) return 'Ya tiene el último controlador del fabricante.'; s.wifi.driver = true; return 'Descargas e instalas el controlador de Wi-Fi y el de Bluetooth del fabricante.'; } },
    { g: 'win', w: true, b: 'Medir la señal Wi-Fi', cond: function (s) { return !!s.wifi; }, run: function (s) { return s.wifi.antenas ? 'Señal buena: −52 dBm, 1,2 Gbit/s.' : 'Señal muy débil: −84 dBm. La conexión se corta cada pocos minutos.'; } },
    { g: 'win', w: true, b: 'Mirar la fecha y la hora de Windows', run: function (s) { return s.pilaV < 2.5 && s.ajustesPerdidos ? 'Al arrancar marcaba 01/01/2009; Windows la ha corregido al conectarse a internet.' : 'Fecha y hora correctas.'; } },

    // --- documentación
    { g: 'doc', b: 'Consultar en el manual la tabla de pitidos', run: function (s) { return 'BIOS ' + s.bios + ': 1 corto = POST correcto · 1 largo y 3 cortos = error de <b>memoria</b> · 1 largo y 8 cortos = error de <b>vídeo</b>. (Cada fabricante tiene su tabla.)'; } },
    { g: 'doc', b: 'Consultar en el manual los LED de diagnóstico', run: function () { return 'CPU: procesador no detectado o firmware dañado · DRAM: memoria no detectada o no funciona · VGA: tarjeta gráfica no detectada · BOOT: no hay dispositivo de arranque.'; } },
    { g: 'doc', b: 'Consultar en el manual las ranuras M.2', run: function (s) { return 'M2_1 (del procesador): <b>solo PCIe 4.0 x4</b> (NVMe). M2_2 (del chipset): <b>PCIe 4.0 x4 y SATA</b>.'; } },
    { g: 'doc', b: 'Consultar la lista de memorias compatibles (QVL)', run: function (s) { return s.ramQVL ? 'Los módulos están en la lista.' : 'Los módulos 2 × 16 GB DDR5-6400 <b>no están</b> en la QVL de esta placa. Los kits de 6000 MT/s de la misma marca sí.'; } },
    { g: 'doc', b: 'Consultar en el manual cómo se usa BIOS FlashBack', cond: function (s) { return /ROG|ASUS/.test(s.placa); }, run: function () { return 'Descarga la BIOS de tu modelo exacto, renómbrala con la herramienta de ASUS, cópiala a un USB en FAT32, ponlo en el puerto marcado, con la fuente enchufada y el equipo apagado, y mantén pulsado el botón 3 segundos.'; } }
  ];

  // ------------------------------------------------------------ interfaz
  function montar(raiz) {
    var s, encargo, pruebas, avisos, inicio, registro = [];

    raiz.innerHTML = '';
    var cab = el('div', { class: 'sim-cab' });
    var sel = el('select', { 'aria-label': 'Encargo' });
    ENCARGOS.forEach(function (e, i) { sel.appendChild(el('option', { value: i }, e.id + ' · ' + e.t)); });
    var bSorpresa = el('button', { type: 'button', class: 'sec' }, 'Encargo sorpresa');
    var reloj = el('span', { class: 'sim-reloj' }, '0:00');
    cab.appendChild(el('label', null, 'Encargo: ')); cab.lastChild.appendChild(sel);
    cab.appendChild(bSorpresa); cab.appendChild(reloj);
    raiz.appendChild(cab);

    var ficha = el('div', { class: 'sim-ficha' });
    raiz.appendChild(ficha);

    var panel = el('div', { class: 'sim-panel' });
    var leds = el('div', { class: 'sim-leds', 'aria-label': 'LED de diagnóstico de la placa' });
    ['CPU', 'DRAM', 'VGA', 'BOOT'].forEach(function (n) { leds.appendChild(el('span', { 'data-led': n }, n)); });
    var pantalla = el('div', { class: 'sim-pantalla', 'aria-live': 'polite' }, '');
    var altavoz = el('div', { class: 'sim-altavoz' }, '');
    var estado = el('div', { class: 'sim-estado' });
    var botones = el('div', { class: 'sim-botones' });
    var bEnchufe = el('button', { type: 'button' });
    var bEncender = el('button', { type: 'button' }, 'Encender');
    var bUefi = el('button', { type: 'button' }, 'Encender pulsando Supr (entrar en la UEFI)');
    var bApagar = el('button', { type: 'button', class: 'sec' }, 'Apagar');
    var bF1 = el('button', { type: 'button', class: 'sec' }, 'Pulsar F1');
    [bEnchufe, bEncender, bUefi, bApagar, bF1].forEach(function (b) { botones.appendChild(b); });
    panel.appendChild(el('div', { class: 'sim-monitor' })); panel.lastChild.appendChild(el('span', { class: 'sim-etq' }, 'Monitor')); panel.lastChild.appendChild(pantalla);
    var lado = el('div', { class: 'sim-lado' });
    lado.appendChild(el('span', { class: 'sim-etq' }, 'Placa base')); lado.appendChild(leds);
    lado.appendChild(el('span', { class: 'sim-etq' }, 'Altavoz')); lado.appendChild(altavoz);
    lado.appendChild(estado);
    panel.appendChild(lado);
    raiz.appendChild(panel);
    raiz.appendChild(botones);

    var zonaAcc = el('div', { class: 'sim-acciones' });
    raiz.appendChild(zonaAcc);

    var res = el('div', { class: 'sim-resultado', 'aria-live': 'polite' });
    raiz.appendChild(res);

    var pie = el('div', { class: 'sim-pie' });
    var bComprobar = el('button', { type: 'button' }, 'Comprobar si la avería está resuelta');
    var bCopiar = el('button', { type: 'button', class: 'sec' }, 'Copiar el registro para el informe');
    pie.appendChild(bComprobar); pie.appendChild(bCopiar);
    raiz.appendChild(pie);
    var reg = el('ol', { class: 'sim-registro' });
    raiz.appendChild(el('h4', null, 'Registro de pruebas')); raiz.appendChild(reg);

    function apunta(accion, resultado, tipo) {
      pruebas++;
      registro.push({ n: pruebas, t: mmss(Date.now() - inicio), a: accion, r: resultado.replace(/<[^>]+>/g, '') });
      var li = el('li', tipo ? { class: tipo } : null, '<span class="sim-t">' + mmss(Date.now() - inicio) + '</span> <b>' + accion + '</b> → ' + resultado);
      reg.appendChild(li);
      res.innerHTML = '<b>' + accion + '</b><br>' + resultado;
    }

    function pinta() {
      bEnchufe.textContent = s.enchufado ? 'Desenchufar' : 'Enchufar';
      var encendido = s.modo !== 'apagado';
      bEncender.disabled = encendido; bUefi.disabled = encendido; bApagar.disabled = !encendido;
      bF1.hidden = s.modo !== 'aviso-cmos';
      estado.innerHTML = 'Equipo <b>' + (s.enchufado ? 'enchufado' : 'desenchufado') + '</b> · ' +
        ({ apagado: 'apagado', 'post-fallo': 'encendido, sin pasar el POST', 'sin-imagen': 'encendido, sin imagen', uefi: 'en la UEFI', windows: 'en Windows', 'sin-arranque': 'sin sistema de arranque', 'aviso-cmos': 'esperando una tecla' })[s.modo] +
        ' · ' + pruebas + ' pruebas' + (avisos ? ' · <span class="sim-aviso">' + avisos + ' aviso(s) de seguridad</span>' : '');
      if (s.modo === 'apagado') { pantalla.textContent = '(apagado)'; altavoz.textContent = ''; Array.prototype.forEach.call(leds.children, function (l) { l.className = ''; }); }
      zonaAcc.innerHTML = '';
      GRUPOS.forEach(function (g) {
        var lista = ACCIONES.filter(function (a) { return a.g === g[0] && (!a.cond || a.cond(s)); });
        if (!lista.length) return;
        var det = el('details', { class: 'sim-grupo' }); det.open = true;
        var ayuda = { dentro: ' (desenchufa antes)', uefi: ' (solo dentro de la UEFI)', win: ' (solo con Windows arrancado)' }[g[0]] || '';
        det.appendChild(el('summary', null, g[1] + '<small>' + ayuda + '</small>'));
        lista.forEach(function (a) {
          var b = el('button', { type: 'button', class: 'sim-acc' }, a.b);
          if (a.u && s.modo !== 'uefi') b.disabled = true;
          if (a.w && s.modo !== 'windows') b.disabled = true;
          b.addEventListener('click', function () { hacer(a); });
          det.appendChild(b);
        });
        zonaAcc.appendChild(det);
      });
    }

    function muestraPost(p) {
      Array.prototype.forEach.call(leds.children, function (l) { l.className = l.getAttribute('data-led') === p.led ? 'on' : ''; });
      pantalla.textContent = p.pan; altavoz.textContent = p.pit ? '🔊 ' + p.pit : '';
    }

    function encender(uefi) {
      if (!s.enchufado) { apunta('Encender', 'No pasa nada: el equipo está desenchufado.'); pinta(); return; }
      var p = post(s); muestraPost(p);
      if (p.fin === 'post-fallo' || p.fin === 'sin-imagen') { s.modo = p.fin; apunta(uefi ? 'Encender pulsando Supr' : 'Encender', p.txt); pinta(); return; }
      if (p.fin === 'aviso-cmos') { s.modo = 'aviso-cmos'; s.extra.trasF1 = uefi ? 'uefi' : 'win'; apunta(uefi ? 'Encender pulsando Supr' : 'Encender', p.txt); pinta(); return; }
      sigue(uefi ? 'uefi' : 'win', p.txt, uefi ? 'Encender pulsando Supr' : 'Encender');
    }
    function sigue(destino, txt, accion) {
      if (destino === 'uefi') { s.modo = 'uefi'; pantalla.textContent = 'UEFI · modo avanzado'; apunta(accion, txt + ' Entras en la UEFI.'); }
      else if (arrancaWindows(s)) { s.modo = 'windows'; pantalla.textContent = 'Escritorio de Windows'; apunta(accion, txt + ' Arranca Windows.'); }
      else { s.modo = 'sin-arranque'; Array.prototype.forEach.call(leds.children, function (l) { l.className = l.getAttribute('data-led') === 'BOOT' ? 'on' : ''; }); pantalla.textContent = 'Reboot and Select proper Boot device'; apunta(accion, txt + ' Se enciende el LED BOOT y aparece «Reboot and Select proper Boot device».'); }
      pinta();
    }

    function hacer(a) {
      if (a.i) {
        if (s.enchufado || s.modo !== 'apagado') { avisos++; apunta(a.b, '⚠️ <b>Peligro:</b> el equipo está ' + (s.modo !== 'apagado' ? 'encendido' : 'enchufado') + '. Apágalo y desenchúfalo antes de tocar dentro. No se ha hecho nada.', 'sim-mal'); pinta(); return; }
      }
      var r = a.run(s);
      apunta(a.b, r);
      if (s.modo === 'apagado') muestraPost({ led: null, pit: '', pan: '(apagado)' });
      pinta();
    }

    function nuevo(i) {
      encargo = ENCARGOS[i]; sel.value = i;
      s = base(); Object.keys(encargo.ini).forEach(function (k) { s[k] = copia(encargo.ini[k]); });
      s.extra = copia(encargo.ini.extra || {});
      pruebas = 0; avisos = 0; inicio = Date.now(); registro = [];
      reg.innerHTML = ''; res.innerHTML = 'Empieza escuchando al cliente. Luego enciende el equipo o haz las pruebas que creas oportunas.';
      ficha.innerHTML = '<p><strong>' + encargo.id + '.</strong> ' + encargo.cliente + '</p><p class="meta">' + encargo.equipo + '</p>';
      pinta();
    }

    bEnchufe.addEventListener('click', function () {
      if (s.enchufado && s.modo !== 'apagado') { s.modo = 'apagado'; apunta('Desenchufar', 'Has desenchufado el equipo encendido: se apaga de golpe. Mejor apagarlo antes.'); }
      s.enchufado = !s.enchufado; if (!s.enchufado) apunta('Desenchufar', 'Equipo desenchufado. Ya puedes trabajar dentro (con la pulsera antiestática).'); else apunta('Enchufar', 'Equipo enchufado.');
      pinta();
    });
    bEncender.addEventListener('click', function () { encender(false); });
    bUefi.addEventListener('click', function () { encender(true); });
    bApagar.addEventListener('click', function () { s.modo = 'apagado'; apunta('Apagar', 'Equipo apagado.'); pinta(); });
    bF1.addEventListener('click', function () { var d = s.extra.trasF1; sigue(d === 'uefi' ? 'uefi' : 'win', 'Pulsas F1: carga los valores por defecto.', 'Pulsar F1'); });
    sel.addEventListener('change', function () { nuevo(+sel.value); });
    bSorpresa.addEventListener('click', function () { nuevo(Math.floor(Math.random() * ENCARGOS.length)); });
    bComprobar.addEventListener('click', function () {
      var ok = encargo.ok(s);
      var arrancado = s.modo === 'windows' || s.modo === 'uefi';
      if (ok && !arrancado && encargo.id !== 'AV-11') { res.innerHTML = 'Puede que esté arreglado, pero <b>compruébalo</b>: enciende el equipo y verifica que el síntoma ha desaparecido.'; return; }
      if (ok && encargo.id === 'AV-11' && !(s.gpuNueva && s.gpuNueva.instalada)) ok = false;
      res.innerHTML = ok ? '✅ <b>Avería resuelta</b> en ' + pruebas + ' pruebas y ' + mmss(Date.now() - inicio) + (avisos ? ', con ' + avisos + ' aviso(s) de seguridad' : '') + '. Ahora haz el informe: copia el registro.'
        : '❌ Todavía no está resuelta. Revisa el síntoma del cliente y sigue probando.';
      registro.push({ n: '✔', t: mmss(Date.now() - inicio), a: 'Comprobación final', r: ok ? 'Resuelta' : 'No resuelta' });
    });
    bCopiar.addEventListener('click', function () {
      var txt = 'Encargo ' + encargo.id + ' · ' + encargo.t + '\nPruebas: ' + pruebas + ' · Tiempo: ' + mmss(Date.now() - inicio) + ' · Avisos de seguridad: ' + avisos + '\n' +
        registro.map(function (r) { return r.n + '. [' + r.t + '] ' + r.a + ' → ' + r.r; }).join('\n');
      var hecho = function () { bCopiar.textContent = 'Copiado ✓'; setTimeout(function () { bCopiar.textContent = 'Copiar el registro para el informe'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(hecho, function () { prompt('Copia el registro:', txt); });
      else prompt('Copia el registro:', txt);
    });

    var t = setInterval(function () { if (inicio) reloj.textContent = '⏱ ' + mmss(Date.now() - inicio); }, 1000);
    nuevo(0);
    return t;
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-simulador-post]'), montar);
  });
  window.SIM_POST = { ENCARGOS: ENCARGOS, post: post };
})();
