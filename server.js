const express = require('express')
const moment = require('moment')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const { response } = require('express')

const app = express()
const PORT = 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// MYSQL
const db = mysql.createPool({
    connectionLimit : 10,
    host:'localhost',
    user:'root',
    database:'node_mysql'
})

// connect with database
db.getConnection((err)=> {
    if(err) throw err
    else 
      console.log(`Database Connected`)
})

// calling procedure 

app.get('/api/procedure/filterStudent' , (req,res) => {

    db.query('CALL filterStudent(true)',(err,result) => {
        if(!err) {
            console.log(result[0])
            res.send(result)
        } else {
            console.log(err.message)
        }
    })
})

//get all employees
app.get('/' , (req,res) => {

    // let date = "DATE_FORMAT(dob,  '%M %e, %Y')"
    db.query(`SELECT name , email  , sub_name  FROM student , subject  where student.id = subject.std_id `, (err,result) => {

        if(!err){
            res.send(result)
        } else {
            console.log(err.message)
        }
    })
})

// add subjects 
app.post('/api/subject',(req,res) => {
    db.query(`insert into subject(sub_name) values ('${req.body.sub_name}')`, (err,result) => {
        if(!err){
             res.send(`Subject ${req.body.sub_name}  Added`)
        } else {
            console.log(err.message)
        }
    })
})
// add record 
app.post('/api/create',(req,res) => {

    let date = req.body.dob
    console.log(date)

    let dob = Date.prototype.toLocaleDateString(date)
    db.query(`insert into employee(name,email,age,dob) values ('${req.body.name}','${req.body.email}','${req.body.age}' , '${dob}')`,(err,result) => {
        
        if(!err) {
            res.send(`Employee with name: ${req.body.name} has been added`)
        } else {
            console.log(err.message)
        }
    })
})

// get all the data
app.get('/api/read/:id',(req,res) => {
    console.log(req.params.id)
    db.query(`SELECT * FROM employee WHERE id = '${req.params.id}'`, (err,result) => {

        if(!err) {
            res.send(result)
        } else {
            console.log(err.message)
        }
    })
}) 
     
// delete record 
app.delete('/api/delete/:id', (req,res) => {
    console.log(req.params.id)
    db.query(`DELETE FROM employee WHERE id ='${req.params.id}'`, (err,result) => {
        
        if(!err) {
            res.send(`Data with id ${req.params.id} is deleted `)
        } else {
            console.log(err.message)
        }
 
    })
})

// update
app.put('/api/update/:id',(req,res) => {
    console.log(req.params.id)
    db.query(`UPDATE employee SET name='${req.body.name}' , email='${req.body.email}' , age= ${req.body.age}, dob = '${req.body.dob}' WHERE  id = ${req.params.id}` , (err,result) => {

        if(!err) {
            res.send(`Details updated where id = ${req.params.id} `)
        } else {
            console.log(err.message)
        }
    })

})



// listen on port
app.listen(PORT , () => {
    console.log(`Server is running on port : ${PORT}`)
})