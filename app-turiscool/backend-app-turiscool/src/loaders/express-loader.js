import express from 'express';
import cors from 'cors';
import router from '../routes/index.js';
import { morganMiddleware } from '../config/morgan.js';

export default function(server){   
    /* Config */
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true}));
    /* Static files */
    server.use(express.static('public'));
    /* Routes */
    server.use(router);
    /* Morgan */
    server.use(morganMiddleware);
}