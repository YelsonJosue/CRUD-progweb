/*jshint esversion: 6*/

//import moduls
const express = require('express');
const Product = require('../models/product');
const path = require('path');
const product = require('../models/product');
const { send } = require('process');
// npm install --save express-session
const expressSession = require('express-session');
const authMid = require('../midoword/authotmidoword');
const redirectIfAuth = require('../midoword/redirectlfAuth');

//create a router object
const router = express.Router();

//exportar our router
module.exports = router;

//Activacion de las sesiones(Cookies)
router.use(expressSession({
    secret: 'ittgalgos',
    resave: true,
    saveUninitialized : true
}));

//Variables Globales
router.use((req, res, next)=>{
    res.locals.loggedIn = req.session.userId || null;
    next();
});

//pagina home
router.get('/', (req, res) => {
    console.log(req.session);
    res.render('home');
});

//Insertar datos
router.get('/insertProduct', authMid, (req, res)=>{
    res.render('product');
});

//Consulta de todos los datos
router.get('/api/product', authMid, (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la peticion ${err}`
        })
        if (!product) return res.status(404).send({
            message: 'No existen los productos'
        })

        //res.status(200).send({products: [products]});
        res.render('showproduct', { products });

    }).lean();
});

//modificar Producto PUT
const putProduct = require('../controlers/putProduct');
router.put('/api/product/:productId',authMid, putProduct);

//Borrar un registro DELETE
const delProduct = require('../controlers/delProduct');
const { Router } = require('express');
router.delete('/api/product/:productId',authMid, delProduct);

//CONSULTA POR FILTRO
router.get('/api/product/:productId', (req, res) => {

    let productId = req.params.productId;
    Product.findById(productId, (err, products) => {
        //Product.findOne({price:productId}, (err, products)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!products) return res.status(404).send({
            message: 'EL producto no existe'
        });
        //res.status(200).send({product:products});
        res.render('editar', { products: products });
    }).lean();

})

//INSERTAR VALORES
router.post('/api/product', (req, res) => {
    let product = new Product();
    product.name = req.body.name;
    product.picture = req.body.avatar;
    product.price = req.body.price;
    product.category = (req.body.category).toLowerCase();
    product.description = req.body.description;

    console.log(req.body);

    product.save((err, productStored) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la peticion ${err}`
        });
        //res.status(200).send({product: productStored})
        res.redirect('/api/product');
    });
});

//pagina login
const loginControles = require('../controlers/login');
router.get('/auth/login',redirectIfAuth, loginControles);

const loginUserControler = require('../controlers/loginuser');
router.post('/users/login',redirectIfAuth, loginUserControler);

//Pagina para Registro de nuevos usuarios
const newUser = require('../controlers/newuser')
router.get('/users/register',redirectIfAuth,newUser);

//Metodo POST para el registro
const newUserControlers = require('../controlers/storeUser');
router.post('/auth/register',redirectIfAuth,newUserControlers);

//Metodo GET para logout
const logoutController = require('../controlers/logout');
router.get('/auth/logout', logoutController);

//pagina error 404 not found
router.use((req, res) => {
    res.render('notfound');
    //res.status(404).send('pagina no encontrada');
});
