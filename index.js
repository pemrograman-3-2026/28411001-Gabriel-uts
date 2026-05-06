import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import kategoriRoute from './routes/kategori.route.js'
import supplierRoute from './routes/supplier.route.js'
import carRoute from './routes/car.route.js'
import transactionRoute from './routes/transaction.route.js'
 
const app = express()
app.use(express.json())
app.use(cors())
 
app.get('/', (req, res) => res.send('🚗 Showroom Mobil API berjalan!'))
 
app.use('/auth', authRoute)
app.use('/kategori', kategoriRoute)
app.use('/supplier', supplierRoute)
app.use('/car', carRoute)
app.use('/transaction', transactionRoute)
 
app.listen(3000, () => console.log('Server jalan di http://localhost:3000'))