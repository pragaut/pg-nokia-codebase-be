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
    if (process.env.APP === 'nokia') {
         db.towerMaster.belongsTo(db.organisationDetails, { as: 'orgName', foreignKey: 'orgDetailsId' });
         db.towerMaster.belongsTo(db.cityMaster, { as: 'cityName', foreignKey: 'cityId' });
         db.towerAllotmentMaster.belongsTo(db.towerMaster, { as: 'towerName', foreignKey: 'towerId' });
         db.towerAllotmentMaster.belongsTo(db.organisationDetails, { as: 'orgName', foreignKey: 'orgDetailsId' });
         db.towerAntennasMaster.belongsTo(db.towerMaster, { as: 'towerName', foreignKey: 'towerId' });
         db.deviceRegistrationMaster.belongsTo(db.organisationDetails, { as: 'orgName', foreignKey: 'orgDetailsId' });
         db.deviceRegistrationMaster.belongsTo(db.moduleMaster, { as: 'module', foreignKey: 'grpModulesId' });        
    }
}
db.sequelize = sequelize;
db.authenticate = authenticate;

module.exports.db = db;