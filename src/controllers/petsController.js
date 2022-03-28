const db = require('../utils/database')

function getPets (req, res) {
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
}

function getSinglePet (req, res) {
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
}

function addPet (req, res) {
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
}

function replacePet (req, res) {
  const dbQuery = `
  UPDATE pets 
  SET name = $1, age = $2, type = $3, breed = $4, microchip = $5 
  WHERE id = $6
  RETURNING *`
  const { name, age, type, breed, microchip } = req.body
  const id = req.params.id
  const queryValues = [name, age, type, breed, microchip, id]

  db.query(dbQuery, queryValues)
    .then(dbResult => {
      res.json({ updatedPet: dbResult.rows[0] })
    })
    .catch(err => {
      console.log(err.message)
      res.status(404)
      res.json({ error: 'unexpected error' })
    })
}

function removePet (req, res) {
  const dbQuery = `DELETE FROM pets WHERE id = $1 RETURNING *`
  const queryValues = [req.params.id]
  db.query(dbQuery, queryValues)
    .then(dbresult => {
      res.json({ deletedPet: dbresult.rows[0] })
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.json({ error: 'unexpected' })
    })
}

function updatePet (req, res) {
  let updatedQuery = ``, count = 1
  const queryValues = []
  const max = Object.keys(req.body).length
  for (let key in req.body) {
    updatedQuery += `${key} = $${count}`
    if (max > count) updatedQuery += `,`
    count++
    queryValues.push(req.body[key])
  }
  queryValues.push(req.params.id)
  const dbQuery = `
  UPDATE pets 
  SET ${updatedQuery}
  WHERE id = $${count}
  RETURNING *`

  db.query(dbQuery, queryValues)
    .then(dbresult => {
      res.json({ deletedPet: dbresult.rows[0] })
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.json({ error: 'unexpected final error' })
    })
}

module.exports = {
  getPets,
  getSinglePet,
  addPet,
  replacePet,
  removePet,
  updatePet
}