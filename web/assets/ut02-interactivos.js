/* Piezas interactivas del tema 2 de 0221. Sin dependencias.
   Cada pieza se activa con data-widget="…" y es independiente:
     bits · unidades · puertas · semisumador · sumador · buses · clasifica · von-neumann · ciclo-add
   Los cuestionarios son <form class="quiz"> con .pregunta[data-correcta]. */
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
  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function num(v) { return v.toLocaleString('es-ES'); }
  function interruptor(texto, alCambiar) {
    var b = el('button', { type: 'button', class: 'conmutador', 'aria-pressed': 'false' });
    b.innerHTML = '<span class="conmutador-nombre"></span><span class="conmutador-valor">0</span>';
    b.querySelector('.conmutador-nombre').textContent = texto;
    b.valor = 0;
    b.addEventListener('click', function () {
      b.valor = 1 - b.valor;
      b.setAttribute('aria-pressed', String(!!b.valor));
      b.querySelector('.conmutador-valor').textContent = b.valor;
      alCambiar();
    });
    return b;
  }

  /* ------------------------------------------------------------------ bits */
  function bits(raiz) {
    var n = parseInt(raiz.getAttribute('data-bits') || '8', 10);
    var valores = [];
    var fila = el('div', { class: 'bits-fila', role: 'group', 'aria-label': 'Bits, del más significativo al menos significativo' });
    var celdas = [];
    for (var i = n - 1; i >= 0; i--) (function (i) {
      var peso = Math.pow(2, i);
      var b = el('button', { type: 'button', class: 'bit', 'aria-pressed': 'false', 'aria-label': 'Bit de peso ' + peso });
      b.innerHTML = '<span class="bit-luz" aria-hidden="true"></span><span class="bit-valor">0</span><span class="bit-peso">' + peso + '</span>';
      b.addEventListener('click', function () { valores[i] = 1 - valores[i]; pintar(); });
      valores[i] = 0;
      celdas.push({ b: b, i: i });
      fila.appendChild(b);
    })(i);
    var maximo = Math.pow(2, n) - 1;
    var entrada = el('label', { class: 'bits-entrada' });
    entrada.appendChild(el('span', null, 'Escribe un número decimal (0–' + maximo + ')'));
    var campo = el('input', { type: 'number', min: '0', max: String(maximo), inputmode: 'numeric', value: '0' });
    entrada.appendChild(campo);
    var salida = el('div', { class: 'bits-salida', 'aria-live': 'polite' });
    raiz.appendChild(fila);
    raiz.appendChild(entrada);
    raiz.appendChild(salida);
    campo.addEventListener('input', function () {
      var v = parseInt(campo.value, 10);
      if (isNaN(v) || v < 0 || v > maximo) return;
      for (var k = 0; k < n; k++) valores[k] = (v >> k) & 1;
      pintar(true);
    });
    function pintar(desdeCampo) {
      var dec = 0;
      celdas.forEach(function (c) {
        var v = valores[c.i];
        dec += v * Math.pow(2, c.i);
        c.b.setAttribute('aria-pressed', String(!!v));
        c.b.querySelector('.bit-valor').textContent = v;
      });
      if (!desdeCampo) campo.value = dec;
      var bin = '', grupos = [];
      for (var k = n - 1; k >= 0; k--) bin += valores[k];
      for (var g = 0; g < n; g += 4) grupos.push(bin.slice(g, g + 4));
      var suma = celdas.filter(function (c) { return valores[c.i]; }).map(function (c) { return Math.pow(2, c.i); });
      salida.innerHTML = '';
      var tabla = el('dl');
      [['Decimal', String(dec) + (suma.length > 1 ? '  (= ' + suma.join(' + ') + ')' : '')],
       ['Binario', grupos.join(' ')],
       ['Hexadecimal', grupos.map(function (x) { return parseInt(x, 2).toString(16).toUpperCase(); }).join('') + '  (cada grupo de 4 bits es una cifra: ' +
         grupos.map(function (x) { return x + '→' + parseInt(x, 2).toString(16).toUpperCase(); }).join(', ') + ')']
      ].forEach(function (par) {
        tabla.appendChild(el('dt', null, par[0]));
        tabla.appendChild(el('dd', null, par[1]));
      });
      salida.appendChild(tabla);
    }
    pintar();
  }

  /* -------------------------------------------------------------- unidades */
  function unidades(raiz) {
    var UNIDADES = [
      ['B', 1], ['KB', 1e3], ['MB', 1e6], ['GB', 1e9], ['TB', 1e12],
      ['KiB', 1024], ['MiB', Math.pow(1024, 2)], ['GiB', Math.pow(1024, 3)], ['TiB', Math.pow(1024, 4)]
    ];
    var form = el('div', { class: 'unidades-form' });
    var cantidad = el('input', { type: 'number', min: '0', step: 'any', value: '1', 'aria-label': 'Cantidad' });
    var unidad = el('select', { 'aria-label': 'Unidad' });
    UNIDADES.forEach(function (u) { unidad.appendChild(el('option', { value: u[0] }, u[0])); });
    unidad.value = 'TB';
    form.appendChild(cantidad);
    form.appendChild(unidad);
    var salida = el('div', { class: 'unidades-salida', 'aria-live': 'polite' });
    raiz.appendChild(form);
    raiz.appendChild(salida);
    function pintar() {
      var c = parseFloat(cantidad.value);
      if (isNaN(c) || c < 0) { salida.textContent = 'Escribe una cantidad positiva.'; return; }
      var bytes = c * UNIDADES.filter(function (u) { return u[0] === unidad.value; })[0][1];
      function linea(lista) {
        return lista.map(function (u) {
          var v = bytes / u[1];
          var t = v >= 1e6 || (v < 0.001 && v > 0) ? v.toExponential(3).replace('.', ',') : num(Math.round(v * 1000) / 1000);
          return '<span class="unidades-chip">' + t + ' ' + u[0] + '</span>';
        }).join(' ');
      }
      salida.innerHTML = '<p><strong>Sistema internacional (potencias de 1000)</strong><br>' + linea(UNIDADES.slice(0, 5)) +
        '</p><p><strong>Sistema binario IEC (potencias de 1024)</strong><br>' + linea(UNIDADES.slice(5)) + '</p>';
    }
    cantidad.addEventListener('input', pintar);
    unidad.addEventListener('change', pintar);
    pintar();
  }

  /* --------------------------------------------------------------- puertas */
  var PUERTAS = {
    AND: { f: function (a, b) { return a & b; }, expr: 'S = A · B', iec: '&', texto: 'Vale 1 solo si todas sus entradas valen 1. Es el producto lógico.' },
    OR: { f: function (a, b) { return a | b; }, expr: 'S = A + B', iec: '≥1', texto: 'Vale 1 si alguna de sus entradas vale 1. Es la suma lógica.' },
    NOT: { f: function (a) { return 1 - a; }, expr: "S = A'  (también Ā)", iec: '1', texto: 'Invierte la entrada: si entra 1 sale 0 y al revés. Solo tiene una entrada.' },
    NAND: { f: function (a, b) { return 1 - (a & b); }, expr: 'S = (A · B)\'', iec: '&', texto: 'Es una AND con la salida invertida: vale 0 solo si todas las entradas valen 1. Con NAND se puede construir cualquier otra puerta.' },
    NOR: { f: function (a, b) { return 1 - (a | b); }, expr: 'S = (A + B)\'', iec: '≥1', texto: 'Es una OR con la salida invertida: vale 1 solo si todas las entradas valen 0.' },
    XOR: { f: function (a, b) { return a ^ b; }, expr: 'S = A ⊕ B', iec: '=1', texto: 'O exclusiva: vale 1 cuando las entradas son distintas. Es la clave de la suma binaria.' },
    XNOR: { f: function (a, b) { return 1 - (a ^ b); }, expr: 'S = (A ⊕ B)\'', iec: '=1', texto: 'Es una XOR invertida: vale 1 cuando las entradas son iguales. Sirve para comparar bits.' }
  };

  function cuerpoPuerta(g, tipo, x, y, clase) {
    var inv = /^N|XNOR/.test(tipo) && tipo !== 'NOT' ? true : false;
    var base = tipo.replace(/^N(?=AND|OR)/, '').replace('XNOR', 'XOR');
    if (tipo === 'NOT') {
      g.appendChild(svg('path', { class: clase, d: 'M' + x + ',' + (y - 22) + ' L' + (x + 48) + ',' + y + ' L' + x + ',' + (y + 22) + ' Z' }));
      g.appendChild(svg('circle', { class: clase, cx: x + 54, cy: y, r: 6 }));
      return x + 60;
    }
    if (base === 'AND') {
      g.appendChild(svg('path', { class: clase, d: 'M' + x + ',' + (y - 28) + ' H' + (x + 40) + ' A40,28 0 0 1 ' + (x + 40) + ',' + (y + 28) + ' H' + x + ' Z' }));
    } else {
      g.appendChild(svg('path', { class: clase, d: 'M' + (x - 6) + ',' + (y - 28) + ' Q' + (x + 12) + ',' + y + ' ' + (x - 6) + ',' + (y + 28) +
        ' Q' + (x + 45) + ',' + (y + 28) + ' ' + (x + 80) + ',' + y + ' Q' + (x + 45) + ',' + (y - 28) + ' ' + (x - 6) + ',' + (y - 28) + ' Z' }));
      if (base === 'XOR') g.appendChild(svg('path', { class: 'cable', d: 'M' + (x - 16) + ',' + (y - 28) + ' Q' + (x + 2) + ',' + y + ' ' + (x - 16) + ',' + (y + 28) }));
    }
    if (inv) {
      g.appendChild(svg('circle', { class: clase, cx: x + 86, cy: y, r: 6 }));
      return x + 92;
    }
    return x + 80;
  }

  function puertas(raiz) {
    var tipo = raiz.getAttribute('data-inicial') || 'AND';
    var selector = el('div', { class: 'puertas-selector', role: 'group', 'aria-label': 'Elige una puerta' });
    Object.keys(PUERTAS).forEach(function (t) {
      var b = el('button', { type: 'button', 'data-tipo': t, 'aria-pressed': String(t === tipo) }, t);
      b.addEventListener('click', function () { tipo = t; pintar(); });
      selector.appendChild(b);
    });
    var mesa = el('div', { class: 'puertas-mesa' });
    var entradas = el('div', { class: 'puertas-entradas' });
    var swA = interruptor('A', pintar), swB = interruptor('B', pintar);
    entradas.appendChild(swA);
    entradas.appendChild(swB);
    var dibujo = svg('svg', { viewBox: '0 0 360 150', class: 'puertas-svg', role: 'img' });
    var led = el('div', { class: 'led', role: 'status' });
    mesa.appendChild(entradas);
    mesa.appendChild(dibujo);
    mesa.appendChild(led);
    var info = el('div', { class: 'puertas-info' });
    raiz.appendChild(selector);
    raiz.appendChild(mesa);
    raiz.appendChild(info);

    function pintar() {
      var p = PUERTAS[tipo], a = swA.valor, b = swB.valor;
      var una = tipo === 'NOT';
      var s = una ? p.f(a) : p.f(a, b);
      selector.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-tipo') === tipo)); });
      swB.hidden = una;
      while (dibujo.firstChild) dibujo.removeChild(dibujo.firstChild);
      dibujo.setAttribute('aria-label', 'Puerta ' + tipo + ' con ' + (una ? 'A = ' + a : 'A = ' + a + ' y B = ' + b) + '; salida S = ' + s);
      var x = 120, y = 75;
      if (una) {
        dibujo.appendChild(svg('path', { class: 'cable' + (a ? ' uno' : ''), d: 'M10,' + y + ' H' + x }));
      } else {
        dibujo.appendChild(svg('path', { class: 'cable' + (a ? ' uno' : ''), d: 'M10,' + (y - 16) + ' H' + (x + (tipo.indexOf('OR') >= 0 ? 6 : 0)) }));
        dibujo.appendChild(svg('path', { class: 'cable' + (b ? ' uno' : ''), d: 'M10,' + (y + 16) + ' H' + (x + (tipo.indexOf('OR') >= 0 ? 6 : 0)) }));
      }
      var fin = cuerpoPuerta(dibujo, tipo, x, y, 'cuerpo');
      dibujo.appendChild(svg('path', { class: 'cable' + (s ? ' uno' : ''), d: 'M' + fin + ',' + y + ' H350' }));
      [['A', una ? y : y - 16, a]].concat(una ? [] : [['B', y + 16, b]]).forEach(function (t) {
        var tx = svg('text', { x: 14, y: t[1] - 6, class: 'etq' }); tx.textContent = t[0] + ' = ' + t[2]; dibujo.appendChild(tx);
      });
      var ts = svg('text', { x: 300, y: y - 8, class: 'etq' }); ts.textContent = 'S = ' + s; dibujo.appendChild(ts);
      led.className = 'led' + (s ? ' encendido' : '');
      led.textContent = 'Salida S = ' + s;

      // Tabla de verdad con la fila activa marcada
      var filas = una ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      var html = '<p class="puertas-expr"><strong>' + tipo + '</strong> · ' + p.expr + ' · símbolo IEC: <span class="iec">' + p.iec + (/^N|XNOR/.test(tipo) && tipo !== 'NOT' || tipo === 'NOT' ? ' ○' : '') + '</span></p><p>' + p.texto + '</p>';
      html += '<table class="verdad"><caption>Tabla de verdad de ' + tipo + '</caption><thead><tr><th>A</th>' + (una ? '' : '<th>B</th>') + '<th>S</th></tr></thead><tbody>';
      filas.forEach(function (f) {
        var r = una ? p.f(f[0]) : p.f(f[0], f[1]);
        var activa = f[0] === a && (una || f[1] === b);
        html += '<tr' + (activa ? ' class="activa" aria-current="true"' : '') + '><td>' + f.join('</td><td>') + '</td><td>' + r + '</td></tr>';
      });
      info.innerHTML = html + '</tbody></table>';
    }
    pintar();
  }

  /* ---------------------------------------------------------- semisumador */
  function semisumador(raiz) {
    var entradas = el('div', { class: 'puertas-entradas' });
    var swA = interruptor('A', pintar), swB = interruptor('B', pintar);
    entradas.appendChild(swA); entradas.appendChild(swB);
    var dibujo = svg('svg', { viewBox: '0 0 400 210', class: 'puertas-svg', role: 'img' });
    var salida = el('p', { class: 'semi-salida', 'aria-live': 'polite' });
    var mesa = el('div', { class: 'puertas-mesa' });
    mesa.appendChild(entradas); mesa.appendChild(dibujo);
    raiz.appendChild(mesa); raiz.appendChild(salida);
    function pintar() {
      var a = swA.valor, b = swB.valor, s = a ^ b, c = a & b;
      while (dibujo.firstChild) dibujo.removeChild(dibujo.firstChild);
      dibujo.setAttribute('aria-label', 'Semisumador: A = ' + a + ', B = ' + b + '; suma S = ' + s + ', acarreo C = ' + c);
      function cable(d, v) { dibujo.appendChild(svg('path', { class: 'cable' + (v ? ' uno' : ''), d: d })); }
      cable('M10,45 H176', a); cable('M10,165 H180', b);
      cable('M60,45 V145 H180', a); cable('M90,165 V75 H176', b);
      dibujo.appendChild(svg('circle', { class: 'nodo', cx: 60, cy: 45, r: 4 }));
      dibujo.appendChild(svg('circle', { class: 'nodo', cx: 90, cy: 165, r: 4 }));
      var x1 = cuerpoPuerta(dibujo, 'XOR', 180, 60, 'cuerpo');
      var x2 = cuerpoPuerta(dibujo, 'AND', 180, 155, 'cuerpo');
      cable('M' + x1 + ',60 H330', s); cable('M' + x2 + ',155 H330', c);
      [['A', 14, 37], ['B', 14, 187], ['S (suma)', 268, 50], ['C (acarreo)', 268, 145]].forEach(function (t) {
        var tx = svg('text', { x: t[1], y: t[2], class: 'etq' }); tx.textContent = t[0]; dibujo.appendChild(tx);
      });
      [[s, 345, 60], [c, 345, 155]].forEach(function (t) {
        dibujo.appendChild(svg('circle', { class: 'led-svg' + (t[0] ? ' encendido' : ''), cx: t[1] + 12, cy: t[2], r: 11 }));
      });
      salida.textContent = a + ' + ' + b + ' = ' + (a + b) + ' en decimal = ' + c + '' + s + ' en binario  →  S = ' + s + ' (XOR), C = ' + c + ' (AND).';
    }
    pintar();
  }

  /* -------------------------------------------------------------- sumador */
  function sumador(raiz) {
    var n = 4, A = [0, 0, 0, 0], B = [0, 0, 0, 0];
    function filaBits(nombre, arr) {
      var f = el('div', { class: 'sumador-fila', role: 'group', 'aria-label': 'Número ' + nombre });
      f.appendChild(el('span', { class: 'sumador-nombre' }, nombre));
      f.appendChild(el('span', { class: 'sumador-celda' }, nombre === 'B' ? '+' : ''));
      for (var i = n - 1; i >= 0; i--) (function (i) {
        var b = el('button', { type: 'button', class: 'bit bit-mini', 'aria-pressed': 'false', 'aria-label': nombre + ', bit de peso ' + Math.pow(2, i) });
        b.innerHTML = '<span class="bit-valor">0</span>';
        b.addEventListener('click', function () { arr[i] = 1 - arr[i]; pintar(); });
        b.indice = i; b.arr = arr;
        f.appendChild(b);
      })(i);
      f.appendChild(el('output', { class: 'sumador-dec' }));
      return f;
    }
    var zona = el('div', { class: 'sumador' });
    var acarreos = el('div', { class: 'sumador-fila sumador-acarreo', 'aria-hidden': 'true' });
    var fA = filaBits('A', A), fB = filaBits('B', B);
    var res = el('div', { class: 'sumador-fila sumador-res' });
    zona.appendChild(acarreos); zona.appendChild(fA); zona.appendChild(fB); zona.appendChild(res);
    var nota = el('p', { class: 'semi-salida', 'aria-live': 'polite' });
    raiz.appendChild(zona); raiz.appendChild(nota);
    function pintar() {
      [fA, fB].forEach(function (f) {
        var dec = 0;
        f.querySelectorAll('.bit').forEach(function (b) {
          var v = b.arr[b.indice];
          dec += v * Math.pow(2, b.indice);
          b.setAttribute('aria-pressed', String(!!v));
          b.querySelector('.bit-valor').textContent = v;
        });
        f.querySelector('output').textContent = '= ' + dec;
      });
      var c = 0, S = [], C = [];
      for (var i = 0; i < n; i++) {
        C[i] = c;
        var t = A[i] + B[i] + c;
        S[i] = t & 1; c = t >> 1;
      }
      acarreos.innerHTML = '<span class="sumador-nombre">llevadas</span><span class="sumador-celda"></span>';
      for (var k = n - 1; k >= 0; k--) acarreos.appendChild(el('span', { class: 'sumador-celda' }, C[k] ? '1' : ''));
      res.innerHTML = '<span class="sumador-nombre">A + B</span>';
      res.appendChild(el('span', { class: 'sumador-celda' + (c ? ' uno' : '') }, String(c)));
      for (var j = n - 1; j >= 0; j--) res.appendChild(el('span', { class: 'sumador-celda' + (S[j] ? ' uno' : '') }, String(S[j])));
      var da = A.reduce(function (s, v, i) { return s + v * Math.pow(2, i); }, 0);
      var db = B.reduce(function (s, v, i) { return s + v * Math.pow(2, i); }, 0);
      res.appendChild(el('output', { class: 'sumador-dec' }, '= ' + (da + db)));
      nota.textContent = da + ' + ' + db + ' = ' + (da + db) + '. ' + (c ? 'El resultado no cabe en 4 bits: el último acarreo sale fuera (desbordamiento) y la UAL lo indica con un bit del registro de estado.' : 'Cada columna la resuelve un sumador completo: dos semisumadores y una OR.');
    }
    pintar();
  }

  /* ---------------------------------------------------------------- buses */
  function buses(raiz) {
    function formatoBytes(b) {
      var u = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'], i = 0;
      while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
      return num(Math.round(b * 100) / 100) + ' ' + u[i];
    }
    var zona = el('div');
    zona.innerHTML =
      '<div class="buses-calc">' +
      '<fieldset><legend>Bus de direcciones</legend>' +
      '<label>Ancho (líneas o bits) <input type="number" data-k="dir" min="1" max="64" value="20" inputmode="numeric"></label>' +
      '<label>Tamaño de cada celda <select data-k="celda"><option value="1">1 byte</option><option value="2">2 bytes</option><option value="4">4 bytes</option></select></label>' +
      '<output data-s="dir" aria-live="polite"></output></fieldset>' +
      '<fieldset><legend>Bus de datos</legend>' +
      '<label>Ancho (bits) <input type="number" data-k="datos" min="1" max="128" value="64" inputmode="numeric"></label>' +
      '<label>Frecuencia del reloj del bus (MHz) <input type="number" data-k="mhz" min="1" step="any" value="1600" inputmode="decimal"></label>' +
      '<label>Transferencias por ciclo <select data-k="tpc"><option value="1">1 (SDR)</option><option value="2" selected>2 (DDR)</option></select></label>' +
      '<output data-s="datos" aria-live="polite"></output></fieldset></div>' +
      '<p class="buses-ejemplos">Prueba con: <button type="button" class="sec" data-ej="8086">Intel 8086 (1978)</button> <button type="button" class="sec" data-ej="x86">CPU de 32 bits</button> <button type="button" class="sec" data-ej="ddr4">Canal DDR4-3200</button> <button type="button" class="sec" data-ej="ddr5">Canal DDR5-5600</button></p>' +
      '<p class="buses-nota" aria-live="polite"></p>';
    raiz.appendChild(zona);
    var q = function (s) { return zona.querySelector(s); };
    var EJ = {
      '8086': { dir: 20, celda: 1, datos: 16, mhz: 5, tpc: 1, nota: 'El 8086 tenía 20 líneas de direcciones: solo podía usar 1 MiB de memoria. De ahí el famoso límite de los primeros PC.' },
      x86: { dir: 32, celda: 1, datos: 32, mhz: 100, tpc: 1, nota: 'Con 32 líneas de direcciones el máximo son 4 GiB. Por eso un Windows de 32 bits no aprovecha más de 4 GB de RAM.' },
      ddr4: { dir: 36, celda: 1, datos: 64, mhz: 1600, tpc: 2, nota: 'DDR4-3200: el reloj va a 1600 MHz y se transfiere dos veces por ciclo (3200 MT/s). Por un canal de 64 bits salen 25,6 GB/s.' },
      ddr5: { dir: 36, celda: 1, datos: 64, mhz: 2800, tpc: 2, nota: 'DDR5-5600: 5600 MT/s por 64 bits de datos = 44,8 GB/s por canal (cada módulo DDR5 lo reparte en dos subcanales de 32 bits).' }
    };
    function pintar() {
      var dir = parseInt(q('[data-k=dir]').value, 10), celda = parseInt(q('[data-k=celda]').value, 10);
      var datos = parseInt(q('[data-k=datos]').value, 10), mhz = parseFloat(q('[data-k=mhz]').value), tpc = parseInt(q('[data-k=tpc]').value, 10);
      if (dir >= 1 && dir <= 64) {
        var pos = Math.pow(2, dir);
        q('[data-s=dir]').innerHTML = '2<sup>' + dir + '</sup> = <strong>' + (dir <= 40 ? num(pos) : pos.toExponential(2).replace('.', ',')) + '</strong> direcciones distintas<br>Memoria máxima direccionable: <strong>' + formatoBytes(pos * celda) + '</strong>';
      }
      if (datos >= 1 && mhz > 0) {
        var bps = datos / 8 * mhz * 1e6 * tpc;
        q('[data-s=datos]').innerHTML = datos + ' bits = ' + num(datos / 8) + ' bytes por transferencia<br>' + num(mhz * tpc) + ' millones de transferencias por segundo<br>Ancho de banda: <strong>' + num(Math.round(bps / 1e7) / 100) + ' GB/s</strong>';
      }
    }
    zona.querySelectorAll('input, select').forEach(function (c) { c.addEventListener('input', function () { q('.buses-nota').textContent = ''; pintar(); }); });
    zona.querySelectorAll('[data-ej]').forEach(function (b) {
      b.addEventListener('click', function () {
        var e = EJ[b.getAttribute('data-ej')];
        ['dir', 'celda', 'datos', 'mhz', 'tpc'].forEach(function (k) { q('[data-k=' + k + ']').value = e[k]; });
        q('.buses-nota').textContent = e.nota;
        pintar();
      });
    });
    pintar();
  }

  /* ------------------------------------------------------------ clasifica */
  function clasifica(raiz) {
    var opciones = JSON.parse(raiz.getAttribute('data-opciones'));
    var items = raiz.querySelectorAll('li[data-bloque]');
    items.forEach(function (li, i) {
      var sel = el('select', { 'aria-label': 'Bloque al que pertenece: ' + li.textContent.trim() });
      sel.appendChild(el('option', { value: '' }, 'Elige…'));
      Object.keys(opciones).forEach(function (k) { sel.appendChild(el('option', { value: k }, opciones[k])); });
      var marca = el('span', { class: 'marca', 'aria-live': 'polite' });
      li.appendChild(sel);
      li.appendChild(marca);
    });
    var acciones = el('div', { class: 'acciones' });
    var bc = el('button', { type: 'button' }, 'Comprobar');
    var br = el('button', { type: 'button', class: 'sec' }, 'Empezar de nuevo');
    var res = el('p', { class: 'resultado oculto', 'aria-live': 'polite' });
    acciones.appendChild(bc); acciones.appendChild(br);
    raiz.appendChild(acciones); raiz.appendChild(res);
    bc.addEventListener('click', function () {
      var bien = 0;
      items.forEach(function (li) {
        var sel = li.querySelector('select'), marca = li.querySelector('.marca');
        var ok = sel.value === li.getAttribute('data-bloque');
        li.classList.toggle('acierto', ok); li.classList.toggle('fallo', !ok && sel.value !== '');
        if (ok) bien++;
        marca.textContent = !sel.value ? '' : ok ? '✓' : '✗ ' + (li.getAttribute('data-pista') || 'Revisa este');
      });
      res.classList.remove('oculto');
      res.textContent = 'Aciertos: ' + bien + ' de ' + items.length + '.' + (bien === items.length ? ' ¡Perfecto!' : ' Las marcas ✗ incluyen una pista.');
    });
    br.addEventListener('click', function () {
      items.forEach(function (li) { li.querySelector('select').value = ''; li.querySelector('.marca').textContent = ''; li.classList.remove('acierto', 'fallo'); });
      res.classList.add('oculto');
    });
  }

  /* --------------------------------------------------------- von-neumann */
  function vonNeumann(raiz) {
    var botones = raiz.querySelectorAll('[data-vn]');
    var paneles = raiz.querySelectorAll('[data-vn-info]');
    function mostrar(id) {
      botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-vn') === id)); });
      paneles.forEach(function (p) { p.hidden = p.getAttribute('data-vn-info') !== id; });
    }
    botones.forEach(function (b) { b.addEventListener('click', function () { mostrar(b.getAttribute('data-vn')); }); });
    mostrar(raiz.getAttribute('data-inicial') || botones[0].getAttribute('data-vn'));
  }

  /* ------------------------------------------------------------ ciclo-add
     Animación paso a paso de ADD 200,201,202: búsqueda, decodificación,
     ejecución y almacenamiento, con el dato viajando por registros y buses. */
  function cicloAdd(raiz) {
    var R = {
      cp_rd: [[85, 90], [85, 70], [280, 70], [280, 88], [290, 88]],
      ba: [[380, 100], [480, 100]],
      bc: [[250, 180], [480, 180]],
      bdEntra: [[480, 250], [380, 250]],
      bdSale: [[380, 250], [480, 250]],
      rm_ri: [[290, 250], [275, 250], [275, 122], [240, 122]],
      ri_rd: [[240, 100], [290, 100]],
      ri_dec: [[184, 125], [184, 150]],
      rm_a: [[335, 230], [335, 222], [90, 222], [90, 240]],
      rm_b: [[335, 230], [335, 222], [190, 222], [190, 240]],
      a_ual: [[90, 280], [90, 315]],
      b_ual: [[190, 280], [190, 315]],
      ual_ac: [[140, 335], [140, 380]],
      ac_rm: [[190, 395], [335, 395], [335, 270]]
    };
    var PASOS = [
      { f: 'Inicio', t: 'Estado inicial', d: 'El contador de programa (CP) apunta a la dirección 100, donde está la instrucción ADD 200,201,202: sumar el contenido de las celdas 200 y 201 y guardar el resultado en la 202.', hl: ['cp', 'm100'], a: [] },
      { f: 'Búsqueda', t: 'El CP pasa la dirección al RD', d: 'La unidad de control copia el valor del contador de programa (100) en el registro de direcciones (RD).', hl: ['cp', 'rd'], a: [{ m: [[R.cp_rd, '100']], s: { rd: '100' } }] },
      { f: 'Búsqueda', t: 'Dirección al bus y orden de lectura', d: 'El RD pone 100 en el bus de direcciones y la UC activa la señal de lectura en el bus de control. La memoria selecciona la celda 100.', hl: ['rd', 'ba', 'bc', 'm100'], a: [{ m: [[R.ba, '100'], [R.bc, 'Leer']] }] },
      { f: 'Búsqueda', t: 'La instrucción viaja hasta el RM', d: 'El contenido de la celda 100 sale por el bus de datos y queda en el registro de memoria (RM).', hl: ['m100', 'bd', 'rm'], a: [{ m: [[R.bdEntra, 'ADD…']], s: { rm: 'ADD 200,201,202' } }] },
      { f: 'Búsqueda', t: 'Al registro de instrucción, y CP + 1', d: 'El RM pasa la instrucción al registro de instrucción (RI). A la vez, el CP se incrementa a 101 para apuntar a la siguiente instrucción.', hl: ['rm', 'ri', 'cp'], a: [{ m: [[R.rm_ri, 'ADD…']], s: { ri: 'ADD 200,201,202', cp: '101' } }] },
      { f: 'Decodificación', t: 'El decodificador interpreta la instrucción', d: 'El código de operación ADD indica una suma. Los operandos son tres direcciones: dos de lectura (200 y 201) y una de escritura (202). La UC prepara la secuencia de señales de control.', hl: ['ri', 'dec'], a: [{ m: [[R.ri_dec, 'ADD']], s: { dec: 'M[202]←M[200]+M[201]' } }] },
      { f: 'Ejecución', t: 'Buscar el primer operando', d: 'La dirección 200 pasa del RI al RD, sale por el bus de direcciones y la UC vuelve a activar la señal de lectura.', hl: ['ri', 'rd', 'ba', 'bc', 'm200'], a: [{ m: [[R.ri_rd, '200']], s: { rd: '200' } }, { m: [[R.ba, '200'], [R.bc, 'Leer']] }] },
      { f: 'Ejecución', t: 'El dato 25 llega al registro A', d: 'La memoria devuelve 25 por el bus de datos al RM, y de ahí pasa al registro A, una de las entradas de la UAL.', hl: ['m200', 'bd', 'rm', 'a'], a: [{ m: [[R.bdEntra, '25']], s: { rm: '25' } }, { m: [[R.rm_a, '25']], s: { a: '25' } }] },
      { f: 'Ejecución', t: 'Buscar el segundo operando', d: 'Mismo proceso con la dirección 201: del RI al RD, al bus de direcciones, y señal de lectura.', hl: ['ri', 'rd', 'ba', 'bc', 'm201'], a: [{ m: [[R.ri_rd, '201']], s: { rd: '201' } }, { m: [[R.ba, '201'], [R.bc, 'Leer']] }] },
      { f: 'Ejecución', t: 'El dato 17 llega al registro B', d: 'La memoria devuelve 17 por el bus de datos al RM, que lo pasa al registro B, la segunda entrada de la UAL.', hl: ['m201', 'bd', 'rm', 'b'], a: [{ m: [[R.bdEntra, '17']], s: { rm: '17' } }, { m: [[R.rm_b, '17']], s: { b: '17' } }] },
      { f: 'Ejecución', t: 'La UAL suma', d: 'La UC envía a la UAL la orden de sumar. A + B = 25 + 17 = 42, y el resultado queda en el acumulador (AC).', hl: ['a', 'b', 'ual', 'ac'], a: [{ m: [[R.a_ual, '25'], [R.b_ual, '17']] }, { m: [[R.ual_ac, '42']], s: { ac: '42' } }] },
      { f: 'Almacenamiento', t: 'Preparar la escritura', d: 'La dirección de destino (202) pasa del RI al RD, y el resultado (42) pasa del acumulador al RM.', hl: ['ri', 'rd', 'ac', 'rm'], a: [{ m: [[R.ri_rd, '202'], [R.ac_rm, '42']], s: { rd: '202', rm: '42' } }] },
      { f: 'Almacenamiento', t: 'Escribir en memoria', d: 'El RD pone 202 en el bus de direcciones, la UC activa la señal de escritura y el RM envía 42 por el bus de datos. La celda 202 guarda el resultado.', hl: ['rd', 'rm', 'ba', 'bc', 'bd', 'm202'], a: [{ m: [[R.ba, '202'], [R.bc, 'Escribir'], [R.bdSale, '42']], s: { m202: '42' } }] },
      { f: 'Fin', t: 'Instrucción completada', d: 'M[202] = 42. El CP ya vale 101, así que el ciclo vuelve a empezar con la búsqueda de la siguiente instrucción.', hl: ['m202', 'cp'], a: [] }
    ];
    var INICIAL = { cp: '100', rd: '', rm: '', ri: '', dec: '', a: '', b: '', ac: '', m202: '' };

    function reg(id, x, y, w, nombre, chico) {
      return '<g data-ca="' + id + '" class="ca-reg"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="40" rx="6"/>' +
        '<text class="ca-nom" x="' + (x + w / 2) + '" y="' + (y + 12) + '">' + nombre + '</text>' +
        '<text class="ca-val' + (chico ? ' ca-chico' : '') + '" data-v="' + id + '" x="' + (x + w / 2) + '" y="' + (y + 29) + '">—</text></g>';
    }
    function celda(id, y, dir, cont, vid) {
      return '<g data-ca="' + id + '" class="ca-celda"><rect x="490" y="' + y + '" width="165" height="34" rx="4"/>' +
        '<text class="ca-dir" x="500" y="' + (y + 17) + '">' + dir + '</text>' +
        '<text class="ca-cont"' + (vid ? ' data-v="' + vid + '"' : '') + ' x="540" y="' + (y + 17) + '">' + cont + '</text></g>';
    }
    function cable(d) { return '<path class="ca-cable" d="' + d + '" marker-end="url(#ca-flecha)"/>'; }

    var dibujo =
      '<svg class="ca-svg" viewBox="0 0 680 460" role="img" aria-labelledby="ca-titulo ca-desc">' +
      '<title id="ca-titulo">CPU, buses y memoria principal</title>' +
      '<desc id="ca-desc">Esquema con la unidad de control (CP, RI y decodificador), los registros RD y RM, la UAL con los registros A, B y el acumulador, los tres buses y la memoria principal con las celdas 100, 101, 200, 201 y 202.</desc>' +
      '<defs><marker id="ca-flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#8192a5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>' +
      '<rect class="ca-cpu" x="20" y="20" width="380" height="425" rx="12"/><text class="ca-titulo" x="388" y="40" text-anchor="end">CPU</text>' +
      '<rect class="ca-uc" x="35" y="40" width="215" height="160" rx="10"/><text class="ca-titulo" x="142" y="56">Unidad de control</text>' +
      cable('M85 90V70H280V88H288') + cable('M240 100H288') + cable('M290 250H275V122H242') + cable('M184 130V143') +
      cable('M335 230V222H90V238') + cable('M190 222V238') + cable('M90 280V303') + cable('M190 280V303') +
      cable('M140 340V373') + cable('M190 395H335V272') +
      reg('cp', 50, 90, 70, 'CP') + reg('ri', 128, 90, 112, 'RI', true) +
      '<g data-ca="dec" class="ca-reg"><rect x="50" y="145" width="190" height="44" rx="6"/><text class="ca-nom" x="145" y="157">Decodificador</text><text class="ca-val ca-chico" data-v="dec" x="145" y="176">—</text></g>' +
      reg('rd', 290, 80, 90, 'RD') + reg('rm', 290, 230, 90, 'RM', true) +
      reg('a', 50, 240, 80, 'Registro A') + reg('b', 150, 240, 80, 'Registro B') +
      '<g data-ca="ual" class="ca-reg"><polygon points="50,305 230,305 195,340 85,340"/><text class="ca-titulo" x="140" y="322">UAL</text></g>' +
      reg('ac', 90, 375, 100, 'Acumulador (AC)') +
      '<line data-ca="ba" class="ca-bus ca-ba" x1="380" y1="100" x2="480" y2="100"/>' +
      '<line data-ca="bc" class="ca-bus ca-bc" x1="250" y1="180" x2="480" y2="180"/>' +
      '<line data-ca="bd" class="ca-bus ca-bd" x1="380" y1="250" x2="480" y2="250"/>' +
      '<text class="ca-etq" x="430" y="90">B. direcciones</text><text class="ca-etq" x="430" y="170">B. control</text><text class="ca-etq" x="430" y="240">B. datos</text>' +
      '<rect class="ca-mem" x="480" y="40" width="185" height="245" rx="10"/><text class="ca-titulo" x="572" y="56">Memoria principal</text>' +
      celda('m100', 70, '100', 'ADD 200,201,202') + celda('m101', 104, '101', '(siguiente)') +
      '<text class="ca-etq" x="572" y="157">⋮</text>' +
      celda('m200', 172, '200', '25') + celda('m201', 206, '201', '17') + celda('m202', 240, '202', '—', 'm202') +
      '<g class="ca-fichas"></g></svg>';

    raiz.innerHTML =
      '<div class="cpu-botones ca-botones">' +
      '<button type="button" data-acc="ant">« Anterior</button>' +
      '<button type="button" class="principal" data-acc="play">▶ Reproducir</button>' +
      '<button type="button" data-acc="sig">Siguiente paso »</button>' +
      '<button type="button" data-acc="rei">Reiniciar</button></div>' +
      '<div class="ca-lienzo">' + dibujo + '</div>' +
      '<div class="cpu-narracion" aria-live="polite"><span class="cpu-fase"></span><div><p class="ca-paso"></p><p><strong class="ca-t"></strong> <span class="ca-d"></span></p></div></div>' +
      '<div class="ca-progreso" aria-hidden="true"></div>';

    var NSs = 'http://www.w3.org/2000/svg';
    var fichas = raiz.querySelector('.ca-fichas');
    var progreso = raiz.querySelector('.ca-progreso');
    var botonPlay = raiz.querySelector('[data-acc="play"]');
    PASOS.forEach(function () { progreso.appendChild(el('span')); });
    var calmado = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var estado = {}, actual = 0, reproduciendo = false, turno = 0, espera = null;

    function texto(k, v) { if (!v) return '—'; if (k === 'rm' && v.length > 11) return v.slice(0, 9) + '…'; return v; }
    function pintar() { Object.keys(estado).forEach(function (k) { var t = raiz.querySelector('[data-v="' + k + '"]'); if (t) t.textContent = texto(k, estado[k]); }); }
    function resaltar(ids) {
      raiz.querySelectorAll('[data-ca]').forEach(function (n) { n.classList.toggle('ca-activo', ids.indexOf(n.getAttribute('data-ca')) >= 0); });
    }
    function aplicar(p) { p.a.forEach(function (g) { Object.keys(g.s || {}).forEach(function (k) { estado[k] = g.s[k]; }); }); }
    function panel() {
      var p = PASOS[actual];
      var fase = raiz.querySelector('.cpu-fase');
      fase.textContent = p.f;
      fase.setAttribute('data-fase', p.f === 'Almacenamiento' ? 'Ejecución' : p.f);
      raiz.querySelector('.ca-paso').textContent = 'Paso ' + actual + ' de ' + (PASOS.length - 1);
      raiz.querySelector('.ca-t').textContent = p.t;
      raiz.querySelector('.ca-d').textContent = p.d;
      Array.prototype.forEach.call(progreso.children, function (s, i) { s.classList.toggle('hecho', i <= actual); });
    }
    function botonReproducir() { botonPlay.textContent = reproduciendo ? '❚❚ Pausa' : '▶ Reproducir'; }

    function viajar(puntos, etiqueta, id) {
      return new Promise(function (fin) {
        if (calmado) return fin(true);
        var g = document.createElementNS(NSs, 'g');
        var ancho = etiqueta.length * 7.6 + 18;
        var r = document.createElementNS(NSs, 'rect');
        r.setAttribute('x', -ancho / 2); r.setAttribute('y', -11); r.setAttribute('width', ancho); r.setAttribute('height', 22); r.setAttribute('rx', 11);
        var t = document.createElementNS(NSs, 'text');
        t.textContent = etiqueta;
        g.setAttribute('class', 'ca-ficha'); g.appendChild(r); g.appendChild(t); fichas.appendChild(g);
        var tramos = [], total = 0;
        for (var i = 1; i < puntos.length; i++) { var l = Math.hypot(puntos[i][0] - puntos[i - 1][0], puntos[i][1] - puntos[i - 1][1]); tramos.push(l); total += l; }
        var dur = Math.max(700, total / 0.15), t0 = performance.now();
        function cuadro(ahora) {
          if (id !== turno) { g.remove(); return fin(false); }
          var x = Math.min(1, (ahora - t0) / dur);
          var e = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
          var d = e * total, k = 0;
          while (k < tramos.length - 1 && d > tramos[k]) { d -= tramos[k]; k++; }
          var a = puntos[k], b = puntos[k + 1], q = tramos[k] ? Math.min(1, d / tramos[k]) : 1;
          g.setAttribute('transform', 'translate(' + (a[0] + (b[0] - a[0]) * q) + ',' + (a[1] + (b[1] - a[1]) * q) + ')');
          if (x < 1) requestAnimationFrame(cuadro); else setTimeout(function () { g.remove(); fin(true); }, 180);
        }
        requestAnimationFrame(cuadro);
      });
    }

    function ir(i) {
      var id = ++turno;
      clearTimeout(espera);
      actual = i;
      estado = {}; Object.keys(INICIAL).forEach(function (k) { estado[k] = INICIAL[k]; });
      for (var k = 0; k < i; k++) aplicar(PASOS[k]);
      fichas.textContent = '';
      pintar(); panel(); resaltar(PASOS[i].hl);
      var grupos = PASOS[i].a, n = 0;
      (function siguiente() {
        if (id !== turno) return;
        if (n >= grupos.length) {
          if (reproduciendo) espera = setTimeout(function () {
            if (actual < PASOS.length - 1) ir(actual + 1); else { reproduciendo = false; botonReproducir(); }
          }, 1900);
          return;
        }
        var g = grupos[n++];
        Promise.all(g.m.map(function (m) { return viajar(m[0], m[1], id); })).then(function () {
          if (id !== turno) return;
          Object.keys(g.s || {}).forEach(function (key) { estado[key] = g.s[key]; });
          pintar(); siguiente();
        });
      })();
    }

    raiz.querySelector('[data-acc="sig"]').addEventListener('click', function () { ir(Math.min(actual + 1, PASOS.length - 1)); });
    raiz.querySelector('[data-acc="ant"]').addEventListener('click', function () { ir(Math.max(actual - 1, 0)); });
    raiz.querySelector('[data-acc="rei"]').addEventListener('click', function () { reproduciendo = false; botonReproducir(); ir(0); });
    botonPlay.addEventListener('click', function () {
      reproduciendo = !reproduciendo; botonReproducir();
      if (reproduciendo) ir(actual >= PASOS.length - 1 ? 0 : actual + 1); else clearTimeout(espera);
    });
    ir(0);
  }

  /* ---------------------------------------------------------------- quiz */
  function quiz(form) {
    var preguntas = form.querySelectorAll('.pregunta');
    var salida = form.querySelector('.resultado');
    form.querySelector('[data-corregir]').addEventListener('click', function () {
      var aciertos = 0;
      preguntas.forEach(function (p) {
        var correcta = p.getAttribute('data-correcta');
        var elegida = p.querySelector('input:checked');
        var marca = p.querySelector('.marca'), exp = p.querySelector('.explicacion');
        p.classList.remove('acierto', 'fallo');
        if (exp) exp.hidden = true;
        if (!elegida) { marca.textContent = ''; return; }
        if (elegida.value === correcta) { aciertos++; p.classList.add('acierto'); marca.textContent = '✓ correcto'; }
        else { p.classList.add('fallo'); marca.textContent = '✗ no es esa'; }
        if (exp) exp.hidden = false;
      });
      salida.classList.remove('oculto');
      salida.textContent = 'Aciertos: ' + aciertos + ' de ' + preguntas.length + '. Lee la explicación de cada pregunta, también de las que has acertado.';
    });
    form.querySelector('[data-reiniciar]').addEventListener('click', function () {
      form.reset();
      preguntas.forEach(function (p) {
        p.classList.remove('acierto', 'fallo');
        p.querySelector('.marca').textContent = '';
        var exp = p.querySelector('.explicacion'); if (exp) exp.hidden = true;
      });
      salida.classList.add('oculto');
    });
  }

  var PIEZAS = { bits: bits, unidades: unidades, puertas: puertas, semisumador: semisumador, sumador: sumador, buses: buses, clasifica: clasifica, 'von-neumann': vonNeumann, 'ciclo-add': cicloAdd };
  function iniciar() {
    document.querySelectorAll('[data-widget]').forEach(function (r) {
      var f = PIEZAS[r.getAttribute('data-widget')];
      if (f) { r.classList.add('widget-activo'); f(r); }
    });
    document.querySelectorAll('form.quiz').forEach(quiz);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
