<?php
// DATABASE CONFIG
$host = '192.168.101.108';
$db   = 'treasurer_management_app';
$user = 'treasurer_root2';
$pass = '$p4ssworD!';
$charset = 'utf8mb4';
$port = 3307;

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("❌ Connection failed: " . $e->getMessage());
}

// FORM INPUT
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$role     = $_POST['role'] ?? 'user';

// VALIDATE
if (empty($username) || empty($password)) {
    die("❌ Username and password are required.");
}

// HASH PASSWORD
$hash = password_hash($password, PASSWORD_DEFAULT);

// INSERT TO MYSQL
$sql = "INSERT INTO USERS (USERNAME, PASSWORD_HASH, ROLE) 
        VALUES (:username, :password, :role)";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        ':username' => $username,
        ':password' => $hash,
        ':role'     => $role
    ]);

    echo "✅ User '$username' created successfully in MySQL.<br>";
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        die("⚠️ Username already exists in database.");
    } else {
        die("❌ Error: " . $e->getMessage());
    }
}

// 📝 CREATE INDIVIDUAL JSON FILE
$folderPath = __DIR__ . "/user_login";

// Ensure folder exists
if (!is_dir($folderPath)) {
    mkdir($folderPath, 0755, true);
}

// Filename format: username.YYYY-MM-DD.HH-MM-SS.json
$timestamp = date('Y-m-d.H-i-s');
$cleanUsername = preg_replace('/[^a-zA-Z0-9_-]/', '_', $username); // sanitize filename
$filename = "$cleanUsername.$timestamp.json";
$fullPath = $folderPath . "/" . $filename;

// JSON content
$userData = [
    'username'   => $username,
    'password'   => $password, // ⚠️ Plaintext (for controlled/demo use)
    'role'       => $role,
    'created_at' => date('Y-m-d H:i:s')
];

// Save JSON
file_put_contents($fullPath, json_encode($userData, JSON_PRETTY_PRINT));

echo "📄 JSON file saved: <code>$filename</code>";
?>
