import { Router } from "express";
import productManager from '../classes/ProductManager.js'

const router = Router();

router.get('/', (req, res) => {
    productManager.getAll().then((resProducts) => {
        console.log(resProducts)
        res.render('home', {
            title: 'Listado de productos',
            products: resProducts.payload
        })
    })
});

router.get('/realtimeproducts', (req, res) => {
    productManager.getAll().then((resProducts) => {
        console.log(resProducts)
        res.render('realTimeProducts', {
            title: 'Listado de productos',
            products: resProducts.payload
        })
    })
});

export default router;