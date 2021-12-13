require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const api = require('./api');
const { request, response } = require('express');
const frontEnd = 'http://localhost:3000';

passport.use(new LocalStrategy(
    { usernameField: 'email'},
    (email, password, done) => {
        console.log('Inside local strategy callback');
        api.login(email, password)
            .then(x => {
                console.log(x);
                if (x.isValid) {
                    let user = { id: x.id, name: x.name, email: email };
                    console.log(user);
                    return done(null, user);
                } else {
                    console.log('The email or password is not valid.');
                    return done(null, false, 'The email or password was invalid');
                }
            })
            .catch(e => {
                console.log(e);
                return done(e);
            });
    }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/return/twitter',
},
    (token, tokenSecret, profile, done) => {
        console.log('Inside passport twitter ...');
        //console.log(profile._json.screen_name);
        //console.log(profile);
        let user = { id: profile.id, name: profile.displayName, username: profile.username };
        return done(null, user);
    }));

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is dave to the session file store here')
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)
    const user = {id: id};
    done(null, user);
});

const application = express();
const port = process.env.PORT || 4002;

application.use(express.json());
application.use(cors({
    origin: 'http://localhost:3000', // allow to server to accept request from different origin
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // allow session cookie from browser to pass through
}));

application.use(session({
    genid: (request) => {
        //console.log(request);
        console.log('Inside session middleware genud function');
        console.log(`Request object sessionID from client: ${request.sessionID}`);

        return uuid(); // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'some random string',
    resave: false,
    saveUninitialized: true
}));
application.use(passport.initialize());
application.use(passport.session());

application.get('/add/:n/:m', (request, response) => {
    console.log('in /add');
    console.log(request.user);
    console.log(request.sessionID);
    if (request.isAuthenticated()) {
        console.log('Inside /add - inside isAuthenticated');
        console.log(`req.session.passport: ${JSON.stringify(request.session.passport)}`);
        console.log(`req.user: ${JSON.stringify(request.user)}`);
        let n = Number(request.params.n);
        let m = Number(request.params.m);
        let sum = api.add(n, m);
        response.json({done: true, sum: sum});
    } else {
        response.status(401).json({done: false, message: 'You need to log in first.'})
    }
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
    console.log('Inside POST /login callback');
    passport.authenticate('local', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');
        console.log(`req.session.passport: ${JSON.stringify(request.session.passport)}`);
        console.log(`req.user: ${JSON.stringify(request.user)}`);
        request.login(user, (err) => {
            console.log('Inside req.login() callback');
            console.log(`req.session.passport: ${JSON.stringify(request.session.passport)}`);
            console.log(`req.user: ${JSON.stringify(request.user)}`);
            console.log(`req.SessionID: ${request.sessionID}`);
            return response.json({ done: true, message: 'The customer logged in.'});
        })
    })(request, response, next);
});

application.get('/login/twitter', passport.authenticate('twitter'));

aaplication.get('/return/twitter', (request, response, next) => {
    console.log('Inside Get twitter /login callback');
    passport.authenticate('twitter', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');

        //console.log(request);
        request.login(user, (err) => {
            console.log('Inside req.login() callback');
            console.log(`req.session.passport: ${JSON.stringify(request.session)}`);
            console.log(`req.user: ${JSON.stringify(request.user)}`);
            console.log(`Request object sessionID from client: ${request.sessionID}`);
            //console.log(request.query);
            //return response.json({ done: true, message: 'The customer logged in.' });
            response.redirect(frontEnd + `/#/twitter/${request.user.username}/${request.user.name}`);
        })
    })(request, response, next);
});

application.get('/logout', (request, response, next) => {
    request.logout();
    response.json({ done: true, message: 'The customer logged out.' });
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
    console.log('in /quizzes');
    api.getQuizzes()
    .then(x => {
        response.json(x);
    })
    .catch(e => {
        console.log(e);
        response.status(500).json({message: 'Something went wrong.'});
    })
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
    let quizTaker = request.params.quiztaker;
    let quizId = request.params.quizid;
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