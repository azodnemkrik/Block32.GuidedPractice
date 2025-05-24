const express = require('express')
const app = express()

const init = () => {
  //2 Make a Connection
  //3 Define the Table
  //4 Send the SQL
  //1 Define a PORT & Listen
  const PORT = 3000
  app.listen(PORT, () => {
	console.log(`Listening to port ${PORT}`)
  })
}

init()