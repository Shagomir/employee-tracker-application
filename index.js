const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  }
  //   console.log(`Connected to the employee_db database.`)
);

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

function viewDepartments() {
  db.query(`SELECT id, dept_name FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    repeatCheck();
  });
}
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
function addEmployee() {}
function updateEmployee() {}
function employeeDetails() {}

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
