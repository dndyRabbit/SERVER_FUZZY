const router = require("express").Router();
const dataAktualCtrl = require('../controllers/dataAktual.controller')

router.get("/get_data_aktual", dataAktualCtrl.getDataAktual);

module.exports= router