const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    username:{
        type:String
    },

    products:{
        type:Array
    },

    totalPrice:{
        type:Number
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model("Order", orderSchema);