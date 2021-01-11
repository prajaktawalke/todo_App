const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

const session_secret = "newton";
const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
   origin: "http://localhost:8081"
}));
app.use(
  session({
    secret:session_secret,
     cookie : {maxAge: 1*60*60*1000}
})  
);
const db = mongoose.createConnection("mongodb://localhost:27017/TodoApp",{
  useNewUrlParser:true,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
  userName:String,
  password:String
});

const todoSchema = new mongoose.Schema({
  task:String,
  done:Boolean,
  creationTime:Date,
  userId: mongoose.Schema.Types.ObjectId
});
const userModel = db.model('user',userSchema);
const todoModel = db.model('todo',todoSchema);

const isNullOrUndefined = val => val === null || val === undefined;
const SALT = 5;

app.post('/signup' , async(req,res)=>{
  const {userName, password} = req.body;
  const existinguser = await userModel.findOne({userName});
  if(isNullOrUndefined(existinguser)){
    const hashedpwd = bcrypt.hashSync(password, SALT);
    const newUser = new userModel({userName, password : hashedpwd});
    await newUser.save();
    req.session.userId = newUser._id;
    res.status(201).send({success: 'Signed up'});
  }else{
    res.status(400).send({
      err: `UserName ${userName} already exists. Please choose another.`,
    });
  }
});

app.post('/login' , async(req,res)=>{
  const {userName, password} = req.body;
  const existinguser = await userModel.findOne({
    userName
  });
  if(isNullOrUndefined(existinguser)){
    res.status(401).send({err: 'username does not exist.'});
  }else{
    const hashedpwd = existinguser.password;
    if(bcrypt.compareSync(password , hashedpwd)){
      req.session.userId = existinguser._id;
      res.status(200).send({success: 'Logged in'});
    }else{
      res.status(401).send({err: 'password is incorrect.'});
    }
  }
});

const AuthMidleware = async(req,res,next) => {
  console.log('Session', req.session);
  // added user key to req
  if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userId) ) {
    res.status(401).send({ err: "Not logged in" });
  } else {
    next();
  }
};

app.get('/todos' , AuthMidleware , async (req,res) => {
    //const userId = req.user._id;
    const allTodos = await todoModel.find({userId : req.session.userId});
    res.send(allTodos);
});
app.post('/todos' , AuthMidleware , async (req,res) =>{
    const todo = req.body;
    todo.creationTime = new Date();
    todo.done = false;
    todo.userId = req.session.userId;
    const newTodo = new todoModel(todo);
    await newTodo.save();
    res.status(201).send(newTodo);
});
app.put('/todos/:todoid' , AuthMidleware , async (req, res) => {
      const {task} = req.body;
      const todoid = req.params.todoid;
      try{
        const todo = await todoModel.findOne({_id:todoid , userId:req.session.userId});
        if(isNullOrUndefined(todo)){
            res.sendStatus(404);
        }else{
            todo.task = task;
            await todo.save();
            res.send(todo);
        }
      } catch(e) {
        res.sendStatus(404);
      }
});
app.delete('./todos/:todoid' , AuthMidleware , async(req, res) => {
  const todoid = req.params.todoid;
  try{
    await todoModel.deleteOne({_id:todoid , userId:req.session.userId});
        res.sendStatus(200);
  } catch(e) {
        res.sendStatus(404);
  }
});
app.get("/logout" , (req, res)=>{
  if(!isNullOrUndefined(req.session)){
      // req.session.userId = undefined;
      req.session.destroy(() => {
        res.sendStatus(200);
      });
  }else{
    res.sendStatus(200);
  }
});
app.get('/userinfo', AuthMidleware , async (req, res) => {
  const user = await userModel.findById(req.session.userId);
  res.send({ userName : user.userName });
});
app.listen(9999);