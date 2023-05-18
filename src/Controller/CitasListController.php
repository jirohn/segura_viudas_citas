<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\Core\Url;

class CitasListController extends ControllerBase {

  // creamos un codigo ajax que nos devuelve las citas que hay en cada dia y las enviaremos a la vista
  /**
   * Callback for the 'segura_viudas_citas/admin_check_apointments' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function adminCheckAppointments(Request $request) {
    $date = $request->query->get('date');

    // Log the received date
    \Drupal::logger('segura_viudas_citas')->notice('Received date: @date', ['@date' => $date]);
    $existing_citas = []; // Inicializa la variable $existing_citas como un array vacío.

    $query = \Drupal::entityQuery('node')
    ->condition('type', 'citas')
    ->condition('field_date', $date)
    ->accessCheck(FALSE);



    $nids = $query->execute();

    if (!empty($nids)) {
      $nodes = Node::loadMultiple($nids);
      foreach ($nodes as $node) {
        //comprobamos si el 'field_modalidad'  del nodo es False se llamara "Presencial" y si es True se llamara "Telefonica"
        if ($node->get('field_modalidad')->value == 0) {
          $modalidad = "Presencial";
        } else {
          $modalidad = "Telefonica";
        }
        $existing_citas[] = [
          'nid' => $node->id(),
          'title' => $node->label(),
          'field_date' => $node->get('field_date')->value,
          'field_time' => $node->get('field_time')->value,
          'field_comment' => $node->get('field_comment')->value,
          'field_modalidad' => $modalidad,
        ];
      }
    }


    return new JsonResponse($existing_citas);
  }
 //Creamos el ajax que elimina las citas//
  /**
   * Callback for the 'segura_viudas_citas/admin/delete_appointment' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function deleteAppointment(Request $request) {
    $nid = $request->query->get('nid');
    $date = $request->query->get('date');

    // Log the received date
    \Drupal::logger('segura_viudas_citas')->notice('Received nid: @nid', ['@nid' => $nid]);

    $node = Node::load($nid);
    $node->delete();
    $query = \Drupal::entityQuery('node')
    ->condition('type', 'citas')
    ->condition('field_date', $date)
    ->accessCheck(FALSE);



    $nids = $query->execute();
    if (!empty($nids)) {
      $nodes = Node::loadMultiple($nids);
      foreach ($nodes as $node) {
        //comprobamos si el 'field_modalidad'  del nodo es False se llamara "Presencial" y si es True se llamara "Telefonica"
        if ($node->get('field_modalidad')->value == 0) {
          $modalidad = "Presencial";
        } else {
          $modalidad = "Telefonica";
        }
        $existing_citas[] = [
          'nid' => $node->id(),
          'title' => $node->label(),
          'field_date' => $node->get('field_date')->value,
          'field_time' => $node->get('field_time')->value,
          'field_comment' => $node->get('field_comment')->value,
          'field_modalidad' => $modalidad,
        ];
      }
    }
    return new JsonResponse($existing_citas);
  }
  //Creamos un ajax que crea una cita llamada "Bloquedo" para poder bloquear las horas que no se pueden seleccionar ese dia//
  /**
   * Callback for the 'segura_viudas_citas/admin_block_appointment' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function adminBlockAppointment(Request $request) {
    // recibimos la variable del request con los datos $date y $time
    $date = $request->query->get('date');
    $time = $request->query->get('timeSlot');


    // Log the received date
    \Drupal::logger('segura_viudas_citas')->notice('Received date: @date', ['@date' => $date]);
    \Drupal::logger('segura_viudas_citas')->notice('Received time: @time', ['@time' => $time]);
    // dejamos solo la fecha sin la hora
    $date = substr($date, 0, 10);
    // creamos un nodo con el tipo de contenido citas
    $node = Node::create([
      'type' => 'citas',
      'title' => 'Bloqueado',
      'field_date' => $date,
      'field_time' => $time,
      'field_modalidad' => 0,
    ]);
  $node->save();



    return new JsonResponse(['status' => 'ok']);
  }
  public function content() {
    // Obtén todas las citas.
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'citas')
      ->sort('created', 'DESC')
      ->accessCheck(FALSE); // Añade esta línea para deshabilitar la verificación de acceso.
    $nids = $query->execute();

    // Carga las citas.
    $citas_nodes = \Drupal\node\Entity\Node::loadMultiple($nids);

    // Crea una tabla para mostrar las citas.
    $header = [
      'title' => $this->t('Título'),
      'field_date' => $this->t('Fecha'),
      'field_time' => $this->t('Hora'),
      'field_comment' => $this->t('Comentario'),
    ];

    $rows = [];
    foreach ($citas_nodes as $node) {
      $row = [
        'title' => Link::fromTextAndUrl($node->label(), $node->toUrl()),
        'field_date' => $node->get('field_date')->value,
        'field_time' => $node->get('field_time')->value,
        'field_comment' => $node->get('field_comment')->value,
        'field_modalidad' => $node->get('field_modalidad')->value,
      ];
      $rows[] = $row;
    }

    $build = [
      '#theme' => 'gestion_citas',
      '#title' => $this->t('Gestión de citas'),
      '#header' => $header,
      '#rows' => $rows,
      '#attached' => [
        'library' => [
          'segura_viudas_citas/admin_citas',
        ],
      ],
    ];


    return $build;
  }

}
