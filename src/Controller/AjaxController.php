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

  /**
   * Validate document
   */
  public function validateDocument(Request $request) {

    preg_match('|/([0-9]+)/(field_file[0-9]?)/([01])$|', $request->getUri(), $data);
    $cita_id = $data[1];
    $file_field_name = $data[2];
    $validate = $data[3];

    $cita = $this->entityTypeManager->getStorage('node')->load($cita_id);

    $fields = [
      'field_file' => 'field_verify_file',
      'field_file2' => 'field_verify_file2',
      'field_file3' => 'field_verify_file3',
      'field_file4' => 'field_verify_file4',
      'field_file5' => 'field_verify_file5',
    ];

    $cita->set($fields[$file_field_name], $validate);
    $cita->save();

    $response = [
      'ok' => true,
    ];

    return new JsonResponse($response);
  }

}
