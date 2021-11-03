

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const connectionString = 
'postgres://npcdlzxlabxrla:d4f5762d003dd29d0bd2a95e16a954e3c9f1ab03cc9796daee714e37e3365903@ec2-107-23-135-132.compute-1.amazonaws.com:5432/da2f8nn3s251eo';

const connection = {
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
}

const pool = new Pool(connection);

let getCustomers = () => {
    return pool.query(`select * from imagequiz.customer`)
    .then(x => x.rows);
}

let addCustomer = (name, email, password) => {
    const salt = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return pool.query('insert into imagequiz.customer(name, email, password) values ($1, $2, $3)', [name, email.toLowerCase(), hashedPassword]);
}

let addQuestion = (picture, choices, answer) => {
    return pool.query('insert into imagequiz.question(picture, choices, answer) values ($1, $2, $3)', [picture, choices, answer]);
}

let addCategory = (name) => {
    return pool.query('insert into imagequiz.category(name) values ($1)', [name]);
}

let addQuiz = (name, category_id) => {
    return pool.query('insert into imagequiz.quiz(name, category_id) values ($1, $2)', [name, category_id]);
}

let getQuiz = (quiz_id) => {
    return pool.query(`select * from imagequiz.quiz where id = $1`, [quiz_id])
    .then(x => x.rows);
}

let addQuestionToQuiz = (quiz_id, question_id) => {
    return pool.query('insert into imagequiz.quiz_question(quiz_id, question_id) values ($1, $2)', [quiz_id, question_id]);
}

exports.getCustomers = getCustomers;
exports.addCustomer = addCustomer;
exports.addQuestion = addQuestion;
exports.addCategory = addCategory;
exports.addQuiz = addQuiz;
exports.getQuiz = getQuiz;
exports.addQuestionToQuiz = addQuestionToQuiz;