const inquirer = require("inquirer");
const mysql = require("mysql2");

//create DB connections
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  }
  //   console.log(`Connected to the employee_db database.`)
);

//function to grab a list of departments from DB
const getDepartments = function () {
  let deptList = [];
  db.query(`SELECT dept_name FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.forEach((element) => {
      deptList.push(element.dept_name);
    });
    // console.log(deptList);
  });
  return deptList;
};

//function to grab a list of role titles from DB
const getRoles = function () {
  let roleList = [];
  db.query(`SELECT title FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.forEach((element) => {
      roleList.push(element.title);
    });
    // console.log(roleList);
  });
  return roleList;
};

//function to grab a list of employees from DB
const getEmployees = function () {
  let managerList = [];
  db.query(`SELECT first_name, last_name FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.forEach((element) => {
      let managerName = element.first_name + " " + element.last_name;
      managerList.push(managerName);
    });
    // console.log(managerList);
  });
  return managerList;
};

//view all depts
function viewDepartments() {
  db.query(`SELECT id, dept_name FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    repeatCheck();
  });
}

//view all roles
function viewRoles() {
  db.query(
    `SELECT role.id, title, salary, dept_name, department_id
  FROM role INNER JOIN department
  ON department_id = department.id`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      repeatCheck();
    }
  );
}

//view all employees
function viewEmployees() {
  db.query(
    `SELECT employee.id, first_name, last_name, title, manager_id
        FROM employee JOIN role ON employee.role_id = role.id`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      repeatCheck();
    }
  );
}

//add a department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "Please enter the new Department Name:",
    })
    .then((answers) => {
      const newDept = answers.deptName;
      db.query(
        `INSERT INTO department (dept_name)
          VALUES (?);`,
        newDept,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`${newDept} has been added.`);
          repeatCheck();
        }
      );
    });
}

//add a role. automatically updates the list of departments to choose.
function addRole() {
  const depts = getDepartments();

  setTimeout(() => {
    const questions = [
      {
        type: "input",
        name: "roleName",
        message: "Please enter the new Role Name:",
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the yearly salary for this role:",
      },
      {
        type: "list",
        name: "deptName",
        message: "Please enter the Department this Role belongs to:",
        choices: depts,
      },
    ];
    inquirer.prompt(questions).then((answers) => {
      const dept = answers.deptName;
      const role = answers.roleName;
      const salary = answers.salary;
      let deptId;

      db.query(
        `SELECT id FROM department WHERE dept_name = ?`,
        dept,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          deptId = result[0].id;

          db.query(
            `INSERT INTO role (title, salary, department_id)
                  VALUES (?,?,?);`,
            [role, salary, deptId],
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(`${role} has been added.`);
              repeatCheck();
            }
          );
        }
      );
    });
  }, 100);
}

//add an employee. Auto updates the available titles and managers
function addEmployee() {
  const roles = getRoles();
  const manager = getEmployees();

  setTimeout(() => {
    const questions = [
      {
        type: "input",
        name: "firstName",
        message: "Please enter the employee's First name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the employee's Last name",
      },
      {
        type: "list",
        name: "roleName",
        message: "Please select the employee's Role:",
        choices: roles,
      },
      {
        type: "list",
        name: "managerName",
        message: "Please select the Employee's Manager: ",
        choices: manager,
      },
    ];
    inquirer.prompt(questions).then((answers) => {
      const fName = answers.firstName;
      const lName = answers.lastName;
      const rName = answers.roleName;
      const mName = "%" + answers.managerName + "%";
      let roleId;
      let managerId;

      db.query(`SELECT id FROM role WHERE title = ?`, rName, (err, result) => {
        if (err) {
          console.log(err);
        }
        roleId = result[0].id;

        db.query(
          `SELECT id
            FROM employee
            WHERE CONCAT(employee.first_name, ' ', employee.last_name) LIKE ?`,
          mName,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            // console.log(result);
            managerId = result[0].id;
            db.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?,?,?,?);`,
              [fName, lName, roleId, managerId],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log(`${fName} ${lName} has been added.`);
                repeatCheck();
              }
            );
          }
        );
      });
    });
  }, 250);
}

//allows you to update an employee's role
function updateEmployee() {
  const roles = getRoles();
  const employees = getEmployees();

  setTimeout(() => {
    const questions = [
      {
        type: "list",
        name: "employeeName",
        message: "Please select the Employee to update:",
        choices: employees,
      },
      {
        type: "list",
        name: "roleName",
        message: "Please select the Role you would like to assign:",
        choices: roles,
      },
    ];
    inquirer.prompt(questions).then((answers) => {
      const longEmpName = answers.employeeName;
      const eName = "%" + answers.employeeName + "%";
      const role = answers.roleName;
      let roleId;
      let empId;

      db.query(`SELECT id FROM role WHERE title = ?`, role, (err, result) => {
        if (err) {
          console.log(err);
        }
        roleId = result[0].id;

        db.query(
          `SELECT id FROM employee 
          WHERE CONCAT(employee.first_name, ' ', employee.last_name) LIKE ?`,
          eName,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            // console.log(result);
            empId = result[0].id;
            // console.log("empID", empId, "roleId", roleId);
            db.query(
              `UPDATE employee SET role_id = ? WHERE id = ?`,
              [roleId, empId],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log(`${longEmpName} has been updated to be a ${role}.`);
                repeatCheck();
              }
            );
          }
        );
      });
    });
  }, 100);
}

//central function of the app - goes to the menu.
function menu() {
  inquirer
    .prompt({
      type: "list",
      name: "menuSelection",
      message: "What would you like to do?",
      choices: [
        new inquirer.Separator("--- Views:"),
        "view all departments",
        "view all roles",
        "view all employees",
        new inquirer.Separator("--- Manage:"),
        "add a department",
        "add a role",
        new inquirer.Separator("--- Employees:"),
        "add an employee",
        "update an employee role",
      ],
    })
    .then((answers) => {
      let userSelection = answers.menuSelection;
      switch (userSelection) {
        case "view all departments":
          {
            console.log("User has selected", userSelection);
            viewDepartments();
          }
          break;
        case "view all roles":
          {
            console.log("User has selected", userSelection);
            viewRoles();
          }
          break;
        case "view all employees":
          {
            console.log("User has selected", userSelection);
            viewEmployees();
          }
          break;
        case "add a department":
          {
            console.log("User has selected", userSelection);
            addDepartment();
          }
          break;
        case "add a role":
          {
            console.log("User has selected", userSelection);
            addRole();
          }
          break;
        case "add an employee":
          {
            console.log("User has selected", userSelection);
            addEmployee();
          }
          break;
        case "update an employee role":
          {
            console.log("User has selected", userSelection);
            updateEmployee();
          }
          break;
      }
    });
}

//the prompt to exit or continue after each option is used. on a little delay to ensure the function runs fully before displaying this option.
function repeatCheck() {
  setTimeout(() => {
    inquirer
      .prompt({
        type: "list",
        name: "menuSelection",
        message: "Return to main Menu?",
        choices: ["Yes", "No (Exit Program)"],
      })
      .then((answers) => {
        let userSelection = answers.menuSelection;
        let response = true;
        switch (userSelection) {
          case "Yes":
            menu();
            break;
          case "No (Exit Program)":
            response = false;
            process.exit();
            break;
        }
        return response;
      });
  }, 100);
}

menu();
//
