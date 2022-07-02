import BaseJoi from "joi";
import DateExtension from "joi-date-extensions";
const Joi = BaseJoi.extend(DateExtension);

export var validateBody = (schema) => {
  return (req, res, next) => {
    console.log(req.body);
    try {
      const result =
        req.method != "GET"
          ? Joi.validate(req.body, schema)
          : Joi.validate(req.query, schema);
      if (result.error) {
        var errors = [];
        if (result.error.isJoi) {
          for (let i = 0; i < result.error.details.length; i++) {
            errors.push(result.error.details[i].message);
          }
        }

        console.log("Body:", req.body);
        console.log("Query:", req.query);
        console.log("Error from validation JOI:", errors);

        return res.status(500).json({ success: false, errors: errors });
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export var schemas = {

	/* doctor authentication part */

	doctorLoginSchema: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),
	doctorLoginSchemaFacebook: Joi.object().keys({
		identifier: Joi.string().required(),
		phone: Joi.string().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		name: Joi.string().optional().allow(null).empty(''),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),
	doctorLoginSchemaGmail: Joi.object().keys({
		identifier: Joi.string().required(),
		name: Joi.string().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		phone: Joi.string().optional().allow(null).empty(''),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),
	doctorRegisterSchema: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.string().required(),
		password: Joi.string().required(),
		isDoctor: Joi.boolean().required(),
		email: Joi.string().email().required(),
		organisationName: Joi.string().required(),
	}),
	doctorVerifyOTPSchema: Joi.object().keys({
		key: Joi.string().required(),
		otp: Joi.string().required()
	}),
	doctorResendOTPSchema: Joi.object().keys({
		key: Joi.string().required()
	}),

	userOTP: Joi.object().keys({
		phone: Joi.string().required(),
		countryCode: Joi.string().optional().allow(null).empty(''),
	}),

	doctorAddSchema: Joi.object().keys({
		email: Joi.string().optional().allow(null).empty(''),
		phone: Joi.string().required(),
		name: Joi.string().required(),
		password: Joi.string().required(),
		specialityIds: Joi.array().items(Joi.number()),
		organisationIds: Joi.array().items(Joi.number()),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		color: Joi.string().optional().allow(null).empty(''),
		userType: Joi.string().valid(['doctor', 'staff']).required(),
		gender: Joi.string().valid(['male', 'female', 'other']).required(),
	}),

	doctorUpdateSchema: Joi.object().keys({
		vendorId: Joi.number().required().min(1),
		email: Joi.string().optional().allow(null).empty(''),
		phone: Joi.string().required(),
		name: Joi.string().required(),
		password: Joi.string().required(),
		specialityIds: Joi.array().items(Joi.number()),
		organisationIds: Joi.array().items(Joi.number()),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		color: Joi.string().optional().allow(null).empty(''),
		userType: Joi.string().valid(['doctor', 'staff']).required(),
		gender: Joi.string().valid(['male', 'female', 'other']).required(),
	}),

	deleteVendorSchema: Joi.object().keys({
		vendorId: Joi.number().required().min(1),
	}),
	/* user authentication part */

	userLoginSchema: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),
	userLoginSchemaFacebook: Joi.object().keys({
		identifier: Joi.string().required(),
		name: Joi.string().optional().allow(null).empty(''),
		phone: Joi.string().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),
	userLoginSchemaGmail: Joi.object().keys({
		identifier: Joi.string().required(),
		name: Joi.string().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		phone: Joi.string().optional().allow(null).empty(''),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),
	userRegisterSchema: Joi.object().keys({
		phone: Joi.string().required(),
		email: Joi.string().email().required(),
	}),
	userVerifyOTPSchema: Joi.object().keys({
		key: Joi.string().required(),
		otp: Joi.string().required()
	}),
	userResendOTPSchema: Joi.object().keys({
		key: Joi.string().required()
	}),

	/* submit user detail */

	userDetailschema: Joi.object().keys({
		dob: Joi.date().optional().allow(null).empty(''),
		name: Joi.string().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		height: Joi.number().optional().allow(null),
		password: Joi.date().optional().allow(null).empty(''),
		weight: Joi.number().optional().allow(null),
		bloodGroup: Joi.string().optional().allow(null).empty(''),
		gender: Joi.string().valid(['male', 'female', 'other']).optional().allow(null).empty(''),
	}),

	/* forgot password */

	forgotPasswordSchema: Joi.object().keys({
		emailorphone: Joi.string().required(),
	}),
	forgotpasswordSchemaForUser: Joi.object().keys({
		key: Joi.string().required(),
		type: Joi.string().valid(['doctor', 'patient']).required(),
		newPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@!%*#?&]).{8,20}$/).min(8).required().error((err) => {
			return 'Password has to be between 8 to 15 characters which contain at least one numeric digit, one uppercase and one lowercase letter'
		}),
		confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().error((err) => { return "Password does not match." }),
	}),
	/* admin */

	adminLoginSchema: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),

	/* categorySchema */

	categoryCreateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().required(),
		icon: Joi.string().optional().allow(null).empty(''),
		categoryFor: Joi.string().valid(['patient','doctor','both']).required(),
	}),
	categoryUpdateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().required(),
		categoryId: Joi.number().required().min(1),
		icon: Joi.string().optional().allow(null).empty(''),
		categoryFor: Joi.string().valid(['patient','doctor','both']).required(),
	}),

	/* subcategorySchema */

	subcategoryListSchema: Joi.object().keys({
		categoryId: Joi.number().required().min(1),
	}),

	subcategoryGetSchema: Joi.object().keys({
		subCategoryId: Joi.number().required().min(1),
	}),

	defaultUnitSchema: Joi.object().keys({
		unitId: Joi.number().required().min(1),
		subCategoryId: Joi.number().required().min(1),
	}),

	subcategorySchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().required(),
		categoryId: Joi.number().required().min(1),
		labReportId: Joi.number().optional().allow(null).empty('')
	}),

	subcategoryupdateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().required(),
		image: Joi.string().optional().allow(null).empty(''),
		subCategoryId: Joi.number().required().min(1),
		labReportId: Joi.number().optional().allow(null).empty('')
	}),

	favourite: Joi.object().keys({
		subCategoryId: Joi.number().required().min(1),
	}),

	vaccineSubscribed: Joi.object().keys({
		pincode: Joi.number().required(),
		deviceToken: Joi.string().optional().allow(null).empty(''),
	}),

	userdetailCreate: Joi.object().keys({
		description: Joi.string().required(),
		subCategoryId: Joi.number().required().min(1),
		details: Joi.array().required().items(Joi.object().keys({
			title: Joi.string().required(),
			label: Joi.string().required(),
			options: Joi.string().optional().allow(null).empty(''),
			value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
		})),
		type: Joi.string().optional().allow(null).empty(''),
		date: Joi.string().optional().allow(null).empty(''),
		time: Joi.string().optional().allow(null).empty(''),
		memberId: Joi.number().optional().allow(null).empty('')
	}),

	userdetailUpdate: Joi.object().keys({
		description: Joi.string().required(),
		subCategoryId: Joi.number().required().min(1),
		details: Joi.array().required().items(Joi.object().keys({
			title: Joi.string().required(),
			label: Joi.string().required(),
			options: Joi.string().optional().allow(null).empty(''),
			SubCategoryDetailMetaId: Joi.number().required().min(1),
			value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
		})),
		type: Joi.string().optional().allow(null).empty(''),
		date: Joi.string().optional().allow(null).empty(''),
		time: Joi.string().optional().allow(null).empty(''),
		subCategoryDetailId: Joi.number().required().min(1),
		memberId: Joi.number().optional().allow(null).empty(''),
	}),

	userdetaildelete: Joi.object().keys({
		subCategoryDetailId: Joi.number().required().min(1),
		memberId: Joi.number().optional().allow(null).empty(''),
	}),

	userdetailList: Joi.object().keys({
		subCategoryId: Joi.number().required().min(1),
		memberId: Joi.number().optional().allow(null).empty(''),
	}),

	userdetailSingleList: Joi.object().keys({
		subCategoryId: Joi.number().required().min(1),
		subCategoryDetailId: Joi.number().required().min(1),
		memberId: Joi.number().optional().allow(null).empty(''),
	}),

	/* organisation */

	organisationList: Joi.object().keys({
		search: Joi.string().optional().allow(null).empty(''),
	}),

	organisationCreate: Joi.object().keys({
		name: Joi.string().required(),
		sortName: Joi.string().optional().allow(null).empty(''),
		address1: Joi.string().required(),
		address2: Joi.string().optional().allow(null).empty(''),
		country: Joi.string().required(),
		city: Joi.string().optional().allow(null).empty(''),
		state: Joi.string().required(),
		pincode: Joi.string().required(),
		logo: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		latitude: Joi.string().optional().allow(null).empty(''),
		longitude: Joi.string().optional().allow(null).empty(''),
	}),

	organisationUpdate: Joi.object().keys({
		name: Joi.string().required(),
		sortName: Joi.string().optional().allow(null).empty(''),
		address1: Joi.string().required(),
		address2: Joi.string().optional().allow(null).empty(''),
		country: Joi.string().required(),
		city: Joi.string().optional().allow(null).empty(''),
		state: Joi.string().required(),
		pincode: Joi.number().required(),
		logo: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		organisationId: Joi.number().required().min(1),
		latitude: Joi.string().optional().allow(null).empty(''),
		longitude: Joi.string().optional().allow(null).empty(''),
	}),

	organisationCreateEhr: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.string().optional().allow(null).empty(''),
		sortName: Joi.string().optional().allow(null).empty(''),
		address1: Joi.string().required(),
		address2: Joi.string().optional().allow(null).empty(''),
		country: Joi.string().required(),
		city: Joi.string().optional().allow(null).empty(''),
		state: Joi.string().required(),
		pincode: Joi.string().required(),
		amenities: Joi.array().items(Joi.number()),
		logo: Joi.string().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		latitude: Joi.string().optional().allow(null).empty(''),
		longitude: Joi.string().optional().allow(null).empty(''),
	}),

	organisationUpdateEhr: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.string().optional().allow(null).empty(''),
		sortName: Joi.string().optional().allow(null).empty(''),
		address1: Joi.string().required(),
		address2: Joi.string().optional().allow(null).empty(''),
		country: Joi.string().required(),
		city: Joi.string().optional().allow(null).empty(''),
		state: Joi.string().required(),
		pincode: Joi.number().required(),
		amenities: Joi.array().items(Joi.number()),
		logo: Joi.string().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		organisationId: Joi.number().required().min(1),
		latitude: Joi.string().optional().allow(null).empty(''),
		longitude: Joi.string().optional().allow(null).empty(''),
	}),

	organisationDelete: Joi.object().keys({
		organisationId: Joi.number().required().min(1),
	}),

	/* qualifications */

	qualificationList: Joi.object().keys({
		search: Joi.string().optional().allow(null).empty(''),
	}),

	qualificationCreate: Joi.object().keys({
		degreeName: Joi.string().optional().allow(null).empty(''),
		collegeName: Joi.string().optional().allow(null).empty(''),
		completionYear: Joi.string().optional().allow(null).empty(''),
		degree: Joi.string().optional().allow(null).empty(''),
		educationType: Joi.string().valid(['Graduation', 'Post_Graduation', 'Achievement', 'Other']).required(),
	}),

	qualificationUpdate: Joi.object().keys({
		degreeName: Joi.string().optional().allow(null).empty(''),
		collegeName: Joi.string().optional().allow(null).empty(''),
		educationType: Joi.string().optional().allow(null).empty(''),
		completionYear: Joi.string().optional().allow(null).empty(''),
		degree: Joi.string().optional().allow(null).empty(''),
		qualificationId: Joi.number().required().min(1),
	}),

	qualificationDelete: Joi.object().keys({
		qualificationId: Joi.number().required().min(1),
	}),

	/* Branch */
	createBranchSchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	updateBranchSchema: Joi.object().keys({
		title: Joi.string().required(),
		branchId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	/* service */

	serviceCreateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	serviceUpdateSchema: Joi.object().keys({
		name: Joi.string().required(),
		serviceId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	createSymptomSchema: Joi.object().keys({
		title: Joi.string().required(),
		isFeatured: Joi.boolean().required(),
		specialityIds: Joi.array().items(Joi.string()),
		symptomCategoryId: Joi.number().required().min(1),
		icon: Joi.string().optional().allow(null).empty(''),
		isFeaturedTicketingSystem: Joi.boolean().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	updateSymptomSchema: Joi.object().keys({
		title: Joi.string().required(),
		isFeatured: Joi.boolean().required(),
		symptomId: Joi.number().required().min(1),
		specialityIds: Joi.array().items(Joi.string()),
		symptomCategoryId: Joi.number().required().min(1),
		isFeaturedTicketingSystem: Joi.boolean().required(),
		icon: Joi.string().optional().allow(null).empty(''),
		unicon: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	createSymptomCategorySchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	updateSymptomCategorySchema: Joi.object().keys({
		title: Joi.string().required(),
		symptomCategoryId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	/* Degree */
	createdegreeSchema: Joi.object().keys({
		name: Joi.string().required()
	}),
	updatedegreeSchema: Joi.object().keys({
		name: Joi.string().required(),
		degreeId: Joi.number().required().min(1),
	}),
	/* speciality */
	createspecialitySchema: Joi.object().keys({
		name: Joi.string().required(),
		isFeatured: Joi.boolean().required(),
		isFeaturedTicketingSystem: Joi.boolean().required(),
		description: Joi.string().optional().allow(null).empty(''),
		icon: Joi.string().optional().allow(null).empty(''),
	}),
	updatespecialitySchema: Joi.object().keys({
		name: Joi.string().required(),
		isFeatured: Joi.boolean().required(),
		specialityId: Joi.number().required().min(1),
		isFeaturedTicketingSystem: Joi.boolean().required(),
		icon: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),
	/* Member */
	createMemberSchema: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.number().required(),
		relation: Joi.string().required(),
		dob: Joi.date().iso().required(),
		age: Joi.number().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		weight: Joi.number().optional().allow(null).empty(''),
		height: Joi.number().optional().allow(null).empty(''),
		profile: Joi.string().optional().allow(null).empty(''),
		password: Joi.string().optional().allow(null).empty(''),
		bloodGroup: Joi.string().optional().allow(null).empty(''),
		gender: Joi.string().valid(['male', 'female', 'other']).required(),
	}),
	updateMemberSchema: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.number().required(),
		relation: Joi.string().required(),
		dob: Joi.date().iso().required(),
		memberId: Joi.number().required().min(1),
		age: Joi.number().optional().allow(null).empty(''),
		email: Joi.string().optional().allow(null).empty(''),
		weight: Joi.number().optional().allow(null).empty(''),
		height: Joi.number().optional().allow(null).empty(''),
		profile: Joi.string().optional().allow(null).empty(''),
		password: Joi.string().optional().allow(null).empty(''),
		bloodGroup: Joi.string().optional().allow(null).empty(''),
		gender: Joi.string().valid(['male', 'female', 'other']).required(),
	}),
	deleteMemberSchema: Joi.object().keys({
		memberId: Joi.number().required().min(1),
	}),
	memberProfileImageSchema: Joi.object().keys({
		memberId: Joi.number().required().min(1),
	}),
	/* Health patameters */
	healthParameterCreateSchema: Joi.object().keys({
		url: Joi.string().required(),
		name: Joi.string().required(),
		subCategoryId: Joi.number().required().min(1),
		type: Joi.string().valid(['blog', 'video']).required(),
		thumbnail: Joi.string().optional().allow(null).empty(''),
	}),
	healthParameterUpdateSchema: Joi.object().keys({
		url: Joi.string().required(),
		name: Joi.string().required(),
		subCategoryId: Joi.number().required().min(1),
		healthParameterId: Joi.number().required().min(1),
		type: Joi.string().valid(['blog', 'video']).required(),
		thumbnail: Joi.string().optional().allow(null).empty(''),
	}),
	/* Health Feeds */
	healthFeedCreateSchema: Joi.object().keys({
		url: Joi.string().required(),
		name: Joi.string().required(),
		type: Joi.string().valid(['blog', 'video']).required(),
		thumbnail: Joi.string().optional().allow(null).empty(''),
	}),
	healthFeedUpdateSchema: Joi.object().keys({
		url: Joi.string().required(),
		name: Joi.string().required(),
		healthFeedId: Joi.number().required().min(1),
		type: Joi.string().valid(['blog', 'video']).required(),
		thumbnail: Joi.string().optional().allow(null).empty(''),
	}),

	updateProfile: Joi.object().keys({
		key: Joi.string().valid(['email', 'contactNo', 'password', 'name', 'gender', 'age', 'description', 'yearOfExperience', 'registrationCouncil', 'registrationNo']).required(),
		value: Joi.alternatives().try(Joi.string(), Joi.number()).required()
	}),

	updateProfileNew: Joi.object().keys({
		email: Joi.string().optional().allow(null).empty(''),
		phone: Joi.number().required(),
		name: Joi.string().optional().allow(null).empty(''),
		gender: Joi.string().valid(['male', 'female', 'other']).required(),
		yearOfExperience: Joi.string().optional().allow(null).empty(''),
		registrationCouncil: Joi.string().optional().allow(null).empty(''),
		registrationNo: Joi.string().optional().allow(null).empty(''),
		color: Joi.string().optional().allow(null).empty(''),
	}),

	updatePrice: Joi.object().keys({
		price: Joi.number().required(),
		sellPrice: Joi.number().optional().allow(null).empty(''),
	}),

	updateProfileBranch: Joi.object().keys({
		branchIds: Joi.array().items(Joi.number()),
	}),

	updateProfileLanguages: Joi.object().keys({
		languageIds: Joi.array().items(Joi.number()),
	}),

	updateProfileSpeciality: Joi.object().keys({
		specialityIds: Joi.array().items(Joi.number()),
	}),

	inClinicTypeCreate: Joi.object().keys({
		slotDuration: Joi.number().required().min(0),
		ticketingPrice: Joi.number().required().min(0),
		inClinicType: Joi.string().valid(['ticketingSystem', 'appointmentSystem']).required()
	}),

	prescriptionPad: Joi.object().keys({
		autoHeader: Joi.boolean().required(),
		width: Joi.number().required().min(0),
		height: Joi.number().required().min(0),
		paddingTop: Joi.number().required().min(0),
		paddingRight: Joi.number().required().min(0),
		paddingBottom: Joi.number().required().min(0),
		paddingLeft: Joi.number().required().min(0),
	}),

	doctorList: Joi.object().keys({
		search: Joi.string().optional().allow(null).empty(''),
		location: Joi.string().optional().allow(null).empty(''),
		latitude: Joi.number().optional().allow(null).empty(''),
		longitude: Joi.number().optional().allow(null).empty(''),
		symptomIds: Joi.array().items(Joi.number()).optional().allow(null).empty(''),
		specialityIds: Joi.array().items(Joi.number()).optional().allow(null).empty(''),
	}),

	getDoctor: Joi.object().keys({
		doctorId: Joi.number().required().min(1)
	}),

	getAmount: Joi.object().keys({
		doctorId: Joi.number().required().min(1),
		appointmentType: Joi.string().valid(['teleConsultation', 'inClinic']).required()
	}),

	applyWalletAmount: Joi.object().keys({
		doctorId: Joi.number().required().min(1),
		coupon: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().valid(['wallet', 'coupon']).required(),
		appointmentType: Joi.string().valid(['teleConsultation', 'inClinic']).required()
	}),

	/* doctor slot create */
	createSlots: Joi.object().keys({
		endTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		startTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		weekDays: Joi.array().items(Joi.string()),
	}),

	updateSlots: Joi.object().keys({
		endTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		startTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		slotTimeId: Joi.number().required().min(1),
	}),

	createSlotsInclinic: Joi.object().keys({
		shift: Joi.string().required(),
		weekDays: Joi.array().items(Joi.string()),
		endTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		startTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
	}),

	updateSlotsInclinic: Joi.object().keys({
		shift: Joi.string().required(),
		slotTimeId: Joi.number().required().min(1),
		endTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		startTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
	}),

	deleteSlots: Joi.object().keys({
		slotTimeId: Joi.number().min(1).required(),
	}),

	deleteSlotTotal: Joi.object().keys({
		slotId: Joi.number().min(1).required(),
	}),

	/* Appointments create */
	createAppointment: Joi.object().keys({
		startTime: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		symptoms: Joi.array().required().items(Joi.object().keys({
			symptomId: Joi.number().min(1).required(),
			description: Joi.string().optional().allow(null).empty(''),
		})),
		medicalAlerts: Joi.array().optional().items(Joi.object().keys({
			medicalAlertId: Joi.number().min(1).required(),
			value: Joi.boolean().optional().allow(null).empty(''),
		})),
		date: Joi.date().iso().required(),
		memberId: Joi.number().required().min(1),
		vendorId: Joi.number().required().min(1),
		details: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		appointmentType: Joi.string().valid(['teleConsultation', 'inClinic']).required(),

		couponId: Joi.number().optional().allow(null),
		isWallet: Joi.boolean().required(),
		actualAmount: Joi.number().required().min(0),
		applyWalletAmount: Joi.number().required().min(0),
		transactionId: Joi.string().optional().allow(null).empty(''),
		paymentStatus: Joi.string().valid(['pending', 'success', 'error']).required(),
	}),

	cancleAppointment: Joi.object().keys({
		appointmentId: Joi.number().required().min(1),
	}),

	/*Notification Create */

	notificationCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		url: Joi.string().optional().allow(null).empty(''),
		scheduleAt: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().required(),
		type: Joi.string().required(),
		forType: Joi.string().required(),
		icon: Joi.string().optional().allow(null).empty(''),
	}),
	notificationUpdateSchema: Joi.object().keys({
		notificationId: Joi.number().required().min(1),
		title: Joi.string().required(),
		url: Joi.string().optional().allow(null).empty(''),
		scheduleAt: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().required(),
		type: Joi.string().required(),
		forType: Joi.string().required(),
		icon: Joi.string().optional().allow(null).empty(''),
	}),
	/* Coupon */
	createCoupon: Joi.object().keys({
		title: Joi.string().required(),
		promoCode: Joi.string().required(),
		description: Joi.string().required(),
		noOfUsers: Joi.number().required().min(1),
		amount: Joi.number().optional().allow(null).empty(''),
		maximumDiscount: Joi.number().optional().allow(null).empty(''),
		minimumValue: Joi.number().optional().allow(null).empty(''),
		discount: Joi.number().optional().allow(null).empty(''),
		validFrom: Joi.date().iso().required(),
		validTo: Joi.date().iso().required(),
		forAllBranch: Joi.boolean().required(),
		forAllDoctor: Joi.boolean().required(),
		type: Joi.string().valid(['Vendor', 'User']).required(),
	}),
	updateCoupon: Joi.object().keys({
		title: Joi.string().required(),
		promoCode: Joi.string().required(),
		validFrom: Joi.date().iso().required(),
		validTo: Joi.date().iso().required(),
		couponId: Joi.number().required().min(1),
		description: Joi.string().required(),
		forAllBranch: Joi.boolean().required(),
		forAllDoctor: Joi.boolean().required(),
		noOfUsers: Joi.number().required().min(1),
		amount: Joi.number().optional().allow(null).empty(''),
		type: Joi.string().valid(['Vendor', 'User']).required(),
		discount: Joi.number().optional().allow(null).empty(''),
		maximumDiscount: Joi.number().optional().allow(null).empty(''),
		minimumValue: Joi.number().optional().allow(null).empty(''),
	}),
	deleteCoupon: Joi.object().keys({
		couponId: Joi.number().required().min(1),
	}),
	branchCoupon: Joi.object().keys({
		branchIds: Joi.array().items(Joi.number()),
		couponId: Joi.number().required().min(1),
	}),
	specialityCoupon: Joi.object().keys({
		specialityIds: Joi.array().items(Joi.number()),
		couponId: Joi.number().required().min(1),
	}),
	doctorCoupon: Joi.object().keys({
		doctorIds: Joi.array().items(Joi.number()),
		couponId: Joi.number().required().min(1),
	}),

	/* Examination Validate*/

	examinationCreateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),
	examinationUpdateSchema: Joi.object().keys({
		examinationId: Joi.number().required().min(1),
		name: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),


	/* Diagnosis Validate*/

	diagnosisCreateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().required(),
	}),
	diagnosisUpdateSchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().required(),
		diagnosisId: Joi.number().required().min(1),


	}),


	/* Help Question Validate*/

	helpquestionCreateSchema: Joi.object().keys({
		question: Joi.string().required(),
		description: Joi.string().required(),
	}),
	helpquestionUpdateSchema: Joi.object().keys({
		question: Joi.string().required(),
		description: Joi.string().required(),
		helpQuestionId: Joi.number().required().min(1),
	}),

	/* Help Report Validate*/

	helpreportCreateSchema: Joi.object().keys({
		helpQuestionId: Joi.number().required().min(1),
		message: Joi.string().required(),
	}),
	/* For Medicine Company */

	createmedicineCompanySchema: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),
	updatemedicineCompanySchema: Joi.object().keys({
		name: Joi.string().required(),
		medicineCompanyId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	/* For Medicine Type */

	createMedicineTypeSchema: Joi.object().keys({
		name: Joi.string().required(),
		sortcode: Joi.string().required(),
	}),

	updateMedicineTypeSchema: Joi.object().keys({
		name: Joi.string().required(),
		sortcode: Joi.string().required(),
		medicineTypeId: Joi.number().required().min(1),
	}),

	/* For Medicine */
	createMedicineSchema: Joi.object().keys({
		name: Joi.string().required(),
		composition: Joi.string().required(),
		medicineTypeId: Joi.number().required().min(1),
		medicineCompanyId: Joi.number().required().min(1),
		mrp: Joi.number().optional().allow(null).empty(''),
		cgst: Joi.number().optional().allow(null).empty(''),
		sgst: Joi.number().optional().allow(null).empty(''),
		hsn: Joi.number().optional().allow(null).empty(''),
	}),
	updateMedicineSchema: Joi.object().keys({
		name: Joi.string().required(),
		composition: Joi.string().required(),
		medicineTypeId: Joi.number().required().min(1),
		medicineCompanyId: Joi.number().required().min(1),
		mrp: Joi.number().optional().allow(null).empty(''),
		cgst: Joi.number().optional().allow(null).empty(''),
		sgst: Joi.number().optional().allow(null).empty(''),
		hsn: Joi.number().optional().allow(null).empty(''),
		medicineId: Joi.number().required().min(1),
	}),
	createMedicineOrganisationSchema: Joi.object().keys({
		quantity: Joi.number().required().min(1),
		medicineId: Joi.number().required().min(1),
		organisationId: Joi.number().required().min(1),
	}),

	/* Pedometer */
	createPedometerSchema: Joi.object().keys({
		step: Joi.number().required().min(1),
	}),

	favoriteHealthParameter: Joi.object().keys({
		subCategoryId: Joi.number().required().min(1),
		healthParameterId: Joi.number().required().min(1),
	}),

	subCategoryGraph: Joi.object().keys({
		subCategoryId: Joi.number().required().min(1),
		memberId: Joi.number().optional().allow(null).empty('')
	}),

	categoryGraph: Joi.object().keys({
		categoryId: Joi.number().optional().allow(null).empty(''),
		memberId: Joi.number().optional().allow(null).empty('')
	}),


	/* Allergy Validate*/

	allergyCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
	}),
	allergyUpdateSchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		allergyId: Joi.number().required().min(1),
	}),

	/* Medical alert Validate*/

	medicalalertCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		question: Joi.string().required(),
		specialityIds: Joi.array().items(Joi.string()),
		isAskQuestion: Joi.boolean().required()
	}),
	medicalalertUpdateSchema: Joi.object().keys({
		title: Joi.string().required(),
		question: Joi.string().required(),
		medicalalertId: Joi.number().required().min(1),
		specialityIds: Joi.array().items(Joi.string()),
		isAskQuestion: Joi.boolean().required()
	}),

	/* Dose alert Validate*/

	doseCreateSchema: Joi.object().keys({
		dose: Joi.string().required(),
	}),

	doseUpdateSchema: Joi.object().keys({
		dose: Joi.string().required(),
		doseId: Joi.number().required().min(1),
	}),

	updateuserProfileSchema: Joi.object().keys({
		key: Joi.string().valid(['name', 'email', 'password', 'phone', 'dob', 'age', 'gender', 'weight', 'height', 'bloodGroup', 'whatsApp', 'lanLine']).required(),
		value: Joi.alternatives().try(Joi.string(), Joi.number()).required()
	}),

	deviceToken: Joi.object().keys({
		deviceToken: Joi.string().required(),
	}),

	/* Specialization */
	createspecializationSchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),
	updatespecializationSchema: Joi.object().keys({
		title: Joi.string().required(),
		specializationId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	/* Medicine Note */
	createmedicinenoteSchema: Joi.object().keys({
		title: Joi.string().required(),
	}),
	updatemedicinenoteSchema: Joi.object().keys({
		title: Joi.string().required(),
		medicinenoteId: Joi.number().required().min(1),
	}),

	/* Docplix commission Validate*/
	commissionUpdateSchema: Joi.object().keys({
		amount: Joi.string().required(),
		commissionId: Joi.number().required().min(1),
	}),

	/* Prescription */
	prescriptionDetail: Joi.object().keys({
		appointmentId: Joi.number().required().min(1),
	}),
	prescriptionUpdate: Joi.object().keys({
		appointmentId: Joi.number().required().min(1),
		labFindings: Joi.string().optional().allow(null).empty(''),
		releventPoints: Joi.string().optional().allow(null).empty(''),
		specialInstructions: Joi.string().optional().allow(null).empty(''),
		examinations: Joi.array().items(Joi.string()),
		diagnosis: Joi.array().items(Joi.string()),
		medicines: Joi.array().required().items(Joi.object().keys({
			medicineName: Joi.string().required(),
			notes: Joi.string().optional().allow(null).empty(''),
			doses: Joi.string().optional().allow(null).empty(''),
			duration: Joi.string().optional().allow(null).empty(''),
			frequency: Joi.string().optional().allow(null).empty(''),
			composition: Joi.string().optional().allow(null).empty(''),
		})),
	}),

	/* Visulization category */
	createVisulizationcategorySchema: Joi.object().keys({
		name: Joi.string().required(),
		specialityIds: Joi.array().items(Joi.string()),
		icon: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		isElement: Joi.string().valid(['true', 'false']).required(),
		isSubcategory: Joi.string().valid(['true', 'false']).required(),
	}),

	updateVisulizationcategorySchema: Joi.object().keys({
		name: Joi.string().required(),
		visulizationCategoryId: Joi.number().required().min(1),
		specialityIds: Joi.array().items(Joi.string()),
		icon: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		isElement: Joi.string().valid(['true', 'false']).required(),
		isSubcategory: Joi.string().valid(['true', 'false']).required(),
	}),

	/* Visulization subcategory */
	createVisulizationsubcategorySchema: Joi.object().keys({
		name: Joi.string().required(),
		icon: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		visulizationCategoryId: Joi.number().required().min(1),
	}),

	updateVisulizationsubcategorySchema: Joi.object().keys({
		name: Joi.string().required(),
		visulizationSubcategoryId: Joi.number().required().min(1),
		icon: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	/* Visulization subcategory */
	createVisulizationelementSchema: Joi.object().keys({
		title: Joi.string().required(),
		type: Joi.string().valid('category', 'subcategory').required(),
		visulizationParentId: Joi.number().required().min(1),
	}),

	updateVisulizationelementSchema: Joi.object().keys({
		title: Joi.string().required(),
		type: Joi.string().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		visulizationParentId: Joi.number().required().min(1),
		visulizationElementId: Joi.number().required().min(1),
	}),

	/* Visulization subcategory get api */

	validateDate: Joi.object().keys({
		date: Joi.date().optional().allow(null).empty(''),
		appointmentType: Joi.string().valid(['teleConsultation', 'inClinic']).required(),
	}),

	createspeciality: Joi.object().keys({
		name: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	updatespeciality: Joi.object().keys({
		name: Joi.string().required(),
		specialityId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	deletespeciality: Joi.object().keys({
		specialityId: Joi.number().required().min(1),
	}),

	createbranch: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	updatebranch: Joi.object().keys({
		title: Joi.string().required(),
		branchId: Joi.number().required().min(1),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	createbranchEHR: Joi.object().keys({
		title: Joi.string().required(),
		amenity: Joi.array().items(Joi.number()),
		organisationId: Joi.number().required().min(1),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	updatebranchEHR: Joi.object().keys({
		title: Joi.string().required(),
		branchId: Joi.number().required().min(1),
		amenity: Joi.array().items(Joi.number()),
		organisationId: Joi.number().required().min(1),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	deleteBranch: Joi.object().keys({
		branchId: Joi.number().required().min(1),
	}),

	/* Medical History Type Validate*/
	medicalhistorytypeCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
	}),
	medicalhistorytypeUpdateSchema: Joi.object().keys({
		title: Joi.string().required(),
		medicalhistorytypeId: Joi.number().required().min(1),
	}),
	/* Medical History Option Validate*/
	medicalhistoryoptionCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		historyIds: Joi.array().items(Joi.string()),
	}),
	medicalhistoryoptionUpdateSchema: Joi.object().keys({
		title: Joi.string().required(),
		medicalhistoryoptionId: Joi.number().required().min(1),
		historyIds: Joi.array().items(Joi.string()),
	}),
	/* Follow Up Call Days */
	followupcallvalidityUpdateSchema: Joi.object().keys({
		days: Joi.number().required(),
		isCheck: Joi.number().required(),
		followupcallvalidityId: Joi.number().required().min(1),
	}),
	getSlotSchema: Joi.object().keys({
		date: Joi.date().iso().required(),
		doctorId: Joi.number().min(1).required(),
		appointmentType: Joi.string().valid(['teleConsultation', 'inClinic']).required(),
	}),

	walletCreateSchema: Joi.object().keys({
		maxDiscountAmount: Joi.number().optional().allow(null).empty(''),
		maxDiscountPercentage: Joi.number().optional().allow(null).empty('')
	}),
	/* Banner */
	createbannerSchema: Joi.object().keys({
		url: Joi.string().optional().allow(null).empty(''),
		location: Joi.string().optional().allow(null).empty(''),
		latitude: Joi.string().optional().allow(null).empty(''),
		longitude: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().valid(['Doctor', 'Speciality', 'Organisation', 'Symptom', 'External', 'Blank']).required(),
	}),
	updatebannerSchema: Joi.object().keys({
		bannerId: Joi.number().min(1).required(),
		url: Joi.string().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		location: Joi.string().optional().allow(null).empty(''),
		latitude: Joi.string().optional().allow(null).empty(''),
		longitude: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().valid(['Doctor', 'Speciality', 'Organisation', 'Symptom', 'External', 'Blank']).required(),
	}),

	/* web banner */
	createwebbannerSchema: Joi.object().keys({
		title: Joi.string().required(),
		url: Joi.string().optional().allow(null).empty(''),
		cta: Joi.string().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().valid(['Doctor', 'Speciality', 'Organisation', 'Symptom', 'External']).required(),
	}),
	updatewebbannerSchema: Joi.object().keys({
		title: Joi.string().required(),
		webBannerId: Joi.number().min(1).required(),
		cta: Joi.string().optional().allow(null).empty(''),
		url: Joi.string().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().valid(['Doctor', 'Speciality', 'Organisation', 'Symptom', 'External']).required(),
	}),
	/* Drs alert Validate*/

	drsquestionCreateSchema: Joi.object().keys({
		question: Joi.string().required(),
		answer: Joi.array().required().items(Joi.object().keys({
			answer: Joi.string().required(),
			point: Joi.string().required()
		})),
	}),

	/* Drs alert Validate*/

	drssuggestionCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		from: Joi.number().required(),
		to: Joi.number().required(),
		icon: Joi.string().optional().allow(null).empty(''),
	}),

	/* Drs alert Validate*/

	drssuggestionUpdateSchema: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		from: Joi.number().required(),
		to: Joi.number().required(),
		suggestionId: Joi.number().required().min(1),
		icon: Joi.string().optional().allow(null).empty(''),
	}),

	/* Drs alert Validate*/

	drsblogCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		url: Joi.string().required(),
		description: Joi.string().required(),
		from: Joi.number().required(),
		to: Joi.number().required(),
		type: Joi.string().required(),
		icon: Joi.string().optional().allow(null).empty(''),
	}),

	/* Drs alert Validate*/

	drsblogUpdateSchema: Joi.object().keys({
		title: Joi.string().required(),
		url: Joi.string().required(),
		description: Joi.string().required(),
		from: Joi.number().required(),
		to: Joi.number().required(),
		type: Joi.string().required(),
		blogId: Joi.number().required().min(1),
		icon: Joi.string().optional().allow(null).empty(''),
	}),

	/* Health lockar blog */

	healthLockarBlogCreateSchema: Joi.object().keys({
		name: Joi.string().required(),
		url: Joi.string().required(),
		description: Joi.string().required(),
		type: Joi.string().required(),
		thumbnail: Joi.string().optional().allow(null).empty(''),
	}),

	healthLockarBlogUpdateSchema: Joi.object().keys({
		name: Joi.string().required(),
		url: Joi.string().required(),
		description: Joi.string().required(),
		type: Joi.string().required(),
		thumbnail: Joi.string().optional().allow(null).empty(''),
		blogId: Joi.number().required().min(1),
	}),

	createDoctorSchema: Joi.object().keys({
		email: Joi.string().required(),
		mobile: Joi.string().required(),
		name: Joi.string().required(),
		isAdmin: Joi.boolean().required(),
		organizationIds: Joi.array().items(Joi.string()),
		password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@!%*#?&]).{8,20}$/).min(8).required().error((err) => {
			return 'Password has to be between 8 to 15 characters which contain at least one numeric digit, one uppercase and one lowercase letter'
		}),
	}),

	createDoctorUpdate: Joi.object().keys({
		doctorId: Joi.number().required().min(1),
		email: Joi.string().required(),
		mobile: Joi.string().required(),
		name: Joi.string().required(),
		isAdmin: Joi.boolean(),
		organizationIds: Joi.array().items(Joi.string()),
		password: Joi.string().optional().allow(null).empty('')
	}),


	mealtypeCreateSchema: Joi.object().keys({
		name: Joi.string().required(),
	}),

	mealtypeUpdateSchema: Joi.object().keys({
		name: Joi.string().required(),
		mealId: Joi.number().required().min(1),
	}),

	seminarCreateSchema: Joi.object().keys({
		title: Joi.string().required(),
		name: Joi.string().required(),
		seet: Joi.number().required(),
		regular_fee: Joi.string().required(),
		sale_fee: Joi.string().required(),
		date: Joi.string().required(),
		start_time: Joi.string().required(),
		end_time: Joi.string().required(),
		description: Joi.string().required(),
		zoom_url: Joi.string().required(),
	}),

	seminarUpdateSchema: Joi.object().keys({
		seminarId: Joi.number().required().min(1),
		title: Joi.string().required(),
		name: Joi.string().required(),
		seet: Joi.number().required(),
		regular_fee: Joi.string().required(),
		sale_fee: Joi.string().required(),
		date: Joi.string().required(),
		start_time: Joi.string().required(),
		end_time: Joi.string().required(),
		description: Joi.string().required(),
		zoom_url: Joi.string().required(),
		image: Joi.string().optional().allow(null).empty(''),
	}),


	createDrsUserAnswer: Joi.object().keys({
		answer: Joi.array().required().items(Joi.object().keys({
			questionId: Joi.number().required().min(1),
			answerId: Joi.number().required().min(1),
		})),
	}),

	getDrsBlog: Joi.object().keys({
		point: Joi.string().required(),
	}),

	titleCreate: Joi.object().keys({
		name: Joi.string().required(),
	}),

	titleUpdate: Joi.object().keys({
		name: Joi.string().required(),
		titleId: Joi.number().required().min(1),
	}),

	referralCreate: Joi.object().keys({
		name: Joi.string().required(),
	}),

	referralUpdate: Joi.object().keys({
		name: Joi.string().required(),
		referralTypeId: Joi.number().required().min(1),
	}),

	externalReferralCreate: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required(),
		phone: Joi.string().required(),
		whatsapp: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	externalReferralUpdate: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required(),
		phone: Joi.string().required(),
		externalReferrerId: Joi.number().required().min(1),
		whatsapp: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''),
	}),

	seminarRegisteredUser: Joi.object().keys({
		seminarId: Joi.number().required().min(1),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().required(),
		phone: Joi.string().required(),
		age: Joi.number().required(),
		city: Joi.string().required(),
		knownBy: Joi.string().required(),
		fee: Joi.number().required(),
	}),

	seminarPayment: Joi.object().keys({
		seminarId: Joi.number().required().min(1),
		userId: Joi.number().required().min(1),
		paymentPrice: Joi.string().required(),
		transactionId: Joi.string().optional().allow(null).empty(''),
		paymentStatus: Joi.string().optional().allow(null).empty(''),
	}),

	quizCategoryCreate: Joi.object().keys({
		name: Joi.string().required(),
		colorName: Joi.string().required()
	}),

	quizCategoryUpdate: Joi.object().keys({
		quizcategoryId: Joi.number().required().min(1),
		name: Joi.string().required(),
		colorName: Joi.string().required(),
		image: Joi.string().optional().allow(null).empty(''),
	}),

	quizCreate: Joi.object().keys({
		name: Joi.string().required(),
		questionReward: Joi.number().required().min(0), 
		isFeatured: Joi.boolean().required(), 
		image: Joi.string().optional().allow(null).empty(''),
		description: Joi.string().optional().allow(null).empty(''), 
		categoryIds: Joi.array().required().items(Joi.number())
	}),

	quizUpdate: Joi.object().keys({
		name: Joi.string().required(),
		quizId: Joi.number().required().min(1),
		questionReward: Joi.number().required().min(0), 
		isFeatured: Joi.boolean().required(), 
		description: Joi.string().optional().allow(null).empty(''), 
		image: Joi.string().optional().allow(null).empty(''),
		categoryIds: Joi.array().required().items(Joi.number())
	}),

	quizQuestionCreate: Joi.object().keys({
		quizId: Joi.number().required().min(1),
		question: Joi.string().required(),
		correctAnswer: Joi.string().required(),
		answers: Joi.array().required().items(Joi.string()),
		explanation: Joi.string().optional().allow(null).empty(''), 
		image: Joi.string().optional().allow(null).empty(''), 
	}),

	quizQuestionUpdate: Joi.object().keys({
		quizId: Joi.number().required().min(1),
		questionId: Joi.number().required().min(1),
		question: Joi.string().required(),
		answers: Joi.array().required().items(Joi.string()),
		correctAnswer: Joi.string().required(),
		explanation: Joi.string().optional().allow(null).empty(''), 
		image: Joi.string().optional().allow(null).empty(''),
	}),

	questionOfDayCreate: Joi.object().keys({
		question: Joi.string().required(),
		correctAnswer: Joi.string().required(),
		rewardValue: Joi.string().optional().allow(null).empty(''),
		answers: Joi.array().items(Joi.string().allow(null).allow('')),
		explanation: Joi.string().optional().allow(null).empty(''), 
		date: Joi.date().format('DD-MM-YYYY').required(),
		'question-1': Joi.string().optional().allow(null).empty(''), 
		'question-2': Joi.string().optional().allow(null).empty(''), 
		'question-3': Joi.string().optional().allow(null).empty(''), 
		'question-4': Joi.string().optional().allow(null).empty(''), 
	}),

	questionOfDayUpdate: Joi.object().keys({
		questionofdayId: Joi.number().required().min(1),
		question: Joi.string().required(),
		answers: Joi.array().items(Joi.string().allow(null).allow('')),
		correctAnswer: Joi.string().required(),
		rewardValue: Joi.string().optional().allow(null).empty(''),
		date: Joi.date().format('DD-MM-YYYY').required(),
		explanation: Joi.string().optional().allow(null).empty(''), 
		'question-1': Joi.string().optional().allow(null).empty(''), 
		'question-2': Joi.string().optional().allow(null).empty(''), 
		'question-3': Joi.string().optional().allow(null).empty(''), 
		'question-4': Joi.string().optional().allow(null).empty(''),
	}),
	updatePatientSpeciality: Joi.object().keys({
		patientId: Joi.number().required().min(1),
		specialityIds: Joi.array().items(Joi.string())
	}),
	specializationPatient: Joi.object().keys({
		specializationId: Joi.string().required(),
	}),
	submitQuestionofday: Joi.object().keys({
		questionId: Joi.number().required().min(1),
		answerId: Joi.number().required().min(1),
	}),
	stepCounter: Joi.object().keys({
		stepCounters: Joi.array().required().items(
			Joi.object().keys({
				steps: Joi.number().required().min(0),
				date: Joi.date().format('YYYY-MM-DD').required()
			})
		)
	}),
	addPatient: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.string().required(),
		isNew: Joi.boolean().required(), 
		dob: Joi.date().iso().optional().allow(null).empty(''),
		email: Joi.string().email().optional().allow(null).empty(''),
		height: Joi.number().optional().allow(null).empty(''),
		weight: Joi.number().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		referralTypeId: Joi.number().optional().allow(null).empty(''),
		userId: Joi.number().optional().allow(null).empty(''),
		gender: Joi.string().valid(['male', 'female', 'other']).optional().allow(null).empty(''),
		bloodGroup: Joi.string().valid(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional().allow(null).empty(''),
		preferedLanguage: Joi.number().optional().allow(null).empty(''), 
		familyHistory: Joi.string().optional().allow(null).empty(''), 
		referredBy: Joi.string().optional().allow(null).empty(''),
		address1: Joi.string().optional().allow(null).empty(''), 
		address2: Joi.string().optional().allow(null).empty(''),
		city: Joi.string().optional().allow(null).empty(''),
		pincode: Joi.string().optional().allow(null).empty(''),
		country: Joi.string().optional().allow(null).empty(''),
		organisationId: Joi.number().required().min(0),
		age:Joi.number().optional().min(0)
	}),
	updatePatient: Joi.object().keys({
		name: Joi.string().required(),
		phone: Joi.string().required(),
		dob: Joi.date().iso().optional().allow(null).empty(''),
		email: Joi.string().email().optional().allow(null).empty(''),
		height: Joi.number().optional().allow(null).empty(''),
		weight: Joi.number().optional().allow(null).empty(''),
		image: Joi.string().optional().allow(null).empty(''),
		referralTypeId: Joi.number().optional().allow(null).empty(''),
		userId: Joi.number().required(),
		gender: Joi.string().valid(['male', 'female', 'other']).optional().allow(null).empty(''),
		bloodGroup: Joi.string().valid(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional().allow(null).empty(''),
		preferedLanguage: Joi.number().optional().allow(null).empty(''), 
		familyHistory: Joi.string().optional().allow(null).empty(''), 
		referredBy: Joi.string().optional().allow(null).empty(''),
		address1: Joi.string().optional().allow(null).empty(''), 
		address2: Joi.string().optional().allow(null).empty(''),
		city: Joi.string().optional().allow(null).empty(''),
		pincode: Joi.string().optional().allow(null).empty(''),
		country: Joi.string().optional().allow(null).empty(''),
		age:Joi.number().optional().min(0)
	}),
	deletePatient:{
		userId: Joi.number().required(),
		organisationId: Joi.number().required().min(0),
	},
	updateUserPin: Joi.object().keys({
		pin: Joi.number().required(),
		confirmPin: Joi.number().valid(Joi.ref('pin')).required().options({ language: { any: { allowOnly: 'must match pin' } } })
	}),
	setUserPin: Joi.object().keys({
		pin: Joi.number().required(),
		confirmPin: Joi.number().valid(Joi.ref('pin')).required().options({ language: { any: { allowOnly: 'must match pin' } } })
	}),
	userVerifyPinSchema: Joi.object().keys({
		pin: Joi.number().required(),
	}),
	updateUserPin: Joi.object().keys({
		oldPin: Joi.number().required(),
		newPin: Joi.number().required(),
	}),
	patientReportDetail: Joi.object().keys({
		reportCategoryType: Joi.string().valid('1', '2', '3', '4').required(),
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		attachment: Joi.string().required(),
	}),
	updatePatientReportDetail: Joi.object().keys({
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		attachment: Joi.string().required(),
		reportId: Joi.number().required(),
	}),
	patientReport: Joi.object().keys({
		type: Joi.string().valid('1', '2', '3', '4').required(),
	}),
	patientLabReportDetail: Joi.object().keys({
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		attachment: Joi.string().required(),
		pathology: Joi.string().required(),
	}),
	updatePatientLabReportDetail: Joi.object().keys({
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		attachment: Joi.string().required(),
		pathology: Joi.string().required(),
		reportId: Joi.number().required(),
	}),
	patientManualReport: Joi.object().keys({
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		chiefComplain: Joi.array().items(Joi.string()),
		otherComplain: Joi.string().required(),
		historyPoint: Joi.string().required(),
		lab: Joi.string().required(),
		examination: Joi.array().items(Joi.string()),
		diagnosis: Joi.array().items(Joi.string()),
		instruction: Joi.string().required(),
	}),
	updatePatientManualReport: Joi.object().keys({
		reportId: Joi.number().required(),
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		chiefComplain: Joi.array().items(Joi.string()),
		otherComplain: Joi.string().required(),
		historyPoint: Joi.string().required(),
		lab: Joi.string().required(),
		examination: Joi.array().items(Joi.string()),
		diagnosis: Joi.array().items(Joi.string()),
		instruction: Joi.string().required(),
	}),
	patientLabManualReport: Joi.object().keys({
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		pathology: Joi.string().required(),
		labTestId: Joi.number().required(),
		parameters: Joi.array().required().items(Joi.object().keys({
			parameterId: Joi.number().required(),
			parameterUnitId: Joi.number().required(),
			parameterValue: Joi.string().required(),
		})),
	}),
	updatePatientLabManualReport: Joi.object().keys({
		reportId: Joi.number().required(),
		doctorName: Joi.string().required(),
		documentName: Joi.string().required(),
		documentDate: Joi.string().required(),
		pathology: Joi.string().required(),
		labTestId: Joi.number().required(),
		parameters: Joi.array().required().items(Joi.object().keys({
			parameterId: Joi.number().required(),
			parameterUnitId: Joi.number().required(),
			parameterValue: Joi.string().required(),
		})),
	}),

	viewReport: Joi.object().keys({
		filePath: Joi.string().required()
	}),

	searchPatientReport: Joi.object().keys({
		page: Joi.number().required(),
		key: Joi.string().optional().allow(null).empty('')
	}),
	

	creteSaleVoucher: Joi.object().keys({
		userId: Joi.number().required(), 
		total: Joi.number().required(), 
		cgst: Joi.string().optional().allow(null).empty(''), 
		sgst: Joi.string().optional().allow(null).empty(''), 
		discount: Joi.number().optional().allow(null).empty(''), 
		net: Joi.number().optional().allow(null).empty(''), 
		date: Joi.date().iso().required(),
		items: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().optional().allow(null).empty(''),
			quantity: Joi.number().required(),
			mrp: Joi.number().required(),
			total: Joi.number().required(), 
			purchaseItemId: Joi.number().required(),
			discount: Joi.number().optional().allow(null).empty(''), 
			discountPercentage: Joi.number().optional().allow(null).empty(''), 
			cgst: Joi.string().optional().allow(null).empty(''), 
			sgst: Joi.string().optional().allow(null).empty(''), 
			batchNo: Joi.number().optional().allow(null).empty(''),
		})),
	}),

	updateSaleVoucher: Joi.object().keys({
		salesVoucherId: Joi.number().required(),
		userId: Joi.number().required(), 
		total: Joi.number().required(), 
		cgst: Joi.string().optional().allow(null).empty(''), 
		sgst: Joi.string().optional().allow(null).empty(''), 
		discount: Joi.number().optional().allow(null).empty(''), 
		net: Joi.number().optional().allow(null).empty(''), 
		date: Joi.date().iso().required(),
		items: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().optional().allow(null).empty(''),
			quantity: Joi.number().required(),
			mrp: Joi.number().required(),
			total: Joi.number().required(), 
			purchaseItemId: Joi.number().required(),
			discount: Joi.number().optional().allow(null).empty(''), 
			discountPercentage: Joi.number().optional().allow(null).empty(''), 
			cgst: Joi.string().optional().allow(null).empty(''), 
			sgst: Joi.string().optional().allow(null).empty(''), 
			batchNo: Joi.number().optional().allow(null).empty(''),
			salesVoucherItemId: Joi.number().optional().allow(null).empty(''), 
		})),
	}),

	purchaseVoucherCreate: Joi.object().keys({
		pharmacyVendorId: Joi.number().required(), 
		totalBill: Joi.number().required(), 
		voucherNo: Joi.string().required(), 
		cgst: Joi.string().optional().allow(null).empty(''), 
		sgst: Joi.string().optional().allow(null).empty(''), 
		discount: Joi.number().optional().allow(null).empty(''), 
		net: Joi.number().optional().allow(null).empty(''), 
		date: Joi.date().iso().required(),
		items: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().optional().allow(null).empty(''),
			quantity: Joi.number().required(),
			free: Joi.number().optional().allow(null).empty(''), 
			costPrice: Joi.number().required(),
			mrp: Joi.number().required(),
			discountPercentage: Joi.number().optional().allow(null).empty(''),
			discountAmount: Joi.number().optional().allow(null).empty(''),
			cgst: Joi.string().optional().allow(null).empty(''), 
			sgst: Joi.string().optional().allow(null).empty(''),  
			totalAmount: Joi.number().required(),
			batchNo: Joi.number().optional().allow(null).empty(''),
			medicineId: Joi.number().optional().allow(null).empty(''),
		})),
	}),

	purchaseVoucherUpdate: Joi.object().keys({
		pharmacyVendorId: Joi.number().required(), 
		purchaseVoucherId: Joi.number().required(), 
		totalBill: Joi.number().required(), 
		voucherNo: Joi.string().required(),
		date: Joi.date().iso().required(),
		cgst: Joi.string().optional().allow(null).empty(''), 
		sgst: Joi.string().optional().allow(null).empty(''), 
		discount: Joi.number().optional().allow(null).empty(''), 
		net: Joi.number().optional().allow(null).empty(''), 
		items: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().optional().allow(null).empty(''),
			quantity: Joi.number().required(),
			free: Joi.number().optional().allow(null).empty(''), 
			costPrice: Joi.number().required(),
			mrp: Joi.number().required(),
			discountPercentage: Joi.number().optional().allow(null).empty(''),
			discountAmount: Joi.number().optional().allow(null).empty(''),
			cgst: Joi.string().optional().allow(null).empty(''), 
			sgst: Joi.string().optional().allow(null).empty(''),  
			totalAmount: Joi.number().required(),
			medicineId: Joi.number().optional().allow(null).empty(''),
			batchNo: Joi.number().optional().allow(null).empty(''),
			purchaseItemId: Joi.number().optional().allow(null).empty(''),
		})),
	}),

	statusCreate: Joi.object().keys({
		status: Joi.string().required(),
		order: Joi.string().required(),
		icon: Joi.number().optional().allow(null).empty(''),
	}),

	statusUpdate: Joi.object().keys({
		opdStatusId: Joi.number().required(),
		status: Joi.string().required(),
		order: Joi.string().required(),
		icon: Joi.number().optional().allow(null).empty(''),
	}),

	opdCreate: Joi.object().keys({
		vendorId: Joi.number().required(),
		userId: Joi.number().required(), 
		opdStatusId: Joi.number().required(),
		date: Joi.date().iso().required(),
		bp: Joi.string().optional().allow(null).empty(''), 
		height: Joi.number().optional().allow(null).empty(''), 
		weight: Joi.number().optional().allow(null).empty(''), 
		diabetic: Joi.boolean().optional().allow(null).empty(''),
		registrationFee: Joi.number().optional().allow(null).empty(''), 
	}),

	opdUpdate: Joi.object().keys({
		opdId: Joi.number().required(), 
		vendorId: Joi.number().required(),
		userId: Joi.number().required(), 
		opdStatusId: Joi.number().required(),
		date: Joi.date().iso().required(),
		bp: Joi.string().optional().allow(null).empty(''), 
		height: Joi.number().optional().allow(null).empty(''), 
		weight: Joi.number().optional().allow(null).empty(''), 
		diabetic: Joi.boolean().optional().allow(null).empty(''),
		registrationFee: Joi.number().optional().allow(null).empty(''),  
	}),

	noteCreate: Joi.object().keys({
		name: Joi.string().required(),
		template: Joi.string().required(),
	}),

	noteUpdate: Joi.object().keys({
		noteId: Joi.number().required(), 
		name: Joi.string().required(),
		template: Joi.string().required(),
	}),

	diagnosisCreate: Joi.object().keys({
		name: Joi.string().required(),
	}),

	diagnosisUpdate: Joi.object().keys({
		name: Joi.string().required(),
		diagnosesId: Joi.number().required(),
	}),

	investigationCreate: Joi.object().keys({
		name: Joi.string().required(),
	}),

	investigationUpdate: Joi.object().keys({
		name: Joi.string().required(),
		investigationId: Joi.number().required(),
	}),

	oralExaminationCreate: Joi.object().keys({
		name: Joi.string().required(),
	}),

	oralExaminationUpdate: Joi.object().keys({
		name: Joi.string().required(),
		oralExaminationId: Joi.number().required(),
	}),

	chiefComplaintCreate: Joi.object().keys({
		name: Joi.string().required(),
	}),

	chiefComplaintUpdate: Joi.object().keys({
		name: Joi.string().required(),
		chiefComplaintId: Joi.number().required(),
	}),

	examinationRecordCreate: Joi.object().keys({
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		cheifComplaints: Joi.array().items(Joi.string()),
		cheifComplaintIds: Joi.array().items(Joi.number()),
		history: Joi.string().optional().allow(null).empty(''), 
		records: Joi.array().required().items(Joi.object().keys({
			tooth: Joi.array().items(Joi.number()),
			investigationIds: Joi.array().items(Joi.number()),
			investigations: Joi.array().items(Joi.string()),
			oralExaminationIds: Joi.array().items(Joi.number()),
			oralExaminations: Joi.array().items(Joi.string()),
			diagnosisIds: Joi.array().items(Joi.number()),
			diagnosis: Joi.array().items(Joi.string()),
			noteId: Joi.number().optional().allow(null).empty(''),
			note: Joi.object().keys({
				name: Joi.string(),
				template: Joi.string(),
			})
		}))
	}),

	treatmentCreate: Joi.object().keys({
		name: Joi.string().required(),
		perUnitPrice: Joi.number().required(),
	}),

	treatmentUpdate: Joi.object().keys({
		name: Joi.string().required(),
		perUnitPrice: Joi.number().required(),
		treatmentId: Joi.number().required(),
	}),

	treatmentTemplateCreate: Joi.object().keys({
		name: Joi.string().required(),
		text: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().optional().allow(null).empty(''),
	}),
	treatmentTemplateUpdate: Joi.object().keys({
		name: Joi.string().required(),
		treatmentTemplateId: Joi.number().required(),
		text: Joi.string().optional().allow(null).empty(''),
		type: Joi.string().optional().allow(null).empty(''),
	}),

	treatmentPackageCreate: Joi.object().keys({
		name: Joi.string().required(),
		price: Joi.number().required(),
		treatmentIds: Joi.array().items(Joi.number()),
	}),
	treatmentPackageUpdate: Joi.object().keys({
		treatmentPackageId: Joi.number().required(),
		name: Joi.string().required(),
		price: Joi.number().required(),
		treatmentIds: Joi.array().items(Joi.number()),
	}),

	treatmentPlanCreate: Joi.object().keys({
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		name: Joi.string().required(),
		estimateDay: Joi.string().optional().allow(null).empty(''),
		tooth: Joi.alternatives().try(Joi.string(), Joi.array()),
		treatments: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().required(), 
			perUnitCost: Joi.number().required(),
			tooth: Joi.array().items(Joi.number()), 
			discountPercentage: Joi.number().required(), 
			discountAmount: Joi.number().required(),
			unit: Joi.number().required(),
			total: Joi.number().required(), 
			notes: Joi.string().optional().allow(null).empty('')
		}))
	}),
	treatmentPlanUpdate: Joi.object().keys({
		treatmentPlanId: Joi.number().required(),
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		name: Joi.string().required(), 
		estimateDay: Joi.string().optional().allow(null).empty(''),
		tooth: Joi.alternatives().try(Joi.string(), Joi.array()),
		treatments: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().required(), 
			perUnitCost: Joi.number().required(),
			unit: Joi.number().required(),
			tooth: Joi.array().items(Joi.number()), 
			discountPercentage: Joi.number().required(), 
			discountAmount: Joi.number().required(),
			total: Joi.number().required(), 
			notes: Joi.string().optional().allow(null).empty('')
		}))
	}),

	createBill: Joi.object().keys({
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		billTotal: Joi.number().required(), 
		billLists: Joi.array().required().items(Joi.object().keys({
			name: Joi.string().required(),
			rate: Joi.number().required(),
			unit: Joi.number().required(),
			discountAmount: Joi.number().required(),
			discountPercentage: Joi.number().required(),
			total: Joi.number().required(),
		}))
	}),
	updateBill: Joi.object().keys({
		billId: Joi.number().required(),
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		billTotal: Joi.number().required(), 
		billLists: Joi.array().required().items(Joi.object().keys({
			billListId: Joi.number().optional().allow(null).empty(''),
			name: Joi.string().required(),
			rate: Joi.number().required(),
			unit: Joi.number().required(),
			discountAmount: Joi.number().required(),
			discountPercentage: Joi.number().required(),
			total: Joi.number().required(),
		}))
	}),

	treatmentUserCreate: Joi.object().keys({
		name: Joi.string().required(),
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		tooth: Joi.string().required(),
		toothChart: Joi.string().optional().allow(null).empty(''),
		notes: Joi.string().optional().allow(null).empty('')
	}),
	treatmentUserUpdate: Joi.object().keys({
		treatmentUserId: Joi.number().required(),
		name: Joi.string().required(),
		userId: Joi.number().required(),
		date: Joi.date().iso().required(),
		tooth: Joi.string().required(),
		toothChart: Joi.string().optional().allow(null).empty(''),
		notes: Joi.string().optional().allow(null).empty('')
	}),

	treatmentUserStatus: Joi.object().keys({
		treatmentUserId: Joi.number().required(),
		userId: Joi.number().required(),
		status: Joi.string().valid(['Pending','InProgress','Completed','Discontinued']).required(),
	}),

	prescriptionTemplateCreate: Joi.object().keys({
		name: Joi.string().required(),
		list: Joi.array().required().items(Joi.object().keys({
			medicineName: Joi.string().required(), 
			composition: Joi.string().required(), 
			dosage: Joi.string().required(), 
			frequency: Joi.string().required(), 
			duration: Joi.string().required(), 
			notes: Joi.string().optional().allow(null).empty('')
		}))
	}),
	prescriptionTemplateUpdate: Joi.object().keys({
		name: Joi.string().required(),
		prescriptionTemplateId: Joi.number().required(),
		list: Joi.array().required().items(Joi.object().keys({
			prescriptionTemplateListId: Joi.number().optional().allow(null).empty(''),
			medicineName: Joi.string().required(), 
			composition: Joi.string().required(), 
			dosage: Joi.string().required(), 
			frequency: Joi.string().required(), 
			duration: Joi.string().required(), 
			notes: Joi.string().optional().allow(null).empty('')
		}))
	}),

	addAppointment: Joi.object().keys({
		userId: Joi.number().required(),
		vendorId: Joi.number().required(),
		date: Joi.date().iso().required(),
		time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
		duration: Joi.string().optional().allow(null).empty(''),
		notes: Joi.string().optional().allow(null).empty('')
	}),

	addAppointmentProfile: Joi.object().keys({
		appointmentId: Joi.number().optional().allow(null).empty(''),
		date: Joi.date().iso().required(),
		userId: Joi.number().required(),
		specialInstructions: Joi.string().optional().allow(null).empty(''),
		medicines: Joi.array().required().items(Joi.object().keys({
			medicineName: Joi.string().required(), 
			composition: Joi.string().required(), 
			dosage: Joi.string().required(), 
			frequency: Joi.string().required(), 
			duration: Joi.string().required(), 
			notes: Joi.string().optional().allow(null).empty('')
		}))
	}),

	acceptReportByEditor: Joi.object().keys({
		reportId: Joi.number().required(),
		editorId: Joi.number().required(),
	}),

	patientParameterValue: Joi.object().keys({
		patientId: Joi.number().required(),
		parameterId: Joi.number().required(),
	}),
	
	doctorByOrganizationId: Joi.object().keys({
		organizationIds: Joi.array().items(Joi.string()),
	}),

	changeAppointmentStatus: Joi.object().keys({
		opdStatusId: Joi.number().required(),
		appointmentId: Joi.number().required(),
	}),

	metadataSchema: Joi.object().keys({
		name: Joi.string().required(), 
		value: Joi.string().required(), 
	}),

	lnbAndFitnessCreateSchema: Joi.object().keys({
		name: Joi.string().required(), 
		icon: Joi.string().optional().allow(null).empty('')
	}),

	lnbAndFitnessUpdateSchema: Joi.object().keys({
		name: Joi.string().required(), 
		labAndFitnessTagId: Joi.number().required(),
		icon: Joi.string().optional().allow(null).empty('')
	}),

	staffPermission: Joi.object().keys({
		vendorId: Joi.number().required(), 
		organisationId: Joi.number().required(),
		actions: Joi.array().required().items(Joi.object().keys({
			actionId: Joi.number().required(),
			read: Joi.boolean().required(),
			write: Joi.boolean().required(),
			delete: Joi.boolean().required(),
		}))
	}),

	/* patient query */

  queryCreate: Joi.object().keys({
    title: Joi.string().required(),
    query: Joi.string().required(),
    solution: Joi.string().optional().allow(null).empty(""),
    status: Joi.boolean().optional(),
  }),

  queryUpdate: Joi.object().keys({
    queryId: Joi.number().required(),
    title: Joi.string().optional(),
    query: Joi.string().optional(),
    solution: Joi.string().optional().allow(null).empty(""),
    status: Joi.boolean().optional(),
  }),

  /* slides - plixcast */

  slideList: Joi.object().keys({}),

  slideCreate: Joi.object().keys({
    name: Joi.string(),
    order: Joi.string(),
    type: Joi.string()
      .valid(["file", "opd_status", "current_opd", "next_opd"])
      .required(),
    duration: Joi.string().required(),
    file: Joi.string().optional().allow(null).empty(""),
    filetype: Joi.string().optional().allow(null).empty(""),
    vendorId: Joi.string().optional().allow(null),
    opdStatusId: Joi.string().optional().allow(null),
  }),

  slideUpdate: Joi.object().keys({
    name: Joi.string(),
    order: Joi.string(),
    type: Joi.string()
      .valid(["file", "opd_status", "current_opd", "next_opd"])
      .required(),
    duration: Joi.string().required(),
    file: Joi.string().optional().allow(null).empty(""),
    filetype: Joi.string().optional().allow(null).empty(""),
    vendorId: Joi.string().optional().allow(null),
    opdStatusId: Joi.string().optional().allow(null),
  }),

  slideDelete: Joi.object().keys({
    slideId: Joi.number().required().min(1),
  }),

}
