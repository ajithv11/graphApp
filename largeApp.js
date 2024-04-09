const express     = require('express');
const bodyParser  = require('body-parser');
const graphqlHTTP = require('express-graphql').graphqlHTTP
const {  
    buildSchema
} = require('graphql');
const mongoose    = require('mongoose');
const bcrypt      = require('bcryptjs');
const Event       = require('./models/event');
const User        = require('./models/user')

const app = express();

//const events = [];

app.use(bodyParser.json());

const events = eventIds => {
    return Event.find({_id:{$in:eventIds}})
    .then(events => {
        return events.map(event => {
            return {...event._doc, creator: user.bind(this, event.creator)}
        });
    })
    .catch(err =>{
        throw err;
    });
}

const user = userId => {
    return User.findById(userId)
    .then(user =>{
        return {...user._doc, createdEvents : events.bind(this, user._doc.createdEvents) }
    })
    .catch(err =>{
        throw err;
    })
}

app.use('/graphql',graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!  
            creator:User!          
        }

        type User {
            _id: ID!
            email: String!
            password: String    
            createdEvents:[Event!]      
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!         
        }

        input UserInput{
            email: String!
            password: String!         
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation 
        }
    `),
    rootValue: {  // This is the resolver
        events: () => {
            return Event.find({})
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc , 
                        _id: event._doc._id.toString(),
                        creator : user.bind(this,event._doc.creator)
                    };
                });
            });
        },
        createEvent: (args) => {
 
            const event = new Event({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(),
                creator:"660117a05842d30241f31e03"
            });
            let createdEvent;
            return event
            .save()
            .then(result => {
                createdEvent =  {...result._doc};
                return User.findById("660117a05842d30241f31e03");
                //console.log(result)
                //console.log({...result._doc})
                //return {...result._doc};
            })
            .then(user=>{
                if(user === null){
                    throw new Error("User does not exists")
                } 
                user.createdEvents.push(event);
                return user.save()
            })
            .then(result=>{
                return createdEvent;
            })
            .catch(err=>{
                console.log(err)
                throw err;
            })
            //events.push(event);
            //return event;
        },



        createUser: (args) => {
            return User.findOne({email:args.userInput.email}).then(user=>{
                if(user){
                    throw new Error("User already exists")
                } 
                return bcrypt.hash(args.userInput.password, 12)
            })            
            .then(hashPassword =>{
                const user = new User({
                    email : args.userInput.email,
                    password : hashPassword
                });
                return user.save();
            })
            .then(result => {
                return {...result._doc,password:null}
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql : true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphdb.1wabeyw.mongodb.net/graphevent?retryWrites=true&w=majority&appName=graphdb`)
.then(()=>{
    app.listen(4044);
}).catch(err=>{
    console.log(err)
})


