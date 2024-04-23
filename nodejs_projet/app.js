const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth')
const cors = require("cors");
const salleRoutes = require('./routes/salle')
const reservationRoutes = require('./routes/reservation');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

dotenv.config()



let corsOptions = {
    origin: "*"
};


app.use(express.json());
app.use(cors(corsOptions));
app.use('/auth', authRoutes)

app.use('/salle', salleRoutes)
app.use('/reservation', reservationRoutes)
app.use('/user', userRoutes)


//ejs
app.set('view engine', 'ejs');
app.use(express.static("views"));

app.get("/home", (req, res) => {
    res.render('home', { });
});

app.get("/create", (req, res) => {
    res.render('create_salle', { });
});

app.get('/login', (req, res) => {
    res.redirect('/login');
});


/*app.get('/', (req, res) => {
    return res.status(200).send('test !')
})*/





const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



mongoose.connect(`mongodb+srv://dhounesrine:dhounesrine@Cluster0.apq1lii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log('connected to MongoDb');
    app.listen(5000, () => {
        console.log(`server listening`)
        
    })

}).catch((err) => {
    console.error('Error connecting to mongodb:', err.message)
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});