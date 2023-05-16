<?php
use Symfony\Component\HttpFoundation\Response;

/**
 * Render the citas form without Drupal's decorations.
 *
 * @return \Symfony\Component\HttpFoundation\Response
 */
public function formPage() {
  $form = \Drupal::formBuilder()->getForm('\Drupal\segura_viudas_citas\Form\CitasForm');

  // Render the form.
  $rendered_form = \Drupal::service('renderer')->renderRoot($form);

  // Build the HTML response.
  $response = new Response();
  $response->setContent('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Citas Form</title></head><body>' . $rendered_form . '</body></html>');
  return $response;
}
