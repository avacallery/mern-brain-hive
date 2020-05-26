const express = require('express'); 
const app = express();
const cors = require('cors'); 
const mongourl = 'mongodb+srv://avacallerymern:avacallerymern@brain-hive-mern-avax2.mongodb.net/test?retryWrites=true&w=majority'
const mongoose = require('mongoose'); 

app.use(cors());
app.use(express.json()); 

mongoose.connect(mongourl, 
{ useNewUrlParser: true, 
useUnifiedTopology: true })
.then(() => console.log('Connected to db'))
.catch(error => console.error("Failed to connect to db"))

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on port ${port}`));