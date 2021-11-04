
CREATE DATABASE IF NOT EXISTS ireme_app;   
USE ireme_app; 


CREATE TABLE IF NOT EXISTS users 
  ( 
     id         INT PRIMARY KEY auto_increment, 
     username   VARCHAR(25) UNIQUE NOT NULL, 
     password   CHAR(60) NOT NULL, 
     first_name VARCHAR(50) NOT NULL, 
     last_name  VARCHAR(50) NOT NULL, 
     email      VARCHAR(100) UNIQUE NOT NULL, 
     role       ENUM('Admin', 'SuperUser','User') DEFAULT 'SuperUser', 
     account_id        VARCHAR(22) NOT NULL, 
     enabled     ENUM('0', '1','2') DEFAULT '0', 
     created_at     DATETIME NOT NULL,
     updated_at     DATETIME NOT NULL  
  ); 