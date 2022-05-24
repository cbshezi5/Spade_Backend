<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');


require_once ('PHPMailerAutoload.php');
    function sendOTP($emailUser,$severEmail,$password,$subject,$body)
    {
        $mail = new PHPMailer();
        //icon
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'ssl';
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = '465';
        $mail->isHTML();
        $mail->Username = $severEmail;
        $mail->Password = $password;
        $mail->SetFrom('no-reply@knine');
        $mail->Subject = $subject;
        $mail->addEmbeddedImage("not_icon.png", "my-attach");
        $mail->Body = '
        <h1>Bus Point</h1>
        <br>
        <h5>'.$body.'<h5>
        <br>
        <img alt="PHPMailer" src="cid:my-attach"> 
        <br>
        <br>
        <label>from <label style="color:green">nextstep</label></label>';
	    $mail->AddAddress($emailUser);
        $mail->send();
    }


    $body = file_get_contents('php://input');


    $email = json_decode($body)->{'email'};
    $otp = json_decode($body)->{'otp'};

     $emailBody ="Hi your One Time Pin (OTP) is ${otp} this OTP was requested with the Bus Point system for verification of the user "; 
     $emailTittle = "Bus Point OTP ";
     sendOTP($email,"no.reply.k9nine@gmail.com","Tut@2017",$emailTittle,$emailBody);

	$data = '{"error":"0"}';
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
    
?>
