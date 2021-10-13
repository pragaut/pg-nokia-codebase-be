let db = require('../models/index');
const config = require('../config').config;
const listAttributes = require('../config').listAttributes;
const responseHelper = require('../util/response.helper');
const helper = require('../util/');
const codes = require('../util/codes').codes;
const Op = require('sequelize').Op;


const uuid = (modelName) => {
    let prefix = process.env.MODE === 'dev' ? 'dv-' : (process.env.MODE === 'staging' ? 'stg-' : '');
    const randomString = (new Date().getTime()).toString(36) + (new Date().getTime() + Math.floor(Math.random() * 100000)).toString(36);

    switch (modelName.toLowerCase()) {
        case 'user':
            prefix += 'usr';
            break;
        case 'useraccess':
            prefix += 'uacs';
            break;
        case 'groupaccess':
            prefix += 'gacs';
            break;
        case 'blank-model':
            return randomString;
        default:
            prefix += 'PG';
    }

    return prefix + '_' + randomString;
};

/**
 * 
 * @param {db.Sequelize} model the sequelize model
 * 
 * There are times when we dont want to send few columns when we send GetList data. Those attributes will come here.
 */
const getExcludedAttributes = model => {
    switch (model.name.toLowerCase()) {
        case 'user':
            return { exclude: ['Password', 'PasswordSalt'] };
    }

    return {};
};


const getModelByModelName = modelName => {

    switch (modelName.toLowerCase()) {
        case 'accountdetail':
            return {
                model: db.db.accountDetail,
                where: { active: 1 }
            }

        case 'customassociation':
            return {
                model: db.db.customAssociation,
                where: { active: 1 }
            }

        case 'usersubscriptionaccessmapping':
            return {
                model: db.db.usersubscriptionaccessmapping,
                where: { active: 1 }
            }
        case 'departmentMaster':
            return {
                model: db.db.departmentMaster,
                where: { active: 1 }
            }
        case 'masterCategory':
            return {
                model: db.db.masterCategory,
                where: { active: 1 }
            }
        case 'masterDetails':
            return {
                model: db.db.masterDetails,
                where: { active: 1 }
            }
        case 'notificationDetails':
            return {
                model: db.db.masterDetails,
                where: { active: 1 }
            }
        case 'escalationDurationMaster':
            return {
                model: db.db.masterDetails,
                where: { active: 1 }
            }
        case 'user':
            return {
                model: db.db.user,
                where: { active: 1 }
            }
        case 'userRole':
            return {
                model: db.db.userRole,
                where: { active: 1 }
            }
        case 'dueDaysMaster':
            return {
                model: db.db.dueDaysMaster,
                where: { active: 1 }
            }
        case 'sectionMaster':
            return {
                model: db.db.sectionMaster,
                where: { active: 1 }
            }
        case 'subSectionMaster':
            return {
                model: db.db.subSectionMaster,
                where: { active: 1 }
            }
        case 'scoringRuleMaster':
            return {
                model: db.db.scoringRuleMaster,
                where: { active: 1 }
            }
        case 'auditType':
            return {
                model: db.db.auditType,
                where: { active: 1 }
            }
        case 'scopeMaster':
            return {
                model: db.db.scopeMaster,
                where: { active: 1 }
            }
        case 'auditFlow':
            return {
                model: db.db.auditFlow,
                where: { active: 1 }
            }
        case 'processFlowMaster':
            return {
                model: db.db.processFlowMaster,
                where: { active: 1 }
            }
        case 'processFlowResponsibilityMaster':
            return {
                model: db.db.processFlowResponsibilityMaster,
                where: { active: 1 }
            }
            case 'organisationDetails':
                return {
                    model: db.db.organisationDetails,
                    where: { isActive: 1 }
                }
    };
    return undefined;
};


const getModelForAssociation = (_model, asChild) => {
    let model = {};

    switch (_model.name.toLowerCase()) {
        case 'masterCategory':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;

        case 'useraccess':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;

        case 'groupAccess':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;
        case 'accessgroup':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;
        case 'accesstype':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;
        case 'user':
            model = {
                model: _model, attributes: listAttributes['user'], where: {
                    active: 1
                },
                required: false
            };
            break;

        case 'userRole':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: true
            };
            break;
        case 'roleMaster':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;

        case 'customassociation':
            model = {
                model: _model, where: {
                    active: 1
                },
                required: false
            };
            break;

        case 'usersubscriptionaccessmapping':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'departmentMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'masterDetails':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'notificationDetails':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'escalationDurationMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'sectionmaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'subSectionMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'scoringRuleMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'auditType':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'auditFlow':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'processFlowMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'scopeMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
        case 'processFlowResponsibilityMaster':
            model = {
                model: _model, where: {
                    active: 1
                }, required: false,
            };
            break;
            case 'organisationDetails':
                model = {
                    model: _model, where: {
                        isActive: 1
                    }, required: false,
                };
                break;
        default:
            model = {
                model: _model, where: {
                    isActive: 1
                },
                required: false
            }
    }
    return model;
};


const findById = async (model, id, include) => {

    if (include && model.associations) {
        const modelsToInclude = [];

        Object.keys(model.associations).forEach(modelName => {

            if (model.associations[modelName].target) {
                let m = undefined;
                if (model.associations[modelName].target.name === modelName) {
                    m = getModelForAssociation(model.associations[modelName].target);
                }
                else {
                    m = getModelByModelName(modelName);
                }

                if (!m) {
                    m = getModelForAssociation(model.associations[modelName].target);
                }

                modelsToInclude.push(m);

            }
        });

        //console.log("modelsToInclude", modelsToInclude);
        return await model.findByPk(id, {
            include: modelsToInclude,
            lock: false
        });
    }
    return await model.findByPk(id, { lock: false });
};


const findOne = async (model, _where, include, includeObject, includeLevels, listOfModelsToInclude, sortOrder) => {

    if (includeObject) {
        //console.log("includeObject : ", includeObject);

        return await model.findOne({
            where: _where,
            include: includeObject,
            order: sortOrder
        });
    }


    /** for the inner objects, we will need to convert the where to array map so we can reuse the function for getlist **/

    const where = [];

    Object.keys(_where).forEach(where_key => {
        where.push(helper.constructWheresForSequelize(where_key, _where[where_key]));
    });

    const finalWhereObject = getWhereObjectForSequelize(where);
    const whereToInclude = finalWhereObject.whereToInclude;
    const whereForInnerModels = finalWhereObject.whereForInnerModels;
    const modelsToInclude = getModelsToInclude(model, include, includeLevels, whereForInnerModels, listOfModelsToInclude);




    console.log('warrior ')
    // console.log("user login where list ",where)
    // console.log("model ",model)
    // console.log("whereToInclude ",whereToInclude)
    // console.log("modelsToInclude ",modelsToInclude)

    try {
        const d = await model.findOne({
            where: whereToInclude,
            include: modelsToInclude,
            lock: false,
            order: sortOrder
        });


        //console.log('ea: ', d);
        return d;

    } catch (e) {
        console.log('what: ', e);
    }
};


const pushAssociations = (model, level, alreadyLoopedThrough, whereForInnerModels, listOfModelsToInclude) => {
    const includes = []
    if (model && model.associations) {
        Object.keys(model.associations).forEach(modelName => {
            if (alreadyLoopedThrough[modelName]) {
                return;
            }
            else if (model.associations[modelName].target) {
                if (alreadyLoopedThrough[model.associations[modelName].target.name]) {
                    return;
                }

                // check if the models list is sent to be included or not

                if (listOfModelsToInclude && Array.isArray(listOfModelsToInclude) && listOfModelsToInclude.length > 0) {
                    if (listOfModelsToInclude.indexOf(model.associations[modelName].target.name) === -1) {
                        // skip
                        return;
                    }
                }

                let m = undefined;

                if (model.associations[modelName].target.name === modelName) {
                    m = getModelForAssociation(model.associations[modelName].target);
                }
                else {
                    m = getModelByModelName(modelName);
                }

                if (!m) {
                    m = getModelForAssociation(model.associations[modelName].target);
                }


                const associatedModel = m;

                const getInnerConditionsIfModelNameFound = modelName => {
                    let innerConditions = {};
                    const _conditions = [];

                    Object.keys(whereForInnerModels).forEach(key => {
                        // the keys for inner models will be in a format like : user.name or product.price, so we need to split with a .
                        const split = key.split('.');
                        if (split[0] === modelName) {
                            // model is found. let's return the value
                            _conditions.push({
                                key,
                                model: split[0],
                                field: split[1],
                                value: whereForInnerModels[key],
                            });
                        }
                    });

                    // we may have got the multiple values for a model. For example, I may have got a filter with:
                    // user.firstName === 'vikas' && user.lastName === 'bhandari'

                    if (_conditions.length > 1) {
                        // multi

                        const formWhereConditionFromArray = () => {
                            const whereCondition = {};

                            _conditions.forEach(condition => {
                                // if key === modelname, it includes the nested filters. For nested filters, we don't need the model name because the where condition will always start with op.or or op.and. 

                                if (condition.key === modelName) {
                                    whereCondition[Object.getOwnPropertySymbols(condition.value)[0]] = condition.value[Object.getOwnPropertySymbols(condition.value)[0]];
                                }
                                else {
                                    whereCondition[condition.field] = condition.value;
                                }

                            });

                            return whereCondition;
                        }

                        return {
                            processed: true,
                            condition: {
                                [Op.and]: {
                                    ...formWhereConditionFromArray()
                                }
                            }
                        }
                    }
                    else if (_conditions.length > 0) {
                        // single
                        return {
                            processed: true,
                            condition: {
                                [_conditions[0].field]: _conditions[0].value
                            }
                        };
                    }

                    return {
                        processed: false,
                    };
                };

                const innerConditions = getInnerConditionsIfModelNameFound(model.associations[modelName].target.name);

                associatedModel.as = model.associations[modelName].as;

                if (innerConditions.processed) {
                    // model found
                    associatedModel.where = innerConditions.condition;
                    associatedModel.where['active'] = 1;
                    associatedModel.required = true;
                }

                associatedModel.level = level;

                if (level > 1) {
                    if (model.include && Array.isArray(model.include)) {

                    }
                    else {
                        model.include = [];
                    }
                }
                else {
                }

                associatedModel.parentModelName = model.name;
                includes.push(associatedModel);
            }
        });
    }
    return includes;
};


const getModelsToInclude = (model, include, includeLevels, whereForInnerModels, listOfModelsToInclude) => {
    const includes = {};
    const alreadyLoopedThrough = {};
    const listOfModelsLoopedThrough = [];
    const modelsToInclude = [];

    listOfModelsLoopedThrough.push({
        name: model.name,
        level: 0,
        model: model
    });

    alreadyLoopedThrough[model.name] = true;

    if (include && model.associations && Object.keys(model.associations).length > 0) {
        //console.log('model.associations: $$$$$', includeLevels);
        includes['l1'] = pushAssociations(model, 1, alreadyLoopedThrough, whereForInnerModels, listOfModelsToInclude);

        let inclusionLevels = includeLevels ? includeLevels : 1;

        if (inclusionLevels > 1) {
            for (let inclusionIndex = 2; inclusionIndex <= inclusionLevels; inclusionIndex++) {
                const key = 'l' + inclusionIndex.toString();
                const oldKey = 'l' + (inclusionIndex - 1).toString();

                const inclusionsToRunFrom = includes[oldKey];

                includes[key] = [];

                if (!Array.isArray(inclusionsToRunFrom)) {
                    continue;
                }

                inclusionsToRunFrom.map(inclusion => {
                    includes[key].push(...pushAssociations(inclusion.model, inclusionIndex, alreadyLoopedThrough, whereForInnerModels, listOfModelsToInclude));
                });
            }
        }

        //console.log('includes: ', includes);

        /** for inclusion levels 
         * 
         * if include is true, we may give inclusion levels up to 10
         * 
         * if we have come here, it means includes is an object with keys like l1, l2, l3 etc with arrays. We need to include that in the parent model include
         * 
         * 
        */

        const holdIncludeDataToInjectInModels = {};

        for (let index = 10; index > 0; index--) {
            // as long as index is bigger than 1 && it has some values

            if (!includes['l' + index]) {
                continue;
            }

            const associatedModels = includes['l' + index];

            associatedModels.forEach(associatedModel => {
                if (holdIncludeDataToInjectInModels[associatedModel.parentModelName]) {

                }
                else {
                    holdIncludeDataToInjectInModels[associatedModel.parentModelName] = [];
                }

                if (holdIncludeDataToInjectInModels[associatedModel.model.name]) {
                    // ok, we had that already
                    associatedModel.include = [...holdIncludeDataToInjectInModels[associatedModel.model.name]];
                    delete holdIncludeDataToInjectInModels[associatedModel.model.name];
                }

                holdIncludeDataToInjectInModels[associatedModel.parentModelName].push(associatedModel);
            });
        }

        if (holdIncludeDataToInjectInModels[model.name]) {
            modelsToInclude.push(...holdIncludeDataToInjectInModels[model.name])
            //console.log('holdIncludeDataToInjectInModels: ', holdIncludeDataToInjectInModels[model.name][0].model.include);
        }

    }

    return modelsToInclude;
};



const getWhereObjectForSequelize = (where) => {

    const finalWhereObject = {
        whereForInnerModels: {},
        whereToInclude: {}
    }

    const whereForInnerModels = {};
    let whereToInclude = {};
    // sort the where array 

    if (Array.isArray(where) && where.length > 0) {

        /**
         * 
         * @param {*} type 
         * We send the type and, it returns the operator type which sequelize can understand. For example, 'eq' means equal which is equivalent to Op.eq in sequelize
         */

        const getSequelizeFilterFromText = type => {
            switch (type) {
                case 'eq':
                    return Op.eq;
                case 'ne':
                    return Op.ne;
                case 'contains':
                    return Op.like;
                case 'lt':
                    return Op.lt;
                case 'lte':
                    return Op.lte;
                case 'gt':
                    return Op.gt;
                case 'gte':
                    return Op.gte;
                case 'bt':
                    return Op.between;
                case 'in':
                    return Op.in;
                case 'or':
                    return Op.or;
                default:
                    return Op.eq;
            }
        };


        const prepareRightSideFilterValue = filter => {
            switch (filter.type) {
                case 'eq':
                case 'ne':
                case 'lt':
                case 'lte':
                case 'gt':
                case 'or':
                case 'gte':
                    return filter.value;
                case 'contains':
                    return '%' + filter.value + '%';
                case 'bt':
                    return [filter.value, filter.value2];
                case 'in':
                    return filter.value;
                default:
                    return Op.eq;
            }
        };


        // we have categorized the filters

        // let's store the filters in a temp so we can compbine these array for op.and and op.or
        const tempFilters = {};

        /**
         * Very Important: If there is a push from filter, a property called pushedFor = 'or' will be pushed, in this case, we will use 'or'
         */

        /**
         * 
         * @param {*} filter 
         * 
         * Assumption here: We will send and/or/ or normal conditions. and/or will be treated differently than the normal filters. Also, we assume that in case of and/or, we will be sending the filters array inside filter
         * 
         * Assumtion #2: we will also send the model name for key , we will use this modelname to bind the variable with a model
         */
        const convertFiltersToSequelizeFormat = (filter, injectKey) => {
            if (filter.type === 'or' || filter.type === 'and') {
                const leftHandSide = filter.type === 'or' ? Op.or : Op.and;
                const filterResults = filter.filters.map(_f => convertFiltersToSequelizeFormat(_f, true));

                return {
                    [leftHandSide]: filterResults
                };
            }
            else {
                if (injectKey) {
                    const keys = filter.key.split('.');
                    let key = filter.key

                    if (keys.length > 1) {
                        key = keys[1];
                    }
                    return {
                        [key]: {
                            [getSequelizeFilterFromText(filter.type)]: prepareRightSideFilterValue(filter)
                        }
                    };
                }

                return {
                    [getSequelizeFilterFromText(filter.type)]: prepareRightSideFilterValue(filter)
                };
            }
        };

        let pushedForOr = false;

        where.forEach(_w => {
            const sequelizeFilter = convertFiltersToSequelizeFormat(_w);

            if (_w.pushedFor === 'or') pushedForOr = true; // only one instance as pushedfor or will be sufficient to decide if this is a request from filter for or condition
            if (_w.relation === 'child') {
                whereForInnerModels[_w.key] = sequelizeFilter;
            }
            else {
                tempFilters[_w.key] = sequelizeFilter;
            }
        });

        whereToInclude = {};

        Object.keys(tempFilters).forEach(key => {
            if (key.indexOf('RANDOM') === 0) {
                // the random key
                //Object.getOwnPropertySymbols(condition.value)[0]
                const symbol = Object.getOwnPropertySymbols(tempFilters[key])[0];
                whereToInclude[symbol] = tempFilters[key][symbol];
            }
            else {
                whereToInclude[key] = tempFilters[key];
            }
        });
    };

    finalWhereObject.whereToInclude = whereToInclude;
    finalWhereObject.whereForInnerModels = whereForInnerModels;

    return finalWhereObject;

};



/**
 * The function will eventually return the list of data for the model asked. It will also filter & sort the data, and will also include the child table(s) data in the list
 *  
 * @param {db.sequelize} model the model on which the operation has to be applied
 * @param {Array} where the filter array. It will be used to filter the results. the format of it will be:
 *                           const where = [];
                                where.push({
                                    key: 'password',
                                    type: 'eq',
                                    value: req.body.passowrdHash,
                                    value2: '',
                                    relation: 'self',
                                    criteria: 'and/or' (for multiple values)
                                    values: ['vikas', 'hello']
                                });
    type can be: ['eq', 'ne', 'contains', 'gt', 'lt', 'gte', 'lte', 'bt']
    relation can be child, and self. If child, then we will not include the where in normal where. We will be including that in the where condition for that particular model

 * @param {Array} order the sorting array.
 * @param {Boolean} include if true, we will try to get the associations and include in the returned data
 * @param {Number} pageIndex 0 based index. The index of current page. It will be required to show the active page
 * @param {Response} res Response object to send the response back to the user. If null, the function will return a Promise
 */

const getList = async options => {
    let { model,
        where,
        order,
        include,
        rowsToReturn, // send like 10000 so it gives all the records for dropdowns
        pageIndex, // 0 based infxed
        req,
        res,
        includeInnerObject,
        includedAttributes, // if we need to include some of the columns only, and not all the records then we need to send the column names as array in this param
        includeLevels, // the number of inclusions we need to go to. Example: If we are getting order data, first level of inclusion will be orderlineItem. 2 Level will be OrderLineItem ==> ShippingAddress. 2 Level will be OrderLineItem ==> ProductVariation ==> Image etc etc
        listOfModelsToInclude // if undefined, we will include all, if sent, then only these list will be sent back
    } = options;

    try {
        /**
         * for user, please don't return the password and hashes for security
         */
         console.log('model Name : ',model)
        const excludedAttributes = includedAttributes ? [] : getExcludedAttributes(model);

        /*
        * To-do
        * the where contains will be modified here and converted into sequelize.
        * v0.1.1 provides the filters only to the parent level now. Filters on child component will be included
        * in later versions
        */


        const finalWhereObject = getWhereObjectForSequelize(where);
        const whereToInclude = finalWhereObject.whereToInclude;
        const whereForInnerModels = finalWhereObject.whereForInnerModels;

        const keysCounter = {};

        // sample format for inner model conditions will be:
        /*
            whereForInnerModels['user']= {
                active: 1
            }
        */

        /**
         * include models to the list
         */

        const modelsToInclude = getModelsToInclude(model, include, includeLevels, whereForInnerModels, listOfModelsToInclude);


        if (!pageIndex) pageIndex = 0;
        if (typeof rowsToReturn === 'undefined') rowsToReturn = config.DB_ROWS_LIMIT;

        /**
        * here I will add the logic so it should return the master values only if it has changed since stored last time. It only applies for master values
        */

        if (rowsToReturn === 10000) {

            // this is for master / dropdown
            const data = await model.findAndCountAll({
                attributes: req.query.nameField ? ['id'].concat(req.query.nameField.split(',')) : ['id', 'name'],
                where: whereToInclude,
                order: req.query.nameField ? req.query.nameField.split(',') : ['name'],
            });

            if (res) {
                responseHelper.success(res, 200, data.rows, '', -1, data.rows.length);
            }

            return res;
        }
        else {

        }


        // check if the order is given or not. If yes, then check if it is for parent table or the child table

        const sortOrderToInclude = order;

        // if (order && Array.isArray(order)) {
        //     order.forEach(item => {
        //         // item should be an array.
        //         if (Array.isArray(item)) {
        //             // yes, array is what we got
        //             if (item.length === 2) {
        //                 // ordering for main table
        //                 sortOrderToInclude.push([item[0], item[1]]);
        //             }
        //             else if (item.length === 3) {
        //                 // order is for inner table
        //                 //sortOrderToInclude.push([getModelFromModelName(item[0]), item[1], item[2]]);
        //             }
        //         }
        //     });
        // }


        /** incase i forget later on:
         * When we include child table where conditions, the default record count is not given correctly
         * by sequelize so we need to split the get query into two,
         *  - first fire a query without including child in select records to get true number of records, 
         *  - and secondly fire a query to obtain the limited number of rows for right page index
         * 
         *  number of records are necessary to make pagination work correctly on front end.
         * 
         * PLEASE NOTE: I am not yet sure how to perform incase of includeInnerObject is sent, so this will only be working for the condition where we will be using models to include.
         * 
         */
        const count = await model.findAll({
            include: modelsToInclude.filter(model => {
                return Object.keys(model.where).length > 1;
            }).map(model => {
                return {
                    ...model,
                    required: true,
                    attributes: []
                };
            }),

            where: whereToInclude
        });

        const data = await model.findAll({
            include: includeInnerObject ? includeInnerObject : modelsToInclude,
            attributes: includedAttributes ? includedAttributes : excludedAttributes,
            where: whereToInclude,
            order: sortOrderToInclude,
            limit: parseInt(rowsToReturn),
            offset: pageIndex * rowsToReturn,
        });

        if (res) {
            responseHelper.success(res, 200, data, '', -1, count.length);
        }

        return data;
    }
    catch (error) {
        if (res) {
            return responseHelper.error(res, error, 502)
        }

        throw error;
    }
};


/**
 * @param {*} model the model
 * @param {Int32Array} ids Array of ids to be deleted
 * @param {Number} updatedBy the user calling the shot
 * @param {Response} res the response object. If supplied, the function will try to send response right away, otherwise it will return a promise
 */

const deleteRecords = (modelToDelete, ids, updatedBy, res, transaction) => {
    const promise = new Promise((resolve, reject) => {
        try {
            const where = [];
            let idsToDelete = ids;

            const model = modelToDelete.name ? modelToDelete : modelToDelete.model;

            console.log('model: ', model.name);

            if (Array.isArray(ids)) {
                //we are ok
            }
            else {
                idsToDelete = ids.split(',');
            }

            idsToDelete = idsToDelete.filter(id => typeof id !== 'undefined');

            idsToDelete.forEach(id => {
                where.push({
                    id: id.trim()
                });
            });

            console.log('d: ', where);

            model.update({
                active: false,
                isActive: false,
                updatedBy
            },
                {
                    where: { [Op.or]: where }
                }).then(result => {
                    resolve(result);
                })
                .catch(err => reject(err));
        }
        catch (error) {
            reject(error);
        }
    });

    if (res) {
        promise.then(result => responseHelper.success(res, 200, result, 'Records deleted successfully')).catch(error => responseHelper.error(res, error, 502));
    }
    else {
        return promise;
    }
};


/**
 * @param {*} model the model
 * @param {Number} id the id to be deleted
 * @param {Number} updatedBy the user calling the shot
 */
const deleteRecord = (model, id, updatedBy, res, transaction) => {
    const ids = [];
    ids.push(id);

    return deleteRecords(model, ids, updatedBy, res, transaction);
};


/**
 * @param {*} model
 * @param {Object} body
 * @param {Response} res if you send res object, it will send a response back. otherwise it will return a promise
 */

const saveData = async (model, body, res, callingUserId, transaction, counter = 1, isNewRecord) => {

    let newRecord = false;
    //console.log("save data 1");
    try {
        //console.log("save data 2");
        // if id exists, consider it an update
        if ((typeof body.id === 'undefined' || isNewRecord == true) ||
            ((model.name === 'order'
                || model.name === 'comment'
                || model.name === 'user'
                || model.name === 'address'
                || model.name === 'coupon'
                || model.name === 'discount'
                || model.name === 'cartInfo'
                || model.name === 'newsletter'
                || model.name === 'payment')
                && body.newRecord === true)) {

            //console.log("save data 3");
            // no id given. generate a uuid
            // uuid are generally very safe for a unique Id, but if you want, you can probably add your own prefix or suffix to make sure the uniqueness
            if (model.name !== 'orderActivity' && model.name !== 'cart' && model.name !== 'cartInfo') {
                // we don't need order Activity id
                body.id = body.id ? body.id : uuid(model.name);
            }
            //console.log("save data 4");
            body.createdBy = callingUserId;
            body.active = true;
            body.isActive = true;

            newRecord = true;


            const options = {
                transaction: null
            };

            // let's make sure we are adding in a transaction, if supplied by the calling function
            //console.log("save data 5");
            if (transaction) {
                options['transaction'] = transaction;
                options['lock'] = false;
            }
            //console.log("save data 6");
            const result = await model.create(body, options);
            //console.log("save data 6.1");
            if (res) {
                //console.log("save data 7");
                responseHelper.success(res, 200, result, 'Record saved successfully', result.id);
            }
            else {
                //console.log("save data 8");
                return result;
            }
        }
        else {

            // in case of edit, we need to make sure we have the insert access to this module or not, if I do,
            // i should be able to edit my own records.

            // and, if the record is not mine, then I should have access to edit the records
            //console.log("save data 9");

            body.updatedBy = callingUserId;

            // find the record by Id
            //console.log("save data 10");
            const result = await model.findOne({
                where: { id: body.id }
            });
            //console.log("save data 11");

            if (result) {
                //console.log("save data 12");
                const dataToSave = Object.assign({}, body);
                delete dataToSave.id;
                const updateResult = await model.update(dataToSave, {
                    where: {
                        id: body.id
                    },
                    transaction: transaction ? transaction : null,
                    lock: false
                });
                //console.log("save data 13");
                if (res) {
                    //console.log("save data 14");
                    responseHelper.success(res, 200, updateResult, 'Record saved successfully', result.id);
                }
                else {
                    //console.log("save data 15");
                    return result;
                }
            }
            else {
                //console.log("save data 16");
                const error = helper.generateWarning(`No record with id ${body.id} exists in DB for model ${model.name}. Unable to edit the record`);
                error.code = codes.RECORD_NOT_FOUND;

                throw error;
            }
        }
    }
    catch (error) {

        console.log('eeeeee: ', error.name, error.fields);

        if (error.name === 'SequelizeUniqueConstraintError' && newRecord) {
            // unique constraint error.  

            // may be, our tool didn't produce the unique number. so let's give it some try

            // may be at least for 3 times
            //console.log("save data 17");

            const fields = error.fields;
            let primaryDupFound = false;

            if (Array.isArray(error.fields)) {
                const primaryIndex = error.fields.indexOf('PRIMARY');

                primaryDupFound = primaryIndex > -1;
            }
            else {
                // object
                primaryDupFound = !(typeof error.fields['PRIMARY'] === 'undefined');
            }

            if (counter < 3 && primaryDupFound) {

                //delete body.id;
                return await saveData(model, body, res, callingUserId, transaction, counter + 1);
            }
            else {
                // enough tries
                // let's throw error

                if (res) {
                    responseHelper.error(res, error, error.code ? error.code : 502, 'Saving data in DAL');
                }
                else {
                    throw error;
                }
            }
        }
        else {
            //console.log("save data 18");
            if (res) {
                responseHelper.error(res, error, error.code ? error.code : 502, 'Saving data in DAL');
            }
            else {
                throw error;
            }
        }

    }
};


const bulkCreate = async (model, records, callingUserId, transaction, DONT_CREATE_ID, fields) => {
    try {
        let modelToUse = model;
        //let fields = undefined;

        if (model && typeof model.name === 'undefined') {
            modelToUse = model.model;
        }

        // let's make sure our records are active and the calling user id is selected
        const _records = records.map(record => {
            // let's not mutate the original record
            const _record = JSON.parse(JSON.stringify(record));
            _record.active = true;
            _record.isActive = true;
            _record.createdBy = callingUserId;

            if (!_record.id && !DONT_CREATE_ID) {
                _record.id = uuid(modelToUse.name);
            }

            if (!fields) {
                fields = Object.keys(_record);
            }

            return _record;
        });

        console.log('hey: ', fields);
        return await modelToUse.bulkCreate(_records, { transaction, updateOnDuplicate: fields });
    }
    catch (error) {
        console.log('errorli', error);
        error.code = codes.BULK_CREATE_ERROR;
        throw error;
    }
};


const bulkUpdate = async (model, records, callingUserId, transaction, updateOnDuplicateFields) => {
    try {
        let modelToUse = model;
        let fields = undefined;

        if (model && typeof model.name === 'undefined') {
            modelToUse = model.model;
        }

        // let's make sure our records are active and the calling user id is selected
        const _records = records.map(record => {
            // let's not mutate the original record
            const _record = JSON.parse(JSON.stringify(record));
            _record.active = true;
            _record.isActive = true;
            _record.createdBy = callingUserId;

            if (!fields) {
                fields = Object.keys(_record);
            }

            return _record;
        });

        console.log('hey: ', fields);
        console.log('hey Pk', updateOnDuplicateFields);
        return await modelToUse.bulkCreate(_records, { transaction, updateOnDuplicate: fields });
    }
    catch (error) {
        console.log('errorli', error);
        error.code = codes.BULK_CREATE_ERROR;
        throw error;
    }
};


/**
 * the unmanaged transaction object
 */
const getTransaction = async () => {
    return new Promise((resolve) => {
        db.db.sequelize.transaction({
            autoCommit: false
        }).then(transaction => {
            resolve(transaction);
        });
    });
};


const destroy = async (model, where) => {
    return model.destroy({
        where
    });
};


const deleteRecordWrapper = async (model, id, name, requestorId, res) => {


    try {


        /** find a record first */

        const record = await findById(model, id);

        if (!record) {
            // couldn't find the record with id, throw error

            const error = new Error(`Cannot find the ${name} with the id ${id}. Please provide a valid id and try again.`);
            error.code = codes.ID_NOT_FOUND;
            throw error;
        }

        const data = {
            id: id,
            active: false,
            isActive : false
        };
        const result = await saveData(model, data, null, requestorId);

        if (res) {
            // send response
            responseHelper.success(res, codes.SUCCESS, {}, name + ' deleted successfully');
        }
        else {
            return result;
        }
    }
    catch (error) {
        if (res) {
            // send error
            responseHelper.error(res, error, codes.ERROR, 'Deleting ' + name);
        }
        else {
            throw error;
        }
    }
};


const runProcedure = async (procedureNames, ...params) => {
    //db.sequelize.query('call set_razory_pay_status(:razorPayId, :razorPayStatus, :capturedAt);', {
};

/**
 * 
 */
const upsert = async (model, body, id, res, callingUserId, transaction) => {

    const obj = await model.findOne({ where: { id } });

    if (obj) {
        body.id = id;
        body.modifiedBy = callingUserId;

        return await obj.update(body,
            {
                transaction
            });
    }
    else {
        body.id = id;
        body.createdBy = callingUserId;

        return await model.create(body, {
            transaction
        });
    }
}

/**
 * 
 * @param {*} model 
 * @param {*} array 
 * @param {*} userId 
 * @param {*} transaction 
 * 
 * searches array, and look
 */
const identifyAndUpsertRecords = async (model, array, userId, transaction) => {
    if (array && Array.isArray(array) && array.length) {

        const items = array.filter(item => item.modified === true || item.added === true);
        await bulkCreate(model, items, userId, transaction);
    }
};

/**
 * 
 * @param {*} model 
 * @param {*} array 
 * 
 * Searches in array for keyword deleted, and gets rid of it
 */
const filterAndDeleteRecords = async (model, array, userId, transaction) => {
    if (array && Array.isArray(array) && array.length) {
        const items = array.filter(item => item.deleted === true).map(item => item.id);
        if (items && items.length > 0)
            await deleteRecords(model, items, userId, undefined, transaction);
    }
};


const identifyAndSaveChildData = async (baseObject, userId, transaction) => {
    // let's check if the base object has the relation definition
    if (baseObject.innerRelations && Array.isArray(baseObject.innerRelations) && baseObject.innerRelations.length > 0) {
        // ok, this is an array, let's find the models and save delete it

        for (let relationIndex = 0; relationIndex < baseObject.innerRelations.length; relationIndex++) {
            const relation = baseObject.innerRelations[relationIndex];
            const propertyName = relation.propertyName;
            const values = baseObject[propertyName];
            const model = getModelByModelName(relation.modelName || '');

            console.log('bi1');

            // values should be an array. If an array, we need to save it. otherwise, we can assume there was no data to save.
            if (values && Array.isArray(values) && values.length > 0 && model) {
                // ok, values is an array and model is a valid sequelize model
                //before we can go ahead, we need to find whether there are some child data available or not.


                console.log('bi2');
                for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
                    const value = values[valueIndex];
                    console.log('bi3');

                    if (value.innerRelations && value.innerRelations.length > 0) {
                        // ok, this is an object with child data, please proceed for recursive function to save data
                        await identifyAndSaveChildData(value, userId, transaction);
                    }
                };

                console.log('bi4: ', values);

                // let's save the data
                await identifyAndUpsertRecords(model, values, userId, transaction);

                // let's delete if required
                await filterAndDeleteRecords(model, values, userId, transaction);
            }
        };
    }
};



module.exports.getList = getList;
module.exports.saveData = saveData;
module.exports.deleteRecords = deleteRecords;
module.exports.deleteRecord = deleteRecord;
module.exports.destroy = destroy;
module.exports.findById = findById;
module.exports.findOne = findOne;
module.exports.deleteRecordWrapper = deleteRecordWrapper;
module.exports.getTransaction = getTransaction;
module.exports.bulkCreate = bulkCreate;
module.exports.bulkUpdate = bulkUpdate;
module.exports.runProcedure = runProcedure;
module.exports.identifyAndUpsertRecords = identifyAndUpsertRecords;
module.exports.filterAndDeleteRecords = filterAndDeleteRecords;
module.exports.identifyAndSaveChildData = identifyAndSaveChildData;
module.exports.getModelByModelName = getModelByModelName;
module.exports.uuid = uuid;
module.exports.upsert = upsert