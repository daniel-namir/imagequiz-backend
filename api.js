const db = require('./data_tier/db.js');

let add = (n, m) => {
    return n + m;
}

let getFlowers = () => {
    return db.getFlowers();
}

let getQuizzes = () => {
    return db.getQuizzes();
}

let getQuiz = (id) => {
    return db.getQuiz(id);
}

let addCustomer = (name, email, password) => {
    return db.addCustomer(name, email, password);
}

let login = (email, password) => {
    return db.login(email, password);
}

let getCustomers = () => {
    return db.getCustomers();
}

let addQuestion = (picture, choices, answer) => {
    return db.addQuestion(picture, choices, answer);
}

let addCategory = (name) => {
    return db.addCategory(name);
}

let addQuiz = (name, category_id) => {
    return db.addQuiz(name, category_id);
}

let addQuestionToQuiz = (quiz_id, question_id) => {
    return db.addQuestionToQuiz(quiz_id, question_id);
}

let addScore = (quizTaker, quizId, score) => {
    return db.addScore(quizTaker, quizId, score);
}

let checkScore = (quizTaker, quizId) => {
    return db.checkScore(quizTaker, quizId);
}

exports.add = add;
exports.getCustomers = getCustomers;
exports.addCustomer = addCustomer;
exports.login = login;
exports.getFlowers = getFlowers;
exports.getQuizzes = getQuizzes;
exports.addCategory = addCategory;
exports.getQuiz = getQuiz;
exports.getQuizzes = getQuizzes;
exports.addQuiz = addQuiz;
exports.addQuestion = addQuestion;
exports.addQuestionToQuiz = addQuestionToQuiz;
exports.addScore = addScore;
exports.checkScore = checkScore;