import { Router } from 'express'
import { getAll, getById, getStokMenipis, getStokHabis, create, update, remove } from '../controllers/car.controllers.js'

const router = Router()

router.get('/', getAll)
router.get('/stok-menipis', getStokMenipis)
router.get('/stok-habis', getStokHabis)
router.get('/:id', getById)
router.post('/create', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router