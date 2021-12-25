
var express = require('express');
var router = express.Router();
const util = require('../../util');
const working = require('../../controllers/nokia/working');
const workingTMC = require('../../controllers/nokia/tmc.working');

//#-------------region AISU----------------//

//#region Antenna Rotataion Details
router.get('/antennaRotationDetails', (req, res) => working.getAntennaRotataionDetails(req, res));
router.put('/antennaRotationDetails', (req, res) => working.saveAntennaRotationDetails(req, res));
router.post('/antennaRotationDetails', (req, res) => working.saveAntennaRotationDetails_FromBody(req, res));
router.post('/antennaRotationDetailsQS', (req, res) => working.saveAntennaRotationDetails_FromQuery(req, res));

//#endregion

//#region Antenna Rotataion Details

router.get('/antennaRotationDetailLogs', (req, res) => working.getAntennaRotataionDetailLogs(req, res));

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

//#endregion ----------region AISU end--------------------///


//#-------------region TMC start----------------//

//#region TMC Device Battery Details

router.post('/deviceBatteryDetails', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetails(req, res));
router.post('/deviceBatteryDetails', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetails(req, res));
router.post('/deviceBatteryDetailsP', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetailsP(req, res));
router.post('/deviceBatteryDetailsP', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetailsP(req, res));

//router.get('/deviceBatteryDetails', (req, res) => workingTMC.getAntennaRotataionDetails(req, res));
//router.put('/deviceBatteryDetails', (req, res) => workingTMC.saveAntennaRotationDetails(req, res));

//#endregion


//#endregion ----------region TMC end--------------------///


module.exports = router;