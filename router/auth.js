const router = require('express').Router();
const UserModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { registerValidation, loginValidation, appValidation } = require('../validation');
const { exist } = require('joi');




router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {

        const gtoken = req.header('Authorization');
        const secret = req.body.secret;

        const TokenCevap = jwt.verify(gtoken, secret);

        const IdExit = await UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.myapikey });

        if (IdExit) {
            const emailExit = await UserModel.findOne({ email: req.body.email });
            if (!emailExit) {
                const AppExit = await UserModel.findOne({ apikey: req.body.apikey });
                if (!AppExit) {

                    const salt = await bcrypt.genSalt(10);
                    const hashPass = await bcrypt.hash(req.body.password, salt);

                    const Uservt = new UserModel({
                        email: req.body.email,
                        password: hashPass,
                        name: req.body.name,
                        apikey: req.body.apikey,
                        status: req.body.status
                    });
                    const savedUser = await Uservt.save();
                    if (savedUser) {
                        res.send(savedUser);

                    } else {
                        res.status(400).send("Error - Register Fail");
                    }
                } else {

                    res.status(404).send("Error - Mail Or Key Fail");
                }

            } else {
                res.status(404).send("Error - Mail Or Key Fail");
            }

        } else {
            res.status(404).send("Error - Token Fail");

        }

    } catch (err) {
        res.status(503).send(err.message);
    }

});


router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const email = req.body.email;
    const pass = req.body.password;
    const apikey = req.body.apikey;

    try {
        const cevap = await UserModel.findOne({ email: email }).and({ apikey: apikey });

        if (cevap) {

            const sifresorgu = await bcrypt.compare(pass, cevap.password);
            if (sifresorgu) {


                const token = jwt.sign(
                    { _id: cevap._id, email: cevap.email, myapikey: cevap.apikey },
                    process.env.TOKEN_SECRET);
                res.header('Content-Type', 'Application/json');
                res.header('auth-token', token).send(token);


            } else {

                res.status(400).send(' Giriş Hata');

            }
        } else {
            res.status(400).send('Sorgu Hata');

        }

    } catch (err) {
        res.status(500).send(err.message);
    }



});

router.post('/all', async (req, res) => {


    try {

        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {

            const IdExit = await UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.myapikey });

            if (IdExit) {
                const veri = await UserModel.find();
                res.json(veri);

            } else {
                res.status(400).send("Error App Fail");
            }

        } else {

            res.status(404).send("Error Fail");
        }

    } catch (err) {

        res.status(500).send("Error Token");

    }




});

router.post('/single', async (req, res) => {

    const { error } = appValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {

        const gtoken = req.header('Authorization');
        const secret = req.body.secret;
        const TokenCevap = jwt.verify(gtoken, secret);

        if (TokenCevap._id) {

            const IdExit = await UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.myapikey });

            if (IdExit) {
                const veri = await UserModel.findOne({ _id: req.body.id });
                res.json(veri);

            } else {
                res.status(400).send("Error App Fail");
            }

        } else {

            res.status(404).send("Error Fail");
        }

    } catch (err) {

        res.status(500).send("Error Token");

    }

});

router.post('/update', async (req, res) => {

    const gtoken = req.header('Authorization');
    const secret = req.body.secret;
    const myapikey = req.body.myapikey;

    const TokenCevap = jwt.verify(gtoken, secret);

    if (TokenCevap._id) {

        const IdExit = await UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: req.body.myapikey });
        if (IdExit) {
            const Emailspor = await UserModel.findOne({ _id: req.body._id }).and({ email: req.body.email });
            if (Emailspor) {
                const salt = await bcrypt.genSalt(10);
                const hashPass = await bcrypt.hash(req.body.password, salt);

                const LoginUpdate = await UserModel.findByIdAndUpdate(
                    { _id: req.body._id },
                    {
                        $set:
                        {
                            password: hashPass,
                            name: req.body.name,
                            apikey: req.body.apikey,
                            status: req.body.status
                        }
                    });
                if (LoginUpdate) {
                    res.send("Tamamke");
                } else {
                    res.send("111hata");
                }

            } else {

                const EmailExit = await UserModel.findOne({ email: req.body.email });
                if (!EmailExit) {

                    const salt = await bcrypt.genSalt(10);
                    const hashPass = await bcrypt.hash(req.body.password, salt);

                    const LoginUpdate = await UserModel.findByIdAndUpdate(
                        { _id: req.body._id },
                        {
                            $set:
                            {
                                email: req.body.email,
                                password: hashPass,
                                name: req.body.name,
                                apikey: req.body.apikey,
                                status: req.body.status
                            }
                        });
                    if (LoginUpdate) {
                        res.send("Tamamke");
                    } else {
                        res.send("111hata");
                    }

                } else {
                    res.send("E mail 11Hata");
                }

            }

        } else {

            res.send("hata");
        }

    } else {
        res.send("hata");

    }

});


router.delete('/delete', async (req, res) => {

    const id = req.body._id;
    const myapikey = req.body.apikey;

    const gtoken = req.header('Authorization');
    const secret = req.body.secret;
    const TokenCevap = jwt.verify(gtoken, secret);

    if (TokenCevap._id) {

        const IdExit = await UserModel.findOne({ _id: TokenCevap._id }).and({ apikey: myapikey });

        if (IdExit) {
            const veri = await UserModel.remove({ _id: id });
            res.json({ veri });

        } else {
            res.status(404).send('Hata');

        }

    } else {

        res.status(500).send('Hata');
    }

});

module.exports = router;