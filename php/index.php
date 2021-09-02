<?php  
        $servername = "localhost";
        $username = "username";
        $password = "password";
        $database = "database";
        $conn = new mysqli($servername, $username, $password, $database);
        
        ini_set('display_errors', 1);
        ini_set('log_errors', 1);
        error_reporting(E_ALL);
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        if ($conn->connect_error) {
            die("connection failed: " . $conn->connect_error);
        }

        $hash_id = $_GET["hash"];
        $hash_id = mysqli_escape_string($conn, $hash_id);
        $result = mysqli_query($conn, "SELECT * FROM `commands` WHERE `hash` LIKE '$hash_id'");
        if (!$result) {
            echo "something's gone wrong!".mysqli_error();
        } 

        $data = mysqli_fetch_assoc($result);
        $string = $data["result"];
        $date = $data["date_added"];
        $dserverid = $data["server_id"];

        $dserver = mysqli_query($conn, "SELECT * FROM `servers` WHERE `server_id` LIKE '$dserverid'");
        if (!$dserver) {
            echo "something's gone wrong!".mysqli_error();
        } 
        $dservername = mysqli_fetch_assoc($dserver);
        $dserverdecoded = $dservername["name"];
        echo $dserverdecoded;

        if (strpos($data["command"], "playtime") !== false){
            echo "<h3>Playtime</h3>";
        }
        if (strpos($data["command"], "ecredit") !== false){
            echo "<h3>E Credits</h3>";
        }
        if (strpos($data["command"], "gearscore") !== false){
            echo "<h3>Gearscore</h3>";
        }
        if (strpos($data["command"], "clanexp") !== false){
            echo "<h3>Clan EXP</h3>";
        }
        if (strpos($data["command"], "cxp") !== false){
            echo "<h3>Clan EXP</h3>";
        }
        if (strpos($data["command"], "clanexp24h") !== false){
            echo "<h3>24 hour</h3>";
        }
        if (strpos($data["command"], "cxp24h") !== false){
            echo "<h3>24 hour</h3>";
        }
        if (strpos($data["command"], "clanexp7d") !== false){
            echo "<h3>7 days</h3>";
        }
        if (strpos($data["command"], "cxp7d") !== false){
            echo "<h3>7 days</h3>";
        }
        if (strpos($data["command"], "clanexp30d") !== false){
            echo "<h3>30 days</h3>";
        }
        if (strpos($data["command"], "cxp30d") !== false){
            echo "<h3>30 days</h3>";
        }
        if (strpos($data["command"], "commendation") !== false){
            echo "<h3>Commendations</h3>";
        }

        $json = $string;
        $obj = json_decode($json);
        array_multisort(array_column($obj, 'ranked_value'), SORT_DESC, $obj);
        
        echo '<table style="border:1px solid #fff;margin-left:auto;margin-right:auto;">';
        echo '<thead>';
        echo '<tr height="50px" style="font-size:15px;">';
        echo '<th bgcolor="#fff" style="color:#000100;position: sticky;position: -webkit-sticky;top: 0px;z-index: 2;font-weight: normal;border:1px solid #000100;padding: 5px 5px 5px 5px;">Rank #</td>';
        echo '<th bgcolor="#fff" style="color:#000100;position: sticky;position: -webkit-sticky;top: 0px;z-index: 2;font-weight: normal;border:1px solid #000100;padding: 5px 5px 5px 5px;">Discord Name</td>';
        echo '<th bgcolor="#fff" style="color:#000100;position: sticky;position: -webkit-sticky;top: 0px;z-index: 2;font-weight: normal;border:1px solid #000100;padding: 5px 5px 5px 5px;">Gaming Name</td>';
        echo '<th bgcolor="#fff" style="color:#000100;position: sticky;position: -webkit-sticky;top: 0px;z-index: 2;font-weight: normal;border:1px solid #000100;padding: 5px 5px 5px 5px;">Score</td>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        $rank=0;

        foreach($obj as $cell){
        echo '<tr height="40px" style="font-size:13px;font-weight: bold;border:1px solid #fff;">';
        $rank++;
        echo '<td style="padding: 5px 5px 5px 5px;">#'.$rank.'</td>';
        echo '<td bgcolor="#aaa" style="padding: 5px 5px 5px 5px;color:#000100;max-width:120px;word-wrap: break-word;">'.$cell->username.'</td>';
        echo '<td style="padding: 5px 5px 5px 5px;max-width:120px;word-wrap: break-word;">'.$cell->uplay_id.'</td>';
        echo '<td bgcolor="#aaa" style="padding: 5px 5px 5px 5px;color:#000100;max-width:60px;word-wrap: break-word;">'.$cell->display_value.'</td>';
        echo '</tr>';
        }
        echo '</tbody>';
        echo '</table>';

        echo '<div style="padding-top:30px;text-align: center;">date created: '.$date.'</div>';

        mysqli_close($conn);

        if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on'){
        $link = "https";
        } else {
        $link = "http";
        }
        $link .= "://";
        $link .= $_SERVER['HTTP_HOST'];
        $link .= $_SERVER['REQUEST_URI'];
        echo '<div style="padding-top:30px;text-align: center;">sharing link: ';
        echo "<a href='".$link."'>";
        echo $link;
        echo "</a></div>";
    ?>