//IMPORTS
import express from 'express'
import cors from 'cors'
import {engine} from 'express-handlebars';
import {Server} from 'socket.io'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import viewRoutes from './routes/view.routes.js'
import productManager from './classes/ProductManager.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';


//INIT
const port = process.env.PORT || 8080
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));

//HANDLEBARS
app.engine('handlebars',engine())
app.set('views','./views')
app.set('view engine','handlebars')

//CONFIG
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(__dirname+'/public'))

const server = app.listen(port, () => { 
    console.log(`Listening on port ${port}`)
})

//SOCKET IO
const io = new Server(server)

io.on('connection', socket => {
    console.log("Cliente conectado")

    //LOAD ALL PRODUCTS ON CONNECT
    productManager.getAll().then(res => {
        socket.emit('products', res)
    })
})

//ROUTES

app.use('/', viewRoutes);
app.use('/api/carts', cartRoutes)
app.use('/api/products', productRoutes)

server.on('error', error => console.log(`Error en el servidor: ${error}`))

app.get('*', function(req, res){
    res.send({error: "not_implemented", description: `Route ${req.url} method ${req.method} not implemented yet`});
})

export default io