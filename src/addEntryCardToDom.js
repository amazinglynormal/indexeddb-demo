import makeId from "./makeId";

export default function addEntryCardToDom(data, parentNode) {
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

    const isArray = Array.isArray(data[key]);
    let value;
    if (isArray) {
      value = document.createTextNode(data[key].join(", "));
    } else {
      value = document.createTextNode(data[key]);
    }
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
    parentNode.removeChild(article);
  });

  divForBtn.appendChild(deleteBtn);
  article.appendChild(divForBtn);

  parentNode.appendChild(article);
}
