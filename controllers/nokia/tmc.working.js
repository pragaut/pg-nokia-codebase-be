const { db } = require('../../models');
const dal = require('../../dal');
const Op = require('sequelize').Op;
const util = require('../../util');
const responseHelper = require('../../util/response.helper');
const config = require('../../config').config;
const encryptionHelper = require('../../util/encryption.helper');
const codes = require('../../util/codes').codes;
const emailService = require('../../util/email');
const { json } = require('express');


const saveTMCDetailsP = async (req, res) => {
    try {
        let deviceBatteryDetails = req.body;
        console.log("deviceBatteryDetails : ", deviceBatteryDetails);
        if (util.missingRequiredFields('deviceBatteryDetails', deviceBatteryDetails, res) === '') {
            //const result = await dal.saveData(db.deviceBatteryDetails, deviceBatteryDetails, undefined.req.user.id);

            let result = undefined;
            let id = dal.uuid(db.deviceBatteryStatusDetails.name);

            db.sequelize.query('call asp_nk_save_device_battery_status_details(:p_device_battery_status_detail_id,:p_mac_address,:p_main_device_battery,:p_child1_device_battery,:p_child2_device_battery,:p_child3_device_battery,:p_created_by)', {
                replacements: {
                    p_device_battery_status_detail_id: id,
                    p_mac_address: req.macAddress ? req.macAddress : '',
                    p_main_device_battery: req.mainDeviceBattery ? req.mainDeviceBattery : '',
                    p_child1_device_battery: req.child1DeviceBattery ? req.child1DeviceBattery : '',
                    p_child2_device_battery: req.child2DeviceBattery ? req.child2DeviceBattery : '',
                    p_child3_device_battery: req.child3DeviceBattery ? req.child3DeviceBattery : '',
                    p_created_by: req.useId ? req.useId : '',
                }
            }).then(results => {
                console.log("saveTMCDetailsP results : ", results);
                result = results;
            }).catch(error => {
                console.log("saveTMCDetailsP error : ", error);
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
        console.log("saveTMCDetailsP error 2 : ", error);
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving device battery details !!');
    }
}

const saveTMCDeviceBetteryStatusDetails = async (req, res) => {
    try {
        let deviceBatteryDetails = req.body;
        if (util.missingRequiredFields('deviceBatteryDetails', deviceBatteryDetails, res) === '') {
            const result = await dal.saveData(db.deviceBatteryStatusDetails, deviceBatteryDetails, undefined.req.user.id);
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

const saveTMCDeviceBetteryStatusDetailsP = async (req, res) => {
    try {
        let deviceBatteryDetails = req.body;
        if (util.missingRequiredFields('deviceBatteryDetails', deviceBatteryDetails, res) === '') {
            //const result = await dal.saveData(db.deviceBatteryDetails, deviceBatteryDetails, undefined.req.user.id);

            let result = undefined;
            let id = dal.uuid(db.deviceBatteryStatusDetails.name);

            db.sequelize.query('call asp_nk_save_device_battery_status_details(:p_device_battery_status_detail_id,:p_mac_address,:main_device_battery,:p_child1_device_battery,:p_child2_device_battery,:p_child3_device_battery,:created_by)', {
                replacements: {
                    p_device_battery_status_detail_id: id,
                    p_mac_address: req.macAddress ? req.macAddress : '',
                    p_main_device_battery: req.mainDeviceBattery ? req.mainDeviceBattery : '',
                    p_child1_device_battery: req.child1DeviceBattery ? req.child1DeviceBattery : '',
                    p_child2_device_battery: req.child2DeviceBattery ? req.child2DeviceBattery : '',
                    p_child3_device_battery: req.child3DeviceBattery ? req.child3DeviceBattery : '',
                    p_created_by: req.useId ? req.useId : '',
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

const saveTMCDeviceLocationDetails = async (req, res) => {
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

const saveTMCDeviceNetworkConnectivityStatusDetails = async (req, res) => {
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

//#region  Device mapping details
const getTMCDeviceMappingDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_device_mapping_get_device_mapping_details(:p_device_registration_detail_id, :p_tower_id)',
            {
                replacements: {
                    p_device_registration_detail_id: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_tower_id: req.query.towerId ? req.query.towerId : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'device mapping details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting device mapping details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'device mapping details');
    }
};
//#endregion
//#region tower Notification Details

const getTMCTowerNotificationDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_tower_notification_get_tower_notification_details(:p_tower_monitoring_sub_detail_id, :p_alarm_type_id, :p_device_registration_detail_id, :p_is_Closed)',
            {
                replacements: {
                    p_tower_monitoring_sub_detail_id: req.query.towerMonitoringSubDetailId ? req.query.towerMonitoringSubDetailId : '',
                    p_alarm_type_id: req.query.alarmTypeId ? req.query.alarmTypeId : '',
                    p_device_registration_detail_id: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_is_Closed: req.query.isClosed ? req.query.isClosed : null
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'tower notification details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower notification details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'tower notification details');
    }
};

const updateTMCTowerNotificationDetails = async (req, res) => {
    try {
        const TowerNotificationDetails = req.body;
        console.log("Tower Notification Details : ", TowerNotificationDetails);
        const PKID = TowerNotificationDetails && TowerNotificationDetails.id ? TowerNotificationDetails.id : undefined;

        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        //-----let primaryKey = 'org_modules_id';
        if (util.missingRequiredFields('TowerNotificationDetails', TowerNotificationDetails, res) === '') {
            //----- await dal.saveData(db.moduleMaster, moduleMaster, res, UserId, undefined, undefined, undefined, primaryKey);
            await dal.saveData(db.towerMonitoringNotificationDetails, TowerNotificationDetails, res, UserId);
        }
        else {
            console.log("Backend Module master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Tower Notification Details Details');
    }
};

//#endregion

//#region  Tower Monitoring Details 
const getDeviceBatteryStatus = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('isActive', 1));
        where.push(util.constructWheresForSequelize('macAddress', req.query.macAddress));
        const result = await dal.getList({ model: db.deviceBatteryStatusDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined });
        responseHelper.success(res, codes.SUCCESS, result, 'device battery status data', '-1', result.length);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'device battery status details');
    }
};


const getTowerMonitoringDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_tower_monitoring_details_get_tower_monitoring_details(:p_TowerMonitoringDetailId, :p_TowerMasterId, :p_RiggerEmployeeId,:p_DeviceRegistrationDetailId,:p_MacAddress, :p_UniqueId,:p_IsOnlyTodayDataRequired)',
            {
                replacements: {
                    p_TowerMonitoringDetailId: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
                    p_TowerMasterId: req.query.towerMasterId ? req.query.towerMasterId : '',
                    p_RiggerEmployeeId: req.query.riggerEmployeeId ? req.query.riggerEmployeeId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                    p_UniqueId: req.query.uniqueId ? req.query.uniqueId : '',
                    p_IsOnlyTodayDataRequired: req.query.isOnlyTodayDataRequired ? req.query.isOnlyTodayDataRequired : '0'

                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'tower monitoring details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower monitoring details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting tower monitoring details');
    }
};
const getDeviceStatusDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_device_status_details_get_device_status_details(:p_DeviceStatusDetailId, :p_DeviceRegistrationDetailId, :p_MacAddress)',
            {
                replacements: {
                    p_DeviceStatusDetailId: req.query.deviceStatusDetailId ? req.query.deviceStatusDetailId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'device status details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting device status details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting device status details');
    }
};
const getNetworkConnectivityStatuDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_network_connectivity_get_network_connectivity_status(:p_NetworkConnectivityStatusId, :p_MacAddress, :p_DeviceRegistrationDetailId,:p_UniqueId)',
            {
                replacements: {
                    p_NetworkConnectivityStatusId: req.query.networkConnectivityStatusId ? req.query.networkConnectivityStatusId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_UniqueId: req.query.uniqueId ? req.query.uniqueId : ''
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'network connectivity status details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting network connectivity status ');

            });
    }
    catch (error) {

        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting network connectivity status ');
    }
};
const getTowerMonitoringSubDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_tower_monitoring_get_tower_monitoring_sub_details(:p_TowerMonitoringSubDetailId, :p_TowerMonitoringDetailId,  :p_DeviceRegistrationDetailId,:p_MacAddress, :p_IsOnlyTodayDataRequired)',
            {
                replacements: {
                    p_TowerMonitoringSubDetailId: req.query.towerMonitoringSubDetailId ? req.query.towerMonitoringSubDetailId : '',
                    p_TowerMonitoringDetailId: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                    p_IsOnlyTodayDataRequired: req.query.isOnlyTodayDataRequired ? req.query.isOnlyTodayDataRequired : '0'

                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'tower monitoring sub details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower monitoring sub details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting tower monitoring sub details');
    }
};
//#endregion




module.exports.saveTMCDetailsP = saveTMCDetailsP;
module.exports.saveTMCDeviceBetteryStatusDetails = saveTMCDeviceBetteryStatusDetails;
module.exports.saveTMCDeviceBetteryStatusDetailsP = saveTMCDeviceBetteryStatusDetailsP;

module.exports.saveTMCDeviceLocationDetails = saveTMCDeviceLocationDetails;

module.exports.saveTMCDeviceNetworkConnectivityStatusDetails = saveTMCDeviceNetworkConnectivityStatusDetails;

module.exports.getDeviceBatteryStatus = getDeviceBatteryStatus;
module.exports.getTowerMonitoringDetails = getTowerMonitoringDetails;
module.exports.getDeviceStatusDetails = getDeviceStatusDetails;
module.exports.getNetworkConnectivityStatuDetails = getNetworkConnectivityStatuDetails;
module.exports.getTowerMonitoringSubDetails = getTowerMonitoringSubDetails;
module.exports.getTMCDeviceMappingDetails = getTMCDeviceMappingDetails;
module.exports.getTMCTowerNotificationDetails = getTMCTowerNotificationDetails;
module.exports.updateTMCTowerNotificationDetails = updateTMCTowerNotificationDetails;
