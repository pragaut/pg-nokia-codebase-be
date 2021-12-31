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
        let tmcData = req.body;
        console.log("tmc req data : ", tmcData);
        if (util.missingRequiredFields('towerMonitoringDetails', tmcData, res) === '') {
            //const result = await dal.saveData(db.tmcData, tmcData, undefined.req.user.id);

            let result = undefined;
            let towerMonitoringSubDetailId = dal.uuid(db.towerMonitoringSubDetails.name);
            let deviceBatteryStatusDetailId = dal.uuid(db.deviceBatteryStatusDetails.name);

            await db.sequelize.query('call asp_nk_save_tower_monitoring_details(:p_tower_monitoring_sub_detail_id,:p_device_battery_status_detail_id,:p_mac_address,:p_clamp_status,:p_is_clamp1_connected,:p_clamp1_status,:p_is_clamp2_connected,:p_clamp2_status,:p_sea_level_height,:p_main_device_battery,:p_child1_device_battery,:p_child2_device_battery,:p_child3_device_battery,:p_dataTime,:p_created_by)', {
                replacements: {
                    p_tower_monitoring_sub_detail_id: towerMonitoringSubDetailId,
                    p_device_battery_status_detail_id: deviceBatteryStatusDetailId,
                    p_mac_address: tmcData.macAddress ? tmcData.macAddress : '',
                    p_clamp_status: tmcData.clampStatus ? tmcData.clampStatus : '',
                    p_is_clamp1_connected: tmcData.isClamp1Connected,
                    p_clamp1_status: tmcData.clamp1Status ? tmcData.clamp1Status : '',
                    p_is_clamp2_connected: tmcData.isClamp2Connected,
                    p_clamp2_status: tmcData.clamp2Status ? tmcData.clamp2Status : '',
                    p_sea_level_height: tmcData.seaLevelheight ? tmcData.seaLevelheight : 0,
                    p_main_device_battery: tmcData.mainDeviceBattery ? tmcData.mainDeviceBattery : '',
                    p_child1_device_battery: tmcData.child1DeviceBattery ? tmcData.child1DeviceBattery : '',
                    p_child2_device_battery: tmcData.child2DeviceBattery ? tmcData.child2DeviceBattery : '',
                    p_child3_device_battery: tmcData.child3DeviceBattery ? tmcData.child3DeviceBattery : '',
                    p_dataTime: tmcData.dataTime ? tmcData.dataTime : new Date(),
                    p_created_by: tmcData.useId ? tmcData.useId : '',
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
        db.sequelize.query('call asp_nk_tower_notification_get_tower_notification_details(:p_tower_monitoring_detail_id, :p_alarm_type_id, :p_device_registration_detail_id, :p_is_Closed)',
            {
                replacements: {
                    p_tower_monitoring_detail_id: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
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
        let StatusUpdatedOn = new Date();
        let towerNotificationDetails = {
            id: TowerNotificationDetails.id,
            remarks: TowerNotificationDetails.remarks,
            isClosed: true,
            statusUpdatedBy: UserId,
            statusUpdatedOn: StatusUpdatedOn
        }

        //-----let primaryKey = 'org_modules_id';
        if (util.missingRequiredFields('TowerNotificationDetails', TowerNotificationDetails, res) === '') {
            //----- await dal.saveData(db.moduleMaster, moduleMaster, res, UserId, undefined, undefined, undefined, primaryKey);
            await dal.saveData(db.towerMonitoringNotificationDetails, towerNotificationDetails, res, UserId);
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

//#region Get Tower Active Status Details

const getTMCTowerActiveStatusDetails = async (req, res) => {
    console.log("getTMCTowerActiveStatusDetails : >>>>", "AA Gaya");
    try {
        db.sequelize.query('call asp_nk_tower_details_get_tower_status_details(:p_tower_id)',
            {
                replacements: {
                    p_tower_id: req.query.towerId ? req.query.towerId : ''
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'tower active status get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower active status details');
            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'tower active status details');
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
const getDeviceBatteryStatusLog = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_device_battery_get_device_battery_status_log_details(:p_TowerMonitoringDetailId, :p_DeviceRegistrationDetailId,:p_MacAddress)',
            {
                replacements: {
                    p_TowerMonitoringDetailId: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
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
const getTowerMonitoringDetails = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_tower_monitoring_details_get_tower_monitoring_details(:p_TowerMonitoringDetailId, :p_TowerMasterId, :p_RiggerEmployeeId,:p_DeviceRegistrationDetailId,:p_MacAddress, :p_UniqueId,:p_IsOnlyTodayDataRequired,:p_FromDate,:p_ToDate)',
            {
                replacements: {
                    p_TowerMonitoringDetailId: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
                    p_TowerMasterId: req.query.towerMasterId ? req.query.towerMasterId : '',
                    p_RiggerEmployeeId: req.query.riggerEmployeeId ? req.query.riggerEmployeeId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                    p_UniqueId: req.query.uniqueId ? req.query.uniqueId : '',
                    p_IsOnlyTodayDataRequired: req.query.isOnlyTodayDataRequired ? req.query.isOnlyTodayDataRequired : '0',
                    p_FromDate: req.query.fromDate && req.query.fromDate !== 'undefined' ? req.query.fromDate : null,
                    p_ToDate: req.query.toDate && req.query.toDate !== 'undefined' ? req.query.toDate : null,

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
        db.sequelize.query('call asp_nk_device_status_details_get_device_status_details(:p_DeviceStatusDetailId, :p_DeviceRegistrationDetailId, :p_MacAddress,:p_TowerMonitoringDetailId)',
            {
                replacements: {
                    p_DeviceStatusDetailId: req.query.deviceStatusDetailId ? req.query.deviceStatusDetailId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                    p_TowerMonitoringDetailId: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
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


//#region  API For Mobile Application

const getEmployeeTMCWorkingStatus = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_get_employee_tmc_working_status(:p_EmployeeMasterId, :p_Type)',
            {
                replacements: {
                    p_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : '',
                    p_Type: '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'employee status get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting employee status details');
            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'employee status details');
    }
};


const getTowerDetailsByOrgDetailsId = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_get_towerdetails_by_org_details_id_or_employee_id(:p_OrgDetailsId, :p_EmployeeMasterId)',
            {
                replacements: {
                    p_OrgDetailsId: req.query.orgDetailsId ? req.query.orgDetailsId : '',
                    p_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'tower master details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower master');
            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'tower master details');
    }
};


const getDeviceDetailsByOrgDetailsId = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_get_device_details_by_employee_id_or_org_details_id(:p_OrgDetailsId, :p_EmployeeMasterId)',
            {
                replacements: {
                    p_OrgDetailsId: req.query.orgDetailsId ? req.query.orgDetailsId : '',
                    p_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'device master details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting device master');
            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'device master details');
    }
};


const saveTMCAndRiggerDetails = async (req, res) => {
    try {
        let towerMonitoringDetails = req.body;
        console.log("------towerMonitoringDetails------", towerMonitoringDetails);
        if (util.missingRequiredFields('towerMonitoringDetails', towerMonitoringDetails, res) === '') {
            let result = undefined;
            let id = dal.uuid(db.towerMonitoringDetails.name);

            db.sequelize.query('call asp_nk_save_tmc_and_rigger_details(:p_TowerMonitoringDetailsId,:p_TowerId,:p_DeviceRegistrationDetailsId,:p_EmployeeMasterId,:p_YearId)', {
                replacements: {
                    p_TowerMonitoringDetailsId: id,
                    p_TowerId: towerMonitoringDetails.towerId ? towerMonitoringDetails.towerId : '',
                    p_DeviceRegistrationDetailsId: towerMonitoringDetails.deviceRegistrationDetailsId ? towerMonitoringDetails.deviceRegistrationDetailsId : '',
                    p_EmployeeMasterId: towerMonitoringDetails.employeeMasterId ? towerMonitoringDetails.employeeMasterId : '',
                    p_YearId: towerMonitoringDetails.yearId ? towerMonitoringDetails.yearId : '',
                }
            }).then(results => {
                console.log("------towerMonitoringDetails ---results------", results);
                result = results;
                responseHelper.success(res, codes.SUCCESS, result, 'TMC and rigger details saved successfully !!', id);
            }).catch(error => {
                console.log("------towerMonitoringDetails ---error------", error);
                responseHelper.error(res, error, codes.ERROR, 'Error in saving TMC and rigger details !!');
            })
        }
        else {
            responseHelper.error(res, 'some field missing', codes.ERROR, 'Error in saving TMC and rigger details !!');
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in saving TMC and rigger details !!');
    }
}

const outTMCAndRiggerDetails = async (req, res) => {
    try {
        let towerMonitoringDetails = req.body;
        let userId = req.query.userId ? req.query.userId : '-1';
        if (util.missingRequiredFields('towerMonitoringDetails', towerMonitoringDetails, res) === '') {
            let result = undefined;
            if (util.missingRequiredFields('towerMonitoringDetails', towerMonitoringDetails, res) === '') {
                result = await dal.saveData(db.towerMonitoringDetails, towerMonitoringDetails, undefined, userId);
            }
            if (result) {
                responseHelper.success(res, codes.SUCCESS, result, 'TMC and rigger out details saved successfully !!', '-1');
            }
            else {
                responseHelper.error(res, result, codes.ERROR, 'Error in out TMC and rigger details !!');
            }
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in out TMC and rigger details !!');
    }
}

const getTMCDataByEmployeeAndRoleMasterId = async (req, res) => {
    try {
        db.sequelize.query('call asp_nk_get_tmc_details_by_employee_and_role_id(:p_TowerMonitoringDetailId, :p_TowerMasterId, :p_EmployeeMasterId,:p_RoleMasterId,:p_DeviceRegistrationDetailId,:p_MacAddress, :p_UniqueId,:p_IsOnlyTodayDataRequired,:p_IsOnlyLiveTMCDataRequired,:p_FromDate,:p_ToDate)',
            {
                replacements: {
                    p_TowerMonitoringDetailId: req.query.towerMonitoringDetailId ? req.query.towerMonitoringDetailId : '',
                    p_TowerMasterId: req.query.towerMasterId ? req.query.towerMasterId : '',
                    p_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : '',
                    p_RoleMasterId: req.query.roleMasterId ? req.query.roleMasterId : '',
                    p_DeviceRegistrationDetailId: req.query.deviceRegistrationDetailId ? req.query.deviceRegistrationDetailId : '',
                    p_MacAddress: req.query.macAddress ? req.query.macAddress : '',
                    p_UniqueId: req.query.uniqueId ? req.query.uniqueId : '',
                    p_IsOnlyTodayDataRequired: req.query.isOnlyTodayDataRequired ? req.query.isOnlyTodayDataRequired : '0',
                    p_IsOnlyLiveTMCDataRequired: req.query.isOnlyLiveTMCDataRequired ? req.query.isOnlyLiveTMCDataRequired : '1',
                    p_FromDate: req.query.fromDate && req.query.fromDate !== 'undefined' ? req.query.fromDate : null,
                    p_ToDate: req.query.toDate && req.query.toDate !== 'undefined' ? req.query.toDate : null,
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
const _FindTMCUserAlreadyExistOrNot = async (id, towerMonitoringDetailId,employeeId) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('isActive', 1));
    where.push(util.constructWheresForSequelize('towerMonitoringDetailId', towerMonitoringDetailId));
    where.push(util.constructWheresForSequelize('employeeId', employeeId));

    const towerMonitoringUserDetails = await dal.getList({ model: db.towerMonitoringUserDetails, where, order: [['createdAt', 'desc']], include: false, });
    if (towerMonitoringUserDetails && towerMonitoringUserDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}


const saveTMCUserDetails = async (req, res) => {
    try {
        let towerMonitoringUserDetails = req.body;
        let userId = req.query.userId ? req.query.userId : '-1';
        let result = undefined;
        const PKID = towerMonitoringUserDetails && towerMonitoringUserDetails.id ? towerMonitoringUserDetails.id : undefined;
        const ChekAlreadyExist = await _FindTMCUserAlreadyExistOrNot(PKID, towerMonitoringUserDetails.towerMonitoringDetailId,towerMonitoringUserDetails.employeeId );
        let CodeMsg = 'this user already exist for this TMC';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        if (util.missingRequiredFields('towerMonitoringUserDetails', towerMonitoringUserDetails, res) === '') {
            result = await dal.saveData(db.towerMonitoringUserDetails, towerMonitoringUserDetails, undefined, userId);
        }
        if (result) {
            responseHelper.success(res, codes.SUCCESS, result, 'TMC user details saved successfully !!', '-1');
        }
        else {
            responseHelper.error(res, result, codes.ERROR, 'Error in saving TMS user details !!');
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in saving  TMC  user details !!');
    }
}
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
module.exports.getTMCTowerActiveStatusDetails = getTMCTowerActiveStatusDetails;

module.exports.getDeviceBatteryStatusLog = getDeviceBatteryStatusLog;
module.exports.getEmployeeTMCWorkingStatus = getEmployeeTMCWorkingStatus;
module.exports.getTowerDetailsByOrgDetailsId = getTowerDetailsByOrgDetailsId;
module.exports.getDeviceDetailsByOrgDetailsId = getDeviceDetailsByOrgDetailsId;
module.exports.saveTMCAndRiggerDetails = saveTMCAndRiggerDetails;
module.exports.outTMCAndRiggerDetails = outTMCAndRiggerDetails;
module.exports.getTMCDataByEmployeeAndRoleMasterId = getTMCDataByEmployeeAndRoleMasterId;
module.exports.saveTMCUserDetails = saveTMCUserDetails;

