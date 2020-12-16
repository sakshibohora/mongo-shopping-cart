import passport from 'passport';
import csrf from 'csurf';
import express from 'express';
import Order from '../models/order';
import Cart from '../models/cart';
const router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders });
    });
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, (req, res, next) => {
    next();
});

router.get('/signup', (req, res, next) => {
    const messages = req.flash('error')
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0 })
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }
});

router.get('/signin', (req, res, next) => {
    const messages = req.flash('error')
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0 })
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;
