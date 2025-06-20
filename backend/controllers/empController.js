const userModel = require('../models/empModels');

//Roles
const getRolesDetails = async (req, res) => {
  try {
    const details = await userModel.getRolesDetailsView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const addRole = async (req, res) => {
  try {
    const { role_name, description } = req.body;
    await userModel.addRole(role_name, description);
    res.status(201).json({ message: 'Role added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role_id, role_name, description } = req.body;
    await userModel.updateRole(role_id, role_name, description);
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    await userModel.deleteRole(role_id);
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getEmployeesDetails = async (req, res) => {
    try {
      const details = await userModel.getEmployeesDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getUsersDetails = async (req, res) => {
    try {
      const details = await userModel.getUsersDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getAttendanceDetails = async (req, res) => {
    try {
      const details = await userModel.getAttendanceDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getPerformanceDetails = async (req, res) => {
    try {
      const details = await userModel.getPerformanceDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getScheduleDetails = async (req, res) => {
    try {
      const details = await userModel.getScheduleDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };



  // --------------------------- Employees ---------------------------
const addEmployee = async (req, res) => {
  try {
    const { role_id, first_name, last_name, phone, email, position, hire_date, status } = req.body;
    await userModel.addEmployee(role_id, first_name, last_name, phone, email, position, hire_date, status);
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { employee_id, role_id, first_name, last_name, phone, email, position, status } = req.body;
    await userModel.updateEmployee(employee_id, role_id, first_name, last_name, phone, email, position, status);
    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    await userModel.deleteEmployee(employee_id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------- Users ---------------------------
const addUser = async (req, res) => {
  try {
    const { employee_id, username, email, password } = req.body;
    await userModel.addUser(employee_id, username, email, password);
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id, employee_id, username, email, password } = req.body;
    await userModel.updateUser(user_id, employee_id, username, email, password);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await userModel.deleteUser(user_id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------- Employee Attendance ---------------------------
const addEmployeeAttendance = async (req, res) => {
  try {
    const { employee_id, attendance_date, clock_in, clock_out, status } = req.body;
    await userModel.addEmployeeAttendance(employee_id, attendance_date, clock_in, clock_out, status);
    res.status(201).json({ message: 'Attendance added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployeeAttendance = async (req, res) => {
  try {
    const { attendance_id, employee_id, attendance_date, clock_in, clock_out, status } = req.body;
    await userModel.updateEmployeeAttendance(attendance_id, employee_id, attendance_date, clock_in, clock_out, status);
    res.json({ message: 'Attendance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployeeAttendance = async (req, res) => {
  try {
    const { attendance_id } = req.params;
    await userModel.deleteEmployeeAttendance(attendance_id);
    res.json({ message: 'Attendance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------- Employee Performance ---------------------------
const addEmployeePerformance = async (req, res) => {
  try {
    const { employee_id, review_date, performance_score, comments, incentive } = req.body;
    await userModel.addEmployeePerformance(employee_id, review_date, performance_score, comments, incentive);
    res.status(201).json({ message: 'Performance added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployeePerformance = async (req, res) => {
  try {
    const { performance_id, employee_id, review_date, performance_score, comments, incentive } = req.body;
    await userModel.updateEmployeePerformance(performance_id, employee_id, review_date, performance_score, comments, incentive);
    res.json({ message: 'Performance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployeePerformance = async (req, res) => {
  try {
    const { performance_id } = req.params;
    await userModel.deleteEmployeePerformance(performance_id);
    res.json({ message: 'Performance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------- Employee Schedule ---------------------------
const addEmployeeSchedule = async (req, res) => {
  try {
    const { employee_id, shift_date, shift_start, shift_end, shift_status } = req.body;
    await userModel.addEmployeeSchedule(employee_id, shift_date, shift_start, shift_end, shift_status);
    res.status(201).json({ message: 'Schedule added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployeeSchedule = async (req, res) => {
  try {
    const { schedule_id, employee_id, shift_date, shift_start, shift_end, shift_status } = req.body;
    await userModel.updateEmployeeSchedule(schedule_id, employee_id, shift_date, shift_start, shift_end, shift_status);
    res.json({ message: 'Schedule updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployeeSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    await userModel.deleteEmployeeSchedule(schedule_id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






module.exports = {
    getRolesDetails,
    getEmployeesDetails,
    getUsersDetails,
    getAttendanceDetails,
    getPerformanceDetails,
    getScheduleDetails,
    addRole,
    updateRole,
    deleteRole,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addUser,
    updateUser,
    deleteUser,
    addEmployeeAttendance,
    updateEmployeeAttendance,
    deleteEmployeeAttendance,
    addEmployeePerformance,
    updateEmployeePerformance,
    deleteEmployeePerformance,
    addEmployeeSchedule,
    updateEmployeeSchedule,
    deleteEmployeeSchedule,
};
