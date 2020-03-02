var express = require('express');
var router = express.Router();
const Joi = require('@hapi/joi')
const users = require('../mock-users') 
const { validation, schema } = require('../validator/users')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/users?')
    .get((req, res, next) => { 
        const result = { 
            "status": 200,
            "data": users
        }
        return res.json(result)
    })
    .post(validation(schema),(req, res, next) => {   
      let user = {
          //"id": users.length + 1, 
          "name": req.body.name, 
          "description": req.body.description,
          "author": req.body.author
      }
      users.push(user) 
      const result = { 
          "status": 200,
          "data": users
      }
      return res.json(result)
  })
 
router.route('/user/:id')
    .all((req, res, next) => { 
        let user = users.find((user) => user.id === parseInt(req.params.id))
        if (!user) return res.status(400).json({
            "status": 400,
            "message": "Not found user with the given ID"
        })
        res.user = user 
        next()
    })
    .get((req, res, next) => { 
        const result = {
            "status": 200,
            "data": res.user
        }
        return res.json(result)
    })
    .put(validation(schema),(req, res, next) => {   
        let user = { 
                "id": res.user.id, 
                "name": req.body.name, 
                "description": req.body.description,
                "author": req.body.author
            }
        const result = {
            "status": 200,
            "data": user
        }
        return res.json(result)
    })
    .delete((req, res, next) => { 
        let user = users.filter((user) => user.id !== parseInt(req.params.id))
        const result = {
            "status": 200,
            "data": user
        }
        return res.json(result)
    })
module.exports = router;
