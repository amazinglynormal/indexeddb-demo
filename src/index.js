import addEntryCardToDom from "./addEntryCardToDom";
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
  addEntryCardToDom(data, entriesSection);
});

function addDataToDB(data) {
  const transaction = db.transaction("userStore", "readwrite");
  const userStore = transaction.objectStore("userStore");
  userStore.add(data);
}
