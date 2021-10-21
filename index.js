const express = require('express');
const cors = require('cors');
const api = require('./api');


const application = express();
const port = process.env.PORT || 4002;

application.use(express.json());
application.use(cors());

application.get('/add/:n/:m', (request, response) => {
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(n, m);
    response.send(`${n} + ${m} = ${sum}.`);
});

application.get('/customers', (request, response) => {
    response.json(api.getCustomers());
});

application.post('/register', (request, response) => {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    let exists = api.addCustomer(name, email, password);
    if (exists) {
        response.status(403).json({message: "A customer with the same email already exists."});
    }
    else {
        response.json({message: 'The customer added.'});
    }
});

application.post('/login', (request, response) => {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    let exists = api.addCustomer(name, email, password);
    if (exists) {
        response.json({"isvalid": true, "message": "customer already exists"});
    }
    else {
        response.json({"isvalid": false, "message": "customer does not exist"});
    }
});

application.get('/flowers', (request, response) => {
    response.json(api.getFlowers());
});

application.get('/quizzes', (request, response) => {
    response.json(api.getQuizzes());
});

application.get('/quiz/:id', (request, response) => {
    let quiz = api.getQuiz(request.params.id);
    response.json(quiz);
});

application.post('/score', (request, response) => {
    let quizTaker = request.body.quizTaker;
    let quizId = request.body.quizId;
    let score = request.body.score;
    response.json((api.addScore(quizTaker, quizId, score)), {message: "Score has been updated."});
});

application.get('/scores/:quiztaker/:quizid', (request, response) => {
    let quizTaker = request.params.quiztaker;
    let quizId = request.params.quizid;
    response.json(api.checkScore(quizTaker, quizId));
});

application.listen(port, () => console.log('Listening on port ' + port));