<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;

class AdminPageFilesController extends ControllerBase {

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

    $existing_citas = []; // Inicializa la variable $existing_citas como un array vacío.

    $query = \Drupal::entityQuery('node')
    ->condition('type', 'citas')
    ->accessCheck(FALSE);

    $nids = $query->execute();

    if (!empty($nids)) {
      $nodes = Node::loadMultiple($nids);
      foreach ($nodes as $node) {
        $existing_citas[] = [
          'title' => $node->label(),
          'field_comment' => $node->get('field_comment')->value,
        ];
      }
    }

    return new JsonResponse($existing_citas);
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
      'field_comment' => $this->t('Comentario'),
    ];

    $rows = [];
    foreach ($citas_nodes as $node) {
      $row = [
        'title' => $node->label(),
        'field_comment' => $node->get('field_comment')->value,
      ];
      $rows[] = $row;
    }

    $build = [
      '#theme' => 'citas_files',
      '#title' => $this->t('Gestión de archivos'),
      '#header' => $header,
      '#rows' => $rows,
      '#attached' => [
        'library' => [
          'segura_viudas_citas/admin_files',
        ],
      ],
    ];

    return $build;
  }
}
