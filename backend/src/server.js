const express = require('express');
const app = express();
const productos = require('./data/productos.json');

app.get("/api/salud", (req, res) => {
    res.json({ estado: "ok" });
});

app.get("/api/productos", (req, res) => {
    res.json(productos);
});

app.get("/api/tienda", (req, res) => {
    res.json({ nombre: "Estilo Alfa" });
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});

app.get("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
});