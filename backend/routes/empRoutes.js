const express = require('express');
const router = express.Router();
const userController = require('../controllers/empController');

router.get('/role', userController.getRolesDetails);    // from view
router.post('/add', userController.addRole);
router.put('/update', userController.updateRole);
router.delete('/delete/:role_id', userController.deleteRole);


router.get('/employee', userController.getEmployeesDetails);    // from view
router.get('/user', userController.getUsersDetails);    // from view
router.get('/attendance', userController.getAttendanceDetails);    // from view
router.get('/performance', userController.getPerformanceDetails);    // from view
router.get('/schedule', userController.getScheduleDetails);    // from view


// ======================
// Employee Routes
// ======================
router.post('/employee/add', userController.addEmployee);
router.put('/employee/update', userController.updateEmployee);
router.delete('/employee/delete/:employee_id', userController.deleteEmployee);

// ======================
// User Routes
// ======================
router.post('/user/add', userController.addUser);
router.put('/user/update', userController.updateUser);
router.delete('/user/delete/:user_id', userController.deleteUser);

// ======================
// Attendance Routes
// ======================
router.post('/attendance/add', userController.addEmployeeAttendance);
router.put('/attendance/update', userController.updateEmployeeAttendance);
router.delete('/attendance/delete/:attendance_id', userController.deleteEmployeeAttendance);

// ======================
// Performance Routes
// ======================
router.post('/performance/add', userController.addEmployeePerformance);
router.put('/performance/update', userController.updateEmployeePerformance);
router.delete('/performance/delete/:performance_id', userController.deleteEmployeePerformance);

// ======================
// Schedule Routes
// ======================
router.post('/schedule/add', userController.addEmployeeSchedule);
router.put('/schedule/update', userController.updateEmployeeSchedule);
router.delete('/schedule/delete/:schedule_id', userController.deleteEmployeeSchedule);

module.exports = router;
