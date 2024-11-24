const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectionString = require('./src/config/db');
const routers = require('./src/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

connectionString(process.env.MONGO_URI);
app.use('/api', routers);

app.use('/checker', (req, res) => {
  res.status(200).send('Server is up and running');
});

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
