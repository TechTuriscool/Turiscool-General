import { Console } from 'console';
import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Importar variables de entorno del env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_URL = process.env.API_URL;
const TOKEN = process.env.TOKEN;


let emailsVerified = [];

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funciones del backend
export async function readFile(filePath) {
    console.log('Leyendo archivo funcion readFile...');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return cleanData(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function cleanData(data) {
    const dataSplited = data.split('\n');
    const dataCleaned = dataSplited.map(item => item.split(','));
    dataCleaned.shift(); // Elimina la fila de encabezado

    let dataSpliced = [];
    dataCleaned.forEach(element => {
        element.splice(3, 1000); // Ajusta según la cantidad de columnas que necesites
        dataSpliced.push(element);
    });

    return obtainEmails(dataSpliced);
}

function obtainEmails(data) {
    let emails = data.map(item => item[2]);

    emails.forEach(email => {
        if (email) { // Validación adicional
            let slicedEmail = email.trim().replace(/"/g, '');
            if (!emailsVerified.includes(slicedEmail)) {
                emailsVerified.push(slicedEmail);
            }
        }
    });
    console.log("1" + emailsVerified);
    return emailsVerified;
}

export async function unsuspendUsers(emailsVerified) {
    const emails = emailsVerified;
    console.log('Desbloqueando usuarios...');
    try {
        console.log(emails);
        for (const email of emails) {
            const response = await fetch(`${API_URL}v2/users/${email}/unsuspend`, {
                method: 'PUT',
                headers: {
                    'Lw-Client': CLIENT_ID,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                }
            });
            
            const data = await response.json();
            console.log(data);
            console.log('Usuarios desbloqueados correctamente');
        }
    } catch (error) {
    }
}

export function comprobarSiMailsSeparadosPorComa(mails) {
    if (!mails) {
        console.log('No hay correos');
        return;
    }

    if (mails.includes(' ')) {
        console.log('Los correos no deben contener espacios');
        return;
    }

    let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let mailsSeparated = mails.split(',');

    for (let i = 0; i < mailsSeparated.length; i++) {
        let email = mailsSeparated[i].trim();
        if (!regexEmail.test(email)) {
            console.log('El correo no es válido');
        } else {
            if (!emailsVerified.includes(email)) {
                emailsVerified.push(email);
            }
        }
    }
    console.log(emailsVerified);
    return emailsVerified;
}