CREATE DATABASE TechNovaDB;
USE TechNovaDB;

CREATE TABLE Department (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50) NOT NULL UNIQUE,
    Location VARCHAR(50) NOT NULL
);

CREATE TABLE Employee (
    EmpID INT AUTO_INCREMENT PRIMARY KEY,
    EmpName VARCHAR(50) NOT NULL,
    Gender ENUM('M','F') NOT NULL,
    DOB DATE NOT NULL,
    HireDate DATE NOT NULL,
    DeptID INT NOT NULL,
    CONSTRAINT fk_emp_dept
        FOREIGN KEY (DeptID)
        REFERENCES Department(DeptID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE Project (
    ProjectID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(100) NOT NULL,
    DeptID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    CONSTRAINT fk_proj_dept
        FOREIGN KEY (DeptID)
        REFERENCES Department(DeptID)
);

CREATE TABLE Performance (
    EmpID INT,
    ProjectID INT,
    Rating DECIMAL(3,1) CHECK (Rating BETWEEN 1 AND 5),
    ReviewDate DATE NOT NULL,
    PRIMARY KEY (EmpID, ProjectID),
    FOREIGN KEY (EmpID) REFERENCES Employee(EmpID)
        ON DELETE CASCADE,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
        ON DELETE CASCADE
);

CREATE TABLE Reward (
    EmpID INT,
    RewardMonth DATE,
    RewardAmount DECIMAL(10,2) CHECK (RewardAmount >= 0),
    PRIMARY KEY (EmpID, RewardMonth),
    FOREIGN KEY (EmpID) REFERENCES Employee(EmpID)
        ON DELETE CASCADE
);

CREATE INDEX idx_empname ON Employee(EmpName);
CREATE INDEX idx_deptid ON Employee(DeptID);

-- userstory2
INSERT INTO Department VALUES
(101,'IT','Bangalore'),
(102,'HR','Delhi'),
(103,'Finance','Mumbai'),
(104,'Marketing','Hyderabad'),
(105,'Sales','Chennai');

INSERT INTO Employee (EmpName, Gender, DOB, HireDate, DeptID) VALUES
('Asha','F','1990-07-12','2018-06-10',101),
('Raj','M','1988-04-09','2020-03-22',102),
('Neha','F','1995-01-15','2021-08-05',101),
('Kiran','M','1992-09-18','2019-11-11',103),
('Sneha','F','1993-12-25','2022-01-20',104);

INSERT INTO Project (ProjectName, DeptID, StartDate, EndDate) VALUES
('AI Development',101,'2023-01-01','2023-12-31'),
('HR Automation',102,'2023-02-01','2023-10-30'),
('Financial Audit',103,'2023-03-15','2023-09-15'),
('Marketing Campaign',104,'2023-04-01','2023-11-30'),
('Sales Expansion',105,'2023-05-01','2023-12-31');

INSERT INTO Performance VALUES
(1,1,4.5,'2023-06-01'),
(2,2,3.8,'2023-07-01'),
(3,1,4.9,'2023-06-15'),
(4,3,4.2,'2023-08-01'),
(5,4,3.5,'2023-09-01');

INSERT INTO Reward VALUES
(1,'2023-01-01',3000),
(2,'2023-02-01',800),
(3,'2023-03-01',2500),
(4,'2023-04-01',1500),
(5,'2023-05-01',900);
--
UPDATE Employee
SET DeptID = 105
WHERE EmpName = 'Sneha';

DELETE FROM Reward
WHERE RewardAmount < 1000;

-- userstory 3
SELECT EmpName, HireDate
FROM Employee
WHERE HireDate > '2019-01-01';

SELECT d.DeptName,
       ROUND(AVG(p.Rating),2) AS AvgRating
FROM Department d
JOIN Employee e ON d.DeptID = e.DeptID
JOIN Performance p ON e.EmpID = p.EmpID
GROUP BY d.DeptName;

SELECT EmpName,
       TIMESTAMPDIFF(YEAR, DOB, CURDATE()) AS Age
FROM Employee;

SELECT SUM(RewardAmount) AS TotalRewards
FROM Reward
WHERE YEAR(RewardMonth) = YEAR(CURDATE());

SELECT e.EmpName, r.RewardAmount
FROM Employee e
JOIN Reward r ON e.EmpID = r.EmpID
WHERE r.RewardAmount > 2000;

-- userstory 4

SELECT e.EmpName,
       d.DeptName,
       p.ProjectName,
       pf.Rating
FROM Performance pf
JOIN Employee e ON pf.EmpID = e.EmpID
JOIN Project p ON pf.ProjectID = p.ProjectID
JOIN Department d ON e.DeptID = d.DeptID;

SELECT e.EmpName, d.DeptName, pf.Rating
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
JOIN Performance pf ON e.EmpID = pf.EmpID
WHERE pf.Rating = (
    SELECT MAX(p2.Rating)
    FROM Performance p2
    JOIN Employee e2 ON p2.EmpID = e2.EmpID
    WHERE e2.DeptID = e.DeptID
);

SELECT EmpName
FROM Employee
WHERE EmpID NOT IN (
    SELECT EmpID FROM Reward
);

-- userstory 5
START TRANSACTION;

INSERT INTO Employee (EmpName, Gender, DOB, HireDate, DeptID)
VALUES ('Rohit','M','1996-05-10','2024-01-01',101);

INSERT INTO Performance
VALUES (LAST_INSERT_ID(),1,4.0,'2024-02-01');

COMMIT;

EXPLAIN
SELECT e.EmpName, d.DeptName
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID;

DROP INDEX idx_empname ON Employee;

EXPLAIN
SELECT * FROM Employee
WHERE EmpName = 'Asha';


CREATE INDEX idx_empname ON Employee(EmpName);



-- BONUS 

CREATE VIEW EmployeePerformanceView AS
SELECT e.EmpName,
       d.DeptName,
       p.Rating
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
JOIN Performance p ON e.EmpID = p.EmpID;

DELIMITER //

CREATE PROCEDURE GetTopPerformers(IN deptName VARCHAR(50))
BEGIN
    SELECT e.EmpName, pf.Rating
    FROM Employee e
    JOIN Department d ON e.DeptID = d.DeptID
    JOIN Performance pf ON e.EmpID = pf.EmpID
    WHERE d.DeptName = deptName
    ORDER BY pf.Rating DESC
    LIMIT 3;
END //

DELIMITER ;

CALL GetTopPerformers('IT');

