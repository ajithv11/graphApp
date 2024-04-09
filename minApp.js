const express     = require('express');
const bodyParser  = require('body-parser');
const graphqlHTTP = require('express-graphql').graphqlHTTP
const graphQlSchema = require('./graphql/schema');
const graphQlResolver = require('./graphql/resolver');
const mongoose    = require('mongoose');

const isAuth      = require('./middleware/is-auth');


const app = express();

//const events = [];

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql',graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql : true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphdb.1wabeyw.mongodb.net/graphevent?retryWrites=true&w=majority&appName=graphdb`)
.then(()=>{
    app.listen(4044);
}).catch(err=>{
    console.log(err)
})


