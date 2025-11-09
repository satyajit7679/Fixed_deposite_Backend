const mongoose = require('mongoose');
const schema = mongoose.Schema;

const contactModel = new schema({

    name: {
        type: String,
        required: [true, "All Field Is Required"]
    },
    email: {
        type: String,
        required: [true, "All Field Is Required"]
    },
    message:{
        type: String,
        required: [true, "All Field Is Required"]
    },
    isdelete:{
        type:Boolean,
        default:false
    },
    isverify:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps: true
    })

const contact = mongoose.model('contact', contactModel);
module.exports = contact;