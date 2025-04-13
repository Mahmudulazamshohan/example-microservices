import * as express from 'express';
import * as path from 'path';
import pinoHttp from 'pino-http';

const app: express.Application = express();
const logger: any = pinoHttp({
    customLogLevel: (res: express.Response, err: Error) => {
        if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
        if (res.statusCode >= 500 || err) return 'error';
        return 'info';
    },
});

app.use(logger);
app.use('/static', express.static(path.join(__dirname, 'dist')));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const port = process?.env?.PORT || 4003;

app.listen(port, () => console.log(`Server running on port ${port}`));