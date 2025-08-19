import User from '../models/user.js';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const user = new User({ username, email, password });
  await user.save();
  req.session.user = user;
  res.json({ message: 'Signup successful', user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.user = user;
  res.json({ message: 'Login successful', user });
};

export const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
};

export const getUser = (req, res) => {
  if (req.session.user) res.json(req.session.user);
  else res.status(401).json({ message: 'Not logged in' });
};
