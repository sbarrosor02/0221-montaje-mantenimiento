/* Test del tema 2 de 0221. Sin dependencias.
   Banco de preguntas por apartado de la teoría (a = apartado, ce = criterio de RA1).
   Cada test saca preguntas al azar del banco y baraja las opciones.
   <div class="test-ut02"> se convierte en el test completo. */
(function () {
  'use strict';

  var APARTADOS = {
    '2.1': 'Del mundo analógico al digital', '2.2': 'Representación de la información',
    '2.3': 'Puertas lógicas', '2.4': 'Von Neumann y Harvard', '2.5': 'Las unidades funcionales',
    '2.6': 'Los buses', '2.7': 'El ciclo de instrucción', '2.8': 'Niveles de un ordenador'
  };

  /* c = índice de la opción correcta (0-3) en el orden escrito aquí; se baraja al mostrarla. */
  var BANCO = [
    // 2.1
    { a: '2.1', p: '¿Por qué los ordenadores trabajan solo con dos estados (0 y 1)?', o: ['Porque distinguir dos niveles de tensión es muy fiable aunque haya ruido', 'Porque los transistores solo pueden fabricarse con dos patillas', 'Porque el sistema decimal es más lento de escribir', 'Porque así se gasta más energía y el equipo va más rápido'], c: 0, e: 'Con solo «hay tensión» y «no hay tensión», una interferencia difícilmente convierte un valor en otro.' },
    { a: '2.1', p: '¿Cuántas combinaciones distintas se pueden formar con 8 bits?', o: ['256', '8', '16', '128'], c: 0, e: 'Con n bits hay 2ⁿ combinaciones: 2⁸ = 256.' },
    { a: '2.1', p: 'Una calculadora tiene 10 teclas numéricas (0 a 9). ¿Cuántos bits necesita como mínimo para codificarlas?', o: ['4', '3', '5', '10'], c: 0, e: '2³ = 8 no llega; 2⁴ = 16 sí.' },
    { a: '2.1', p: '¿Cuántos bits tiene un nibble (cuarteto)?', o: ['4', '8', '2', '16'], c: 0, e: 'Un nibble son 4 bits: justo una cifra hexadecimal.' },
    { a: '2.1', p: '¿Cuál de estas magnitudes es analógica?', o: ['La temperatura real de una habitación', 'El número de alumnos de la clase', 'Las teclas pulsadas en un teclado', 'Los bits de un archivo'], c: 0, e: 'La temperatura puede tomar infinitos valores entre dos puntos.' },
    // 2.2
    { a: '2.2', p: '¿Qué número decimal es 0010 1101₂?', o: ['45', '43', '90', '101'], c: 0, e: '32 + 8 + 4 + 1 = 45.' },
    { a: '2.2', p: '¿Cómo se escribe 13 en binario con 8 bits?', o: ['0000 1101', '0000 1011', '0001 0011', '0000 1110'], c: 0, e: '13 = 8 + 4 + 1.' },
    { a: '2.2', p: '¿Cómo se escribe 0110 1100₂ en hexadecimal?', o: ['6C', 'C6', '612', '6B'], c: 0, e: 'Se agrupa de cuatro en cuatro: 0110 = 6 y 1100 = C.' },
    { a: '2.2', p: '¿Qué número decimal es 0x2E?', o: ['46', '32', '214', '30'], c: 0, e: '2 · 16 + 14 = 46 (E = 14).' },
    { a: '2.2', p: '¿A cuántos bits equivale exactamente una cifra hexadecimal?', o: ['4', '2', '8', '16'], c: 0, e: 'Por eso el hexadecimal es tan cómodo para escribir binario.' },
    { a: '2.2', p: 'Compras un disco de 1 TB y Windows muestra 931 GB. ¿Qué ocurre?', o: ['Windows cuenta en base 1024 y el fabricante en base 1000', 'El disco viene defectuoso', 'El sistema operativo ocupa 69 GB', 'El disco está formateado en FAT32'], c: 0, e: '10¹² bytes ÷ 1024³ ≈ 931. No falta espacio: cambia la forma de contar.' },
    { a: '2.2', p: '¿Cuántos bytes tiene 1 KiB (kibibyte)?', o: ['1024', '1000', '1024 · 1024', '8'], c: 0, e: 'Los prefijos IEC (Ki, Mi, Gi…) son de base 2.' },
    { a: '2.2', p: 'En ASCII, ¿qué número corresponde a la letra «A»?', o: ['65', '97', '1', '41'], c: 0, e: 'La «A» es el 65 (0x41) y la «a» el 97.' },
    { a: '2.2', p: '¿Cómo se escribe 45 en BCD?', o: ['0100 0101', '0010 1101', '0100 1001', '0101 0100'], c: 0, e: 'En BCD cada cifra decimal va por separado: 4 = 0100 y 5 = 0101.' },
    { a: '2.2', p: '¿Por qué hoy se usa Unicode (UTF-8) en lugar de ASCII?', o: ['Porque ASCII solo tiene 128 caracteres y no incluye la ñ ni las tildes', 'Porque ASCII ocupa más memoria', 'Porque ASCII solo sirve para números', 'Porque ASCII no funciona en Windows'], c: 0, e: 'Unicode tiene sitio para todos los idiomas y para los emojis.' },
    // 2.3
    { a: '2.3', p: '¿Qué sale de una puerta AND con entradas A = 1 y B = 0?', o: ['0', '1', 'Depende de la puerta anterior', 'No está definido'], c: 0, e: 'La AND solo da 1 si todas sus entradas valen 1.' },
    { a: '2.3', p: '¿Qué sale de una puerta NOR con entradas A = 0 y B = 0?', o: ['1', '0', '00', 'No está definido'], c: 0, e: 'OR de 0 y 0 es 0; la NOR lo invierte: 1.' },
    { a: '2.3', p: '¿Cuándo vale 1 la salida de una XOR de dos entradas?', o: ['Cuando sus entradas son distintas', 'Cuando sus entradas son iguales', 'Cuando las dos valen 1', 'Siempre que alguna vale 1'], c: 0, e: 'XOR = O exclusiva: 1 si una vale 1 y la otra 0.' },
    { a: '2.3', p: '¿Qué sale de una puerta NAND con entradas A = 1 y B = 1?', o: ['0', '1', '11', '2'], c: 0, e: 'AND de 1 y 1 es 1; la NAND lo invierte: 0.' },
    { a: '2.3', p: 'Un circuito tiene tres entradas (A, B y C). ¿Cuántas filas tiene su tabla de verdad?', o: ['8', '3', '6', '9'], c: 0, e: 'Con n entradas hay 2ⁿ filas: 2³ = 8.' },
    { a: '2.3', p: 'En un semisumador, ¿qué puertas dan la suma y el acarreo?', o: ['Suma: XOR · acarreo: AND', 'Suma: OR · acarreo: AND', 'Suma: AND · acarreo: XOR', 'Suma: NOT · acarreo: OR'], c: 0, e: '1 + 1 = 10: la cifra (0) se comporta como XOR y la llevada (1) como AND.' },
    { a: '2.3', p: '¿Qué tiene un circuito secuencial que no tiene uno combinacional?', o: ['Memoria: su salida depende también de lo que pasó antes', 'Más de dos entradas', 'Puertas NOT', 'Una salida por cada entrada'], c: 0, e: 'Su pieza básica es el biestable, que guarda 1 bit.' },
    { a: '2.3', p: 'En un esquema, dos cables se cruzan con un pequeño salto y sin punto. ¿Qué significa?', o: ['Que no están unidos', 'Que están unidos', 'Que hay un cortocircuito', 'Que uno de los dos vale 0'], c: 0, e: 'Solo un punto indica unión.' },
    // 2.4
    { a: '2.4', p: '¿Cuál es la idea de «programa almacenado» del modelo de Von Neumann?', o: ['Datos e instrucciones se guardan juntos en la misma memoria', 'Los programas se guardan en el disco duro', 'Cada programa necesita su propio procesador', 'Las instrucciones se graban en los circuitos'], c: 0, e: 'Para cambiar lo que hace la máquina basta con cargar otro programa.' },
    { a: '2.4', p: '¿Qué forma la unidad central de proceso (CPU)?', o: ['Unidad de control, UAL y registros', 'Memoria principal y buses', 'Unidad de E/S y memoria', 'Placa base y fuente de alimentación'], c: 0, e: 'Si se añaden la memoria, la E/S y los buses, se tiene el ordenador completo.' },
    { a: '2.4', p: '¿En qué consiste el cuello de botella de Von Neumann?', o: ['La CPU no puede leer una instrucción y un dato a la vez y espera a la memoria', 'El disco duro es más lento que el SSD', 'La UAL solo puede sumar', 'Los periféricos no pueden usar el bus'], c: 0, e: 'Instrucciones y datos comparten memoria y buses; la caché ayuda a aliviarlo.' },
    { a: '2.4', p: '¿Qué caracteriza a la arquitectura Harvard?', o: ['Memorias y buses separados para instrucciones y datos', 'Una sola memoria para todo', 'No tiene unidad de control', 'Solo se usa en servidores'], c: 0, e: 'Se usa en microcontroladores como el de Arduino Uno y en los DSP.' },
    { a: '2.4', p: 'En el modelo de Von Neumann, un SSD es…', o: ['un periférico de almacenamiento (unidad de E/S)', 'parte de la memoria principal', 'un registro de la CPU', 'un bus'], c: 0, e: 'La CPU no ejecuta programas desde el disco: primero los copia a la RAM.' },
    { a: '2.4', p: '¿A qué bloque funcional corresponde un módulo de memoria DDR5?', o: ['Memoria principal', 'Unidad de E/S', 'CPU', 'Bus de datos'], c: 0, e: 'Los módulos de RAM son la memoria principal.' },
    // 2.5
    { a: '2.5', p: '¿Qué guarda el registro de direcciones (RD)?', o: ['La dirección de la celda a la que se quiere acceder', 'El dato que se acaba de leer', 'La instrucción en curso', 'El resultado de la UAL'], c: 0, e: 'Le llega por el bus de direcciones. En inglés, MAR.' },
    { a: '2.5', p: '¿Qué guarda el registro de memoria (RM)?', o: ['El dato que se acaba de leer o el que se va a escribir', 'La dirección de la siguiente instrucción', 'Los indicadores de la UAL', 'El número de celdas de la memoria'], c: 0, e: 'Está conectado al bus de datos. En inglés, MDR o MBR.' },
    { a: '2.5', p: '¿Qué contiene el contador de programa (CP)?', o: ['La dirección de la siguiente instrucción', 'Cuántas instrucciones lleva ejecutadas', 'La instrucción que se ejecuta', 'El resultado de la última operación'], c: 0, e: 'En inglés, PC (program counter).' },
    { a: '2.5', p: '¿Qué registro guarda la instrucción que se está ejecutando?', o: ['El RI', 'El CP', 'El RD', 'El AC'], c: 0, e: 'El registro de instrucción (IR en inglés).' },
    { a: '2.5', p: '¿Dónde deja la UAL el resultado de una operación?', o: ['En el acumulador (AC)', 'En el contador de programa', 'En el registro de direcciones', 'Directamente en el disco'], c: 0, e: 'Desde el AC puede usarse en la siguiente operación o guardarse en memoria.' },
    { a: '2.5', p: '¿Para qué sirve el registro de estado de la UAL?', o: ['Indica si el último resultado ha sido cero, negativo, con llevada o desbordamiento', 'Guarda la frecuencia del reloj', 'Indica si el equipo está encendido', 'Guarda la dirección de la pila'], c: 0, e: 'La UC consulta esos indicadores (flags) para tomar decisiones.' },
    { a: '2.5', p: 'Un procesador funciona a 4 GHz. ¿Cuánto dura cada ciclo de reloj?', o: ['0,25 ns', '4 ns', '0,4 ns', '25 ns'], c: 0, e: '1 ÷ 4 000 000 000 s = 0,25 · 10⁻⁹ s.' },
    { a: '2.5', p: '¿Cuál es el orden correcto, del más rápido al más lento?', o: ['Registros, caché, RAM, SSD, disco duro', 'Caché, registros, RAM, disco duro, SSD', 'RAM, caché, registros, SSD, disco duro', 'Registros, RAM, caché, disco duro, SSD'], c: 0, e: 'Arriba en la jerarquía, pequeño y rapidísimo; abajo, grande, lento y barato.' },
    { a: '2.5', p: 'Una pantalla táctil es un periférico de…', o: ['entrada/salida', 'solo entrada', 'solo salida', 'almacenamiento'], c: 0, e: 'Muestra información y recoge las pulsaciones.' },
    { a: '2.5', p: '¿Qué es el acceso directo a memoria (DMA)?', o: ['El periférico copia los datos a la RAM sin pasar por la CPU', 'La CPU lee los datos sin usar los buses', 'Un tipo de memoria caché', 'Una instrucción para borrar la RAM'], c: 0, e: 'Se usa para mover muchos datos sin tener ocupada a la CPU.' },
    { a: '2.5', p: 'En la E/S mapeada en memoria…', o: ['los periféricos ocupan direcciones del mismo mapa que la memoria', 'cada periférico tiene su propia RAM', 'la CPU usa instrucciones especiales de E/S', 'los periféricos no usan el bus de direcciones'], c: 0, e: 'En la E/S aislada, en cambio, hay un mapa aparte e instrucciones especiales.' },
    // 2.6
    { a: '2.6', ce: 'b', p: '¿Qué bus es bidireccional?', o: ['El bus de datos', 'El bus de direcciones', 'Ninguno', 'Todos'], c: 0, e: 'Los datos pueden ir en los dos sentidos: leer o escribir.' },
    { a: '2.6', ce: 'b', p: '¿Cuánta memoria puede direccionar un bus de direcciones de 32 líneas (celdas de 1 byte)?', o: ['4 GiB', '32 GB', '4 MiB', '64 GiB'], c: 0, e: '2³² = 4 294 967 296 direcciones = 4 GiB.' },
    { a: '2.6', ce: 'b', p: 'Un bus de datos de 64 bits, ¿cuántos bytes mueve en cada transferencia?', o: ['8', '64', '16', '4'], c: 0, e: '64 bits ÷ 8 = 8 bytes.' },
    { a: '2.6', ce: 'b', p: '¿Por qué bus viajan las órdenes «leer» y «escribir»?', o: ['Por el bus de control', 'Por el bus de datos', 'Por el bus de direcciones', 'Por la fuente de alimentación'], c: 0, e: 'El bus de control lleva órdenes y avisos: leer, escribir, reloj, interrupciones…' },
    { a: '2.6', ce: 'b', p: 'Una memoria DDR4-3200 tiene un reloj de…', o: ['1600 MHz, con dos transferencias por ciclo', '3200 MHz, con una transferencia por ciclo', '800 MHz, con cuatro transferencias por ciclo', '6400 MHz'], c: 0, e: 'DDR = double data rate: dos transferencias por ciclo.' },
    { a: '2.6', ce: 'b', p: 'Un bus de 64 bits a 100 MHz con una transferencia por ciclo. ¿Cuál es su ancho de banda?', o: ['800 MB/s', '6400 MB/s', '100 MB/s', '64 MB/s'], c: 0, e: '(64 ÷ 8) × 100 MHz × 1 = 800 MB/s.' },
    { a: '2.6', ce: 'b', p: '¿En qué sentido circula la información por el bus de direcciones?', o: ['De la CPU hacia la memoria y la E/S', 'De la memoria hacia la CPU', 'En los dos sentidos', 'De los periféricos hacia la memoria'], c: 0, e: 'Es unidireccional: la CPU dice a qué celda o dispositivo quiere acceder.' },
    // 2.7
    { a: '2.7', p: '¿Cuál es el orden de las fases del ciclo de instrucción?', o: ['Búsqueda, decodificación, ejecución', 'Decodificación, búsqueda, ejecución', 'Ejecución, búsqueda, decodificación', 'Búsqueda, ejecución, decodificación'], c: 0, e: 'Al final, si hace falta, se atienden las interrupciones.' },
    { a: '2.7', p: 'En la fase de búsqueda, ¿a qué registro llega la instrucción leída?', o: ['Al RI', 'Al AC', 'Al CP', 'A la UAL'], c: 0, e: 'Pasa por el bus de datos y el RM hasta el registro de instrucción.' },
    { a: '2.7', p: 'Con el juego de instrucciones del simulador (3 = sumar), ¿qué hace la instrucción 3305?', o: ['Suma al AC el dato de la celda 305', 'Guarda 305 en la celda 3', 'Suma 3 y 305', 'Carga en el AC el número 305'], c: 0, e: 'Formato operación-dirección: 3 es la operación y 305 la dirección del dato.' },
    { a: '2.7', p: 'La CPU acaba de ejecutar la instrucción de la dirección 120. ¿Cuánto vale el CP?', o: ['121', '120', '0', 'La dirección del dato'], c: 0, e: 'En la búsqueda, el CP se incrementa para apuntar a la siguiente instrucción.' },
    { a: '2.7', p: 'Llega una interrupción. ¿Qué hace la CPU antes de ejecutar la rutina de servicio?', o: ['Termina la instrucción en curso y guarda el contexto (CP y registros)', 'Borra la memoria', 'Reinicia el equipo', 'Abandona el programa para siempre'], c: 0, e: 'Al acabar la rutina restaura el contexto y sigue donde lo dejó.' },
    { a: '2.7', p: '¿Por qué bus llega la petición de interrupción (IRQ) de un periférico?', o: ['Por el bus de control', 'Por el bus de datos', 'Por el bus de direcciones', 'No usa ningún bus'], c: 0, e: 'Es una señal de control.' },
    // 2.8
    { a: '2.8', p: '¿Qué nivel es la frontera entre el hardware y el software?', o: ['El lenguaje máquina', 'El sistema operativo', 'Los circuitos digitales', 'Las aplicaciones'], c: 0, e: 'Es lo último que «entiende» el procesador: todo programa acaba traducido a esas instrucciones.' },
    { a: '2.8', p: 'Un programa escrito en Python pertenece al nivel de…', o: ['lenguajes de alto nivel', 'lenguaje máquina', 'transferencia entre registros', 'componentes electrónicos'], c: 0, e: 'Antes de ejecutarse se traduce a lenguaje máquina.' },
    { a: '2.8', p: '¿Cuál es el nivel más bajo de un ordenador?', o: ['Componentes electrónicos (transistores, resistencias…)', 'Circuitos digitales', 'Sistema operativo', 'Lenguaje máquina'], c: 0, e: 'Sobre ellos se construyen las puertas, los registros y todo lo demás.' }
  ];

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function barajar(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  /* Reparte las n preguntas entre los apartados en proporción a su peso en el banco
     (método del mayor resto), para que ningún apartado quede casi sin preguntas. */
  function elegir(aps, n) {
    var grupos = aps.map(function (a) { return barajar(BANCO.filter(function (q) { return q.a === a; })); });
    var total = grupos.reduce(function (s, g) { return s + g.length; }, 0);
    if (!n || n >= total) return [].concat.apply([], grupos);
    var cuotas = grupos.map(function (g) { return n * g.length / total; });
    var cant = cuotas.map(Math.floor), resto = n - cant.reduce(function (s, x) { return s + x; }, 0);
    cuotas.map(function (q, i) { return [q - cant[i] + Math.random() * 1e-6, i]; })
      .sort(function (x, y) { return y[0] - x[0]; }).slice(0, resto).forEach(function (x) { cant[x[1]]++; });
    return [].concat.apply([], grupos.map(function (g, i) { return g.slice(0, cant[i]); }));
  }
  function num(v) { return v.toLocaleString('es-ES', { maximumFractionDigits: 2 }); }

  function test(raiz) {
    var opciones = el('form', { class: 'test-opciones', onsubmit: 'return false' });
    opciones.innerHTML =
      '<label>Número de preguntas <select data-k="n"><option value="10">10</option><option value="20" selected>20</option><option value="0">Todas</option></select></label>' +
      '<label class="test-check"><input type="checkbox" data-k="penal"> Los fallos restan (1/3 de pregunta)</label>' +
      '<fieldset class="test-apartados"><legend>Apartados</legend>' +
      Object.keys(APARTADOS).map(function (k) {
        return '<label><input type="checkbox" value="' + k + '" checked> ' + k + ' ' + APARTADOS[k] + '</label>';
      }).join('') + '</fieldset>' +
      '<div class="acciones" style="margin:0"><button type="button" data-acc="empezar">Empezar el test</button></div>';
    raiz.appendChild(opciones);
    var zona = el('div', { class: 'test-zona' });
    raiz.appendChild(zona);
    var aviso = el('p', { class: 'resultado oculto', 'aria-live': 'polite' });
    opciones.appendChild(aviso);

    opciones.querySelector('[data-acc=empezar]').addEventListener('click', function () {
      var aps = Array.prototype.map.call(opciones.querySelectorAll('.test-apartados input:checked'), function (i) { return i.value; });
      if (!aps.length) { aviso.textContent = 'Marca al menos un apartado.'; aviso.classList.remove('oculto'); return; }
      aviso.classList.add('oculto');
      var n = +opciones.querySelector('[data-k=n]').value;
      var preguntas = elegir(aps, n).sort(function (x, y) { return x.a < y.a ? -1 : x.a > y.a ? 1 : 0; });
      empezar(preguntas, opciones.querySelector('[data-k=penal]').checked);
    });

    function empezar(preguntas, penal) {
      zona.innerHTML = '';
      var cab = el('div', { class: 'test-cabecera' }, '<span class="test-cuenta">0 de ' + preguntas.length + ' respondidas</span><span class="test-barra"><span></span></span>');
      zona.appendChild(cab);
      var form = el('form', { class: 'quiz', onsubmit: 'return false' });
      preguntas.forEach(function (q, i) {
        var orden = barajar([0, 1, 2, 3]);
        var d = el('div', { class: 'pregunta', 'data-i': i });
        d.innerHTML = '<p class="test-etq">Apartado ' + q.a + ' · ' + APARTADOS[q.a] + '</p>' +
          '<p class="enunciado"><span class="num">' + (i + 1) + '.</span> ' + q.p + '</p><ul class="opciones">' +
          orden.map(function (k) { return '<li><label><input type="radio" name="t' + i + '" value="' + k + '"> ' + q.o[k] + '</label></li>'; }).join('') +
          '</ul><span class="marca"></span><p class="explicacion" hidden>' + q.e + '</p>';
        form.appendChild(d);
      });
      var acc = el('div', { class: 'acciones' }, '<button type="button" data-acc="corregir">Corregir el test</button> <button type="button" class="sec" data-acc="nuevo">Hacer otro test</button>');
      form.appendChild(acc);
      zona.appendChild(form);
      var resumen = el('div', { class: 'test-resumen', hidden: '', 'aria-live': 'polite' });
      zona.appendChild(resumen);
      var corregido = false;

      form.addEventListener('change', function () {
        if (corregido) return;
        var r = form.querySelectorAll('input:checked').length;
        cab.querySelector('.test-cuenta').textContent = r + ' de ' + preguntas.length + ' respondidas';
        cab.querySelector('.test-barra span').style.width = (100 * r / preguntas.length) + '%';
      });
      acc.querySelector('[data-acc=nuevo]').addEventListener('click', function () {
        zona.innerHTML = '';
        opciones.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      acc.querySelector('[data-acc=corregir]').addEventListener('click', function () {
        if (corregido) return;
        var sinResp = preguntas.length - form.querySelectorAll('input:checked').length;
        if (sinResp && !acc.querySelector('[data-acc=corregir]').hasAttribute('data-avisado')) {
          acc.querySelector('[data-acc=corregir]').setAttribute('data-avisado', '');
          acc.querySelector('[data-acc=corregir]').textContent = 'Corregir igualmente (' + sinResp + ' sin responder)';
          return;
        }
        corregido = true;
        var bien = 0, mal = 0, porAp = {};
        preguntas.forEach(function (q, i) {
          var d = form.querySelector('[data-i="' + i + '"]'), m = d.querySelector('input:checked');
          var ap = porAp[q.a] = porAp[q.a] || { t: 0, b: 0 };
          ap.t++;
          d.querySelectorAll('input').forEach(function (x) {
            x.disabled = true;
            if (+x.value === q.c) x.parentNode.classList.add('es-correcta');
          });
          var marca = d.querySelector('.marca');
          if (!m) { d.classList.add('sin-respuesta'); marca.textContent = 'Sin responder'; }
          else if (+m.value === q.c) { bien++; ap.b++; d.classList.add('acierto'); marca.textContent = '✓ Correcto'; }
          else { mal++; d.classList.add('fallo'); m.parentNode.classList.add('elegida-mal'); marca.textContent = '✗ Incorrecto'; }
          d.querySelector('.explicacion').hidden = false;
        });
        var puntos = Math.max(0, bien - (penal ? mal / 3 : 0)), nota = 10 * puntos / preguntas.length;
        var flojos = Object.keys(porAp).filter(function (k) { return porAp[k].b / porAp[k].t < 0.6; });
        resumen.hidden = false;
        resumen.innerHTML = '<p class="test-nota">' + num(Math.round(nota * 100) / 100) + ' / 10</p>' +
          '<p>' + bien + ' aciertos, ' + mal + ' fallos y ' + (preguntas.length - bien - mal) + ' sin responder' + (penal ? ' (cada fallo resta 1/3)' : '') + '. Lee la explicación de cada pregunta.</p>' +
          '<table><thead><tr><th>Apartado</th><th>Aciertos</th></tr></thead><tbody>' +
          Object.keys(porAp).sort().map(function (k) {
            return '<tr><td><a href="ut02-teoria.html#apartado-' + k.replace('.', '-') + '">' + k + ' ' + APARTADOS[k] + '</a></td><td>' + porAp[k].b + ' de ' + porAp[k].t + '</td></tr>';
          }).join('') + '</tbody></table>' +
          (flojos.length ? '<p style="margin-bottom:0">Repasa en la teoría: ' + flojos.map(function (k) { return k; }).join(', ') + '.</p>' : '<p style="margin-bottom:0">¡Buen trabajo en todos los apartados!</p>');
        acc.querySelector('[data-acc=corregir]').disabled = true;
        cab.querySelector('.test-cuenta').textContent = 'Corregido';
        resumen.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      zona.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.UT02_TEST = { BANCO: BANCO, APARTADOS: APARTADOS };
  if (typeof document === 'undefined' || !document.createElement) return;
  function iniciar() { document.querySelectorAll('.test-ut02').forEach(test); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
