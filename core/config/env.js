const HOST = process.env.HOST;
const PORT = process.env.PORT;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_RETRY_WRITES = process.env.MONGODB_RETRY_WRITES;
const MONGODB_WRITE_CONCERN = process.env.MONGODB_WRITE_CONCERN;
const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME;

const DB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${MONGODB_DB_NAME}?retryWrites=${MONGODB_RETRY_WRITES}&w=${MONGODB_WRITE_CONCERN}&appName=${MONGODB_APP_NAME}`;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = { HOST, PORT, DB_URL, JWT_SECRET_KEY };
