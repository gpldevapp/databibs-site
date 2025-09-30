// script.js
// Ejemplo de datos: reemplazalos por tus textos reales.
// Estructura: categories: [{ id, title, meta, items: [{title, quote, ref, link, book, type, source}] }]

const data = [
  {
    id: "cat-1",
    title: "Scientific Absurdities & Historical Inaccuracies",
    meta: "Ejemplos de pasajes con problemas técnicos/históricos",
    items: [
      {
        title: "Creation account mismatch",
        quote: "Versión A y versión B parecen contar la creación de forma diferente.",
        ref: "Genesis 1:1 / Genesis 2:4",
        link: "#",
        book: "Genesis",
        type: "Inaccuracy",
        source: "Skeptics Annotated"
      },
      {
        title: "Ages of the patriarchs",
        quote: "Ciertas edades reportadas parecen incompatibles entre capítulos.",
        ref: "Genesis 5",
        link: "#",
        book: "Genesis",
        type: "Scientific Absurdity",
        source: "Skeptics Annotated"
      }
    ]
  },
  {
    id: "cat-2",
    title: "Cruelty & Violence",
    meta: "Pasajes que mandan violencia o castigos severos",
    items: [
      {
        title: "Punishments prescribed",
        quote: "Mandatos de castigo corporal severo en ciertos textos.",
        ref: "Deuteronomy X",
        link: "#",
        book: "Deuteronomy",
        type: "Moral",
        source: "Author notes"
      }
    ]
  },
  {
    id: "cat-3",
    title: "Misogyny & Discrimination",
    meta: "Pasajes con lenguaje o leyes discriminatorias",
    items: [
      {
        title: "Laws about women",
        quote: "Leyes antiguas que regulan fuertemente a mujeres.",
        ref: "Leviticus Y",
        link: "#",
        book: "Leviticus",
        type: "Social",
        source: "Skeptics Annotated"
      }
    ]
  }
];

// ---- render & controls ----
const filters = {
  book: "All",
  type: "All",
  source: "All",
  search: ""
};

function uniqueValuesFromData(key){
  const set = new Set();
  data.forEach(cat => cat.items.forEach(it => set.add(it[key] || 'Unknown')));
  return Array.from(set).sort();
}

function populateFilterOptions(){
  const bookSel = document.getElementById('filter-book');
  const typeSel = document.getElementById('filter-type');
  const sourceSel = document.getElementById('filter-source');

  uniqueValuesFromData('book').forEach(b=>{
    const o = document.createElement('option'); o.value = b; o.textContent = b; bookSel.appendChild(o);
  });
  uniqueValuesFromData('type').forEach(b=>{
    const o = document.createElement('option'); o.value = b; o.textContent = b; typeSel.appendChild(o);
  });
  uniqueValuesFromData('source').forEach(b=>{
    const o = document.createElement('option'); o.value = b; o.textContent = b; sourceSel.appendChild(o);
  });

  bookSel.addEventListener('change', e=>{ filters.book = e.target.value; render(); });
  typeSel.addEventListener('change', e=>{ filters.type = e.target.value; render(); });
  sourceSel.addEventListener('change', e=>{ filters.source = e.target.value; render(); });

  document.getElementById('search').addEventListener('input', e=>{
    filters.search = e.target.value.trim().toLowerCase();
    render();
  });
}

function matchesFilter(item){
  if(filters.book !== 'All' && item.book !== filters.book) return false;
  if(filters.type !== 'All' && item.type !== filters.type) return false;
  if(filters.source !== 'All' && item.source !== filters.source) return false;
  if(filters.search){
    const hay = (item.quote + ' ' + item.title + ' ' + item.ref).toLowerCase();
    if(!hay.includes(filters.search)) return false;
  }
  return true;
}

function render(){
  const content = document.getElementById('content');
  content.innerHTML = '';

  // cuando no hay resultados, mostrar mensaje
  let totalMatches = 0;

  data.forEach(cat=>{
    const filteredItems = cat.items.filter(matchesFilter);
    if(filteredItems.length === 0) return;

    totalMatches += filteredItems.length;

    const catEl = document.createElement('article');
    catEl.className = 'category';
    catEl.id = cat.id;

    const h2 = document.createElement('h2'); h2.textContent = cat.title;
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = cat.meta;

    const list = document.createElement('div');
    filteredItems.forEach(it=>{
      const itemEl = document.createElement('div'); itemEl.className = 'item';
      const quote = document.createElement('div'); quote.className = 'quote';
      const bq = document.createElement('blockquote'); bq.textContent = it.quote;
      const ref = document.createElement('div'); ref.className = 'ref';
      ref.innerHTML = `<strong>${it.title}</strong> — ${it.ref} • <a href="${it.link}" target="_blank" rel="noopener">ver</a>`;

      quote.appendChild(bq);
      quote.appendChild(ref);
      itemEl.appendChild(quote);
      list.appendChild(itemEl);
    });

    // small numbered list of items at bottom (contradictions list style)
    const smallList = document.createElement('div'); smallList.className = 'contradictions-list';
    const ol = document.createElement('ol');
    filteredItems.forEach(it=>{
      const li = document.createElement('li');
      li.innerHTML = `<a href="${it.link}" target="_blank" rel="noopener">${it.title} — ${it.ref}</a>`;
      ol.appendChild(li);
    });
    smallList.appendChild(ol);

    catEl.appendChild(h2);
    catEl.appendChild(meta);
    catEl.appendChild(list);
    catEl.appendChild(smallList);

    content.appendChild(catEl);
  });

  if(totalMatches === 0){
    const no = document.createElement('div'); no.style.padding = '18px'; no.textContent = 'No se encontraron resultados con esos filtros.';
    content.appendChild(no);
  }
}

function expandAll(){
  document.querySelectorAll('.category').forEach(cat=>{
    cat.style.boxShadow = '0 12px 30px rgba(20,30,50,0.06)';
    cat.querySelectorAll('.item blockquote').forEach(bq=> bq.style.maxHeight = 'none');
  });
}
function collapseAll(){
  document.querySelectorAll('.category').forEach(cat=>{
    cat.style.boxShadow = '';
    cat.querySelectorAll('.item blockquote').forEach(bq=> bq.style.maxHeight = '');
  });
}

// init
populateFilterOptions();
render();

document.getElementById('btn-expand').addEventListener('click', expandAll);
document.getElementById('btn-collapse').addEventListener('click', collapseAll);

// Expose data for debugging/edit desde consola
window._BC_DATA = data;
