module.exports.isAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.originalUrl = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
}