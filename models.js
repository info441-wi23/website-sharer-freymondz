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
});

models.post = mongoose.model('post', postSchema);

export default models;