# lensnodejsassignment

Explanation:

Dependencies: The necessary dependencies like Express for creating the API, MySQL for database interaction, JWT for token-based authentication, bcrypt for password hashing, and Swagger tools for API documentation are installed.

Database Connection: A MySQL connection is established, and a middleware function authenticateJWT is defined to protect routes by verifying JWT tokens.

Endpoints:

/register: Registers a new user by hashing the password and storing user details in the database.
/login: Authenticates a user by checking the email and password, and issues a JWT token on successful authentication.
/logout: Logs out the user by effectively nullifying the token on the client-side.
/profile: Retrieves the authenticated user's profile information.

Swagger Documentation: The swagger.json file defines the OpenAPI Specification for the API, detailing each endpoint, its parameters, responses, and authentication requirements.

Running the API: Start the API by running node index.js and access Swagger documentation at http://localhost:3000/api-docs.

This setup ensures a clear and structured implementation of user authentication and management functionalities with proper documentation for ease of understanding.
