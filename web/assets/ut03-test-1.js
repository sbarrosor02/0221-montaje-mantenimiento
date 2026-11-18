/* Simulacro de test del tema 3 de 0221 (1.ª parte: teoría 1, apartados 3.1 a 3.7). Sin dependencias.
   Motor copiado de ut02-test.js.
   Banco de preguntas por apartado de la teoría (a = apartado, ce = criterio de RA1).
   Cada test saca preguntas al azar del banco y baraja las opciones.
   <div class="test-ut03-1"> se convierte en el test completo. */
(function () {
  'use strict';

  var APARTADOS = {
    '3.1': 'La placa base y sus formatos', '3.2': 'Mapa de la placa base', '3.3': 'El microprocesador',
    '3.4': 'El chipset', '3.5': 'Refrigeración', '3.6': 'La memoria RAM', '3.7': 'Ranuras de expansión y M.2'
  };

  /* c = índice de la opción correcta (0-3) en el orden escrito aquí; se baraja al mostrarla. */
  var BANCO = [
    // 3.1
    { a: '3.1', ce: 'e', p: '¿Qué medidas tiene una placa base ATX?', o: ['305 × 244 mm', '244 × 244 mm', '170 × 170 mm', '305 × 330 mm'], c: 0, e: 'ATX: 305 × 244 mm. Micro-ATX mide 244 × 244, Mini-ITX 170 × 170 y E-ATX 305 × 330.' },
    { a: '3.1', ce: 'e', p: '¿Qué formato tiene una placa de 170 × 170 mm?', o: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'], c: 0, e: 'Mini-ITX: la más pequeña de las actuales, con una sola ranura de expansión.' },
    { a: '3.1', ce: 'e', p: '¿Cuántas ranuras de expansión puede tener como máximo una placa micro-ATX?', o: ['4', '1', '7', '2'], c: 0, e: 'Micro-ATX llega a 4; ATX, a 7; Mini-ITX tiene 1.' },
    { a: '3.1', ce: 'g', p: 'Una caja admite como máximo placas micro-ATX. ¿Qué placa NO cabe?', o: ['ATX', 'Mini-ITX', 'Micro-ATX', 'Caben todas'], c: 0, e: 'Una caja admite su formato y los más pequeños. ATX es más grande que micro-ATX.' },
    { a: '3.1', ce: 'e', p: '¿Qué tensión da la fuente ATX aunque el equipo esté apagado?', o: ['5VSB (5 V de reposo)', '12 V', '3,3 V', '–12 V'], c: 0, e: 'Con los 5VSB la placa puede ordenar el encendido (botón, teclado o red).' },
    { a: '3.1', ce: 'e', p: '¿Qué fija el factor de forma de una placa?', o: ['El tamaño, los anclajes, el panel trasero y el conector de alimentación', 'El zócalo del procesador', 'El chipset', 'El tipo de memoria'], c: 0, e: 'Es la norma que hace que placas, cajas y fuentes de distintos fabricantes encajen.' },
    // 3.2
    { a: '3.2', ce: 'e', p: '¿Cuántos pines tiene el conector principal de alimentación de una placa actual?', o: ['24 (20+4)', '8', '19', '4+4'], c: 0, e: 'ATX_PWR: 24 pines con 3,3 V, 5 V y 12 V para toda la placa.' },
    { a: '3.2', ce: 'e', p: '¿Qué lleva el conector EPS (CPU_PWR, ATX12V) de 4+4 u 8 pines?', o: ['Solo 12 V para el VRM del procesador', '3,3 V, 5 V y 12 V para toda la placa', '5 V para la iluminación', 'La señal del botón de encendido'], c: 0, e: 'El VRM convierte esos 12 V en la tensión de los núcleos.' },
    { a: '3.2', ce: 'e', p: 'El conector USB interno de 19 pines sirve para…', o: ['dos USB-A frontales de 5 Gbit/s', 'dos USB 2.0 frontales', 'un USB-C frontal', 'el audio frontal'], c: 0, e: 'Es el USB 3.x interno. El de USB 2.0 tiene 9 pines.' },
    { a: '3.2', ce: 'e', p: '¿Cuántos pines tiene el conector USB 2.0 interno?', o: ['9', '19', '4', '24'], c: 0, e: '9 pines (10 posiciones, una sin pin) para dos puertos USB 2.0.' },
    { a: '3.2', ce: 'e', p: '¿Cómo es un conector ARGB?', o: ['3 pines y 5 V', '4 pines y 12 V', '2 pines y 3,3 V', '6 pines y 12 V'], c: 0, e: 'ARGB: 5 V, datos y masa. El RGB clásico es de 4 pines y 12 V: no son compatibles.' },
    { a: '3.2', ce: 'e', p: '¿Qué hace el puente CLR_CMOS?', o: ['Devuelve la UEFI a los valores de fábrica', 'Actualiza la UEFI', 'Apaga la placa', 'Activa el TPM'], c: 0, e: 'Borra los ajustes guardados; el firmware no cambia.' },
    { a: '3.2', ce: 'e', p: 'En el panel frontal (F_PANEL), ¿qué cables tienen polaridad?', o: ['Los LED', 'Los botones', 'Todos', 'Ninguno'], c: 0, e: 'Los LED tienen + y –; los botones solo cierran un contacto. Un LED al revés no luce, pero no se rompe.' },
    { a: '3.2', ce: 'e', p: '¿Dónde conectas el ventilador del disipador del procesador?', o: ['CPU_FAN', 'SYS_FAN', 'CHA_FAN', 'AIO_PUMP'], c: 0, e: 'Muchas placas avisan o no arrancan si no detectan ventilador en CPU_FAN.' },
    // 3.3
    { a: '3.3', ce: 'c', p: 'Un procesador de 8 núcleos con SMT (Hyper-Threading) atiende…', o: ['16 hilos', '8 hilos', '4 hilos', '32 hilos'], c: 0, e: 'Cada núcleo atiende dos hilos: 8 × 2 = 16.' },
    { a: '3.3', ce: 'c', p: 'En Intel, los núcleos E son…', o: ['núcleos de eficiencia', 'núcleos de la gráfica', 'núcleos externos', 'núcleos de emergencia'], c: 0, e: 'Intel combina núcleos de rendimiento (P) y de eficiencia (E).' },
    { a: '3.3', ce: 'c', p: '¿Por qué no basta con comparar la frecuencia turbo de un Intel y un AMD?', o: ['Porque el trabajo por ciclo (IPC) es distinto', 'Porque la turbo nunca se alcanza', 'Porque cada uno mide los GHz de otra forma', 'Porque AMD no tiene turbo'], c: 0, e: 'Hay que mirar pruebas de rendimiento, no solo los GHz.' },
    { a: '3.3', ce: 'c', p: 'En AMD, el consumo máximo real (PPT) es 1,35 veces el TDP. Con un TDP de 65 W, el PPT es…', o: ['88 W', '65 W', '105 W', '130 W'], c: 0, e: '65 × 1,35 = 87,75 ≈ 88 W.' },
    { a: '3.3', ce: 'c', p: 'El zócalo AM4 es de tipo…', o: ['PGA: los pines están en el procesador', 'LGA: los contactos están en la placa', 'BGA: va soldado', 'Slot'], c: 0, e: 'AM4 es PGA; AM5 ya es LGA (1718 contactos).' },
    { a: '3.3', ce: 'c', p: '¿Qué memoria admite el zócalo AM5?', o: ['Solo DDR5', 'Solo DDR4', 'DDR4 o DDR5 según la placa', 'DDR3'], c: 0, e: 'AM5 es solo DDR5. Las placas LGA 1700 sí pueden ser DDR4 o DDR5.' },
    { a: '3.3', ce: 'c', p: '¿Qué procesadores usan el zócalo LGA 1700?', o: ['Intel Core de 12.ª, 13.ª y 14.ª generación', 'Intel Core Ultra serie 200S', 'AMD Ryzen 7000', 'Intel Core de 10.ª generación'], c: 0, e: 'Los Core Ultra 200S usan LGA 1851; los Ryzen 7000, AM5; la 10.ª generación, LGA 1200.' },
    { a: '3.3', ce: 'c', p: '¿En qué zócalo va un Intel Core Ultra 7 270K Plus?', o: ['LGA 1851', 'LGA 1700', 'LGA 1954', 'AM5'], c: 0, e: 'Es la renovación «Plus» de 2026 de la serie 200 de sobremesa.' },
    { a: '3.3', ce: 'c', p: '¿Qué zócalo estrenarán los Intel Core Ultra serie 400 («Nova Lake»)?', o: ['LGA 1954', 'LGA 1851', 'LGA 1700', 'AM5'], c: 0, e: 'LGA 1954, con chipsets de la serie 900. No sirven en placas LGA 1851.' },
    { a: '3.3', ce: 'c', p: '¿Qué significa la K de un Intel Core i5-14600K?', o: ['Que está desbloqueado para hacer overclock', 'Que no tiene gráfica integrada', 'Que es de portátil', 'Que tiene más caché'], c: 0, e: 'Para aprovecharlo hace falta una placa con chipset Z.' },
    { a: '3.3', ce: 'c', p: '¿Qué significa la F de un Intel Core i5-12400F?', o: ['Que no tiene gráfica integrada', 'Que tiene más frecuencia', 'Que está desbloqueado', 'Que es de bajo consumo'], c: 0, e: 'Necesita una tarjeta gráfica dedicada.' },
    { a: '3.3', ce: 'c', p: '¿Qué indica X3D en un Ryzen 7 9800X3D?', o: ['Caché 3D V-Cache apilada', 'Gráfica integrada potente', 'Tres chiplets', 'Que es de portátil'], c: 0, e: 'Mucha más caché L3: destaca en juegos.' },
    { a: '3.3', ce: 'c', p: 'En un Core i7-14700K, ¿qué indica el 14?', o: ['La generación', 'El número de núcleos', 'La frecuencia', 'El zócalo'], c: 0, e: '14.ª generación; 700 es el modelo y K, desbloqueado.' },
    { a: '3.3', ce: 'c', p: 'Un procesador nuevo encaja en el zócalo, pero la placa no lo reconoce. ¿Qué es lo más probable?', o: ['Que haya que actualizar la UEFI', 'Que falte pasta térmica', 'Que la fuente sea pequeña', 'Que la memoria sea lenta'], c: 0, e: 'La lista de procesadores compatibles indica la versión de UEFI mínima.' },
    // 3.4
    { a: '3.4', ce: 'e', p: '¿Qué hace hoy el chipset de la placa?', o: ['Amplía las conexiones del procesador: más carriles PCIe, SATA, USB, red y sonido', 'Procesa los gráficos', 'Controla la memoria RAM', 'Guarda la configuración de la UEFI'], c: 0, e: 'El controlador de memoria y la gráfica están en el procesador.' },
    { a: '3.4', ce: 'e', p: '¿Dónde está hoy el antiguo puente norte (memoria y gráfica)?', o: ['Dentro del procesador', 'En el chipset', 'En los módulos de memoria', 'En la tarjeta gráfica'], c: 0, e: 'El chip que queda en la placa es el PCH, heredero del puente sur.' },
    { a: '3.4', ce: 'e', p: '¿Qué significa PCH?', o: ['Platform Controller Hub', 'Processor Control Hardware', 'PCI Channel Hub', 'Power Control Header'], c: 0, e: 'Es el nombre del chipset actual.' },
    { a: '3.4', ce: 'e', p: '¿Cómo se llama el enlace entre el procesador y el chipset en Intel?', o: ['DMI', 'USB', 'SATA', 'HDMI'], c: 0, e: 'DMI equivale a 8 carriles PCIe 4.0. En AMD son 4 carriles PCIe.' },
    { a: '3.4', ce: 'e', p: '¿Por qué la gráfica y el SSD principal se conectan directamente al procesador?', o: ['Porque todo lo que cuelga del chipset comparte el enlace con el procesador', 'Porque el chipset no admite PCIe', 'Porque así consumen menos', 'Por el tamaño de la placa'], c: 0, e: 'Directos a la CPU no compiten por ese enlace.' },
    { a: '3.4', ce: 'e', p: '¿Qué chipset Intel de la serie 800 permite hacer overclock del procesador?', o: ['Z890', 'B860', 'H810', 'Ninguno'], c: 0, e: 'Z es la gama alta. En B860 solo se puede hacer overclock de la memoria.' },
    { a: '3.4', ce: 'e', p: 'El chipset AMD B840…', o: ['es de gama básica aunque lleve «B»', 'es de gama alta', 'es para procesadores Intel', 'admite PCIe 5.0 en la gráfica'], c: 0, e: 'B840 es básico: la ranura gráfica va a PCIe 3.0.' },
    // 3.5
    { a: '3.5', ce: 'd', p: '¿Qué es el thermal throttling?', o: ['El procesador baja la frecuencia para no pasar de su temperatura máxima', 'El ventilador gira al máximo', 'El equipo se apaga de golpe', 'La placa sube la tensión'], c: 0, e: 'Protege el chip, pero el equipo va más lento.' },
    { a: '3.5', ce: 'd', p: '¿Qué son los heatpipes de un disipador?', o: ['Tubos de cobre con un líquido que se evapora y se condensa para mover el calor', 'Tubos de agua con bomba', 'Las aletas de aluminio', 'Los cables del ventilador'], c: 0, e: 'Mueven el calor muy deprisa desde la base hasta las aletas.' },
    { a: '3.5', ce: 'd', p: '¿Para qué sirve la pasta térmica?', o: ['Para rellenar las irregularidades microscópicas, llenas de aire, entre el procesador y el disipador', 'Para pegar el disipador', 'Para aislar eléctricamente el procesador', 'Para enfriar el procesador por sí sola'], c: 0, e: 'El aire conduce muy mal el calor; la pasta lo sustituye.' },
    { a: '3.5', ce: 'd', p: '¿Cuánta pasta térmica se pone?', o: ['Una gota del tamaño de un guisante en el centro', 'Una capa gruesa por toda la superficie', 'Hasta que rebose por los bordes', 'Nada si el disipador es de cobre'], c: 0, e: 'La presión del disipador la reparte.' },
    { a: '3.5', ce: 'd', p: '¿Con qué se limpia la pasta térmica vieja?', o: ['Alcohol isopropílico y un paño que no suelte pelusa', 'Agua y jabón', 'Papel de lija fino', 'Aire comprimido'], c: 0, e: 'El alcohol isopropílico se evapora sin dejar restos.' },
    { a: '3.5', ce: 'd', p: '¿Cómo regula la placa la velocidad de un ventilador de 4 pines?', o: ['Con una señal PWM, dándole siempre 12 V', 'Bajando la tensión', 'Cortando la corriente a ratos con un relé', 'No se puede regular'], c: 0, e: 'El cuarto pin lleva pulsos a 25 kHz. Los de 3 pines se regulan bajando la tensión (modo DC).' },
    { a: '3.5', ce: 'd', p: 'Conectas un ventilador de 3 pines en un conector de 4. ¿Se puede regular su velocidad?', o: ['Sí, si el conector está en modo DC en la UEFI', 'Nunca', 'Sí, en cualquier modo', 'No funciona'], c: 0, e: 'Funciona en cualquier caso; solo se controla en modo DC.' },
    { a: '3.5', ce: 'd', p: '¿Cómo debe ser el flujo de aire en la caja?', o: ['Entra por delante y abajo, sale por detrás y arriba', 'Entra por arriba y sale por delante', 'Todos los ventiladores sacando aire', 'Todos metiendo aire'], c: 0, e: 'El aire caliente sube: se saca por arriba y por detrás.' },
    { a: '3.5', ce: 'd', p: '¿Qué es la presión positiva en una caja?', o: ['Que entra algo más de aire del que sale', 'Que sale más aire del que entra', 'Que los ventiladores giran al máximo', 'Que la caja está cerrada herméticamente'], c: 0, e: 'El sobrante sale por las rendijas y entra menos polvo si hay filtros.' },
    { a: '3.5', ce: 'd', p: '¿Para qué tipo de caja es un disipador de perfil bajo?', o: ['Cajas pequeñas (Mini-ITX, HTPC)', 'Torres grandes', 'Servidores', 'Cualquier caja ATX'], c: 0, e: 'Mide menos de 70 mm de alto.' },
    { a: '3.5', ce: 'd', p: '1 CFM equivale aproximadamente a…', o: ['1,7 m³/h', '17 m³/h', '0,17 m³/h', '1 m³/h'], c: 0, e: 'El caudal se da en CFM o en m³/h.' },
    // 3.6
    { a: '3.6', ce: 'e', p: '¿Se puede poner un módulo DDR4 en una ranura DDR5?', o: ['No: la muesca está en otro sitio', 'Sí, funciona más lento', 'Sí, con un adaptador de la placa', 'Solo si es de la misma capacidad'], c: 0, e: 'Una placa admite un solo tipo de memoria.' },
    { a: '3.6', ce: 'e', p: '¿Cuál es la latencia en nanosegundos de una DDR4-3200 CL16?', o: ['10 ns', '16 ns', '5 ns', '20 ns'], c: 0, e: '16 × 2000 ÷ 3200 = 10 ns.' },
    { a: '3.6', ce: 'e', p: '¿Cuál es la latencia en nanosegundos de una DDR5-6000 CL30?', o: ['10 ns', '30 ns', '5 ns', '15 ns'], c: 0, e: '30 × 2000 ÷ 6000 = 10 ns: igual que una DDR4-3200 CL16, pero mueve casi el doble de datos.' },
    { a: '3.6', ce: 'e', p: '¿Qué es mejor para un equipo de sobremesa?', o: ['Dos módulos de 16 GB', 'Un módulo de 32 GB', 'Es igual', 'Cuatro módulos de 8 GB, siempre'], c: 0, e: 'Con un módulo en cada canal se usa el dual channel y se duplica el ancho de banda.' },
    { a: '3.6', ce: 'e', p: 'En una placa con cuatro ranuras, ¿dónde se ponen normalmente dos módulos?', o: ['En A2 y B2', 'En A1 y A2', 'En A1 y B1', 'Da igual'], c: 0, e: 'La segunda y la cuarta contando desde el procesador. El manual lo indica.' },
    { a: '3.6', ce: 'e', p: '¿Qué son XMP y EXPO?', o: ['Perfiles del módulo para que funcione a la velocidad anunciada', 'Tipos de memoria', 'Formatos de módulo', 'Marcas de memoria'], c: 0, e: 'XMP es de Intel y EXPO de AMD. Se activan en la UEFI.' },
    { a: '3.6', ce: 'e', p: '¿Qué es la QVL de una placa?', o: ['La lista de módulos de memoria que el fabricante ha probado', 'La velocidad máxima de la memoria', 'El tipo de latencia', 'Un perfil de overclock'], c: 0, e: 'Si un kit está en la QVL, funciona seguro.' },
    { a: '3.6', ce: 'e', p: '¿Qué módulos usan los portátiles y los mini PC?', o: ['SO-DIMM, más cortos', 'DIMM', 'SIMM', 'RIMM'], c: 0, e: 'También pueden llevar la memoria soldada.' },
    { a: '3.6', ce: 'e', p: 'En DDR5, ¿dónde se gestiona la tensión del módulo?', o: ['En el propio módulo (chip PMIC)', 'En la placa base', 'En el procesador', 'En la fuente'], c: 0, e: 'En DDR4 se gestionaba en la placa.' },
    { a: '3.6', ce: 'e', p: 'Una DDR5-6000 hace 6000 millones de transferencias por segundo. ¿A qué frecuencia va su reloj?', o: ['3000 MHz', '6000 MHz', '12 000 MHz', '1500 MHz'], c: 0, e: 'DDR transfiere dos veces por ciclo de reloj.' },
    // 3.7
    { a: '3.7', ce: 'j', p: '¿Qué ranura de expansión es la única que se usa hoy?', o: ['PCI Express', 'PCI', 'AGP', 'ISA'], c: 0, e: 'PCIe se usa desde 2003; las demás son históricas.' },
    { a: '3.7', ce: 'j', p: 'Pones una tarjeta PCIe 4.0 en una ranura PCIe 3.0. ¿Qué pasa?', o: ['Funciona, a la velocidad de PCIe 3.0', 'No funciona', 'Funciona a PCIe 4.0', 'Se estropea la ranura'], c: 0, e: 'El enlace usa la versión más baja y el menor número de carriles.' },
    { a: '3.7', ce: 'j', p: 'Una ranura tiene tamaño x16, pero el manual dice «PCIEX16 (x4)». ¿Qué significa?', o: ['Que solo tiene 4 carriles conectados', 'Que admite 4 tarjetas', 'Que es PCIe 4.0', 'Que da 4 W'], c: 0, e: 'El tamaño físico no siempre coincide con los carriles reales.' },
    { a: '3.7', ce: 'j', p: '¿Qué ancho de banda tiene un enlace PCIe 4.0 x4 (en cada sentido)?', o: ['≈ 7,9 GB/s', '≈ 3,9 GB/s', '≈ 15,8 GB/s', '≈ 31,5 GB/s'], c: 0, e: 'Unos 2 GB/s por carril × 4 carriles.' },
    { a: '3.7', ce: 'j', p: '¿Cuánto cambia la velocidad de PCIe en cada versión nueva?', o: ['Se duplica', 'Sube un 10 %', 'Se triplica', 'No cambia, solo hay más carriles'], c: 0, e: 'Por eso PCIe 5.0 x4 equivale a PCIe 4.0 x8.' },
    { a: '3.7', ce: 'j', p: '¿Cuánta potencia puede dar como máximo una ranura PCIe?', o: ['75 W', '25 W', '150 W', '300 W'], c: 0, e: 'Las gráficas que consumen más llevan conectores de alimentación propios.' },
    { a: '3.7', ce: 'e', p: '¿Qué indica «2280» en una tarjeta M.2?', o: ['22 mm de ancho y 80 mm de largo', 'La velocidad en MB/s', 'La versión de PCIe', 'La capacidad en GB'], c: 0, e: 'Es el tamaño más común. También hay 2230, 2242, 2260 y 22110.' },
    { a: '3.7', ce: 'e', p: '¿Qué tipo de tarjeta M.2 usa la llave E?', o: ['Wi-Fi y Bluetooth', 'SSD NVMe', 'SSD SATA', 'Tarjeta gráfica'], c: 0, e: 'La llave M es para SSD NVMe (hasta PCIe x4).' },
    { a: '3.7', ce: 'e', p: 'Pones un SSD M.2 SATA en una ranura M.2 que solo admite PCIe. ¿Qué pasa?', o: ['Encaja, pero el equipo no lo detecta', 'Funciona más lento', 'Funciona igual', 'No encaja'], c: 0, e: 'Que encaje no significa que funcione: hay que mirar el manual.' }
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
      '<label>Número de preguntas <select data-k="n"><option value="10">10</option><option value="20">20</option><option value="30" selected>30</option><option value="0">Todas</option></select></label>' +
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
            return '<tr><td><a href="ut03-teoria.html#apartado-' + k.replace('.', '-') + '">' + k + ' ' + APARTADOS[k] + '</a></td><td>' + porAp[k].b + ' de ' + porAp[k].t + '</td></tr>';
          }).join('') + '</tbody></table>' +
          (flojos.length ? '<p style="margin-bottom:0">Repasa en la teoría: ' + flojos.map(function (k) { return k; }).join(', ') + '.</p>' : '<p style="margin-bottom:0">¡Buen trabajo en todos los apartados!</p>');
        acc.querySelector('[data-acc=corregir]').disabled = true;
        cab.querySelector('.test-cuenta').textContent = 'Corregido';
        resumen.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      zona.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.UT03_TEST_1 = { BANCO: BANCO, APARTADOS: APARTADOS };
  if (typeof document === 'undefined' || !document.createElement) return;
  function iniciar() { document.querySelectorAll('.test-ut03-1').forEach(test); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
