import addNewEntryCard from "./addNewEntryCard";
import { addDataToDB, fetchDataFromDB, DB_NAME } from "./database";
import makeId from "./makeId";
import "./styles.css";

// selectors
const initializeDBBtn = document.querySelector(".initialize-db-btn");
const deleteDBBtn = document.querySelector(".delete-db-btn");
const form = document.querySelector("form");
const entriesSection = document.getElementsByClassName("db-entries")[0];

// check for existing entries in database
(async function () {
  const dbs = await indexedDB.databases();
  dbs.forEach((db) => {
    if (db.name === DB_NAME) {
      initializeDBBtn.setAttribute("disabled", "");
      fetchDataFromDB();
    } else {
      deleteDBBtn.setAttribute("disabled", "");
    }
  });
})();

// initializeDBBtn.addEventListener("click", async () => {
//   initializeDBBtn.setAttribute("disabled", "");
//   deleteDBBtn.removeAttribute("disabled");
// });

// add listeners
deleteDBBtn.addEventListener("click", () => {
  indexedDB.deleteDatabase(DB_NAME);
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
  const id = makeId();
  addDataToDB(data, id);
  addNewEntryCard(data, entriesSection, id);
});
