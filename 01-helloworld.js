const express = require('express')
const {buildSchema} = require('graphql')
const  graphqlHTTP = require('express-graphql')

const Schema = buildSchema(`
type Query{
    hello: String
}
`)

const root = {
  hello: () => {
    let str = 'Hello World'
    return str
  }
}

const app = express()

app.use("/home",function(req,res){
  res.send('home data')
})

app.use("/list",function(req,res){
res.send('list data')
})

app.use("/grahql",graphqlHTTP({
  schema: Schema,
  rootValue: root,
  graphiql: true
}))

app.listen(3000)