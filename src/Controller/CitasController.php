<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Render\HtmlResponse;

/**
 * Class CitasController.
 */
class CitasController extends ControllerBase {

/**
 * Render the citas form without Drupal's decorations, but with theme CSS.
 *
 * @return \Symfony\Component\HttpFoundation\Response
 */
public function formPage() {
  $form = \Drupal::formBuilder()->getForm('\Drupal\segura_viudas_citas\Form\CitasForm');

  // Create a basic render array to include the form and the active theme's CSS.
  $build = [
    '#theme' => 'html',
    'page' => [
      'content' => [
        '#theme' => 'citas_form',
        '#form' => $form,
      ],
    ],
  ];

  // Render the build array.
  $rendered_page = \Drupal::service('renderer')->renderRoot($build);

  // Build the HTML response using HtmlResponse.
  $response = new HtmlResponse();
  $response->setContent($rendered_page);

  return $response;
}

}
