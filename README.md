# DriveProject

This is an application for managing and storing files, built with Node.js, Express, and MongoDB.

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- EJS (Templating Engine)
- Multer (for file uploads)
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)
- cookie-parser
- dotenv
- express-validator
- firebase-admin
- method-override

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd DriveProject
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    # Add any other environment variables required for Firebase Admin SDK or other services
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```

    The application will be accessible at `http://localhost:3000` (or the port you specified in `.env`).

## Project Structure

```
.env
.gitignore
app.js
package-lock.json
package.json
config/
├── database.js
└── multer.config.js
middleware/
└── auth.js
models/
├── files.models.js
└── user.model.js
public/
├── style.css
└── uploads/
routes/
├── index.routes.js
└── user.routes.js
views/
├── home.ejs
├── index.ejs
├── login.ejs
└── register.ejs
```
