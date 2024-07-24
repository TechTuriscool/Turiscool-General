import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, comprobarSiMailsSeparadosPorComa, unsuspendUsers } from '../controllers/unsuspend-controller.js';


const router = Router();
const CLIENT_ID = "62b182eea31d8d9863079f42";
const CLIENT_SECRET = "2NiYR9Qkvc1rwof3oHkPE4KvCK65A0IeJjTXaZS9xM42G6PHFW";
const API_URL = "https://academy.turiscool.com/admin/api/";
const TOKEN = "Tgm4Xx76myQrEwcxFrz63iFKUhCzGxWb1Z4sXr0b";

let emailsVerified = [];

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Ruta para subir archivos
router.post('/upload', async (req, res) => {
    console.log('Subiendo archivo...');
    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;

    const filePath = path.join(__dirname, 'uploads', file.name);
    console.log(filePath);

    try {
        await file.mv(filePath);
        emailsVerified = await readFile(filePath);
        console.log('Emails verificados: ', emailsVerified);
        res.send('File uploaded!');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Ruta para desbloquear usuarios
router.post('/', (req, res) => {
    const mails = req.body.mails;

    let newEmails = [];

    newEmails = comprobarSiMailsSeparadosPorComa(mails);

    if (newEmails) {
        for (let i = 0; i < newEmails.length; i++) {
            if (!emailsVerified.includes(newEmails[i])) {
                emailsVerified.push(newEmails[i]);
            }
        }  
    }


    unsuspendUsers(emailsVerified)
        .then(() => {
            console.log('Usuarios desbloqueados!');
            emailsVerified = [];
            res.send('Users unsuspended!');
        })
        .catch(err => res.status(500).send(err));
});

export default router;