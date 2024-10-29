require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL)
   .then(() => 
       console.log('Connected to database successfully')
   )
   .catch((err) =>
       console.log('Failed to connect to database', err)
   );

const userSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
    },
    username: {
        required: true,
        type: String,
        unique: true
        
    },
    password: {
        required: true,
        type: String
    }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
