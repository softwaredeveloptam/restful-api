import mariaDB from "mariadb"

require("dotenv").config

let db: boolean | mariaDB.Pool = false
let dbCredentials: mariaDB.PoolConfig

const getDB = (): mariaDB.Pool | Promise<mariaDB.Pool> => {
	return new Promise(async (resolve, reject)=>{
		try {
			if(!db)
				dbCredentials = {
					host: process.env.DB_HOST || "maria_db",
					user: process.env.DB_USER || "root",
					password: process.env.DB_PASSWORD || "password",
					database: process.env.DB_NAME || "retail_ai",
					connectionLimit: 10,
					dateStrings: true,
				}
			db = await mariaDB.createPool(dbCredentials)
			return resolve(db)
		}
		catch(e){
			console.error(e)
			reject(e)
		}
	})
}

export default getDB