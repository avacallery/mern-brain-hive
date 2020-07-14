const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

//express configuration
app.use(cors());
app.use(express.json({ extended: false }));

//bring in router
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

// create the route that uses the router we brought in
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on port ${port}`));
