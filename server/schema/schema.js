const graphql = require("graphql"); //use graphql package

const _ = require("lodash");

const cars = require("../models/scooter");
const owners = require("../models/owner");

/*Getting GraphQLObjectType function from 'graphql' to define the (dataType) 
 structure of our queries and their model type.
*/
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

//Defining ScooterType with its fields.
const ScooterType = new GraphQLObjectType({
  name: "Scooter",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    model: { type: GraphQLInt },
    company: { type: GraphQLString },
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        return owners.findById(parent.ownerId);
      }
    } //owner
  })
});

//Defining ScooterType with its fields.
const OwnerType = new GraphQLObjectType({
  name: "Owner",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    cars: {
      type: new GraphQLList(ScooterType),
      resolve(parent, args) {
        return scooters.find({ ownerId: parent.id });
      }
    }
  })
});

//Defining RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Fields here will be the query for frontends
    //We are defining a 'scooter' query which can take (scooter ID ) to search in DB.
    scooter: {
      type: ScooterType, //Defining model for scooter Query
      args: { id: { type: GraphQLID } }, //args field to extract
      // argument came with scooter query, e.g : Id of the scooter object to extract its details.
      resolve(parent, args) {
        //code to get value  from DB
        /**
         * With the help of lodash library(_), we are trying to find scooter with id from 'ScootersArray'
         * and returning its required data to calling tool.
         */
        return scooters.findById(args.id);
      } //resolve function
    }, //scooter query ends here
    owner: {
      type: OwnerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return owners.findById(args.id);
      }
    }, //owners ends here
    scooters: {
      type: new GraphQLList(CarType),
      resolve(parent, args) {
        return scooters.find({});
      }
    }, //scooters query
    owners: {
      type: new GraphQLList(OwnerType),
      resolve(parent, args) {
        return owners.find({});
      }
    }
  } //fields end here
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addOwner: {
      type: OwnerType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        gender: { type: GraphQLString }
      },
      resolve(parent, args) {
        let owner = new owners({
          name: args.name,
          age: args.age,
          gender: args.gender
        });
        return owner.save();
      }
    }, //AddOwner ends here
    addScooter: {
      type: ScooterType,
      args: {
        name: { type: GraphQLString },
        model: { type: GraphQLInt },
        company: { type: GraphQLString },
        ownerId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let scooter = new scooters({
          name: args.name,
          model: args.model,
          company: args.company,
          ownerId: args.ownerId
        });

        return scooter.save();
      }
    } //addScooter
  } //fields ends here
});

//exporting 'GraphQLSchema with RootQuery' for GraphqlHTTP middleware.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});