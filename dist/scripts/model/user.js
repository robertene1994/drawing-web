class User {
    constructor(firstName = undefined, lastName = undefined,
        email = undefined, password = undefined) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    fromJson(obj) {
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.password = obj.password;
        return this;
    }

    toJson() {
        return {
            'firstName': this.firstName,
            'lastName': this.lastName,
            'email': this.email,
            'password': this.password
        };
    }
}
