import "./styles.css";
const DB_NAME = "indexedDBDemo";

const initializeDBBtn = document.querySelector(".initialize-db-btn");
const deleteDBBtn = document.querySelector(".delete-db-btn");
const form = document.querySelector("form");
const entriesSection = document.getElementsByClassName("db-entries")[0];
let dbExists = false;
let db;
let store;

(async function () {
  const dbs = await indexedDB.databases();
  dbs.forEach((db) => {
    if (db.name === DB_NAME) dbExists = true;
  });
})();

if (dbExists) {
  initializeDBBtn.setAttribute("disabled", "");
} else {
  deleteDBBtn.setAttribute("disabled", "");
}

initializeDBBtn.addEventListener("click", () => {
  const DBOpenRequest = indexedDB.open(DB_NAME);
  initializeDBBtn.setAttribute("disabled", "");
  deleteDBBtn.removeAttribute("disabled");

  DBOpenRequest.onsuccess = function () {
    db = DBOpenRequest.result;
    store = db.createObjectStore("userStore");
    store.createIndex("user", "user");
    dbExists = true;
  };
});

deleteDBBtn.addEventListener("click", () => {
  indexedDB.deleteDatabase(DB_NAME);
  dbExists = false;
  initializeDBBtn.removeAttribute("disabled");
  deleteDBBtn.setAttribute("disabled", "");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  new FormData(form);
});

form.addEventListener("formdata", (event) => {
  //extract form data into object for ease of use
  const fd = event.formData;
  const data = {};
  for (const key of fd.keys()) {
    if (key === "languages") data[key] = fd.getAll(key);
    else data[key] = fd.get(key);
  }

  // addDataToDB(data);
  addEntryCardToDom(data);
});

function addDataToDB(data) {
  const transaction = db.transaction("userStore", "readwrite");
  const userStore = transaction.objectStore("userStore");
  userStore.add(data);
}

function addEntryCardToDom(data) {
  const article = document.createElement("article");
  const id = makeId();
  article.setAttribute("id", id);
  article.setAttribute("class", "entry-card");

  const dl = document.createElement("dl");
  dl.setAttribute("class", "entry-detail-list");

  for (const key in data) {
    const div = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");

    const keyName = document.createTextNode(key);
    dt.appendChild(keyName);

    const value = document.createTextNode(data[key]);
    dd.appendChild(value);

    div.appendChild(dt);
    div.appendChild(dd);

    dl.appendChild(div);
  }

  article.appendChild(dl);

  const divForBtn = document.createElement("div");
  const deleteBtn = document.createElement("button");

  deleteBtn.setAttribute("type", "button");
  deleteBtn.setAttribute("class", "delete-entry-btn");
  deleteBtn.setAttribute("id", `${id}-btn`);
  const deleteText = document.createTextNode("Delete");
  deleteBtn.appendChild(deleteText);
  deleteBtn.addEventListener("click", () => {
    deleteBtn.parentNode.parentNode.parentNode.removeChild(id);
  });

  divForBtn.appendChild(deleteBtn);
  article.appendChild(divForBtn);
  console.log(entriesSection);

  entriesSection.appendChild(article);
}

function makeId() {
  const result = [];
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = chars.length;
  for (let i = 0; i < 5; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * charsLength)));
  }
  return result.join("");
}
