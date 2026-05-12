const mongoose = require("mongoose");

const connectDB = async () => {

  try {

    await mongoose.connect(
      "mongodb://luxylane:luxylane%40123@ac-c7ty1xq-shard-00-00.0hji3jq.mongodb.net:27017,ac-c7ty1xq-shard-00-01.0hji3jq.mongodb.net:27017,ac-c7ty1xq-shard-00-02.0hji3jq.mongodb.net:27017/?ssl=true&replicaSet=atlas-frgy27-shard-0&authSource=admin&appName=Cluster0"
    );

    console.log("MongoDB Atlas Connected");

  } catch (error) {

    console.log(
      "Database Connection Error:",
      error
    );

  }

};

module.exports = connectDB;