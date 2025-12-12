import mongoose from "mongoose";

const  userSchema = new mongoose.Schema({
  
    email : {
        type: String,
        required: true,
        unique: true 
    },

    firstName : {
        type: String,
        required: true
    },

    lastName : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },

    role : {
        type: String,
        required:false,
        enum: ['customer', 'admin'],
        default: 'customer'
    },

    isBlocked : {
        type: Boolean,
        default: false,
        required: true
    },

    isEmailVerified : {
        type: Boolean,
        default: false,
        required: true
    },

    images : {
        type: [String],
        default: [],
        required: true
    },  

});

const user = mongoose.model('user', userSchema);

export default user;

        