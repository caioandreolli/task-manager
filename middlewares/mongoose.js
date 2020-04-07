require('dotenv').config();

class MongoServer {
  constructor() {
    this.mongoose = require('mongoose');
  }

  startDbConnection = () => {
    this.mongoose
      .connect(
        process.env.MONGODB_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
      )
      .then(() => console.log(`Conectado ao Banco ${process.env.MONGODB_URI}`))
      .catch((err) => {
        throw new Error(err);
      });
  };
}

module.exports = new MongoServer();
