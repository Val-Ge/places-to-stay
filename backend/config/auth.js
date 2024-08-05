//create an authorization middleware

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that source');
    res.redirect('/login');
}
export function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error_msg', 'you are not authorized to view that source');
    res.redirect('/');
}
