const { poolPromise } = require('../config/db');

//Roles
const getRolesDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwRoles');
  return result.recordset;
};

const addRole = async (role_name, description) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('role_name', role_name)
    .input('description', description)
    .execute('spAddRoles');
  return result.rowsAffected;
};

const updateRole = async (role_id, role_name, description) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('role_id', role_id)
    .input('role_name', role_name)
    .input('description', description)
    .execute('spUpdateRoles');
  return result.rowsAffected;
};

const deleteRole = async (role_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('role_id', role_id)
    .execute('spDeleteRoles');
  return result.rowsAffected;
};






const getEmployeesDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwEmployees');
    return result.recordset;
};

const getUsersDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwUsers');
    return result.recordset;
  };

  const getAttendanceDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwEmployeeAttendance');
    return result.recordset;
  };

  const getPerformanceDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwEmployeePerformance');
    return result.recordset;
  };

  const getScheduleDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwEmployeeSchedule');
    return result.recordset;
  };



  // ------------------- Employees -------------------
const addEmployee = async (role_id, first_name, last_name, phone, email, position, hire_date, status) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('role_id', role_id)
    .input('first_name', first_name)
    .input('last_name', last_name)
    .input('phone', phone)
    .input('email', email)
    .input('position', position)
    .input('hire_date', hire_date)
    .input('status', status)
    .execute('spAddEmployee');
  return result.rowsAffected;
};

const updateEmployee = async (employee_id, role_id, first_name, last_name, phone, email, position, status) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('employee_id', employee_id)
    .input('role_id', role_id)
    .input('first_name', first_name)
    .input('last_name', last_name)
    .input('phone', phone)
    .input('email', email)
    .input('position', position)
    .input('status', status)
    .execute('spUpdateEmployee');
  return result.rowsAffected;
};

const deleteEmployee = async (employee_id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('employee_id', employee_id)
    .execute('spDeleteEmployee');
  return result.rowsAffected;
};

// ------------------- Users -------------------
const addUser = async (employee_id, username, email, password) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('employee_id', employee_id)
    .input('username', username)
    .input('email', email)
    .input('password', password)
    .execute('spAddUser');
  return result.rowsAffected;
};

const updateUser = async (user_id, employee_id, username, email, password) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('user_id', user_id)
    .input('employee_id', employee_id)
    .input('username', username)
    .input('email', email)
    .input('password', password)
    .execute('spUpdateUser');
  return result.rowsAffected;
};

const deleteUser = async (user_id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('user_id', user_id)
    .execute('spDeleteUser');
  return result.rowsAffected;
};

// ------------------- Employee Attendance -------------------
const addEmployeeAttendance = async (employee_id, attendance_date, clock_in, clock_out, status) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('employee_id', employee_id)
    .input('attendance_date', attendance_date)
    .input('clock_in', clock_in)
    .input('clock_out', clock_out)
    .input('status', status)
    .execute('spAddEmployeeAttendance');
  return result.rowsAffected;
};

const updateEmployeeAttendance = async (attendance_id, employee_id, attendance_date, clock_in, clock_out, status) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('attendance_id', attendance_id)
    .input('employee_id', employee_id)
    .input('attendance_date', attendance_date)
    .input('clock_in', clock_in)
    .input('clock_out', clock_out)
    .input('status', status)
    .execute('spUpdateEmployeeAttendance');
  return result.rowsAffected;
};

const deleteEmployeeAttendance = async (attendance_id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('attendance_id', attendance_id)
    .execute('spDeleteEmployeeAttendance');
  return result.rowsAffected;
};

// ------------------- Employee Performance -------------------
const addEmployeePerformance = async (employee_id, review_date, performance_score, comments, incentive) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('employee_id', employee_id)
    .input('review_date', review_date)
    .input('performance_score', performance_score)
    .input('comments', comments)
    .input('incentive', incentive)
    .execute('spAddEmployeePerformance');
  return result.rowsAffected;
};

const updateEmployeePerformance = async (performance_id, employee_id, review_date, performance_score, comments, incentive) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('performance_id', performance_id)
    .input('employee_id', employee_id)
    .input('review_date', review_date)
    .input('performance_score', performance_score)
    .input('comments', comments)
    .input('incentive', incentive)
    .execute('spUpdateEmployeePerformance');
  return result.rowsAffected;
};

const deleteEmployeePerformance = async (performance_id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('performance_id', performance_id)
    .execute('spDeleteEmployeePerformance');
  return result.rowsAffected;
};

// ------------------- Employee Schedule -------------------
const addEmployeeSchedule = async (employee_id, shift_date, shift_start, shift_end, shift_status) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('employee_id', employee_id)
    .input('shift_date', shift_date)
    .input('shift_start', shift_start)
    .input('shift_end', shift_end)
    .input('shift_status', shift_status)
    .execute('spAddEmployeeSchedule');
  return result.rowsAffected;
};

const updateEmployeeSchedule = async (schedule_id, employee_id, shift_date, shift_start, shift_end, shift_status) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('schedule_id', schedule_id)
    .input('employee_id', employee_id)
    .input('shift_date', shift_date)
    .input('shift_start', shift_start)
    .input('shift_end', shift_end)
    .input('shift_status', shift_status)
    .execute('spUpdateEmployeeSchedule');
  return result.rowsAffected;
};

const deleteEmployeeSchedule = async (schedule_id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('schedule_id', schedule_id)
    .execute('spDeleteEmployeeSchedule');
  return result.rowsAffected;
};




module.exports = {
    getRolesDetailsView,
    getEmployeesDetailsView,
    getUsersDetailsView,
    getAttendanceDetailsView,
    getPerformanceDetailsView,
    getScheduleDetailsView,
    addRole,
    updateRole,
    deleteRole,

    // Employee
  addEmployee,
  updateEmployee,
  deleteEmployee,
  // User
  addUser,
  updateUser,
  deleteUser,
  // Attendance
  addEmployeeAttendance,
  updateEmployeeAttendance,
  deleteEmployeeAttendance,
  // Performance
  addEmployeePerformance,
  updateEmployeePerformance,
  deleteEmployeePerformance,
  // Schedule
  addEmployeeSchedule,
  updateEmployeeSchedule,
  deleteEmployeeSchedule
};
