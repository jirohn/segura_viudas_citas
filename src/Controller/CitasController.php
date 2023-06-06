<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\NodeType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;

class CitasController extends ControllerBase {

    /**
   * Página que muestra las citas.
   */

  /**
   * Render the citas form without Drupal's decorations.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function formPage() {
    $form = \Drupal::formBuilder()->getForm('\Drupal\segura_viudas_citas\Form\CitasForm');

    $build = [
      '#theme' => 'citas_form',
      '#form' => $form,
      '#attached' => [
        'library' => [
          'segura_viudas_citas/segura_viudas_citas',
        ],
      ],
    ];

    return $build;
  }
  /**
   * Callback for the 'segura_viudas_citas/check_appointments' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function checkAppointments(Request $request) {
    $date = $request->query->get('date');

    // Log the received date
    \Drupal::logger('segura_viudas_citas')->notice('Received date: @date', ['@date' => $date]);

    $existing_times = []; // Inicializa la variable $existing_times como un array vacío

    try {


      // Realiza la consulta para obtener los nodos del tipo de contenido 'citas' con el 'field_date' seleccionado
      $query = \Drupal::entityQuery('node')
        ->condition('type', 'citas')
        ->condition('field_date', $date)
        ->accessCheck(FALSE);

      $nids = $query->execute();

      if (!empty($nids)) {
        $nodes = Node::loadMultiple($nids);
        foreach ($nodes as $node) {
          // si el titulo del nodo es 'Ampliado' se crea un nuevo array, llamado $addedTimes, con los valores del campo 'field_time'
          if ($node->getTitle() == 'Ampliado' || $node->getTitle() == 'Bloqueado Ampliado') {
            $addedTimes[] = [
              'field_time' => $node->get('field_time')->getString(),
            ];
          }
          $existing_times[] = $node->get('field_time')->value;
        }
      }
    } catch (\Exception $e) {
      \Drupal::logger('segura_viudas_citas')->error('Error: @message', ['@message' => $e->getMessage()]);
    }

    // Log the existing times
    \Drupal::logger('segura_viudas_citas')->notice('Existing times: @times', ['@times' => implode(', ', $existing_times)]);

    // devolvemos $existing_times y $addedTimes en formato JSON
    return new JsonResponse([
      'existing_times' => $existing_times,
      'addedTimes' => $addedTimes,
    ]);
    }


}
