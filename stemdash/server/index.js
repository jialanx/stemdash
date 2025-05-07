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

app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/createNewClub', function (req, res) {
  const { club_name } = req.body;

  const query = 'INSERT INTO clubs (club_name) VALUES (?)';
  pool.query(query, [club_name], function (err, insertResult) {
    if (err) {
      console.error("Error inserting club:", err);
      return res.json({ success: false });
    }

    // Use insertId to get the club_id immediately
    const club_id = insertResult.insertId;

    pool.query(
      'INSERT INTO user_to_club (student_id, club_id) VALUES (0, ?)',
      [club_id],
      function (err) {
        if (err) {
          console.error("Error adding user to club:", err);
          return res.json({ success: false });
        }

        res.json({ success: true, club_id });
      }
    );
  });
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


  app.get('/listMyEvents', function (req, res) { 
    const { student_id } = req.query;
    const query = `SELECT event_profile.*, team_to_student.team_id FROM team_to_student
                   JOIN event_to_team ON team_to_student.team_id = event_to_team.team_id
                   JOIN event_profile ON event_to_team.event_id = event_profile.event_id
                   WHERE team_to_student.student_id = ?`;

    pool.query(query, [student_id], function (err, results) {
      if (err) {
        console.error("error listing events:", err);
        return res.json({ success: false});
      } 
      return res.json({success: true, results});
    })
  })


  app.post('/createTeam', function (req, res) {
    const { event_id, student_id } = req.body;
  
    const query = `INSERT INTO teams (event_id) VALUES (?)`;
  
    pool.query(query, [event_id], function (err, results) {
      if (err) {
        console.error("Error inserting into teams:", err);
        return res.json({ success: false });
      }
  
      const team_id = results.insertId;
  
      const query2 = `INSERT INTO event_to_team (event_id, team_id) VALUES (?, ?)`;
  
      pool.query(query2, [event_id, team_id], function (err2) {
        if (err2) {
          console.error("Error inserting into event_to_team:", err);
          return res.json({ success: false });
        }

        const query3 = `INSERT INTO team_to_student (team_id, student_id) VALUES (?, ?)`;

        pool.query(query3, [team_id, student_id], function (err3) {
          if (err3) {
            console.error("error:", err3);
            return res.json({success: false});
          }
          pool.query(query3, [team_id, 0], function() {
            return res.json({success:true, team_id});
          });
        });
      }); 
    });
  });
  

  app.get('/loadEvents', function (req, res) {
    const { club_id } = req.query;
    const query = `SELECT event_profile.event_id, 
                  event_profile.event_name FROM event_to_club
                  JOIN event_profile ON event_to_club.event_id = event_profile.event_id 
                  WHERE event_to_club.club_id = ?`;
    pool.query(query, [club_id], function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      return res.json(results);
    })
  });

  app.get('/clubInfo', function (req, res) {
    const { club_id } = req.query; 
    const query = `SELECT 
      clubs.club_id, 
      clubs.club_name, 
      COUNT(user_to_club.student_id) AS member_count
      FROM clubs 
      LEFT JOIN user_to_club 
      ON user_to_club.club_id = clubs.club_id 
      WHERE clubs.club_id = ?
      GROUP BY clubs.club_id, clubs.club_name`;

    pool.query(query, [club_id], function (err, results) { 
      if (err) {
        console.log(err);
        return;
      }
      return res.json(results);
    }) 
  })

  app.get('/hubs', function (req, res) {
    const { student_id } = req.query; // query for small messages ect. body for larger POST commands maybe
    // selects club_id and club_name from user_to_club {table}
    // but bc user_to_club only has student id and club id, 
    // we join it with the clubs table
    // but only join the rows where club id matches
    // only for the id of our student_id
    const query = `SELECT clubs.club_id, clubs.club_name 
                    FROM user_to_club
                    JOIN clubs
                    ON user_to_club.club_id = clubs.club_id
                    WHERE user_to_club.student_id = ?`;

    pool.query(query, [student_id], function (err, results) {
        if (err) { 
            console.error(err);
            return;
        }
        return res.json(results);
    });
});

  