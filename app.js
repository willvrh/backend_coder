import express from 'express'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'

const port = process.env.PORT || 8080
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/carts', cartRoutes)
app.use('/api/products', productRoutes)



app.listen(port, () => console.log(`Listening on port ${port}`))

app.get('*', function(req, res){
    res.send({error: "not_implemented", description: `Route ${req.url} method ${req.method} not implemented yet`});
})



