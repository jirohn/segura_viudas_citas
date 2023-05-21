<?php

namespace Drupal\segura_viudas_citas\Twig\Extension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class SeguraViudasCitasTwigExtension extends AbstractExtension {

  /**
   * {@inheritdoc}
   */
  public function getFunctions() {
    return [
      new TwigFunction('solicitar_cita_url', [$this, 'solicitar_cita_url']),
    ];
  }

  public function solicitar_cita_url() {

  	$languageId = \Drupal::getContainer()->get('language_manager')->getCurrentLanguage()->getId();

    return '/' . $languageId . '/proveedores/solicitar-cita';

  }

}
