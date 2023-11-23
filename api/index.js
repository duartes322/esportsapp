const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Player = require('./models/Player');
const Match = require('./models/Match');
const Tournament = require('./models/Tournament');
const bcrypt = require('bcryptjs');
const app  = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');


const salt = bcrypt.genSaltSync(10);
const secret = 'asdfasd8798dsfadsfahsdgf786jasdf'

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://billy:2rGHt6meAs4eAtc1@cluster0.z3um9nq.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const {username,password,email,usertype} = req.body;
    try{
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password,salt), 
            email:bcrypt.hashSync(email,salt), 
            usertype});
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }  
});

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        //loggedin
        jwt.sign({username, usertype:userDoc.usertype, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
                usertype:userDoc.usertype,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, game, playerCount, content} = req.body;
        const registeredPlayers = [];
        const postDoc = await Post.create({
            title,
            summary,
            game,
            playerCount,
            registeredPlayers,
            content,
            cover: newPath,
            author:info.id,
        });
        res.json(postDoc);
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {id, title,summary,game,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor){
            return res.status(400).json('voce nao e o autor');
        }
        await postDoc.updateOne({
            title, 
            summary,
            game, 
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });

});

app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id)
        .populate('author', ['username'])
        .populate('registeredPlayers', ['username']);
    res.json(postDoc);
});

app.put('/post/:id', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
    const newUser = info.id;
    const {id} = req.params;
    const postDoc = await Post.findById(id);
    const registeredPlayers = postDoc.registeredPlayers;
    registeredPlayers.push(newUser);

    await postDoc.updateOne({
        registeredPlayers,
    });
    res.json(postDoc);
    })
});

app.post('/player', async (req,res) => {
	const {playerId, resultText, isWinner, playerStatus, playerName, tournamentId} = req.body;
    try{
        const playerDoc = await Player.create({
			id: playerId,
            tournamentId,
			resultText,
			isWinner,
			status: playerStatus,
			name: playerName});
            res.json(playerDoc);
        }catch(e){
            res.status(400).json(e);
        }
});

app.post('/match', async (req,res) => {
	const {matchId, matchName, nextMatchId, tournamentRoundText, startTime, matchState, participants, tournamentId} = req.body;
	try{
        const matchDoc = await Match.create({
			id: matchId,
            tournamentId,
			name: matchName,
			nextMatchId,
			tournamentRoundText,
			startTime,
			state: matchState,
			participants});
            console.log(participants);
            res.json(matchDoc);
    }catch(e){
        console.error(e);
        res.status(400).json(e);
    }

});

app.get('/match', async (req, res) => {
    const {tournamentId} = req.query;
    const matchDoc = await Match.find({tournamentId: tournamentId})
        .select('_id') // Select only the _id field
        .exec();
    res.json(matchDoc);
    /* console.log(matchDoc); */
});

app.post('/tournament', async (req,res) => {
    const {tournamentLog} = req.body;
    const tournamentArray = tournamentLog.map(item => item._id);
    console.log(tournamentLog);
    console.log(tournamentArray);
    console.log('teste');
    try{
        const tournamentDoc = await Tournament.create({
            matches: tournamentArray});
        res.json(tournamentDoc);
        console.log(tournamentDoc);
    } catch(e) {
        res.status(400).json(e);
    }  
});


app.listen(4000);
