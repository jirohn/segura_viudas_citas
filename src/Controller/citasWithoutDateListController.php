<?php

// creamos un controlador que envie a la plantilla 'citaslistwithoutdate' la lista del tipo de contenido 'citas' sin el campo 'field_date'
// para ello creamos un controlador que extienda de ControllerBase
namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\Core\Url;
use Drupal\Core\Datetime\DrupalDateTime;

class citasWithoutDateListController extends ControllerBase {

    public function content

}


