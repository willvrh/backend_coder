import express from 'express'
import productManager from './ProductManager.js'

const port = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
})

app.get('/products', (req, res) => {
    const { limit } = req.query
    let products = productManager.getProducts()
    if (!isNaN(limit)) { products.length = limit}
    res.json(products)
})

app.get('/products/:pid', (req, res) => {
    const productID = parseInt(req.params.pid)

    try {
        const product = productManager.getProductById(productID)
        res.json(product)
    } catch (ex) {
        res.json({
            status: "error",
            message: "Not found"
        })
    }
    
})

app.get('*', (req, res) => {
    res.send('Error, ruta no encontrada')
})

app.listen(port, () => console.log(`Listening on port ${port}`))



