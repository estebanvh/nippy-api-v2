//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'desa';

//caducidad dias
process.env.CADUCA_DIA = process.env.CADUCA_DIA || (1000 * 60 * 2); // (1 * 24 * 60 * 60 * 1000) 1 dia en milisegundos

//SEMILLA
process.env.SEED = process.env.SEED || 'seed1234';
process.env.EXPIRE = '1h';

//PORT
process.env.PORT = process.env.PORT || 3000;

//BASE DE DATOS
process.env.MONGO_USER = process.env.MONGO_USER || "";
process.env.MONGO_PASS = process.env.MONGO_PASS || "";
process.env.DB_URI = process.env.NODE_ENV === "desa" ? "mongodb://localhost:27017/nippy_db_desa" : process.env.MONGO_PROD;