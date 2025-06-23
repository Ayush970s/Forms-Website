<?php
// config.php - Database configuration
session_start();

$host = 'localhost';
$dbname = 'government_portal';
$username = 'root';
$password = ''; // Change this to your MySQL password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Create tables if they don't exist
$createTables = "
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_key VARCHAR(50) UNIQUE NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    form_name VARCHAR(200) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(20) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES admins(id) ON DELETE SET NULL
);
";

$pdo->exec($createTables);

// Insert default admin (only if not exists)
$stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = 'admin'");
$stmt->execute();
if ($stmt->fetchColumn() == 0) {
    $stmt = $pdo->prepare("INSERT INTO admins (username, password) VALUES ('admin', ?)");
    $stmt->execute([password_hash('admin123', PASSWORD_DEFAULT)]);
}

// Insert departments (only if not exists) - Make sure these match the frontend exactly
$departments = [
    ['director_secretariat', 'Director Secretariat'],
    ['flight_sim_eval', 'Flight Simulation and Evaluation Group'],
    ['it', 'Information Technology'],
    ['quality_safety', 'Quality, Reliability and Safety'],
    ['project_control', 'Project Control and Management'],
    ['propulsion_eval', 'Propulsion Systems Evaluation Group'],
    ['materials_mgmt', 'Materials Management Group'],
    ['administration', 'Administration'],
    ['finance_division', 'Finance Division'],
    ['motor_transport', 'Motor Transport'],
    ['security_division', 'Security Division'],
    ['tech_forecasting', 'Technology Forecasting and Analysis'],
    ['cal_lab', 'Computer Aided Laboratory'],
    ['strategic_research', 'Strategic and Aerospace Research Centre'],
    ['electronics_reliability', 'Electronic Systems Reliability Group'],
    ['finance_coord', 'Finance Coordination & Human Budgeting']
];

foreach ($departments as $dept) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM departments WHERE dept_key = ?");
    $stmt->execute([$dept[0]]);
    if ($stmt->fetchColumn() == 0) {
        $stmt = $pdo->prepare("INSERT INTO departments (dept_key, dept_name) VALUES (?, ?)");
        $stmt->execute([$dept[0], $dept[1]]);
    }
}
?>