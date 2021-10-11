const couponController = require('../controllers/shopping/coupon');

const dal = require('../dal');
const db = require('../models').db;

module.exports.verifyCoupon = async (coupon, callingUserId) => {
    /**
                 * 
                 * @param {*} startDate 
                 * @param {*} endDate 
                 * 
                 * verifies if the coupon is still valid, as far as dates are concerned
                 */

	const verifyCouponNotExpired = async (startDate, endDate) => {
		const currentDate = new Date();
		let endDateValid = false;
		let startDateValid = false;

		if (typeof endDate === 'undefined') {
			endDateValid = true;
		}
		else {
			endDateValid = endDate >= currentDate;
		}

		if (typeof startDate === 'undefined') {
			startDateValid = true;
		}
		else {
			startDateValid = currentDate >= startDate;
		}

		return startDateValid && endDateValid;
	};


	const { name, canBeUsed = 0, startDate, endDate, associationType, associations, freeAssociationType, freeAssociations } = coupon;
	const associationTypeId = (associations && associations.length > 0) ? associations.map(association => association.associationId) : [];

	if (canBeUsed <= 0) {
		throw new Error('Coupon is invalid. Error code: c1');
	}

	const couponExpired = !verifyCouponNotExpired(startDate, endDate);

	if (couponExpired) {
		// oops, it is an expired coupon
		throw new Error('Coupon is expired. Error code: c2');
	}

	if (associationType === 'user') {
		// this coupon is issued for a particular user
		if (associationTypeId !== 'undefined' && associationTypeId !== '') {

			// let's verify if issuedFor matches the user
			if (associationTypeId.indexOf(callingUserId) === -1) {
				console.log(`${callingUserId} doesn't match with ${associationTypeId}`)
				throw new Error('Coupon is invalid. Error code: c3');
			}
		}
		else {

		}
	}

	if (callingUserId) {
		console.log('checking calling user id: ', callingUserId);
		// can be used will define how many times we can use this item
		const couponUsed = await db.couponUserMapping.findAll({
			where: {
				userId: callingUserId,
				couponId: coupon.id
			}
		});

		const used = couponUsed ? couponUsed.length : 0;
		if (used >= canBeUsed) {
			throw new Error('Coupon is invalid. Error code: c4. You have already availed this coupon');
		}
	}

	return true;
};

/**
 * 
 * @param {*} coupon 
 * @param {*} order 
 * @param {*} callingUserId 
 * @param {*} serverTotal The total of items according to price stored in server
 * @param {*} transaction 
 * 
 * returns the array of lineitems with the discount injected
 */
module.exports.verifyCouponApplication = async (coupon, order, serverTotal, callingUserId, transaction) => {

	const toFixed = (num, fixed) => {
		if (isNaN(num)) {
			return 0;
		}
		const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
		return num.toString().match(re)[0];
	};

	const { name, canBeUsed = 0, percentage, flatRate, associationType = '', freeAssociationType = '', associations, freeAssociations } = coupon;
	const associationTypeId = (associations && associations.length > 0) ? associations.map(association => association.associationId) : [];
	const freeAssociationTypeId = (freeAssociations && freeAssociations.length > 0) ? freeAssociations.map(association => association.associationId) : [];

	if (typeof freeAssociationTypeId === 'string') {
		freeAssociationTypeId = freeAssociationTypeId.split(',');
	}

	if (typeof associationTypeId === 'string') {
		associationTypeId = associationTypeId.split(',');
	}

	
	let productIdAllowedForCoupon = undefined;
	let orderLineItems = JSON.parse(JSON.stringify(order.line_items));
	let categoryWiseData = {};

	/** let's assume that all the items in order are coupon eligible */

	orderLineItems.forEach(item => {
		item.couponAllowed = true;
	});

	if (associationType === 'user' || associationType === 'product' || associationType === 'category') {
		// if it comes here, that means the coupon is associated with a particular user, product or a category

		if (associationType === 'user') {
			// since the condition of canBeUsed > 0 is already checked at the verify coupon method, we don't need to verify it here.
			// we do nothing here
		}
		else if (associationType === 'product') {
			orderLineItems = orderLineItems.map(item => ({
				...item,
				couponAllowed: item.productId === associationTypeId
			}));
		}

		if (associationType === 'category' || freeAssociationType === 'category') {
			const productIds = orderLineItems.map(item => item.productIds);
			const uniqueProductIds = Array.from(new Set(productIds));

			const categoryData = await db.productCategoryMapping.findAll({
				attributes: ['productId', 'categoryId'],
				where: {
					productId: uniqueProductIds
				}
			});

			categoryData.map(category => {
				if (categoryWiseData[category.dataValues.productId]) {
					categoryWiseData[category.dataValues.productId].push(category.dataValues.categoryId);
				}
				else {
					categoryWiseData[category.dataValues.productId] = [category.dataValues.categoryId];
				}
			});

			
			const allowedProductIds = categoryData.filter(category => associationTypeId.indexOf(category.dataValues.categoryId)).map(category => category.dataValues.productId);
			if (associationType === 'category') {
				// let's store if a coupon is allowed or not
				orderLineItems = orderLineItems.map(item => ({
					...item,
					couponAllowed: allowedProductIds.indexOf(item.productId) > -1
				}));
			}
		}
	}

	// now we know the product variations eligible for discount. Let's get a new item total which will be totaling up the cart value;

	const quantityAndPricePromise = new Promise((resolve, reject) => {
		db.sequelize.query('call get_variations_price_qty(:ids)', { replacements: { ids: orderLineItems.filter(item => item.couponAllowed === true).reduce((acc, item) => acc + ',' + item.productVariationId, '-1') } }).then(results => {
			resolve(results);
		}).catch(err => {
			reject(err)
		})
	});


	const quantityAndPricePromiseResult = await quantityAndPricePromise;
	
	const priceReceivedFromDB = {};
	let couponizedServerTotal = 0;

	quantityAndPricePromiseResult.forEach(item => {
		priceReceivedFromDB[item.id] = item.price;
	});

	order.line_items.forEach(lineItem => {
		couponizedServerTotal = couponizedServerTotal + parseFloat(lineItem.qty * parseFloat(priceReceivedFromDB[lineItem.productVariationId] || 0));
	});


	// let's identify if the coupon is valid on cart

	// before we go ahead and approve coupon usage, we need to make sure that the coupon applied in the product is of valid values. The coupon, for example, BOGO, should have correct amount deducted for the right product. If someone hacks the json, and sends the wrong information, we need to make sure it is filtered right here.

	// in order's line items array, the total means the discounted price, minus reward points, if any.

	const orderTotal = order.line_items.filter(item => item.couponAllowed === true).reduce((acc, item) => acc + ((parseFloat(item.price) * parseFloat(item.qty)) || 0), 0);

	// let's check the coupon usage and compare if the amount is correct or not.

	if (coupon.minOrder && coupon.minOrder > 0 && orderTotal < coupon.minOrder) {
		// the cart total is less than the minimum order required. It is a false request. It should not be processed
		throw new Error('Coupon is invalid. Error code: c5')
	}

	/**
	 * if a coupon is reserved for a product
	 * 	we will apply coupon only to those items which have product id mapped to this coupon
	 * 
	 * if a coupon is reserved for a category
	 * we will apply coupon to those items which have category mapped to this coupon
	 */

	let total = 0;
	let totalDiscount = 0;
	let eligibleForFreebies = 0;
	let cartDiscount = 0;

	const totalSuppliedFromFrontEnd = Math.round(order.line_items.reduce((acc, item) => acc + (parseFloat(item.price * item.qty) || 0), 0));

	// if we need to buy a particular number of products, for example, BOGO, we need to buy at least 1 item for second free item
	if (coupon.mustBuy > 0 && coupon.getsFree > 0) {
		// let's sort descending wise

		const lineItems_ascending = order.line_items.slice().sort((a, b) => a - b);

		// let's first find out whether we have enough eligible items to apply bogo

		const categoryWiseProductCount = {};

		const isProductEligibleForDiscount = (product, association_type, association_type_id) => {
			if (association_type === 'product') {
				return association_type_id.indexOf(product.productId) > -1;
			}
			else if (association_type === 'category') {
				const eligibleProducts = [];
				let categories = product.categories;
				let isProductEligible = false;
				categories.forEach(category => {
					if (association_type_id.indexOf(category) > -1) {
						// bingo
						isProductEligible = true;
					}
				});

				return isProductEligible;
			}
			else {
				return true;
			}
		};

		lineItems_ascending.forEach(item => {
			const categories = categoryWiseData[item.productId];
			item.categories = categories;

			categories.forEach(category => {
				if (categoryWiseProductCount[category]) {
					categoryWiseProductCount[category] = categoryWiseProductCount[category] + 1;
				}
				else {
					categoryWiseProductCount[category] = 1;
				}
			});

			// let's see if this is available for discount

			item.isItemEligibleForDiscount = isProductEligibleForDiscount(item, associationType, associationTypeId);
			item.isItemEligibleForFreebies = isProductEligibleForDiscount(item, freeAssociationType, freeAssociationTypeId);
		});

		const eligibleProducts = lineItems_ascending.filter(item => item.isItemEligibleForDiscount);
		const eligibleProductsCount = eligibleProducts.reduce((acc, item) => acc = acc + item.qty, 0);
		let eligibleProductsForFreebies = lineItems_ascending.filter(item => item.isItemEligibleForFreebies);
		

		if (coupon.mustBuy > eligibleProductsCount) {
			// ok, not sufficient yet. Let's exit
			throw new Error('Coupon is invalid. Error code: c6');
		}
		else {
			// since we have the items in cart which are eligible for this coupon/discount, 
			// let's see if we have sufficient items available for in freebies.

			eligibleForFreebies = 0;

			let roadToMustBuy = 0;
			let mustBuySatisfied = false;
			let freebies = 0;

			lineItems_ascending.forEach(item => {
				if (item.isItemEligibleForDiscount && mustBuySatisfied === false) {
					roadToMustBuy = roadToMustBuy + item.qty;

					if (roadToMustBuy === coupon.mustBuy) {
						// bingo, we have sufficient items for bogo. 
						mustBuySatisfied = true;
					}
					else if (roadToMustBuy > coupon.mustBuy) {
						// it means the qty has surpasssed the must buy, if this 
						// belongs to a freebie category, let's add this to eligibleForFreebies
						if (item.isItemEligibleForFreebies) {
							eligibleForFreebies = roadToMustBuy - coupon.mustBuy;
							mustBuySatisfied = true;
						}
					}
				}
				else if (item.isItemEligibleForFreebies) {
					eligibleForFreebies = eligibleForFreebies + item.qty;
				}
			});

			let remainingItemsAvailableForFreebies = eligibleForFreebies;

			if (eligibleForFreebies > 0) {
				for (let lineItemIndex = 0; lineItemIndex < eligibleProductsForFreebies.length; lineItemIndex++) {
					const lineItem = eligibleProductsForFreebies[lineItemIndex];

					for (let quantityIndex = 0; quantityIndex < lineItem.qty; quantityIndex++) {
						if (freebies < coupon.getsFree && remainingItemsAvailableForFreebies > 0) {
							totalDiscount += lineItem.price;
							freebies++;
							remainingItemsAvailableForFreebies--;
						}
					}
				};
			}
		}
		console.log('total supplied: ', totalSuppliedFromFrontEnd, ' total ours: ', serverTotal, ' and discount: ', totalDiscount, ' ; front end discount: ', order.totalDiscount);

		if ((totalSuppliedFromFrontEnd - order.totalDiscount) === (serverTotal - totalDiscount)) {
			// bingo, amount matched
		}
		else {
			const error = new Error('Not a valid amount. Please check it again');
			error.isError = true;
			throw error;
		}

		return {
			items: orderLineItems,
			couponDiscount: totalDiscount
		};
	}
	else {

		if (coupon && coupon.percentage) {
			// since there is a coupon applied, we need to take the couponized server total because couponized total only returns a total mix of items which are eligible
			// according to the coupon
			totalDiscount = Math.round(couponizedServerTotal * coupon.percentage / 100);

			orderLineItems = orderLineItems.map(lineItem => {
				return {
				...lineItem,
				couponDiscount: Math.round(lineItem.qty * lineItem.price * coupon.percentage / 100)
			}});
		}

		if (coupon && coupon.flatRate) {
			totalDiscount = Math.round(coupon.flatRate);
			let flatRateDiscount = totalDiscount;

			orderLineItems = orderLineItems.map(lineItem => {
				if (flatRateDiscount > 0) {
					const amount = (lineItem.qty * lineItem.price) - (lineItem.discount || 0);
					const discount = Math.min(flatRateDiscount, amount);
					flatRateDiscount = flatRateDiscount - amount;

					return {
						...lineItem,
						couponDiscount: discount
					};
				}
				console.log('itemwa print karo bhai: ', lineItem);
			});
		}
	}

	/** commenting following block because we will be validating this in the order as we will need to add up discount + coupon in order to do that, and here we dont have discount */
	// let's verify if the total got in the lineItems matches the total we calculated

	// console.log('total supplied: ', totalSuppliedFromFrontEnd, ' total ours: ', serverTotal, ' and discount: ', totalDiscount, ' ; front end discount: ', order.totalDiscount);

	// if ((order.couponDiscount) === (totalDiscount)) {
	// 	// bingo, amount matched
	// }
	// else {
	// 	const error = new Error('Not a valid amount. Please check it again');
	// 	error.isError = true;
	// 	throw error;
	// }

	// let's save the coupon usage

	const couponMapping = {
		name: coupon.couponName,
		userId: callingUserId,
		usedAt: new Date(),
		couponId: coupon.id
	};

	await dal.saveData(db.couponUserMapping, couponMapping, undefined, callingUserId, transaction);

	return {
		items: orderLineItems,
		couponDiscount: totalDiscount,
		cartDiscount
	};
};




