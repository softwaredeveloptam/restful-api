import express from "express"
import cors from "cors"
import morgan from "morgan"

require("dotenv").config

import api from "./api"

const app = express()

const host = process.env.SERVER_HOST || "0.0.0.0"
const port = Number(process.env.SERVER_PORT) || 8080

app.set("port", port)
app.use(morgan(":method :url :status :response-time"))
app.use(cors({
	origin: process.env.ORIGINS || `http://${host}:${port}`,
	credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({
	extended: true,
}))

app.use("/", api)

// app.use("*", function (req, res) {
// 	res.status(404).send("Page does not exist")
// })

app.listen(port, host)
console.log("Server listening on " + host + ":" + port) // eslint-disable-line no-console


