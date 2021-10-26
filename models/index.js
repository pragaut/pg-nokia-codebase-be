const Sequelize = require('sequelize');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const sequelize = new Sequelize(config.config.SEQUELIZE);

const db = {};

console.log('trying to establish link');

const authenticate = () => {
    const result = sequelize.authenticate();

    return result;
};

console.log('auth result: ', config.config.SEQUELIZE);


// authenticate();

// load the models

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });


// let's load the subdirectory models too
console.log('Processing for APP: ', process.env.APP);

if (process.env.APP === 'nokia') {

    if (process.env.APP === 'nokia') {

        fs
            .readdirSync(__dirname + '/nokia')
            .filter(function (file) {
                return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
            })
            .forEach(function (file) {
                var model = sequelize['import'](path.join(__dirname, 'nokia', file));
                db[model.name] = model;
            });
    }

    /** common models are loaded here */
    fs
        .readdirSync(__dirname + '/common')
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(function (file) {
            var model = sequelize['import'](path.join(__dirname, 'common', file));
            db[model.name] = model;
        });

}

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


// set up the relationship here

/*** model.belongsTo(anotherModel) ***/



if (process.env.APP === 'nokia') {

    /* reconciliation relationship start */
    if (process.env.APP === 'nokia') {
         db.towerMaster.belongsTo(db.organisationDetails, { as: 'orgName', foreignKey: 'orgDetailsId' });
         db.towerMaster.belongsTo(db.cityMaster, { as: 'cityName', foreignKey: 'cityId' });
         db.towerAllotmentMaster.belongsTo(db.towerMaster, { as: 'towerName', foreignKey: 'towerId' });
         db.towerAllotmentMaster.belongsTo(db.organisationDetails, { as: 'orgName', foreignKey: 'orgDetailsId' });
         db.towerAntennasMaster.belongsTo(db.towerMaster, { as: 'towerName', foreignKey: 'towerId' });
         db.deviceRegistrationMaster.belongsTo(db.organisationDetails, { as: 'orgName', foreignKey: 'orgDetailsId' });
        // db.mediaLogDetails.belongsTo(db.supportingDocumentMaster, { as: 'SupportingDocumentMaster', foreignKey: 'supportingDocumentMasterId' });
        // db.sectionMaster.belongsTo(db.auditType, { as: 'auditType', foreignKey: 'auditTypeId' });
        // db.subSectionMaster.belongsTo(db.sectionMaster, { as: 'section', foreignKey: 'sectionMasterId' });
        // db.scoringRuleMaster.belongsTo(db.sectionMaster, { as: 'section', foreignKey: 'sectionMasterid' });
        // db.scoringRuleMaster.belongsTo(db.criticalityMaster, { as: 'criticality', foreignKey: 'criticalityMasterId' });
        // db.scoringRuleMaster.belongsTo(db.auditObservationMaster, { as: 'auditObservation', foreignKey: 'observationMasterId' });
        // db.processFlowMaster.belongsTo(db.auditFlow, { as: 'auditFlow', foreignKey: 'auditFlowMasterId' });
        // db.processFlowMaster.belongsTo(db.processFlowMaster, { as: 'processFlow', foreignKey: 'sendBackProcessFlowMasterId' });

        // db.scopeMaster.belongsTo(db.sectionMaster, { as: 'section', foreignKey: 'sectionMasterId' });
        // db.scopeMaster.belongsTo(db.subSectionMaster, { as: 'subsection', foreignKey: 'subSectionMasterId' });
        // db.scopeMaster.belongsTo(db.criticalityMaster, { as: 'criticality', foreignKey: 'criticalityMasterId' });
        // db.scopeMaster.belongsTo(db.masterDetails, { as: 'auditMode', foreignKey: 'auditModeMasterId' });


        // db.auditObservationDetails.belongsTo(db.scopeMaster,{as :'scopeAuditobservation',foreignKey:'scopeMasterId'});
        //db.mediaDetails.belongsTo(db.scopeMaster,{as :'scoreMedia',foreignKey:'scopeMasterId'});

        // db.scopeMaster.hasOne(db.auditObservationDetails, { as: 'scopeAuditobservation', foreignKey: 'scopeMasterId' });
        // //db.auditObservationDetails.belongsTo(db.selfAuditPlanDetails,{as :'scopeAuditobservations',foreignKey:'auditPlanDetailsId'});

        // db.scopeMaster.hasMany(db.mediaDetails, { as: 'scoreMedia', foreignKey: 'scopeMasterId' });
        // //db.scopeMaster.hasOne(db.masterDetails,{as :'auditMode',foreignKey:'auditModeMasterId'});

        // //db.auditObservationDetails.belongsTo(db.scopeMaster,{as :'scopeAuditobservation',foreignKey:'scopeMasterId'});
        // //db.auditObservationDetails.belongsTo(db.selfAuditPlanDetails,{as :'scope_AuditPlanDetails',foreignKey:'auditPlanDetailsId'});

        // db.processFlowResponsibilityMaster.belongsTo(db.processFlowMaster, { as: 'processFlow', foreignKey: 'processFlowMasterId' });
        // db.processFlowResponsibilityMaster.belongsTo(db.roleMaster, { as: 'role', foreignKey: 'roleMasterId' });
        // db.processFlowResponsibilityMaster.belongsTo(db.companyMaster, { as: 'company', foreignKey: 'companyMasterId' });
        // db.processFlowResponsibilityMaster.belongsTo(db.plantMaster, { as: 'plant', foreignKey: 'plantMasterId' });
        // db.processFlowResponsibilityMaster.belongsTo(db.user, { as: 'user', foreignKey: 'employeeMasterId' });
        // db.companyMaster.belongsTo(db.yearTypeMaster, { as: 'yearType', foreignKey: 'yearTypeMasterId' });
        // db.selfAuditPlanDetails.belongsTo(db.companyMaster, { as: 'company', foreignKey: 'companyMasterId' });
        // db.selfAuditPlanDetails.belongsTo(db.plantMaster, { as: 'plant', foreignKey: 'plantMasterId' });
        // db.selfAuditPlanDetails.belongsTo(db.selfAuditPlanBasicDetails, { as: 'selfBasisDetails', foreignKey: 'selfAuditPlanBasicDetailsId' });
        // db.selfAuditPlanDetails.belongsTo(db.user, { as: 'user', foreignKey: 'leadAuditorId' });

        // db.auditObservationDetails.belongsTo(db.selfAuditPlanDetails, { as: 'SelfAuditobservation', foreignKey: 'auditPlanDetailsId' });
        // db.auditObservationDetails.belongsTo(db.scopeMaster, { as: 'scopeMaster', foreignKey: 'scopeMasterId' })
        // db.auditObservationDetails.belongsTo(db.auditObservationMaster, { as: 'observationMaster', foreignKey: 'auditObservationMasterId' })
        // db.auditPlanDetails.belongsTo(db.selfAuditPlanDetails, { as: 'finalAuditPlans', foreignKey: 'selfAuditPlanDetailsId' })
        // db.selfAuditPlanDetails.hasOne(db.auditPlanDetails, { as: 'finalAuditPlan', foreignKey: 'selfAuditPlanDetailsId' })

        // db.processFlowCompletionHistoryDetails.belongsTo(db.processFlowCompletionDetails, { as: 'processFlowCompletionHistoryDetails', foreignKey: 'processFlowCompletionDetailsId' })
        // db.processFlowCompletionDetails.hasOne(db.processFlowCompletionHistoryDetails, { as: 'processFlowCompletionHistoryDetails', foreignKey: 'processFlowCompletionDetailsId' })
        // db.auditObservationDetails.belongsTo(db.auditPlanDetails, { as: 'AuditPlanDetails', foreignKey: 'auditPlanDetailsId' })
    }
    /* reconciliation relationship end */
}

/** common relationship goes here */



//db.paymentRequest.belongsTo(db.event);

db.sequelize = sequelize;
db.authenticate = authenticate;

module.exports.db = db;