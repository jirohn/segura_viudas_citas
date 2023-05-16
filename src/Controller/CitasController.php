<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;

class CitasController extends ControllerBase {

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

    // Check if there are existing appointments with the given date.
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'citas')
      ->condition('field_date', $date);

    $nids = $query->execute();
    $existing_times = [];

    if (!empty($nids)) {
      $nodes = Node::loadMultiple($nids);
      foreach ($nodes as $node) {
        $existing_times[] = $node->get('field_time')->value;
      }
    }

    return new JsonResponse($existing_times);
  }
}
