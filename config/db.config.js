module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "!q2w3e4r5t6y",
  DB: "mywhats",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
