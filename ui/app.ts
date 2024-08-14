// import express, { Request, Response } from 'express';
// import { format, transports } from 'winston';
// import expressWinston from 'express-winston';
// import path from 'path';
// import { engine } from 'express-handlebars';
// import svcs from './svc'

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




import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});