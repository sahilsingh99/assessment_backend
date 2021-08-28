var express = require('express');

var router = express.Router();

var {createEvent, getAllEvents, getUserById, getEventById, deleteAllEvents, deleteEvent} = require('../controllers/event');
const {isLoggedIn, isAuthenticated} = require('../middlewares/auth');


// param router
router.param('eventId', getEventById);
router.param('userId', getUserById);

router.get('/allEvents/:userId', isLoggedIn, isAuthenticated, getAllEvents);

router.post('/create/:userId', isLoggedIn, isAuthenticated, createEvent);

router.delete('/delete/all/:userId', isLoggedIn, isAuthenticated, deleteAllEvents);

router.delete('/delete/:eventId/:userId', isLoggedIn, isAuthenticated, deleteEvent);

module.exports = router;