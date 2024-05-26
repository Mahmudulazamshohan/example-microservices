import express, { Request, Response } from 'express';
import { format, transports } from 'winston';
import expressWinston from 'express-winston';
import path from 'path';
import { create, engine } from 'express-handlebars';

const { combine, colorize, json } = format;
const { Console } = transports;
const app = express();
const PORT: number = 4003;

const hbs = create({
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

app.use(
    expressWinston.logger({
        transports: [new Console()],
        format: combine(colorize(), json()),
        meta: false,
        msg: "HTTP  ",
        expressFormat: true,
        colorize: false,
        ignoreRoute: (_req, _res) => false,
    })
);

app.get('/', (req: Request, res: Response) => res.render('home', { title: 'Socio' }));

app.listen(PORT, () => console.log(`Server started at ${PORT}`));