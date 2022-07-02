import path from 'path';
import logger from 'morgan';
import helmet from 'helmet';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import expressSanitizer from 'express-sanitizer';

export default {
    setup: (config, defaultLayout) => {

        const app = express();

        app.use(logger(config.app.log));
        app.use(cookieParser(config.app.secret));
        app.use(bodyParser.json({limit: '500mb'}));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(session({ secret: config.app.secret ,resave: true, saveUninitialized:true}));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(expressSanitizer());

        if(process.env.API_DOC_MODE=='dev')
            app.use('/api-doc', express.static('./apidoc/'))
        app.use("/static", express.static(path.join(__dirname, 'public')));
        // app.use(helmet());
        // app.use(helmet.hsts({ maxAge: 0 }))
		app.use(function (req, res, next) {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.header('Expires', '-1');
			res.header('Pragma', 'no-cache');
			next()
		});
        app.set('views', path.join(__dirname, 'web', 'resources', 'views', 'layouts'));
        app.engine('hbs', exphbs({
            extname: '.hbs',
            defaultLayout: defaultLayout,
            partialsDir: path.join(__dirname, 'web', 'resources', 'views', 'partials'),
            layoutsDir: path.join(__dirname, 'web', 'resources', 'views', 'layouts'),
            helpers: {
                block: function (name) {
                    var blocks  = this._blocks, content = blocks && blocks[name];
                    return content ? content.join('\n') : null;
                },
                contentFor: function (name, options) {
                    var blocks = this._blocks || (this._blocks = {}), block  = blocks[name] || (blocks[name] = []);
                    block.push(options.fn(this));
                },
                if: function (name, options) {
                    if(name) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                }
            }
        }));
        app.set('view engine', '.hbs');
        return app;
    }
}