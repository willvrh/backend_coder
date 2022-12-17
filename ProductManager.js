import fs from 'fs'

class ProductManager {

    constructor(path) {
        this.path = path
        this.products = fs.existsSync(this.path)? JSON.parse(fs.readFileSync(this.path, 'utf-8')) : []
    }

    loadProductsFromDB = () => {
        try {
            this.products = fs.existsSync(this.path)? JSON.parse(fs.readFileSync(this.path, 'utf-8')) : []
        } catch {
            this.products = []
        }
    }

    saveProductsToDB = () => {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
        } catch {
            throw Error("Can't save products to DB")
        }
    }

    addProduct = (title, description, price, thumbnail, code, stock = 0) => {
        this.loadProductsFromDB()

        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        if (this.products.find((product) => product.code === code) !== undefined) {
            throw Error("Code already used")
        }

        newProduct.id = this.products.length === 0? 1 : this.products[this.products.length-1].id+1

        this.products.push(newProduct)

        this.saveProductsToDB()
    }

    getProducts = () => {
        this.loadProductsFromDB()
        return this.products
    }

    getProductById = (id) => {
        this.loadProductsFromDB()

        let product = this.products.find((product) => product.id === id)
        if (product === undefined) {
            throw Error("Not found")
        } else {
            return product
        }
    }

    updateProduct = (product) => {
       this.loadProductsFromDB()

        if (!product.id) { throw Error("Missing product ID") }
        
        let productToUpdate = this.products.find((auxProduct) => auxProduct.id === product.id)
        if (productToUpdate === undefined) { throw Error("Product not found") }

        if (product.code) {
            if (this.products.find((auxProduct) => auxProduct.code === product.code) !== undefined) {
                throw Error("Code already used")
            }
        }

        productToUpdate.title = product.title?? productToUpdate.title 
        productToUpdate.description = product.description?? productToUpdate.description 
        productToUpdate.price = product.price?? productToUpdate.price 
        productToUpdate.thumbnail = product.thumbnail?? productToUpdate.thumbnail 
        productToUpdate.code = product.code?? productToUpdate.code 
        productToUpdate.stock = product.stock?? productToUpdate.stock 
        
        this.saveProductsToDB()
    }

    deleteProduct = (id) => {
        if (this.products.find((product) => product.id === id) === undefined) {
            throw Error("Product not found")
        }

        this.loadProductsFromDB()
        this.products = this.products.filter((product) => product.id !== id)

        this.saveProductsToDB()
    }

}

export default new ProductManager('products.db')
