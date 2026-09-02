// Shared client-side renderer for the publications database.
// Every page loads data/publications.json and renders through these helpers,
// so adding a publication means rebuilding one JSON file only
// (scripts/build_publications.py, from the CV in cv/).

const PUB_AREAS = {
  "ai-ml": "Machine Learning & AI for the Physical Sciences",
  "time-series": "Time Series Analysis & Signal Detection",
  "water": "Hydrology & Flood Prediction",
  "atmospheric": "Atmospheric Science, Air Quality & Climate Signals",
  "volcano": "Volcano Monitoring & Natural Hazards",
  "geospatial": "GPS, GIS & Geospatial Analysis",
  "education": "Analytics Education & AI in Teaching",
  "software": "Statistical Software & the R Package sima"
};

const PUB_SECTIONS = {
  "journal": "Journal Article",
  "proceedings": "Conference Proceedings",
  "presentation": "Conference Presentation",
  "book": "Book"
};

function loadPubs() {
  return fetch("data/publications.json").then(r => r.json());
}

function pubItemHtml(p) {
  let links = "";
  const order = ["doi", "paper", "abstract", "book website", "amazon", "link"];
  const keys = Object.keys(p.links).sort(
    (a, b) => order.indexOf(a) - order.indexOf(b));
  for (const k of keys) {
    const ext = p.links[k].startsWith("http") ? ' target="_blank" rel="noopener"' : ' target="_blank"';
    links += `<a href="${p.links[k]}"${ext}>${k}</a>`;
  }
  if (links) links = `<div class="pub-links">${links}</div>`;
  return `<div class="pub-item">${p.citation_html}${links}</div>`;
}

// Render a list grouped by year (descending) into the element with id elId.
function renderPubList(elId, pubs, opts) {
  opts = opts || {};
  const el = document.getElementById(elId);
  if (!el) return;
  if (!pubs.length) {
    el.innerHTML = '<p class="text-muted">No publications match the current filters.</p>';
    return;
  }
  pubs = [...pubs].sort((a, b) => (b.year || 0) - (a.year || 0));
  let html = "", lastYear = null;
  for (const p of pubs) {
    if (!opts.noYearHeadings && p.year !== lastYear) {
      html += `<h3 class="pub-year-heading">${p.year || "Undated"}</h3>`;
      lastYear = p.year;
    }
    html += pubItemHtml(p);
  }
  el.innerHTML = html;
}
