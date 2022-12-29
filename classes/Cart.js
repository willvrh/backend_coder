import fs from 'fs'
import productManager from './ProductManager.js';


class Cart {

    constructor(path){
        this.path = path
        this.data = []
        this.loadFromFile();
    }

    save = async () => {
        this.loadFromFile();
        let newCart = {}
        newCart.id = this.getNextId()
        newCart.timestamp = Date.now();
        newCart.products = []
        this.data.push(newCart)
        
        try {
            this.saveToFile()
            return {status: "success", payload: newCart, cartID: newCart.id}
        } catch (e) {
            return {status: "failed", error: "save_error", description: e}
        }
    }

    addToCart = async (cartID, productAdd) => {
        this.loadFromFile();
        if (isNaN(cartID)) { return {status: "failed", error: "not_a_number" , description: "Cart ID is not a number"} }
        if (isNaN(productAdd.id)) { return {status: "failed", error: "not_a_number" , description: "Product ID is not a number"} }

        let cart = this.data.find(element => element.id == cartID)
        if (cart == undefined) { return {status: 'failed', description: 'Cart not found'} }

        let productExist = await productManager.getById(productAdd.id)
        if (productExist.status != "success") { return {status: 'failed', description: 'Product not found'} }
            
        let aux = cart.products.find(element => element.id == productAdd.id)
        
        if (aux === undefined) {
            cart.products.push(productAdd)
        } else {
            aux.quantity += productAdd.quantity
        }
            
        
        try {
            this.saveToFile()
            return {status: "success", payload: cart}
        } catch (e) {
            return {status: "failed", error: "not_updated" , description: "Cart not updated"}
        }
        
    }

    removeFromCart = async (cartID,productID) => {
        
        if (productID === undefined) {
            return {status: "failed", error: "empty_id" , description: "Empty product id"}
        }

        let cart = this.data.find(element => element.id == cartID)
        cart.products = cart.products.filter(product => product.id!=productID);
        
        try {
            this.saveToFile()
            return {status: "success", payload: cart}
        } catch (e) {
            return {status: "failed", error: "not_updated" , description: "Cart not updated"}
        }
        
    }

    getById = async (id) => {
        this.loadFromFile();
        let cart = this.data.find(element => element.id == id)
        return cart != undefined ? {status: "success", payload: cart} : {error: 'not_found', description: 'Cart not found'}
    }

    getAll = async () => {
        this.loadFromFile();
        return this.data.length>0 ? {status: "success", payload: this.data} : {error: 'carts not found'}
    }

    deleteById = async (id) => {
        this.loadFromFile();
        let cart = this.data.find(element => element.id == id)
        if (cart != undefined) {
            this.data = this.data.filter(element => element.id != id)
            this.saveToFile()
            return {status: "success", payload: `Cart #${id} was deleted`}
        } else {
            return {status: "failed", error: "not_found", description: 'Cart not found'}
        }
    }

    deleteAll = async () => {
        this.loadFromFile();
        this.data = []
        this.saveToFile()
        return {status: "success", payload: `Carts deleted`}
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
        this.loadFromFile();
        return this.data.length === 0? 1 : this.data[this.data.length-1].id+1
    }
}

export default new Cart('files/carrito.json')
