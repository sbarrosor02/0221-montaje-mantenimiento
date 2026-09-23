(() => {
  const index = document.querySelector('.aula-indice details');
  if (index) {
    const compact = matchMedia('(max-width: 850px)');
    const adapt = () => { index.open = !compact.matches; };
    adapt();
    compact.addEventListener('change', adapt);
  }
  const printButton = document.querySelector('[data-imprimir]');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }
  let opened = [];
  window.addEventListener('beforeprint', () => {
    opened = Array.from(document.querySelectorAll('details')).map(element => [element, element.open]);
    opened.forEach(([element]) => { element.open = true; });
  });
  window.addEventListener('afterprint', () => {
    opened.forEach(([element, state]) => { element.open = state; });
  });
  const search = document.querySelector('#buscar-material');
  if (!search) return;
  document.querySelector('.aula-busqueda').hidden = false;
  const entries = Array.from(document.querySelectorAll('[data-material]'));
  const buttons = Array.from(document.querySelectorAll('[data-filtro]'));
  const status = document.querySelector('#estado-busqueda');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const parameters = new URLSearchParams(location.search);
  let category = parameters.get('tipo') || 'todos';
  if (!buttons.some(button => button.dataset.filtro === category)) category = 'todos';
  search.value = parameters.get('q') || '';
  function filter() {
    const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    entries.forEach(entry => {
      const haystack = normalize(entry.textContent + ' ' + entry.dataset.busqueda);
      const visible = (category === 'todos' || entry.dataset.material === category) && words.every(word => haystack.includes(word));
      entry.hidden = !visible;
      if (visible) count++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filtro === category)));
    status.textContent = count ? count + ' materiales encontrados.' : 'No hay coincidencias. Prueba otra palabra o elige Todos.';
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filtro; filter(); }));
  search.addEventListener('input', filter);
  document.querySelector('[data-limpiar]').addEventListener('click', () => {
    search.value = '';
    category = 'todos';
    filter();
    search.focus();
  });
  filter();
})();
