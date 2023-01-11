import fs from 'fs'

class ProductManager {
    
    constructor(path){
        this.path = path
        this.data = []
        this.loadFromFile();
        
    }

    save = async (object) => {
        this.loadFromFile();
        const requiredData = ["title", "description", "price", "code", "category", "stock"]
        let missingKeys = []
        requiredData.forEach(key => { if(!Object.prototype.hasOwnProperty.call(object, key)) { missingKeys.push(key) } });
        if ( missingKeys.length>0 ) { return {status: "failed", error: "missing_fields", description: 'Product must contain the following fields: '+missingKeys.toString()}}
        object.id = this.getNextId()
        object.timestamp = Date.now()
        object.status = true

        if (object.thumbnails) {
            if (!Array.isArray(object.thumbnails)) {
                return {status: "failed", error: "not_an_array", description: 'thumbnails property must be an array of strings'}
            }
        }

        //Checks for existing code
        let productExists = this.getByCode(object.code);
        if (productExists.status == "success") return {status: "failed", error: "existing_code", description: `Code ${object.code} already registered`}

        this.data.push(object)
        try {
            this.saveToFile()
            return {status: "success", payload: object, productId: object.id}
        } catch (e) {
            return {status: "failed", error: "cant_save", error: "Can't save new product"}
        }
    }

    update = async (object) => {
        const requiredData = ["title", "description", "price", "status", "code", "category", "stock"]
        let missingKeys = []
        requiredData.forEach(key => { if(!Object.prototype.hasOwnProperty.call(object, key)) { missingKeys.push(key) } });
        if ( missingKeys.length>0 ) { return {status: "failed", error: "missing_fields", description: 'Product must contain the following fields: '+missingKeys.toString()}}
        
        if (object.thumbnails) {
            if (!Array.isArray(object.thumbnails)) {
                return {status: "failed", error: "not_an_array", description: '"thumbnails" property must be an array of strings'}
            }
        }

        this.data.forEach(product => {
            if (product.id == object.id) {
                product.title = object.title
                product.description = object.description
                product.price = object.price
                product.thumbnails = object.thumbnails?object.thumbnails:product.thumbnails
                product.status = object.status
                product.code = object.code
                product.category = object.category
                product.stock = object.stock
            }
        });
        
        try {
            this.saveToFile()
            return {status: "success", payload: object}
        } catch (e) {
            return {status: "failed", error: "cant_save", description: "Can't update product"}
        }
        
        
    }

    getById = async (id) => {
        let product = this.data.find(element => element.id == id)
        return product != undefined ? {status: "success", payload: product} : {status: "failed", error: 'not_found', description: 'Product not found'}
    }

    getByCode = (code) => {
        let product = this.data.find(element => element.code == code)
        return product != undefined ? {status: "success", payload: product} : {status: "failed", error: 'not_found', description: 'Product not found'}
    }

    getByIds = (ids) => {
        let products = []
        ids.forEach(id => {
            let productAdd = this.data.find(element => element.id == id)
            productAdd !== undefined ? products.push(productAdd) : true
        });
        
        return {status: "success", payload: products}
    }

    getRandomItem = async () => {
        let product = this.data[Math.floor(Math.random()*this.data.length)]
        return product != undefined ? {status: "success", payload: product} : {status: "failed", error: 'product not found'}
    }

    getAll = async () => {
        this.loadFromFile();
        try {
            return {status: "success", payload: this.data}
        } catch (ex) {
            return {status: "success", payload: []}
        }
        
    }

    deleteById = async (id) => {
        let product = this.data.find(element => element.id == id)
        if (product != undefined) {
            this.data = this.data.filter(element => element.id != id)
            this.saveToFile()
            return {status: "success", payload: product, description: `Product #${id} deleted`}
        } else {
            return {status: "failed", error: "not_found", description: 'Product not found'}
        }
    }

    deleteAll = async () => {
        this.data = []
        this.saveToFile()
        return {status: "success", payload: `All products deleted`}
    }

    saveToFile = async () => {
        try {
            await (fs.writeFileSync(this.path, JSON.stringify(this.data)))
            return "ok"
        } catch (err) {
            return err
        }
    }

    loadFromFile = async () => {
        try {
            await (this.data = JSON.parse(fs.readFileSync(this.path, "utf-8")))
            return "ok"
        } catch (err) {
            this.data = []
            this.saveToFile()
            return err
        }
    }

    getNextId = () => {
        return this.data.length === 0? 1 : this.data[this.data.length-1].id+1
    }
}

export default new ProductManager('files/productos.json')
