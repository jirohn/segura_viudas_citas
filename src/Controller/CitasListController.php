<?php

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\Core\Url;

class CitasListController extends ControllerBase {

  // creamos un codigo ajax que nos devuelve las citas que hay en cada dia y las enviaremos a la vista
  /**
   * Callback for the 'segura_viudas_citas/admin_check_apointments' route.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the times of existing appointments.
   */
  public function adminCheckAppointments(Request $request) {
    $date = $request->query->get('date');

    // Log the received date
    \Drupal::logger('segura_viudas_citas')->notice('Received date: @date', ['@date' => $date]);

    $existing_times = []; // Inicializa la variable $existing_times como un array vacío

    try {
            // Realiza la consulta para obtener los nodos del tipo de contenido 'citas' con el 'field_date' seleccionado
            $query = \Drupal::entityQuery('node')
            ->condition('type', 'citas')
            ->condition('field_date', $date)
            ->accessCheck(FALSE);

          $nids = $query->execute();

          if (!empty($nids)) {
            $nodes = Node::loadMultiple($nids);
            foreach ($nodes as $node) {
              $existing_times[] = $node->get('field_time')->value;
            }
          }
        } catch (\Exception $e) {
          \Drupal::logger('segura_viudas_citas')->error('Error: @message', ['@message' => $e->getMessage()]);
        }

        // Log the existing times
        \Drupal::logger('segura_viudas_citas')->notice('Existing times: @times', ['@times' => implode(', ', $existing_times)]);

        return new JsonResponse($existing_times);
      }

  public function content() {
    // Obtén todas las citas.
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'citas')
      ->sort('created', 'DESC')
      ->accessCheck(FALSE); // Añade esta línea para deshabilitar la verificación de acceso.
    $nids = $query->execute();

    // Carga las citas.
    $citas_nodes = \Drupal\node\Entity\Node::loadMultiple($nids);

    // Crea una tabla para mostrar las citas.
    $header = [
      'title' => $this->t('Título'),
      'field_date' => $this->t('Fecha'),
      'field_time' => $this->t('Hora'),
      'field_comment' => $this->t('Comentario'),
    ];

    $rows = [];
    foreach ($citas_nodes as $node) {
      $row = [
        'title' => Link::fromTextAndUrl($node->label(), $node->toUrl()),
        'field_date' => $node->get('field_date')->value,
        'field_time' => $node->get('field_time')->value,
        'field_comment' => $node->get('field_comment')->value,
      ];
      $rows[] = $row;
    }

    $build = [
      '#theme' => 'gestion_citas',
      '#title' => $this->t('Gestión de citas'),
      '#header' => $header,
      '#rows' => $rows,
    ];


    return $build;
  }

}
