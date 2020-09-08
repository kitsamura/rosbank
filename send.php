<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';
// Переменные, которые отправляет пользователь
if($_POST['name']){
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $lastname = $_POST['lastname'];
    $email = $_POST['email'];
    $email2 = $_POST['email2'];
    $mobile = $_POST['mobile'];
    $dsa = $_POST['dsa'];
} 


$mail = new PHPMailer\PHPMailer\PHPMailer();


try {
    $msg = "ok";
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";                                          
    $mail->SMTPAuth   = true;
    // Настройки вашей почты
    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера GMAIL
    $mail->Username   = 'site-noreply@amulex.ru'; // Логин на почте
    $mail->Password   = 'BCBD86jhgVqzqrDjQK7v'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('site-noreply@amulex.ru'); // Адрес самой почты и имя отправителя
    // Получатель письма
    $mail->addAddress('rosbank-request@amulex.ru');
    
    $mail->addAddress('asamoylo@amulex.ru');

    // -----------------------
    // Само письмо
    // -----------------------
    $mail->isHTML(true);

    $mail->Subject = 'Росбанк - запрос разовой консультации';
    if($_POST['name']){
        $mail->Body = "
        <b>Почта:</b> $email<br><br>
        <b>Телефон:</b> $mobile<br><br>
        <b>ФИО:</b> $surname $name $lastname<br><br>
        <b>Код сотрудника DSA:</b> $dsa <br><br>
    ";

    } else {
        foreach($_REQUEST as $key=>$val){
            $mail->Body.= "<b>".$key."</b>: ".$val."<br>";
        }
    }
    
    // Проверяем отравленность сообщения
    if ($mail->send()) {
        echo "$msg";
    } else {
        echo "Сообщение не было отправлено. Неверно указаны настройки вашей почты";
    }
} catch (Exception $e) {
    echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}