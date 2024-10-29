const express = require('express');
const cors = require('cors');
require('dotenv').config();
const rootRouter = require('./routes/index')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use('/api/v1', rootRouter)

app.listen(3737, () =>{
    console.log('Server is running on port 3737')
})

module.exports = app;