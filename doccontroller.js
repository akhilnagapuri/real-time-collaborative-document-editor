import Document from '../models/document.js';

export const getDocument = async (req, res) => {
  const doc = await Document.findOne({ docId: req.params.docId });
  res.json(doc || { content: "" });
};

export const saveDocument = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });

  const { content } = req.body;
  await Document.findOneAndUpdate(
    { docId: req.params.docId },
    { content, owner: req.session.user._id },
    { upsert: true }
  );
  res.sendStatus(200);
};

export const getUserDocs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  const docs = await Document.find({ owner: req.session.user._id });
  res.json(docs);
};
