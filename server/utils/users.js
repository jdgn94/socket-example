// {[
//   id: "isoal123lihf",
//   name: "Juan",
//   room: "My room"
// ]}

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    let user = {id, name, room}
    this.users.push(user);
    return user;
  }

  getUsersList(room) {
    let users = this.users.filter((user) => user.room === room);
    let namesArrays = users.map((user) => user.name);
    
    return namesArrays;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  removeUser(id) {
    let user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }
}

module.exports = {Users};