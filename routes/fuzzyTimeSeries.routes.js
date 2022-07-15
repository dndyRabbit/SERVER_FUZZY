const router = require("express").Router();
const fuzzyTimeSeriesCtrl = require("../controllers/fuzzyTimeSeries.controller");

router.get("/get_interval_data", fuzzyTimeSeriesCtrl.getIntervalData);
router.get("/get_fuzzyset_data", fuzzyTimeSeriesCtrl.getFuzzysetData);
router.get("/get_fuzzifikasi_data", fuzzyTimeSeriesCtrl.getFuzzifikasiData);
router.get("/get_flr_data", fuzzyTimeSeriesCtrl.getFLR);
router.get("/get_flrg_data", fuzzyTimeSeriesCtrl.getFLRG);

module.exports = router;
