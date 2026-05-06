import { prisma } from '../lib/prisma.js'
 
export const getAll = async (req, res) => {
    const data = await prisma.car.findMany({
        include: { category: true, supplier: true }
    })
    return res.json({ message: 'OK', data })
}
 
export const getById = async (req, res) => {
    const data = await prisma.car.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { category: true, supplier: true }
    })
    if (!data) return res.status(404).json({ message: 'Mobil tidak ditemukan!' })
    return res.json({ message: 'OK', data })
}
 
export const getStokMenipis = async (req, res) => {
    const data = await prisma.car.findMany({
        where: { stock: { lte: 3 } },
        include: { category: true, supplier: true }
    })
    return res.json({ message: 'Stok menipis', data })
}
 
export const create = async (req, res) => {
    const { name, brand, price, year, color, stock, id_kategori, id_supplier } = req.body
 
    if (!name || !brand || !price || !year || !id_kategori || !id_supplier) {
        return res.status(400).json({ message: 'Field name, brand, price, year, id_kategori, id_supplier wajib diisi' })
    }
 
    const data = await prisma.car.create({
        data: {
            name, brand,
            price: parseInt(price),
            year: parseInt(year),
            color,
            stock: stock ? parseInt(stock) : 0,
            id_kategori: parseInt(id_kategori),
            id_supplier: parseInt(id_supplier)
        },
        include: { category: true, supplier: true }
    })
    return res.status(201).json({ message: 'Mobil berhasil ditambahkan!', data })
}
 
export const update = async (req, res) => {
    const { name, brand, price, year, color, stock, id_kategori, id_supplier } = req.body
 
    const data = await prisma.car.update({
        where: { id: parseInt(req.params.id) },
        data: { name, brand, price, year, color, stock, id_kategori, id_supplier }
    })
    return res.json({ message: 'Mobil berhasil diupdate!', data })
}
 
export const remove = async (req, res) => {
    await prisma.car.delete({ where: { id: parseInt(req.params.id) } })
    return res.json({ message: 'Mobil berhasil dihapus!' })
}