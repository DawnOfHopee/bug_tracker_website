const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 5000;

//Using .env variables for dev
dotenv.config();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static());
app.use(
  session({
    secret: process.env.session_secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Setting up mongoDB
mongoose
  .connect(process.env.mongoURI, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Successfully connected to the database'))
  .catch(() => console.log('Error occured when connecting to the database'));

// console.log(path.resolve(__dirname, 'client', 'build', 'index.html'));

//Serve static assests if in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  // app.get('/*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'client/build/index.html'), function (
  //     err
  //   ) {
  //     if (err) {
  //       res.status(500).send(err);
  //     }
  //   });
  // });
}

//Routes
app.use('/api', require('./routes/UserRoutes'));

app.get('/*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'client', 'build', 'index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'path/to/your/index.html'), function (err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
