const { flowers } = require('./flowers.js');
var { customers } = require('./users.js');

let add = (n, m) => {
    return n + m;
}

let getCustomers = (customers) => {
    return customers;
}

let getFlowers = () => {
    return flowers;
}

let addCustomer = (name, email, password) => {
    let alreadyExist = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (alreadyExist) {
        return true
    }
    customers.push({id: customers.length + 1, name: name, email: email, password: password});
    return false;
}

exports.add = add;
exports.customers = customers;
exports.getCustomers = getCustomers;
exports.addCustomer = addCustomer;
exports.getFlowers = getFlowers;