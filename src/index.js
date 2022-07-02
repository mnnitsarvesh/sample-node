import 'dotenv/config';
import cors from 'cors';
import kue from './kue';
import path from 'path';
import { db } from './models';
import config from './config';
import appManager from './app';
import { webRouter } from './web';
import { restRouter } from './api';

import './errors';
import './passport';

const PORT = config.app.port;

global.appRoot = path.resolve(__dirname);

const app = appManager.setup(config, path.join(__dirname, 'web', 'resources', 'views', 'layouts', 'main.hbs'));

app.use(cors());

/* Route handling */
app.use('/api', (req, res, next) => {

    const lang = req.acceptsLanguages('en');

    if (lang) {
        req.lang = lang
    } else {
        req.lang = 'en'
    }

    next();
    
}, restRouter);
app.use('/', webRouter);

app.use((req, res, next) => {
    next(new RequestError('Invalid route', 404));
});

app.use((error, req, res, next) => {
  	if (!(error instanceof RequestError)) {
		error = new RequestError('Some Error Occurred', 500, error.message);
    }
    error.status = error.status || 500;
    res.status(error.status);
    let contype = req.headers['content-type'];
    var json = ((contype && contype.indexOf('application/json') !== 0) || contype && contype.indexOf('multipart/form-data') !== 0);
    if (json) {
        return res.json({ success: false, errors: [error.message] });
    } else {
        if (error.status == 500) {
            return res.render('500', { layout: null });
        } else if (error.status == 404) {
            return res.render('404', { layout: null });
        } else if (error.status == 401) {
            return res.json({ errors: [error.message] });
        } 
        return res.send('Error');
    }
});

kue.init();

/* Database Connection */
db.sequelize.authenticate().then(function() {
  	console.log('Nice! Database looks fine');
})
.catch(function(err) {
  	console.log(err, "Something went wrong with the Database Update!")
});
  
/* Start Listening service */
app.listen(PORT, () => {
  	console.log(`Server is running at PORT http://localhost:${PORT}`);
});