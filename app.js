const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const Db = require("./db.js").Database;
const User = require("./model.js").User;
const Exercise = require("./model.js").Exercise;

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });

app.post("/api/users", async function(req,res){
  const username = req.body.username;
  Db._connect();
  let ele = await User.find({ username:username});
  if (ele.length == 0){
    console.log('user not registered : '+username)
    const result = await User.createUserInDb(username);
    console.log(result.username +" created in db");
    res.json({
        'username':result.username,
        '_id':result._id
    });
  } else {
    res.json({
      'username':ele[0].username,
      '_id':ele[0]._id
    });
  }
})
app.get("/api/users",async function(req,res){
  Db._connect();
  const allUsers = await User.find().select({username:1,_id:1});
  res.json(allUsers);
});

app.post("/api/users/:_id/exercises", async (req,res)=>{
  //const _id = req.body[":_id"];
  const _id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date || (new Date).toDateString();
  Db._connect();
  let user = await User.findOne({ _id:_id});
  //console.log(user);
  const username = user.username;
  const result = await Exercise.createExerciseInDb(username,description,duration,date);
  //console.log(result);
  res.json({
    username: result.username,
    description: result.description,
    duration: result.duration,
    date: result.date.toDateString(),
    _id : _id
  });
})

app.get("/api/users/:_id/logs",async(req,res)=>{
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  const _id = req.params._id;
  
  Db._connect();
  const user = await User.findOne({ _id:_id })
  const dateQuery = {username:user.username};
  if(from || to){
    dateQuery.date ={};
  }
  if (from){
    dateQuery.date.$gte = from;
  }  
  if (to){
    dateQuery.date.$lte = to;
  }
  //console.log(dateQuery)
  const prelogs = Exercise
                    .find(dateQuery)
                    .select({description:1,duration:1,date:1,_id:0})
                    .limit(limit)
                    //.where('date').lte(to)
                    //.where('date').gte(from);
  const logs = await prelogs.exec();

  const defLogs = [];
  logs.forEach(el=>{
    defLogs.push({description:el.description,duration:el.duration,date:el.date.toDateString()});
  });
  res.json({
    username:user.username,
    count:logs.length,
    _id:_id,
    log:defLogs
  });
})

module.exports = app;