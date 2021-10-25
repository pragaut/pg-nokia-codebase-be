
var express = require('express');
var router = express.Router();
const util = require('../../util');
const working = require('../../controllers/tmc/working');

//#region Antenna Rotataion Details
router.get('/antennaRotationDetails', (req, res) => working.getAntennaRotataionDetails(req, res));
router.put('/antennaRotationDetails', (req, res) => working.saveAntennaRotationDetails(req, res));
router.post('/antennaRotationDetails', (req, res) => working.saveAntennaRotationDetails(req, res));

//#endregion
//#region Device Location Details

router.get('/deviceLocationDetails', (req, res) => working.getDeviceLocationDetails(req, res));

//#endregion
//#region media Details Details

router.get('/mediaDetails', (req, res) => working.getMediaDetails(req, res));
router.put('/mediaDetails', (req, res) => working.saveMediaDetails(req, res));
router.post('/mediaDetails', (req, res) => working.saveMediaDetails(req, res));
router.delete('/mediaDetails', (req, res) => working.deleteMediaDetails(req, res));
router.post('/mediaDetails/multiplefiles', (req, res) => working.saveMultipleMediaDetails(req, res));

//#endregion

module.exports = router;