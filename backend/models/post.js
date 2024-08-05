import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true},
    constent: { type: String, required: true },
    image: {type: String, required: true },
    location: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }]
});

export default mongoose.model('"Post', postSchema);
