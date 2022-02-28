import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require("dotenv").config();
const express = require("express");
var cors = require('cors')
import fetch from 'node-fetch';

const app = express();

const port = 3000;


app.use(cors({
    origin: '*'
}));
// Routes

// Test route, visit localhost:3000 to confirm it's working
// should show 'Hello World!' in the browser
app.get("/", (req, res) => res.send("What are you doing here ??"));

// Our Goodreads relay route!
app.get("/api/latest_transactions", async (req, res) => {
		// It uses node-fetch to call the goodreads api, and reads the key from .env
	const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=bd2c5be14f2f3bf2da4ffdb4&limit=10`);
    
    
	const results = await response.json();

	return res.json(results)
})

app.get("/api/all_transactions", async (req, res) => {
    // It uses node-fetch to call the goodreads api, and reads the key from .env
const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=bd2c5be14f2f3bf2da4ffdb4&limit=999999`);


const results = await response.json();

return res.json(results)
})

// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));