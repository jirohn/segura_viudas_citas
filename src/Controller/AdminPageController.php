<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;

class AdminPageController extends ControllerBase {

    public function content() {
        $build = [
          '#type' => 'markup',
          '#markup' => $this->t('Hola, esta es tu página personalizada.'),
          '#attached' => [
            'library' => [
              'segura_viudas_citas/custom_admin_page_styles',
            ],
          ],
        ];
      
        return $build;
      }      

}
