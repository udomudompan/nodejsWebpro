const express = require('express')
const router = express.Router()
const { validation, schema } = require('../validator/users')
const db = require('../config/db') // เรียกใช้งานเชื่อมกับ MySQL
 
router.route('/users?')
    .get((req, res, next) => { 
        // ทำการแสดงข้อมูลทั้งหมด
        let sql = ' SELECT * FROM test_bb '
        db.query(sql,(error, results, fields)=>{
            // เกิด error ในคำสั่ง sql
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            // แสดงข้อมูลกร๊ไม่เกิด error
            const result = {
                "status": 200,
                "data": results
            }
            return res.json(result)        
        })
    })
    .post(validation(schema),(req, res, next) => {   
        // เตรียมฟิดล์และค่าของข้อมูลที่จะเพิ่ม
        let user = {
            "name": req.body.name, 
            "description": req.body.description,
            "author": req.body.author
        }
        let sql = ' INSERT INTO test_bb SET ? '
        db.query(sql, user, (error, results, fields)=>{
            // เกิด error ในคำสั่ง sql
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            // เพื่อไม่ต้องไปดึงข้อมูลที่เพิ่งเพิม มาแสดง ให้เราใช้เฉพาะ id ข้อมูลใหม่ที่เพิ่งเพิม
            // รวมกับชุดข้อมูลที่เพิ่งเพิ่ม เป็น ข้อมูลที่ส่งกลับออกมา
            users = [{'id':results.insertId, ...user}]
            const result = {
                "status": 200,
                "data": user
            }
            return res.json(result)        
        })
    })
 
router.route('/users/:id')
    .all((req, res, next) => { 
        // ตรวจสอบว่า id user ที่ส่งเข้ามาเพื่อดูข้อมูล / แก้ไข / ลบ มีอยู่ในฐานข้อมูลหรือไม่
        let sql = ' SELECT * FROM test_bb WHERE id = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            // เกิด error ในคำสั่ง sql
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            // กรณีไม่พบข้อมูล 
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            }) 
            res.user = results // ถ้ามี id นั้นอยู่ในฐานข้อมูล ส่งข้อมูลผู้ใช้นั้นไปทำงานต่อ
            next()  
        })        
    })
    .get((req, res, next) => { 
        // ถ้าเป็นการแสดงข้อมูลของ ผู้ใช้ id ใด ก็นำค่าที่ถูกส่งมาไปแสดง
        let sql = ' SELECT * FROM test_bb where id ='+req.params.id;
        const result = {
            "status": 200,
            "data": res.user
        }
        return res.json(result)
    })
    .put(validation(schema),(req, res, next) => {   
        // ถ้าเป็นการแก้ไขข้อมูล ก็เตรียมรูปแบบข้อมูลที่รับมาสำหรับแก้ไข
        let user = {
            "name": req.body.name, 
            "description": req.body.description,
            "author": req.body.author 
        }        
        // ทำการอัพเดท โดยอิง id ที่พบ
        let sql = ' UPDATE test_bb SET ? WHERE id = ? '
        db.query(sql, [user, req.params.id], (error, results, fields)=>{
            // เกิด error ในคำสั่ง sql
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            // ถ้ามีการแก้ไขค่าใหม่ 
            if(results.affectedRows > 0) {
                // เอาค่าฟิลด์ทีได้ทำการอัพเดท ไปอัพเดทกับข้อมูลทั้งหมด
                user = Object.assign(res.user[0], user)
            }else{ // มีการอัพเดท แต่เป็นค่าเดิม
                user = res.user
            }
            // ส่งรายการข้อมูลที่อัพเทกลับไป
            const result = {
                "status": 200,
                "data": user
            }
            return res.json(result)        
        })
    })
    .delete((req, res, next) => { 
        // ถ้าเป็นการลบข้อมูล จาก id ใดๆ 
        let sql = ' DELETE FROM test_bb WHERE id = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            // ใช้ค่าข้อมูลถ้าค้นเจอ ก่อนลบ ส่งออกไป เป็นการบอกว่า รายการนี้คือรายการที่ถูกลบไปแล้ว
            const result = {
                "status": 200,
                "data": res.user
            }
            return res.json(result)        
        })
    })
 
module.exports = router