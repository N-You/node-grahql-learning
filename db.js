const express = require('express')
const {buildSchema} = require('graphql')
const  graphqlHTTP = require('express-graphql')

/* 连接数据库 */
let mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/test',{ useNewUrlParser: true,useUnifiedTopology: true })

// 创建模型
// 限制 数据库film只能存两数据
let FilmModel = mongoose.model("Film",new mongoose.Schema({
  name:String,
  age:Number
}))

/* 
create
find
update
delete
*/

const Schema = buildSchema(`
type File {
  id:String,
  name:String,
  age:Int
}

input FileFix{
  name:String,
  age:Int
}

type Query{
    findFilm: [File]
}

type Mutation{
creatFilm(input:FileFix):File
updateFile(id:String!,input:FileFix):File
deleteFile(id:String!):Int
}

`)

const root = {
  findFilm(){
    return FilmModel.find()
  },
  creatFilm({input}){
    /* 
    1.创建模型
    2.操作数据库
    */
   return FilmModel.create({
      ...input
    })
  },
  updateFile({id,input}){
    return FilmModel.updateOne({_id:id},{
      ...input
    }).then(res=>{
      return FilmModel.findById({_id:id})
    }).then(res=>{
      return res
    })
  },
  deleteFile({id}){
  return FilmModel.deleteOne({_id:id}).then(()=>{
    return 1
  })
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