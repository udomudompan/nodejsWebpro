const Joi = require('@hapi/joi')
 
const validation = (schema) =>{
    return ((req, res, next) => {
        // ทำการตรวจสอบความถูกต้องของข้อมูล req.body ที่ส่งมา
        Joi.validate(req.body, schema, function (error, value) {
            // กรณีเกิด error ข้อมูลไม่ผ่านการตรวจสอบ 
            if(error) return res.status(400).json({
                "status": 400,
                "message": error.details[0].message
            })
            if(!error) next()
        })  
    })
}
 
// กำหนดชุดรูปแบบ schema
const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    description : Joi.string().min(3).max(1000).required(),
    author:Joi.string().min(3).max(30).required(),
})
 
module.exports = { validation, schema }