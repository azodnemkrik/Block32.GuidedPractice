const express = require("express");
const app = express();
const pg = require("pg");
const client = new pg.Client("postgres://localhost/the_acme_notes_db");

app.use(express.json())
app.use(require('morgan')('dev'))


// CREATE:
app.post('/api/notes' , async (req,res,next) => {
	try {
		const SQL =`
			INSERT INTO notes (txt) VALUES ($1)
			RETURNING *;
		`
		const response = await client.query(SQL , [req.body.txt])
		res.send(response.rows[0])
	} catch (error) {
		next(error)
	}
})

// READ:
app.get('/api/notes' , async (req,res,next) => {
	try {
		const SQL =`
			SELECT *
			FROM notes
			ORDER BY created_at DESC;
		`
		const response = await client.query(SQL)
		res.send(response.rows)
	} catch (error) {
		next(error)
	}
})

app.get('/api/notes/:id' , async (req,res,next) => {
	try {
		const SQL =`
			SELECT *
			FROM notes
			WHERE id = $1
		`
		const response = await client.query(SQL , [req.params.id])
		console.log("!!-", response.rows)
		res.send(response.rows)
	} catch (error) {
		next(error)
	}
})

// UPDATE:
app.put('/api/notes/:id' , async (req,res,next) => {
	try {
		const SQL =`
			UPDATE notes
			SET txt=$1, ranking=$2, updated_at=now()
			WHERE id=$3
			RETURNING *;
		`
		const response = await client.query(SQL , [req.body.txt, req.body.ranking, req.params.id])
		res.send(response.rows[0])
	} catch (error) {
		next(error)
	}
})

// DELETE:
app.delete('/api/notes/:id' , async (req,res,next) => {
	try {
		const SQL =`
			DELETE FROM notes
			WHERE id=$1
		`
		const response = await client.query(SQL, [req.params.id])
		res.sendStatus(204)
	} catch (error) {
		next(error)
	}
})



const init = async () => {
	//2 Make a Connection
	await client.connect();
	console.log("Success! Connected to db!");

	//3 Define the Table
	let SQL = `
	DROP TABLE IF EXISTS notes;
	CREATE TABLE notes(
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT now(),
		updated_at TIMESTAMP DEFAULT now(),
		ranking INTEGER DEFAULT 3 NOT NULL,
		txt VARCHAR(255) NOT NULL
	);
  `;
	await client.query(SQL);
	console.log("Success! Table created!");

	SQL = `
		INSERT INTO notes (txt , ranking) VALUES ('Return Package' , 5);
		INSERT INTO notes (txt , ranking) VALUES ('Build Lego Set' , 1);
		INSERT INTO notes (txt) VALUES ('Eat Lunch');
  `
	await client.query(SQL);
	console.log("Success! Data seeded!");



	//4 Send the SQL
	//1 Define a PORT & Listen
	const PORT = 3000;
	app.listen(PORT, () => {
		console.log(`Listening to port ${PORT}`);
	});
};

init();
