const express = require('express')
const {buildSchema} = require('graphql')
const  graphqlHTTP = require('express-graphql')

const Schema = buildSchema(`
type File {
  id:Int,
  name:String,
  age:Int
}

input FileFix{
  name:String,
  age:Int
}

type Query{
    hello: String
    getAllFiles: [File]
    getList(id:Int!): File
}

type Mutation{
creatFilm(input:FileFix):File
updateFile(id:Int!,input:FileFix):File
deleteFile(id:Int!):Int
}

`)

let list = [
  {id:1,name:'file1',age:10},
  {id:2,name:'file2',age:20},
  {id:3,name:'file3',age:30}
]

const root = {
  hello: () => {
    let str = 'Hello World'
    return str
  },
  getAllFiles:()=>{
    return list
  },
  getList({id}){
    return list.find(it=>it.id === id)
  },
  creatFilm({input}){
    let obj = {...input,id:list.length+1}
    list.push(obj)
    return obj
  },
  updateFile({id,input}){
    let current = null
   list =  list.map(it=>{
      if(it.id === id){
        current = {...it,...input}
        return {...it,...input}
      }
      return it
    })
    return current
  },
  deleteFile({id}){
  list =  list.filter(it => it.id !== id)
   return id
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