import { Router } from 'express'
import { getAll, getByUser, getById, create, updateStatus } from '../controllers/transaction.controllers.js'
 
const router = Router()
 
router.get('/', getAll)
router.get('/user/:id_user', getByUser)   // harus sebelum /:id
router.get('/:id', getById)
router.post('/', create)
router.put('/:id', updateStatus)
 
export default router