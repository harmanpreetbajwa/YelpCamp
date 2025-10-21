const User = require('../models/user');

module.exports.renderRegister = (req, res) => 
    {
    res.render('user/register');
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}

module.exports.createReview = async (req, res, next)=> {
    try{
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            console.log(req.user);
            req.flash('success', `${req.user.username}, You are successfully registered!!`);
            res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.login = async (req, res)=> {
    req.flash('success', 'Welcome back !');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err){
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out.');
        res.redirect('/campgrounds');
    });
}
