import { db } from './models';
import config from './config';
import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

var TokenExtractor = function(req){
    var token = null;
    if(req.headers['authorization']){
        token = req.headers['authorization'];
    }
    if (token == null && req.cookies['XSRF-token'] && req.cookies['XSRF-token'].length){
        token = req.cookies['XSRF-token'];
    }
    return token;
}

passport.use('user-jwt-admin', new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: config.app.secret,
}, async (payload, done) => {
    try {
        db.Admin.findOne({ where: { id: payload.sub, password: payload.key } })
        .then(user => {
            if (!user) {
                return done('user', false);
            }
    
            if (new Date(payload.exp) < new Date()) {
                return done('expired', false);
            }
    
            user.type = payload.type;
    
            done(null, user);
        })
        .catch(err => {
            console.log(err);
            return done(err, false);
        })

    } catch (error) {
        console.log(error);
        done(error, false);
    }
}));

passport.use('user-jwt-vendor', new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: config.app.secret,
}, async (payload, done) => {
    try {
        db.Vendor.findOne({ where: { id: payload.sub, key: payload.key } })
        .then(user => {
            if (!user) {
                return done('user', false);
            }
    
            if (new Date(payload.exp) < new Date()) {
                return done('expired', false);
            }
    
            user.type = payload.type;
    
            done(null, user);
        })
        .catch(err => {
            console.log(err);
            return done(err, false);
        })
        
    } catch (error) {
        console.log(error);
        done(error, false);
    }
}));

passport.use('user-jwt-patient', new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: config.app.secret,
}, async (payload, done) => {
    try {
        db.User.findOne({ where: { id: payload.sub, key: payload.key } })
        .then(user => {
                
            if (!user) {
                return done('user', false);
            }
    
            if (new Date(payload.exp) < new Date()) {
                return done('expired', false);
            }
    
            user.type = payload.type;
    
            done(null, user);

        })
        .catch(err => {
            console.log(err);
            return done(err, false);
        })
       
    } catch (error) {
        console.log(error);
        done(error, false);
    }
}));

passport.use('vendor-local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        db.Vendor.findOne({ 
            where: { 
                $or: [{ phone: email }, { email: email }] 
            } 
        })
        .then( user => {
            if (!user) {
                return done(null, false);
            }

            if (!user.isVerify) {
                return done('invalid', false);
            }

            if (user.attempt == 5) {
                return done('attempt', false);
            }

            var isMatch =  bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                user.update({ attempt: user.attempt + 1 })
                return done('attempt:' + (5 - user.attempt), false);
            } else {
                user.update({ attempt: 0 })
            }

            user.type = "VENDOR";

            done(null, user);
        })
        .catch(err => {
            console.log(err);
            return done(err, false);
        })
    } catch (error) {
        console.log(err)
        done(err, false);
    }
}));

passport.use('user-local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        db.User.findOne({ 
            where: { 
                $or: [{ phone: email }, { email: email }] 
            } 
        })
        .then( user => {
            if (!user) {
                return done(null, false);
            }

            if (!user.isVerify) {
                return done('invalid', false);
            }

            if (user.attempt == 5) {
                return done('attempt', false);
            }

            var isMatch =  bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                user.update({ attempt: user.attempt + 1 })
                return done('attempt:' + (5 - user.attempt), false);
            } else {
                user.update({ attempt: 0 })
            }

            user.type = "USER";

            done(null, user);
        })
        .catch(err => {
            console.log(err);
            return done(err, false);
        })
    } catch (error) {
        console.log(err)
        done(err, false);
    }
}));

passport.use('admin-local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        db.Admin.findOne({ 
            where: { 
                email: email 
            }
        })
        .then(user => {
            if (!user) {
                return done(null, false);
            }
    
            if (!user.isVerify) {
                return done('invalid', false);
            }
    
            if (user.attempt == 5) {
                return done('attempt', false);
            }
    
            var isMatch =  bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                user.update({ attempt: user.attempt + 1 })
                return done('attempt:' + (5 - user.attempt), false);
            } else {
                user.update({ attempt: 0 })
            }
    
            user.type = "ADMIN";
    
            done(null, user);
        })
        .catch(err => {
            console.log(err)
            done(err, false);
        })

    } catch (error) {
        console.log(err)
        done(err, false);
    }
}));