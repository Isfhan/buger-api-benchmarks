const express = require('express');
const app = express();
const port = 1000;

// app.use(async (req, res, next) => {
//     // console.log(`[Global Logger] ${request.method} ${request.url}`);
//     let a = 2 + Math.random();
//     // return a.toString();
//     console.log(a);
//     // console.log("Global middleware executed.");
//     // console.log('Time:', Date.now())
//     next();
// })

app.get('/api', (req, res) => {
    res.json({ message: 'Hello world' });
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
