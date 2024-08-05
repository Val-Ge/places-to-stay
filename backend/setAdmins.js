require('dotenv').config();


const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/travelBlog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB Connected');
    return setAdmin(process.env.ADMIN_EMAIL); // Replace with your email
})
.catch(err => console.log(err))
.finally(() => {
    mongoose.connection.close();
});

const setAdmin = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log('User role updated to admin');
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error(error);
    }
};
