const express = require('express');
const app = express();
const port = 1000;

app.get('/api', (req, res) => {
    res.json({ message: 'Hello world' });
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
