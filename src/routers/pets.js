const express = require('express');
const petsRouter = express.Router()
const db = require('../utils/database')

petsRouter.get('/', (req, res) => {

  const per_page = req.query.per_page === undefined ? 20 :
    req.query.per_page < 10 ? req.query.per_page = 10 : req.query.per_page
  const page = req.query.page === undefined ? 1 :
    req.query.page < 1 ? req.query.page = 0 : (req.query.page - 1) * per_page

  const dbData = `SELECT * FROM pets LIMIT ${per_page} OFFSET ${page}`
  db.query(dbData)
    .then(dbres => {
      res.json({ data: dbres.rows })
    })
    .catch(err => {
      res.status(404)
      res.json({ error: 'unexpected Error' })
    })
})

petsRouter.get('/:id', (req, res) => {
  const dbData = 'SELECT * FROM pets WHERE id = $1'
  const queryValues = [req.params.id]
  db.query(dbData, queryValues)
    .then(dbResult => {
      if (dbResult.rowCount === 0) {
        res.status(500)
        res.json({ error: 'unexpected' })
      } else {
        res.json({ pet: dbResult.rows[0] })
      }
    })
    .catch(err => {
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
      res.json({ pet: dbResult.rows[0] })
    })
    .catch(err => {
      res.status(404)
      res.json({ error: 'unexpected error' })
    })
})

module.exports = petsRouter