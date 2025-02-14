const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const Movie = require("./models/Movie");

//import ApolloServer
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const resolvers = require("./resolvers");

//Store sensitive information to env variables
const dotenv = require("dotenv");
dotenv.config();

//mongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;

//TODO - Replace you Connection String here
const connectDB = async () => {
  try {
    mongoose
      .connect(mongodb_atlas_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((success) => {
        console.log("Success Mongodb connection");
      })
      .catch((err) => {
        console.log("Error Mongodb connection");
      });
  } catch (error) {
    console.log(`Unable to connect to DB : ${error.message}`);
  }
};

const movies = JSON.parse(
  fs.readFileSync("./Sample_Movies_Records.json", "utf-8")
);

const importData = async () => {
  try {
    const existingMovies = await Movie.find();
    if (existingMovies.length > 0) {
      console.log("Movies already exist in DB!");
    } else {
      await Movie.insertMany(movies);
      console.log("Movies inserted successfully!");
    }
  } catch (err) {
    console.error(err);
  }
};

//Define Apollo Server
const server = new ApolloServer({ typeDefs: schema, resolvers });

//Define Express Server
const app = express();
app.use(express.json());
app.use("*", cors());

//Add Express app as middleware to Apollo Server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  //Start listen
  app.listen( PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    connectDB();
    importData();
  });
};

startServer();
