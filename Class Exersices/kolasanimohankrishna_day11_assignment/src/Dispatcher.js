class MyDispatcher {
  constructor() { this.list = []; }
  register(fn) { this.list.push(fn); }
  send(action) { this.list.forEach((fn) => fn(action)); }
}
export default new MyDispatcher();