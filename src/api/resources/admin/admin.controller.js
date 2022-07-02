import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import { db } from '../../../models';
import config from '../../../config';

const JWTSign = function (iss, user, date) {
    return JWT.sign({
        type: iss,
        sub: user.id,
        key: user.password,
        iat: date.getTime(),
        iss: `${config.app.name}-${iss}`,
        exp: new Date().setMinutes(date.getMinutes() + 60)
    }, config.app.secret);
}

export default {
    async login(req, res){
        var token = JWTSign('ADMIN', req.user, new Date());
        res.cookie('XSRF-token', token, {
            expire: new Date().setMinutes(new Date().getMinutes() + 60),
            httpOnly: true, secure: config.app.secure
        });
        return res.status(200).json({ success: true, name: req.user.name });
    },
};