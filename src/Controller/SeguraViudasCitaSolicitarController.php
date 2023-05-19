<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Form\FormBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class SeguraViudasCitaSolicitarController extends ControllerBase {

  protected $formBuilder;

  public function __construct(FormBuilderInterface $form_builder) {
    $this->formBuilder = $form_builder;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('form_builder')
    );
  }

  public function content() {
    $form = $this->formBuilder->getForm('Drupal\segura_viudas_citas\Form\SeguraViudasCitaSolicitarForm');
    // le asignamos el js segura_viudas_citas.js que esta declarado en el routing
    $form['#attached'] = array(
      'library' => array('segura_viudas_citas/segura_viudas_citas'),
      'drupalSettings' => array(),
    );
    return $form;
  }

}
