
var express = require('express');
var router = express.Router();
const util = require('../../util');
const working = require('../../controllers/nokia/working');
const workingTMC = require('../../controllers/nokia/tmc.working');

//#-------------region AISU start----------------//

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


//#---------------------region TMC start----------------//

//#region TMC Device Battery Details

router.post('/tmcDetails', (req, res) => workingTMC.saveTMCDetailsP(req, res));
router.post('/tmcDetails', (req, res) => workingTMC.saveTMCDetailsP(req, res));

router.post('/deviceBatteryDetails', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetails(req, res));
router.post('/deviceBatteryDetails', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetails(req, res));
router.post('/deviceBatteryDetailsP', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetailsP(req, res));
router.post('/deviceBatteryDetailsP', (req, res) => workingTMC.saveTMCDeviceBetteryStatusDetailsP(req, res));

//router.get('/deviceBatteryDetails', (req, res) => workingTMC.getAntennaRotataionDetails(req, res));
//router.put('/deviceBatteryDetails', (req, res) => workingTMC.saveAntennaRotationDetails(req, res));

//#endregion

//#region TMC Device Location Details

router.post('/deviceLocationDetails', (req, res) => workingTMC.saveTMCDeviceLocationDetails(req, res));
router.post('/deviceLocationDetails', (req, res) => workingTMC.saveTMCDeviceLocationDetails(req, res));

//#endregion

//#region TMC Device Network Connectivity Status Details

router.post('/deviceNetworkConnectivityStatusDetails', (req, res) => workingTMC.saveTMCDeviceNetworkConnectivityStatusDetails(req, res));
router.post('/deviceNetworkConnectivityStatusDetails', (req, res) => workingTMC.saveTMCDeviceNetworkConnectivityStatusDetails(req, res));

//#endregion

//#region TMC Tower Monitoring Details

router.get('/deviceBatteryStatus', (req, res) => workingTMC.getDeviceBatteryStatus(req, res));
router.get('/towerMonitoringDetails', (req, res) => workingTMC.getTowerMonitoringDetails(req, res));
router.get('/deviceStatusDetails', (req, res) => workingTMC.getDeviceStatusDetails(req, res));
router.get('/networkConnectivityStatuDetails', (req, res) => workingTMC.getNetworkConnectivityStatuDetails(req, res));
router.get('/towerMonitoringSubDetails', (req, res) => workingTMC.getTowerMonitoringSubDetails(req, res));
router.get('/deviceBatteryStatusLog', (req, res) => workingTMC.getDeviceBatteryStatusLog(req, res));

//#region  TMC Device Mapping Details
router.get('/deviceMappingDetails', (req, res) => workingTMC.getTMCDeviceMappingDetails(req, res));
//#endregion

//#region  Tower Notification Details
router.get('/towerNotificationDetails', (req, res) => workingTMC.getTMCTowerNotificationDetails(req, res));
router.put('/towerNotificationDetails', (req, res) => workingTMC.updateTMCTowerNotificationDetails(req, res));
//#endregion

//#region Tower Active Status Details
router.get('/towerActiveStatusDetails', (req, res) => workingTMC.getTMCTowerActiveStatusDetails(req, res));
//#endregion

//#endregion ----------region TMC end--------------------///

//#region  TMC API Login
router.get('/employeeTMCWorkingStatus', (req, res) => workingTMC.getEmployeeTMCWorkingStatus(req, res));
router.get('/towerDetailsByOrgDetailsId', (req, res) => workingTMC.getTowerDetailsByOrgDetailsId(req, res));
router.get('/deviceDetailsByOrgDetailsId', (req, res) => workingTMC.getDeviceDetailsByOrgDetailsId(req, res));
router.post('/saveTMCAndRiggerDetails', (req, res) => workingTMC.saveTMCAndRiggerDetails(req, res));
//#endregion

module.exports = router;