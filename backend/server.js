const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json())

const rootRouter = require('./routes/index')


app.use('/api/v1', rootRouter)

app.listen(3737, () =>{
    console.log('Server is running on port 3737')
})

module.exports = app;