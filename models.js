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

const userSchema = new mongoose.Schema({
    username: String,
    website_url: String,
});

models.post = mongoose.model('post', postSchema);
models.comment = mongoose.model('comment', commentSchema);
models.user = mongoose.model('user', userSchema);

export default models;