/* Simulador de una máquina de Von Neumann elemental · Tema 2 de 0221.
   Sin dependencias. Cada <div class="cpu-sim"> es un simulador independiente:
     data-programa="libro|suma|media|libre"   programa que carga al empezar
     data-selector                             muestra el desplegable de programas
   Memoria de celdas decimales de 4 cifras: 1 cifra de operación y 3 de dirección
   (formato operación-dirección). Un 0000 en la posición del CP termina el programa. */
(function () {
  'use strict';

  var ESTANDAR = { 1: 'cargar', 2: 'almacenar', 3: 'sumar', 4: 'restar', 5: 'multiplicar', 6: 'dividir' };
  var LIBRO = { 1: 'cargar', 2: 'restar', 3: 'almacenar' };
  var TEXTOS = {
    cargar: 'Cargar el AC desde memoria',
    almacenar: 'Almacenar el AC en memoria',
    sumar: 'Sumar al AC el dato de memoria',
    restar: 'Restar al AC el dato de memoria',
    multiplicar: 'Multiplicar el AC por el dato de memoria',
    dividir: 'Dividir el AC entre el dato de memoria'
  };
  var SIGNO = { sumar: '+', restar: '−', multiplicar: '×', dividir: '÷' };

  var PROGRAMAS = {
    libro: {
      titulo: 'Ejemplo de los apuntes (250–252)',
      juego: LIBRO, inicio: 250,
      memoria: { 250: 1408, 251: 2409, 252: 3409, 408: 9, 409: 5 },
      nota: 'Este ejemplo usa otro juego de instrucciones: 1 cargar, 2 restar, 3 almacenar.'
    },
    suma: {
      titulo: 'Sumar tres datos (200–203)',
      juego: ESTANDAR, inicio: 200,
      memoria: { 200: 1250, 201: 3251, 202: 3252, 203: 2253, 250: 4, 251: 7, 252: 10 }
    },
    media: {
      titulo: 'Media de dos notas (120–123)',
      juego: ESTANDAR, inicio: 120,
      memoria: { 120: 1160, 121: 3161, 122: 6162, 123: 2163, 160: 6, 161: 9, 162: 2 },
      nota: 'La división es entera: 15 ÷ 2 da 7 y se pierde el resto.'
    },
    libre: {
      titulo: 'Memoria libre: escribe tu programa',
      juego: ESTANDAR, inicio: 100, memoria: {}, editable: true
    }
  };

  function cuatro(v) {
    var s = String(Math.abs(v));
    while (s.length < 4) s = '0' + s;
    return (v < 0 ? '−' : '') + s;
  }
  function tres(v) {
    var s = String(v);
    while (s.length < 3) s = '0' + s;
    return s;
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function Simulador(raiz) {
    this.raiz = raiz;
    this.clave = raiz.getAttribute('data-programa') || 'libro';
    this.construir();
    this.cargar(this.clave);
  }

  Simulador.prototype.construir = function () {
    var self = this, r = this.raiz;
    r.innerHTML = '';
    var barra = el('div', { class: 'cpu-controles' });
    if (r.hasAttribute('data-selector')) {
      var etiqueta = el('label', { class: 'cpu-programa' });
      etiqueta.appendChild(el('span', null, 'Programa'));
      var sel = el('select');
      Object.keys(PROGRAMAS).forEach(function (k) {
        var o = el('option', { value: k }, PROGRAMAS[k].titulo);
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () { self.cargar(sel.value); });
      etiqueta.appendChild(sel);
      barra.appendChild(etiqueta);
      this.selector = sel;
    }
    var botones = el('div', { class: 'cpu-botones' });
    this.bPaso = el('button', { type: 'button', class: 'principal' }, 'Siguiente paso ▸');
    this.bInstr = el('button', { type: 'button' }, 'Instrucción completa ▸▸');
    this.bFin = el('button', { type: 'button' }, 'Hasta el final');
    this.bReset = el('button', { type: 'button' }, 'Reiniciar');
    [this.bPaso, this.bInstr, this.bFin, this.bReset].forEach(function (b) { botones.appendChild(b); });
    barra.appendChild(botones);
    r.appendChild(barra);

    this.bPaso.addEventListener('click', function () { self.paso(); });
    this.bInstr.addEventListener('click', function () { self.instruccion(); });
    this.bFin.addEventListener('click', function () { self.hastaFinal(); });
    this.bReset.addEventListener('click', function () { self.cargar(self.clave, true); });

    // Narración del paso actual
    this.narracion = el('div', { class: 'cpu-narracion', 'aria-live': 'polite' });
    this.fase = el('span', { class: 'cpu-fase' });
    this.texto = el('p');
    this.narracion.appendChild(this.fase);
    this.narracion.appendChild(this.texto);
    r.appendChild(this.narracion);

    // Esquema: CPU · buses · memoria
    var esquema = el('div', { class: 'cpu-esquema' });
    var cpu = el('section', { class: 'cpu-bloque cpu-cpu', 'aria-label': 'Unidad central de proceso' });
    cpu.appendChild(el('h4', null, 'CPU'));
    var uc = el('div', { class: 'cpu-unidad', 'data-unidad': 'uc' });
    uc.appendChild(el('h5', null, 'Unidad de control'));
    var ual = el('div', { class: 'cpu-unidad', 'data-unidad': 'ual' });
    ual.appendChild(el('h5', null, 'UAL'));
    this.regs = {};
    function registro(padre, id, nombre, ayuda) {
      var caja = el('div', { class: 'cpu-reg', 'data-reg': id, title: ayuda });
      caja.appendChild(el('span', { class: 'cpu-reg-nombre' }, nombre));
      var valor = el('output', { class: 'cpu-reg-valor' }, '—');
      caja.appendChild(valor);
      padre.appendChild(caja);
      self.regs[id] = caja;
    }
    registro(uc, 'CP', 'CP', 'Contador de programa: dirección de la siguiente instrucción');
    registro(uc, 'RI', 'RI', 'Registro de instrucción: instrucción que se está ejecutando');
    this.deco = el('p', { class: 'cpu-deco' }, 'Decodificador: en espera');
    uc.appendChild(this.deco);
    registro(ual, 'AC', 'AC', 'Acumulador: guarda el resultado de las operaciones');
    this.operacion = el('p', { class: 'cpu-deco' }, 'Operador: en espera');
    ual.appendChild(this.operacion);
    cpu.appendChild(uc);
    cpu.appendChild(ual);

    var buses = el('section', { class: 'cpu-buses', 'aria-label': 'Buses del sistema' });
    this.buses = {};
    [['BA', 'Bus de direcciones'], ['BD', 'Bus de datos'], ['BC', 'Bus de control']].forEach(function (b) {
      var fila = el('div', { class: 'cpu-bus', 'data-bus': b[0] });
      fila.appendChild(el('span', { class: 'cpu-bus-nombre' }, b[1]));
      var v = el('output', { class: 'cpu-bus-valor' }, '');
      fila.appendChild(v);
      buses.appendChild(fila);
      self.buses[b[0]] = fila;
    });

    var mem = el('section', { class: 'cpu-bloque cpu-mem', 'aria-label': 'Unidad de memoria' });
    mem.appendChild(el('h4', null, 'Memoria'));
    var auxiliares = el('div', { class: 'cpu-unidad', 'data-unidad': 'um' });
    registro(auxiliares, 'RD', 'RD', 'Registro de direcciones: dirección de la celda que se va a leer o escribir');
    registro(auxiliares, 'RM', 'RM', 'Registro de memoria (datos): lo que se lee o se escribe');
    mem.appendChild(auxiliares);
    var tablaZona = el('div', { class: 'cpu-tabla-zona' });
    this.tabla = el('table', { class: 'cpu-tabla' });
    var cab = el('thead');
    var fc = el('tr');
    fc.appendChild(el('th', { scope: 'col' }, 'Dirección'));
    fc.appendChild(el('th', { scope: 'col' }, 'Contenido'));
    cab.appendChild(fc);
    this.tabla.appendChild(cab);
    this.cuerpo = el('tbody');
    this.tabla.appendChild(this.cuerpo);
    tablaZona.appendChild(this.tabla);
    mem.appendChild(tablaZona);

    this.edicion = el('form', { class: 'cpu-edicion', hidden: '' });
    this.edicion.innerHTML =
      '<p class="cpu-ayuda">Escribe tu programa celda a celda. Las instrucciones tienen 4 cifras: la primera es la operación y las tres siguientes la dirección.</p>' +
      '<label>Dirección <input name="dir" inputmode="numeric" pattern="[0-9]{1,3}" maxlength="3" required></label>' +
      '<label>Contenido <input name="val" inputmode="numeric" pattern="[0-9]{1,4}" maxlength="4" required></label>' +
      '<button type="submit">Guardar celda</button>' +
      '<label class="cpu-inicio">El programa empieza en <input name="inicio" inputmode="numeric" maxlength="3" value="100"></label>' +
      '<button type="button" data-vaciar class="sec">Vaciar memoria</button>' +
      '<p class="cpu-error" role="alert"></p>';
    mem.appendChild(this.edicion);
    this.edicion.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = parseInt(self.edicion.dir.value, 10), v = parseInt(self.edicion.val.value, 10);
      var err = self.edicion.querySelector('.cpu-error');
      if (isNaN(d) || d < 0 || d > 999 || isNaN(v) || v < 0 || v > 9999) {
        err.textContent = 'La dirección va de 000 a 999 y el contenido de 0000 a 9999.';
        return;
      }
      err.textContent = '';
      self.base[d] = v;
      self.cargar(self.clave, true);
      self.edicion.dir.value = tres(d + 1);
      self.edicion.val.value = '';
      self.edicion.val.focus();
    });
    this.edicion.inicio.addEventListener('change', function () {
      var v = parseInt(self.edicion.inicio.value, 10);
      if (!isNaN(v) && v >= 0 && v <= 999) { self.inicio = v; self.cargar(self.clave, true); }
    });
    this.edicion.querySelector('[data-vaciar]').addEventListener('click', function () {
      self.base = {};
      self.cargar(self.clave, true);
    });

    esquema.appendChild(cpu);
    esquema.appendChild(buses);
    esquema.appendChild(mem);
    r.appendChild(esquema);

    this.juegoZona = el('div', { class: 'cpu-juego' });
    r.appendChild(this.juegoZona);

    var traza = el('details', { class: 'cpu-traza' });
    traza.appendChild(el('summary', null, 'Traza: valor de los registros al terminar cada instrucción'));
    var zona = el('div', { class: 'aula-tabla', tabindex: '0', role: 'region', 'aria-label': 'Traza de registros' });
    this.traza = el('table', { class: 'cpu-tabla' });
    this.traza.innerHTML = '<thead><tr><th>Instrucción</th><th>CP</th><th>RI</th><th>RD</th><th>RM</th><th>AC</th><th>Qué ha pasado</th></tr></thead><tbody></tbody>';
    zona.appendChild(this.traza);
    traza.appendChild(zona);
    r.appendChild(traza);
  };

  Simulador.prototype.cargar = function (clave, mantenerBase) {
    var p = PROGRAMAS[clave];
    this.clave = clave;
    if (this.selector) this.selector.value = clave;
    if (!mantenerBase) {
      this.base = {};
      var m = p.memoria;
      Object.keys(m).forEach(function (k) { this.base[k] = m[k]; }, this);
      this.inicio = p.inicio;
    }
    this.programa = p;
    this.mem = {};
    Object.keys(this.base).forEach(function (k) { this.mem[k] = this.base[k]; }, this);
    this.est = { CP: this.inicio, RI: null, RD: null, RM: null, AC: 0 };
    this.cola = [];
    this.fin = false;
    this.contador = 0;
    this.edicion.hidden = !p.editable;
    if (p.editable) this.edicion.inicio.value = tres(this.inicio);
    this.traza.tBodies[0].innerHTML = '';
    this.pintarJuego();
    this.mostrar({ fase: 'Preparado', texto: 'El CP apunta a ' + tres(this.inicio) + '. Pulsa «Siguiente paso» para empezar la fase de búsqueda.' });
  };

  Simulador.prototype.pintarJuego = function () {
    var p = this.programa, z = this.juegoZona;
    z.innerHTML = '';
    z.appendChild(el('strong', null, 'Juego de instrucciones: '));
    var lista = el('ul');
    Object.keys(p.juego).forEach(function (c) {
      lista.appendChild(el('li', null, c + ' → ' + TEXTOS[p.juego[c]]));
    });
    lista.appendChild(el('li', null, '0000 → fin del programa'));
    z.appendChild(lista);
    if (p.nota) z.appendChild(el('p', null, p.nota));
  };

  Simulador.prototype.mostrar = function (paso) {
    var self = this, e = this.est;
    ['CP', 'RD'].forEach(function (k) {
      self.regs[k].querySelector('output').textContent = e[k] === null ? '—' : tres(e[k]);
    });
    ['RI', 'RM', 'AC'].forEach(function (k) {
      self.regs[k].querySelector('output').textContent = e[k] === null ? '—' : cuatro(e[k]);
    });
    Object.keys(this.regs).forEach(function (k) {
      self.regs[k].classList.toggle('activo', (paso.regs || []).indexOf(k) >= 0);
    });
    Object.keys(this.buses).forEach(function (k) {
      var activo = !!(paso.buses && paso.buses[k] !== undefined);
      self.buses[k].classList.toggle('activo', activo);
      self.buses[k].querySelector('output').textContent = activo ? paso.buses[k] : '';
    });
    this.raiz.querySelectorAll('.cpu-unidad').forEach(function (u) {
      u.classList.toggle('activo', (paso.unidades || []).indexOf(u.getAttribute('data-unidad')) >= 0);
    });
    this.deco.textContent = paso.deco || 'Decodificador: en espera';
    this.operacion.textContent = paso.oper || 'Operador: en espera';
    this.fase.textContent = paso.fase;
    this.fase.setAttribute('data-fase', paso.fase);
    this.texto.textContent = paso.texto;

    // Tabla de memoria: direcciones usadas, ordenadas
    var dirs = Object.keys(this.mem).map(Number).sort(function (a, b) { return a - b; });
    if (dirs.indexOf(e.CP) < 0 && !this.fin) dirs.push(e.CP), dirs.sort(function (a, b) { return a - b; });
    this.cuerpo.innerHTML = '';
    var anterior = null;
    dirs.forEach(function (d) {
      if (anterior !== null && d - anterior > 1) {
        var hueco = el('tr', { class: 'cpu-hueco' });
        hueco.appendChild(el('td', { colspan: '2' }, '⋮'));
        self.cuerpo.appendChild(hueco);
      }
      var fila = el('tr');
      if (d === e.CP && !self.fin) fila.classList.add('cp');
      if (paso.celda === d) fila.classList.add(paso.escritura ? 'escrita' : 'leida');
      var td = el('th', { scope: 'row' }, tres(d));
      if (d === e.CP && !self.fin) td.appendChild(el('span', { class: 'cpu-flecha' }, ' ← CP'));
      fila.appendChild(td);
      fila.appendChild(el('td', null, self.mem[d] === undefined ? '0000' : cuatro(self.mem[d])));
      self.cuerpo.appendChild(fila);
      anterior = d;
    });
    var bloqueado = this.fin;
    [this.bPaso, this.bInstr, this.bFin].forEach(function (b) { b.disabled = bloqueado; });
  };

  Simulador.prototype.leer = function (d) { return this.mem[d] === undefined ? 0 : this.mem[d]; };

  Simulador.prototype.encolarBusqueda = function () {
    var self = this, e = this.est;
    this.cola.push(function () {
      e.RD = e.CP;
      return { fase: 'Búsqueda', regs: ['CP', 'RD'], unidades: ['uc', 'um'], buses: { BA: tres(e.RD) },
        texto: 'La UC copia el CP (' + tres(e.CP) + ') en el registro de direcciones (RD). La dirección viaja por el bus de direcciones hasta la memoria.' };
    });
    this.cola.push(function () {
      e.RM = self.leer(e.RD);
      return { fase: 'Búsqueda', regs: ['RM'], unidades: ['um'], celda: e.RD, buses: { BC: 'L (leer)', BD: cuatro(e.RM) },
        texto: 'La UC activa la señal de lectura por el bus de control. La memoria lee la celda ' + tres(e.RD) + ' y deja su contenido (' + cuatro(e.RM) + ') en el registro de memoria (RM).' };
    });
    this.cola.push(function () {
      e.RI = e.RM;
      e.CP = e.CP + 1;
      return { fase: 'Búsqueda', regs: ['RI', 'CP'], unidades: ['uc'], buses: { BD: cuatro(e.RI) },
        texto: 'La instrucción ' + cuatro(e.RI) + ' pasa por el bus de datos al registro de instrucción (RI). El CP se incrementa y ya apunta a la siguiente: ' + tres(e.CP) + '.' };
    });
    this.cola.push(function () { return self.decodificar(); });
  };

  Simulador.prototype.decodificar = function () {
    var e = this.est, op = Math.floor(e.RI / 1000), dir = e.RI % 1000;
    var accion = this.programa.juego[op];
    if (e.RI === 0) {
      this.fin = true;
      return { fase: 'Fin', regs: ['RI'], unidades: ['uc'], deco: 'Decodificador: 0000 = fin',
        texto: 'La instrucción 0000 indica el final del programa. Resultado en el AC: ' + cuatro(e.AC) + '. Revisa la memoria para ver lo que se ha guardado.' };
    }
    if (!accion) {
      this.fin = true;
      return { fase: 'Error', regs: ['RI'], unidades: ['uc'], deco: 'Decodificador: operación ' + op + ' desconocida',
        texto: 'El código de operación ' + op + ' no existe en este juego de instrucciones. La CPU no sabe qué hacer y se detiene. ¿Has escrito bien la instrucción?' };
    }
    this.encolarEjecucion(accion, dir);
    return { fase: 'Decodificación', regs: ['RI'], unidades: ['uc'],
      deco: 'Decodificador: ' + op + ' = ' + accion + ' · dirección ' + tres(dir),
      texto: 'La UC decodifica ' + cuatro(e.RI) + ': la primera cifra (' + op + ') es la operación «' + TEXTOS[accion].charAt(0).toLowerCase() + TEXTOS[accion].slice(1) + '» y las tres últimas (' + tres(dir) + ') son la dirección del dato.' };
  };

  Simulador.prototype.encolarEjecucion = function (accion, dir) {
    var self = this, e = this.est;
    this.cola.push(function () {
      e.RD = dir;
      return { fase: 'Ejecución', regs: ['RD'], unidades: ['uc', 'um'], buses: { BA: tres(dir) },
        texto: 'La dirección del dato (' + tres(dir) + ') se copia en el RD y sale por el bus de direcciones.' };
    });
    if (accion === 'almacenar') {
      this.cola.push(function () {
        e.RM = e.AC;
        return { fase: 'Ejecución', regs: ['AC', 'RM'], unidades: ['ual', 'um'], buses: { BD: cuatro(e.AC) },
          texto: 'El contenido del AC (' + cuatro(e.AC) + ') viaja por el bus de datos hasta el RM.' };
      });
      this.cola.push(function () {
        self.mem[e.RD] = e.RM;
        self.cerrar('Guarda el AC (' + cuatro(e.AC) + ') en ' + tres(e.RD));
        return { fase: 'Ejecución', regs: ['RM'], unidades: ['um'], celda: e.RD, escritura: true, buses: { BC: 'E (escribir)' },
          texto: 'La UC activa la señal de escritura por el bus de control. La memoria guarda ' + cuatro(e.RM) + ' en la celda ' + tres(e.RD) + '. Fin de la instrucción.' };
      });
      return;
    }
    this.cola.push(function () {
      e.RM = self.leer(e.RD);
      return { fase: 'Ejecución', regs: ['RM'], unidades: ['um'], celda: e.RD, buses: { BC: 'L (leer)', BD: cuatro(e.RM) },
        texto: 'Lectura: la memoria entrega el dato de ' + tres(e.RD) + ' (' + cuatro(e.RM) + ') al RM por el bus de datos.' };
    });
    this.cola.push(function () {
      var antes = e.AC, oper;
      if (accion === 'cargar') {
        e.AC = e.RM;
        self.cerrar('Carga ' + cuatro(e.RM) + ' en el AC');
        return { fase: 'Ejecución', regs: ['RM', 'AC'], unidades: ['ual'], buses: { BD: cuatro(e.RM) },
          texto: 'El dato pasa del RM al acumulador (AC). Ahora AC = ' + cuatro(e.AC) + '. Fin de la instrucción.' };
      }
      if (accion === 'dividir' && e.RM === 0) {
        self.fin = true;
        return { fase: 'Error', regs: ['RM', 'AC'], unidades: ['ual'], oper: 'Operador: división entre 0',
          texto: 'La UAL no puede dividir entre 0. La CPU detiene el programa (en un ordenador real se produciría una excepción).' };
      }
      if (accion === 'sumar') e.AC = antes + e.RM;
      if (accion === 'restar') e.AC = antes - e.RM;
      if (accion === 'multiplicar') e.AC = antes * e.RM;
      if (accion === 'dividir') e.AC = Math.trunc(antes / e.RM);
      oper = antes + ' ' + SIGNO[accion] + ' ' + e.RM + ' = ' + e.AC;
      self.cerrar({ sumar: 'Suma', restar: 'Resta', multiplicar: 'Multiplica', dividir: 'Divide' }[accion] + ': ' + oper);
      return { fase: 'Ejecución', regs: ['RM', 'AC'], unidades: ['ual'], oper: 'Operador: ' + oper,
        texto: 'La UC ordena a la UAL que opere el AC con el RM: ' + oper + '. El resultado queda en el AC. Fin de la instrucción.' };
    });
  };

  Simulador.prototype.cerrar = function (resumen) {
    var e = this.est, fila = el('tr');
    this.contador++;
    [tres(e.CP - 1), tres(e.CP), cuatro(e.RI), tres(e.RD), cuatro(e.RM === null ? 0 : e.RM), cuatro(e.AC), resumen].forEach(function (v, i) {
      fila.appendChild(el(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : null, v));
    });
    this.traza.tBodies[0].appendChild(fila);
    this.finInstruccion = true;
  };

  Simulador.prototype.paso = function () {
    if (this.fin) return;
    if (!this.cola.length) this.encolarBusqueda();
    var paso = this.cola.shift()();
    this.mostrar(paso);
    return paso;
  };

  Simulador.prototype.instruccion = function () {
    this.finInstruccion = false;
    var limite = 20;
    while (!this.fin && !this.finInstruccion && limite--) this.paso();
  };

  Simulador.prototype.hastaFinal = function () {
    var limite = 400;
    while (!this.fin && limite--) this.paso();
    if (!this.fin) this.mostrar({ fase: 'Detenido', texto: 'El programa lleva demasiados pasos y se ha detenido. Comprueba que termina con una celda 0000.' });
  };

  function iniciar() {
    document.querySelectorAll('.cpu-sim').forEach(function (r) { r.simulador = new Simulador(r); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  window.CPU_PROGRAMAS = PROGRAMAS;
})();
