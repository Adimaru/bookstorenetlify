# Bookstore Project

This project is a full-stack online bookstore application. It features a React-based frontend for user interaction and a Spring Boot backend providing a RESTful API for managing books, user authentication, and shopping cart functionalities.

## Features

### Frontend (React)
* User-friendly interface to browse books.
* Shopping cart functionality: add/remove books, modify quantities.
* User authentication: Login and Registration pages.
* Displays book details (title, author, price, description, image).

### Backend (Spring Boot)
* RESTful API for book, user, and cart operations.
* Basic user authentication (Login and Registration) with JWT.
* Integration with Google Books API to populate initial book data.
* In-memory H2 database for data storage.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Java Development Kit (JDK):** Version 17 or higher (Java 24 used in development).
    * [Download JDK](https://www.oracle.com/java/technologies/downloads/)
* **Apache Maven:** Version 3.6.0 or higher.
    * [Download Maven](https://maven.apache.org/download.cgi)
* **Node.js:** Version 14 or higher (which includes npm).
    * [Download Node.js](https://nodejs.org/en/download/)
* **Git:** For cloning the repository.
    * [Download Git](https://git-scm.com/downloads)

## Getting Started

Follow these steps to get the application up and running on your local machine.

## 1. Clone the Repository

First, clone the project repository to your local machine:

git clone <repository_url>
cd bookstore-project # Assuming your cloned repo creates this root folder
The project should now contain two main directories: bookstore-backend and bookstore-frontend.

## 2. Backend Setup (Spring Boot)
Navigate into the bookstore-backend directory and set up the Spring Boot application.

Bash

cd bookstore-backend
### 2.1. Build the Project
Build the Spring Boot application using Maven. This will download all necessary dependencies.

Bash

mvn clean install
### 2.2. Run the Backend Application
Once the build is successful, you can run the Spring Boot application:

Bash

mvn spring-boot:run
The backend server will start, typically on port 8080. You should see logs indicating that the application has started and the H2 database is available.

Default Data: On startup, the application will:

Create a default admin user: username: admin, password: admin

Create a default regular user: username: user, password: user

Populate the database with books fetched from the Google Books API.

H2 Console (Optional): You can access the H2 database console at http://localhost:8080/h2-console.

JDBC URL: jdbc:h2:mem:testdb

User Name: SA

Password: (leave empty)

## 3. Frontend Setup (React)
Open a new terminal window and navigate into the bookstore-frontend directory.

Bash

cd ../bookstore-frontend # If you are still in bookstore-backend, otherwise adjust path
### 3.1. Install Dependencies
Install the Node.js dependencies for the React application:

Bash

npm install
### 3.2. Configure API Base URL
VERY IMPORTANT!
VITE_API_BASE_URL=https://bookstore-project-1-b2fp.onrender.com
is currently set to onrender for cloudhosting. remember to change this to host local!

Create a .env file in the root of your bookstore-frontend directory (if it doesn't already exist) and specify the backend API URL:

VITE_API_BASE_URL=http://localhost:8080
### 3.3. Run the Frontend Application
Start the React development server:

Bash

npm run dev
The frontend application will start, typically on port 5173 (or another available port). The terminal will usually provide the URL (e.g., http://localhost:5173/).

Usage
Access the Application: Open your web browser and navigate to the URL provided by the npm run dev command (e.g., http://localhost:5173/).

Register: You can register a new user via the registration page.

Login: Use the default credentials (admin/admin or user/user) or your newly registered user to log in.

Browse Books: Explore the list of books fetched from the Google Books API.

Shopping Cart: Add books to your cart, modify quantities, and remove items as needed.

Checkout: (If implemented) Proceed to the checkout process to finalize your order.

Technologies Used
Backend: Spring Boot, Java, Maven, Spring Security, JWT, H2 Database, WebClient (for Google Books API).

Frontend: React, Vite, JavaScript, HTML, CSS.
