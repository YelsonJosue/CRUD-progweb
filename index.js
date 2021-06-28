'use strict'

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const hbs = require('express-handlebars')
const router = require('./routers/routes')

const app = express ()

//npm install -S method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//body parser
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 


//motor vistas
app.engine('.hbs', hbs({
    defaultLayout: 'index',
    extname: '.hbs'
}))

app.set('view engine', '.hbs')

//Recursos publicos
app.use('/static', express.static('public'))

//Router our app
app.use('/', router)

//conexion a BD
mongoose.connect(config.db, config.urlParser, (err,res)=>{

    if(err){
        return console.log(`Error al conectar a la base de datos ${err}`)
    }

    console.log('Conexion a la base de datos exitosa')

    app.listen(config.port, ()=>{
        console.log(`Ejecutando en http://localhost:${config.port}`)
    })
})
