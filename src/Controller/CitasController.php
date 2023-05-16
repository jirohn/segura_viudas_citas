<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

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
    ];

    return $build;
  }

}
