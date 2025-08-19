import mongoose from 'mongoose';
const documentSchema = new mongoose.Schema({
  docId: String,
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
export default mongoose.model('Document', documentSchema);
