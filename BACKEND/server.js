const express = require("express");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const Product = require("./models/Product");

const User = require("./models/user");

const Order = require("./models/order");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

function verifyToken(req, res, next){

    const token = req.headers.authorization;

    if(!token){

        return res.status(401).send(
            "Access Denied"
        );
    }

    try{

        const verified = jwt.verify(
            token,
            "luxylane_secret_key"
        );

        req.user = verified;

        next();

    }

    catch(error){

        res.status(401).send(
            "Invalid Token"
        );
    }
}

app.get("/", (req, res) => {

    res.send("LuxyLane Backend Running");

});

app.post(
    "/add-product",
    verifyToken,

    async (req, res) => {

    try {

        if(
            req.user.role !== "seller"
            &&
            req.user.role !== "admin"
        ){

            return res.send(
                "Only Sellers Can Add Products"
            );
        }

        const product = new Product({

            name: req.body.name,

            price: req.body.price,

            description: req.body.description,

            image: req.body.image

        });

        await product.save();

        res.send("Product Saved In MongoDB");

    } catch (error) {

        console.log(error);

        res.send("Error Saving Product");
    }

});

app.get("/products", async (req, res) => {

    try {

        const products =
        await Product.find();

        res.json(products);

    } catch (error) {

        console.log(error);

    }

});

app.post("/register", async (req, res) => {

    try {

        const hashedPassword =
        await bcrypt.hash(
            req.body.password,
            10
        );

        const user = new User({

            username: req.body.username,

            email: req.body.email,

            password: hashedPassword,

            role: req.body.role

        });

        await user.save();

        res.send("User Registered");

    } catch (error) {

        console.log(error);

        res.send("Registration Failed");
    }

});

app.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({

            email: req.body.email

        });

        if(!user){

            return res.json({

                success:false

            });

        }

        const isMatch =
        await bcrypt.compare(

            req.body.password,

            user.password

        );

        if(!isMatch){

            return res.json({

                success:false

            });

        }

        const token = jwt.sign(

            {

                userId:user._id,

                role:user.role,

                username:user.username

            },

            "luxylane_secret_key",

            {

                expiresIn:"7d"

            }

        );

        res.json({

            success:true,

            token,

            username:user.username,

            role:user.role

        });

    } catch (error) {

        console.log(error);

    }

});

app.post(
    "/place-order",
    verifyToken,

    async (req, res) => {

    try{

        const order = new Order({

            username:req.user.username,

            products:req.body.products,

            totalPrice:req.body.totalPrice

        });

        await order.save();

        res.send("Order Placed Successfully");

    }

    catch(error){

        console.log(error);

        res.send("Order Failed");
    }

});

app.get(
    "/my-orders",
    verifyToken,

    async (req, res) => {

    try{

        const orders =
        await Order.find({

            username:req.user.username

        });

        res.json(orders);

    }

    catch(error){

        console.log(error);

        res.send("Failed To Fetch Orders");
    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Started On Port ${PORT}`);

});