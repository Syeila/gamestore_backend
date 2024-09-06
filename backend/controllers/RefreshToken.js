import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401); // Token tidak ada

        // Cari pengguna berdasarkan refresh token
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user[0]) return res.sendStatus(403); // Token tidak valid

        // Verifikasi refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403); // Token tidak valid

            const userId = user[0].id; // Pastikan ini sesuai dengan nama kolom
            const name = user[0].name;
            const email = user[0].email;

            // Buat access token baru
            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s' // Perbaiki nama parameter
            });

            // Kirim access token sebagai respons
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500); // Kirim status 500 jika terjadi kesalahan server
    }
}
