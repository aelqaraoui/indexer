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
	const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=6ad95b1bc0c3c4f2901c73d2&limit=10`);
    
    
	const results = await response.json();

	return res.json(results)
})

app.get("/api/all_transactions", async (req, res) => {
	const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=6ad95b1bc0c3c4f2901c73d2&limit=999999`);


	const results = await response.json();

	return res.json(results)
})

const get_player_info = (transactions, address) => {
	let result = 0
	let volume = 0
	let streak = 0
	let do_streaks = true
	for(let i = 0; i < transactions.length; i++)
	{
		
		if(transactions[i].signer_id == address)
		{
			let amount = parseInt(transactions[i].amount)
			if(amount > 6) {
				amount /= 1035000000000000000000000
			}
			//console.log(transactions[i].outcome, amount)
			result += transactions[i].outcome ? 1 : 0 * amount
			volume += amount

			if(do_streaks)
			{
				if(transactions[i].outcome)
				{
					streak += 1
				}
				else{
					do_streaks = false
				}
			}
		}
		
	}
	return {'signer_id': address, 'net': result, 'volume': volume, 'streak': streak}
}

app.get("/api/leaderboard/net-gain", async (req, res) => {
	const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=6ad95b1bc0c3c4f2901c73d2&limit=999999`);


	const results = await response.json();

	const transactions = results.data.filter((value) => value.signer_id != 'house.woothugg.near');

	console.log(transactions)

	let total_volume = 0;
	let total_won = 0;
	let total_loss = 0;
	for(let i = 0; i < transactions.length; i++)
	{
		let amount = parseInt(transactions[i].amount)
		if(amount > 6) {
			amount /= 1035000000000000000000000
		}

		total_volume += amount;
		if(transactions[i].outcome)
		{
			total_won += amount;
		}
		else
		{
			total_loss += amount;
		}
	}

	let unique_players = [...new Set(transactions.map((value) => value.signer_id))];
	let player_info = unique_players.map((value) => get_player_info(transactions, value));

	let leaderboard = player_info.map((value) => {return {'signer_id': value.signer_id, 'net': value.net}});
	leaderboard.sort(function(a, b) {
		return b.net - a.net;
	});

	return res.json({
		'total_flips': transactions.length,
		'total_won': total_won,
		'total_loss': total_loss,
		'total_volume': total_volume,
		'leaderboard': leaderboard.slice(0, 20)
	})
})

app.get("/api/leaderboard/volume", async (req, res) => {
	const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=6ad95b1bc0c3c4f2901c73d2&limit=999999`);


	const results = await response.json();

	const transactions = results.data.filter((value) => value.signer_id != 'house.woothugg.near');

	console.log(transactions)

	let total_volume = 0;
	let total_won = 0;
	let total_loss = 0;
	for(let i = 0; i < transactions.length; i++)
	{
		let amount = parseInt(transactions[i].amount)
		if(amount > 6) {
			amount /= 1035000000000000000000000
		}

		total_volume += amount;
		if(transactions[i].outcome)
		{
			total_won += amount;
		}
		else
		{
			total_loss += amount;
		}
	}

	let unique_players = [...new Set(transactions.map((value) => value.signer_id))];
	let player_info = unique_players.map((value) => get_player_info(transactions, value));

	let leaderboard = player_info.map((value) => {return {'signer_id': value.signer_id, 'volume': value.volume}});
	leaderboard.sort(function(a, b) {
		return b.volume - a.volume;
	});

	return res.json({
		'total_flips': transactions.length,
		'total_won': total_won,
		'total_loss': total_loss,
		'total_volume': total_volume,
		'leaderboard': leaderboard.slice(0, 20)
	})
})

app.get("/api/leaderboard/streak", async (req, res) => {
	const response = await fetch(`https://indexer.havendao.community/api/house.woothugg.near?api_key=6ad95b1bc0c3c4f2901c73d2&limit=999999`);


	const results = await response.json();

	const transactions = results.data.filter((value) => value.signer_id != 'house.woothugg.near');

	console.log(transactions)

	let total_volume = 0;
	let total_won = 0;
	let total_loss = 0;
	for(let i = 0; i < transactions.length; i++)
	{
		let amount = parseInt(transactions[i].amount)
		if(amount > 6) {
			amount /= 1035000000000000000000000
		}

		total_volume += amount;
		if(transactions[i].outcome)
		{
			total_won += amount;
		}
		else
		{
			total_loss += amount;
		}
	}

	let unique_players = [...new Set(transactions.map((value) => value.signer_id))];
	let player_info = unique_players.map((value) => get_player_info(transactions, value));

	let leaderboard = player_info.map((value) => {return {'signer_id': value.signer_id, 'streak': value.streak}});
	leaderboard.sort(function(a, b) {
		return b.streak - a.streak;
	});

	return res.json({
		'total_flips': transactions.length,
		'total_won': total_won,
		'total_loss': total_loss,
		'total_volume': total_volume,
		'leaderboard': leaderboard.slice(0, 20)
	})
})

// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));