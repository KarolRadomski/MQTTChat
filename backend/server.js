const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const connectMQTT = require('./config/mqtt');
const path = require('path');
const port = process.env.port || 5002;

connectDB();
connectMQTT();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/access', require('./routes/accessRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Handle production
if (process.env.NODE_ENV === 'production') {
  //Static folder
  app.use(express.static(path.join(__dirname, 'public/')));
  
  // Handle SPA
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'public/index.html')));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
