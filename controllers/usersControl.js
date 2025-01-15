
app.post('/register', async (req, res) => {
    const { email,username, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists!' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({ email, username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Registration failed!' });
    }
  });
  
  
  app.post('/login', async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      const user = await User.findOne({ email, username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials!' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials!' });
      } 
  
      res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed!' });
    }
  });
  // Update Route
  app.put('/update', async (req, res) => {
    const { email, password, newPassword } = req.body;
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
      // Compare old password if provided
      if (password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Old password is incorrect!' });
        }
      }
  
      // Hash the new password if provided
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
  
      // Update user data
      if (email) {
        user.email = email;
      }
  
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
      console.error('Error during update:', error);
      res.status(500).json({ message: 'Update failed!' });
    }
  });
  
  // Delete Route
  app.delete('/delete', async (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      // Find and delete user by ID
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
      res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
      console.error('Error during deletion:', error);
      res.status(500).json({ message: 'Deletion failed!' });
    }
  });
  