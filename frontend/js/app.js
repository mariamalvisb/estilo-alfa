let productos = [];
const CATEGORIAS = [
  ["todas", "Todas"], ["anillos", "Anillos"], ["collares", "Collares"], ["aretes", "Aretes"], ["pulseras", "Pulseras"]
];
const METALES = { oro: "Oro amarillo 18k", plata: "Plata ley 950", rosa: "Oro rosa 18k" };
const PIEDRAS = { esmeralda: "Esmeralda", diamante: "Diamante", perla: "Perla cultivada" };
const CONTACTO = "+57 300 123 4567";

const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/* ---------- Ilustraciones (reemplazar por fotos reales más adelante) ---------- */
const TONOS = {
  oro:   ["#e3c072", "#a8822f"],
  plata: ["#e4e7ea", "#8f969d"],
  rosa:  ["#e9b6a2", "#b0705c"]
};
const GEMA = { esmeralda: ["#3fc28f", "#0b5a40"], diamante: ["#ffffff", "#a9c4d6"], perla: ["#fbf6ee", "#d4c8b5"] };

function ilustracion(p) {
  const [m1, m2] = TONOS[p.metal];
  const g = p.piedra ? GEMA[p.piedra] : null;
  const id = "p" + p.id;
  const defs = `<defs>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m1}"/><stop offset="1" stop-color="${m2}"/></linearGradient>
    ${g ? `<radialGradient id="${id}g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></radialGradient>` : ""}
  </defs>`;
  const M = `url(#${id}m)`, G = `url(#${id}g)`;
  let body = "";
  if (p.categoria === "anillos") {
    body = `<ellipse cx="100" cy="128" rx="58" ry="52" fill="none" stroke="${M}" stroke-width="12"/>`;
    if (g) body += `<path d="M84 78 L100 60 L116 78 Z" fill="${M}"/><circle cx="100" cy="62" r="17" fill="${G}" stroke="${m2}" stroke-width="2"/>`;
    else body += `<ellipse cx="100" cy="128" rx="58" ry="52" fill="none" stroke="${m2}" stroke-width="2" stroke-dasharray="4 5"/>`;
  } else if (p.categoria === "collares") {
    body = `<path d="M30 30 Q100 170 170 30" fill="none" stroke="${M}" stroke-width="3"/>
            <path d="M100 108 L100 122" stroke="${M}" stroke-width="3"/>`;
    body += g ? `<path d="M100 122 C84 142 88 168 100 168 C112 168 116 142 100 122 Z" fill="${G}" stroke="${m2}" stroke-width="2"/>`
              : `<circle cx="100" cy="140" r="18" fill="none" stroke="${M}" stroke-width="6"/>`;
  } else if (p.categoria === "aretes") {
    for (const x of [64, 136]) {
      body += `<path d="M${x} 30 q10 0 10 12" fill="none" stroke="${M}" stroke-width="3"/>`;
      body += g ? `<circle cx="${x + 10}" cy="72" r="11" fill="none" stroke="${M}" stroke-width="5"/><ellipse cx="${x + 10}" cy="118" rx="16" ry="22" fill="${G}" stroke="${m2}" stroke-width="2"/><path d="M${x + 10} 83 L${x + 10} 96" stroke="${M}" stroke-width="3"/>`
                : `<circle cx="${x + 10}" cy="95" r="34" fill="none" stroke="${M}" stroke-width="6"/><circle cx="${x + 10}" cy="95" r="24" fill="none" stroke="${m2}" stroke-width="1.5" stroke-dasharray="3 4"/>`;
    }
  } else {
    body = `<ellipse cx="100" cy="100" rx="78" ry="44" fill="none" stroke="${M}" stroke-width="${p.nombre.includes("Esclava") ? 14 : 4}"/>`;
    if (!p.nombre.includes("Esclava")) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2, x = 100 + 78 * Math.cos(a), y = 100 + 44 * Math.sin(a);
        body += g ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${G}" stroke="${m2}" stroke-width="1"/>`
                  : `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="6" fill="none" stroke="${M}" stroke-width="3" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }
    }
  }
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.nombre}">${defs}${body}</svg>`;
}

/* ---------- Estado y render ---------- */
const estado = { categoria: "todas", metal: "", orden: "destacado" };
try { const s = JSON.parse(localStorage.getItem("filtros") || "null"); if (s) Object.assign(estado, s); } catch (e) {}

const $chips = document.getElementById("chips");
const $grid = document.getElementById("grid");
const $count = document.getElementById("count");
const $metal = document.getElementById("metal");
const $orden = document.getElementById("orden");
const $sheet = document.getElementById("sheet");
const $scrim = document.getElementById("scrim");

function guardar() { try { localStorage.setItem("filtros", JSON.stringify(estado)); } catch (e) {} }

function renderChips() {
  $chips.innerHTML = CATEGORIAS.map(([v, t]) =>
    `<button class="chip" type="button" data-cat="${v}" aria-pressed="${estado.categoria === v}">${t}</button>`).join("");
}

function filtrados() {
  let lista = productos.filter(p =>
    (estado.categoria === "todas" || p.categoria === estado.categoria) &&
    (!estado.metal || p.metal === estado.metal));
  if (estado.orden === "asc") lista.sort((a, b) => a.precio - b.precio);
  else if (estado.orden === "desc") lista.sort((a, b) => b.precio - a.precio);
  else lista.sort((a, b) => (b.destacado - a.destacado) || a.id - b.id);
  return lista;
}

function renderGrid() {
  const lista = filtrados();
  $count.textContent = `${lista.length} ${lista.length === 1 ? "pieza" : "piezas"}`;
  if (!lista.length) {
    $grid.innerHTML = `<p class="empty">No hay piezas con esa combinación. Prueba con otro metal o categoría.</p>`;
    return;
  }
  $grid.innerHTML = lista.map(p => `
    <button class="card" type="button" data-id="${p.id}">
      <div class="stage">${p.nuevo ? `<span class="tag">Nuevo</span>` : ""}${ilustracion(p)}</div>
      <h3>${p.nombre}</h3>
      <div class="meta">${METALES[p.metal]}${p.piedra ? " · " + PIEDRAS[p.piedra] : ""}</div>
      <div class="price">${cop.format(p.precio)}</div>
    </button>`).join("");
}

function abrir(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  $sheet.innerHTML = `
    <button class="close" type="button" id="cerrar">Cerrar</button>
    <div class="stage">${ilustracion(p)}</div>
    <span class="eyebrow">${CATEGORIAS.find(c => c[0] === p.categoria)[1]}</span>
    <h2 id="sheet-title">${p.nombre}</h2>
    <div class="price">${cop.format(p.precio)}</div>
    <p style="margin:0">${p.descripcion}</p>
    <dl class="specs">
      <dt>Metal</dt><dd>${METALES[p.metal]}</dd>
      <dt>Piedra</dt><dd>${p.piedra ? PIEDRAS[p.piedra] + (p.quilates ? ` · ${p.quilates.toLocaleString("es-CO")} ct` : "") : "Sin piedra"}</dd>
      <dt>Peso</dt><dd>${p.peso_g.toLocaleString("es-CO")} g</dd>
      <dt>Talla</dt><dd>${p.tallas}</dd>
      <dt>Ref.</dt><dd>CE-${String(p.id).padStart(4, "0")}</dd>
    </dl>
    <div class="ask">
      <strong>¿Te interesa esta pieza?</strong>
      Escríbenos por WhatsApp al <span id="tel">${CONTACTO}</span> con la referencia CE-${String(p.id).padStart(4, "0")}.
      <div><button class="copy" type="button" id="copiar">Copiar mensaje</button></div>
    </div>`;
  $sheet.hidden = false; $scrim.hidden = false;
  document.getElementById("cerrar").focus();
  document.getElementById("cerrar").onclick = cerrar;
  document.getElementById("copiar").onclick = (e) => {
    const texto = `Hola, me interesa la pieza CE-${String(p.id).padStart(4, "0")} (${p.nombre}). ¿Está disponible?`;
    const btn = e.currentTarget;
    navigator.clipboard.writeText(texto)
      .then(() => { btn.textContent = "Mensaje copiado"; })
      .catch(() => { btn.textContent = texto; btn.style.userSelect = "all"; });
  };
}
function cerrar() { $sheet.hidden = true; $scrim.hidden = true; }

/* ---------- Eventos ---------- */
$chips.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  estado.categoria = b.dataset.cat; guardar(); renderChips(); renderGrid();
});
$metal.addEventListener("change", () => { estado.metal = $metal.value; guardar(); renderGrid(); });
$orden.addEventListener("change", () => { estado.orden = $orden.value; guardar(); renderGrid(); });
$grid.addEventListener("click", e => { const c = e.target.closest(".card"); if (c) abrir(Number(c.dataset.id)); });
$scrim.addEventListener("click", cerrar);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$sheet.hidden) cerrar(); });

$metal.value = estado.metal; $orden.value = estado.orden;

async function cargarProductos() {
  try {
    const respuesta = await fetch("/api/productos");
    productos = await respuesta.json();
    renderChips();
    renderGrid();
  } catch (error) {
    $grid.innerHTML = `<p class="empty">No pudimos cargar el catálogo. Intenta de nuevo.</p>`;
  }
}

cargarProductos();
