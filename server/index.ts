import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'


dotenv.config({path: __dirname + '/.env'})
import {passport} from './core/passport';
import './core/db'
import cors from 'cors';

const app = express()
const uploader = multer({
    dest: '../public/avatars'
})
app.use(passport.initialize())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
}))

app.get('/auth/github', passport.authenticate('github'));

app.post('/upload', uploader.single('photo'), (req,res) => {
    res.json(req.file)
});

app.get(
    '/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    (req, res) => {
        res.send(
            `<script>window.close();window.opener.postMessage(${JSON.stringify(req.user)}, 'http://localhost:3000');</script>`)
    });
app.listen(3001, () => {
    console.log('SERVER RUNNED')
})
