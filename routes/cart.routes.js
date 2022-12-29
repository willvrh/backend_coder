import express from 'express'
import cart from '../classes/Cart.js'
import productManager from '../classes/ProductManager.js'

const router = express.Router()

//GETS
router.get('/', function(req, res) {
    cart.getAll().then(result=>{
        result.hasOwnProperty('error')?res.json(result):res.json({status: "success", payload: result.payload, quantity: result.payload.length})
    })
})

router.get('/:cid/', function(req, res) {
    let id = parseInt(req.params.cid)
    cart.getById(id).then( async (result)=>{
        if(result.hasOwnProperty('error')) { res.json(result) }
        let products = []

        await result.payload.products.forEach( (product) => {
             productManager.getById(product.id).then((res) => {
                let productInCart = res.payload
                productInCart.quantity = product.quantity
                products.push(productInCart)
            })
        });
        res.json({status: "success", payload: products})
    })
})

//POSTS
router.post('/', (req, res) => {
    let newCart = req.body
    cart.save(newCart).then((result)=> {
        res.send(result)
    })
})

router.post('/:cid/product/:pid', (req, res) => {
    let cartID = parseInt(req.params.cid)
    let productID = parseInt(req.params.pid)
    let productAdd = req.body
    cart.addToCart(cartID, productAdd).then((result)=> {
        res.send(result)
    })
})

//DELETES
router.delete('/:cid', (req, res) => {
    let cartID = parseInt(req.params.cid)
    cart.deleteById(cartID).then((result)=> {
        res.send(result)
    })
})

export default router