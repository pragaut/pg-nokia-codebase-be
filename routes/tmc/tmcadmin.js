
var express = require('express');
var router = express.Router();
const util = require('../../util');
const admin = require('../../controllers/tmc/admin');

//#region Notification  master
router.get('/notificationDetails', (req, res) => admin.getNotificationDetailsMaster(req, res));
router.put('/notificationDetails', (req, res) => admin.saveNotificationDetailsMaster(req, res));
router.post('/notificationDetails', (req, res) => admin.saveNotificationDetailsMaster(req, res));
router.delete('/notificationDetails', (req, res) => admin.deleteNotificationDetailsMaster(req, res));
//#endregion

//#region Escalation  matrix
router.get('/escalationmatrix', (req, res) => admin.getEscalationMatrixDetails(req, res));
router.put('/escalationmatrix', (req, res) => admin.saveEscalationMatrixDetails(req, res));
router.post('/escalationmatrix', (req, res) => admin.saveEscalationMatrixDetails(req, res));
router.delete('/escalationmatrix', (req, res) => admin.deleteEscalationMatrixDetails(req, res));
//#endregion

//#region Escalation  Duration
router.get('/escalationDuration', (req, res) => admin.getEscalationDurationDetails(req, res));
router.put('/escalationDuration', (req, res) => admin.saveEscalationDurationDetails(req, res));
router.post('/escalationDuration', (req, res) => admin.saveEscalationDurationDetails(req, res));
router.delete('/escalationDuration', (req, res) => admin.deleteEscalationDurationDetails(req, res));
//#endregion

//#region Escalation  Duration
router.get('/supportingDocumentMaster', (req, res) => admin.getSupportingDocumentMaster(req, res));
router.put('/supportingDocumentMaster', (req, res) => admin.saveSupportingDocumentMaster(req, res));
router.post('/supportingDocumentMaster', (req, res) => admin.saveSupportingDocumentMaster(req, res));
router.delete('/supportingDocumentMaster', (req, res) => admin.deleteSupportingDocumentMaster(req, res));
//#endregion

//#region Due Day Master
router.get('/dueDaysMaster', (req, res) => admin.getDueDaysMaster(req, res));
router.put('/dueDaysMaster', (req, res) => admin.saveDueDaysMaster(req, res));
router.post('/dueDaysMaster', (req, res) => admin.saveDueDaysMaster(req, res));
router.delete('/dueDaysMaster', (req, res) => admin.deleteDueDaysMaster(req, res));
router.get('/dueDaysMaster/getById', (req, res) => admin.getDueDaysMasterById(req, res));
//#endregion


//#region Section  Master
router.get('/sectionMaster', (req, res) => admin.getSectionMaster(req, res));
router.put('/sectionMaster', (req, res) => admin.saveSectionMaster(req, res));
router.post('/sectionMaster', (req, res) => admin.saveSectionMaster(req, res));
router.delete('/sectionMaster', (req, res) => admin.deleteSectionMaster(req, res)); 
//#endregion

//#region Sub Section  Master
router.get('/subSectionMaster', (req, res) => admin.getSubSectionMaster(req, res));
router.put('/subSectionMaster', (req, res) => admin.saveSubSectionMaster(req, res));
router.post('/subSectionMaster', (req, res) => admin.saveSubSectionMaster(req, res));
router.delete('/subSectionMaster', (req, res) => admin.deleteSubSectionMaster(req, res)); 
router.get('/subSectionMaster/getById', (req, res) => admin.getSubSectionMasterById(req, res));
//#endregion

//#region Scoring Rule  Master
router.get('/scoringRuleMaster', (req, res) => admin.getScoringRuleMaster(req, res));
router.put('/scoringRuleMaster', (req, res) => admin.saveScoringRuleMaster(req, res));
router.post('/scoringRuleMaster', (req, res) => admin.saveScoringRuleMaster(req, res));
router.delete('/scoringRuleMaster', (req, res) => admin.deleteScoringRuleMaster(req, res)); 
router.get('/scoringRuleMaster/getById', (req, res) => admin.getScoringRuleMasterById(req, res));
//#endregion

//#region  Audit Type Master
router.get('/auditType', (req, res) => admin.getAuditTypeMaster(req, res));
//#endregion

//#region  Audit Type Master
router.get('/auditFlow', (req, res) => admin.getAuditFlowMaster(req, res));
//#endregion

//#region Process Flow Master
router.get('/processFlowMaster', (req, res) => admin.getProcessFlowMaster(req, res));
router.put('/processFlowMaster', (req, res) => admin.saveProcessFlowMaster(req, res));
router.post('/processFlowMaster', (req, res) => admin.saveProcessFlowMaster(req, res));
router.delete('/processFlowMaster', (req, res) => admin.deleteProcessFlowMaster(req, res)); 
router.get('/processFlowMaster/getById', (req, res) => admin.getProcessFlowMasterById(req, res));
//#endregion


//#region Criticality Master
router.get('/criticalityMaster', (req, res) => admin.getCriticalityMaster(req, res));
router.put('/criticalityMaster', (req, res) => admin.saveCriticalityMaster(req, res));
router.post('/criticalityMaster', (req, res) => admin.saveCriticalityMaster(req, res));
router.delete('/criticalityMaster', (req, res) => admin.deleteCriticalityMaster(req, res)); 
//#endregion

//#region Audit Observation  Master
router.get('/auditObservationMaster', (req, res) => admin.getAuditObservationMaster(req, res));
router.put('/auditObservationMaster', (req, res) => admin.saveAuditObservationMaster(req, res));
router.post('/auditObservationMaster', (req, res) => admin.saveAuditObservationMaster(req, res));
router.delete('/auditObservationMaster', (req, res) => admin.deleteAuditObservationMaster(req, res)); 
//#endregion


//#region Audit Type Auditor Relation
router.get('/auditTypeAuditorRelation', (req, res) => admin.getAuditTypeAuditorRelationMaster(req, res));
router.put('/auditTypeAuditorRelation', (req, res) => admin.saveAuditTypeAuditorRelationMaster(req, res));
router.post('/auditTypeAuditorRelation', (req, res) => admin.saveAuditTypeAuditorRelationMaster(req, res));
router.delete('/auditTypeAuditorRelation', (req, res) => admin.deleteAuditTypeAuditorRelationMaster(req, res)); 
//#endregion

//#region Scope master
router.get('/scopeMaster', (req, res) => admin.getScopeMaster(req, res));
router.put('/scopeMaster', (req, res) => admin.saveScopeMaster(req, res));
router.post('/scopeMaster', (req, res) => admin.saveScopeMaster(req, res));
router.delete('/scopeMaster', (req, res) => admin.deleteScopeMaster(req, res)); 
//#endregion

//#region Process Flow Responsibility 
router.get('/processFlowResponsibilityMaster', (req, res) => admin.getProcessFlowResponsibilityMaster(req, res));
router.put('/processFlowResponsibilityMaster', (req, res) => admin.saveProcessFlowResponsibilityMaster(req, res));
router.post('/processFlowResponsibilityMaster', (req, res) => admin.saveProcessFlowResponsibilityMaster(req, res));
router.delete('/processFlowResponsibilityMaster', (req, res) => admin.deleteProcessFlowResponsibilityMaster(req, res)); 
//#endregion

//#region Tower Master
router.get('/towerMaster', (req, res) => admin.getTowerMaster(req, res));
router.put('/towerMaster', (req, res) => admin.saveTowerMaster(req, res));
router.post('/towerMaster', (req, res) => admin.saveTowerMaster(req, res));
router.delete('/towerMaster', (req, res) => admin.deleteTowerMaster(req, res));
//#endregion

//#region Tower Allotment Master
router.get('/towerAllotmentMaster', (req, res) => admin.getTowerAllotmentMaster(req, res));
router.put('/towerAllotmentMaster', (req, res) => admin.saveTowerAllotmentMaster(req, res));
router.post('/towerAllotmentMaster', (req, res) => admin.saveTowerAllotmentMaster(req, res));
router.delete('/towerAllotmentMaster', (req, res) => admin.deleteTowerAllotmentMaster(req, res));
//#endregion

//#region Tower Antennas Master
router.get('/towerAntennasMaster', (req, res) => admin.getTowerAntennasMaster(req, res));
router.put('/towerAntennasMaster', (req, res) => admin.saveTowerAntennasMaster(req, res));
router.post('/towerAntennasMaster', (req, res) => admin.saveTowerAntennasMaster(req, res));
router.delete('/towerAntennasMaster', (req, res) => admin.deleteTowerAntennasMaster(req, res));
//#endregion

//#region Device Registration Master
router.get('/deviceRegistrationMaster', (req, res) => admin.getDeviceRegistrationMaster(req, res));
router.put('/deviceRegistrationMaster', (req, res) => admin.saveDeviceRegistrationMaster(req, res));
router.post('/deviceRegistrationMaster', (req, res) => admin.saveDeviceRegistrationMaster(req, res));
router.delete('/deviceRegistrationMaster', (req, res) => admin.deleteDeviceRegistrationMaster(req, res));
//#endregion

module.exports = router;