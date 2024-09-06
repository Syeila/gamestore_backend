import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
        });
        res.json({msg: "Register Berhasil"});
    } catch (error){
      console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        // Mencari satu pengguna berdasarkan email yang diberikan dalam body request
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        // Jika pengguna tidak ditemukan, kembalikan respons dengan status 404 dan pesan "Email tidak ditemukan"
        if (!user) {
            return res.status(404).json({ msg: "Email tidak ditemukan" });
        }

        // Membandingkan password yang diberikan dengan password yang disimpan dalam database
        const match = await bcrypt.compare(req.body.password, user.password);
        
        // Jika password tidak cocok, kembalikan respons dengan status 400 dan pesan "Wrong Password"
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        // Mendapatkan id, nama, dan email dari pengguna yang ditemukan
        const userId = user.id; // Memperbaiki penamaan properti dari Id ke id
        const name = user.name;
        const email = user.email;

        // Membuat access token menggunakan JWT, dengan masa berlaku 20 detik
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });

        // Membuat refresh token menggunakan JWT, dengan masa berlaku 1 hari
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // Memperbarui refresh_token di database untuk pengguna yang sesuai
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        // Menyimpan refresh token dalam cookie dengan opsi httpOnly dan masa berlaku 1 hari
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 hari dalam milidetik
        });

        // Mengembalikan access token sebagai respons JSON
        res.json({ accessToken });
    } catch (error) {
        // Menangani kesalahan yang terjadi selama proses, log error dan kembalikan respons dengan status 500
        console.error(error); // Log error untuk debugging
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204); // Token tidak ada

        // Cari pengguna berdasarkan refresh token
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user[0]) return res.sendStatus(204); // Token tidak valid
        const userId = user[0].id;
        await Users.update({refresh_token: null}, {
            where:{
                id:userId
            }
        });
        res.clearCookie('refreshCookie');
        return res.sendStatus(200);
}