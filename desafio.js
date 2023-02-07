const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1;
  }

  addProduct(product) {
    product.id = this.nextId++;
    fs.readFile(this.path, 'utf8', (err, data) => {
      if (err) throw err;
      let products = JSON.parse(data);
      products.push(product);
      fs.writeFile(this.path, JSON.stringify(products), (err) => {
        if (err) throw err;
      });
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }

  getProductById(id) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) reject(err);
        let products = JSON.parse(data);
        let product = products.find(p => p.id === id);
        resolve(product);
      });
    });
  }

  updateProduct(id, product) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) reject(err);
        let products = JSON.parse(data);
        let productIndex = products.findIndex(p => p.id === id);
        products[productIndex] = { ...products[productIndex], ...product };
        fs.writeFile(this.path, JSON.stringify(products), (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }

  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) reject(err);
        let products = JSON.parse(data);
        products = products.filter(p => p.id !== id);
        fs.writeFile(this.path, JSON.stringify(products), (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }
}

module.exports = ProductManager;

const productsPath = './products.json';
const products = new ProductManager(productsPath);

products.getProducts()
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.error(err);
  });