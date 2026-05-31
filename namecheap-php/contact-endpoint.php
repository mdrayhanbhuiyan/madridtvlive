<?php
/**
 * MADRID TV LIVE - PHP Contact Form and Support Ticket Dispatcher
 * Processed on Namecheap Servers using native mail() API.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->email) && !empty($data->message)) {
        $to_email = "rayhanbhuiyan2021@gmail.com"; 
        $subject = "Madrid TV Live Contact Support: " . ($data->subject ?? "Support Ticket");
        
        $email_content = "Sender: " . htmlspecialchars($data->name ?? 'Anonymous') . "\n";
        $email_content .= "Email: " . htmlspecialchars($data->email) . "\n\n";
        $email_content .= "Message:\n" . htmlspecialchars($data->message) . "\n";
        
        $headers = "From: webmaster@madridtvlive.com\r\n";
        $headers .= "Reply-To: " . htmlspecialchars($data->email) . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        if (mail($to_email, $subject, $email_content, $headers)) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Support ticket submitted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to send email relative to server limitations."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Incomplete request. Please provide both email and message."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
}
?>
