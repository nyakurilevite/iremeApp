
CREATE TABLE IF NOT EXISTS students 
  ( 
     id           INT PRIMARY KEY auto_increment, 
     parent_id    VARCHAR(22) UNIQUE NOT NULL, 
     student_id   VARCHAR(22) UNIQUE NOT NULL, 
     student_name   VARCHAR(100) NOT NULL, 
     education_program VARCHAR(3) NOT NULL,
     school_level VARCHAR(3) NOT NULL, 
     class        VARCHAR(50) NOT NULL, 
     school_name  VARCHAR(100) NOT NULL, 
     favorite_course VARCHAR(25) NOT NULL,
     fallback_course VARCHAR(25) NOT NULL,
     created_at     DATETIME NOT NULL,
     updated_at     DATETIME NOT NULL  
  ); 