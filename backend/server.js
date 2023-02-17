const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const connectMQTT = require('./config/mqtt');

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

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));