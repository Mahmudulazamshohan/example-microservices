"use strict";
// import express, { Request, Response } from 'express';
// import { format, transports } from 'winston';
// import expressWinston from 'express-winston';
// import path from 'path';
// import { engine } from 'express-handlebars';
// import svcs from './svc'
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// const { combine, colorize, json } = format;
// const { Console } = transports;
// const app = express();
// const PORT: number = 4003;
// const isProduction = process.env.NODE_ENV === 'production';
// app.engine('handlebars', engine({
//     defaultLayout: 'main',
//     layoutsDir: path.join(__dirname, './views/layouts'),
// }));
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, './views'));
// app.use(
//     expressWinston.logger({
//         transports: [new Console()],
//         format: combine(colorize(), json()),
//         meta: false,
//         msg: "HTTP  ",
//         expressFormat: true,
//         colorize: false,
//         ignoreRoute: (_req, _res) => false,
//     })
// );
// svcs.forEach((svc) => {
//     svc.paths.forEach((path) => {
//         const middlewares = svc.middlewares ?? [];
//         app.get(path, middlewares, (req: Request, res: Response) => {
//             const assets: string[] = (svc.assets ?? [])
//                 .flatMap((asset) => [
//                     ...asset.paths,
//                     ...(isProduction ? asset.cdn : asset.local),
//                 ]);
//             res.locals.assets = assets;
//             res.render(svc.serviceName);
//         });
//     });
// });
// app.get('/main.js', (req, res) => {
//     res.setHeader('Content-Type', 'text/javascript')
//         .sendFile(path.join(__dirname, './fontend/index.fontend.js'));
//   });
// app.listen(PORT, () => console.log(`Server started at ${PORT}`));
var express = require("express");
var path = require("path");
var pino_http_1 = require("pino-http");
var app = express();
var logger = (0, pino_http_1.default)({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    customLogLevel: function (res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500)
            return 'warn';
        if (res.statusCode >= 500 || err)
            return 'error';
        return 'info';
    },
});
app.use(logger);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', function (_, res) { return res.sendFile(path.join(__dirname, 'dist', 'index.html')); });
var port = ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.PORT) || 4003;
app.listen(port, function () { return console.log("Server running on port ".concat(port)); });
