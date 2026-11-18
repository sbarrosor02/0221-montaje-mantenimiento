# Navegación del aula · revisión del 23/09/2026

## Diagnóstico

La lectura era clara y los materiales estaban separados por temas, pero acceder
a una práctica requería recorrer varios índices. Las páginas extensas tenían
pocos atajos; Ofimática no tenía la barra de apartados que ya existía en Montaje.
Los archivos descargables estaban repartidos entre enunciados. Las portadas
priorizaban códigos y metadatos frente a las tareas del alumnado.

Se conserva la secuencia didáctica, los enunciados, las rúbricas, los
cuestionarios, los dibujos y las URLs existentes. No se resuelven en esta
intervención los circuitos pendientes ni se redactan nuevos contenidos.

## Organización implementada

- Inicio: estudiar, practicar y preparar una entrega, más el recorrido por temas.
- Materiales: catálogo con filtros por tipo y búsqueda por títulos y apartados,
  incluidos encabezados de nivel 3. No es una búsqueda de texto completo.
- Prácticas: reúne tanto páginas propias como actividades incluidas en los apuntes.
- Descargas: archivos existentes con enlace al enunciado de procedencia.
- Lecciones: índice lateral en escritorio y desplegable en móvil.
- RA y criterios: desplegable consultable, abierto al imprimir.
- Montaje conserva su barra de apartados; Ofimática incorpora una equivalente.
- Se mantienen accesibles los materiales sin JavaScript; solo los filtros y
  el botón de impresión lo necesitan.

## Diseño

Misma estructura en ambos módulos, con acento verde en Montaje y azul en
Ofimática. Fondo claro, tipografía local Segoe UI/Calibri, columna de lectura
limitada y sin fuentes ni dependencias externas. Foco visible, enlace para
saltar al contenido, tablas con desplazamiento horizontal y estilos de impresión.
La búsqueda no envía datos a ningún servicio.

## Mantenimiento

Desde este repositorio, ejecutar:

```powershell
python scripts/actualizar_aula.py
```

Python 3, solo biblioteca estándar. El script lee `web/datos/temas.json` y las
páginas reales de `web/temas/`. Regenera `web/index.html`, `web/recursos.html`
y los índices de las lecciones. Las portadas generadas se modifican en el script;
el contenido de las lecciones se edita en sus HTML habituales.
Los títulos nuevos reciben identificadores; los existentes se conservan para
no romper enlaces. Al renombrar o eliminar apartados, revisar sus enlaces.

`assets/aula.css` y `assets/aula.js` son compartidos por los dos repositorios.
Se carga la capa nueva después del CSS original y de los estilos específicos
para conservar las figuras y componentes existentes. No hay proceso de build
en GitHub Pages; el generador se ejecuta antes del commit.

## Copia de seguridad y validación

Copia completa anterior al cambio, incluido `.git`, en:
`../copias-seguridad/20260923-131511/0221-montaje-mantenimiento/`.
No forma parte de la web publicada. Para recuperar, copiar primero esa carpeta
a una ubicación nueva y comprobar su contenido antes de sustituir el repositorio.

Validación conjunta: 20 páginas en Chrome a 1440 y 390 px; enlaces locales y
anclas, identificadores únicos, ausencia de desbordamientos de página,
filtros, búsqueda sin resultados, limpieza, catálogo sin JavaScript,
respuesta del cuestionario de 2.2 y buscador del mapa de Word.
Capturas y resultados en `../revision-aulas/`.

La comprobación visual de navegación no constituye una revisión de exactitud
de todos los contenidos didácticos. Los circuitos y los textos se conservan.


## Revisión del 09/10/2026 · encontrar las cosas

Al alumnado le costaba encontrar el material. Cambios:

- **Portada del módulo**: bloque «Ahora en clase» con lo urgente (examen,
  entregas). Se edita en `destacados` de `web/datos/temas.json` y se regenera
  con `scripts/actualizar_aula.py`. Si la lista está vacía, el bloque no sale.
- **Portada del tema 1**: aviso «Ahora mismo» y apartados agrupados por lo
  que se quiere hacer: Estudiar, Practicar y Entregar.
- **Barra del tema**: se añade «Repaso examen». En el taller de nudos se
  marca «Ejercicios» y en la guía del informe se marca «Prácticas», porque
  son subpáginas de esos apartados.
- **Ejercicios**: la página es muy larga, así que al principio hay un mapa de
  boletines con su nivel y su número de ejercicios. Cada boletín termina con
  un enlace de vuelta al mapa.
- **Catálogo**: los esquemas SVG ya no salen como descargas sueltas (de 25 a
  8 materiales). Siguen disponibles dentro de cada ejercicio.
- `assets/aula.css` recibe los estilos de `.aula-ahora`. Si se copia al
  repositorio de 0223, no le afecta mientras no use `destacados`.


## Revisión del 23/10/2026 · a qué tema pertenece cada material

Con varios temas publicados, en el catálogo y en las páginas no se veía de qué tema era
cada cosa. Cambios, todos generados por `scripts/actualizar_aula.py`:

- **Migas de pan** al principio de cada página de `temas/`: «Inicio › Tema N · título ›
  Apartado» (y la subpágina, si la hay: «… › Ejercicios › Taller de nudos»). El apartado
  se toma del enlace marcado en la barra `.subnav`: `aria-current="page"` para la página
  y `aria-current="true"` para una subpágina, cuyo nombre sale del `<h1>` hasta « — ».
- **Índice lateral**: tarjeta «Tema N · título» que lleva a la portada del tema y enlace
  «Todo el material del tema N» (`recursos.html?tema=N`).
- **Catálogo**: cada material lleva la etiqueta «Tema N» con el título del tema y su tipo;
  se ordena por tema y, dentro de cada tema, apuntes, ejercicios, prácticas, consulta y
  descargas. Nuevo filtro por tema, combinable con el de tipo y con la búsqueda, y
  enlazable con `?tema=N`. Las descargas toman el tema de la página que las usa.
- **Ahora en clase**: los destacados de `web/datos/temas.json` admiten `"ut": N`, que
  antepone «Tema N ·» a la etiqueta.

El tema se deduce del nombre del archivo (`utNN…html`) y su título de `temas.json`.
Las migas se regeneran en cada ejecución (el script es idempotente).

`assets/aula.css` y `assets/aula.js` (compartidos con 0223) reciben los estilos y el filtro
por tema. El filtro solo actúa si el catálogo tiene botones `data-filtro-tema`, así que
copiar estos dos archivos a 0223 no cambia nada allí hasta que su script genere esas marcas.


## Regla del 29/10/2026 · recuadro «Entrega» en boletines y prácticas

Todo boletín de ejercicios y toda práctica termina **cada bloque** con un recuadro
para el alumnado que dice qué se entrega y cómo debe quedar. Se aplica a las páginas
nuevas y a las existentes cuando se revisen.

```html
<section class="entrega" aria-labelledby="entrega-2-3">
  <h3 id="entrega-2-3">Qué entregas del bloque 2.3</h3>
  <p class="entrega-sub">Una línea con lo que se entrega.</p>
  <ul class="entrega-archivos"><li>montaje-equipo.pdf</li></ul>
  <h4>Comprueba antes de entregar</h4>
  <ul class="entrega-lista"><li>…</li></ul>
  <h4>Cómo debe quedar</h4>
  <div class="entrega-ejemplos">
    <figure class="bien">…maqueta…<figcaption>…</figcaption></figure>
    <figure class="mal">…<figcaption>…</figcaption></figure>
  </div>
  <p class="entrega-ojo"><strong>Fallo más común:</strong> …</p>
</section>
```

- Va **dentro** del `<section>` del bloque, justo antes de su cierre, con un `id`
  `entrega-N-M` propio (el generador solo numera los `<h2>`).
- **Archivos**: nombres exactos, con la carpeta si importa. Si un archivo no queda
  en la carpeta de trabajo (por ejemplo, una plantilla de Word o una captura guardada por defecto en otra carpeta), se dice dónde está
  y que hay que copiarlo.
- **Comprueba antes de entregar**: comprobaciones que el alumno pueda hacer solo, en
  segunda persona, con la ruta de menú cuando haga falta.
- **Cómo debe quedar**: maquetas en HTML/CSS o SVG (`.hoja`, `.panel-word`,
  `.codigo-vba`, `.capas-gimp`, `.paleta`, `.arbol`), capturas reales o los esquemas SVG de los boletines. Un esquema eléctrico de resultado sigue la regla de los circuitos: generado por script y verificado por análisis nodal. `bien` y
  `mal` añaden la etiqueta ✓/✗; `entrega-ancho` ocupa toda la fila.
- **Se muestra el resultado completo**, incluidos valores calculados, recuentos y
  respuestas modelo. Los solucionarios detallados para el profesor (valores medidos,
  pruebas de estrés, criterios de corrección) siguen en `temario/soluciones/`.
- Los estilos están al final de `assets/aula.css`, en el bloque «Recuadro Entrega».
  Es compartido: cualquier cambio se replica en el otro repositorio.

### Nombres de los archivos de entrega

El recuadro da el **nombre exacto** de cada archivo según las normas de entrega del
módulo (`<usuario>` es el usuario del alumno):

| Qué se entrega | Nombre |
|---|---|
| Práctica en PDF | `<usuario>_pNN.pdf` (tema y número de práctica: `sbarrosor02_p01.pdf`) |
| Práctica en ZIP | `<usuario>_pNN.zip`, con `<usuario>_pNN.pdf` en la raíz si se pide memoria |
| Bloque de un boletín | `<usuario>_E<tema><bloque>.zip` (`sbarrosor02_E23.zip`), con la memoria `<usuario>_E23.pdf` en la raíz |
| Ejercicio de los apuntes | `<usuario>_ENN.pdf` |
| Archivo de una actividad dentro del ZIP | `<usuario>_aNN.<ext>`; NN es el número del ejercicio o actividad dentro del bloque o práctica |
| Varios archivos de una actividad con la misma extensión | `<usuario>_a01_1.jpg`, `<usuario>_a01_2.jpg`… |
| Entrega en grupo | `<usuario1>_<usuario2>_pNN.<ext>`; todos los integrantes la suben |

- Si un archivo recoge varios ejercicios, lleva el número del último ejercicio
  obligatorio que lo modifica.
- En una entrega individual de una actividad por parejas (como el bloque 2.6 de 0223),
  cada alumno sube su ZIP con su usuario.
- La memoria cumple las normas de presentación: portada, índice con hiperenlaces,
  páginas numeradas, enunciado en negrita y respuesta en normal, `Figura N: …`,
  comandos en texto monoespaciado, trabajo a mano fotografiado, sin faltas y capturas
  de pantalla completa con fecha y nombre del archivo.
- El recuadro incluye una tabla «En tu carpeta → Nombre dentro del ZIP» y la lista de
  capturas que no pueden faltar en la memoria. Los boletines llevan además, antes del
  primer bloque, un apartado «Cómo se entrega cada bloque» con estas normas.

## Revisión del 18/11/2026 · una página por tema y cuatro secciones

Motivo: la portada y las páginas de tema acumulaban accesos («Ahora en clase»,
destacados, mapas de boletines) y costaba encontrar las cosas.

- **Portada:** solo las tarjetas de los temas, con accesos directos a sus secciones
  y a la teoría en PDF. Se quita «Ahora en clase» (`destacados` queda vacío).
- **Página del tema (`utNN.html`):** cuatro secciones con color e icono propios:
  Teoría (azul), Ejercicios (verde), Prácticas (naranja) y Preparar el examen
  (morado). El mapa de criterios y el recorrido quedan plegados en «Qué se evalúa
  y en qué orden se trabaja».
- **Un enlace por boletín:** cada boletín es su página (`utNN-boletin-N.html`).
  `utNN-ejercicios.html` es ahora el índice de la sección y redirige los enlaces
  antiguos (`utNN-ejercicios.html#ej-5-2` → `ut03-boletin-5.html#ej-5-2`), así
  que los enlaces de Moodle siguen funcionando. La división se hizo una vez con
  `scripts/migrar_organizacion.py` (se conserva como registro; no hay que volver a
  ejecutarlo).
- **Preparar el examen (`utNN-examen.html`):** tests, simulacros, autoevaluaciones
  de la teoría y ejercicios tipo examen. Simulacro nuevo: `ut03-test-1.html`
  (1.ª parte del tema 3, apartados 3.1 a 3.7, banco de 65 preguntas en
  `assets/ut03-test-1.js`).
- **Teoría en PDF:** `python scripts/generar_pdf_teoria.py [N]` imprime con Chrome
  las páginas de teoría de cada tema (estilo de impresión, todo desplegado, las
  actividades interactivas sustituidas por un aviso) y las une en
  `web/descargas/teoria/utNN-teoria.pdf` con marcadores. Necesita `playwright` y
  `pypdf` (o `CHROME=/ruta/a/chrome`). Hay que regenerarlo cuando cambia la teoría.
- **Estilos:** van en `assets/organizacion.css`, propio de 0221. No se han tocado
  `estilo.css`, `aula.css` ni `aula.js` (compartidos con 0223); el generador solo
  aplica la nueva organización cuando el módulo es 0221.

- **En clase (rojo, 🏆):** quinta sección para los juegos y competiciones del aula
  (`web/juegos/`): gymkana de placas y concursos. Se enlazan con `../juegos/…`.
  El ejercicio 5.2 sigue enlazando también a la gymkana.
- **Simuladores:** dentro de Ejercicios van en su propio bloque, «Simuladores e
  interactivos», separados de los boletines. Se marca con `"grupo": "interactivo"`.

### Dónde va cada material nuevo

Añádelo en `temas.json` → tema → `secciones` → `teoria`, `ejercicios`,
`practicas`, `examen` o `enclase` (`etiqueta`, `titulo`, `url`, `texto`) y ejecuta
`python scripts/actualizar_aula.py`: crea la tarjeta, la barra del tema, el índice
de la sección, las migas y el «anterior / siguiente».
