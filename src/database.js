import addEntryCardToDom from "./addEntryCardToDom";

const entriesSection = document.getElementsByClassName("db-entries")[0];
const STORE_NAME = "userStore";
let db;

export const DB_NAME = "indexedDBDemo";

export const addDataToDB = (data, id) => {
  const openRequest = indexedDB.open(DB_NAME);

  openRequest.onupgradeneeded = () => {
    db = openRequest.result;
    const store = db.createObjectStore(STORE_NAME);
    store.createIndex("name", "name");
    store.createIndex("job", "job");
    store.createIndex("age", "age");
    store.createIndex("os", "os");
    store.createIndex("languages", "languages");
  };

  openRequest.onsuccess = () => {
    db = openRequest.result;
    addData(data);
  };

  const addData = (data) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const userStore = transaction.objectStore(STORE_NAME);
    userStore.add(data, id);
  };
};

export const removeDataFromDB = (id) => {
  const openRequest = indexedDB.open(DB_NAME);
  openRequest.onsuccess = () => {
    db = openRequest.result;
    removeData(id);
  };

  const removeData = (id) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const userStore = transaction.objectStore(STORE_NAME);
    userStore.delete(id);
  };
};

export const fetchDataFromDB = () => {
  const openRequest = indexedDB.open(DB_NAME);
  openRequest.onsuccess = () => {
    db = openRequest.result;
    fetchData();
  };

  const fetchData = () => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const userStore = transaction.objectStore(STORE_NAME);
    const fetch = userStore.getAll();
    let data;

    fetch.onsuccess = () => {
      data = fetch.result;
      for (const entry in data) {
        addEntryCardToDom(data[entry], entriesSection, entry);
      }
    };
  };
};
