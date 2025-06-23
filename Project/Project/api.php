<?php
// api.php - API for frontend to fetch forms
require_once 'config.php';

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        if (isset($_GET['department'])) {
            $dept_key = $_GET['department'];
            
            // Fetch forms for the specific department
            $stmt = $pdo->prepare("
                SELECT f.id, f.form_name, f.file_size, f.file_path, f.file_name, f.created_at
                FROM forms f
                JOIN departments d ON f.department_id = d.id
                WHERE d.dept_key = ?
                ORDER BY f.form_name ASC
            ");
            $stmt->execute([$dept_key]);
            $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true, 
                'forms' => $forms,
                'count' => count($forms)
            ]);
            
        } elseif (isset($_GET['departments'])) {
            // Fetch all departments
            $stmt = $pdo->query("SELECT id, dept_key, dept_name FROM departments ORDER BY dept_name");
            $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true, 
                'departments' => $departments
            ]);
            
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'Department parameter required. Use ?department=dept_key or ?departments=all'
            ]);
        }
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
    
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Only GET method allowed'
    ]);
}
?>