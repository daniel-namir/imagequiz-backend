const express = require('express');
const cors = require('cors');
const api = require('./api');
const { request } = require('express');


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
    api.getCustomers()
    .then(x => {
        response.json(x);
    })
    .catch(e => {
        console.log(e);
        response.status(500).json({message: 'Something went wrong.'});
    })
});

application.post('/register', (request, response) => {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    api.addCustomer(name, email, password)
    .then(x => response.json({message: 'The customer added.'}))
    .catch(e => {
        console.log(e);
        response.status(403).json({message: 'A customer with the same email already exists.'});
    });
});

application.post('/login', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    api.addCustomer(email, password)
    .then(x => {
        response.json({isvalid: "true", message: "The customer exist"});
    })
    .catch(e => {
        response.json({ isvalid:"false", message:"The customer does not exist"});
    })
});

application.post('/category', (request, response) => {
    let name = request.body.name;
    api.addCategory(name)
    .then(x => response.json({message: 'The cateogry added.'}))
    .catch(e => {
        console.log(e);
        response.status(403).json({message: 'ERROR'});
    });
});

application.post('/question', (request, response) => {
    let picture = request.body.picture;
    let choices = request.body.choices;
    let answer = request.body.answer;
    api.addQuestion(picture, choices, answer)
    .then(x => response.json({message: 'The question added.'}))
    .catch(e => {
        console.log(e);
        response.status(403).json({message: 'ERROR'});
    });
});

application.post('/quiz', (request, response) => {
    let name = request.body.name;
    let category_id = request.body.category_id;
    api.addQuiz(name, category_id)
    .then(x => response.json({message: 'The quiz added.'}))
    .catch(e => {
        console.log(e);
        response.status(403).json({message: 'ERROR'});
    });
});

application.post('/quiz/:quiz_id/:question_id', (request, response) => {
    let quiz_id = request.params.quiz_id;
    let question_id = request.params.question_id;
    api.addQuestionToQuiz(quiz_id, question_id)
    .then(x => response.json({message: 'The question added to the quiz.'}))
    .catch(e => {
        console.log(e);
        response.status(403).json({message: 'ERROR'});
    });
});

application.get('/flowers', (request, response) => {
    api.getFlowers()
    .then(x => {
        response.json(x);
    });
});

application.get('/quizzes', (request, response) => {
    api.getQuizzes()
    .then(x => {
        response.json(x);
    });
});

application.get('/quiz/:id', (request, response) => {
    api.getQuiz(request.params.id)
    .then(x => {
        response.json(x);
    })
    .catch(e => {
        console.log(e);
        response.status(500).json({message: 'Could not get quiz'});
    })
});

application.post('/score', (request, response) => {
    let quizTaker = request.body.quizTaker;
    let quizId = request.body.quizId;
    let score = request.body.score;
    api.addScore(quizTaker, quizId, score)
    .then(x => {
        response.json({message: 'Score has been updated.'});
    })
    .catch(e => {
        console.log(e);
        response.status(e).json({message: 'ERROR'});
    });
});

application.get('/scores/:quiztaker/:quizid', (request, response) => {
    let quizTaker = request.body.quiztaker;
    let quizId = request.body.quizid;
    api.checkScore(quizTaker, quizId)
    .then(x => {
        response.json(x);
    })
    .catch(e => {
        console.log(e);
        response.status(e).json({message: 'ERROR'});
    });
});

application.listen(port, () => console.log('Listening on port ' + port));