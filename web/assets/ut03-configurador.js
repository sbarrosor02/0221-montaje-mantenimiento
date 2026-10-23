/* Configurador de compatibilidades del tema 3 de 0221. Sin dependencias.
   Procesadores reales (datos de la ficha del fabricante); el resto de componentes son
   genéricos con medidas y consumos típicos. <div class="configurador"> lo monta. */
(function () {
  'use strict';

  /* pmax: consumo máximo sostenido (Intel: potencia turbo máxima; AMD: PPT). memMax: velocidad oficial. */
  var CPU = [
    { id: 'i3-12100F', n: 'Intel Core i3-12100F', socket: 'LGA 1700', mem: ['DDR4', 'DDR5'], memMax: { DDR4: 3200, DDR5: 4800 }, tdp: 58, pmax: 89, igpu: false, k: false, ano: 2022 },
    { id: 'i5-14400F', n: 'Intel Core i5-14400F', socket: 'LGA 1700', mem: ['DDR4', 'DDR5'], memMax: { DDR4: 3200, DDR5: 4800 }, tdp: 65, pmax: 148, igpu: false, k: false, ano: 2024 },
    { id: 'i7-14700K', n: 'Intel Core i7-14700K', socket: 'LGA 1700', mem: ['DDR4', 'DDR5'], memMax: { DDR4: 3200, DDR5: 5600 }, tdp: 125, pmax: 253, igpu: true, k: true, ano: 2023 },
    { id: 'u5-245K', n: 'Intel Core Ultra 5 245K', socket: 'LGA 1851', mem: ['DDR5'], memMax: { DDR5: 6400 }, tdp: 125, pmax: 159, igpu: true, k: true, ano: 2024 },
    { id: 'r5-5600', n: 'AMD Ryzen 5 5600', socket: 'AM4', mem: ['DDR4'], memMax: { DDR4: 3200 }, tdp: 65, pmax: 76, igpu: false, k: true, ano: 2022 },
    { id: 'r5-7600', n: 'AMD Ryzen 5 7600', socket: 'AM5', mem: ['DDR5'], memMax: { DDR5: 5200 }, tdp: 65, pmax: 88, igpu: true, k: true, ano: 2023 },
    { id: 'r5-8600G', n: 'AMD Ryzen 5 8600G', socket: 'AM5', mem: ['DDR5'], memMax: { DDR5: 5200 }, tdp: 65, pmax: 88, igpu: true, k: true, ano: 2024 },
    { id: 'r7-9800X3D', n: 'AMD Ryzen 7 9800X3D', socket: 'AM5', mem: ['DDR5'], memMax: { DDR5: 5600 }, tdp: 120, pmax: 162, igpu: true, k: true, ano: 2024 }
  ];
  var PLACA = [
    { id: 'h610m', n: 'Placa H610M DDR4 (micro-ATX)', socket: 'LGA 1700', chipset: 'H610', mem: 'DDR4', slots: 2, formato: 'micro-ATX', oc: false, vrmBasico: true, ano: 2022 },
    { id: 'b760m', n: 'Placa B760M DDR5 (micro-ATX)', socket: 'LGA 1700', chipset: 'B760', mem: 'DDR5', slots: 4, formato: 'micro-ATX', oc: false, ano: 2023 },
    { id: 'z790', n: 'Placa Z790 DDR5 (ATX)', socket: 'LGA 1700', chipset: 'Z790', mem: 'DDR5', slots: 4, formato: 'ATX', oc: true, ano: 2022 },
    { id: 'z890', n: 'Placa Z890 (ATX)', socket: 'LGA 1851', chipset: 'Z890', mem: 'DDR5', slots: 4, formato: 'ATX', oc: true, ano: 2024 },
    { id: 'b550', n: 'Placa B550 (ATX)', socket: 'AM4', chipset: 'B550', mem: 'DDR4', slots: 4, formato: 'ATX', oc: true, ano: 2020 },
    { id: 'b650m', n: 'Placa B650M (micro-ATX)', socket: 'AM5', chipset: 'B650', mem: 'DDR5', slots: 4, formato: 'micro-ATX', oc: true, ano: 2022 },
    { id: 'b650i', n: 'Placa B650I (Mini-ITX)', socket: 'AM5', chipset: 'B650', mem: 'DDR5', slots: 2, formato: 'Mini-ITX', oc: true, ano: 2022 },
    { id: 'x870e', n: 'Placa X870E (E-ATX)', socket: 'AM5', chipset: 'X870E', mem: 'DDR5', slots: 4, formato: 'E-ATX', oc: true, ano: 2024 }
  ];
  var RAM = [
    { id: 'd4-2x8', n: '2 × 8 GB DDR4-3200 CL16 (31 mm, perfil bajo)', tipo: 'DDR4', mods: 2, mts: 3200, alto: 31 },
    { id: 'd4-2x16', n: '2 × 16 GB DDR4-3600 CL18 (44 mm, disipador alto)', tipo: 'DDR4', mods: 2, mts: 3600, alto: 44 },
    { id: 'd5-1x16', n: '1 × 16 GB DDR5-5600 CL46 (un solo módulo)', tipo: 'DDR5', mods: 1, mts: 5600, alto: 32 },
    { id: 'd5-2x16', n: '2 × 16 GB DDR5-6000 CL30 (42 mm)', tipo: 'DDR5', mods: 2, mts: 6000, alto: 42 },
    { id: 'd5-2x32', n: '2 × 32 GB DDR5-6400 CL32 (35 mm)', tipo: 'DDR5', mods: 2, mts: 6400, alto: 35 },
    { id: 'd5-4x16', n: '4 × 16 GB DDR5-6000 CL30 (42 mm)', tipo: 'DDR5', mods: 4, mts: 6000, alto: 42 }
  ];
  var TODOS = ['LGA 1700', 'LGA 1851', 'AM4', 'AM5'];
  var DISIP = [
    { id: 'basico', n: 'Disipador básico de aluminio (55 mm, hasta 95 W)', sockets: TODOS, cap: 95, alto: 55 },
    { id: 'perfil', n: 'Perfil bajo (47 mm, hasta 95 W)', sockets: TODOS, cap: 95, alto: 47 },
    { id: 'torre', n: 'Torre, un ventilador de 120 mm (155 mm, hasta 180 W)', sockets: TODOS, cap: 180, alto: 155 },
    { id: 'doble', n: 'Doble torre 140 mm (165 mm, hasta 250 W; RAM de 40 mm como máximo)', sockets: TODOS, cap: 250, alto: 165, ramMax: 40 },
    { id: 'viejo', n: 'Torre antigua con anclajes LGA 1200 / AM4 (155 mm, hasta 150 W)', sockets: ['LGA 1200', 'AM4', 'AM5'], cap: 150, alto: 155 },
    { id: 'aio240', n: 'Refrigeración líquida AIO 240 mm (hasta 250 W)', sockets: TODOS, cap: 250, rad: 240 },
    { id: 'aio360', n: 'Refrigeración líquida AIO 360 mm (hasta 300 W)', sockets: TODOS, cap: 300, rad: 360 }
  ];
  var GPU = [
    { id: 'ninguna', n: 'Sin tarjeta gráfica (usar la integrada)', w: 0 },
    { id: 'baja', n: 'Gráfica de perfil bajo (170 mm, 2 ranuras, 70 W, sin conector)', w: 70, largo: 170, perfilBajo: true, con: '' },
    { id: 'entrada', n: 'Gráfica de gama de entrada (205 mm, 2 ranuras, 145 W, 1 × 8 pines)', w: 145, largo: 205, con: '8x1' },
    { id: 'media', n: 'Gráfica de gama media (285 mm, 2,5 ranuras, 220 W, 1 × 8 pines)', w: 220, largo: 285, con: '8x1' },
    { id: 'alta8', n: 'Gráfica de gama alta (310 mm, 3 ranuras, 300 W, 2 × 8 pines)', w: 300, largo: 310, con: '8x2' },
    { id: 'alta12', n: 'Gráfica de gama alta (336 mm, 3 ranuras, 360 W, 1 × 12V-2×6)', w: 360, largo: 336, con: '12v' }
  ];
  var CAJA = [
    { id: 'semitorre', n: 'Semitorre ATX (GPU hasta 400 mm, disipador hasta 170 mm, radiador hasta 360 mm)', formatos: ['ATX', 'micro-ATX', 'Mini-ITX'], gpu: 400, disip: 170, rad: 360, psu: 'ATX' },
    { id: 'completa', n: 'Torre completa E-ATX (GPU hasta 450 mm, disipador hasta 185 mm, radiador hasta 420 mm)', formatos: ['E-ATX', 'ATX', 'micro-ATX', 'Mini-ITX'], gpu: 450, disip: 185, rad: 420, psu: 'ATX' },
    { id: 'minitorre', n: 'Minitorre micro-ATX (GPU hasta 330 mm, disipador hasta 160 mm, radiador hasta 240 mm)', formatos: ['micro-ATX', 'Mini-ITX'], gpu: 330, disip: 160, rad: 240, psu: 'ATX' },
    { id: 'sff', n: 'Caja pequeña Mini-ITX de 12 L (GPU hasta 310 mm, disipador hasta 70 mm, radiador hasta 240 mm, fuente SFX)', formatos: ['Mini-ITX'], gpu: 310, disip: 70, rad: 240, psu: 'SFX' },
    { id: 'htpc', n: 'Caja HTPC de sobremesa (solo gráficas de perfil bajo, disipador hasta 55 mm, sin radiador)', formatos: ['micro-ATX', 'Mini-ITX'], gpu: 180, perfilBajo: true, disip: 55, rad: 0, psu: 'ATX' }
  ];
  var FUENTE = [
    { id: 'f450', n: 'Fuente ATX de 450 W (1 × 8 pines PCIe)', w: 450, formato: 'ATX', con8: 1, con12: false },
    { id: 'f650', n: 'Fuente ATX de 650 W (2 × 8 pines PCIe)', w: 650, formato: 'ATX', con8: 2, con12: false },
    { id: 'f850', n: 'Fuente ATX 3.1 de 850 W (12V-2×6 y 2 × 8 pines PCIe)', w: 850, formato: 'ATX', con8: 2, con12: true },
    { id: 'sfx750', n: 'Fuente SFX de 750 W (2 × 8 pines PCIe)', w: 750, formato: 'SFX', con8: 2, con12: false }
  ];
  var LISTAS = { cpu: CPU, placa: PLACA, ram: RAM, disip: DISIP, gpu: GPU, caja: CAJA, fuente: FUENTE };
  var NOMBRES = { cpu: 'Procesador', placa: 'Placa base', ram: 'Memoria', disip: 'Refrigeración del procesador', gpu: 'Tarjeta gráfica', caja: 'Caja', fuente: 'Fuente de alimentación' };
  var CE = { cpu: 'c', placa: 'e', ram: 'e', disip: 'd', gpu: 'i', caja: 'g', fuente: 'RA3 · tema 4' };

  var CASOS = {
    'Caso A': { cpu: 'r5-7600', placa: 'b550', ram: 'd5-2x16', disip: 'torre', gpu: 'media', caja: 'semitorre', fuente: 'f650' },
    'Caso B': { cpu: 'i5-14400F', placa: 'b760m', ram: 'd5-2x16', disip: 'torre', gpu: 'ninguna', caja: 'minitorre', fuente: 'f450' },
    'Caso C': { cpu: 'r7-9800X3D', placa: 'b650i', ram: 'd5-4x16', disip: 'torre', gpu: 'alta12', caja: 'sff', fuente: 'f850' },
    'Caso D': { cpu: 'i7-14700K', placa: 'h610m', ram: 'd4-2x16', disip: 'viejo', gpu: 'alta8', caja: 'minitorre', fuente: 'f650' },
    'Caso E': { cpu: 'r5-8600G', placa: 'b650m', ram: 'd5-2x16', disip: 'perfil', gpu: 'baja', caja: 'htpc', fuente: 'f450' }
  };

  function buscar(lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Devuelve una lista de comprobaciones: [nivel ('ok'|'aviso'|'mal'), titulo, explicacion]. */
  function comprobar(sel) {
    var c = buscar(CPU, sel.cpu), p = buscar(PLACA, sel.placa), r = buscar(RAM, sel.ram), d = buscar(DISIP, sel.disip),
      g = buscar(GPU, sel.gpu), k = buscar(CAJA, sel.caja), f = buscar(FUENTE, sel.fuente), res = [];
    function add(nivel, t, e) { res.push([nivel, t, e]); }

    // Procesador y placa
    if (c.socket !== p.socket) add('mal', 'Zócalo incompatible', 'El ' + c.n + ' usa ' + c.socket + ' y la placa es ' + p.socket + '. No encaja físicamente.');
    else {
      add('ok', 'Zócalo ' + c.socket, 'Procesador y placa usan el mismo zócalo.');
      if (c.ano > p.ano) add('aviso', 'Revisa la versión de la UEFI', 'El procesador es posterior a la placa (' + c.ano + ' frente a ' + p.ano + '). Comprueba en la lista de procesadores compatibles qué versión de UEFI necesita: puede que haya que actualizarla antes de montarlo.');
      if (c.k && c.socket.indexOf('LGA') === 0 && !p.oc) add('aviso', 'Overclock no disponible', 'El procesador está desbloqueado (K), pero con un chipset ' + p.chipset + ' no se puede subir su multiplicador. Hace falta una placa Z.');
      if (p.vrmBasico && c.pmax > 150) add('aviso', 'VRM justo para este procesador', 'Las placas básicas tienen un VRM sencillo. Con ' + c.pmax + ' W en turbo se calentará y puede bajar la frecuencia.');
    }
    // Memoria
    if (r.tipo !== p.mem) add('mal', 'Tipo de memoria incompatible', 'La placa solo admite ' + p.mem + ' y los módulos son ' + r.tipo + '. La muesca está en otro sitio: no entran.');
    else if (c.mem.indexOf(r.tipo) < 0) add('mal', 'El procesador no admite ' + r.tipo, 'El ' + c.n + ' solo funciona con ' + c.mem.join(' o ') + '.');
    else {
      if (r.mods > p.slots) add('mal', 'Faltan ranuras de memoria', 'Son ' + r.mods + ' módulos y la placa solo tiene ' + p.slots + ' ranuras.');
      else add('ok', 'Memoria ' + r.tipo + ' compatible', r.mods + ' módulo(s) en ' + p.slots + ' ranuras.');
      if (r.mods === 1) add('aviso', 'Un solo módulo: un solo canal', 'Con un único módulo la memoria trabaja en un canal y tiene la mitad de ancho de banda. Mejor dos módulos de 8 GB.');
      if (r.mods === 4 && r.tipo === 'DDR5') add('aviso', 'Cuatro módulos DDR5', 'Con cuatro módulos DDR5 la placa suele bajar la velocidad. Para 64 GB es mejor 2 × 32 GB.');
      var max = c.memMax[r.tipo];
      if (max && r.mts > max) add('aviso', 'Velocidad por encima de la oficial', 'El procesador admite oficialmente ' + r.tipo + '-' + max + '. Para llegar a ' + r.mts + ' MT/s hay que activar el perfil ' + (c.n.indexOf('AMD') === 0 ? 'EXPO' : 'XMP') + ' en la UEFI. Suele funcionar, pero no está garantizado.');
    }
    // Caja y placa
    if (k.formatos.indexOf(p.formato) < 0) add('mal', 'La placa no cabe en la caja', 'La placa es ' + p.formato + ' y la caja admite: ' + k.formatos.join(', ') + '.');
    else add('ok', 'Placa ' + p.formato + ' en la caja', 'La caja admite ese formato.');
    // Refrigeración
    if (d.sockets.indexOf(c.socket) < 0) add('mal', 'El disipador no tiene anclajes para ' + c.socket, 'Solo trae anclajes para ' + d.sockets.join(', ') + '. LGA 1700 y LGA 1851 tienen otra separación de tornillos que LGA 1200.');
    if (d.rad) {
      if (k.rad < d.rad) add('mal', 'El radiador no cabe', 'La AIO lleva un radiador de ' + d.rad + ' mm y la caja admite como mucho ' + (k.rad ? k.rad + ' mm' : 'ninguno') + '.');
      else add('ok', 'Radiador de ' + d.rad + ' mm', 'La caja tiene sitio para él.');
    } else if (d.alto > k.disip) add('mal', 'El disipador no cabe', 'Mide ' + d.alto + ' mm y la caja admite disipadores de hasta ' + k.disip + ' mm.');
    else add('ok', 'Altura del disipador', d.alto + ' mm de los ' + k.disip + ' mm que admite la caja.');
    if (d.cap < c.tdp) add('mal', 'Refrigeración insuficiente', 'El procesador necesita disipar al menos ' + c.tdp + ' W y el disipador admite ' + d.cap + ' W. Se calentará y bajará mucho la frecuencia.');
    else if (d.cap < c.pmax) add('aviso', 'Refrigeración justa en turbo', 'En turbo el procesador llega a ' + c.pmax + ' W y el disipador admite ' + d.cap + ' W. Funcionará, pero con carga alta bajará la frecuencia (thermal throttling).');
    else add('ok', 'Capacidad de refrigeración', d.cap + ' W para un máximo de ' + c.pmax + ' W.');
    if (d.ramMax && r.alto > d.ramMax) add('aviso', 'El disipador puede chocar con la memoria', 'Admite módulos de hasta ' + d.ramMax + ' mm debajo y estos miden ' + r.alto + ' mm. Habrá que subir el ventilador o elegir memoria más baja.');
    // Gráfica
    if (g.id === 'ninguna') {
      if (!c.igpu) add('mal', 'Sin salida de imagen', 'El ' + c.n + ' no tiene gráfica integrada y no hay tarjeta gráfica. El equipo no dará imagen.');
      else add('ok', 'Gráfica integrada', 'Usará la gráfica del procesador. Conecta el monitor al panel trasero de la placa.');
    } else {
      if (k.perfilBajo && !g.perfilBajo) add('mal', 'La gráfica no cabe', 'Esta caja solo admite tarjetas de perfil bajo.');
      else if (g.largo > k.gpu) add('mal', 'La gráfica no cabe', 'Mide ' + g.largo + ' mm y la caja admite hasta ' + k.gpu + ' mm.');
      else add('ok', 'Longitud de la gráfica', g.largo + ' mm de los ' + k.gpu + ' mm que admite la caja.');
    }
    // Fuente
    var consumo = c.pmax + g.w + 75;
    if (f.formato === 'ATX' && k.psu === 'SFX') add('mal', 'La fuente no cabe', 'La caja solo admite fuentes SFX, más pequeñas que las ATX.');
    else if (f.formato === 'SFX' && k.psu === 'ATX') add('ok', 'Fuente SFX en caja ATX', 'Cabe con un soporte adaptador (lo suelen incluir).');
    if (f.w < consumo) add('mal', 'Fuente insuficiente', 'Consumo máximo estimado: ' + consumo + ' W (procesador ' + c.pmax + ' W + gráfica ' + g.w + ' W + 75 W del resto). La fuente da ' + f.w + ' W.');
    else if (f.w < consumo * 1.25) add('aviso', 'Fuente justa', 'Consumo máximo estimado: ' + consumo + ' W. Conviene un margen del 25 % o más (unos ' + Math.ceil(consumo * 1.25 / 50) * 50 + ' W).');
    else add('ok', 'Potencia de la fuente', f.w + ' W para un consumo máximo estimado de ' + consumo + ' W.');
    if (g.con === '8x2' && f.con8 < 2) add('mal', 'Faltan conectores de la gráfica', 'La gráfica necesita dos conectores PCIe de 8 pines y la fuente solo tiene ' + f.con8 + '.');
    if (g.con === '12v' && !f.con12) add('aviso', 'Conector 12V-2×6', 'La fuente no tiene conector 12V-2×6. Hay que usar el adaptador que trae la gráfica (2 o 3 cables de 8 pines) y la fuente solo tiene ' + f.con8 + '. Mejor una fuente ATX 3.1.');
    return { lista: res, consumo: consumo };
  }

  function Configurador(raiz) {
    var self = this;
    this.raiz = raiz;
    var h = '<div class="config-pc">';
    Object.keys(LISTAS).forEach(function (k) {
      h += '<label>' + NOMBRES[k] + ' <span class="ce' + (k === 'fuente' ? ' ce-ue' : '') + '">' + (k === 'fuente' ? CE[k] : 'CE ' + CE[k]) + '</span><select data-k="' + k + '">' +
        LISTAS[k].map(function (x) { return '<option value="' + x.id + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label>';
    });
    h += '</div><p class="calc-ejemplos">Diagnostica estos equipos mal configurados: ' +
      Object.keys(CASOS).map(function (n) { return '<button type="button" class="sec" data-caso="' + n + '">' + n + '</button>'; }).join(' ') + '</p>' +
      '<div class="config-resultado" aria-live="polite"></div>';
    raiz.innerHTML = h;
    raiz.querySelectorAll('select').forEach(function (s) { s.addEventListener('change', function () { self.pintar(); }); });
    raiz.querySelectorAll('[data-caso]').forEach(function (b) {
      b.addEventListener('click', function () {
        var caso = CASOS[b.dataset.caso];
        Object.keys(caso).forEach(function (k) { raiz.querySelector('[data-k=' + k + ']').value = caso[k]; });
        self.pintar();
      });
    });
    this.fijar({ cpu: 'r5-7600', placa: 'b650m', ram: 'd5-2x16', disip: 'torre', gpu: 'media', caja: 'semitorre', fuente: 'f650' });
  }
  Configurador.prototype.fijar = function (sel) {
    var raiz = this.raiz;
    Object.keys(sel).forEach(function (k) { raiz.querySelector('[data-k=' + k + ']').value = sel[k]; });
    this.pintar();
  };
  Configurador.prototype.pintar = function () {
    var sel = {};
    this.raiz.querySelectorAll('select').forEach(function (s) { sel[s.dataset.k] = s.value; });
    var r = comprobar(sel);
    var orden = { mal: 0, aviso: 1, ok: 2 };
    r.lista.sort(function (a, b) { return orden[a[0]] - orden[b[0]]; });
    var nMal = r.lista.filter(function (x) { return x[0] === 'mal'; }).length, nAv = r.lista.filter(function (x) { return x[0] === 'aviso'; }).length;
    var ico = { ok: '✓', aviso: '!', mal: '✗' }, txt = { ok: 'Correcto', aviso: 'Aviso', mal: 'Incompatible' };
    var v = nMal ? ['mal', nMal + (nMal === 1 ? ' incompatibilidad: así no se puede montar.' : ' incompatibilidades: así no se puede montar.')]
      : nAv ? ['aviso', 'Se puede montar, con ' + nAv + (nAv === 1 ? ' aviso' : ' avisos') + ' que conviene revisar.'] : ['ok', 'Todo compatible. ¡Buen equipo!'];
    this.raiz.querySelector('.config-resultado').innerHTML = '<p class="veredicto ' + v[0] + '">' + v[1] + '</p><ul class="comprobaciones">' +
      r.lista.map(function (x) { return '<li class="' + x[0] + '"><span class="ico" aria-hidden="true">' + ico[x[0]] + '</span><span><span class="sr">' + txt[x[0]] + ': </span><strong>' + esc(x[1]) + '</strong>' + esc(x[2]) + '</span></li>'; }).join('') + '</ul>';
  };

  window.UT03_CONFIG = { comprobar: comprobar, LISTAS: LISTAS, CASOS: CASOS };
  function iniciar() { document.querySelectorAll('.configurador').forEach(function (r) { r.configurador = new Configurador(r); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
