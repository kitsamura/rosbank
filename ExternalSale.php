<?php

$rates = [
    
    2841 => 'QqkSdajdNEBeYNNXJA5c8YZdMt94qrKZ', 
    2842 => 'A7SMSbne8R2p4jj988WdjJLC2p49NrBT',
    2817 => '58Z983TTA9nFjrf2qrJvWaTr6VN7Cjw6'

];

$c = new SaleApi('https://pay2.amulex.ru', $_REQUEST['rate_id'], $rates[$_REQUEST['rate_id']]);

$a = $_REQUEST['a'];
echo call_user_func([$c, $a], $_REQUEST);


class SaleApi
{
    private $baseUrl;
    private $rateId;
    private $rateSecret = 'secret';

    private $initRoute = 'sales/external-sale/init';
    private $checkRoute = 'sales/external-sale/check-promocode';

    public function __construct($baseUrl, $rateId, $rateSecret)
    {
        if (!function_exists('curl_init')) {
            throw new \Exception('Не установлено расширение php-curl');
        }

        $this->baseUrl    = $baseUrl;
        $this->rateId     = $rateId;
        $this->rateSecret = $rateSecret;
    }

    public function check($post)
    {
        return $this->send($this->checkRoute, ['promocode' => $post['promocode']]);
    }

    public function init($post)
    {
        return $this->send($this->initRoute);
    }

    private function send($route, $postFields = [])
    {
        $postFields = array_merge([
            'rate_id' => $this->rateId,
            'secret'  => $this->rateSecret
        ], $postFields);

        $url = $this->baseUrl . '/' . $route;
        $ch  = curl_init($url);

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);

        $result = curl_exec($ch);
        $error  = curl_error($ch);
        curl_close($ch);

        return empty($error) ? $result : $result . ' ' . $error;
    }
}
