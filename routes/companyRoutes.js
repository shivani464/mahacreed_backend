
const express = require('express');
const router = express();

const companyController = require('../contollers/companyController');

const { validateCompanyData,validateProduct } = require('../helpers/companyvalidator');
const RegisterEmployees = require('../contollers/TeamsController');
const {validateTeam}  = require('../helpers/teamValidator');
const roleAuth =  require('../middlewares/roleAuth');
const TeamsControlller = require('../contollers/TeamsController');
// Route to register a new company
router.post('/registerCompany', validateCompanyData,companyController.registerCompany);
router.post('/addEmployee',validateTeam,RegisterEmployees.RegisterEmployees);

//for company
router.get('/company/team',roleAuth('Company'),TeamsControlller.getAllTeamMembers );
router.get('/company/team/:id',roleAuth('Company'),TeamsControlller.getTeamMemberById);
router.post('/updateEmployee/:id',roleAuth('Company'),TeamsControlller.updateTeamMember);
router.post('/toggle-status/:id',roleAuth('Company'),TeamsControlller.toggleTeamMemberStatus);
router.post('/delete/:id',roleAuth('Company'),TeamsControlller.deleteTeamMember);

//for add product by admin
router.post('/addProduct',validateProduct,roleAuth('Company'),companyController.addProduct);
router.post('/updateProduct/:id',roleAuth('Company'),companyController.updateProduct);
router.post('/deleteProduct/:id',roleAuth('Company'),companyController.deleteProduct);


//for Dealer 
router.get('/dealer/team',roleAuth('Dealer'),TeamsControlller.getAllTeamMembers );
router.get('/dealer/team/:id',roleAuth('Dealer'),TeamsControlller.getTeamMemberById);
router.post('/updateEmployee/:id',roleAuth('Dealer'),TeamsControlller.updateTeamMember);
router.post('/delete/:id',roleAuth('Dealer'),TeamsControlller.deleteTeamMember);


// for retailer
router.get('/retailer/team',roleAuth('Retailer'),TeamsControlller.getAllTeamMembers );
router.get('/retailer/team/:id',roleAuth('Retailer'),TeamsControlller.getTeamMemberById);
router.post('/updateEmployee/:id',roleAuth('Retailer'),TeamsControlller.updateTeamMember);
router.post('/delete/:id',roleAuth('Retailer'),TeamsControlller.deleteTeamMember);



module.exports = router;
