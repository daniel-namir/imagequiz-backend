var { flowers } = require('./flowers.js');
var { customers } = require('./customers.js');
var { quizzes } = require('./data.js');
const { scores } = require('./scores.js');

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
    let quizList = [];
    for (let i = 0; i < quizzes.length; i++) {
        quizList.push(quizzes[i]);
    }
    return quizList;
}

let getQuiz = (id) => {
    for (let i = 0; i < quizzes.length; i++) {
        for (let j = 0; j < quizzes[i].length; j++) {
            if (quizzes[i][j] == id) {
                return quizzes[i][j];
            }
        }
    }
}

let addCustomer = (name, email, password) => {
    let alreadyExist = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (alreadyExist) {
        return true
    }
    customers.push({id: customers.length + 1, name: name, email: email, password: password});
    return false;
}

let addScore = (quizTaker, quizID, score) => {
    scores.push(quizTaker, quizID, score);
}

exports.add = add;
exports.customers = customers;
exports.getCustomers = getCustomers;
exports.addCustomer = addCustomer;
exports.getFlowers = getFlowers;
exports.getQuizzes = getQuizzes;
exports.getQuiz = getQuiz;
exports.addScore = addScore;