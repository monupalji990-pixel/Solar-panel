import passportConfig from "../../bin/passport";
import UsersControllers from "./controller";
import aws from "../../sharedModules/smallModules/aws";
import HistoryModule from "../../sharedModules/smallModules/historyModule";

const express = require("express");
const router = express.Router();
const usersContObj = new UsersControllers();
const ho = new HistoryModule();
const Avatar = aws.addProfileImage.fields([{ name: "avatar", maxCount: 1 }]);

router.use('/users', passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/users', router);

router.get('/regUser/show/:id', usersContObj.regUser.ShowContact);
router.post('/regUser/changePassword', usersContObj.admin.changePasswordOfUser);
router.post('/regUser/avatar', Avatar, usersContObj.regUser.UpdateAvatar);
router.get('/regUser/salesRepList', usersContObj.regUser.getSalesRepRegUser);
router.get('/regUser/partnerList', usersContObj.regUser.getPartnerListRegUser);
router.get('/regUser/dropdown_list', usersContObj.admin.AssigneeList);
router.post('/regUser/download_file', usersContObj.admin.downloadFile);
router.get('/regUser/history_list', ho.HistoryList);
router.get('/regUser/count', ho.HistoryList);

// router.get('/admin/email', usersContObj.admin.updateUserEmail);
// router.get('/admin/pass', usersContObj.admin.updateUserPass);
router.get('/admin/list', usersContObj.admin.listOfUsers);
router.get('/admin/count', usersContObj.admin.UsersCount);
router.get('/admin/delete-request/count',usersContObj.admin.DeleteRequestCount)
router.post('/admin/add', usersContObj.admin.addNewUserManagement);
router.post('/admin/edit', usersContObj.admin.updateUser);
router.post('/admin/addContact', usersContObj.admin.addNewContactFromView);
router.post('/admin/editContact', usersContObj.admin.editUser);
router.post('/admin/editProfile', usersContObj.admin.editUserProfile);
router.get('/admin/contactlist', usersContObj.admin.listCompanyContactreguser);
router.post('/admin/deleteContact', usersContObj.admin.deleteUserreguser);
router.get('/admin/getUserInfo', usersContObj.admin.GetUserInfo);
router.get('/admin/dropdown_list', usersContObj.admin.AssigneeList);
router.post('/admin/updatePassword', usersContObj.admin.updatePassword);
router.post('/admin/deleteUsers', usersContObj.admin.AdminDeleteUsers);
router.post('/admin/deletePartner', usersContObj.admin.AdminDeletePartner);
router.post('/admin/rejectDeleteRequestUsers', usersContObj.admin.AdminRejectDeleteRequestUsers);
router.get('/admin/assignee_list', usersContObj.admin.listOfUsersByManagement);
router.post('/admin/remove_assignee', usersContObj.admin.RemoveAssignee);
router.post('/admin/blockUsers', usersContObj.admin.AdminBlockUsers);
router.post('/admin/unBlockUsers', usersContObj.admin.AdminUnBlockUsers);
router.post('/admin/delete_user_and_assignee_other', usersContObj.admin.DeleteUserAndAssigneeOther);
router.get('/admin/listOffline',usersContObj.admin.getNotLoggedInUsers)

router.get('/management/list', usersContObj.admin.listOfUsers);
router.get('/management/count', usersContObj.admin.UsersCount);
router.post('/management/addContact', usersContObj.admin.addNewContactFromView);
router.post('/management/deleteContact', usersContObj.admin.deleteUserreguser);
router.get('/management/contactlist', usersContObj.admin.listCompanyContactreguser);
router.post('/management/edit', usersContObj.admin.updateUser);
router.post('/management/editContact', usersContObj.admin.editUser);
router.post('/management/add', usersContObj.admin.addNewUserManagement);
router.post('/management/updateUser', usersContObj.admin.updateUser);
router.post('/management/blockUsers', usersContObj.admin.AdminBlockUsers);
router.post('/management/unBlockUsers', usersContObj.admin.AdminUnBlockUsers);
router.post('/management/deleteRequest', usersContObj.admin.ManagementRequestDeleteUsers);
router.get('/management/dropdown_list', usersContObj.admin.AssigneeList);
router.post('/managementUser/deleteUser', usersContObj.admin.deleteUserreguser);
router.get('/management/assignee_list', usersContObj.admin.listOfUsersByManagement);
router.post('/management/remove_assignee', usersContObj.admin.RemoveAssignee);

router.get('/partner/list', usersContObj.admin.listOfUsers);
router.get('/partner/count', usersContObj.admin.UsersCount);
router.post('/partner/addContact', usersContObj.admin.addNewContactFromView);
router.post('/partner/deleteContact', usersContObj.admin.deleteUserreguser);
router.get('/partner/contactlist', usersContObj.admin.listCompanyContactreguser);
router.post('/partner/edit', usersContObj.admin.updateUser);
router.post('/partner/add', usersContObj.admin.addNewUserManagement);
router.post('/partner/unBlockUsers', usersContObj.admin.PartnerUnBlockUsers);
router.post('/partner/blockUsers', usersContObj.admin.PartnerBlockUsers);
router.post('/partner/deleteRequest', usersContObj.admin.ManagementRequestDeleteUsers);
router.get('/partner/assignee_list', usersContObj.admin.listOfUsersByManagement);

router.post('/sales_rep/addContact', usersContObj.admin.addNewContactFromView);
router.post('/sales_rep/deleteContact', usersContObj.admin.deleteUserIntroducer);
router.post('/sales_rep/editContact', usersContObj.admin.editUser);
router.get('/sales_rep/assignee_list', usersContObj.admin.listOfUsersByManagement);
router.post('/sales_rep/deleteRequest', usersContObj.admin.ManagementRequestDeleteUsers);

export default router;