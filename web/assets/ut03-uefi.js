/* Simulador de UEFI del tema 3 de 0221. Sin dependencias.
   <div class="uefi-sim"></div> monta la UEFI; <ol class="misiones" data-misiones> recibe las misiones.
   Los cambios solo cuentan cuando se guardan (F10), como en una UEFI real. */
(function () {
  'use strict';

  var DEFECTO = {
    xmp: 'Desactivado', virt: 'Desactivado', ptt: 'Desactivado', csm: 'Activado', secure: 'Desactivado',
    fast: 'Activado', sata: 'AHCI', audio: 'Activado', resbar: 'Desactivado', fanCpu: 'Estándar', fanSys: 'PWM',
    orden: ['sata', 'nvme', 'usb', 'pxe'], admin: ''
  };
  var DISPOSITIVOS = {
    sata: 'SATA: WDC WD10EZEX 1 TB (datos)',
    nvme: 'Windows Boot Manager (NVMe: SSD 1 TB)',
    usb: 'UEFI: USB Kingston DataTraveler 32 GB',
    pxe: 'Red: arranque PXE (Intel Ethernet)'
  };
  var AYUDA = {
    fecha: 'Fecha y hora del reloj de la placa (RTC). Las mantiene la pila CR2032 cuando el equipo está desenchufado.',
    xmp: 'Perfil de memoria del fabricante del módulo. Desactivado, la memoria va a la velocidad estándar JEDEC (4800 MT/s). Con XMP I trabaja a la velocidad anunciada (6000 MT/s). XMP II es el mismo perfil con ajustes secundarios de la placa.',
    virt: 'Intel VT-x (en AMD se llama SVM). Necesario para máquinas virtuales (VirtualBox, VMware, Hyper-V) y WSL.',
    ptt: 'TPM 2.0 por firmware integrado en el procesador (Intel PTT; en AMD, fTPM). Lo exige Windows 11 y lo usa BitLocker.',
    csm: 'Compatibility Support Module: permite arrancar sistemas antiguos en modo BIOS (Legacy, discos MBR). Hay que desactivarlo para usar Secure Boot.',
    secure: 'Solo deja arrancar gestores de arranque con firma digital válida. Protege contra malware de arranque. Necesita el CSM desactivado.',
    fast: 'Se salta parte de las comprobaciones del POST para arrancar antes. Si está activado puede no dar tiempo a pulsar Supr.',
    sata: 'Modo de la controladora SATA. AHCI es el normal para discos y SSD SATA.',
    audio: 'Activa o desactiva el sonido integrado (por ejemplo, si se instala una tarjeta de sonido).',
    resbar: 'Resizable BAR: el procesador accede a toda la memoria de la gráfica de una vez. Mejora algo el rendimiento en juegos. Necesita UEFI sin CSM.',
    fanCpu: 'Perfil del ventilador del procesador: cuánto gira según la temperatura. Silencioso gira menos y hace menos ruido; Turbo enfría más.',
    fanSys: 'Modo del conector del ventilador de la caja: PWM (ventiladores de 4 pines) o DC (3 pines, regula bajando la tensión).',
    orden: 'Orden en que la UEFI busca un sistema que arrancar. Usa las flechas para subir o bajar cada dispositivo.',
    admin: 'Contraseña de administrador: se pide para entrar en esta configuración. No impide arrancar el sistema operativo.',
    monitor: 'Lecturas de los sensores de la placa en tiempo real.',
    info: 'Datos del sistema detectados en el POST: versión del firmware, procesador y memoria. Si un componente no aparece aquí, la placa no lo ha reconocido.',
    oc: 'Ajustes de overclock. En Auto, la placa usa los valores de fábrica. Subirlos sin saber puede hacer el equipo inestable o dañarlo.'
  };
  var MISIONES = [
    { id: 'usb', t: 'Vas a instalar un sistema operativo desde un USB: haz que el equipo arranque primero desde la memoria USB.', ok: function (s) { return s.orden[0] === 'usb'; } },
    { id: 'xmp', t: 'Los módulos son DDR5-6000, pero el sistema dice que van a 4800 MT/s. Haz que funcionen a su velocidad.', ok: function (s) { return s.xmp !== 'Desactivado'; } },
    { id: 'w11', t: 'Prepara el equipo para Windows 11: TPM 2.0 activado, CSM desactivado y Secure Boot activado.', ok: function (s) { return s.ptt === 'Activado' && s.csm === 'Desactivado' && s.secure === 'Activado'; } },
    { id: 'virt', t: 'Vas a usar VirtualBox en clase: activa la virtualización del procesador.', ok: function (s) { return s.virt === 'Activado'; } },
    { id: 'fan', t: 'El equipo es para una biblioteca y tiene que hacer poco ruido: pon el ventilador de la CPU en modo silencioso.', ok: function (s) { return s.fanCpu === 'Silencioso'; } },
    { id: 'pass', t: 'Que nadie pueda cambiar esta configuración: pon una contraseña de administrador.', ok: function (s) { return s.admin.length >= 4; } },
    { id: 'lect', t: 'Mira en el monitor del hardware la temperatura de la CPU y escríbela aquí (solo el número):', lectura: true }
  ];

  var CLAVE = 'ut03-uefi-v1';
  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function leer() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function Simulador(raiz, lista) {
    var previo = leer() || {};
    this.raiz = raiz; this.lista = lista;
    this.guardado = previo.guardado || copia(DEFECTO);
    this.actual = copia(this.guardado);
    this.lectura = previo.lectura || '';
    this.pestana = 'principal';
    this.temp = 41;
    this.mensaje = '';
    this.montar();
  }

  Simulador.prototype.cambios = function () { return JSON.stringify(this.actual) !== JSON.stringify(this.guardado); };

  Simulador.prototype.montar = function () {
    var self = this;
    this.raiz.innerHTML =
      '<div class="uefi" role="application" aria-label="Simulador de UEFI">' +
      '<div class="uefi-cab"><strong>UEFI BIOS · Placa del taller Z890 · Modo avanzado</strong><span id="uefi-reloj"></span></div>' +
      '<div class="uefi-pestanas" role="tablist"></div>' +
      '<div class="uefi-cuerpo"><div class="uefi-opciones" role="tabpanel"></div><aside class="uefi-ayuda" aria-live="polite"><h4>Ayuda</h4><p>Elige una opción para ver qué hace.</p></aside></div>' +
      '<div class="uefi-pie"><span>F5: valores por defecto · F10: guardar y salir · Esc: descartar cambios</span><span><button type="button" data-acc="f5">F5</button> <button type="button" data-acc="esc">Esc</button> <button type="button" data-acc="f10">F10 Guardar y salir</button></span></div>' +
      '</div>';
    var tabs = [['principal', 'Principal'], ['oc', 'Overclock'], ['avanzado', 'Avanzado'], ['monitor', 'Monitor'], ['arranque', 'Arranque'], ['seguridad', 'Seguridad'], ['salir', 'Salir']];
    var zona = this.raiz.querySelector('.uefi-pestanas');
    tabs.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.tab = t[0]; b.textContent = t[1];
      b.addEventListener('click', function () { self.pestana = t[0]; self.mensaje = ''; self.pintar(); });
      zona.appendChild(b);
    });
    this.raiz.addEventListener('change', function (e) {
      var k = e.target.dataset.opt;
      if (!k) return;
      if (k === 'secure' && e.target.value === 'Activado' && self.actual.csm === 'Activado') {
        e.target.value = 'Desactivado';
        self.mensaje = 'No se puede activar Secure Boot con el CSM activado. Desactiva antes el CSM (pestaña Arranque).';
        self.pintar(); return;
      }
      if (k === 'resbar' && e.target.value === 'Activado' && self.actual.csm === 'Activado') {
        e.target.value = 'Desactivado';
        self.mensaje = 'Resizable BAR necesita el CSM desactivado.';
        self.pintar(); return;
      }
      if (k === 'csm' && e.target.value === 'Activado') { self.actual.secure = 'Desactivado'; self.actual.resbar = 'Desactivado'; }
      self.actual[k] = e.target.value;
      self.mensaje = '';
      self.pintar();
    });
    this.raiz.addEventListener('focusin', function (e) {
      var fila = e.target.closest('[data-ayuda]');
      if (fila) self.ayuda(fila.dataset.ayuda);
    });
    this.raiz.addEventListener('mouseover', function (e) {
      var fila = e.target.closest('[data-ayuda]');
      if (fila) self.ayuda(fila.dataset.ayuda);
    });
    this.raiz.addEventListener('click', function (e) {
      var b = e.target.closest('[data-acc]');
      if (!b) return;
      var a = b.dataset.acc;
      if (a === 'subir' || a === 'bajar') {
        var i = +b.dataset.i, j = a === 'subir' ? i - 1 : i + 1, o = self.actual.orden;
        if (j < 0 || j >= o.length) return;
        var t = o[i]; o[i] = o[j]; o[j] = t;
        self.pintar();
        var foco = self.raiz.querySelector('[data-acc="' + a + '"][data-i="' + j + '"]') || self.raiz.querySelector('[data-acc][data-i="' + j + '"]');
        if (foco) foco.focus();
      } else if (a === 'pass') {
        var campo = self.raiz.querySelector('#uefi-pass');
        if (campo.value.length < 4) { self.mensaje = 'La contraseña tiene que tener al menos 4 caracteres.'; }
        else { self.actual.admin = campo.value; self.mensaje = 'Contraseña de administrador establecida (pendiente de guardar).'; }
        self.pintar();
      } else if (a === 'quitar-pass') { self.actual.admin = ''; self.mensaje = 'Contraseña eliminada (pendiente de guardar).'; self.pintar(); }
      else if (a === 'f10') self.dialogoGuardar();
      else if (a === 'confirmar') self.guardarCambios();
      else if (a === 'cancelar') { self.mensaje = ''; self.pintar(); }
      else if (a === 'f5') { var pass = self.actual.admin; self.actual = copia(DEFECTO); self.actual.admin = pass; self.mensaje = 'Valores por defecto cargados. Recuerda que no se aplican hasta que guardes (F10).'; self.pintar(); }
      else if (a === 'esc') { self.actual = copia(self.guardado); self.mensaje = 'Cambios descartados: se mantiene la última configuración guardada.'; self.pintar(); }
      else if (a === 'reiniciar-todo') { self.guardado = copia(DEFECTO); self.actual = copia(DEFECTO); self.lectura = ''; self.mensaje = 'Simulador reiniciado.'; guardar({ guardado: self.guardado, lectura: '' }); self.pintar(); }
    });
    this.raiz.addEventListener('keydown', function (e) {
      if (e.key === 'F10') { e.preventDefault(); self.dialogoGuardar(); }
      else if (e.key === 'F5') { e.preventDefault(); self.raiz.querySelector('[data-acc=f5]').click(); }
      else if (e.key === 'Escape') { self.raiz.querySelector('[data-acc=esc]').click(); }
    });
    setInterval(function () {
      var r = self.raiz.querySelector('#uefi-reloj');
      if (r) r.textContent = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' });
      if (self.pestana === 'monitor') self.pintarSensores();
    }, 1000);
    this.pintar();
    this.pintarMisiones();
  };

  Simulador.prototype.ayuda = function (k) {
    var a = this.raiz.querySelector('.uefi-ayuda');
    a.innerHTML = '<h4>Ayuda</h4><p>' + esc(AYUDA[k] || '') + '</p>' + (this.mensaje ? '<p style="color:#ffcf8a"><strong>' + esc(this.mensaje) + '</strong></p>' : '');
  };

  function fila(clave, nombre, contenido) {
    return '<div class="uefi-fila" data-ayuda="' + clave + '"><span class="nombre">' + nombre + '</span>' + contenido + '</div>';
  }
  function selector(s, clave, nombre, valores) {
    var id = 'uefi-' + clave;
    return '<div class="uefi-fila" data-ayuda="' + clave + '"><label for="' + id + '">' + nombre + '</label><select id="' + id + '" data-opt="' + clave + '">' +
      valores.map(function (v) { return '<option' + (s[clave] === v ? ' selected' : '') + '>' + v + '</option>'; }).join('') + '</select></div>';
  }

  Simulador.prototype.sensores = function () {
    var s = this.guardado;
    var rpm = { 'Silencioso': 640, 'Estándar': 880, 'Turbo': 1450 }[s.fanCpu];
    return [['Temperatura de la CPU', this.temp + ' °C'], ['Temperatura de la placa', '34 °C'], ['Ventilador CPU_FAN', rpm + ' RPM'], ['Ventilador SYS_FAN1', '720 RPM'],
      ['Tensión Vcore', '1,182 V'], ['+12 V', '12,072 V'], ['+5 V', '5,040 V'], ['+3,3 V', '3,312 V']];
  };
  Simulador.prototype.pintarSensores = function () {
    var z = this.raiz.querySelector('#uefi-sensores');
    if (!z) return;
    this.temp = 40 + Math.round(Math.random() * 2);
    z.innerHTML = this.sensores().map(function (x) { return fila('monitor', x[0], '<span class="valor">' + x[1] + '</span>'); }).join('');
  };

  Simulador.prototype.pintar = function () {
    var s = this.actual, self = this, h = '';
    this.raiz.querySelectorAll('[role=tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === self.pestana)); });
    var mts = s.xmp !== 'Desactivado' ? 6000 : 4800;
    if (this.pestana === 'principal') {
      h += '<p class="uefi-sub">Sistema</p>' +
        fila('fecha', 'Fecha y hora', '<span class="valor" id="uefi-fecha">' + new Date().toLocaleDateString('es-ES') + '</span>') +
        fila('info', 'Versión de la UEFI', '<span class="valor">2104 (15/09/2026)</span>') +
        fila('info', 'Procesador', '<span class="valor">Intel Core Ultra 5 245K</span>') +
        fila('info', 'Memoria total', '<span class="valor">32 GB (2 × 16 GB) · ' + mts + ' MT/s</span>');
    } else if (this.pestana === 'oc') {
      h += '<p class="uefi-sub">Memoria</p>' + selector(s, 'xmp', 'Perfil de memoria (XMP)', ['Desactivado', 'XMP I', 'XMP II']) +
        fila('xmp', 'Velocidad resultante', '<span class="valor">DDR5-' + (s.xmp === 'Desactivado' ? 4800 : 6000) + ' · CL' + (s.xmp === 'Desactivado' ? 40 : 30) + '</span>') +
        '<p class="uefi-sub">Procesador</p>' + fila('oc', 'Multiplicador de los núcleos P', '<span class="valor">Auto</span>') + fila('oc', 'Tensión de los núcleos', '<span class="valor">Auto</span>');
    } else if (this.pestana === 'avanzado') {
      h += '<p class="uefi-sub">Procesador</p>' + selector(s, 'virt', 'Tecnología de virtualización (VT-x)', ['Desactivado', 'Activado']) +
        '<p class="uefi-sub">Seguridad de la plataforma</p>' + selector(s, 'ptt', 'TPM por firmware (Intel PTT)', ['Desactivado', 'Activado']) +
        '<p class="uefi-sub">Dispositivos integrados</p>' + selector(s, 'sata', 'Modo SATA', ['AHCI', 'RAID']) + selector(s, 'audio', 'Audio HD integrado', ['Activado', 'Desactivado']) +
        '<p class="uefi-sub">PCI Express</p>' + selector(s, 'resbar', 'Resizable BAR', ['Desactivado', 'Activado']);
    } else if (this.pestana === 'monitor') {
      h += '<p class="uefi-sub">Sensores</p><div id="uefi-sensores"></div><p class="uefi-sub">Control de ventiladores</p>' +
        selector(s, 'fanCpu', 'Perfil CPU_FAN', ['Silencioso', 'Estándar', 'Turbo']) + selector(s, 'fanSys', 'Modo SYS_FAN1', ['PWM', 'DC']) +
        '<svg class="uefi-grafica" viewBox="0 0 300 120" role="img" aria-label="Curva del ventilador ' + s.fanCpu + '">' + this.curva(s.fanCpu) + '</svg>';
    } else if (this.pestana === 'arranque') {
      h += '<p class="uefi-sub">Configuración de arranque</p>' + selector(s, 'fast', 'Arranque rápido (Fast Boot)', ['Activado', 'Desactivado']) +
        selector(s, 'csm', 'CSM (compatibilidad con BIOS Legacy)', ['Activado', 'Desactivado']) +
        '<p class="uefi-sub">Prioridad de arranque</p><ol class="uefi-orden" data-ayuda="orden">' + s.orden.map(function (d, i) {
          return '<li><strong>' + (i + 1) + '.</strong><span>' + esc(DISPOSITIVOS[d]) + '</span>' +
            '<button type="button" data-acc="subir" data-i="' + i + '" aria-label="Subir ' + esc(DISPOSITIVOS[d]) + '"' + (i === 0 ? ' disabled' : '') + '>▲</button>' +
            '<button type="button" data-acc="bajar" data-i="' + i + '" aria-label="Bajar ' + esc(DISPOSITIVOS[d]) + '"' + (i === s.orden.length - 1 ? ' disabled' : '') + '>▼</button></li>';
        }).join('') + '</ol>';
    } else if (this.pestana === 'seguridad') {
      h += '<p class="uefi-sub">Arranque seguro</p>' + selector(s, 'secure', 'Secure Boot', ['Desactivado', 'Activado']) +
        fila('secure', 'Estado', '<span class="valor">' + (this.guardado.secure === 'Activado' ? 'Activo' : 'Inactivo') + '</span>') +
        '<p class="uefi-sub">Contraseñas</p>' +
        fila('admin', 'Contraseña de administrador', '<span class="valor">' + (s.admin ? 'Establecida' : 'Sin establecer') + '</span>') +
        '<div class="uefi-fila" data-ayuda="admin"><label for="uefi-pass">Nueva contraseña</label><input id="uefi-pass" type="password" autocomplete="off"> <button type="button" data-acc="pass">Establecer</button>' +
        (s.admin ? ' <button type="button" data-acc="quitar-pass">Quitar</button>' : '') + '</div>';
    } else if (this.pestana === 'salir') {
      h += '<p class="uefi-sub">Salir</p>' +
        '<div class="uefi-fila"><span class="nombre">Guardar los cambios y reiniciar</span><button type="button" data-acc="f10">F10</button></div>' +
        '<div class="uefi-fila"><span class="nombre">Descartar los cambios</span><button type="button" data-acc="esc">Esc</button></div>' +
        '<div class="uefi-fila"><span class="nombre">Cargar valores por defecto</span><button type="button" data-acc="f5">F5</button></div>' +
        '<div class="uefi-fila"><span class="nombre">Reiniciar el simulador (borra las misiones)</span><button type="button" data-acc="reiniciar-todo">Reiniciar</button></div>';
    }
    if (this.cambios()) h += '<p class="uefi-sub" style="color:#ffcf8a">Hay cambios sin guardar</p>';
    if (this.dialogo) h = this.dialogo;
    this.raiz.querySelector('.uefi-opciones').innerHTML = h;
    if (this.pestana === 'monitor') this.pintarSensores();
    this.ayuda(this.pestana === 'monitor' ? 'monitor' : ({ oc: 'xmp', avanzado: 'virt', arranque: 'orden', seguridad: 'secure' }[this.pestana] || 'fecha'));
    if (this.lista && this.lista.childElementCount) this.pintarMisiones();
  };

  Simulador.prototype.curva = function (perfil) {
    var p = { 'Silencioso': [[20, 20], [50, 25], [70, 50], [85, 100]], 'Estándar': [[20, 30], [50, 40], [70, 70], [85, 100]], 'Turbo': [[20, 50], [50, 70], [70, 100], [85, 100]] }[perfil];
    var x = function (t) { return 30 + (t - 20) / 80 * 260; }, y = function (v) { return 105 - v; };
    var pts = p.map(function (q) { return x(q[0]) + ',' + y(q[1]); }).join(' ');
    return '<line x1="30" y1="105" x2="295" y2="105" stroke="#3b5468"/><line x1="30" y1="5" x2="30" y2="105" stroke="#3b5468"/>' +
      '<text x="160" y="118" fill="#a9bccb" font-size="9" text-anchor="middle">temperatura (20–100 °C)</text><text x="4" y="10" fill="#a9bccb" font-size="9">100 %</text>' +
      '<polyline points="' + pts + '" fill="none" stroke="#f2a33a" stroke-width="3"/>' +
      p.map(function (q) { return '<circle cx="' + x(q[0]) + '" cy="' + y(q[1]) + '" r="4" fill="#f2a33a"/>'; }).join('');
  };

  Simulador.prototype.dialogoGuardar = function () {
    var self = this, lista = [];
    Object.keys(this.actual).forEach(function (k) {
      if (JSON.stringify(self.actual[k]) !== JSON.stringify(self.guardado[k])) {
        lista.push(k === 'orden' ? 'Prioridad de arranque: primero ' + DISPOSITIVOS[self.actual.orden[0]] : k === 'admin' ? 'Contraseña de administrador' : (k + ': ' + self.guardado[k] + ' → ' + self.actual[k]));
      }
    });
    this.dialogo = '<div class="uefi-dialogo" role="alertdialog" aria-label="Guardar cambios"><p><strong>¿Guardar la configuración y reiniciar?</strong></p>' +
      (lista.length ? '<ul>' + lista.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '<p>No hay cambios.</p>') +
      '<p><button type="button" data-acc="confirmar">Sí, guardar</button> <button type="button" data-acc="cancelar">No</button></p></div>';
    this.pintar();
    var b = this.raiz.querySelector('[data-acc=confirmar]'); if (b) b.focus();
  };

  Simulador.prototype.guardarCambios = function () {
    this.guardado = copia(this.actual);
    this.dialogo = null;
    this.mensaje = 'Configuración guardada. El equipo se ha reiniciado.';
    guardar({ guardado: this.guardado, lectura: this.lectura });
    this.pintar();
    this.pintarMisiones();
  };

  Simulador.prototype.pintarMisiones = function () {
    if (!this.lista) return;
    var self = this, hechas = 0;
    this.lista.innerHTML = MISIONES.map(function (m, i) {
      var ok;
      if (m.lectura) ok = self.lectura !== '' && Math.abs(parseFloat(self.lectura) - self.temp) <= 2;
      else ok = m.ok(self.guardado);
      if (ok) hechas++;
      var pend = !m.lectura && !ok && m.ok(self.actual) ? ' <em>(hecho, pero sin guardar: pulsa F10)</em>' : '';
      return '<li class="' + (ok ? 'hecha' : '') + '"><span class="estado" aria-hidden="true">' + (ok ? '✓' : i + 1) + '</span><span>' + esc(m.t) + pend +
        (m.lectura ? ' <input type="number" class="lectura" aria-label="Temperatura de la CPU en grados" value="' + esc(self.lectura) + '" style="width:5rem"> °C' : '') +
        '<span class="sr">' + (ok ? ' Completada.' : ' Pendiente.') + '</span></span></li>';
    }).join('');
    var res = document.getElementById('misiones-resumen');
    if (res) res.textContent = hechas + ' de ' + MISIONES.length + ' misiones completadas' + (hechas === MISIONES.length ? '. ¡Enhorabuena!' : '.');
    var campo = this.lista.querySelector('.lectura');
    if (campo) campo.addEventListener('change', function () { self.lectura = campo.value; guardar({ guardado: self.guardado, lectura: self.lectura }); self.pintarMisiones(); });
  };

  function iniciar() {
    var raiz = document.querySelector('.uefi-sim');
    if (raiz) raiz.simulador = new Simulador(raiz, document.querySelector('[data-misiones]'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
