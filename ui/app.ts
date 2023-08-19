import express, { Request, Response } from 'express';
import process from 'process';
import winston, { format, transports } from 'winston';
import expressWinston from 'express-winston';

const { combine, colorize, json } = format;
const { Console } = transports;
const app = express();
const PORT: number = 4000;

app.use(expressWinston.logger({
    transports: [new Console()],
    format: combine(colorize(), json()),
    meta: false,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: (req, res) => false,
}));

app.get('/', (request: Request, response: Response) => {
    response.send({ name: "abcd" });
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));