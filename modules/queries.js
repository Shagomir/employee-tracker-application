const inquirer = require("inquirer");
const db = require("./dbConnection");

function viewDepartments() {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
}
function viewRoles() {}
function viewEmployees() {}
function addDepartment() {}
function addRole() {}
function addEmployee() {}
function updateEmployee() {}
function employeeDetails() {}

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployee,
  employeeDetails,
};
