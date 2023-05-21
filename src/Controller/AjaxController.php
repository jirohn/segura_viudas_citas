<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * CustomAjaxController.
 */
class AjaxController extends ControllerBase {

  protected $entityTypeManager;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  // creamos una funcion ajax para validar los documentos tipo 'field_file'
  /**
   * Callback for the 'segura_viudas_citas/admin_validate' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function validateDocument(Request $request) {
    // esta funcion le cambia el campo 'field_verify_file' a 'validado' cuando se envia el valor 1 en el data del ajax
    $nid = $request->query->get('nid');
    $option = $request->query->get('option');

    $document = $this->entityTypeManager->getStorage('node')->load($data['nid']);
    $document->set('field_verify_file', 1);
    $document->save();
    return new JsonResponse(['status' => 'ok']);


}
}
