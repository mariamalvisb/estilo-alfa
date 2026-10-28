const express = require('express');
const app = express();

app.get("/api/salud", (req, res) => {
    res.json({ estado: "ok" });
});

app.get("/api/tienda", (req, res) => {
    res.json({ nombre: "Estilo Alfa" });
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});