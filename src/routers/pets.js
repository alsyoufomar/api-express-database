const { getPets, getSinglePet, addPet, replacePet, removePet, updatePet, getCol } = require('../controllers/petsController')
const express = require('express');
const petsRouter = express.Router()

petsRouter.get('/breeds', getCol)
petsRouter.get('/', getPets)
petsRouter.get('/:id', getSinglePet)
petsRouter.post('/', addPet)
petsRouter.put('/:id', replacePet)
petsRouter.delete('/:id', removePet)
petsRouter.patch('/:id', updatePet)

module.exports = petsRouter