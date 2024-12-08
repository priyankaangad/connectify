const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors()); // Enable CORS
const db = require('./db_connection'); // Import the MySQL connection


const JobModel = require('./models/Job');


// Middleware to parse JSON request body
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'connectify',
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

// Endpoint to get all jobs
app.get("/jobs", (req, res) => {
  connection.query("SELECT * FROM jobs", (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

let jobs = [];

// POST endpoint to create a new job listing
app.post("/jobs", (req, res) => {
  const {
    job_title,
    company_name,
    job_description,
    job_type,
    salary,
    skills_required,
    application_deadline,
    contact_email,
    location,
  } = req.body;

  if (
    !job_title ||
    !company_name ||
    !job_description ||
    !job_type ||
    !salary ||
    !application_deadline ||
    !contact_email ||
    !location
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const query =
    "INSERT INTO jobs (job_title, company_name, job_description, job_type, salary, skills_required, application_deadline, contact_email, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    job_title,
    company_name,
    job_description,
    job_type,
    salary,
    skills_required,
    application_deadline,
    contact_email,
    location,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting job:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error creating job" });
    }
    res
      .status(200)
      .json({ success: true, message: "Job created successfully" });
  });
});

// Get all jobs (to display on the listing page)
app.get("/jobs", (req, res) => {
  jobs.find({}, (err, jobs) => {
    // Find all jobs
    if (err) {
      console.log("Error fetching jobs:", err);
      return res.status(500).send({ message: "Error fetching jobs" });
    }
    res.status(200).send({ jobs });
  });
});

app.post("/register", async (req, res) => {
  console.log("Received request body:", req.body);

  const {
    email,
    password,
    name,
    skills,
    educationLevel,
    graduationStartDate,
    graduationEndDate,
    workExperiences,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name, email, or password" });
    }

    // Check if user already exists
    const [existingUser] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Inserting user with:", {
      email,
      hashedPassword,
      name,
      skills,
      educationLevel,
      graduationStartDate,
      graduationEndDate,
    });

    // Insert user into the database
    const [userResult] = await connection
      .promise()
      .query(
        "INSERT INTO users (email, password, name, skills, educationLevel, graduationStartDate, graduationEndDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          name,
          skills,
          educationLevel,
          graduationStartDate,
          graduationEndDate,
        ]
      );

    const userId = userResult.insertId;

    // Insert work experiences if provided
    if (workExperiences && workExperiences.length > 0) {
      const workExperienceQueries = workExperiences.map(
        ({ companyName, role, startDate, endDate }) => {
          return connection
            .promise()
            .query(
              "INSERT INTO work_experiences (user_id, company_name, role, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
              [userId, companyName, role, startDate, endDate]
            );
        }
      );

      await Promise.all(workExperienceQueries);
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);

    // Return error message for development purposes
    const response =
      process.env.NODE_ENV === "development"
        ? { message: "Internal server error", error: error.message }
        : { message: "Internal server error" };

    res.status(500).json(response);
  }
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.error("Error querying users:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Validate password
      const validPassword = await bcrypt.compare(password, result[0].password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate a token
      const token = jwt.sign({ id: result[0].id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.json({ message: "Login successful", token });
    }
  );
});

// Middleware to verify the token and get user profile
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.id; // Attach user id to the request object
    next();
  });
};

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified. You can now reset your password.",
    });
  });
});

const saltRounds = 10;

app.post("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  // Hash the new password
  bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to hash password." });
    }

    const query = "UPDATE users SET password = ? WHERE email = ?";
    connection.query(query, [hashedPassword, email], (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Email not found. Password update failed.",
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully." });
    });
  });
});



app.get('/api/jobs/search', (req, res) => {
  const { keyword = '', location = '' } = req.query;

  // If no keyword or location provided, fetch all jobs
  let query;
  let values;
  if (!keyword && !location) {
      query = `SELECT * FROM jobs`; // Fetch all jobs
      values = [];
  } else {
      query = `
          SELECT * FROM jobs
          WHERE job_title LIKE ? AND location LIKE ?
      `;
      values = [`%${keyword}%`, `%${location}%`];
  }

  db.query(query, values, (err, results) => {
      if (err) {
          console.error("Error fetching jobs:", err);
          res.status(500).json({ error: "An error occurred while searching for jobs" });
      } else {
          res.status(200).json(results);
      }
  });
});


// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });



// app.get('/api/jobs/search', async (req, res) => {
//   const { keyword, location, skills } = req.query;

//   try {
//     const query = {};

//     // Add conditions based on the search inputs
//     if (keyword) query.job_title = { $regex: keyword, $options: 'i' };
//     if (location) query.location = { $regex: location, $options: 'i' };
//     if (skills) query.skills_required = { $regex: skills, $options: 'i' };

//     // Fetch jobs from the database
//     const jobs = await JobModel.find(query);
//     res.status(200).json(jobs);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while searching for jobs' });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


