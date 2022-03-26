const express = require('express');
const petsRouter = express.Router()
const db = require('../utils/database')

petsRouter.get('/', (req, res) => {

  const dbData = 'SELECT * FROM pets'
  db.query(dbData)
    .then(dbres => {
      console.log(dbres)
      res.json({ data: dbres.rows })
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.json({ error: 'unexpected Error' })
    })
})

petsRouter.get('/:id', (req, res) => {
  const dbData = 'SELECT * FROM pets WHERE id = $1'
  const queryValues = [req.params.id]
  db.query(dbData, queryValues)
    .then(dbResult => {
      console.log(dbResult)
      if (dbResult.rowCount === 0) {
        res.status(500)
        res.json({ error: 'unexpected' })
      } else {
        res.json({ pet: dbResult.rows[0] })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      res.json({ error: 'unexpected error' })
    })
})

petsRouter.post('/', (req, res) => {
  const dbData = `INSERT INTO pets
(name, age, type, breed, microchip)
VALUES($1, $2, $3, $4, $5)
RETURNING *`
  const { name, age, type, breed, microchip } = req.body
  const queryValues = [name, age, type, breed, microchip]

  db.query(dbData, queryValues)
    .then(dbResult => {
      console.log(dbResult)
      res.json({ pet: dbResult.rows[0] })
    })
    .catch(err => {
      console.log('catched', err)
      res.status(404)
      res.json({ error: 'unexpected error' })
    })
})

module.exports = petsRouter