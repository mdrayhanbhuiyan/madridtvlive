<?php
/**
 * MADRID TV LIVE - Namecheap PHP Router & Wrapper
 * Ensures clean rendering and client-side page load on standard cPanel Apache server.
 */

// If you want to log visits or inject custom SEO tags via PHP, you can do it here.
$page_title = "MADRID TV LIVE - Watch Sports Live";

// Load our main compiled index.html file which contains our compiled React/Tailwind Bundle
// index.html will fetch static JS/CSS from assets/
if (file_exists("index.html")) {
    include("index.html");
} else {
    echo "<h2 style='text-align: center; margin-top: 100px; font-family: sans-serif; color: #333;'>";
    echo "Madrid TV Live is currently compiling. Please run <br><code>npm run build</code><br> and upload output files!";
    echo "</h2>";
}
?>
