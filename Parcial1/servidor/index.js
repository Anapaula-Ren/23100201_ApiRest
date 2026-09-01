const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());

const miRuta= require('./routes/routes'); 

app.use ('/', miRuta); 

app.listen(PORT, () => {
    console.log(`Servidorsin express corriendo en http://localhost:${PORT}`);
});
