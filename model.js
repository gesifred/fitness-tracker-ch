const mongoose = require("mongoose");

mongoose.set('strictQuery',false);

const userSchema = new mongoose.Schema({
    username: String,
});
const User = mongoose.model('Username', userSchema);

User.createUserInDb = async (username) => {
    const newUser = new User({
        username:username
        });
    return newUser.save()
        .then(doc => {
            //console.log(doc)
            return doc
        })
        .catch(err => {
            console.error(err)
        })
}

const exerciseSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

Exercise.createExerciseInDb = async (username,description,duration,date) => {
    const newExercise = new Exercise ({
        username: username,
        description: description,
        duration: duration,
        date: date,
    });
    return newExercise.save()
        .then(doc=>{
            return doc
        })
        .catch(err=>{
            console.error(err)
        })
}

exports.User = User;
exports.Exercise = Exercise;