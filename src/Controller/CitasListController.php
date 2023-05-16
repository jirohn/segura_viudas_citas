<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;

class CitasListController extends ControllerBase {

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
      'fied_date' => $this->t('Fecha y hora'),
      'field_comment' => $this->t('Comentario'),
    ];

    $rows = [];
    foreach ($citas_nodes as $node) {
      $row = [
        'title' => Link::fromTextAndUrl($node->label(), $node->toUrl()),
        'field_date' => $node->get('field_date')->value,
        'field_comment' => $node->get('field_comment')->value,
      ];
      $rows[] = $row;
    }

    $table = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => $this->t('No hay citas disponibles.'),
    ];

    return $table;
  }

}
