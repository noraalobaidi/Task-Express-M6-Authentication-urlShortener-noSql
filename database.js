const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect('Your_connection_string', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
