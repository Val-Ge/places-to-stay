import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
    name: { type: String, requireed: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
