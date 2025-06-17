const express = require('express');
const app = express();
import coreRouter from './coreRouter';

app.get('/', (req, res) => {
    res.json("Test OK");
});

app.listen(6969);