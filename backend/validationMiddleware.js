import Joi from 'joi';

export function validateBody(...schemas) {
    return (req, res, next) => {
        let errors = [];
        schemas.forEach(schema => {
            const { error } = schema.validate(req.body, { abortEarly: false });
            if (error) {
                errors = errors.concat(error.details.map(detail => detail.message));
            }
        });
        if (errors.length > 0) {
            req.flash('error_msg', errors);
            return res.redirect('back');
        }
        next();
    };
}
