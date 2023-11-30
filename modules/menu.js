const inquirer = require("inquirer");
const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployee,
  employeeDetails,
} = require("./queries");

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
      const repeat = repeatCheck();
      return repeat;
    });
}

function repeatCheck() {
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
          break;
      }
      return response;
    });
}

module.exports = { menu, repeatCheck };
