
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    name : String,
    description : {
        type : String,
        maxlength : 250
    },
    startTime : Date,
    endTime : Date,
    venue : String,
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps : true});

module.exports = mongoose.model('Event', eventSchema);