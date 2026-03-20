let stores = JSON.parse(localStorage.getItem("stores")) || [];

function save() {
  localStorage.setItem("stores", JSON.stringify(stores));
}

function formatDate() {
  const now = new Date();

  return "📅 " + now.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function daysSince(date) {
  if (!date) return 999;
  return (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
}

function isAvailable(store) {
  return daysSince(store.lastVisit) >= 2;
}

function getToday() {
  return stores
    .filter(isAvailable)
    .sort((a, b) => daysSince(b.lastVisit) - daysSince(a.lastVisit))
    .slice(0, 10);
}

function markVisited(i) {
  stores[i].lastVisit = new Date().toISOString();
  save();
  render();
}

function addStore() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;

  if (!name) return;

  stores.push({
    name,
    address,
    lastVisit: null
  });

  save();
  render();
}

function render() {
  // 👉 ДАТА
  document.getElementById("today").innerText = formatDate();

  const list = document.getElementById("list");
  list.innerHTML = "";

  getToday().forEach((store, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${store.name}</b><br>
      ${store.address}<br>
      не был ${Math.floor(daysSince(store.lastVisit))} дн.<br>
      <button onclick="markVisited(${stores.indexOf(store)})">✅ Был</button>
      <hr>
    `;

    list.appendChild(li);
  });
}

render();
