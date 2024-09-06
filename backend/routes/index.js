import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUsers, Register, Login, Logout } from '../controllers/Users.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import upload from '../middleware/MulterConfig.js';
import { GetGames, AddGame, findGameById, EditGame, DeleteGame} from '../controllers/admin/GamesController.js';

const router = express.Router();
// Dapatkan __dirname dengan import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Menyajikan file statis dari folder 'uploads'
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

router.get('/game', GetGames);
router.post('/game/create', upload.single('photo'), AddGame);
router.get('/game/edit/:id', findGameById);
router.put('/game/edit/:id', upload.single('photo'), EditGame);
router.delete('/game/delete/:id', DeleteGame);

export default router;
