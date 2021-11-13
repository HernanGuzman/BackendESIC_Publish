/* eslint-disable no-console */
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import routes from './routes';
import config from './config/config';

const app = express();

/**
 * Get port from environment and store in Express.
 */

app.set('port', config.port || '3001');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/', routes);

//app.use(bodyParser({ limit: '5mb' }));
module.exports = app;
