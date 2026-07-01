import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
 
export const register = async (req, res) => {
    const { username, password, no_telp } = req.body
 
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }
 
    const userExists = await prisma.user.findUnique({ where: { username } })
    if (userExists) return res.status(400).json({ message: 'Username sudah digunakan!' })
 
    const hashPassword = await bcrypt.hash(password, 10)
 
    const user = await prisma.user.create({
        data: { username, password: hashPassword, no_telp, role: 'user' }
    })
 
    return res.status(201).json({
        message: 'Registrasi berhasil!',
        data: { id_user: user.id, username: user.username, no_telp: user.no_telp, role: user.role }
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
 
        const userData = JSON.stringify({ 
        username: user.username, 
        role: user.role, 
        no_telp: user.no_telp 
    });


        res.cookie("user", userData, {
        httpOnly: false, 
        secure: false, 
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000 
    });


    return res.json({
        message: 'Login berhasil!',
        data: { id_user: user.id, username: user.username, no_telp: user.no_telp, role: user.role }
    })
}