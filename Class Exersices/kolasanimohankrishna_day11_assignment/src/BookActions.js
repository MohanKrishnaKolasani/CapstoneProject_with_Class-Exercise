import dispatcher from "./Dispatcher";
export function addNewBook(bookData) {
  dispatcher.send({ actionType: "ADD_NEW_BOOK", data: bookData });
}