const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register", { title: 'Register' });
};

module.exports.registerUser = async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({username, email});
        const completeUser = await User.register(user, password);
        req.logIn(completeUser, (err) => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
        
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login', {title: 'Login'});
};

module.exports.loginUser = (req, res) => {
    const returnUrl = req.session.originalUrl || '/campgrounds';
    delete req.session.originalUrl;
    req.flash('success', 'Welcome Back');
    res.redirect(returnUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'Catch you later');
    res.redirect('/campgrounds');
};
