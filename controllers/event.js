// User model
const User = require('../models/user');
const Event = require('../models/event');
const mongoose = require('mongoose');

exports.getUserById = (req, res, next, id) => {
    User.findById({_id : id}).exec( 
        (err, user) => {
            if(err || !user) {
                return res.status(500).json({
                    message : "error in finding user by id"
                })
            }
            req.profile = user;
            req.profile.password = undefined; 
            next();
        })
}

exports.getEventById = (req, res, next, id) => {
    Event.findById({_id : id}).populate('admin', "_id , username")
        .exec()
        .then(event => {
            req.event = event;
            next();
        })
        .catch(err => {
            return res.status(400).json({
                message : "error in finding event by Id"
            });
        })
}

exports.createEvent = (req, res, next) => {
    
    const data = req.body;
    var event = new Event({
            name : data.name,
            description : data.description,
            venue : data.venue,
            startTime : data.startTime,
            endTime : data.endTime
    });
    event.admin = req.profile._id;
    event.save()
        .then(data => {
            var event = data;
            event.admin.email = event.admin.createdAt = event.admin.updatedAt = undefined;
            res.status(200).json({
                message : "successfully created :)",
                data : {
                    event : event
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({
                message : "error in creating event"
            })
        })
}

exports.getAllEvents = (req, res, next) => {
    Event.find({
        admin : mongoose.Types.ObjectId(req.profile._id)
    })
    .exec()
    .then(events => {
        res.status(200).json({
            message : "successfully fetched",
            data : {
                allEvents : events
            }
        });
    })
    .catch(error => {
        res.json(400).json({
            message : "error in listing Events"
        })
    })
}

exports.deleteEvent = (req, res, next) => {
    Event.findByIdAndDelete({_id : req.event._id})
        .exec()
        .then(event => {
            res.status(200).json({
                message : "successfully deleted :)",
                data : {
                    event : event
                }
            });
        })
        .catch(err => {
            res.status(400).json({
                message : "deletion failed :("
            })
        })
}

exports.deleteAllEvents = (req, res, next) => {
    Event.deleteMany({
        admin : mongoose.Types.ObjectId(req.profile._id)
    })
    .exec()
    .then( events => {
        res.status(200).json({
            message : "successfully deleted Events",
            data : {
                deletedEvents : events
            }
        });
    })
    .catch(error => {
        res.json(400).json({
            message : "error in deleting Events"
        })
    })
}