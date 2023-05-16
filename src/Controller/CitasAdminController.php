<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\NodeInterface;

class CitasController extends ControllerBase {

  public function viewCitas(NodeInterface $node) {
    if ($node->getType() != 'citas') {
      throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
    }

    $build = [];
    $build['#theme'] = 'node';
    $build['#node'] = $node;
    $build['#view_mode'] = 'full';
    $build['#title'] = $node->getTitle();

    return $build;
  }
}
