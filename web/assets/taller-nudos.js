/* Taller de nudos · 0221 Montaje y mantenimiento · Tema 1
   Sin dependencias. Datos en circuitos-nudos.js (generado por scripts/generar_boletines_4_5.py).
   Fases: 1) colorear los nudos, 2) reducir serie/paralelo con validación, 3) intensidad total. */
(function () {
  'use strict';
  var DATOS = window.CIRCUITOS_NUDOS;
  var raiz = document.getElementById('taller');
  if (!DATOS || !raiz) return;

  var U = 62;
  var COLORES = ['#d1495b', '#2e86de', '#2a9d55', '#8e44ad', '#e08a00', '#00838f'];
  var LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var SUB = '₀₁₂₃₄₅₆₇₈₉';
  var NS = 'http://www.w3.org/2000/svg';

  function sub(n) { return String(n).split('').map(function (c) { return SUB[+c]; }).join(''); }
  function num(x) {
    var r = Math.round(x * 100) / 100;
    return String(r).replace('.', ',');
  }
  function ohm(x) { return x >= 1000 ? num(x / 1000) + ' kΩ' : num(x) + ' Ω'; }
  function leerNumero(texto) {
    var t = String(texto).trim().replace(/\s/g, '').replace(',', '.').replace(/[Ωa-zA-Z]+$/, '');
    if (!/^-?\d*\.?\d+$/.test(t)) return NaN;
    return parseFloat(t);
  }
  function cerca(valor, esperado) { return Math.abs(valor - esperado) <= Math.max(0.011 * Math.abs(esperado), 0.006); }
  function $(sel) { return raiz.querySelector(sel); }
  function el(tag, attrs, padre) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(e);
    return e;
  }

  /* ------------------------------------------------------------------ estado */
  var c, nudoDe, nNudos, piezas, pintura, colorActivo, letraNudo, elementos, seleccion, pendiente, fase, pasos;

  function cargar(indice) {
    c = DATOS[indice];
    // nudo eléctrico de cada punto
    nudoDe = {};
    c.nudos.forEach(function (grupo, i) { grupo.forEach(function (p) { nudoDe[p] = i; }); });
    nNudos = c.nudos.length;
    piezas = [];
    pintura = {};
    colorActivo = 0;
    letraNudo = null;
    seleccion = [];
    pendiente = null;
    fase = 1;
    pasos = [];
    elementos = c.resistencias.map(function (r) {
      return { nombre: 'R' + sub(r.nombre), num: String(r.nombre), miembros: [r.id], a: nudoDe[r.a], b: nudoDe[r.b], ohm: r.ohm, vivo: true };
    });
    document.querySelectorAll('#taller-circuitos button').forEach(function (b, i) { b.setAttribute('aria-pressed', i === indice ? 'true' : 'false'); });
    $('#taller-titulo').textContent = (indice + 1) + '. ' + c.titulo;
    dibujar();
    pintarPaleta();
    mostrarFase();
    mensaje('#msg-nudos', '');
    mensaje('#msg-reducir', '');
    $('#redibujo').hidden = true;
    $('#btn-redibujo').setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------ dibujo */
  function dibujar() {
    var svg = $('#lienzo');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var xs = [], ys = [];
    Object.keys(c.puntos).forEach(function (k) { xs.push(c.puntos[k][0]); ys.push(c.puntos[k][1]); });
    var mx = Math.min.apply(null, xs) - 1.5, my = Math.min.apply(null, ys) - 0.9;
    var W = (Math.max.apply(null, xs) - mx + 2.1) * U, H = (Math.max.apply(null, ys) - my + 0.9) * U;
    svg.setAttribute('viewBox', '0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0));
    function P(k) { return [(c.puntos[k][0] - mx) * U, (c.puntos[k][1] - my) * U]; }
    var grado = {};
    Object.keys(c.puntos).forEach(function (k) { grado[k] = 0; });
    var capaPiezas = el('g', {}, svg), capaComp = el('g', {}, svg), capaTxt = el('g', {}, svg);

    function pieza(d, nudo, etiqueta, extremos) {
      var id = piezas.length;
      var g = el('g', { 'class': 'pieza', tabindex: '0', role: 'button', 'aria-label': etiqueta, 'data-pieza': id }, capaPiezas);
      el('path', { d: d, 'class': 'pieza-zona' }, g);
      el('path', { d: d, 'class': 'pieza-trazo' }, g);
      piezas.push({ id: id, nudo: nudo, g: g, extremos: extremos || [] });
      return id;
    }

    c.cables.forEach(function (cable, i) {
      var d = cable.map(function (p, j) { var q = P(p); return (j ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
      var id = pieza(d, nudoDe[cable[0]], 'Cable ' + (i + 1), cable);
      piezas[id].cable = true;
      var medio = P(cable[Math.floor((cable.length - 1) / 2)]), sig = P(cable[Math.floor((cable.length - 1) / 2) + 1]);
      piezas[id].marca = [(medio[0] + sig[0]) / 2, (medio[1] + sig[1]) / 2];
      for (var j = 0; j + 1 < cable.length; j++) { grado[cable[j]]++; grado[cable[j + 1]]++; }
    });

    c.resistencias.forEach(function (r) {
      var a = P(r.a), b = P(r.b), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      var ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, t = r.t || 0.5;
      var cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t;
      grado[r.a]++; grado[r.b]++;
      var nombre = 'R' + sub(r.nombre);
      pieza('M' + a[0].toFixed(1) + ',' + a[1].toFixed(1) + ' L' + (cx - ux * 30).toFixed(1) + ',' + (cy - uy * 30).toFixed(1), nudoDe[r.a], 'Patilla de ' + nombre + ' (lado 1)', [r.a]);
      pieza('M' + (cx + ux * 30).toFixed(1) + ',' + (cy + uy * 30).toFixed(1) + ' L' + b[0].toFixed(1) + ',' + b[1].toFixed(1), nudoDe[r.b], 'Patilla de ' + nombre + ' (lado 2)', [r.b]);
      var ang = Math.atan2(uy, ux) * 180 / Math.PI;
      var g = el('g', { 'class': 'resistencia', 'data-r': r.id, transform: 'translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')', tabindex: '-1', role: 'button', 'aria-label': nombre + ' = ' + ohm(r.ohm) }, capaComp);
      el('rect', { x: -34, y: -14, width: 68, height: 28, 'class': 'res-zona' }, g);
      el('path', { d: 'M-30,0 L-25,-8 L-15,8 L-5,-8 L5,8 L15,-8 L25,8 L30,0', 'class': 'res-zig' }, g);
      var nx = -uy, ny = ux;
      if (ny > 0 || (Math.abs(ny) < 1e-9 && nx > 0)) { nx = -nx; ny = -ny; }
      if (r.side === 'b') { nx = -nx; ny = -ny; }
      var lx, ly, anchor;
      if (Math.abs(uy) > 0.95) { anchor = nx > 0 ? 'start' : 'end'; lx = cx + nx * 18; ly = cy + 5; }
      else if (Math.abs(ux) > 0.95) { anchor = 'middle'; lx = cx; ly = cy + ny * 19 + (ny > 0 ? 5 : 0); }
      else { anchor = nx > 0 ? 'start' : 'end'; lx = cx + nx * 24; ly = cy + ny * 20 + 5; }
      var tx = el('text', { x: lx.toFixed(1), y: ly.toFixed(1), 'text-anchor': anchor, 'class': 'res-et', 'data-et': r.id }, capaTxt);
      tx.textContent = nombre + ' = ' + ohm(r.ohm);
    });

    c.fuentes.forEach(function (f) {
      var a = P(f.neg), b = P(f.pos), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      var ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
      grado[f.neg]++; grado[f.pos]++;
      pieza('M' + a[0].toFixed(1) + ',' + a[1].toFixed(1) + ' L' + (cx - ux * 17).toFixed(1) + ',' + (cy - uy * 17).toFixed(1), nudoDe[f.neg], 'Borne − de la fuente de ' + f.etiqueta, [f.neg]);
      pieza('M' + (cx + ux * 17).toFixed(1) + ',' + (cy + uy * 17).toFixed(1) + ' L' + b[0].toFixed(1) + ',' + b[1].toFixed(1), nudoDe[f.pos], 'Borne + de la fuente de ' + f.etiqueta, [f.pos]);
      el('circle', { cx: cx, cy: cy, r: 17, 'class': 'fuente' }, capaComp);
      var px = cx + ux * 8, py = cy + uy * 8, qx = cx - ux * 8, qy = cy - uy * 8;
      el('path', { d: 'M' + (px - 4) + ',' + py + ' h8 M' + px + ',' + (py - 4) + ' v8 M' + (qx - 4) + ',' + qy + ' h8', 'class': 'signo' }, capaComp);
      var t = el('text', { x: cx - 25, y: cy + 5, 'text-anchor': 'end', 'class': 'dato' }, capaTxt);
      t.textContent = f.etiqueta;
    });

    Object.keys(grado).forEach(function (k) {
      if (grado[k] >= 3) { var q = P(k); el('circle', { cx: q[0], cy: q[1], r: 4, 'class': 'punto', 'data-punto-nudo': nudoDe[k] }, capaComp); }
    });
    c.abiertos.forEach(function (k) { var q = P(k); el('circle', { cx: q[0], cy: q[1], r: 4.5, 'class': 'abierto' }, capaComp); });
    piezas.forEach(function (p) {
      if (p.marca) {
        var g = el('g', { 'class': 'marca', hidden: '' }, capaTxt);
        el('circle', { cx: p.marca[0], cy: p.marca[1], r: 9 }, g);
        var t = el('text', { x: p.marca[0], y: p.marca[1] + 4, 'text-anchor': 'middle' }, g);
        p.marcaG = g; p.marcaT = t;
      }
    });
    actualizarVista();
  }

  function aplicarColor(id, color) {
    var p = piezas[id];
    if (color === null) delete pintura[id]; else pintura[id] = color;
    var trazo = p.g.querySelector('.pieza-trazo');
    trazo.style.stroke = color === null ? '' : COLORES[color];
    p.g.classList.toggle('pintada', color !== null);
    p.g.classList.remove('error');
    if (p.marcaG) {
      if (color === null) p.marcaG.setAttribute('hidden', '');
      else { p.marcaG.removeAttribute('hidden'); p.marcaG.querySelector('circle').style.fill = COLORES[color]; p.marcaT.textContent = LETRAS[color]; }
    }
  }

  function pintar(id) {
    if (fase !== 1) return;
    var p = piezas[id];
    var color = colorActivo === -1 ? null : colorActivo;
    aplicarColor(id, color);
    // las patillas que tocan un cable se pintan con él: son el mismo trozo de cobre
    if (p.cable) {
      piezas.forEach(function (q) {
        if (!q.cable && q.extremos.length === 1 && p.extremos.indexOf(q.extremos[0]) >= 0) aplicarColor(q.id, color);
      });
    }
    mensaje('#msg-nudos', '');
  }

  /* ------------------------------------------------------------------ fase 1 */
  function pintarPaleta() {
    var cont = $('#paleta');
    cont.innerHTML = '';
    var n = Math.min(COLORES.length, Math.max(nNudos + 1, 4));
    for (var i = 0; i < n; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'muestra';
      b.style.setProperty('--muestra', COLORES[i]);
      b.textContent = LETRAS[i];
      b.setAttribute('aria-label', 'Color del nudo ' + LETRAS[i]);
      b.setAttribute('aria-pressed', i === colorActivo ? 'true' : 'false');
      b.dataset.color = i;
      cont.appendChild(b);
    }
    var g = document.createElement('button');
    g.type = 'button';
    g.className = 'muestra goma';
    g.textContent = 'Borrar';
    g.dataset.color = -1;
    g.setAttribute('aria-pressed', colorActivo === -1 ? 'true' : 'false');
    cont.appendChild(g);
  }

  function comprobarNudos() {
    piezas.forEach(function (p) { p.g.classList.remove('error'); });
    var sinPintar = piezas.filter(function (p) { return pintura[p.id] === undefined; });
    if (sinPintar.length) {
      sinPintar.forEach(function (p) { p.g.classList.add('error'); });
      return mensaje('#msg-nudos', 'Te faltan ' + sinPintar.length + ' trozos por colorear. Están marcados con trazo discontinuo.', 'mal');
    }
    var colorDeNudo = {}, mezclados = [];
    for (var n = 0; n < nNudos; n++) {
      var colores = {};
      piezas.forEach(function (p) { if (p.nudo === n) colores[pintura[p.id]] = true; });
      var lista = Object.keys(colores);
      if (lista.length > 1) mezclados.push(n); else colorDeNudo[n] = +lista[0];
    }
    if (mezclados.length) {
      piezas.forEach(function (p) { if (mezclados.indexOf(p.nudo) >= 0) p.g.classList.add('error'); });
      return mensaje('#msg-nudos', 'Hay ' + (mezclados.length === 1 ? 'un nudo pintado' : mezclados.length + ' nudos pintados') + ' con varios colores. Los trozos marcados están unidos solo por cable: tienen que llevar el mismo color.', 'mal');
    }
    var usados = {}, repetidos = [];
    Object.keys(colorDeNudo).forEach(function (n) {
      var col = colorDeNudo[n];
      if (usados[col] !== undefined) repetidos.push(+n, usados[col]); else usados[col] = +n;
    });
    if (repetidos.length) {
      piezas.forEach(function (p) { if (repetidos.indexOf(p.nudo) >= 0) p.g.classList.add('error'); });
      return mensaje('#msg-nudos', 'Has usado el mismo color para nudos distintos. Entre los trozos marcados hay una resistencia o un cruce sin punto: no están unidos.', 'mal');
    }
    letraNudo = colorDeNudo;
    mensaje('#msg-nudos', '¡Correcto! El circuito tiene ' + nNudos + ' nudos. Ahora puedes reducirlo.', 'bien');
    pasarAFase(2);
  }

  function verSolucionNudos() {
    var orden = [];
    piezas.forEach(function (p) { if (orden.indexOf(p.nudo) < 0) orden.push(p.nudo); });
    letraNudo = {};
    orden.forEach(function (n, i) { letraNudo[n] = i; });
    piezas.forEach(function (p) { aplicarColor(p.id, letraNudo[p.nudo]); });
    mensaje('#msg-nudos', 'Esta es la solución. Repasa qué cables y patillas comparten color antes de seguir.', 'info');
    pasarAFase(2);
  }

  /* ------------------------------------------------------------------ fase 2 */
  function chip(n) {
    var col = letraNudo[n];
    return '<span class="chip" style="background:' + COLORES[col] + '">' + LETRAS[col] + '</span>';
  }
  function vivos() { return elementos.filter(function (e) { return e.vivo; }); }
  function bornes() { return [nudoDe[c.bornes[0]], nudoDe[c.bornes[1]]]; }
  function fuentesEn(n) { return c.fuentes.filter(function (f) { return nudoDe[f.neg] === n || nudoDe[f.pos] === n; }).length; }
  function enNudo(n) { return vivos().filter(function (e) { return e.a === n || e.b === n; }); }
  function gradoNudo(n) {
    var g = fuentesEn(n);
    vivos().forEach(function (e) { if (e.a === n) g++; if (e.b === n) g++; });
    return g;
  }
  function lista(nombres) {
    if (nombres.length === 1) return nombres[0];
    return nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];
  }

  function analizar(op) {
    var sel = seleccion.map(function (i) { return elementos[i]; });
    var nombres = sel.map(function (e) { return e.nombre; });
    if (op === 'quitar') {
      if (sel.length !== 1) return { error: 'Para quitar una resistencia, selecciona solo una.' };
      var e = sel[0];
      if (e.a === e.b) return { ok: true, motivo: e.nombre + ' está cortocircuitada: sus dos extremos están en el nudo ' + chip(e.a) + '. No pasa corriente por ella.' };
      if (gradoNudo(e.a) === 1 || gradoNudo(e.b) === 1) {
        var suelto = gradoNudo(e.a) === 1 ? e.a : e.b;
        return { ok: true, motivo: e.nombre + ' es una rama abierta: del nudo ' + chip(suelto) + ' no sale nada más. No pasa corriente por ella.' };
      }
      var I = corrienteDe(e);
      if (I !== null && Math.abs(I) < 1e-9) return { ok: true, motivo: 'Por ' + e.nombre + ' no pasa corriente: sus dos extremos (' + chip(e.a) + ' y ' + chip(e.b) + ') están a la misma tensión. Es un puente equilibrado.' };
      return { error: 'Por ' + e.nombre + ' sí pasa corriente: no está cortocircuitada ni tiene un extremo libre. No se puede quitar.' };
    }
    if (sel.length < 2) return { error: 'Selecciona al menos dos resistencias.' };
    var corto = sel.filter(function (e) { return e.a === e.b; });
    if (corto.length) return { error: corto[0].nombre + ' tiene sus dos extremos en el mismo nudo. Antes de asociarla, piensa si conduce.' };
    if (op === 'paralelo') {
      var a = sel[0].a, b = sel[0].b;
      var malas = sel.filter(function (e) { return !((e.a === a && e.b === b) || (e.a === b && e.b === a)); });
      if (malas.length) {
        return { error: 'No están en paralelo: ' + sel[0].nombre + ' va de ' + chip(a) + ' a ' + chip(b) + ' y ' + malas[0].nombre + ' va de ' + chip(malas[0].a) + ' a ' + chip(malas[0].b) + '. Para estar en paralelo tienen que compartir los dos nudos.' };
      }
      var inv = 0;
      sel.forEach(function (e) { inv += 1 / e.ohm; });
      return { ok: true, a: a, b: b, ohm: 1 / inv, sim: ' ∥ ' };
    }
    // serie: deben formar un camino cuyos nudos intermedios solo unan esas dos resistencias
    var cuenta = {};
    sel.forEach(function (e) { cuenta[e.a] = (cuenta[e.a] || 0) + 1; cuenta[e.b] = (cuenta[e.b] || 0) + 1; });
    var extremos = Object.keys(cuenta).filter(function (n) { return cuenta[n] === 1; }).map(Number);
    var internos = Object.keys(cuenta).filter(function (n) { return cuenta[n] === 2; }).map(Number);
    var raros = Object.keys(cuenta).filter(function (n) { return cuenta[n] > 2; });
    if (raros.length || extremos.length !== 2 || internos.length !== sel.length - 1) {
      if (sel.length === 2 && sel[0].a !== sel[1].a && sel[0].a !== sel[1].b && sel[0].b !== sel[1].a && sel[0].b !== sel[1].b) {
        return { error: lista(nombres) + ' no comparten ningún nudo: no pueden estar en serie.' };
      }
      return { error: lista(nombres) + ' no forman una cadena: ' + (raros.length || extremos.length === 0 ? 'comparten los dos nudos (¿no será un paralelo?).' : 'revisa entre qué nudos está cada una.') };
    }
    for (var k = 0; k < internos.length; k++) {
      var n = internos[k];
      if (fuentesEn(n)) return { error: 'En el nudo ' + chip(n) + ' está conectada la fuente: la corriente no es la misma en ' + lista(nombres) + '.' };
      var otras = enNudo(n).filter(function (e) { return sel.indexOf(e) < 0; });
      if (otras.length) return { error: 'No están en serie: del nudo ' + chip(n) + ' sale también ' + lista(otras.map(function (e) { return e.nombre; })) + ', así que la corriente se reparte.' };
    }
    var total = 0;
    sel.forEach(function (e) { total += e.ohm; });
    return { ok: true, a: extremos[0], b: extremos[1], ohm: total, sim: ' + ' };
  }

  function operar(op) {
    if (pendiente) return;
    var r = analizar(op);
    if (r.error) return mensaje('#msg-reducir', r.error, 'mal');
    var sel = seleccion.map(function (i) { return elementos[i]; });
    if (op === 'quitar') {
      sel[0].vivo = false;
      sel[0].quitada = true;
      pasos.push(sel[0].nombre + ' no conduce: se quita.');
      seleccion = [];
      mensaje('#msg-reducir', r.motivo, 'bien');
      comprobarFin(r.motivo);
      actualizarVista();
      return;
    }
    var digitos = sel.map(function (e) { return e.num; }).join('').split('').sort().join('');
    pendiente = { sel: sel, a: r.a, b: r.b, ohm: r.ohm, nombre: 'R' + sub(digitos), num: digitos, texto: sel.map(function (e) { return e.nombre; }).join(r.sim) };
    mensaje('#msg-reducir', 'Bien: ' + pendiente.texto + (op === 'serie' ? ' están en serie.' : ' están en paralelo.') + ' ¿Cuánto vale la resistencia equivalente?', 'bien');
    $('#pregunta-valor').hidden = false;
    $('#etq-valor').textContent = pendiente.nombre + ' = ' + pendiente.texto + ' =';
    $('#valor').value = '';
    $('#valor').focus();
    actualizarVista();
  }

  function comprobarValor() {
    if (!pendiente) return;
    var v = leerNumero($('#valor').value);
    if (isNaN(v)) return mensaje('#msg-reducir', 'Escribe un número, por ejemplo 4 o 2,5.', 'mal');
    if (!cerca(v, pendiente.ohm)) {
      var pista = pendiente.texto.indexOf('∥') >= 0
        ? 'En paralelo, la equivalente es menor que la más pequeña: usa 1/R = 1/R₁ + 1/R₂ + … o (R₁·R₂)/(R₁+R₂).'
        : 'En serie, las resistencias se suman.';
      return mensaje('#msg-reducir', 'No es ese valor. ' + pista, 'mal');
    }
    pendiente.sel.forEach(function (e) { e.vivo = false; e.fusionada = pendiente.nombre; });
    var nuevo = { nombre: pendiente.nombre, num: pendiente.num, miembros: [], a: pendiente.a, b: pendiente.b, ohm: pendiente.ohm, vivo: true };
    pendiente.sel.forEach(function (e) { nuevo.miembros = nuevo.miembros.concat(e.miembros); });
    elementos.push(nuevo);
    pasos.push(pendiente.texto + ' = ' + pendiente.nombre + ' = ' + ohm(pendiente.ohm));
    pendiente = null;
    seleccion = [];
    $('#pregunta-valor').hidden = true;
    if (!comprobarFin('')) mensaje('#msg-reducir', '¡Correcto! ' + nuevo.nombre + ' = ' + ohm(nuevo.ohm) + '. Sigue reduciendo.', 'bien');
    actualizarVista();
  }

  function comprobarFin(previo) {
    var quedan = vivos(), b = bornes();
    if (quedan.length === 1 && ((quedan[0].a === b[0] && quedan[0].b === b[1]) || (quedan[0].a === b[1] && quedan[0].b === b[0]))) {
      mensaje('#msg-reducir', (previo ? previo + ' ' : '¡Correcto! ') + 'Ya solo queda una resistencia: R total = ' + ohm(quedan[0].ohm) + '.', 'bien');
      pasarAFase(3);
      return true;
    }
    return false;
  }

  /* corriente por un elemento con la red actual (análisis nodal modificado) */
  function corrienteDe(objetivo) {
    var nodos = [];
    vivos().forEach(function (e) { [e.a, e.b].forEach(function (n) { if (nodos.indexOf(n) < 0) nodos.push(n); }); });
    c.fuentes.forEach(function (f) { [nudoDe[f.neg], nudoDe[f.pos]].forEach(function (n) { if (nodos.indexOf(n) < 0) nodos.push(n); }); });
    var tierra = nudoDe[c.fuentes[0].neg];
    var inc = nodos.filter(function (n) { return n !== tierra; });
    var N = inc.length + c.fuentes.length, A = [], i, j;
    for (i = 0; i < N; i++) { A.push([]); for (j = 0; j <= N; j++) A[i].push(0); }
    function idx(n) { return inc.indexOf(n); }
    vivos().forEach(function (e) {
      var g = 1 / e.ohm, p = idx(e.a), q = idx(e.b);
      if (p >= 0) A[p][p] += g;
      if (q >= 0) A[q][q] += g;
      if (p >= 0 && q >= 0) { A[p][q] -= g; A[q][p] -= g; }
    });
    c.fuentes.forEach(function (f, k) {
      var fila = inc.length + k, p = idx(nudoDe[f.pos]), q = idx(nudoDe[f.neg]);
      if (p >= 0) { A[p][fila] += 1; A[fila][p] += 1; }
      if (q >= 0) { A[q][fila] -= 1; A[fila][q] -= 1; }
      A[fila][N] = f.V;
    });
    for (var col = 0; col < N; col++) {
      var piv = col;
      for (i = col + 1; i < N; i++) if (Math.abs(A[i][col]) > Math.abs(A[piv][col])) piv = i;
      var t = A[col]; A[col] = A[piv]; A[piv] = t;
      if (Math.abs(A[col][col]) < 1e-12) return null;
      var s = A[col][col];
      for (j = col; j <= N; j++) A[col][j] /= s;
      for (i = 0; i < N; i++) if (i !== col && A[i][col]) { var f2 = A[i][col]; for (j = col; j <= N; j++) A[i][j] -= f2 * A[col][j]; }
    }
    function V(n) { return n === tierra ? 0 : A[idx(n)][N]; }
    return (V(objetivo.a) - V(objetivo.b)) / objetivo.ohm;
  }

  /* ------------------------------------------------------------------ redibujo */
  function arbol() {
    var b = bornes();
    var aristas = vivos().map(function (e) { return { a: e.a, b: e.b, t: { hoja: e } }; });
    if (aristas.some(function (x) { return x.a === x.b; })) return { error: 'Antes de redibujar, quita las resistencias que no conducen.' };
    var cambio = true;
    while (cambio && aristas.length > 1) {
      cambio = false;
      // paralelo
      for (var i = 0; i < aristas.length && !cambio; i++) {
        for (var j = i + 1; j < aristas.length; j++) {
          var x = aristas[i], y = aristas[j];
          if ((x.a === y.a && x.b === y.b) || (x.a === y.b && x.b === y.a)) {
            var hijos = (x.t.p || [x.t]).concat(y.t.p || [y.t]);
            aristas.splice(j, 1);
            x.t = { p: hijos };
            cambio = true; break;
          }
        }
      }
      if (cambio) continue;
      // serie
      var nodos = {};
      aristas.forEach(function (e) { nodos[e.a] = (nodos[e.a] || 0) + 1; nodos[e.b] = (nodos[e.b] || 0) + 1; });
      for (var n in nodos) {
        n = +n;
        if (nodos[n] === 2 && b.indexOf(n) < 0 && !fuentesEn(n)) {
          var dos = aristas.filter(function (e) { return e.a === n || e.b === n; });
          var e1 = dos[0], e2 = dos[1];
          var ext1 = e1.a === n ? e1.b : e1.a, ext2 = e2.a === n ? e2.b : e2.a;
          // orientar de borne + hacia borne −
          var hijos2 = (e1.t.s || [e1.t]).concat(e2.t.s || [e2.t]);
          aristas.splice(aristas.indexOf(e2), 1);
          e1.a = ext1; e1.b = ext2; e1.t = { s: hijos2 };
          cambio = true; break;
        }
      }
      if (cambio) continue;
      // ramas colgantes
      for (var k = 0; k < aristas.length; k++) {
        var e = aristas[k];
        if ((nodos[e.a] === 1 && b.indexOf(e.a) < 0) || (nodos[e.b] === 1 && b.indexOf(e.b) < 0)) return { error: 'Antes de redibujar, quita las resistencias que no conducen.' };
      }
    }
    if (aristas.length !== 1) return { error: 'Todavía no se puede redibujar solo con serie y paralelo: hay alguna resistencia que no está ni en serie ni en paralelo con otra. ¿Pasa corriente por ella?' };
    return { t: aristas[0].t };
  }

  function bloque(t) {
    if (t.hoja) return { w: 116, up: 36, down: 14, draw: function (x, y, o) {
      o.push('<path class="w" d="M' + x + ',' + y + ' h28 M' + (x + 88) + ',' + y + ' h28"/><path class="w" transform="translate(' + (x + 58) + ',' + y + ')" d="M-30,0 L-25,-8 L-15,8 L-5,-8 L5,8 L15,-8 L25,8 L30,0"/><text x="' + (x + 58) + '" y="' + (y - 17) + '" text-anchor="middle">' + t.hoja.nombre + ' = ' + ohm(t.hoja.ohm) + '</text>');
    } };
    if (t.s) {
      var hs = t.s.map(bloque), w = 0, up = 0, down = 0;
      hs.forEach(function (h) { w += h.w; up = Math.max(up, h.up); down = Math.max(down, h.down); });
      return { w: w, up: up, down: down, draw: function (x, y, o) { hs.forEach(function (h) { h.draw(x, y, o); x += h.w; }); } };
    }
    var hp = t.p.map(bloque), G = 16, PAD = 20, off = [0], wm = 0;
    hp.forEach(function (h, i) { wm = Math.max(wm, h.w); if (i) off.push(off[i - 1] + hp[i - 1].down + G + h.up); });
    return { w: wm + 2 * PAD, up: hp[0].up, down: off[off.length - 1] + hp[hp.length - 1].down, draw: function (x, y, o) {
      var L = x + PAD, R = x + wm + PAD, fin = off[off.length - 1];
      o.push('<path class="w" d="M' + x + ',' + y + ' H' + L + ' M' + R + ',' + y + ' H' + (R + PAD) + ' M' + L + ',' + y + ' v' + fin + ' M' + R + ',' + y + ' v' + fin + '"/>');
      hp.forEach(function (h, i) {
        var ex = (wm - h.w) / 2;
        h.draw(L + ex, y + off[i], o);
        if (ex) o.push('<path class="w" d="M' + L + ',' + (y + off[i]) + ' h' + ex + ' M' + (R - ex) + ',' + (y + off[i]) + ' h' + ex + '"/>');
      });
      o.push('<circle class="n" cx="' + L + '" cy="' + y + '" r="3.5"/><circle class="n" cx="' + R + '" cy="' + y + '" r="3.5"/>');
    } };
  }

  function redibujar() {
    var caja = $('#redibujo');
    var r = arbol();
    if (r.error) { caja.innerHTML = '<p class="nota">' + r.error + '</p>'; return; }
    var b = bloque(r.t), o = [], left = 80, x0 = left + 34, y = b.up + 14, bottom = y + Math.max(b.down, 90) + 30, W = x0 + b.w + 36;
    b.draw(x0, y, o);
    o.push('<path class="w" d="M' + left + ',' + y + ' H' + x0 + ' M' + (x0 + b.w) + ',' + y + ' h16 V' + bottom + ' H' + left + '"/>');
    var cy = (y + bottom) / 2;
    o.push('<path class="w" d="M' + left + ',' + y + ' V' + (cy - 17) + ' M' + left + ',' + (cy + 17) + ' V' + bottom + '"/><circle class="f" cx="' + left + '" cy="' + cy + '" r="17"/><path class="w" d="M' + (left - 4) + ',' + (cy - 8) + ' h8 M' + left + ',' + (cy - 12) + ' v8 M' + (left - 4) + ',' + (cy + 8) + ' h8"/><text class="dato" x="' + (left - 25) + '" y="' + (cy + 5) + '" text-anchor="end">' + c.V + ' V</text>');
    caja.innerHTML = '<p class="nota">Así queda el circuito actual dibujado de forma ordenada:</p><div class="esquema-redibujo"><svg viewBox="0 0 ' + W + ' ' + (bottom + 14) + '" role="img" aria-label="Circuito redibujado">' + o.join('') + '</svg></div>';
  }

  /* ------------------------------------------------------------------ fase 3 */
  function comprobarIntensidad() {
    var v = leerNumero($('#intensidad').value);
    var R = vivos()[0].ohm, I = c.V / R;
    if (isNaN(v)) return mensaje('#msg-final', 'Escribe un número, por ejemplo 1,5.', 'mal');
    if (!cerca(v, I)) return mensaje('#msg-final', 'No es ese valor. Aplica la Ley de Ohm a todo el circuito: I = V / R total.', 'mal');
    mensaje('#msg-final', '¡Circuito resuelto! I = ' + num(c.V) + ' / ' + num(R) + ' = ' + num(I) + ' A. Ahora vuelve hacia atrás en tu cuaderno: con esa intensidad saca la tensión de cada bloque y la corriente de cada rama.', 'bien');
  }

  /* ------------------------------------------------------------------ vista */
  function pasarAFase(n) {
    fase = Math.max(fase, n);
    mostrarFase();
    actualizarVista();
  }

  function mostrarFase() {
    $('#fase-reducir').hidden = fase < 2;
    $('#fase-final').hidden = fase < 3;
    $('#paleta-zona').hidden = fase !== 1;
    raiz.classList.toggle('modo-reducir', fase >= 2);
    $('#pregunta-valor').hidden = !pendiente;
    if (fase >= 3) { $('#intensidad').value = ''; mensaje('#msg-final', ''); $('#texto-final').textContent = 'R total = ' + ohm(vivos()[0].ohm) + ' y la fuente da ' + c.V + ' V. ¿Cuánta intensidad sale de la fuente?'; }
  }

  function actualizarVista() {
    if (!c) return;
    // estado de cada resistencia en el dibujo
    raiz.querySelectorAll('.resistencia').forEach(function (g) {
      var id = +g.getAttribute('data-r');
      var e = null;
      elementos.forEach(function (x) { if (x.vivo && x.miembros.indexOf(id) >= 0) e = x; });
      var original = elementos.filter(function (x) { return x.miembros.length === 1 && x.miembros[0] === id; })[0];
      g.classList.toggle('quitada', !!original.quitada);
      g.classList.toggle('agrupada', !!e && e.miembros.length > 1);
      g.classList.toggle('sel', !!e && seleccion.indexOf(elementos.indexOf(e)) >= 0);
      g.setAttribute('tabindex', fase >= 2 && e ? '0' : '-1');
      var et = raiz.querySelector('[data-et="' + id + '"]');
      et.classList.toggle('quitada', !!original.quitada);
      var base = original.nombre + ' = ' + ohm(original.ohm);
      et.textContent = e && e.miembros.length > 1 ? base + ' → ' + e.nombre : base;
    });
    if (fase < 2 || !letraNudo) return;
    var filas = vivos().map(function (e) {
      var i = elementos.indexOf(e);
      return '<tr' + (seleccion.indexOf(i) >= 0 ? ' class="sel"' : '') + '><td><label><input type="checkbox" data-el="' + i + '"' + (seleccion.indexOf(i) >= 0 ? ' checked' : '') + (pendiente ? ' disabled' : '') + '> ' + e.nombre + '</label></td><td>' + ohm(e.ohm) + '</td><td>' + chip(e.a) + ' – ' + chip(e.b) + (e.a === e.b ? ' <em>mismo nudo</em>' : '') + '</td></tr>';
    }).join('');
    $('#tabla-elementos').innerHTML = '<thead><tr><th>Resistencia</th><th>Valor</th><th>Entre los nudos</th></tr></thead><tbody>' + filas + '</tbody>';
    $('#pasos').innerHTML = pasos.map(function (p) { return '<li>' + p + '</li>'; }).join('');
    $('#pasos-zona').hidden = !pasos.length;
    raiz.querySelectorAll('#acciones button').forEach(function (b) { b.disabled = !!pendiente || fase >= 3; });
    if (!$('#redibujo').hidden) redibujar();
  }

  function alternarSeleccion(i) {
    if (fase !== 2 || pendiente) return;
    var k = seleccion.indexOf(i);
    if (k >= 0) seleccion.splice(k, 1); else seleccion.push(i);
    mensaje('#msg-reducir', '');
    actualizarVista();
  }

  function mensaje(sel, texto, tipo) {
    var m = $(sel);
    m.innerHTML = texto;
    m.className = 'taller-msg' + (tipo ? ' ' + tipo : '');
  }

  /* ------------------------------------------------------------------ eventos */
  var botones = $('#taller-circuitos');
  DATOS.forEach(function (d, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = (i + 1) + '. ' + d.titulo;
    b.addEventListener('click', function () { cargar(i); });
    botones.appendChild(b);
  });

  $('#paleta').addEventListener('click', function (ev) {
    var b = ev.target.closest('button');
    if (!b) return;
    colorActivo = +b.dataset.color;
    $('#paleta').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  });

  function activar(ev) {
    var p = ev.target.closest('.pieza');
    if (p && fase === 1) { pintar(+p.getAttribute('data-pieza')); return; }
    var r = ev.target.closest('.resistencia');
    if (r && fase === 2) {
      var id = +r.getAttribute('data-r');
      elementos.forEach(function (e, i) { if (e.vivo && e.miembros.indexOf(id) >= 0) alternarSeleccion(i); });
    }
  }
  $('#lienzo').addEventListener('click', activar);
  $('#lienzo').addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activar(ev); }
  });
  $('#tabla-elementos').addEventListener('change', function (ev) {
    if (ev.target.matches('input[data-el]')) alternarSeleccion(+ev.target.getAttribute('data-el'));
  });
  $('#btn-comprobar').addEventListener('click', comprobarNudos);
  $('#btn-solucion').addEventListener('click', verSolucionNudos);
  $('#btn-reiniciar').addEventListener('click', function () {
    var i = DATOS.indexOf(c);
    cargar(i);
  });
  $('#acciones').addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-op]');
    if (b) operar(b.dataset.op);
  });
  $('#form-valor').addEventListener('submit', function (ev) { ev.preventDefault(); comprobarValor(); });
  $('#btn-cancelar').addEventListener('click', function () {
    pendiente = null; seleccion = [];
    $('#pregunta-valor').hidden = true;
    mensaje('#msg-reducir', '');
    actualizarVista();
  });
  $('#form-final').addEventListener('submit', function (ev) { ev.preventDefault(); comprobarIntensidad(); });
  $('#btn-redibujo').addEventListener('click', function () {
    var caja = $('#redibujo');
    caja.hidden = !caja.hidden;
    this.setAttribute('aria-expanded', caja.hidden ? 'false' : 'true');
    if (!caja.hidden) redibujar();
  });

  raiz.hidden = false;
  var aviso = document.getElementById('taller-sin-js');
  if (aviso) aviso.hidden = true;
  var inicial = Math.max(0, Math.min(DATOS.length - 1, (parseInt((location.hash.match(/^#c(\d+)$/) || [])[1], 10) || 1) - 1));
  cargar(inicial);
})();
