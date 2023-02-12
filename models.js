import mongoose from "mongoose";

console.log('Connecting to MongoDB...');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://frey:wdphIzJJD9B7ip3f@test-cluster.yizupps.mongodb.net/?retryWrites=true&w=majority');
console.log('Connected to MongoDB');

const models = {};
const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: Date,
    username: String,
    likes: [String],
});

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    created_date: Date,
});

models.post = mongoose.model('post', postSchema);
models.comment = mongoose.model('comment', commentSchema);

export default models;