import { resources } from "./data/resources.js";

function $(selector) {
  return document.querySelector(selector);
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}

function matchesQuery(resource, query) {
  if (!query) return true;
  const haystack = [
    resource.title,
    resource.note,
    ...(resource.tags ?? []),
    resource.url,
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(query);
}

function makePill(text) {
  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = text;
  return pill;
}

function renderResources(list) {
  const grid = $("#resourcesGrid");
  const count = $("#resourceCount");

  if (!grid || !count) return;

  grid.textContent = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";

    const title = document.createElement("h3");
    title.textContent = "No resources found";

    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "Try a different keyword (example: risk, excel, compliance).";

    empty.append(title, note);
    grid.appendChild(empty);
    count.textContent = "0 resources";
    return;
  }

  const label = list.length === 1 ? "resource" : "resources";
  count.textContent = `${list.length} ${label}`;

  for (const item of list) {
    const card = document.createElement("article");
    card.className = "card resource-card";

    const h3 = document.createElement("h3");
    h3.textContent = item.title;

    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = item.note ?? "";

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noreferrer noopener";
    link.setAttribute("aria-label", `Open: ${item.title}`);
    const linkText = document.createElement("span");
    linkText.textContent = "Open resource";
    const linkIcon = document.createElement("i");
    linkIcon.className = "fa-solid fa-arrow-up-right-from-square";
    linkIcon.setAttribute("aria-hidden", "true");
    link.append(linkText, linkIcon);

    const meta = document.createElement("div");
    meta.className = "resource-meta";

    for (const tag of item.tags ?? []) {
      meta.appendChild(makePill(tag));
    }

    card.append(h3, note, meta, link);
    grid.appendChild(card);
  }
}

function initResources() {
  const input = $("#resourceSearch");
  const fallback = $("#resourcesFallback");
  const initial = resources.slice();
  renderResources(initial);
  if (fallback) fallback.style.display = "none";

  if (!input) return;

  input.addEventListener("input", () => {
    const q = normalize(input.value);
    const filtered = resources.filter((r) => matchesQuery(r, q));
    renderResources(filtered);
  });
}

function initYear() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

initYear();
initResources();

