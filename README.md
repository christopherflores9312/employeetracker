# Employee Tracker

## Description

This is a command-line application that allows business owners to view and manage the departments, roles, and employees in their company. This helps to organize and plan the business.

## Technologies Used

- Node.js
- MySQL2
- Inquirer.js

## Database Structure

The application uses the following MySQL database tables:

### `department`

- `id`: INT
- `name`: VARCHAR(30)

### `role`

- `id`: INT
- `title`: VARCHAR(30)
- `salary`: DECIMAL
- `department_id`: INT (Foreign Key)

### `employee`

- `id`: INT
- `first_name`: VARCHAR(30)
- `last_name`: VARCHAR(30)
- `role_id`: INT (Foreign Key)
- `manager_id`: INT (Foreign Key)

## Features

- View all departments, roles, and employees
- Add a department, role, or an employee
- Update an employee's role

## Installation

1. Clone the repository
2. Install Node.js
3. Run `npm install` to install the project dependencies
4. Set up a MySQL database and create tables as per the database structure provided
5. Update database connection details in the application file

## Usage

1. Run `node index.js` to start the application
2. Follow the prompts to view, add, or update data

## Demo

Visit this link to see a demo [CLICK HERE!][https://drive.google.com/file/d/1F7mv1R6T3cGFB__U45MukfgvAY8oXp-B/view?usp=share_link]

## License

This project is licensed under the terms of the MIT license.

## Contributing

Please open an issue or pull request on GitHub.

## Questions

If you have any questions about the project, please feel free to message me or create an issue.


[https://drive.google.com/file/d/1F7mv1R6T3cGFB__U45MukfgvAY8oXp-B/view?usp=share_link]: https://drive.google.com/file/d/1F7mv1R6T3cGFB__U45MukfgvAY8oXp-B/view?usp=share_link