<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;

class AdminPageFilesController extends ControllerBase {

  public function content() {
    // Obtén todas las citas.
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'citas')
      ->condition('field_date', NULL)
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



    $build = [
      '#theme' => 'citas_files',
      '#title' => $this->t('Gestión de archivos'),
      '#header' => $header,
      '#citas' => $citas_nodes,
      '#attached' => [
        'library' => [
          'segura_viudas_citas/admin_files',
        ],
      ],
    ];

    return $build;
  }
}
