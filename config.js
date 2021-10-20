const config = {
	ENVIRONMENT: process.env.MODE, // prod = production, dev = running node on same machine, staging = staging, localnetwork means running on network using an IP
	ENCRYPTION_KEY: process.env.ENCRYPTION_KEY, // this key will be used to encrypt and decrypt any token
	INJECTED_KEY: process.env.INJECTED_KEY, // this key will be used to identify the jsonwebtoken
	JWT_SECRET: process.env.JWT_SECRET, // the secret key to be used for encrypting jwt
	TOKEN_ALLOWED_FOR_HOW_LONG: '20000h',
	OTP_ALLOWED_FOR_HOW_LONG: '15', // in minutes
	OTP_LENGTH: 4,
	PASSWORD_ITERATIONS: 100,
	VERIFICATION_HASH_ALLOWED_FOR_HOW_LONG_SECONDS: 1080,
	USE_Q: false, // it will be used when we will use the queuing system
	LOG_LEVEL: 1,
	LOGS_TO_ACCUMULATE: 0,
	OPR_KEY: process.env.OPR_KEY,
	DB_ROWS_LIMIT: 5000, // by default to return how many values
	DEBUG: true, // if true, logging will be deep
	SUPER_ADMIN: 'Super Admin',
	JWT: {
		ISSUER: 'Anand Group',
		SUBJECT: 'Auth Token',
		AUDIENCE: 'Anand Users',
		ALGORITHM: 'RS256',
	},
	STAGING: {
		//CODE: '@Bc123',
		CODE: 'PG13',
		SHOULD_SEND_EMAIL: true,
		SHOULD_SEND_OTP: false,
	},
	MODULES: ['User', 'UserAccess'], // List of all models here.

	// open modules mean that if the property is set as  true, it has the open route access,
	// please note that the properties are full lowercase
	// all: true means any request is going to fine for that particular module

	OPEN_MODULES: {
		otp: {
			all: true,
		},

		image: {
			list: true
		},
		'user': {
			list: true
		},
		'account-login': {
			all: true,
		},
		'account-register-login': {
			all: true,
		},
		'account-accountverify-otp': {
			all: true,
		},
		'account-update-profile': {
			all: true,
		},
		'account-resend-otp': {
			all: true,
		},
		'account-resetpassword': {
			all: true,
		},
		'account-forgotpassword': {
			all: true,
		}, 
		'user': {
			list: true
		}, 
		'account-register': {
			all: true
		},
		'otp-email-verification-verify-otp': {
			all: true
		},
		'otp-password-verification-verify-otp': {
			all: true
		}, 
		'admin': {
			all: true
		}, 
		// 'chimpmail-update-mailchimp': {
		// 	all: true
		// },
	}, // this will be the modules which are open totally, and doesn't require special access to save data. For example, registration

	// We will keep a config for identifying if we wanna send information to user on which step of orders

	ORDER_EMAIL_CONFIG: {
		ON_CREATE: true,
		ON_CANCEL: true
	},

	URLs: {
		DEV: 'http://nokia.pragaut.com/',
		PROD: 'http://nokia.pragaut.com/',
		RAZOR_PAY_URL: 'https://api.razorpay.com/v1/',
	},

	SEQUELIZE: {
		host: process.env.HOST,
		username: process.env.DBUSER,
		password: process.env.PASSWORD,
		database: process.env.DATABASE,
		dialect: 'mysql',
		multipleStatements: true,
		timezone: '+05:30',
		logging: process.env.MODE !== 'production' ? console.log : undefined,
		pool: {
			max: 100,
			min: 0,
			idleF: 10000,
			acquire: 30000,
		}
	},

	USER_TYPE: {
		ANANDGROUP: 'Anand-Group',
		GROUPCOMPANY: 'Group-Company',
	},

	EMAILS: {
		ERROR: 'pragauttechnologies@gmail.com',
		NO_REPLY: 'noreply@anandgroup.com',
		ADMIN: 'pardeepbhardwaj10@gmail.com',
	},

	PAYMENT_DIRECTIONS: {
		BOTH: 'both',
		IN: 'in',
		OUT: 'out',
	},

	PAYMENT_TYPES: {
		RAZOR_PAY: 'razor-pay',
		MANUAL: 'manual',
	},

	REFUND: {
		RETURN_FEES: true,
	},


	SHARK_SCOPE: {
		KEYS: {
			META: {
				HASH: '@metadataHash',
				TIME_STAMP: '@timestamp',
				SUCCESS: '@success'
			},

			USER_INFO: {
				HAS_FACEBOOK: '@hasFacebook',
				HAS_TWITTER: '@hasTwitter',
				LOGGED_IN: '@loggedIn',
				OPTED_IN_FOR_NEWSLETTER: '@optedInForNewsLetter',
				USERNAME: 'Username',
				COUNTRY: 'Country',
				CURRENCY: 'Currency',
				REMAINING_SEARCHES: 'RemainingSearches',
				RENEWAL_DATE: 'RenewalDate',
			},
		}
	},
};


const requiredFields = {
	register: ['username','password'],
	registerLogin: ['userName', 'userNameType'],
	updateProfile: ['firstName', 'lastName', 'MobileEmail', 'userNameType'],
	event: ['name', 'url', 'buyInAmount', 'scheduledStart'],
	login: ['email', 'password'],
	login_OTP: ['userName', 'OTP'],
	login_social: ['email', 'token'],
	groupMaster: ['groupName', 'groupCode'],
	roleMaster: ['roleName'],
	//invoicePaymentDetails: ['paymentAmount'],
};

/**
 * Access Config will be used for providing access level details for a particular modules
 * for example, let's say I have assigned Staker an access level 1 for Event, but there are some other end
 * points for event which I want to hold, I will mention it here, if I don't mention, then it will be assumed
 * that any (get) endpoint with access 1 will be available for users, (post) endpoint with access of 12 will be
 * available for users
 */
const accessConfig = [
	{ name: 'eventlist', minimumAccess: 1, maximumAccess: 5 },
	{ name: 'order-gettracking', minimumAccess: 0, maximumAccess: 5 },
	{ name: 'eventlist', minimumAccess: 1, maximumAccess: 5 },
	{ name: 'unregister', minimumAccess: 20, maximumAccess: 10000 },
];


const listAttributes = {
	user: [
		'id', 
		'username', 
		'employeeId', 
		'roleId', 
		'password', 
		'saltPassword', 
		'accessGroupId', 
		'isActive', 
		'createdAt', 
		'updatedAt'
	]
};


const listAttributes_minimum = {
	user: ['id', 'username'],
};


const columnsToImport = {
	product: {
		VENDOR_NAME: 'vendorName',
		VENDOR_CODE: 'vendorCode',
		BRAND_NAME: 'brand',
		PRODUCT_NAME: 'productName',
		PRODUCT_DESCRIPTION: 'productDescription',
		PRODUCT_SKU: 'productSKU',
		SLUG: 'slug',
		VARIATION_SKU: 'variationSKU',
		SIZE: 'size',
		QTY: 'qty',
		HIGH_PRICE: 'highPrice',
		PRICE: 'price',
		COLOR: 'color',
		MATERIAL: 'material',
		SLEEVE: 'sleeve',
		PATTERN: 'pattern',
		NECK: 'neck',
		FIT: 'fit',
		WASH_CARE: 'washCare',
		SIZECHART_LENGTH: 'sizeChart_Length',
		SIZECHART_WAISTE: 'sizeChart_Waiste',
		SIZECHART_CHEST: 'sizeChart_Chest',
		SIZECHART_SLEEVE_LENGTH: 'sizeChart_SleeveLength',
		SIZECHART_INSEAM_LENGTH: 'sizeChart_InseamLength',
		SIZECHART_NECK: 'sizeChart_Neck',
		SIZECHART_BUST: 'sizeChart_Bust',
		SIZECHART_BRAND_SIZE: 'sizeChart_BrandSize',
		SIZECHART_SHOULDER: 'sizeChart_Shoulder',
		IMAGE_1: 'image_1',
		IMAGE_2: 'image_2',
		IMAGE_3: 'image_3',
		IMAGE_4: 'image_4',
		IMAGE_5: 'image_5',
		IMAGE_6: 'image_6',
		IMAGE_7: 'image_7',
		IMAGE_8: 'image_8',
		IMAGE_9: 'image_9',
		IMAGE_10: 'image_10',
		CATEGORY: 'category'
	}
};


module.exports.config = config;
module.exports.accessConfig = accessConfig;
module.exports.requiredFields = requiredFields;
module.exports.listAttributes = listAttributes;;
module.exports.columnsToImport = columnsToImport;
