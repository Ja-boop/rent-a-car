module.exports = class Client {
    constructor({
        id,
        name,
        lastName,
        identifierType,
        identifierNumber,
        nationality,
        address,
        phone,
        email,
        birthday,
    }) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.identifierType = identifierType;
        this.identifierNumber = identifierNumber;
        this.nationality = nationality;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.birthday = birthday;
    }
};
