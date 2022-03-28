const db = require('../utils/database')
// This module returns a class, so we have to use Pascal naming convention.
const Joi = require('joi')

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
      res.status(500)
      res.json({ error: 'Unexpected Error (server error)' })
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
      res.json({ error: 'Unexpected Error (server error)' })
    })
}

function addPet (req, res) {
  /**
  to use joi first we need to define a schema,
  this schema will define the shape of our object.
 */
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().integer().min(1).max(30).required(),
    type: Joi.string().min(3).required(),
    breed: Joi.string().min(3).required(),
    microchip: Joi.boolean().required()
  })

  /**
  The value is validated against the defined schema,
  this validate method will return an object that has 2 props (error & value)
  only one of these can have a value and the other one will be undefined,
  in case we got an error the value prop will be undefined, otherwise value prop will be undefined.
  */
  const { error, value } = schema.validate(req.body)
  if (error) {
    res.status(400)
    res.json({ error: error.details[0].message })
    return
  }
  const dbData = `INSERT INTO pets
  (name, age, type, breed, microchip)
  VALUES($1, $2, $3, $4, $5)
  RETURNING *`
  const { name, age, type, breed, microchip } = value
  const queryValues = [name, age, type, breed, microchip]

  db.query(dbData, queryValues)
    .then(dbResult => {
      res.json({ pet: dbResult.rows[0] })
    })
    .catch(err => {
      res.status(500)
      res.json({ error: 'Unexpected Error (server error)' })
    })
}

function replacePet (req, res) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().integer().min(1).max(30).required(),
    type: Joi.string().min(3).required(),
    breed: Joi.string().min(3).required(),
    microchip: Joi.boolean().required()
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    res.status(400)
    res.json({ error: error.details[0].message })
    return
  }
  const dbQuery = `
  UPDATE pets 
  SET name = $1, age = $2, type = $3, breed = $4, microchip = $5 
  WHERE id = $6
  RETURNING *`
  const { name, age, type, breed, microchip } = value
  const id = req.params.id
  const queryValues = [name, age, type, breed, microchip, id]

  db.query(dbQuery, queryValues)
    .then(dbResult => {
      res.json({ updatedPet: dbResult.rows[0] })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500)
      res.json({ error: 'Unexpected Error (server error)' })
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
      res.status(500)
      res.json({ error: 'Unexpected Error (server error)' })
    })
}

function updatePet (req, res) {
  const schema = Joi.object({
    name: Joi.string().min(3),
    age: Joi.number().integer().min(1).max(30),
    type: Joi.string().min(3),
    breed: Joi.string().min(3),
    microchip: Joi.boolean()
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    res.status(400)
    res.json({ error: error.details[0].message })
    return
  }
  let updatedQuery = ``, count = 1
  const queryValues = []
  const max = Object.keys(value).length
  for (let key in value) {
    updatedQuery += `${key} = $${count}`
    if (max > count) updatedQuery += `,`
    count++
    queryValues.push(value[key])
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
      res.status(500)
      res.json({ error: 'Unexpected Error (server error)' })
    })
}

function getCol (req, res) {
  const dbQuery = `
  SELECT DISTINCT breed FROM pets
  WHERE type = $1`
  const queryValues = [req.query.type]
  db.query(dbQuery, queryValues)
    .then(dbresult => {
      res.json({ breeds: dbresult.rows })
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      res.json({ error: 'Unexpected Error (server error)' })
    })
}


module.exports = {
  getPets,
  getSinglePet,
  addPet,
  replacePet,
  removePet,
  updatePet,
  getCol
}