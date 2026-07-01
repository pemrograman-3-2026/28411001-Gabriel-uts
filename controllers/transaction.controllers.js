import { prisma } from '../lib/prisma.js'
 
export const getAll = async (req, res) => {
    const data = await prisma.transaction.findMany({
        include: { user: true, items: { include: { car: true } } }
    })
    return res.json({ message: 'OK', data })
}
 
export const getByUser = async (req, res) => {
    try {
        console.log("PARAMS =", req.params)

        const data = await prisma.transaction.findMany({
            where: {
                id_user: parseInt(req.params.id_user)
            },
            include: {
                items: {
                    include: {
                        car: true
                    }
                }
            }
        })

        console.log("DATA =", data)

        return res.json({
            message: 'OK',
            data
        })

    } catch (err) {
        console.log("ERROR DETAIL =", err)

        return res.status(500).json({
            message: err.message
        })
    }
}
 
export const getById = async (req, res) => {
    const data = await prisma.transaction.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { user: true, items: { include: { car: true } } }
    })
    if (!data) return res.status(404).json({ message: 'Transaksi tidak ditemukan!' })
    return res.json({ message: 'OK', data })
}
 
export const create = async (req, res) => {
    const { id_user, items } = req.body
 
    if (!id_user || !items || items.length === 0) {
        return res.status(400).json({ message: 'id_user dan items wajib diisi' })
    }
 
    try {
        const itemsWithPrice = await Promise.all(items.map(async (item) => {
            const car = await prisma.car.findUnique({ where: { id: item.id_car } })
            if (!car) throw new Error(`Mobil id ${item.id_car} tidak ditemukan`)
            if (car.stock < item.quantity) throw new Error(`Stok ${car.name} tidak cukup`)
            return {
                id_car: item.id_car,
                quantity: item.quantity,
                price: car.price,
                subtotal: car.price * item.quantity
            }
        }))
 
        const totalPrice = itemsWithPrice.reduce((sum, i) => sum + i.subtotal, 0)
 
        const transaction = await prisma.transaction.create({
            data: {
                id_user,
                totalPrice,
                items: { create: itemsWithPrice }
            },
            include: { items: { include: { car: true } } }
        })
 
        await Promise.all(itemsWithPrice.map(item =>
            prisma.car.update({
                where: { id: item.id_car },
                data: { stock: { decrement: item.quantity } }
            })
        ))
 
        return res.status(201).json({ message: 'Transaksi berhasil!', data: transaction })
 
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
 
export const updateStatus = async (req, res) => {
    const { status } = req.body
    const validStatus = ['pending', 'success', 'dikirim', 'selesai', 'dibatalkan']
 
    if (!validStatus.includes(status)) {
        return res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatus.join(', ')}` })
    }
 
    const data = await prisma.transaction.update({
        where: { id: parseInt(req.params.id) },
        data: { status }
    })
    return res.json({ message: 'Status diupdate!', data })
}