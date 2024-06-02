import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';

const __dirname = path.resolve();
const Public = path.join(__dirname, 'public');

const app = express();
const port = 3000;

app.use(cors());

app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});

app.get('/', async(req, res) => {
    try {
        const indexHTML = path.join(Public, 'index.html');
        if(!await fs.stat(indexHTML).catch(()=> false)){
            console.log('Error en rescate del index.html')
            return res.status(404).send("index.html no fue alcanzado")
        }
        res.sendFile(indexHTML);
    } catch (error) {
        console.log(error)
    }
})

app.get('/deportes', async(req, res) => {
    try {
        const data = path.join(Public, 'deportes.json');
        if(!await fs.stat(data).catch(()=> false)){
            console.log('Error en rescate del deportes.json')
            return res.status(404).send("deportes.json no fue alcanzado")
        }
        res.sendFile(data);
    } catch (error) {
        console.log(error)
    }
})

app.get('/agregar', async(req, res) =>{
    try {
        const { nombre, precio } = req.query;
        if(!nombre || !precio){
            return res.status(400).send('Faltan parametros')
        }
        const data = path.join(Public, 'deportes.json');
        if(!data){
            return res.status(400).send('Falta data')
        }
        const dataJSON = await fs.readFile(data, 'utf-8')
        const { deportes } = await JSON.parse(dataJSON);
        deportes.push({nombre, precio});
        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Registro exitoso')
    } catch (error) {
        console.log(error);
    }
});

app.get('/editar', async (req, res) => {
    try {
        const { nombre, precio } = req.query;
        if(!nombre || !precio){
            return res.status(400).send('Faltan parametros')
        }
        const data = path.join(Public, 'deportes.json');
        if(!data){
            return res.status(400).send('Falta data')
        }
        const dataJSON = await fs.readFile(data, 'utf-8')
        let { deportes } = await JSON.parse(dataJSON);
        deportes = deportes.map((item) => {
            if (item.nombre === nombre) {
                item.precio = precio;
            }
            return item;
        })
        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Registro editado exitosamente')

    } catch (error) {
        console.log(error)
    }
})

app.get('/eliminar', async (req, res) => {
    try {
        const { nombre } = req.query;
        if(!nombre){
            return res.status(400).send('Faltan parametros')
        }
        const data = path.join(Public, 'deportes.json');
        if(!data){
            return res.status(400).send('Falta data')
        }
        const dataJSON = await fs.readFile(data, 'utf-8')
        let { deportes } = await JSON.parse(dataJSON);
        deportes = deportes.filter((item) => item.nombre !== nombre)
        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Seguro que quiere eliminar este registro...')
    } catch (error) {
        console.log(error)
    }
})