const ItemRouteModule = require('express').Router();
const ItemModel = require('../model/ItemModel');
const UserModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




ItemRouteModule.get('/', (req, res) => {
    res.send('Item Page');
});

ItemRouteModule.post('/register', async (req, res) => {

    try {
        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const apikey = req.body.apikey;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {
            const IdExit = await UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: apikey });
            if (IdExit) {

                const itemVt = new ItemModel({
                    title: req.body.title,
                    content: req.body.content,
                    user: TokenCevap._id,
                    status: req.body.status
                });

                const savedItem = await itemVt.save();
                if (savedItem) {
                    res.send(savedItem);

                } else {
                    res.status(400).send("Error - Register Fail");
                }

            } else {

                res.status(400).send("Error - Register Fail");
            }
        } else {

            res.status(400).send("Error - Register Fail");
        }

    } catch (err) {

        res.status(500).send(err.message);

    }

});
ItemRouteModule.post('/list', async (req, res) => {

    try {
        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {

            const IdExit = UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.apikey });
            if (IdExit) {
                const itemveri = await ItemModel.find();

                res.json(itemveri);

            } else {

                res.status(404).send("Error");
            }

        } else {
            res.status(404).send("Error");
        }

    } catch (err) {
        res.status(500).send(err.message);

    }
});
ItemRouteModule.post('/single', async (req, res) => {

    try {
        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {

            const IdExit = UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.apikey });
            if (IdExit) {
                const itemveri = await ItemModel.findOne({ _id: req.body.id });

                res.json(itemveri);

            } else {

                res.status(404).send("Error");
            }

        } else {
            res.status(404).send("Error");
        }

    } catch (err) {
        res.status(500).send(err.message);

    }

});

ItemRouteModule.post('/update', async (req, res) => {

    try {

        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {

            const IdExit = UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.apikey });
            if (IdExit) {

                const ItemUpdate = await ItemModel.findByIdAndUpdate(
                    { _id: req.body._id },
                    {
                        $set:
                        {
                            title: req.body.title,
                            content: req.body.content,
                            user: TokenCevap._id,
                            status: req.body.status
                        }
                    });
                if (ItemUpdate) {
                    res.send("Tamamke");
                } else {
                    res.send("111hata");
                }


            } else {
                res.status(404).send("Error");
            }

        } else {

            res.status(404).send("Error");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }

});

ItemRouteModule.delete('/delete', async (req, res) => {

    try {
        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {

            const IdExit = UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.apikey });
            if (IdExit) {
                const itemveri = await ItemModel.remove({ _id: req.body.id });
                res.json(itemveri);

            } else {

                res.status(404).send("Error");
            }

        } else {
            res.status(404).send("Error");
        }

    } catch (err) {
        res.status(500).send(err.message);

    }
});

module.exports = ItemRouteModule;

