const request = require('supertest');
const app = require('../app');
const userModel = require('../models/empModels');

jest.mock('../models/empModels');

describe('Personnel API Endpoints', () => {
  // ======== Roles Endpoints ========
  describe('Roles', () => {
    test('GET /api/personnel/role - should return roles', async () => {
      const mockRoles = [{ role_id: 1, role_name: 'Admin', description: 'Administrator' }];
      userModel.getRolesDetailsView.mockResolvedValue(mockRoles);

      const res = await request(app).get('/api/personnel/role');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRoles);
    });

    test('POST /api/personnel/add - should add a role', async () => {
      userModel.addRole.mockResolvedValue(1);
      const newRole = { role_name: 'User', description: 'Regular user' };

      const res = await request(app)
        .post('/api/personnel/add')
        .send(newRole);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Role added successfully' });
    });

    test('PUT /api/personnel/update - should update a role', async () => {
      userModel.updateRole.mockResolvedValue(1);
      const updateData = { role_id: 1, role_name: 'SuperAdmin', description: 'Super Administrator' };

      const res = await request(app)
        .put('/api/personnel/update')
        .send(updateData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Role updated successfully' });
    });

    test('DELETE /api/personnel/delete/:role_id - should delete a role', async () => {
      userModel.deleteRole.mockResolvedValue(1);

      const res = await request(app).delete('/api/personnel/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Role deleted successfully' });
    });
  });

  // ======== View Endpoints ========
  describe('Views', () => {
    const views = [
      { path: 'employee', fn: 'getEmployeesDetailsView' },
      { path: 'user', fn: 'getUsersDetailsView' },
      { path: 'attendance', fn: 'getAttendanceDetailsView' },
      { path: 'performance', fn: 'getPerformanceDetailsView' },
      { path: 'schedule', fn: 'getScheduleDetailsView' },
    ];

    views.forEach(({ path, fn }) => {
      test(`GET /api/personnel/${path} - should return ${path} data`, async () => {
        const mockData = [{ id: 1, sample: `${path} data` }];
        userModel[fn].mockResolvedValue(mockData);

        const res = await request(app).get(`/api/personnel/${path}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockData);
      });
    });
  });

  // ======== Employee Endpoints ========
  describe('Employee CRUD', () => {
    test('POST /api/personnel/employee/add - should add employee', async () => {
      userModel.addEmployee.mockResolvedValue(1);
      const emp = { role_id:1, first_name:'John', last_name:'Doe', phone:'123', email:'j@d.com', position:'Dev', hire_date:'2025-01-01', status:'active' };

      const res = await request(app)
        .post('/api/personnel/employee/add')
        .send(emp);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Employee added successfully' });
    });

    test('PUT /api/personnel/employee/update - should update employee', async () => {
      userModel.updateEmployee.mockResolvedValue(1);
      const upd = { employee_id:1, role_id:2, first_name:'Jane', last_name:'Doe', phone:'456', email:'jane@d.com', position:'QA', status:'inactive' };

      const res = await request(app)
        .put('/api/personnel/employee/update')
        .send(upd);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Employee updated successfully' });
    });

    test('DELETE /api/personnel/employee/delete/:employee_id - should delete employee', async () => {
      userModel.deleteEmployee.mockResolvedValue(1);

      const res = await request(app).delete('/api/personnel/employee/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Employee deleted successfully' });
    });
  });

  // ======== User CRUD ========
  describe('User CRUD', () => {
    test('POST /api/personnel/user/add - should add user', async () => {
      userModel.addUser.mockResolvedValue(1);
      const user = { employee_id:1, username:'john', email:'john@d.com', password:'pass' };

      const res = await request(app)
        .post('/api/personnel/user/add')
        .send(user);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'User added successfully' });
    });

    test('PUT /api/personnel/user/update - should update user', async () => {
      userModel.updateUser.mockResolvedValue(1);
      const upd = { user_id:1, employee_id:1, username:'jdoe', email:'jdoe@d.com', password:'newpass' };

      const res = await request(app)
        .put('/api/personnel/user/update')
        .send(upd);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'User updated successfully' });
    });

    test('DELETE /api/personnel/user/delete/:user_id - should delete user', async () => {
      userModel.deleteUser.mockResolvedValue(1);

      const res = await request(app).delete('/api/personnel/user/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'User deleted successfully' });
    });
  });

  // ======== Attendance CRUD ========
  describe('Attendance CRUD', () => {
    test('POST /api/personnel/attendance/add - should add attendance', async () => {
      userModel.addEmployeeAttendance.mockResolvedValue(1);
      const att = { employee_id:1, attendance_date:'2025-04-01', clock_in:'09:00', clock_out:'17:00', status:'present' };

      const res = await request(app)
        .post('/api/personnel/attendance/add')
        .send(att);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Attendance added successfully' });
    });

    test('PUT /api/personnel/attendance/update - should update attendance', async () => {
      userModel.updateEmployeeAttendance.mockResolvedValue(1);
      const upd = { attendance_id:1, employee_id:1, attendance_date:'2025-04-02', clock_in:'10:00', clock_out:'18:00', status:'late' };

      const res = await request(app)
        .put('/api/personnel/attendance/update')
        .send(upd);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Attendance updated successfully' });
    });

    test('DELETE /api/personnel/attendance/delete/:attendance_id - should delete attendance', async () => {
      userModel.deleteEmployeeAttendance.mockResolvedValue(1);

      const res = await request(app).delete('/api/personnel/attendance/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Attendance deleted successfully' });
    });
  });

  // ======== Performance CRUD ========
  describe('Performance CRUD', () => {
    test('POST /api/personnel/performance/add - should add performance', async () => {
      userModel.addEmployeePerformance.mockResolvedValue(1);
      const perf = { employee_id:1, review_date:'2025-04-05', performance_score:5, comments:'Great', incentive:100 };

      const res = await request(app)
        .post('/api/personnel/performance/add')
        .send(perf);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Performance added successfully' });
    });

    test('PUT /api/personnel/performance/update - should update performance', async () => {
      userModel.updateEmployeePerformance.mockResolvedValue(1);
      const upd = { performance_id:1, employee_id:1, review_date:'2025-04-06', performance_score:4, comments:'Good', incentive:50 };

      const res = await request(app)
        .put('/api/personnel/performance/update')
        .send(upd);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Performance updated successfully' });
    });

    test('DELETE /api/personnel/performance/delete/:performance_id - should delete performance', async () => {
      userModel.deleteEmployeePerformance.mockResolvedValue(1);

      const res = await request(app).delete('/api/personnel/performance/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Performance deleted successfully' });
    });
  });

  // ======== Schedule CRUD ========
  describe('Schedule CRUD', () => {
    test('POST /api/personnel/schedule/add - should add schedule', async () => {
      userModel.addEmployeeSchedule.mockResolvedValue(1);
      const sched = { employee_id:1, shift_date:'2025-04-10', shift_start:'08:00', shift_end:'16:00', shift_status:'scheduled' };

      const res = await request(app)
        .post('/api/personnel/schedule/add')
        .send(sched);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Schedule added successfully' });
    });

    test('PUT /api/personnel/schedule/update - should update schedule', async () => {
      userModel.updateEmployeeSchedule.mockResolvedValue(1);
      const upd = { schedule_id:1, employee_id:1, shift_date:'2025-04-11', shift_start:'09:00', shift_end:'17:00', shift_status:'completed' };

      const res = await request(app)
        .put('/api/personnel/schedule/update')
        .send(upd);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Schedule updated successfully' });
    });

    test('DELETE /api/personnel/schedule/delete/:schedule_id - should delete schedule', async () => {
      userModel.deleteEmployeeSchedule.mockResolvedValue(1);

      const res = await request(app).delete('/api/personnel/schedule/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Schedule deleted successfully' });
    });
  });
});