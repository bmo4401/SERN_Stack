import express from 'express';

let viewEngine = (app) => {
    // Cho phép client truy cập vào file này
    app.use(express.static('./src/public'));
    app.set('view engine', 'ejs'); //Gõ logic trong html
    app.set('views', './src/views');
};

export default viewEngine;
