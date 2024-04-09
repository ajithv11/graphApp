const express           = require('express');
const bodyParser        = require('body-parser');
const cors              = require("cors");
const {ApolloServer}    = require("@apollo/server");
const {buildSubgraphSchema}    = require("@apollo/subgraph");
const {
    expressMiddleware
}                       = require("@apollo/server/express4");
const { createHandler } = require("graphql-http/lib/use/express");
const expressPlayground = require('graphql-playground-middleware-express').default;
const graphQlSchema     = require('./graphql/schema');
const graphQlResolver   = require('./graphql/resolver');
const mongoose          = require('mongoose');
const isAuth            = require('./middleware/is-auth');

 
const initServer = async () => {
    const app = express();
    const server = new ApolloServer({
        schema: graphQlSchema,
        rootValue: graphQlResolver
    });
    
  
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // await server.start();
    // app.use("/graphql", expressMiddleware(server));

    app.use('/graphql',createHandler({
        schema: graphQlSchema,
        rootValue: graphQlResolver,
        graphiql : true
    }));
    app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
  



    mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphdb.1wabeyw.mongodb.net/graphevent?retryWrites=true&w=majority&appName=graphdb`)
    .then(()=>{
        //app.listen(4044);
        app.listen(4044, () => {
            console.log(`Express ready at http://localhost:4044`);
            console.log(`Graphql ready at http://localhost:4044/graphql`);
        });
    }).catch(err=>{
        console.log(err)
    })
  
    
};
  
initServer();

/*
const app = express();

//const events = [];

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql',createHandler({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql : true
}));
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphdb.1wabeyw.mongodb.net/graphevent?retryWrites=true&w=majority&appName=graphdb`)
.then(()=>{
    app.listen(4044);
}).catch(err=>{
    console.log(err)
})

*/
