require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const bcrypt = require('bcrypt');

const userRoutes    = require('./routes/userRoutes');
const carRoutes     = require('./routes/carRoutes');
const bidRoutes     = require('./routes/bidRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => res.send('Car Bidding API is running'));

sequelize.sync({ alter: true }).then(async () => {
  const User = require('./models/User');
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        name: 'Admin',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      }
    });
  }

  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}).catch(err => console.error('DB connection failed:', err));
