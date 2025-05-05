npm install
npx nodemon


packages:
react-router-dom
mysql2 
cors
dotenv
express
bcrypt
'

USE stemdash;

-- Main user table
CREATE TABLE user_profile (
  student_id INT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  preferred_name VARCHAR(100),
  student_email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  student_gender VARCHAR(20) NOT NULL,
  student_pronouns VARCHAR(50),
  student_grade VARCHAR(20) NOT NULL,
  shirt_size VARCHAR(10) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_profile (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(50)
);

CREATE TABLE clubs (
  club_id INT AUTO_INCREMENT PRIMARY KEY,   
  club_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE teams (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  FOREIGN KEY (event_id) REFERENCES event_profile(event_id)
);

CREATE TABLE team_to_student (
  team_id INT,
  student_id INT,
  PRIMARY KEY (team_id, student_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  FOREIGN KEY (student_id) REFERENCES user_profile(student_id)
);

CREATE TABLE user_to_club (
  student_id INT,
  club_id INT,
  PRIMARY KEY (student_id, club_id),
  FOREIGN KEY (student_id) REFERENCES user_profile(student_id),
  FOREIGN KEY (club_id) REFERENCES clubs(club_id)
);


CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


---------------------------------

test my SQL code for clubs - 1039535 is my student id, im adding keyclub and fbla to my user

USE stemdash;
INSERT INTO clubs VALUES (1, "Key Club");
INSERT INTO clubs VALUES (2, "FBLA");
INSERT INTO user_to_club VALUES (1039535, 1);
INSERT INTO user_to_club VALUES (1039535, 2);


SELECT * FROM clubs;
SELECT * FROM user_to_club;
SELECT * FROM user_profile; 