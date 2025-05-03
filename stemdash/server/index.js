import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.post('/signup', async function (req, res) {
  const {
    student_id,
    first_name,
    last_name,
    preferred_name,
    student_email,
    phone_number,
    student_gender,
    student_pronouns,
    student_grade,
    shirt_size,
    user_password
  } = req.body;

  console.log('Form Data:', req.body);

  const query = `
    INSERT INTO user_profile (
      student_id, first_name, last_name, preferred_name,
      student_email, phone_number, student_gender,
      student_pronouns, student_grade, shirt_size, user_password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);

    pool.query(query, [
      student_id,
      first_name,
      last_name,
      preferred_name,
      student_email,
      phone_number,
      student_gender,
      student_pronouns,
      student_grade,
      shirt_size,
      hashedPassword
    ], function (err, results) {
      if (err) {
        console.error('Error inserting user:', err);
      } else {
        console.log("User inserted successfully");
        res.json(results);
      }
    });

  } catch (err) {
    console.error('Hashing error:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.post('/login', async function (req, res) {
    const { student_id, user_password } = req.body;
  
    try {
      const query = `SELECT * FROM user_profile WHERE student_id = ?`;
      pool.query(query, [student_id], async function (err, results) {
        if (err) {
          console.error('Error:', err);
          return res.json({success: false});
        }
  
        if (results.length === 0) {
          console.error('User not found');
          return res.json({success: false});
        }
  
        const user = results[0];
        const matching = await bcrypt.compare(user_password, user.user_password);
  
        if (matching) {
          return res.json({ success: true, user });
        } else {
          return res.json({ success: false });
        }
      });
    } catch (err) {
      console.error('Hashing error:', err);
      return res.json({ success: false });
    }
  });
  