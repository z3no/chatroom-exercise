class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    getUserList(room) {
        //looping through users array, filtering out every user in a room
        let usersRoom = this.users.filter((user) => user.room === room);
        //grabbing the names of the user in the room
        let namesArray = usersRoom.map((user) => user.name);

        return namesArray;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id) {
        let user = this.getUser(id);

        if(user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

}

module.exports = {Users};