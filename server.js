'use strict'
const express = require('express')
const cors = require('cors')

const axios = require('axios')

require('dotenv').config();
const PORT = process.env.PORT
const server = express()
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE, { useNewUrlParser: true, useUnifiedTopology: true });


const choclateSchema = new mongoose.Schema({
    name: String,
    email: String,
    img: String,
    id: String
});
const choclateStore = mongoose.model('choclatCole', choclateSchema);

server.get('/', getHandler)
server.get('/handlerData', getApiData)
server.post('/favortITem', favortHandler)
server.get('/getfavortITem', getfavortHandler)
server.delete('/deleteSelectItem/:id', deletfavoratHandler)
server.put('/updateSelectItem/:id', updatefavoratHandler)


function getHandler(req, res) {
    res.send("this server work")
}
//////////////////////////////get data3Api  http://localhost:3005/handlerData
function getApiData(res, req) {
    console.log("inside getApiData");
    const url = 'https://ltuc-asac-api.herokuapp.com/allChocolateData';
    axios.get(url).then(apiCont => {
        let choclateData = apiCont.data.map(choclateCons => {
            return new choclatedataHitServer(choclateCons)
        })
        res.send(choclateData)
    })
    console.log("getApidata");

}
//////////////////////////////store favortData in db
function favortHandler(req, res) {
    const { img, name, id } = req.body
    const email = req.query.email
    choclateStore.find({ id: id }, (error, dataChoclate) => {
        if (dataChoclate.length > 0) {
            res.send("already exist")
        } else {
            let choclateData = new choclateStore({
                img: img,
                name: name,
                id: id,
                email: email

            })
            choclateData.save()
            res.send(choclateData)
        }
    })
}
///////////////////////////function getfavortHandler
function getfavortHandler(req, res) {
    const email = req.query.email
    choclateStore.find({ email: email }, (error, chocItem) => {
        res.send(chocItem)
    })
}
///////////////////////////////////delet
function deletfavoratHandler(req, res) {
    const id = req.params.id
    const email = req.query.email
    choclateStore.remove({ _id: id }, (error, choclatItem) => {
        choclateStore.find({ email: email }, (error, choclateItem2) => {
            res.send(choclateItem2)
        })
    })

}
//////////////////////////////////////updatefavoratHandler
function updatefavoratHandler(req, res) {
    const { img, name } = req.body
    const id = req.params.id
    choclateStore.findOne({ _id: id }, (error, dataChoclat) => {
        if (dataChoclat === null) {
            res.send("not exist")
        } else {
            dataChoclat.img = img;
            dataChoclat.name = name;
            dataChoclat.save()
            res.send(dataChoclat)

        }
    })
}



class choclatedataHitServer {
    constructor(item) {
        this.name = item.name,
            this.img = item.img,
            this.id = item.id
    }
}


server.listen(PORT, () => {
    console.log("server listen perfectly",PORT);
})