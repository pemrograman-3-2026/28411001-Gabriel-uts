import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
 
export const register = async (req, res) => {
    const { username, password, role } = req.body
 
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }
 
    const userExists = await prisma.user.findUnique({ where: { username } })
    if (userExists) return res.status(400).json({ message: 'Username sudah digunakan!' })
 
    const hashPassword = await bcrypt.hash(password, 10)
 
    const user = await prisma.user.create({
        data: { username, password: hashPassword, role: role || 'customer' }
    })
 
    return res.status(201).json({
        message: 'Registrasi berhasil!',
        data: { id_user: user.id, username: user.username, role: user.role }
    })
}
 
export const login = async (req, res) => {
    const { username, password } = req.body
 
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }
 
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(401).json({ message: 'User tidak ditemukan!' })
 
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Password salah!' })
 
    return res.json({
        message: 'Login berhasil!',
        data: { id_user: user.id, username: user.username, role: user.role }
    })
}