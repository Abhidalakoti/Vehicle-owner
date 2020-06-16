const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema.js");

const app = express();

mongoose.connect("mongodb+srv://Abhi:Test123@cluster0-bw3q9.azure.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser:  true,
        useUnifiedTopology: true},
    () => {
        console.log("Connect with DB successfully")
    }
);

app.use("/graphql",graphqlHTTP({schema: schema, graphiql: true}));
app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});