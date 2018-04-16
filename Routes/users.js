acvar express = require('express');
var router = express.Router();
var Comment = require('../models/comments')
var User = require('../models/users');
var jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/feed', function(req, res, next) {
    res.render('feed');
});

/* ADD COMMENTS */

router.post('/addComment', function(req, res, next) {
    
    comment = new Comment(req.body);
    comment.save(function (err, savedComment) {
        if(err)
            throw err;
        
        res.json({
            "id": savedComment._id
        });
    });
});
  

/* UPDATE COMMENTS */
router.put('/updateComment/:id', function(req, res, next){

    var id = req.params.id;
    Comment.update({_id:id}, req.body, function (err) {
        if (err)
            res.send(err);

        res.json({status : "Successfully updated the document"});
    });
});

/* RETURN COMMENTS */

router.get('/getComments', function(req, res, next) {
    
    Comment.find({}, function (err, comments) {
        if (err)
            res.send(err);
        res.json(comments);
    });
});


/* DELETE COMMENTS */
router.delete('/removeComment/:id', function(req, res, next){

    var id = req.params.id;
    Comment.remove({_id:id}, function (err) {
        if (err)
            res.send(err);

        res.json({status : "successfully removed the document"});
    });
});

/* GET feed page. */
router.get('/feed', function(req, res, next) {

    try {
        var jwtString = req.cookies.Authorization.split(" ");
        var profile = verifyJwt(jwtString[1]);
        if (profile) {
            res.render('feed');
        }
    }catch (err) {
            res.json({
                "status": "error",
                "body": [
                    "You are not logged in."
                ]
            });
        }
});

/*
 Verifies a JWT
 */
function verifyJwt(jwtString) {

    var value = jwt.verify(jwtString, 'CSIsTheWorst');
    return value;
}


module.exports = router;
