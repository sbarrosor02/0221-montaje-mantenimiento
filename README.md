# 0221 · Montaje y mantenimiento de equipo

Material didáctico del módulo profesional **0221 Montaje y mantenimiento de
equipo** del CFGM de Sistemas Microinformáticos y Redes (IES Valle del Jerte,
Cáceres). 2.º curso, 6 h/semana, curso 2026/2027.

Currículo: **Decreto 272/2009**, de 28 de diciembre (DOE nº 1, 4 de enero de
2010). Los RA y CE se transcriben literalmente del decreto.

## Estructura

```
temario/     apuntes y material de cada tema (utNN-*.md con cabecera YAML)
practicas/   enunciados y plantillas de prácticas
examenes/    pruebas escritas y soluciones — NO se publica (en .gitignore)
web/         sitio del módulo, un apartado por tema
```

### web/

```
web/
├── index.html          portada: listado de temas
├── temas/utNN.html      una página por tema
├── assets/estilo.css    hoja de estilos (copia compartida con 0223)
└── datos/temas.json     índice de temas
```

Al crear o modificar un tema en `temario/` hay que: (1) generar/actualizar
`web/temas/utNN.html`, (2) actualizar `web/datos/temas.json` y (3) regenerar
`web/index.html`.

## Estado

- **Tema 0 — Presentación y evaluación inicial**: publicado.
  Prueba diagnóstica autocorregible en `web/temas/ut00.html`. No evalúa RA ni CE
  y no cuenta para la nota.
- **Tema 1 — Electricidad y electrónica**: portada, teoría, seguridad y PRL,
  ejercicios y prácticas P1–P3 disponibles. Los boletines de circuitos están
  completos: 10 ejercicios del primero y 5 del segundo, además de 3 resueltos.
  Boletín 3 de potencia y energía: 3 resueltos y 12 ejercicios (solucionario en
  `temario/ut01-ejercicios-potencia.md`). La P2 incluye 5 retos voluntarios de
  montaje con varios LED y un puente de Wheatstone.
  Los seis esquemas incorporados desde los PDF se pueden ampliar y descargar.
  Boletín 4 (mixtos avanzados) y boletín 5 (circuitos dibujados para
  despistar), 6 ejercicios cada uno, con esquemas generados y verificados por
  `scripts/generar_boletines_4_5.py`. Solucionarios en `temario/soluciones/`.
  El **taller de nudos** (`web/temas/ut01-ejercicios-nudos.html`) permite
  colorear los nudos y reducir paso a paso los circuitos del boletín 5.
  La entrega de la P2 se hace como informe técnico con la guía
  `web/temas/ut01-practicas-p2-informe.html`.
- Resto de temas: pendientes.

## Navegación del aula

La portada ofrece accesos a apuntes, ejercicios y prácticas. El catálogo
`web/recursos.html` reúne el material y las descargas con filtros y búsqueda.
Las lecciones incluyen un índice de apartados adaptable a móvil.

Después de añadir o modificar páginas, ejecutar
`python scripts/actualizar_aula.py` para actualizar portada, catálogo e índices.
Consulta [la organización y el mantenimiento](docs/organizacion-aula.md).

### Dirección publicada

<https://sbarrosor02.github.io/0221-montaje-mantenimiento/>

Se despliega sola: el workflow `.github/workflows/pages.yml` publica la carpeta
`web/` en GitHub Pages con cada `push` a `main` que la toque. Es HTML/CSS plano,
sin dependencias ni build; también se abre con doble clic desde el disco.
