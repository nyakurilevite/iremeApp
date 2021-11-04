

CREATE TABLE IF NOT EXISTS tokens 
  ( 
     id         INT PRIMARY KEY auto_increment, 
     account_id VARCHAR(50) UNIQUE NOT NULL, 
     token      VARCHAR(100) NOT NULL, 
     token_expiry VARCHAR(10) NOT NULL, 
     created_at  DATETIME NOT NULL, 
     updated_at  DATETIME NOT NULL
  ); 