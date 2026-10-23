/* Piezas interactivas del tema 4 de 0221. Sin dependencias.
   Cada pieza se activa con data-widget="…":
     atx24 · tolerancia · potencia · secuencia
   Los cuestionarios y el «clasifica» los pone en marcha ut02-interactivos.js. */
(function () {
  'use strict';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v, d) { return v.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d }); }

  /* ======================================================= conector ATX 24 */
  /* Norma ATX12V / ATX 3.x. Fila de arriba: pines 13 a 24; fila de abajo: 1 a 12 (vista desde los cables). */
  var LINEAS = {
    '3v3': { n: '+3,3 V', color: 'naranja', hex: '#f08a1c', f: 'Alimenta chips de la placa, memoria y ranuras.' },
    '5v': { n: '+5 V', color: 'rojo', hex: '#d42a2a', f: 'Alimenta lógica de la placa, USB y algunos discos.' },
    '12v': { n: '+12 V', color: 'amarillo', hex: '#f2cc1b', f: 'La línea principal: procesador (vía VRM), gráfica, ventiladores, discos.' },
    'n12v': { n: '–12 V', color: 'azul', hex: '#2c63c9', f: 'Casi no se usa hoy (antiguos puertos serie). Corriente muy pequeña.' },
    '5vsb': { n: '+5 V de reposo (5VSB)', color: 'morado', hex: '#8a3cc2', f: 'Está siempre presente mientras la fuente esté enchufada, aunque el equipo esté apagado: permite encender con el botón, por teclado o por red.' },
    'pson': { n: 'PS_ON#', color: 'verde', hex: '#1f9a4b', f: 'Orden de encendido. Cuando la placa la une a masa (0 V), la fuente se enciende. Por eso se puede probar una fuente uniendo este pin con un negro.' },
    'pwrok': { n: 'PWR_OK (Power Good)', color: 'gris', hex: '#9aa3ab', f: 'La fuente avisa a la placa de que sus tensiones ya son estables (unos 0,1–0,5 s después de encender). Sin ella la placa no arranca.' },
    'gnd': { n: 'Masa (COM, 0 V)', color: 'negro', hex: '#1b1f24', f: 'Referencia de 0 V y retorno de la corriente. La punta negra del polímetro va aquí.' },
    'nc': { n: 'Sin uso', color: 'sin cable', hex: '#ffffff', f: 'Antes llevaba –5 V (cable blanco). Se eliminó de la norma.' }
  };
  var PINES = { 1: '3v3', 2: '3v3', 3: 'gnd', 4: '5v', 5: 'gnd', 6: '5v', 7: 'gnd', 8: 'pwrok', 9: '5vsb', 10: '12v', 11: '12v', 12: '3v3',
    13: '3v3', 14: 'n12v', 15: 'gnd', 16: 'pson', 17: 'gnd', 18: 'gnd', 19: 'gnd', 20: 'nc', 21: '5v', 22: '5v', 23: '5v', 24: 'gnd' };

  function atx24(raiz) {
    var modo = 'explorar', objetivo = null, aciertos = 0, intentos = 0;
    var botones = '<div class="placa-modos" role="group" aria-label="Modo"><button type="button" data-modo="explorar" aria-pressed="true">Explorar</button><button type="button" data-modo="juego" aria-pressed="false">Encuéntralo</button></div>';
    var fila = function (desde, hasta) {
      var h = '';
      for (var p = desde; p <= hasta; p++) {
        var l = LINEAS[PINES[p]];
        h += '<button type="button" class="pin pin-' + PINES[p] + '" data-pin="' + p + '" style="--c:' + l.hex + '" aria-label="Pin ' + p + ': ' + l.n + ', cable ' + l.color + '"><span class="pin-num">' + p + '</span></button>';
      }
      return '<div class="pin-fila">' + h + '</div>';
    };
    raiz.insertAdjacentHTML('beforeend', botones + '<p class="placa-reto" hidden aria-live="polite"></p>' +
      '<div class="conector24"><div class="conector24-cuerpo">' + fila(13, 24) + fila(1, 12) + '</div><p class="conector24-nota">Una fila tiene los pines 1–12 y la otra los 13–24. Comprueba la numeración en el propio conector o en el manual. En muchas fuentes, el pin 13 lleva además un cable marrón fino que mide la tensión de +3,3 V.</p></div>' +
      '<div class="placa-info" aria-live="polite"></div>');
    var info = raiz.querySelector('.placa-info'), reto = raiz.querySelector('.placa-reto');
    function mostrar(p) {
      var l = LINEAS[PINES[p]];
      raiz.querySelectorAll('.pin').forEach(function (b) { b.classList.toggle('activo', +b.dataset.pin === p); });
      info.innerHTML = '<p class="placa-ce">Pin ' + p + ' · cable ' + l.color + '</p><h4>' + esc(l.n) + '</h4><p>' + esc(l.f) + '</p>';
    }
    var RETOS = [['pson', 'el pin PS_ON (encendido)'], ['pwrok', 'el pin PWR_OK'], ['5vsb', 'el pin de +5 V de reposo'], ['n12v', 'el pin de –12 V'], ['12v', 'un pin de +12 V'], ['3v3', 'un pin de +3,3 V'], ['5v', 'un pin de +5 V'], ['gnd', 'un pin de masa']];
    function nuevoReto() {
      var r = RETOS.filter(function (x) { return !objetivo || x[0] !== objetivo[0]; });
      objetivo = r[Math.floor(Math.random() * r.length)];
      reto.innerHTML = 'Pulsa <strong>' + objetivo[1] + '</strong>. <span class="placa-marcador">' + aciertos + ' de ' + intentos + '</span>';
    }
    raiz.addEventListener('click', function (e) {
      var m = e.target.closest('[data-modo]');
      if (m) {
        modo = m.dataset.modo; aciertos = 0; intentos = 0; objetivo = null;
        raiz.querySelectorAll('[data-modo]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === m)); });
        reto.hidden = modo !== 'juego';
        if (modo === 'juego') { info.innerHTML = '<p>Pulsa el pin que se pide.</p>'; nuevoReto(); } else mostrar(16);
        return;
      }
      var b = e.target.closest('[data-pin]');
      if (!b) return;
      var p = +b.dataset.pin;
      if (modo === 'explorar') { mostrar(p); return; }
      intentos++;
      if (PINES[p] === objetivo[0]) { aciertos++; mostrar(p); info.insertAdjacentHTML('afterbegin', '<p class="placa-bien">✓ ¡Correcto!</p>'); nuevoReto(); }
      else { info.innerHTML = '<p class="placa-mal">✗ Ese es el pin ' + p + ': ' + esc(LINEAS[PINES[p]].n) + '.</p>'; reto.querySelector('.placa-marcador').textContent = aciertos + ' de ' + intentos; }
    });
    mostrar(16);
  }

  /* ======================================================= tolerancias */
  /* Tolerancias de la norma ATX: ±5 % en todas las líneas salvo –12 V (±10 %). */
  var TOL = [
    { id: '12v', n: '+12 V (amarillo)', v: 12, t: 0.05 },
    { id: '5v', n: '+5 V (rojo)', v: 5, t: 0.05 },
    { id: '3v3', n: '+3,3 V (naranja)', v: 3.3, t: 0.05 },
    { id: '5vsb', n: '+5 V reposo (morado)', v: 5, t: 0.05 },
    { id: 'n12v', n: '–12 V (azul)', v: -12, t: 0.10 }
  ];
  function evaluar(id, medida) {
    var l = TOL.filter(function (x) { return x.id === id; })[0];
    var a = l.v * (1 - l.t), b = l.v * (1 + l.t), min = Math.min(a, b), max = Math.max(a, b);
    var desv = (medida - l.v) / Math.abs(l.v) * 100;
    return { linea: l, min: min, max: max, desv: desv, ok: medida >= min && medida <= max };
  }
  function tolerancia(raiz) {
    raiz.insertAdjacentHTML('beforeend',
      '<div class="calc-grid"><label>Línea medida <select data-k="linea">' + TOL.map(function (l) { return '<option value="' + l.id + '">' + l.n + '</option>'; }).join('') + '</select></label>' +
      '<label>Medida del polímetro (V) <input data-k="medida" type="number" step="0.01" value="12.08" inputmode="decimal"></label></div>' +
      '<div class="calc-salida" aria-live="polite"></div>' +
      '<table class="tabla-datos tol-tabla"><thead><tr><th>Línea</th><th>Nominal</th><th>Tolerancia</th><th>Rango admitido</th></tr></thead><tbody>' +
      TOL.map(function (l) { var r = evaluar(l.id, l.v); return '<tr><td>' + l.n + '</td><td>' + num(l.v, 2) + ' V</td><td>± ' + (l.t * 100) + ' %</td><td>' + num(r.min, 3) + ' a ' + num(r.max, 3) + ' V</td></tr>'; }).join('') +
      '</tbody></table>');
    var q = function (s) { return raiz.querySelector(s); };
    function pintar() {
      var m = parseFloat(String(q('[data-k=medida]').value).replace(',', '.'));
      if (isNaN(m)) { q('.calc-salida').textContent = 'Escribe la medida en voltios.'; return; }
      var r = evaluar(q('[data-k=linea]').value, m);
      var signo = r.desv >= 0 ? '+' : '–';
      q('.calc-salida').innerHTML = '<p>Rango admitido: <strong>' + num(r.min, 3) + ' a ' + num(r.max, 3) + ' V</strong>. Desviación: ' + signo + num(Math.abs(r.desv), 1) + ' %.</p>' +
        '<p class="tol-veredicto ' + (r.ok ? 'ok' : 'mal') + '">' + (r.ok ? '✓ Dentro de tolerancia: la línea está bien.' : '✗ Fuera de tolerancia: la fuente tiene un problema o el polímetro está mal conectado. No la uses en un equipo.') + '</p>';
    }
    raiz.querySelectorAll('input, select').forEach(function (c) { c.addEventListener('input', pintar); });
    pintar();
  }

  /* ======================================================= potencia */
  var EFIC = [['Sin certificar', 0.75], ['80 PLUS (blanco)', 0.82], ['80 PLUS Bronze', 0.85], ['80 PLUS Gold', 0.90], ['80 PLUS Platinum', 0.92], ['80 PLUS Titanium', 0.94]];
  function potencia(raiz) {
    raiz.insertAdjacentHTML('beforeend',
      '<div class="calc-grid">' +
      '<label>Procesador (W en turbo) <input data-k="cpu" type="number" min="0" value="148" inputmode="numeric"></label>' +
      '<label>Tarjeta gráfica (W) <input data-k="gpu" type="number" min="0" value="220" inputmode="numeric"></label>' +
      '<label>Resto: placa, memoria, discos, ventiladores (W) <input data-k="resto" type="number" min="0" value="75" inputmode="numeric"></label>' +
      '<label>Certificación de la fuente <select data-k="efic">' + EFIC.map(function (e, i) { return '<option value="' + i + '"' + (i === 3 ? ' selected' : '') + '>' + e[0] + ' (≈ ' + Math.round(e[1] * 100) + ' %)</option>'; }).join('') + '</select></label>' +
      '</div><div class="calc-salida" aria-live="polite"></div>');
    var q = function (s) { return raiz.querySelector(s); };
    function pintar() {
      var c = +q('[data-k=cpu]').value || 0, g = +q('[data-k=gpu]').value || 0, r = +q('[data-k=resto]').value || 0, e = EFIC[+q('[data-k=efic]').value];
      var total = c + g + r, recomendada = Math.ceil(total * 1.3 / 50) * 50, pared = total / e[1];
      q('.calc-salida').innerHTML = '<p>Consumo máximo del equipo: ' + c + ' + ' + g + ' + ' + r + ' = <strong>' + total + ' W</strong> (lo que la fuente entrega en continua).</p>' +
        '<p>Fuente recomendada, con un 30 % de margen: <strong>' + recomendada + ' W</strong> o más.</p>' +
        '<p>Con una fuente ' + e[0] + ', del enchufe se toman unos ' + total + ' ÷ ' + num(e[1], 2) + ' ≈ <strong>' + Math.round(pared) + ' W</strong>. Los ' + Math.round(pared - total) + ' W de diferencia se convierten en calor dentro de la fuente.</p>';
    }
    raiz.querySelectorAll('input, select').forEach(function (x) { x.addEventListener('input', pintar); });
    pintar();
  }

  /* ======================================================= secuencia */
  function secuencia(raiz) {
    var pasos = Array.prototype.map.call(raiz.querySelectorAll('li[data-orden]'), function (li) { return { o: +li.dataset.orden, t: li.innerHTML }; });
    var lista = raiz.querySelector('ol');
    var actual = pasos.slice();
    for (var i = actual.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = actual[i]; actual[i] = actual[j]; actual[j] = x; }
    var res = document.createElement('p'); res.className = 'resultado oculto'; res.setAttribute('aria-live', 'polite');
    var acc = document.createElement('div'); acc.className = 'acciones';
    acc.innerHTML = '<button type="button" data-acc="comprobar">Comprobar el orden</button><button type="button" class="sec" data-acc="mezclar">Mezclar otra vez</button>';
    raiz.appendChild(acc); raiz.appendChild(res);
    function pintar(marcar) {
      lista.innerHTML = actual.map(function (p, i) {
        var cls = marcar ? (p.o === i + 1 ? ' class="acierto"' : ' class="fallo"') : '';
        return '<li' + cls + '><span class="paso-texto">' + p.t + '</span><span class="paso-botones">' +
          '<button type="button" data-mover="-1" data-i="' + i + '" aria-label="Subir paso"' + (i === 0 ? ' disabled' : '') + '>▲</button>' +
          '<button type="button" data-mover="1" data-i="' + i + '" aria-label="Bajar paso"' + (i === actual.length - 1 ? ' disabled' : '') + '>▼</button></span></li>';
      }).join('');
    }
    raiz.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mover]');
      if (b) {
        var i = +b.dataset.i, j = i + (+b.dataset.mover), t = actual[i]; actual[i] = actual[j]; actual[j] = t;
        pintar(false); res.classList.add('oculto');
        var f = lista.querySelector('[data-i="' + j + '"][data-mover="' + b.dataset.mover + '"]') || lista.querySelector('[data-i="' + j + '"]'); if (f) f.focus();
        return;
      }
      var a = e.target.closest('[data-acc]');
      if (!a) return;
      if (a.dataset.acc === 'mezclar') { for (var k = actual.length - 1; k > 0; k--) { var m = Math.floor(Math.random() * (k + 1)), y = actual[k]; actual[k] = actual[m]; actual[m] = y; } pintar(false); res.classList.add('oculto'); return; }
      var bien = actual.filter(function (p, i) { return p.o === i + 1; }).length;
      pintar(true);
      res.classList.remove('oculto');
      res.textContent = bien === actual.length ? '¡Orden correcto! Así se monta un equipo sin tener que deshacer nada.' : bien + ' de ' + actual.length + ' pasos en su sitio. Los marcados en rojo no están en su posición: piensa qué necesita estar hecho antes de cada uno.';
    });
    pintar(false);
  }

  var PIEZAS = { atx24: atx24, tolerancia: tolerancia, potencia: potencia, secuencia: secuencia };
  window.UT04 = { evaluar: evaluar, TOL: TOL, PINES: PINES, EFIC: EFIC };
  function iniciar() {
    document.querySelectorAll('[data-widget]').forEach(function (r) {
      var f = PIEZAS[r.getAttribute('data-widget')];
      if (f) { r.classList.add('widget-activo'); f(r); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
