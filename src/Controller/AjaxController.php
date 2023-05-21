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
   * Callback for the 'segura_viudas_citas/validate_appointment' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function validateAppointment(Request $request) {
    // esta funcion le cambia el campo 'field_verify_file' a 'validado' cuando se envia el valor 1 en el data del ajax
    $nid = $request->query->get('cita_id');
    $field = $request->query->get('file_field_name');
    // le añadimos al tipo de contenido 'citas' con la id almacenada en $nid el valor guardado en $option en el campo 'field_verify_file'
    $node = $this->entityTypeManager->getStorage('node')->load($nid);
    // le decimos que si el valor $option es 1, que le ponga el valor 'validado' al campo 'field_verify_file'
    $node->set($field, 'validado');
    $node->save();
    return new JsonResponse(['status' => 'ok']);


}
  // creamos una funcion ajax para validar los documentos tipo 'field_file'
  /**
   * Callback for the 'segura_viudas_citas/reject_appointment' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function rejectAppointment(Request $request) {
    // esta funcion le cambia el campo 'field_verify_file' a 'validado' cuando se envia el valor 1 en el data del ajax
    $nid = $request->query->get('cita_id');
    $field = $request->query->get('file_field_name');
    // le añadimos al tipo de contenido 'citas' con la id almacenada en $nid el valor guardado en $option en el campo 'field_verify_file'
    $node = $this->entityTypeManager->getStorage('node')->load($nid);
    // le decimos que si el valor $option es 1, que le ponga el valor 'validado' al campo 'field_verify_file'
    $node->set($field, 'rechazado');
    $node->save();
    return new JsonResponse(['status' => 'ok']);


}
}
