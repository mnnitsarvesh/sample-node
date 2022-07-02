import passport from 'passport';

export var jwtStrategyAdmin = (req, res, next) => {
    passport.authenticate('user-jwt-admin', {session: false}, (err, user, info) => { 
        if (err && err == 'expired'){ return res.status(500).json({ errors: ['Session is expired']}) }
        if (err && err == 'invalid'){ return res.status(500).json({ errors: ['Invalid token recieved']}) }
        if (err && err == 'user'){ return res.status(500).json({ errors: ['Unauthorised user']}) }
        if (err && Object.keys(err).length) { return res.status(500).json({ errors: [ err ]}); }
        if (err) { return res.status(500).json({ errors: [ 'Unauthorised user' ]}); }
        if (!user) { return res.status(500).json({ errors: ['Unauthorised user']}) }
        req.user = user;
        next();
    })(req, res, next);
};

export var jwtStrategyVendor = (req, res, next) => {
    passport.authenticate('user-jwt-vendor', {session: false}, (err, user, info) => { 
        if (err && err == 'expired'){ return res.status(401).json({ errors: ['Session is expired']}) }
        if (err && err == 'invalid'){ return res.status(401).json({ errors: ['Invalid token recieved']}) }
        if (err && err == 'user'){ return res.status(401).json({ errors: ['Unauthorised user']}) }
        if (err && Object.keys(err).length) { return res.status(500).json({ errors: [ err ]}); }
        if (err) { return res.status(401).json({ errors: [ 'Unauthorised user' ]}); }
        if (!user) { return res.status(401).json({ errors: ['Unauthorised user']}) }
        req.user = user;
        next();
    })(req, res, next);
};

export var jwtStrategyPatient = (req, res, next) => {
    passport.authenticate('user-jwt-patient', {session: false}, (err, user, info) => { 
        if (err && err == 'expired'){ return res.status(401).json({ errors: ['Session is expired']}) }
        if (err && err == 'invalid'){ return res.status(401).json({ errors: ['Invalid token recieved']}) }
        if (err && err == 'user'){ return res.status(401).json({ errors: ['Unauthorised user']}) }
        if (err && Object.keys(err).length) { return res.status(500).json({ errors: [ err ]}); }
        if (err) { return res.status(401).json({ errors: [ 'Unauthorised user' ]}); }
        if (!user) { return res.status(401).json({ errors: ['Unauthorised user']}) }
        req.user = user;
        next();
    })(req, res, next);
};

export var jwtWebStrategy = (req, res, next) => {
    passport.authenticate('user-jwt-admin', {session: false}, (err, user, info) => { 
        let contype = req.headers['content-type'];
        var json = !(!contype || contype.indexOf('application/json') !== 0);
        if (err && err == 'expired'){ return json?res.status(401).json({ errors: ['Session is expired']}):res.redirect('/logout'); }
        if (err && err == 'invalid'){ return json?res.status(401).json({ errors: ['Invalid token recieved']}):res.redirect('/logout'); }
        if (err && err == 'user'){ return json?res.status(401).json({ errors: ['Unauthorised user']}):res.redirect('/logout'); }
        if (err && Object.keys(err).length) { return res.status(500).json({ errors: [ err ]}); }
        if (err) { return res.status(401).json({ errors: [ 'Unauthorised user' ]}); }
        if (!user) { return json?res.status(401).json({ errors: ['Unauthorised user']}):res.redirect('/logout'); }
        req.user = user;
        next();
    })(req, res, next);
};

export var localStrategyVendor = (req, res, next) => {
    passport.authenticate('vendor-local', {session: false}, (err, user, info) => {
        if (err && err == 'invalid') { return res.status(500).json({ errors: ['EmailId or Phone is not verified']}); }
        if (err && err == 'attempt') { return res.status(500).json({ errors: ['Too many invalid attempts. Please reset your password.']}); }
        if (err && err.startsWith('attempt:')) { return res.status(500).json({ errors: ['Invalid Credentials (' + err.split(':')[1]+' Attempt(s) Left)']}); }
        if (err) { return res.status(500).json({ errors: [ err ]}); }
        if (!user) { return res.status(500).json({ errors: ['Invalid Credentials']}); }
        req.user = user;
        next();
    })(req, res, next);
};

export var localStrategyUser = (req, res, next) => {
    passport.authenticate('user-local', {session: false}, (err, user, info) => {
        if (err && err == 'invalid') { return res.status(500).json({ errors: ['EmailId or Phone is not verified']}); }
        if (err && err == 'attempt') { return res.status(500).json({ errors: ['Too many invalid attempts. Please reset your password.']}); }
        if (err && err.startsWith('attempt:')) { return res.status(500).json({ errors: ['Invalid Credentials (' + err.split(':')[1]+' Attempt(s) Left)']}); }
        if (err) { return res.status(500).json({ errors: [ err ]}); }
        if (!user) { return res.status(500).json({ errors: ['Invalid Credentials']}); }
        req.user = user;
        next();
    })(req, res, next);
};

export var localStrategyAdmin = (req, res, next) => {
    passport.authenticate('admin-local', {session: false}, (err, user, info) => {
        if (err && err == 'invalid') { return res.status(500).json({ errors: ['EmailId or Phone is not verified']}); }
        if (err && err == 'attempt') { return res.status(500).json({ errors: ['Too many invalid attempts. Please reset your password.']}); }
        if (err && err.startsWith('attempt:')) { return res.status(500).json({ errors: ['Invalid Credentials (' + err.split(':')[1]+' Attempt(s) Left)']}); }
        if (err) { return res.status(500).json({ errors: [ err ]}); }
        if (!user) { return res.status(500).json({ errors: ['Invalid Credentials']}); }
        req.user = user;
        next();
    })(req, res, next);
}
