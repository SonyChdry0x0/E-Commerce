import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('HELLO WORLD'));
app.listen(8080, () => console.log('running on 8080'));
