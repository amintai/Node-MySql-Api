const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

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


//get all employees
app.get('/' , (req,res) => {

    db.query('SELECT * FROM employee', (err,result) => {

        if(!err){
            res.send(result)
        } else {
            console.log(err.message)
        }
    })
})
// add record 
app.post('/api/create',(req,res) => {
    db.query(`insert into employee(name,email,age) values('${req.body.name}','${req.body.email}','${req.body.age}')`,(err,result) => {
    
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
    db.query(`UPDATE employee SET name='${req.body.name}' , email='${req.body.email}' , age= ${req.body.age} WHERE  id = ${req.params.id}` , (err,result) => {

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