/* Piezas interactivas del tema 2 de 0221. Sin dependencias.
   Cada pieza se activa con data-widget="…" y es independiente:
     bits · unidades · puertas · semisumador · sumador · buses · clasifica · von-neumann
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

  var PIEZAS = { bits: bits, unidades: unidades, puertas: puertas, semisumador: semisumador, sumador: sumador, buses: buses, clasifica: clasifica, 'von-neumann': vonNeumann };
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
