export default {
    async login(req, res) {
        res.render('login', {layout: 'auth'});
    },
};
