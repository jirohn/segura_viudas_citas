<?php
namespace Drupal\segura_viudas_citas;

class SmsService {

  public function segura_viudas_citas_send_sms( $numbers, $message ){

    $service_plan_id = "63de8e90744d4246976717ece9fb52b8";
    $bearer_token = "694511171c9f4150881251b7229c1085";

    // Cualquier número de teléfono asignado a tu API
    $send_from = "+34600000000";
    // Puede ser varios, separados por una coma ,

    $recipient_phone_numbers = $numbers;
    // Check recipient_phone_numbers for multiple numbers and make it an array.
    if(stristr($recipient_phone_numbers, ',')){
      $recipient_phone_numbers = explode(',', $recipient_phone_numbers);
    }else{
      $recipient_phone_numbers = [$recipient_phone_numbers];
    }

    // La URL base debe ser seleccionada de acuerdo con la región que eliges en tu Dashboard de Sinch
    $base_url = "https://eu.sms.api.sinch.com/xms/v1/{$service_plan_id}/batches";

    $headers = array(
        "Content-Type:application/json",
        "Authorization: Bearer {$bearer_token}"
    );


    $data = array(
        "from" => $send_from,
        "to" => $recipient_phone_numbers,
        "body" => $message
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $base_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    }

}
