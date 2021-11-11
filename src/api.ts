import express from "express"
// import passport from "passport"
// import bcrypt from "bcrypt"
// import Auth from "./flows/auth"
// import User from "./flows/user"
import database from "./db"
import { isEmpty } from "lodash"

let router = express.Router()

router.post("/recipes", async (req, res, next) => {
	let conn, pool

	try {
		pool = await database()
		conn = await pool.getConnection()
		const { title, making_time, serves, ingredients, cost } = req.body
		let payload

		if(!isEmpty(req.body) && title && making_time && serves && ingredients && cost) {
			// validate title/making_time/serves/ingredients/cost
			await conn.query("INSERT INTO `recipes` (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)", [title, making_time, serves, ingredients, Number(cost)])
			const results = await conn.query("SELECT * FROM `recipes` WHERE (title) = ?", [title])

			payload = {
				message: "Recipe successfully created!",
				recipe: [
					{
						id: results[0].id,
						title: results[0].title,
						making_time: results[0].making_time,
						serves: results[0].serves,
						ingredients: results[0].ingredients,
						cost: results[0].cost,
						created_at: results[0].created_at,
						updated_at: results[0].updated_at,
					},
				],
			}

			res.status(200).json(payload)
		}
		else {
			payload = {
				message: "Recipe creation failed!",
				required: "title, making_time, serves, ingredients, cost",
			}
			res.status(404).json(payload)
		}
		res.status(200).json({
			message: "Recipe successfully created!",
		})
	}
	catch (err) {
		console.error(err)
		res.json({message: "Problem connecting to database"}).sendStatus(404)
	}
	finally {
		if(conn) conn.release()
		if(pool) pool.end()
		next()
	}
})

router.get("/recipes", async (req, res, next) => {
	let conn, pool, payload

	try {
		pool = await database()
		conn = await pool.getConnection()
		const results = await conn.query("SELECT * FROM `recipes`")
		res.json({ recipes: results }).sendStatus(200)
	}
	catch (err) {
		console.error(err)
		payload = {
			message: "Fetching recipes failed!",
		}
		res.status(404).json(payload)
	}
	finally {
		if(conn) await conn.end()
		if(pool) await pool.end()
		next()
	}
})

router.get("/recipes/:id", async (req, res, next) => {
	let conn, pool, payload

	try {
		pool = await database()
		conn = await pool.getConnection()
		let results
		try {
			results = await conn.query("SELECT * FROM `recipes` WHERE (id) = ?", [req.params.id ? req.params.id : 1])
		}
		catch (err) {
			console.error("Cannot find ID, defaulting to ID: 1")
			results =await conn.query("SELECT * FROM `recipes` WHERE (id) = ?", [ 1 ])
		}
		payload = {
			message: "Recipe details by id",
			recipe: [
				{
					id: results[0].id,
					title: results[0].title,
					making_time: results[0].making_time,
					serves: results[0].serves,
					ingredients: results[0].ingredients,
					cost: results[0].cost,
				},
			],
		}

		res.status(200).json(payload)
	}
	catch (err) {
		console.error(err)
		payload = {
			message: "Fetching recipes failed!",
		}
		res.status(404).json(payload)
	}
	finally {
		if(conn) await conn.end()
		if(pool) await pool.end()
		next()
	}
})

router.patch("/recipes/:id", async (req, res, next) => {
	let conn, pool, payload
	const { title, making_time, serves, ingredients, cost } = req.body

	try {
		if(!isEmpty(req.body) && title && making_time && serves && ingredients && cost) {
			pool = await database()
			conn = await pool.getConnection()

			let results
			try {
				results = await conn.query("SELECT * FROM `recipes` WHERE (id) = ?", [req.params.id ? req.params.id : 1])
			}
			catch (err) {
				results = await conn.query("SELECT * FROM `recipes` WHERE (id) = ?", [1])
			}

			const updatedResult = await conn.query("UPDATE `recipes` SET title = ?, making_time = ?, serves = ?, ingredients = ?, cost = ? WHERE id = ?", [title, making_time, serves, ingredients, cost, results[0].id])

			payload = {
				message: "Recipe details by id",
				recipe: [
					{
						id: updatedResult[0].id,
						title: updatedResult[0].title,
						making_time: updatedResult[0].making_time,
						serves: updatedResult[0].serves,
						ingredients: updatedResult[0].ingredients,
						cost: updatedResult[0].cost,
					},
				],
			}

			res.status(200).json(payload)
		}
	}
	catch (err) {
		console.error(err)
		payload = {
			message: "Fetching recipes failed!",
		}
		res.status(404).json(payload)
	}
	finally {
		if(conn) await conn.end()
		if(pool) await pool.end()
		next()
	}
})

router.delete("/recipes/:id", async (req, res, next) => {
	let conn, pool, payload

	try {
		pool = await database()
		conn = await pool.getConnection()
		await conn.query("DELETE FROM `recipes` WHERE (id) = ?", [req.params.id])
		payload = {
			message: "Recipe successfully removed!",
		}
		res.status(200).json(payload)
	}
	catch (err) {
		console.error(err)
		payload = {
			message: "No recipe found",
		}
		res.status(404).json(payload)
	}
	finally {
		if(conn) await conn.end()
		if(pool) await pool.end()
		next()
	}
})

export default router
