const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employeetracker',
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
    });
  }
  
  function viewAllRoles() {
    const query = `
      SELECT role.id, title, salary, name as department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
    `;
    connection.query(query, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
    });
  }
  
  function viewAllEmployees() {
    const query = `
      SELECT e.id, e.first_name, e.last_name, title, name as department, salary, CONCAT(m.first_name, ' ', m.last_name) as manager
      FROM employee e
      LEFT JOIN role ON e.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `;
    connection.query(query, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
    });
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'What is the name of the department?',
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO department (name) VALUES (?)',
          [answer.name],
          function(err) {
            if (err) throw err;
            console.log('Added new department: ' + answer.name);
            start();
          }
        );
      });
  }
  
  function addRole() {
    connection.query('SELECT * FROM department', function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'What is the title of the role?',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role?',
          },
          {
            name: 'department',
            type: 'list',
            choices: function() {
              return results.map((department) => department.name);
            },
            message: 'Which department does the role belong to?',
          },
        ])
        .then((answer) => {
          const department = results.find(
            (department) => department.name === answer.department
          );
          connection.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [answer.title, answer.salary, department.id],
            function(err) {
              if (err) throw err;
              console.log('Added new role: ' + answer.title);
              start();
            }
          );
        });
    });
  }

  function addEmployee() {
    connection.query('SELECT * FROM role', function(err, roles) {
      if (err) throw err;
      connection.query('SELECT * FROM employee', function(err, employees) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: 'first_name',
              type: 'input',
              message: 'What is the first name of the employee?',
            },
            {
              name: 'last_name',
              type: 'input',
              message: 'What is the last name of the employee?',
            },
            {
              name: 'role',
              type: 'list',
              choices: function() {
                return roles.map((role) => role.title);
              },
              message: 'What is the role of the employee?',
            },
            {
              name: 'manager',
              type: 'list',
              choices: function() {
                return employees.map((employee) => `${employee.first_name} ${employee.last_name}`);
              },
              message: 'Who is the manager of the employee?',
            },
          ])
          .then((answer) => {
            const role = roles.find((role) => role.title === answer.role);
            const manager = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answer.manager);
            connection.query(
              'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
              [answer.first_name, answer.last_name, role.id, manager.id],
              function(err) {
                if (err) throw err;
                console.log('Added new employee: ' + answer.first_name + ' ' + answer.last_name);
                start();
              }
            );
          });
      });
    });
  }
  
  function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', function(err, employees) {
      if (err) throw err;
      connection.query('SELECT * FROM role', function(err, roles) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: 'employee',
              type: 'list',
              choices: function() {
                return employees.map((employee) => `${employee.first_name} ${employee.last_name}`);
              },
              message: 'Which employee\'s role do you want to update?',
            },
            {
              name: 'role',
              type: 'list',
              choices: function() {
                return roles.map((role) => role.title);
              },
              message: 'What is the new role of the employee?',
            },
          ])
          .then((answer) => {
            const role = roles.find((role) => role.title === answer.role);
            const employee = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answer.employee);
            connection.query(
              'UPDATE employee SET role_id = ? WHERE id = ?',
              [role.id, employee.id],
              function(err) {
                if (err) throw err;
                console.log('Updated role for employee: ' + answer.employee);
                start();
              }
            );
          });
      });
    });
  }
  
