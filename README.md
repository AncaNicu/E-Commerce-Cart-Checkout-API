# E-Commerce-Cart-Checkout-API

## Project description
This project is a simplified e-commerce platform built with Angular and ASP.NET Core Web API.
It includes:
- Product catalog
- Shopping cart
- User registration and login
- JWT authentication
- Checkout functionality
- SQL Server database integration
- Unit tests for backend and frontend

## Technologies Used

### Backend
#### Development
- ASP.NET Core Web API (.NET 10)
- SQL Server
- JWT Authentication
- BCrypt password hashing
- Swagger / OpenAPI
- ADO.NET / SQL Client
#### Testing
- xUnit
- Moq

### Frontend
#### Development
- Angular 21
- TypeScript
- RxJS
- Bootstrap 5
#### Testing
- Vitest
- Karma
- Jasmine

## Project Features
A user of the application can:
- view available products;
- add products to the shopping cart;
- update product quantities in the cart;
- remove individual products from the cart;
- clear the entire cart;
- view cart contents;
- create an account;
- log in and log out;
- complete checkout by providing a shipping address (authenticated users only).

The project also includes:
- backend and frontend unit tests;
- JWT-based authentication;
- guest cart merging after login;
- hashed passwords stored in the database;
- backend-side total order price calculation;
- automatic cart counter updates;
- persistent cart storage using localStorage.

## Prerequisites
Before running the application, make sure the following tools are installed:
- .NET 10 SDK
- Node.js and npm
- Angular CLI
- SQL Server Express
- SQL Server Management Studio (SSMS)

## Database Setup
1. Open SQL Server Management Studio (SSMS).
2. Connect to your local SQL Server instance.
3. In the repository, open the `database` folder and locate `EcommerceDB.bak`
4. In SSMS:
   - Right click on `Databases`
   - Select `Restore Database...`
5. Choose `Device → Add`
6. Select the file `EcommerceDB.bak`
7. Press `OK → OK` to restore the database.
8. After restoring, verify that the database name is `EcommerceDB`
9. The backend connection string is already configured in `EcommerceAPI/appsettings.json`: 
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=EcommerceDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
10. If your SQL Server instance name is different, update the connection string accordingly.

## Backend Setup
1. Open a terminal inside the `EcommerceAPI` folder.
2. Restore the backend dependencies by writing `dotnet restore` in the terminal.
3. Build the project by writing `dotnet build` in the terminal.
4. Run the backend API by writing `dotnet run` in the terminal.
5. After starting successfully, the API will run on http://localhost:5093.
6. The swagger can be accessed at http://localhost:5093/swagger.

## Frontend Setup
1. Open a terminal inside the `Ecommerce-frontend` folder.
2. Restore the frontend dependencies by writing `npm install` in the terminal.
3. Start the Angular development server by writing `npm start` in the terminal.
4. After starting successfully, the frontend application will run on http://localhost:4200.
5. Make sure the backend API is running before starting the frontend application.

## Backend Tests
### Covered Backend Tests
The backend unit tests cover:
- authentication service logic;
- cart service logic;
- order total calculations;
- login and registration validation;
- JWT authentication related functionality.

### Running Backend Tests
1. Open a terminal inside the `EcommerceAPI` folder.
2. Run the tests using:
```bash
dotnet test
```
## Frontend Tests
### Covered Frontend Tests
The frontend unit tests cover:
- product listing;
- cart functionality;
- checkout functionality;
- login functionality;
- registration functionality;
- authentication service;
- cart service.

### Running Frontend Tests
1. Open a terminal inside the `Ecommerce-frontend` folder.
2. Run the tests using:
```bash
npm test
```
## Authentication Notes
- JWT authentication is used for protected endpoints.
- Authentication tokens are stored in localStorage.
- An HTTP interceptor automatically attaches the JWT token to authenticated requests.
- Passwords are hashed using BCrypt before being stored in the database.
- Checkout functionality is available only for authenticated users.
