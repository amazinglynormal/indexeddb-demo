import addNewEntryCard from "./addNewEntryCard";
import { addNewTransaction } from "./addNewTransaction";

const entriesSection = document.getElementsByClassName("db-entries")[0];
const STORE_NAME = "userStore";
let db;

export const DB_NAME = "indexedDBDemo";

const transactionSuccessful = () => {
  addNewTransaction("success", "Transaction successfully completed.");
};

const storeRequestSuccessful = () => {
  addNewTransaction("success", "Request successful.");
};

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

  openRequest.onerror = () => {
    addNewTransaction("error", "Error opening database");
  };

  const addData = (data) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    transaction.oncomplete = transactionSuccessful;
    transaction.onerror = () => {
      addNewTransaction("error", transaction.error);
    };
    const userStore = transaction.objectStore(STORE_NAME);
    const storeRequest = userStore.add(data, id);
    storeRequest.onsuccess = storeRequestSuccessful;
  };
};

export const removeDataFromDB = (id) => {
  const openRequest = indexedDB.open(DB_NAME);
  openRequest.onsuccess = () => {
    db = openRequest.result;
    removeData(id);
  };

  openRequest.onerror = () => {
    addNewTransaction("error", "Error opening database");
  };

  const removeData = (id) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    transaction.oncomplete = transactionSuccessful;
    transaction.onerror = () => {
      addNewTransaction("error", transaction.error);
    };

    const userStore = transaction.objectStore(STORE_NAME);
    const storeRequest = userStore.delete(id);

    storeRequest.onsuccess = storeRequestSuccessful;
  };
};

export const fetchDataFromDB = () => {
  const openRequest = indexedDB.open(DB_NAME);
  openRequest.onsuccess = () => {
    db = openRequest.result;
    fetchData();
  };

  openRequest.onerror = () => {
    addNewTransaction("error", "Error opening database");
  };

  const fetchData = () => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    transaction.oncomplete = transactionSuccessful;
    transaction.onerror = () => {
      addNewTransaction("error", transaction.error);
    };

    const userStore = transaction.objectStore(STORE_NAME);
    const fetch = userStore.getAllKeys();
    let data;

    fetch.onsuccess = () => {
      data = fetch.result;
      for (const key of data) {
        const entry = userStore.get(key);
        entry.onsuccess = () => {
          const info = entry.result;
          addNewEntryCard(info, entriesSection, key);
        };
      }
      addNewTransaction("success", "Existing data successfully fetched");
    };
  };
};
