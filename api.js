var { flowers } = require('./flowers.js');
var { customers } = require('./customers.js');
var { quizzes } = require('./data.js');

let add = (n, m) => {
    return n + m;
}

let getCustomers = (customers) => {
    return customers;
}

let getFlowers = () => {
    let flowersList = [];
    for (let i = 0; i < flowers.length; i++) {
        flowersList.push(flowers[i]);
    }
    return flowersList;
}

let getQuizzes = () => {
    return quizzes;
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
exports.getQuizzes = getQuizzes;