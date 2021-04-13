import "./styles.css";

const initializeDBBtn = document.querySelector(".initialize-db-btn");
const deleteDBBtn = document.querySelector(".delete-db-btn");
const form = document.querySelector("form");

// const dbExists = false;

const checkForDB = async () => {
  const dbs = await indexedDB.databases();
  console.log(dbs);
};

checkForDB();

let db;

initializeDBBtn.addEventListener("click", () => {
  const DBOpenRequest = indexedDB.open("testDB");
  console.log(DBOpenRequest);
  console.log("initalize Database");

  DBOpenRequest.onsuccess = function () {
    db = DBOpenRequest.result;
    console.log(db);
    const transaction = db.transaction("testStore", "readwrite");
    const store = transaction.objectStore("testStore");
    const req = store.add({ name: "test", job: "test", age: 30 });
    console.log(req);
  };
});

deleteDBBtn.addEventListener("click", () => {
  indexedDB.deleteDatabase("testDB");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  new FormData(form);
});

form.addEventListener("formdata", (event) => {
  console.log(event.formData.getAll());
  for (const val of event.formData.entries()) console.log(val);
});
