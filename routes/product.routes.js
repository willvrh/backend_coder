import express from 'express'
import productManager from '../classes/ProductManager.js'

const router = express.Router()

//GETS
router.get('/', function(req, res) {

    productManager.getAll().then(result=>{
        const { limit } = req.query
        if (!isNaN(limit)) { result.payload.length = limit<=result.payload.length?limit:result.payload.length}
        result.quantity = result.payload.length
        res.send(result)
    })
})

router.get('/:pid', function(req, res) {
    let id = parseInt(req.params.pid)
    productManager.getById(id).then(result=>{
        res.send(result)
    })
})

//POSTS
router.post('/', (req, res) => {
    let product = req.body
    console.log(req.body)
    productManager.save(product).then((result)=> {
        res.send(result)
    })

})

//PUTS
router.put('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    let product = req.body
    product.id = id
    productManager.update(product).then((result)=> {
        res.send(result)
    })
})

//DELETES
router.delete('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    productManager.deleteById(id).then((result)=> {
        res.send(result)
    })

})

export default router