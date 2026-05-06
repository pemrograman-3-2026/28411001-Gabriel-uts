import { prisma } from '../lib/prisma.js'
 
export const getAll = async (req, res) => {
    const data = await prisma.kategori.findMany()
    return res.json({ message: 'OK', data })
}
 
export const create = async (req, res) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Name wajib diisi' })
 
    const data = await prisma.kategori.create({ data: { name } })
    return res.status(201).json({ message: 'Kategori ditambahkan!', data })
}
 
export const remove = async (req, res) => {
    await prisma.kategori.delete({ where: { id: parseInt(req.params.id) } })
    return res.json({ message: 'Kategori dihapus!' })
}