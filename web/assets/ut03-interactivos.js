/* Piezas interactivas del tema 3 de 0221. Sin dependencias.
   Cada pieza se activa con data-widget="…":
     placa · cpu-nombre · ram · pcie · monitor
   Los cuestionarios y el «clasifica» los pone en marcha ut02-interactivos.js. */
(function () {
  'use strict';

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (text !== undefined) e.textContent = text;
    return e;
  }
  var NS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function num(v, d) { return v.toLocaleString('es-ES', { maximumFractionDigits: d === undefined ? 1 : d, minimumFractionDigits: 0 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ================================================================ placa */
  /* Coordenadas en milímetros sobre una placa ATX de 305 × 244 mm, vista con el panel trasero a la izquierda. */
  var ZONAS = [
    { id: 'socket', n: 'Zócalo (socket) del procesador', ce: 'c', f: [['r', 58, 36, 54, 54]], t: 'Donde se instala el microprocesador. Cada familia de procesadores usa un zócalo concreto: un procesador solo encaja en su zócalo (LGA 1700, LGA 1851, AM4, AM5…).', v: 'Cuadrado grande cerca del centro-arriba, con una palanca y una tapa metálica de retención (LGA) o una rejilla de agujeros (PGA).' },
    { id: 'vrm', n: 'VRM y sus disipadores', ce: 'e', f: [['r', 26, 28, 14, 74], ['r', 40, 16, 72, 13]], t: 'Módulo regulador de tensión: convierte los 12 V de la fuente en la tensión baja que necesita el procesador (alrededor de 1 V). Un buen VRM es clave para procesadores de mucho consumo y para el overclocking.', v: 'Bloques de aluminio con aletas en forma de L alrededor del zócalo. Debajo hay bobinas (fases) y transistores.' },
    { id: 'eps', n: 'Conector EPS de 12 V (CPU)', ce: 'e', f: [['r', 24, 3, 20, 9]], t: 'Alimentación del procesador: 4+4 u 8 pines, solo 12 V. Sin él la placa no arranca. Las placas para procesadores potentes traen dos (8 + 4 u 8 + 8).', v: 'Arriba a la izquierda, junto al VRM. Rotulado CPU_PWR, ATX12V o EPS.' },
    { id: 'cpufan', n: 'Conector CPU_FAN', ce: 'd', f: [['r', 118, 18, 11, 5]], t: 'Conector de 4 pines para el ventilador del disipador del procesador. Muchas placas no arrancan o avisan si no detectan un ventilador conectado aquí. Puede haber otro CPU_OPT para un segundo ventilador.', v: 'Cerca del zócalo, rotulado CPU_FAN.' },
    { id: 'ram', n: 'Ranuras de memoria (DIMM)', ce: 'e', f: [['r', 137, 8, 5, 135], ['r', 146, 8, 5, 135], ['r', 155, 8, 5, 135], ['r', 164, 8, 5, 135]], t: 'Cuatro ranuras para dos canales (A y B), dos ranuras por canal. Con dos módulos se colocan normalmente en A2 y B2: el manual lo indica. DDR4 y DDR5 tienen la muesca en sitios distintos: no se pueden mezclar.', v: 'Ranuras largas y paralelas a la derecha del zócalo, con pestañas en los extremos.' },
    { id: 'atx24', n: 'Conector ATX de 24 pines', ce: 'e', f: [['r', 290, 55, 11, 56]], t: 'Alimentación principal de la placa: 3,3 V, 5 V y 12 V. Antiguamente era de 20 pines; por eso muchas fuentes lo traen como 20+4.', v: 'Conector grande en el borde derecho, a la altura de las ranuras de memoria.' },
    { id: 'debug', n: 'LED de diagnóstico (Q-LED)', ce: 'f', f: [['r', 275, 30, 7, 22]], t: 'Cuatro luces (CPU, DRAM, VGA, BOOT) que se quedan encendidas en el paso del POST que falla. Algunas placas tienen además un visor de dos cifras con códigos (Q-Code) que se buscan en el manual.', v: 'Pequeños LED junto al borde derecho, rotulados CPU, DRAM, VGA y BOOT.' },
    { id: 'usb3', n: 'Conector USB 3.x interno (19 pines)', ce: 'e', f: [['r', 291, 118, 9, 22]], t: 'Para los USB-A de 5 Gbit/s del panel frontal de la caja. Cada conector da servicio a dos puertos. Tiene una muesca para no ponerlo al revés.', v: 'Conector azul de dos filas, rotulado USB3 o USB3_1.' },
    { id: 'usbc', n: 'Conector USB-C interno (panel frontal)', ce: 'e', f: [['r', 268, 140, 12, 8]], t: 'Para el USB-C del panel frontal (10 o 20 Gbit/s). Es pequeño y de un solo puerto. Si la caja tiene USB-C y la placa no tiene este conector, el puerto frontal no funcionará.', v: 'Conector pequeño y plano, rotulado USB_C o U32G2_C.' },
    { id: 'chipset', n: 'Chipset (PCH)', ce: 'e', f: [['r', 200, 150, 36, 36]], t: 'Chip que añade conexiones a las que da el procesador: más carriles PCIe, puertos SATA, USB, red y sonido. Se comunica con la CPU por un enlace rápido (DMI en Intel, PCIe en AMD). Su gama (Z, B, H en Intel; X, B, A en AMD) decide qué permite la placa.', v: 'Disipador plano, a menudo con el logotipo de la placa, abajo a la derecha.' },
    { id: 'sata', n: 'Puertos SATA', ce: 'e', f: [['r', 289, 152, 12, 8], ['r', 289, 163, 12, 8], ['r', 289, 174, 12, 8], ['r', 289, 185, 12, 8]], t: 'Para discos duros, SSD de 2,5″ y unidades ópticas: 6 Gbit/s (unos 600 MB/s). Ojo: al usar ciertas ranuras M.2 se pueden desactivar algunos SATA. El manual dice cuáles.', v: 'Conectores en forma de L en el borde derecho, a menudo tumbados en grupos.' },
    { id: 'pcie16', n: 'Ranura PCIe x16 (a la CPU)', ce: 'j', f: [['r', 36, 120, 89, 8]], t: 'La ranura principal, conectada directamente al procesador con 16 carriles. Es la de la tarjeta gráfica. Suele estar reforzada con metal y tener un cierre en el extremo.', v: 'La ranura larga más cercana al zócalo.' },
    { id: 'pcie1', n: 'Ranura PCIe x1', ce: 'j', f: [['r', 36, 140, 25, 8]], t: 'Ranura corta para tarjetas que necesitan poco ancho de banda: red, Wi-Fi, sonido, controladoras USB.', v: 'Ranura muy corta entre las largas.' },
    { id: 'pcie4', n: 'Ranura PCIe x16 física, x4 eléctrica (chipset)', ce: 'j', f: [['r', 36, 176, 89, 8]], t: 'Tiene el tamaño de una x16 pero solo 4 carriles conectados (lo pone el manual o la serigrafía: «PCIEX16 (x4)»). Va al chipset. Sirve para una segunda tarjeta, pero no es buena idea poner aquí la gráfica.', v: 'Ranura larga en la parte baja; la serigrafía indica el modo real.' },
    { id: 'm2a', n: 'Ranura M.2 (a la CPU)', ce: 'e', f: [['r', 46, 98, 80, 10]], t: 'Ranura para SSD NVMe pequeños (tarjetas 2280: 22 × 80 mm). La primera suele ir a la CPU con 4 carriles PCIe 4.0 o 5.0. Lleva un tornillo o pestaña al final y a veces un disipador.', v: 'Zona plana con un conector pequeño en un extremo y un tornillo a 80 mm, a menudo tapada por un disipador.' },
    { id: 'm2b', n: 'Ranura M.2 (al chipset)', ce: 'e', f: [['r', 46, 153, 80, 10]], t: 'Otra ranura M.2, conectada al chipset. Puede compartir carriles con puertos SATA o con una ranura PCIe: si la usas, algo se desactiva. Compruébalo en el manual.', v: 'Igual que la anterior, más abajo.' },
    { id: 'bios', n: 'Chip de la BIOS/UEFI', ce: 'f', f: [['r', 139, 186, 12, 8]], t: 'Memoria flash donde se guarda el firmware de la placa (BIOS/UEFI). Se puede actualizar. Algunas placas tienen dos (Dual BIOS) para recuperarse de una actualización fallida.', v: 'Chip pequeño de 8 patas, a veces con una pegatina con la versión.' },
    { id: 'pila', n: 'Pila CR2032', ce: 'f', f: [['c', 168, 160, 10]], t: 'Alimenta el reloj de la placa y la memoria donde se guardan los ajustes (CMOS/NVRAM) cuando el equipo está desenchufado. Si se agota, la hora se desajusta y se pueden perder los ajustes. No borra el firmware.', v: 'Pila de botón plateada en un soporte redondo.' },
    { id: 'clrcmos', n: 'Puente CLR_CMOS', ce: 'f', f: [['r', 180, 200, 9, 5]], t: 'Dos o tres pines que, al puentearlos con la placa desenchufada, borran los ajustes de la BIOS y vuelven a los de fábrica. Útil si el equipo no arranca tras cambiar un ajuste. Algunas placas tienen un botón en el panel trasero.', v: 'Pines rotulados CLR_CMOS, CLRTC o JBAT1.' },
    { id: 'audio', n: 'Códec de sonido y conector HD_AUDIO', ce: 'j', f: [['r', 6, 196, 14, 14], ['r', 6, 230, 16, 8]], t: 'El códec convierte el sonido digital en analógico (sonido integrado). El conector HD_AUDIO lleva el sonido a los jacks del panel frontal de la caja.', v: 'Chip cuadrado en la esquina inferior izquierda, a menudo en una zona separada de la placa. El conector está en el borde inferior.' },
    { id: 'usb2', n: 'Conector USB 2.0 interno (9 pines)', ce: 'e', f: [['r', 150, 230, 15, 8]], t: 'Para USB 2.0 del panel frontal o dispositivos internos (lectores de tarjetas, receptores de RGB). Diez posiciones con un pin que falta. Cada conector da dos puertos.', v: 'Bloque de 2 × 5 pines en el borde inferior, rotulado USB o F_USB.' },
    { id: 'tpm', n: 'Conector TPM', ce: 'f', f: [['r', 122, 230, 14, 8]], t: 'Para un módulo TPM externo. Hoy casi todos los procesadores llevan TPM por firmware (PTT en Intel, fTPM en AMD), que se activa en la UEFI. Windows 11 exige TPM 2.0.', v: 'Bloque de pines en el borde inferior rotulado TPM o SPI_TPM.' },
    { id: 'argb', n: 'Conectores RGB (12 V) y ARGB (5 V)', ce: 'e', f: [['r', 100, 232, 9, 6], ['r', 86, 232, 11, 6]], t: 'Iluminación. RGB: 4 pines, 12 V, todo un color a la vez. ARGB (direccionable): 3 pines, 5 V, cada LED de un color. ¡No los confundas! Conectar un ARGB a 12 V lo quema.', v: 'Conectores pequeños en los bordes rotulados RGB_HEADER (4 pines) y ARGB o ADD_GEN2 (3 pines).' },
    { id: 'sysfan', n: 'Conectores SYS_FAN / CHA_FAN', ce: 'd', f: [['r', 228, 232, 10, 6], ['r', 289, 18, 11, 5]], t: 'Para los ventiladores de la caja. Los de 4 pines permiten control PWM; la velocidad se ajusta con curvas en la UEFI o con un programa del fabricante.', v: 'Conectores de 4 pines repartidos por los bordes, rotulados SYS_FAN o CHA_FAN.' },
    { id: 'fpanel', n: 'Panel frontal (F_PANEL)', ce: 'e', f: [['r', 252, 230, 16, 8]], t: 'Aquí se conectan el botón de encendido, el de reset y los LED de encendido y de disco de la caja. Los LED tienen polaridad (+/–); los botones no. El orden de los pines cambia entre fabricantes: mira la serigrafía o el manual.', v: 'Bloque de 2 × 5 pines en la esquina inferior derecha, rotulado F_PANEL o JFP1.' },
    { id: 'io', n: 'Panel trasero de E/S', ce: 'e', f: [['r', 0, 6, 22, 116]], t: 'Los conectores que se ven por detrás de la caja: USB, red, audio, salidas de vídeo de la gráfica integrada, antenas Wi-Fi y, a veces, botones de BIOS Flashback o Clear CMOS.', v: 'Columna de conectores en el borde izquierdo, cubierta por una chapa (embellecedor o I/O shield).' }
  ];
  var CE_TEXTO = { c: 'CE c · microprocesador', d: 'CE d · refrigeración', e: 'CE e · placa base', f: 'CE f · BIOS/UEFI', j: 'CE j · adaptadores' };

  function placa(raiz) {
    var escala = 2;
    var modo = 'explorar', objetivo = null, aciertos = 0, intentos = 0;
    var barra = el('div', { class: 'placa-modos', role: 'group', 'aria-label': 'Modo' });
    var bExp = el('button', { type: 'button', 'aria-pressed': 'true' }, 'Explorar');
    var bJuego = el('button', { type: 'button', 'aria-pressed': 'false' }, 'Encuéntralo');
    barra.appendChild(bExp); barra.appendChild(bJuego);
    var reto = el('p', { class: 'placa-reto', 'aria-live': 'polite', hidden: '' });
    var zona = el('div', { class: 'placa-zona' });
    var dib = svg('svg', { viewBox: '-4 -4 ' + (305 * escala + 8) + ' ' + (244 * escala + 8), class: 'placa-svg', role: 'group', 'aria-label': 'Placa base ATX esquemática. Pulsa cada componente.' });
    dib.appendChild(svg('rect', { x: 0, y: 0, width: 305 * escala, height: 244 * escala, rx: 8, class: 'placa-pcb' }));
    [[8, 160], [30, 228], [180, 10], [130, 206], [296, 8], [296, 212], [240, 120]].forEach(function (p) {
      dib.appendChild(svg('circle', { cx: p[0] * escala, cy: p[1] * escala, r: 5, class: 'placa-agujero' }));
    });
    var grupos = {};
    ZONAS.forEach(function (z) {
      var g = svg('g', { class: 'placa-pieza pieza-' + z.id, tabindex: '0', role: 'button', 'aria-label': z.n, 'data-id': z.id });
      z.f.forEach(function (f) {
        if (f[0] === 'r') g.appendChild(svg('rect', { x: f[1] * escala, y: f[2] * escala, width: f[3] * escala, height: f[4] * escala, rx: 3 }));
        else g.appendChild(svg('circle', { cx: f[1] * escala, cy: f[2] * escala, r: f[3] * escala }));
      });
      g.appendChild(svg('title', {}, z.n));
      dib.appendChild(g);
      grupos[z.id] = g;
    });
    /* Detalles decorativos: CPU dentro del zócalo y etiquetas cortas */
    dib.appendChild(svg('rect', { x: 68 * escala, y: 46 * escala, width: 34 * escala, height: 34 * escala, rx: 4, class: 'placa-cpu' }));
    [['CPU', 85, 66], ['DIMM', 153, 150], ['PCIe x16', 80, 116], ['PCIe x1', 48, 137], ['M.2', 86, 106], ['M.2', 86, 161], ['PCIe x16 (x4)', 80, 192], ['Chipset', 218, 171], ['ATX 24', 279, 116], ['SATA', 295, 201], ['E/S', 11, 127]].forEach(function (t) {
      dib.appendChild(svg('text', { x: t[1] * escala, y: t[2] * escala, class: 'placa-texto', 'text-anchor': 'middle' }, t[0]));
    });
    zona.appendChild(dib);
    var info = el('div', { class: 'placa-info', 'aria-live': 'polite' });
    raiz.appendChild(barra); raiz.appendChild(reto);
    raiz.appendChild(el('p', { class: 'placa-desliza' }, 'Desliza la placa a los lados para verla entera.'));
    raiz.appendChild(zona); raiz.appendChild(info);

    function mostrar(z) {
      Object.keys(grupos).forEach(function (k) { grupos[k].classList.toggle('activa', k === z.id); });
      info.innerHTML = '<p class="placa-ce">' + CE_TEXTO[z.ce] + '</p><h4>' + esc(z.n) + '</h4><p>' + esc(z.t) + '</p><p><strong>Cómo reconocerlo:</strong> ' + esc(z.v) + '</p>';
    }
    function nuevoReto() {
      var resto = ZONAS.filter(function (z) { return !objetivo || z.id !== objetivo.id; });
      objetivo = resto[Math.floor(Math.random() * resto.length)];
      reto.innerHTML = '¿Dónde está: <strong>' + esc(objetivo.n) + '</strong>? <span class="placa-marcador">' + aciertos + ' de ' + intentos + '</span>';
    }
    function pulsar(id) {
      var z = ZONAS.filter(function (x) { return x.id === id; })[0];
      if (modo === 'explorar') { mostrar(z); return; }
      intentos++;
      if (id === objetivo.id) {
        aciertos++; mostrar(z);
        info.insertAdjacentHTML('afterbegin', '<p class="placa-bien">✓ ¡Correcto!</p>');
        nuevoReto();
      } else {
        grupos[id].classList.add('fallo');
        setTimeout(function () { grupos[id].classList.remove('fallo'); }, 700);
        info.innerHTML = '<p class="placa-mal">✗ Eso es: ' + esc(z.n) + '. Sigue buscando.</p>';
        reto.querySelector('.placa-marcador').textContent = aciertos + ' de ' + intentos;
      }
    }
    dib.addEventListener('click', function (e) { var g = e.target.closest('.placa-pieza'); if (g) pulsar(g.getAttribute('data-id')); });
    dib.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('placa-pieza')) { e.preventDefault(); pulsar(e.target.getAttribute('data-id')); }
    });
    bExp.addEventListener('click', function () { modo = 'explorar'; bExp.setAttribute('aria-pressed', 'true'); bJuego.setAttribute('aria-pressed', 'false'); reto.hidden = true; mostrar(ZONAS[0]); });
    bJuego.addEventListener('click', function () {
      modo = 'juego'; aciertos = 0; intentos = 0; objetivo = null;
      bJuego.setAttribute('aria-pressed', 'true'); bExp.setAttribute('aria-pressed', 'false');
      reto.hidden = false; info.innerHTML = '<p>Pulsa el componente que se pide.</p>';
      Object.keys(grupos).forEach(function (k) { grupos[k].classList.remove('activa'); });
      nuevoReto();
    });
    mostrar(ZONAS[0]);
  }

  /* =========================================================== cpu-nombre */
  var SUFIJOS_INTEL = {
    '': ['Sin sufijo', 'Modelo de sobremesa estándar: multiplicador bloqueado y gráfica integrada.'],
    K: ['K', 'Multiplicador desbloqueado: permite overclocking (con placa Z). Trae gráfica integrada.'],
    KF: ['KF', 'Desbloqueado y sin gráfica integrada: necesita una tarjeta gráfica dedicada.'],
    KS: ['KS', 'Edición especial: los chips seleccionados con más frecuencia de su serie.'],
    F: ['F', 'Sin gráfica integrada: necesita una tarjeta gráfica dedicada. Suele ser algo más barato.'],
    T: ['T', 'Bajo consumo (35 W) para equipos pequeños y silenciosos.'],
    H: ['H', 'Portátil de alto rendimiento. Va soldado a la placa (BGA).'],
    HX: ['HX', 'Portátil de máximo rendimiento. Va soldado a la placa (BGA).'],
    HK: ['HK', 'Portátil de alto rendimiento desbloqueado. Va soldado (BGA).'],
    U: ['U', 'Portátil de bajo consumo. Va soldado (BGA).'],
    P: ['P', 'Portátil fino de consumo intermedio. Va soldado (BGA).'],
    V: ['V', 'Portátil de bajo consumo con la memoria dentro del propio procesador. Va soldado (BGA).']
  };
  var SUFIJOS_AMD = {
    '': ['Sin sufijo', 'Versión estándar, a menudo de menor consumo y frecuencia que la X.'],
    X: ['X', 'Más frecuencia y consumo que la versión sin X.'],
    X3D: ['X3D', 'Lleva caché 3D V-Cache (mucha más caché L3 apilada). Destaca en juegos.'],
    XT: ['XT', 'Revisión con algo más de frecuencia que la X.'],
    G: ['G', 'APU: gráfica integrada potente. Puede funcionar sin tarjeta gráfica dedicada.'],
    GT: ['GT', 'APU de gama ajustada con gráfica integrada.'],
    F: ['F', 'Sin gráfica integrada: necesita tarjeta gráfica dedicada.'],
    U: ['U', 'Portátil de bajo consumo. Va soldado (BGA).'],
    HS: ['HS', 'Portátil fino de alto rendimiento. Va soldado (BGA).'],
    H: ['H', 'Portátil de alto rendimiento. Va soldado (BGA).'],
    HX: ['HX', 'Portátil de máximo rendimiento. Va soldado (BGA).']
  };
  var PORTATIL = ['H', 'HX', 'HK', 'U', 'P', 'V', 'HS'];

  function decodificar(texto) {
    var t = texto.trim().replace(/\s+/g, ' ');
    var m, filas = [], socket = '', avisos = [];
    if ((m = /^(?:intel\s+)?core\s+i([3579])[\s-]?(\d{4,5})([a-z]{0,2})$/i.exec(t))) {
      var dig = m[2], gen = dig.length === 5 ? parseInt(dig.slice(0, 2), 10) : parseInt(dig[0], 10), suf = m[3].toUpperCase();
      filas.push(['Fabricante', 'Intel']);
      filas.push(['Gama', 'Core i' + m[1] + ' (' + { 3: 'básica', 5: 'media', 7: 'media-alta', 9: 'alta' }[m[1]] + ')']);
      filas.push(['Generación', gen + '.ª generación (las primeras cifras del número: ' + (dig.length === 5 ? dig.slice(0, 2) : dig[0]) + ')']);
      filas.push(['Modelo (SKU)', (dig.length === 5 ? dig.slice(2) : dig.slice(1)) + ': dentro de la misma gama, número más alto = más rendimiento']);
      if (!(suf in SUFIJOS_INTEL)) return { error: 'No reconozco el sufijo «' + suf + '».' };
      filas.push(['Sufijo', SUFIJOS_INTEL[suf][0] + ': ' + SUFIJOS_INTEL[suf][1]]);
      if (PORTATIL.indexOf(suf) >= 0) socket = 'BGA: soldado a la placa del portátil, no se puede cambiar.';
      else if (gen >= 12 && gen <= 14) socket = 'LGA 1700 (placas con chipset de las series 600 o 700). Según la placa, DDR4 o DDR5.';
      else if (gen >= 10 && gen <= 11) socket = 'LGA 1200 (chipsets series 400 y 500), DDR4.';
      else if (gen >= 8 && gen <= 9) socket = 'LGA 1151 (chipsets serie 300), DDR4.';
      else socket = 'Generación antigua: busca su zócalo en la ficha del fabricante.';
      if (gen > 14) avisos.push('Intel no lanzó «Core i» de ' + gen + '.ª generación: desde 2023 se llaman Core Ultra o Core 3/5/7.');
    } else if ((m = /^(?:intel\s+)?core\s+ultra\s+([579])\s+(\d)(\d{2})([a-z]{0,2})$/i.exec(t))) {
      var serie = parseInt(m[2], 10), sufU = m[4].toUpperCase();
      filas.push(['Fabricante', 'Intel']);
      filas.push(['Gama', 'Core Ultra ' + m[1] + ' (' + { 5: 'media', 7: 'media-alta', 9: 'alta' }[m[1]] + ')']);
      filas.push(['Serie', 'Serie ' + serie + ' (la primera cifra del número). Con el nombre «Core Ultra», Intel cambió la numeración en 2023.']);
      filas.push(['Modelo (SKU)', m[3] + ': más alto = más rendimiento dentro de la gama']);
      if (!(sufU in SUFIJOS_INTEL)) return { error: 'No reconozco el sufijo «' + sufU + '».' };
      filas.push(['Sufijo', SUFIJOS_INTEL[sufU][0] + ': ' + SUFIJOS_INTEL[sufU][1]]);
      if (PORTATIL.indexOf(sufU) >= 0 || serie === 1 || serie === 3) socket = 'BGA: procesador de portátil, soldado a la placa.';
      else if (serie === 2) socket = 'LGA 1851 (placas con chipset serie 800: Z890, B860, H810). Solo DDR5.';
      else socket = 'Generación posterior: consulta su zócalo en la ficha de Intel (las siguientes de sobremesa usan LGA 1954).';
    } else if ((m = /^(?:amd\s+)?ryzen\s+([3579])\s+(\d)(\d)(\d{2})(x3d|xt|x|gt|g|f|u|hs|hx|h)?$/i.exec(t))) {
      var s = parseInt(m[2], 10), sufA = (m[5] || '').toUpperCase();
      filas.push(['Fabricante', 'AMD']);
      filas.push(['Gama', 'Ryzen ' + m[1] + ' (' + { 3: 'básica', 5: 'media', 7: 'media-alta', 9: 'alta' }[m[1]] + ')']);
      filas.push(['Serie', s + '000 (primera cifra). Cada serie suele traer arquitectura nueva: 5000 = Zen 3, 7000 = Zen 4, 9000 = Zen 5. La serie 8000 de sobremesa es Zen 4, casi toda con gráfica integrada potente (G).']);
      filas.push(['Segmento', m[3] + ' (segunda cifra): 1–3 básico, 4–6 medio, 7–9 alto']);
      filas.push(['Sufijo', SUFIJOS_AMD[sufA][0] + ': ' + SUFIJOS_AMD[sufA][1]]);
      if (PORTATIL.indexOf(sufA) >= 0) socket = 'BGA: procesador de portátil, soldado a la placa.';
      else if (s <= 5) socket = 'AM4 (PGA, pines en el procesador). DDR4. Chipsets A320 a X570.';
      else if (s >= 7 && s <= 9) socket = 'AM5 (LGA 1718, contactos en la placa). Solo DDR5. Chipsets A620, B650, X670, B850, X870…';
      else socket = 'Consulta la ficha de AMD.';
    } else {
      return { error: 'No lo reconozco. Prueba con un nombre como «Core i5-14400F», «Core Ultra 7 265K» o «Ryzen 7 7800X3D». Los nombres de portátil nuevos (Ryzen AI, Core Ultra serie 3) siguen otras reglas.' };
    }
    return { filas: filas, socket: socket, avisos: avisos };
  }

  function cpuNombre(raiz) {
    var form = el('form', { class: 'cpu-form' });
    var lab = el('label', { for: 'cpu-nombre-campo' }, 'Nombre del procesador');
    var campo = el('input', { id: 'cpu-nombre-campo', type: 'text', value: 'Core i5-14600KF', autocomplete: 'off', spellcheck: 'false' });
    var b = el('button', { type: 'submit' }, 'Descifrar');
    form.appendChild(lab); form.appendChild(campo); form.appendChild(b);
    var ej = el('p', { class: 'cpu-ejemplos' }, 'Ejemplos: ');
    ['Core i3-12100F', 'Core i7-14700K', 'Core Ultra 5 245K', 'Ryzen 5 7600', 'Ryzen 7 7800X3D', 'Ryzen 5 8600G', 'Ryzen 5 5600', 'Core i7-13700H'].forEach(function (n) {
      var x = el('button', { type: 'button', class: 'sec' }, n);
      x.addEventListener('click', function () { campo.value = n; pintar(); });
      ej.appendChild(x);
    });
    var salida = el('div', { class: 'cpu-salida', 'aria-live': 'polite' });
    raiz.appendChild(form); raiz.appendChild(ej); raiz.appendChild(salida);
    function pintar() {
      var r = decodificar(campo.value);
      if (r.error) { salida.innerHTML = '<p class="cpu-error-txt">' + esc(r.error) + '</p>'; return; }
      salida.innerHTML = '<dl>' + r.filas.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') +
        '<dt>Zócalo</dt><dd>' + esc(r.socket) + '</dd></dl>' + r.avisos.map(function (a) { return '<p class="cpu-error-txt">' + esc(a) + '</p>'; }).join('');
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); pintar(); });
    pintar();
  }

  /* ================================================================== ram */
  function ram(raiz) {
    raiz.insertAdjacentHTML('beforeend',
      '<div class="calc-grid">' +
      '<label>Tipo <select data-k="tipo"><option value="DDR4">DDR4</option><option value="DDR5" selected>DDR5</option></select></label>' +
      '<label>Velocidad (MT/s) <input data-k="mts" type="number" min="800" max="12000" step="100" value="6000" inputmode="numeric"></label>' +
      '<label>Latencia CAS (CL) <input data-k="cl" type="number" min="5" max="60" value="30" inputmode="numeric"></label>' +
      '<label>Canales <select data-k="canales"><option value="1">1 (un módulo)</option><option value="2" selected>2 (dual channel)</option><option value="4">4 (quad channel, estaciones de trabajo)</option></select></label>' +
      '</div><div class="calc-salida" aria-live="polite"></div>' +
      '<p class="calc-ejemplos">Compara: <button type="button" class="sec" data-ej="DDR4,2666,19">DDR4-2666 CL19</button> <button type="button" class="sec" data-ej="DDR4,3200,16">DDR4-3200 CL16</button> <button type="button" class="sec" data-ej="DDR5,4800,40">DDR5-4800 CL40</button> <button type="button" class="sec" data-ej="DDR5,6000,30">DDR5-6000 CL30</button> <button type="button" class="sec" data-ej="DDR5,7200,36">DDR5-7200 CL36</button></p>');
    var q = function (s) { return raiz.querySelector(s); };
    function pintar() {
      var mts = parseFloat(q('[data-k=mts]').value), cl = parseFloat(q('[data-k=cl]').value), can = parseInt(q('[data-k=canales]').value, 10), tipo = q('[data-k=tipo]').value;
      if (!(mts > 0 && cl > 0)) return;
      var mhz = mts / 2, ns = cl * 2000 / mts, gbs = mts * 8 * can / 1000;
      q('.calc-salida').innerHTML =
        '<p><strong>Frecuencia real del reloj:</strong> ' + num(mhz, 0) + ' MHz. Es DDR: hace dos transferencias por ciclo, por eso se anuncia como ' + tipo + '-' + num(mts, 0) + '.</p>' +
        '<p><strong>Latencia real:</strong> ' + cl + ' ciclos × ' + num(1000 / mhz, 3) + ' ns por ciclo = <strong>' + num(ns, 2) + ' ns</strong></p>' +
        '<p><strong>Ancho de banda máximo:</strong> ' + num(mts, 0) + ' millones × 8 bytes × ' + can + (can === 1 ? ' canal' : ' canales') + ' = <strong>' + num(gbs, 1) + ' GB/s</strong></p>';
    }
    raiz.querySelectorAll('input, select').forEach(function (c) { c.addEventListener('input', pintar); });
    raiz.querySelectorAll('[data-ej]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-ej').split(',');
        q('[data-k=tipo]').value = v[0]; q('[data-k=mts]').value = v[1]; q('[data-k=cl]').value = v[2]; pintar();
      });
    });
    pintar();
  }

  /* ================================================================= pcie */
  /* GB/s por carril y sentido, descontando la codificación (8b/10b, 128b/130b, FLIT en 6.0 y 7.0). */
  var PCIE = { 1: 0.25, 2: 0.5, 3: 0.985, 4: 1.969, 5: 3.938, 6: 7.563, 7: 15.125 };
  var PCIE_ANO = { 1: 2003, 2: 2007, 3: 2010, 4: 2017, 5: 2019, 6: 2022, 7: 2025 };
  function pcie(raiz) {
    function opciones(sel) { return [1, 2, 3, 4, 5, 6, 7].map(function (g) { return '<option value="' + g + '"' + (g === sel ? ' selected' : '') + '>PCIe ' + g + '.0</option>'; }).join(''); }
    function carriles(sel) { return [1, 2, 4, 8, 16].map(function (n) { return '<option value="' + n + '"' + (n === sel ? ' selected' : '') + '>x' + n + '</option>'; }).join(''); }
    raiz.insertAdjacentHTML('beforeend',
      '<div class="calc-grid">' +
      '<fieldset><legend>Tarjeta o dispositivo</legend><label>Versión <select data-k="dg">' + opciones(5) + '</select></label><label>Carriles <select data-k="dl">' + carriles(16) + '</select></label></fieldset>' +
      '<fieldset><legend>Ranura de la placa</legend><label>Versión <select data-k="sg">' + opciones(4) + '</select></label><label>Carriles conectados <select data-k="sl">' + carriles(16) + '</select></label></fieldset>' +
      '</div><div class="calc-salida" aria-live="polite"></div>' +
      '<p class="calc-ejemplos">Casos: <button type="button" class="sec" data-ej="5,16,4,16">Gráfica 5.0 en ranura 4.0</button> <button type="button" class="sec" data-ej="4,16,4,4">Gráfica en la x16 de abajo (x4)</button> <button type="button" class="sec" data-ej="5,4,4,4">SSD 5.0 en M.2 4.0</button> <button type="button" class="sec" data-ej="3,1,5,1">Tarjeta de red 3.0 x1</button></p>');
    var q = function (s) { return raiz.querySelector(s); };
    function pintar() {
      var dg = +q('[data-k=dg]').value, dl = +q('[data-k=dl]').value, sg = +q('[data-k=sg]').value, sl = +q('[data-k=sl]').value;
      var g = Math.min(dg, sg), l = Math.min(dl, sl), max = PCIE[dg] * dl, real = PCIE[g] * l;
      var pct = Math.round(real / max * 100);
      q('.calc-salida').innerHTML =
        '<p>El enlace funciona a la <strong>versión más baja</strong> (PCIe ' + g + '.0, de ' + PCIE_ANO[g] + ') y con <strong>menos carriles</strong> (x' + l + ').</p>' +
        '<p><strong>' + num(real, 2) + ' GB/s</strong> por sentido, de los ' + num(max, 2) + ' GB/s que podría dar la tarjeta (' + pct + ' %).</p>' +
        '<div class="calc-barra" role="img" aria-label="' + pct + ' % del máximo"><span style="width:' + pct + '%"></span></div>' +
        (pct < 100 ? '<p class="calc-nota">Funciona igualmente: PCIe es compatible hacia atrás y hacia delante. Solo se pierde velocidad. Que se note o no depende de la tarjeta.</p>' : '<p class="calc-nota">Aprovecha todo el ancho de banda de la tarjeta.</p>');
    }
    raiz.querySelectorAll('select').forEach(function (c) { c.addEventListener('input', pintar); });
    raiz.querySelectorAll('[data-ej]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-ej').split(',');
        ['dg', 'dl', 'sg', 'sl'].forEach(function (k, i) { q('[data-k=' + k + ']').value = v[i]; }); pintar();
      });
    });
    pintar();
  }

  /* ============================================================== monitor */
  /* Velocidad de datos útil de cada conector (Gbit/s), sin compresión DSC. */
  var CONECTORES = [
    ['HDMI 1.4', 8.16], ['HDMI 2.0', 14.4], ['HDMI 2.1', 42.67], ['HDMI 2.2', 85.33],
    ['DisplayPort 1.2', 17.28], ['DisplayPort 1.4', 25.92], ['DisplayPort 2.1 (UHBR13.5)', 52.22], ['DisplayPort 2.1 (UHBR20)', 77.37]
  ];
  var RES = [['1920×1080 (Full HD)', 1920, 1080], ['2560×1440 (QHD)', 2560, 1440], ['3440×1440 (ultrapanorámico)', 3440, 1440], ['3840×2160 (4K UHD)', 3840, 2160], ['5120×2880 (5K)', 5120, 2880], ['7680×4320 (8K)', 7680, 4320]];
  function monitor(raiz) {
    raiz.insertAdjacentHTML('beforeend',
      '<div class="calc-grid">' +
      '<label>Resolución <select data-k="res">' + RES.map(function (r, i) { return '<option value="' + i + '"' + (i === 3 ? ' selected' : '') + '>' + r[0] + '</option>'; }).join('') + '</select></label>' +
      '<label>Frecuencia de refresco <select data-k="hz">' + [60, 75, 100, 120, 144, 165, 240, 360].map(function (h) { return '<option' + (h === 144 ? ' selected' : '') + '>' + h + '</option>'; }).join('') + '</select></label>' +
      '<label>Color <select data-k="bits"><option value="24">8 bits por color (SDR)</option><option value="30">10 bits por color (HDR)</option></select></label>' +
      '</div><div class="calc-salida" aria-live="polite"></div>');
    var q = function (s) { return raiz.querySelector(s); };
    function pintar() {
      var r = RES[+q('[data-k=res]').value], hz = +q('[data-k=hz]').value, bpp = +q('[data-k=bits]').value;
      /* 7 % extra por los intervalos de borrado (temporización CVT-RB2 aproximada). */
      var gbps = r[1] * r[2] * hz * bpp * 1.07 / 1e9;
      q('.calc-salida').innerHTML = '<p>' + num(r[1] * r[2] / 1e6, 2) + ' millones de píxeles × ' + hz + ' imágenes/s × ' + bpp + ' bits ≈ <strong>' + num(gbps, 1) + ' Gbit/s</strong> (con un 7 % extra de señales de sincronismo)</p>' +
        '<ul class="conectores">' + CONECTORES.map(function (c) {
          var ok = c[1] >= gbps;
          return '<li class="' + (ok ? 'si' : 'no') + '"><span aria-hidden="true">' + (ok ? '✓' : '✗') + '</span> ' + c[0] + ' <small>(' + num(c[1], 1) + ' Gbit/s)</small><span class="sr">' + (ok ? ' suficiente' : ' no llega sin compresión') + '</span></li>';
        }).join('') + '</ul><p class="calc-nota">Los ✗ pueden funcionar con compresión DSC o reduciendo color, si gráfica y monitor la admiten. Además, el cable tiene que estar certificado para esa velocidad.</p>';
    }
    raiz.querySelectorAll('select').forEach(function (c) { c.addEventListener('input', pintar); });
    pintar();
  }

  var PIEZAS = { placa: placa, 'cpu-nombre': cpuNombre, ram: ram, pcie: pcie, monitor: monitor };
  window.UT03 = { decodificar: decodificar, PCIE: PCIE, ZONAS: ZONAS };
  function iniciar() {
    document.querySelectorAll('[data-widget]').forEach(function (r) {
      var f = PIEZAS[r.getAttribute('data-widget')];
      if (f) { r.classList.add('widget-activo'); f(r); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
