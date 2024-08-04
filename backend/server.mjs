import express from 'express';
import mongoose from 'mongoose';

const PORT = 5000;

const app = express();

mongoose.connect('mongodb://localhost:5000/PlacesToStay', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(error => console.error(error))
    
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});