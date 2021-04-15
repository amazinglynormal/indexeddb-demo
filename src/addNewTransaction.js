const transactionList = document.querySelector(".db-transactions ul");

export const addNewTransaction = (type, text) => {
  const li = document.createElement("li");
  const transaction = document.createTextNode(text);
  li.appendChild(transaction);
  li.setAttribute("class", type);

  transactionList.appendChild(li);
};
