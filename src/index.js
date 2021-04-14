import "./styles.css";
const DB_NAME = "indexedDBDemo";

const initializeDBBtn = document.querySelector(".initialize-db-btn");
const deleteDBBtn = document.querySelector(".delete-db-btn");
const form = document.querySelector("form");
let dbExists = false;
let db;

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
  for (const val of event.formData.keys()) console.log(val);
});
