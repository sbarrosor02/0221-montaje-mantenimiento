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

