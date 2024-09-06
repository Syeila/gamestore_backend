import Games from '../../models/GamesModel.js';

export const GetGames = async(req, res) => {
    try {
        const games = await Games.findAll({
            attributes: ['id', 'title', 'price', 'desc', 'photo'] // Sesuaikan dengan kolom di tabel Games
        });
        res.json(games);
    } catch (error) {
        console.log(error);
    }
}

export const AddGame = async (req, res) => {
    const { title, price, desc } = req.body;
    const photo = req.file ? req.file.filename : null; // Ambil nama file dari Multer

    try {
        // Insert data ke tabel Games
        const newGame = await Games.create({
            title: title,
            price: price,
            desc: desc,
            photo: photo // Simpan nama file ke database
        });

        res.status(201).json({
            message: 'Game successfully added',
            game: newGame
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add game',
            error: error.message
        });
    }
};

export const findGameById = async (req, res) => {
    const { id } = req.params;  // Ambil id dari parameter URL

    try {
        // Cari game berdasarkan id
        const game = await Games.findByPk(id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Kembalikan data game yang ditemukan
        res.status(200).json({
            message: 'Game found',
            game: game
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to find game',
            error: error.message
        });
    }
};

export const EditGame = async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    
    const { id } = req.params;  // Ambil id dari parameter URL
    const { title, price, desc } = req.body;
    const photo = req.file ? req.file.filename : null;  // Cek apakah ada file foto baru yang di-upload

    try {
        // Cari game berdasarkan id
        const game = await Games.findByPk(id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Validasi data yang diterima
        game.title = title || game.title;  // Gunakan nilai default jika tidak ada
        game.price = price ? parseFloat(price) : game.price;  // Pastikan price diubah menjadi float, gunakan nilai default jika tidak ada
        game.desc = desc || game.desc;
        game.photo = photo || game.photo;  // Gunakan nilai default jika tidak ada

        // Simpan perubahan
        await game.save();

        // Kirim respons dengan data yang diperbarui
        res.status(200).json({
            message: 'Game successfully updated',
            game: game
        });
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({
            message: 'Failed to update game',
            error: error.message
        });
    }
};


export const DeleteGame = async (req, res) => {
    const { id } = req.params;  // Ambil id dari parameter URL

    try {
        // Cari game berdasarkan id
        const game = await Games.findByPk(id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Hapus game dari database
        await game.destroy();

        res.status(200).json({
            message: 'Game successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete game',
            error: error.message
        });
    }
};

