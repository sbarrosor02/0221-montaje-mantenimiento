/* Ejercicios autocorregibles del tema 2 de 0221: circuitos con valores y ejecución de programas.
   Sin dependencias. Los datos están en ut02-practica-datos.js (generado y verificado por
   scripts/generar_ut02_autocorregibles.py). Piezas:
     <div class="practica-circuito" data-circuito="v1">
     <div class="practica-programa" data-programa="1">
     <div class="practica-progreso" data-tipo="circuitos|programas">
   El progreso se recuerda en este navegador (localStorage) si está disponible. */
(function () {
  'use strict';

  var FUNC = {
    NOT: function (a) { return 1 - a[0]; },
    AND: function (a) { return a[0] & a[1]; },
    OR: function (a) { return a[0] | a[1]; },
    NAND: function (a) { return 1 - (a[0] & a[1]); },
    NOR: function (a) { return 1 - (a[0] | a[1]); },
    XOR: function (a) { return a[0] ^ a[1]; },
    XNOR: function (a) { return 1 - (a[0] ^ a[1]); }
  };
  var JUEGO = { 1: 'cargar', 2: 'almacenar', 3: 'sumar', 4: 'restar', 5: 'multiplicar', 6: 'dividir' };

  /* ------------------------------------------------------------ cálculo */
  function evaluarCircuito(c, valores) {
    var s = {}, out = {};
    c.entradas.forEach(function (e) { s[e] = valores[e]; });
    c.puertas.forEach(function (g) {
      s[g.id] = FUNC[g.tipo](g.ins.map(function (x) { return s[x]; }));
      out[g.id] = s[g.id];
    });
    return out;
  }

  function ejecutarPrograma(p) {
    var mem = {}, cp = p.inicio, ac = 0, filas = [];
    Object.keys(p.memoria).forEach(function (k) { mem[+k] = p.memoria[k]; });
    for (var n = 0; n < 200; n++) {
      var ri = mem[cp] || 0;
      if (ri === 0) break;
      var op = Math.floor(ri / 1000), d = ri % 1000, accion = JUEGO[op], rm;
      if (accion === 'almacenar') { rm = ac; mem[d] = ac; }
      else {
        rm = mem[d] || 0;
        if (accion === 'cargar') ac = rm;
        if (accion === 'sumar') ac = ac + rm;
        if (accion === 'restar') ac = ac - rm;
        if (accion === 'multiplicar') ac = ac * rm;
        if (accion === 'dividir') ac = Math.trunc(ac / rm);
      }
      filas.push({ dir: cp, CP: cp + 1, RI: ri, RD: d, RM: rm, AC: ac });
      cp++;
    }
    return { filas: filas, mem: mem, ac: ac, fin: cp };
  }

  window.UT02P = { evaluarCircuito: evaluarCircuito, ejecutarPrograma: ejecutarPrograma };
  if (typeof document === 'undefined' || !document.createElement) return;

  /* ------------------------------------------------------------ utilidades */
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function tres(v) { var s = String(v); while (s.length < 3) s = '0' + s; return s; }
  function cuatro(v) { var s = String(Math.abs(v)); while (s.length < 4) s = '0' + s; return (v < 0 ? '−' : '') + s; }
  function leerNumero(t) {
    t = String(t).trim().replace(/[−–]/g, '-').replace(/\s/g, '');
    if (!/^-?\d+$/.test(t)) return null;
    return parseInt(t, 10);
  }
  var CLAVE = 'ut02-practica-resueltos';
  function resueltos() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; }
  }
  function marcarResuelto(id) {
    var r = resueltos(); r[id] = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem(CLAVE, JSON.stringify(r)); } catch (e) { /* sin almacenamiento */ }
    progreso();
  }
  function progreso() {
    var r = resueltos(), D = window.UT02_PRACTICA;
    document.querySelectorAll('.practica-progreso').forEach(function (p) {
      var lista = p.getAttribute('data-tipo') === 'programas'
        ? D.programas.map(function (x) { return { id: 'p' + x.id, t: x.titulo }; })
        : D.circuitos.map(function (x) { return { id: x.id, t: x.titulo }; });
      var hechos = lista.filter(function (x) { return r[x.id]; }).length;
      p.innerHTML = '<p><strong>' + hechos + ' de ' + lista.length + '</strong> resueltos en este navegador.</p><ul>' +
        lista.map(function (x) { return '<li class="' + (r[x.id] ? 'hecho' : '') + '">' + (r[x.id] ? '✓ ' : '○ ') + x.t + '</li>'; }).join('') + '</ul>';
    });
  }

  /* ------------------------------------------------------------ circuito */
  function circuito(raiz, c) {
    var valores = {}, num = {};
    c.puertas.forEach(function (g, i) { num[g.id] = i + 1; });
    function partida() { c.entradas.forEach(function (e) { valores[e] = c.valores[e]; }); }
    partida();

    raiz.appendChild(el('p', { class: 'practica-nivel' }, 'Nivel ' + c.nivel + ' · ' + c.puertas.length + ' puertas'));
    var cab = el('div', { class: 'practica-valores' });
    var etiqueta = el('p', { class: 'practica-entradas', 'aria-live': 'polite' });
    var otros = el('button', { type: 'button', class: 'sec' }, 'Otros valores');
    var volver = el('button', { type: 'button', class: 'sec' }, 'Valores de partida');
    cab.appendChild(etiqueta); cab.appendChild(otros); cab.appendChild(volver);
    raiz.appendChild(cab);
    var fig = el('figure', { class: 'figura' }, c.svg + '<figcaption><a href="' + c.descarga + '" download>Descargar esquema (SVG)</a></figcaption>');
    raiz.appendChild(fig);
    var svg = fig.querySelector('svg');
    /* En pantallas estrechas no se encoge por debajo del 75 % de su tamaño: se desplaza. */
    svg.style.minWidth = Math.round(svg.viewBox.baseVal.width * 0.75) + 'px';

    var form = el('div', { class: 'practica-respuestas', role: 'group', 'aria-label': 'Salida de cada puerta' });
    var resp = {};
    c.puertas.forEach(function (g) {
      var fila = el('div', { class: 'practica-fila', 'data-g': g.id });
      var nombre = 'Puerta ' + num[g.id] + (g.id === c.salida ? ' = <strong>F</strong>' : '');
      fila.appendChild(el('span', { class: 'practica-nombre' }, nombre));
      var grupo = el('span', { class: 'practica-bits', role: 'radiogroup', 'aria-label': 'Salida de la puerta ' + num[g.id] });
      [0, 1].forEach(function (v) {
        var b = el('button', { type: 'button', role: 'radio', 'aria-checked': 'false', 'data-v': v }, String(v));
        b.addEventListener('click', function () {
          resp[g.id] = v;
          grupo.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-checked', String(+x.getAttribute('data-v') === v)); });
          limpiarMarcas();
        });
        grupo.appendChild(b);
      });
      fila.appendChild(grupo);
      fila.appendChild(el('span', { class: 'practica-marca', 'aria-live': 'polite' }));
      form.appendChild(fila);
    });
    raiz.appendChild(form);

    var pista = el('details', { class: 'practica-pista' }, '<summary>Pista: qué hace cada puerta</summary><ul>' +
      c.puertas.map(function (g) {
        return '<li>Puerta ' + num[g.id] + ': ' + g.tipo + ' de ' + g.ins.map(function (x) { return num[x] ? 'la salida de la puerta ' + num[x] : x; }).join(' y ') + '</li>';
      }).join('') + '</ul><p>Calcula de izquierda a derecha: cada puerta necesita las salidas de las anteriores.</p>');
    raiz.appendChild(pista);

    var acc = el('div', { class: 'acciones' });
    var comprobar = el('button', { type: 'button' }, 'Comprobar');
    var borrar = el('button', { type: 'button', class: 'sec' }, 'Borrar respuestas');
    acc.appendChild(comprobar); acc.appendChild(borrar);
    raiz.appendChild(acc);
    var res = el('p', { class: 'resultado oculto', 'aria-live': 'polite' });
    raiz.appendChild(res);

    function pintarValores() {
      etiqueta.innerHTML = 'Valores de las entradas: ' + c.entradas.map(function (e) { return '<strong>' + e + ' = ' + valores[e] + '</strong>'; }).join(' · ');
      svg.querySelectorAll('.valor').forEach(function (t) { t.textContent = valores[t.getAttribute('data-in')]; });
    }
    function limpiarMarcas() {
      form.querySelectorAll('.practica-fila').forEach(function (f) { f.classList.remove('ok', 'mal'); f.querySelector('.practica-marca').textContent = ''; });
      svg.querySelectorAll('.puerta-num').forEach(function (g) { g.classList.remove('ok', 'mal'); });
      res.classList.add('oculto');
    }
    function borrarRespuestas() {
      resp = {};
      form.querySelectorAll('[role=radio]').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
      limpiarMarcas();
    }
    otros.addEventListener('click', function () {
      var antes = JSON.stringify(valores);
      do { c.entradas.forEach(function (e) { valores[e] = Math.random() < 0.5 ? 0 : 1; }); } while (JSON.stringify(valores) === antes);
      pintarValores(); borrarRespuestas();
    });
    volver.addEventListener('click', function () { partida(); pintarValores(); borrarRespuestas(); });
    borrar.addEventListener('click', borrarRespuestas);
    comprobar.addEventListener('click', function () {
      var bien = evaluarCircuito(c, valores), aciertos = 0, primera = null, vacias = 0;
      c.puertas.forEach(function (g) {
        var fila = form.querySelector('[data-g="' + g.id + '"]'), marca = fila.querySelector('.practica-marca');
        var badge = svg.querySelector('.puerta-num[data-g="' + g.id + '"]');
        if (resp[g.id] === undefined) { vacias++; fila.classList.remove('ok', 'mal'); marca.textContent = ''; badge.classList.remove('ok', 'mal'); return; }
        var ok = resp[g.id] === bien[g.id];
        if (ok) aciertos++; else if (primera === null) primera = num[g.id];
        fila.classList.toggle('ok', ok); fila.classList.toggle('mal', !ok);
        badge.classList.toggle('ok', ok); badge.classList.toggle('mal', !ok);
        marca.textContent = ok ? '✓' : '✗';
      });
      res.classList.remove('oculto');
      if (aciertos === c.puertas.length) {
        res.textContent = '¡Correcto! Con ' + c.entradas.map(function (e) { return e + ' = ' + valores[e]; }).join(', ') + ' la salida es F = ' + bien[c.salida] + '. Prueba con otros valores.';
        marcarResuelto(c.id);
      } else if (vacias && primera === null) {
        res.textContent = 'Lo que has marcado está bien, pero faltan ' + vacias + ' puerta' + (vacias > 1 ? 's' : '') + ' por responder.';
      } else {
        res.textContent = aciertos + ' de ' + c.puertas.length + ' puertas bien. Revisa primero la puerta ' + primera + ': las que vienen después usan su salida.';
      }
    });
    pintarValores();
  }

  /* ------------------------------------------------------------ programa */
  function programa(raiz, p) {
    var sol = ejecutarPrograma(p), porNumero = function (a, b) { return a - b; };
    var datos = Object.keys(sol.mem).map(Number).filter(function (d) { return d > sol.fin; }).sort(porNumero);
    var celdas = Object.keys(p.memoria).map(Number).concat(datos.filter(function (d) { return !(d in p.memoria); })).sort(porNumero);
    raiz.appendChild(el('p', { class: 'practica-nivel' }, 'Nivel ' + p.nivel + ' · empieza en ' + tres(p.inicio)));

    var memTabla = '<table class="programa-tabla"><caption>Memoria al empezar</caption><tbody>';
    var prev = null;
    celdas.concat([sol.fin]).sort(function (a, b) { return a - b; }).forEach(function (d) {
      if (prev !== null && d > prev + 1) memTabla += '<tr class="hueco"><th colspan="2">⋮</th></tr>';
      var v = p.memoria[d] || 0;
      memTabla += '<tr><th>' + tres(d) + '</th><td>' + cuatro(v) + '</td></tr>';
      prev = d;
    });
    memTabla += '</tbody></table>';
    var zona = el('div', { class: 'practica-mem' }, memTabla);
    raiz.appendChild(zona);

    var t = '<div class="practica-traza-zona"><table class="practica-traza"><caption>Valor de los registros al terminar cada instrucción</caption>' +
      '<thead><tr><th scope="col">Instrucción</th><th scope="col">CP</th><th scope="col">RI</th><th scope="col">RD</th><th scope="col">RM</th><th scope="col">AC</th></tr></thead><tbody>';
    sol.filas.forEach(function (f, i) {
      t += '<tr><th scope="row">' + tres(f.dir) + '</th>' + ['CP', 'RI', 'RD', 'RM', 'AC'].map(function (k) {
        return '<td><input type="text" inputmode="numeric" autocomplete="off" data-f="' + i + '" data-k="' + k + '" aria-label="' + k + ' tras la instrucción ' + tres(f.dir) + '"></td>';
      }).join('') + '</tr>';
    });
    t += '</tbody></table></div>';
    raiz.appendChild(el('div', null, t));

    var fin = '<p class="practica-final-tit"><strong>Memoria al terminar el programa</strong> (escribe el valor de cada celda de datos):</p><div class="practica-final">' +
      datos.map(function (d) {
        return '<label>' + tres(d) + ' <input type="text" inputmode="numeric" autocomplete="off" data-celda="' + d + '"></label>';
      }).join('') + '</div>';
    raiz.appendChild(el('div', null, fin));

    var acc = el('div', { class: 'acciones' });
    var comprobar = el('button', { type: 'button' }, 'Comprobar');
    var borrar = el('button', { type: 'button', class: 'sec' }, 'Borrar');
    acc.appendChild(comprobar); acc.appendChild(borrar);
    raiz.appendChild(acc);
    var res = el('p', { class: 'resultado oculto', 'aria-live': 'polite' });
    raiz.appendChild(res);

    raiz.addEventListener('input', function (e) { e.target.classList.remove('ok', 'mal'); res.classList.add('oculto'); });
    borrar.addEventListener('click', function () {
      raiz.querySelectorAll('input').forEach(function (i) { i.value = ''; i.classList.remove('ok', 'mal'); });
      res.classList.add('oculto');
    });
    comprobar.addEventListener('click', function () {
      var total = 0, bien = 0, vacios = 0, primeraFila = null;
      raiz.querySelectorAll('input').forEach(function (i) {
        var esperado = i.hasAttribute('data-celda') ? sol.mem[+i.getAttribute('data-celda')] : sol.filas[+i.getAttribute('data-f')][i.getAttribute('data-k')];
        total++;
        i.classList.remove('ok', 'mal');
        if (i.value.trim() === '') { vacios++; return; }
        var ok = leerNumero(i.value) === esperado;
        i.classList.add(ok ? 'ok' : 'mal');
        if (ok) bien++;
        else if (primeraFila === null && i.hasAttribute('data-f')) primeraFila = +i.getAttribute('data-f');
      });
      res.classList.remove('oculto');
      if (bien === total) {
        res.textContent = '¡Traza perfecta! El programa termina con AC = ' + sol.ac + '.';
        marcarResuelto('p' + p.id);
      } else if (primeraFila !== null) {
        res.textContent = bien + ' de ' + total + ' casillas bien' + (vacios ? ' (' + vacios + ' vacías)' : '') + '. El primer fallo está en la instrucción ' + tres(sol.filas[primeraFila].dir) + ': corrígelo antes de seguir, porque el AC arrastra el error.';
      } else {
        res.textContent = bien + ' de ' + total + ' casillas bien' + (vacios ? ' (' + vacios + ' vacías)' : '') + '. Revisa las marcadas en rojo.';
      }
    });
  }

  function iniciar() {
    var D = window.UT02_PRACTICA;
    if (!D) return;
    document.querySelectorAll('.practica-circuito').forEach(function (r) {
      var c = D.circuitos.filter(function (x) { return x.id === r.getAttribute('data-circuito'); })[0];
      if (c) circuito(r, c);
    });
    document.querySelectorAll('.practica-programa').forEach(function (r) {
      var p = D.programas.filter(function (x) { return String(x.id) === r.getAttribute('data-programa'); })[0];
      if (p) programa(r, p);
    });
    progreso();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
