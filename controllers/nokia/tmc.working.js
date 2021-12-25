const { db } = require('../../models');
const dal = require('../../dal');
const Op = require('sequelize').Op;
const util = require('../../util');
const responseHelper = require('../../util/response.helper');
const config = require('../../config').config;
const encryptionHelper = require('../../util/encryption.helper');
const codes = require('../../util/codes').codes;
const constants = require('../../util/constant');
const emailService = require('../../util/email');
const { json } = require('express');


const saveTMCDeviceBetteryStatusDetails = (req, res) => {
    try {
        let deviceBatteryDetails = req.body;
        if (util.missingRequiredFields('deviceBatteryDetails', deviceBatteryDetails, res) === '') {
            const result = await dal.saveData(db.deviceBatteryDetails, deviceBatteryDetails, undefined.req.user.id);
            if (result) {
                responseHelper.success(res, codes.success, result, 'Device battery details saved successfully !!', result.id);
            }
            else {
                responseHelper.error(res, result, codes.ERROR, 'Error in Saving device battery details !!');
            }
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving device battery details !!');
    }
}

const saveTMCDeviceBetteryStatusDetailsP = (req, res) => {
    try {
        let deviceBatteryDetails = req.body;
        if (util.missingRequiredFields('deviceBatteryDetails', deviceBatteryDetails, res) === '') {
            //const result = await dal.saveData(db.deviceBatteryDetails, deviceBatteryDetails, undefined.req.user.id);

            let result = undefined;
            let id = dal.uuid(db.deviceBatteryDetails.name);

            db.sequelize.query('call asp_nk_save_device_battery_status_details(:device_battery_status_detail_id,:mac_address,:main_device_battery,:child1_device_battery,:child2_device_battery,:child3_device_battery,:created_by)', {
                replacements: {
                    device_battery_status_detail_id: id,
                    mac_address: req.macAddress ? req.macAddress : '',
                    main_device_battery: req.mainDeviceBattery ? req.mainDeviceBattery : '',
                    child1_device_battery: req.child1DeviceBattery ? req.child1DeviceBattery : '',
                    child2_device_battery: req.child2DeviceBattery ? req.child2DeviceBattery : '',
                    child3_device_battery: req.child3DeviceBattery ? req.child3DeviceBattery : '',
                    created_by: req.useId ? req.useId : '',
                }
            }).then(results => {
                result = results;
            }).catch(error => {
                result = error;
            })
            if (result) {
                responseHelper.success(res, codes.success, result, 'Device battery details saved successfully !!', result.id);
            }
            else {
                responseHelper.error(res, result, codes.ERROR, 'Error in Saving device battery details !!');
            }
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving device battery details !!');
    }
}

const saveTMCDeviceLocationDetails = (req, res) => {
    try {
        let deviceLocationDetails = req.body;
        if (util.missingRequiredFields('deviceLocationDetails', deviceLocationDetails, res) === '') {
            const result = await dal.saveData(db.deviceLocationDetails, deviceLocationDetails, undefined.req.user.id);
            if (result) {
                responseHelper.success(res, codes.success, result, 'Device location details saved successfully !!', result.id);
            }
            else {
                responseHelper.error(res, result, codes.ERROR, 'Error in Saving device location details !!');
            }
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving device location details !!');
    }
}

const saveTMCDeviceNetworkConnectivityStatusDetails = (req, res) => {
    try {
        let deviceNetworkConnectivityStatusDetails = req.body;
        if (util.missingRequiredFields('deviceNetworkConnectivityStatusDetails', deviceNetworkConnectivityStatusDetails, res) === '') {
            const result = await dal.saveData(db.deviceNetworkConnectivityStatusDetails, deviceNetworkConnectivityStatusDetails, undefined.req.user.id);
            if (result) {
                responseHelper.success(res, codes.success, result, 'Device network connctivity details saved successfully !!', result.id);
            }
            else {
                responseHelper.error(res, result, codes.ERROR, 'Error in Saving device network connctivity details !!');
            }
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving device network connctivity details !!');
    }
}

module.exports.saveTMCDeviceBetteryStatusDetails = saveTMCDeviceBetteryStatusDetails;
module.exports.saveTMCDeviceBetteryStatusDetailsP = saveTMCDeviceBetteryStatusDetailsP;

module.exports.saveTMCDeviceLocationDetails = saveTMCDeviceLocationDetails;

module.exports.saveTMCDeviceNetworkConnectivityStatusDetails = saveTMCDeviceNetworkConnectivityStatusDetails;