const express = require('express');
const db = require('.//db_connection.js'); // Import the MySQL connection
const app = express();

// app.get('/api/jobs/search', async (req, res) => {
//     const { keyword, location } = req.query;

//     const query = `
//         SELECT * FROM jobs
//         WHERE job_title LIKE ? AND location LIKE ?
//     `;
//     const values = [`%${keyword}%`, `%${location}%`];

//     try {
//         const [results] = await db.promise().query(query, values); // Use promise()
//         res.status(200).json(results);
//     } catch (err) {
//         console.error('Error fetching jobs:', err.message);
//         res.status(500).json({ error: 'An error occurred while searching for jobs' });
//     }
// });

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

