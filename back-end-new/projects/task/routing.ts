import passportConfig from "../../bin/passport";
import aws from "../../sharedModules/smallModules/aws";
import TaskController from './controller'

const express = require('express');
const router = express.Router();
const TaskObject = new TaskController();
router.use("/task", passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/task', router);
const Attachments = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 100 }]);

router.post('/regUser/documents/add',TaskObject.AddDocument)
router.post('/regUser/documents/remove',TaskObject.RemoveDocument)

router.get('/regUser/download_attachment/:filename', TaskObject.DownloadAttachment);
router.get('/regUser/count', TaskObject.TasksList);
router.get('/regUser/due_task', TaskObject.CheckDueTask);
router.get('/regUser/show/:task_id', TaskObject.ViewTask);
router.post('/regUser/comment/add', Attachments, TaskObject.AddComment);
router.post('/regUser/update', Attachments, TaskObject.UpdateTask);
router.post('/regUser/calTask',TaskObject.TaskListForCalender)
router.post('/regUser/events',TaskObject.getEventsOfTask)
router.post('/regUser/addEvent',TaskObject.addEventToTask)
router.post('/regUser/removeEvent',TaskObject.removeEventFromTask)
router.post('/regUser/trello',TaskObject.TaskListForTrello)

router.post('/admin/update', Attachments, TaskObject.UpdateTask);
router.post('/management/update', Attachments, TaskObject.UpdateTask);
router.post('/partner/update', Attachments, TaskObject.UpdateTask);
router.post('/sales_rep/update', Attachments, TaskObject.UpdateTask);

router.get('/admin/list', TaskObject.TasksList);
router.post('/admin/create', Attachments, TaskObject.CreateTask);
router.get('/admin/show/:task_id', TaskObject.ViewTask);
router.post('/admin/deleteTask', TaskObject.DeleteTask);
router.post('/admin/attachment/:task_id', Attachments, TaskObject.UploadAttachments);
router.post('/admin/comment/add', Attachments, TaskObject.AddComment);
router.post('/admin/delete_action', TaskObject.TaskDeleteActions);
router.post('/admin/delete/attachment', TaskObject.DeleteTaskAttachment);
router.post('/admin/deleteMultiTask', TaskObject.DeleteMultiTask);
router.post('/admin/rejectMultiTask', TaskObject.RejectMultiTask);

router.get('/management/list', TaskObject.TasksList);
router.post('/management/create', Attachments, TaskObject.CreateTask);
router.get('/management/show/:task_id', TaskObject.ViewTask);
router.post('/management/delete_request', TaskObject.TaskDeleteActions);
router.post('/management/comment/add', Attachments, TaskObject.AddComment);
router.post('/management/delete/attachment', TaskObject.DeleteTaskAttachment);

router.get('/partner/list', TaskObject.TasksList);
router.post('/partner/create', Attachments, TaskObject.CreateTask);
router.get('/partner/show/:task_id', TaskObject.ViewTask);
router.post('/partner/delete_request', TaskObject.TaskDeleteActions);
router.post('/partner/comment/add', Attachments, TaskObject.AddComment);
router.post('/partner/delete/attachment', TaskObject.DeleteTaskAttachment);

router.get('/sales_rep/list', TaskObject.TasksList);
router.post('/sales_rep/create', Attachments, TaskObject.CreateTask);
router.get('/sales_rep/show/:task_id', TaskObject.ViewTask);
router.post('/sales_rep/delete_request', TaskObject.TaskDeleteActions);
router.post('/sales_rep/comment/add', Attachments, TaskObject.AddComment);
router.post('/sales_rep/delete/attachment', TaskObject.DeleteTaskAttachment);

router.get('/observing_partner/list', TaskObject.TasksList);
router.get('/observing_partner/show/:task_id', TaskObject.ViewTask);

router.get('/admin/taskStats',TaskObject.TaskStats)
router.get('/admin/viewBasicTaskDetails',TaskObject.BasicTaskDetailsView)

router.get('/regUser/comments',TaskObject.TasksComments)

export default router;