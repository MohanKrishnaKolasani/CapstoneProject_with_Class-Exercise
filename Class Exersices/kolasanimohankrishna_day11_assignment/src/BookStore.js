import dispatcher from "./Dispatcher";

class MyBookStore {
  constructor() {
    this.bookList = [];
    this.listeners = [];
    dispatcher.register(this.handleAction.bind(this));
  }

  handleAction(action) {
    if (action.actionType === "ADD_NEW_BOOK") {
      this.bookList.push(action.data);
      this.notify();
    }
  }

  setInitialBooks(books) {
  this.bookList = books;
  this.notify();
}

  subscribe(fn) {
    this.listeners.push(fn);
  }

  unsubscribe(fn) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }

  notify() {
    this.listeners.forEach((fn) => fn());
  }

  getAllBooks() {
    return this.bookList;
  }
}

export default new MyBookStore();