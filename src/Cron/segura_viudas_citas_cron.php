<?php
namespace Drupal\segura_viudas_citas\Cron;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\node\Entity\Node;
use Drupal\Core\Url;
use Drupal\segura_viudas_citas\SmsService;

class segura_viudas_citas_cron {

  /**
   * @var \Drupal\segura_viudas_citas\SmsService
   */
  protected $smsService;

  /**
   * Segura_Viudas_Citas_Cron constructor.
   * @param \Drupal\segura_viudas_citas\SmsService $smsService
   */
  public function __construct(SmsService $smsService) {
    $this->smsService = $smsService;
  }

  /**
   * Run Cron.
   */
  public function run() {
    // creamos log avisando del inicio de la funcion de sms
    \Drupal::logger('segura_viudas_citas')->notice('Iniciando envío de SMS');
    $now = new DrupalDateTime();
    $now->add(new \DateInterval('P1D'));
    $now_str = $now->format('Y-m-d');

    $query = \Drupal::entityQuery('node')
      ->condition('type', 'citas')
      ->condition('field_date', $now_str, '=')
      ->accessCheck(TRUE);

    $nids = $query->execute();
    // hacemos log con los nids que se han encontrado
    \Drupal::logger('segura_viudas_citas')->notice('NIDs encontrados: @nids', [
      '@nids' => implode(', ', $nids),
    ]);
    if (!empty($nids)) {
      foreach ($nids as $nid) {
        $node = Node::load($nid);
        $user = $node->getOwner();
        if ($user) {
          // creamos log con los datos del usuario
          \Drupal::logger('segura_viudas_citas')->notice('Usuario encontrado: @user', [
            '@user' => $user->get('name')->getString(),
          ]);

          $phone_number = '0034' . $user->get('field_telefono')->getString();
          $date = $node->get('field_date')->getString();
          $time = $node->get('field_time')->getString();
          // hace log con los datos de la cita
          \Drupal::logger('segura_viudas_citas')->notice('Cita encontrada: @date a las @time', [
            '@date' => $date,
            '@time' => $time,
          ]);

          // Define el enlace que quieres acortar.
          $link = 'https://shorturl.at/DOT19';

          // Utiliza la API de Bitly para acortar el enlace.
          //$link = $this->getShortLink($link, '{your_bitly_token}');

          $message = "Tiene cita el {$date} a las {$time}H.\nTé la reserva {$date} a les {$time}H.\nModifica o cancela la cita: {$link}";
          // creamos log con los datos que enviamos al SmsService
          \Drupal::logger('segura_viudas_citas')->notice('Enviando SMS a @phone_number con el mensaje: @message', [
            '@phone_number' => $phone_number,
            '@message' => $message,
          ]);
          $this->smsService->segura_viudas_citas_send_sms($phone_number, $message);
        }
      }
    }
  }

  private function getShortLink($long_url, $access_token) {
    $url = 'https://api-ssl.bitly.com/v4/shorten';
    $headers = [
      'Authorization: Bearer ' . $access_token,
      'Content-Type: application/json',
    ];

    $post_data = [
      'long_url' => $long_url,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);

    if (curl_errno($ch)) {
      // Ha ocurrido un error durante la petición. Mostrar error.
      return "Error: " . curl_error($ch);
    } else {
      // No hubo error, decodificar la respuesta.
      $result_data = json_decode($result, TRUE);
      // Cerrar el gestor cURL.
      curl_close($ch);
      // Devolver el enlace corto.
      return $result_data['link'] ?? $long_url;
    }
  }
}
