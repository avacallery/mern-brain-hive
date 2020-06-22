const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

//express configuration

app.use(cors());
app.use(express.json({ extended: false }));

//bring in routing

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');

app.use('/api/users', users);
app.use('/api/profiles', profiles);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on port ${port}`));
