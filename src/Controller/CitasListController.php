<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\Core\Url;
use Drupal\Core\Datetime\DrupalDateTime;


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
        // si el nombre es bloqueado eliminamos la cita de la base de datos


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

    // Log the received nid
    \Drupal::logger('segura_viudas_citas')->notice('Received nid: @nid', ['@nid' => $nid]);

    $node = Node::load($nid);
    // Check if the node title is 'Bloqueado Ampliado'
    if ($node->label() == 'Bloqueado Ampliado') {
        // Change the title to 'Ampliado' instead of deleting
        $node->setTitle('Ampliado');
        $node->save();
    } else {
        // If the title is not 'Bloqueado Ampliado', delete the node as usual
        $node->delete();
    }

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
    // Recibimos las variables $date y $time
    $date = $request->query->get('date');
    $time = $request->query->get('timeSlot');

    // Log the received date and time
    \Drupal::logger('segura_viudas_citas')->notice('Received date: @date', ['@date' => $date]);
    \Drupal::logger('segura_viudas_citas')->notice('Received time: @time', ['@time' => print_r($time, true)]);
    $time = explode(',', $time);
    // Comprobamos si $time es un array
    if (is_array($time)) {
      $changed = false;

        foreach ($time as $t) {
            $existing_nodes = \Drupal::entityTypeManager()
                ->getStorage('node')
                ->loadByProperties(['type' => 'citas', 'field_time' => $t]);

            // Change the title of the existing node to 'Bloqueado Ampliado'
            foreach($existing_nodes as $existing_node) {
                $existing_node->setTitle('Bloqueado Ampliado');
                $existing_node->save();
                $changed = true;

            }
            if(!$changed){
            // Now create the new node
            $node = Node::create([
                'type' => 'citas',
                'title' => 'Bloqueado',
                'field_date' => $date,
                'field_time' => $t,
                'field_modalidad' => 0,
            ]);

            $node->save();
          }
        }
    } else {
        $existing_nodes = \Drupal::entityTypeManager()
            ->getStorage('node')
            ->loadByProperties(['type' => 'citas', 'field_time' => $time]);

        // Change the title of the existing node to 'Bloqueado Ampliado'
        $changed = false;
        foreach($existing_nodes as $existing_node) {
            $existing_node->setTitle('Bloqueado Ampliado');
            $existing_node->save();
            $changed = true;
        }

        // Now create the new node
        if(!$changed){
        $node = Node::create([
            'type' => 'citas',
            'title' => 'Bloqueado',
            'field_date' => $date,
            'field_time' => $time,
            'field_modalidad' => 0,
        ]);
        $node->save();
      }
    }

    return new JsonResponse(['status' => 'ok']);
}


  // creamos una orden ajax como la de arriba pero para crear horas ampliadas//
  /**
   * Callback for the 'segura_viudas_citas/admin_add_appointment' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function adminAddAppointment(Request $request) {
    // recibimos la variable del request con los datos $date y $time
    $date = $request->query->get('date');
    $time = $request->query->get('timeSlot');
    // Log the received date
    \Drupal::logger('segura_viudas_citas add appointment')->notice('Received date: @date', ['@date' => $date]);
    \Drupal::logger('segura_viudas_citas add appointment')->notice('Received time: @time', ['@time' => $time]);
    // creamos un nodo con el tipo de contenido citas y el titulo Ampliado
    $node = Node::create([
      'type' => 'citas',
      'title' => 'Ampliado',
      'field_date' => $date,
      'field_time' => $time,
      'field_modalidad' => 0,
    ]);
    $node->save();
    return new JsonResponse(['status' => 'added citas ok']);
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
  public function reservasContent() {
    // Obtén todas las citas de la semana actual
    // Deberías cambiar la lógica de la consulta según cómo determines qué semana es "actual"

    $startOfWeek = strtotime("last sunday");
    $endOfWeek = strtotime("next saturday");

    $query = \Drupal::entityQuery('node')
        ->condition('type', 'citas')
        ->condition('field_date', array($startOfWeek, $endOfWeek), 'BETWEEN')
        ->sort('field_date', 'ASC')
        ->sort('field_time', 'ASC')
        ->accessCheck(FALSE);
    $nids = $query->execute();

    // Carga las citas
    $citas_nodes = \Drupal\node\Entity\Node::loadMultiple($nids);

    // Aquí deberías preparar tus datos para enviarlos a Twig.
    // Por ejemplo, podrías construir un array multidimensional que tenga fechas como claves y citas como valores.

    $citas = [];
    foreach ($citas_nodes as $node) {
        $date = $node->get('field_date')->value;
        $citas[$date][] = [
            'title' => $node->label(),
            'time' => $node->get('field_time')->value,
            'comment' => $node->get('field_comment')->value,
            'modalidad' => $node->get('field_modalidad')->value,
        ];
    }

    $build = [
      '#theme' => 'gestion_reservas', // deberías definir una nueva plantilla twig llamada "gestion_reservas"
      '#title' => $this->t('Reservas'),
      '#citas' => $citas,
      '#attached' => [
        'library' => [
          'segura_viudas_citas/admin_reservas',
        ],
      ],
    ];

    return $build;
}
  /**
   * Responds to route: admin/citas/{date}.
   *
   * @param string $date
   *   The date in Y-m-d format.
   *
   * @return JsonResponse
   *   The JSON response.
   */
  public function getCitas($date) {
    $date_start = DrupalDateTime::createFromFormat('Y-m-d', $date);
    $date_end = (clone $date_start)->add(new \DateInterval('P8D'))->sub(new \DateInterval('PT1S'));


    $query = \Drupal::entityQuery('node')
    ->condition('type', 'citas')
    ->condition('field_date', [$date_start->format('Y-m-d'), $date_end->format('Y-m-d')], 'BETWEEN')
    ->sort('field_date', 'ASC')
    ->sort('field_time', 'ASC')
    ->accessCheck(FALSE);

    $nids = $query->execute();
    $citas_nodes = \Drupal\node\Entity\Node::loadMultiple($nids);

    $citas = [];
    foreach ($citas_nodes as $node) {
      $date = $node->get('field_date')->date->format('Y-m-d');
      $citas[$date][] = [
        'title' => $node->label(),
        'time' => $node->get('field_time')->value,
        'comment' => $node->get('field_comment')->value,
        'modalidad' => $node->get('field_modalidad')->value,
        'verificado1' => $node->get('field_verify_file')->value,
        'verificado2' => $node->get('field_verify_file2')->value,
        'nid' => $node->id(),
      ];
    }

    return new JsonResponse($citas);
  }
}
