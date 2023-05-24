<?php

namespace Drupal\segura_viudas_citas\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\Core\Datetime\DrupalDateTime; // Añade esta línea para importar la clase DrupalDateTime
// usamos libreria de drupal para coger nombre de usuario actual
use Drupal\Core\Session\AccountInterface;
class SeguraViudasCitaSolicitarForm extends FormBase {

  public function getFormId() {
    return 'segura_viudas_cita_solicitar_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    // Obten el usuario actual.
    $current_user = \Drupal::currentUser();

    // Comprueba si el usuario tiene una cita.
    $query = \Drupal::entityQuery('node')
    ->condition('type', 'citas')
    ->condition('uid', $current_user->id())
    ->accessCheck(FALSE); // Añade esta línea

    $nids = $query->execute();

    if (!empty($nids)) {
      // El usuario ya tiene una cita. Guarda la información de la cita.

      $nid = reset($nids); // Obtén el primer NID de la lista.
      $node = \Drupal\node\Entity\Node::load($nid); // Carga la cita.

      // Agrega la información de la cita a la variable de renderizado del formulario.
      $form['#cita_info'] = [
        'date' => $node->get('field_date')->value, // Asegúrate de cambiar 'field_date' por el campo correcto en tu tipo de contenido.
        'edit_link' => \Drupal\Core\Url::fromRoute('entity.node.edit_form', ['node' => $nid])->toString(),
      ];
    }
     // guardamos la fecha en una variable
    $current_date = DrupalDateTime::createFromTimestamp(time())->format('Y-m-d');
    // guardamos el nombre del usuario actual en una variable con accountinterface
    $title = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id())->getDisplayName();
    $form['title'] = [
      '#type' => 'hidden',
      '#value' => $title,
    ];

    for ($i = 0; $i < 5; $i++) {
      $form['field_verify_file' . $i] = [
        '#type' => 'hidden',
        '#value' => FALSE,
      ];
    }

    // llamamos a los campos 'field_file' del formulario
    $form['field_file'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg'],
      ],
      '#multiple' => 'true',
      '#required' => TRUE,

    ];
    // llamamos a los campos 'field_file2' del formulario
    $form['field_file2'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg'],
      ],
      '#required' => TRUE,
    ];
    // llamamos a los campos 'field_file3' del formulario
    $form['field_file3'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg'],
      ],
      '#required' => FALSE,
    ];
    // llamamos a los campos 'field_file4' del formulario
    $form['field_file4'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg'],
      ],
      '#required' => FALSE,
    ];
    // llamamos a los campos 'field_file5' del formulario
    $form['field_file5'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg'],
      ],
      '#multiple' => 'true',
      '#required' => FALSE,
    ];




    // Agregamos los campos de fecha, hora y lugar al formulario.
    $form['field_date'] = [
      '#type' => 'date',
      '#title' => $this->t('Fecha'),
      '#required' => TRUE,
      '#value' => $current_date,
    ];

    $form['field_time'] = [
      '#type' => 'select',
      '#title' => $this->t('Hora'),
      //añadimos los valores del array $Horas
      '#options' => array(
        '09:00' => '09:00',
        '09:30' => '09:30',
        '10:00' => '10:00',
        '10:30' => '10:30',
        '11:00' => '11:00',
        '11:30' => '11:30',
        '12:00' => '12:00',
        '12:30' => '12:30',
        '13:00' => '13:00',
        '13:30' => '13:30',
        '14:00' => '14:00',
        '14:30' => '14:30',
        '15:00' => '15:00',
        '15:30' => '15:30',
        '16:00' => '16:00',
        '16:30' => '16:30',
        '17:00' => '17:00',
        // ... añade más opciones aquí ...
      ),


      '#required' => TRUE,
    ];

    $form['field_comment'] = [
      '#type' => 'textarea',
      '#title' => $this->t('comment'),
      '#required' => FALSE,
      '#wysiwyg' => false,
    ];
    $form['field_modalidad'] = [
      '#type' => 'select',
      '#title' => $this->t('Modalidad'),
      '#options' => array(
        'Presencial' => 'Presencial',
        'Online' => 'Online',
      ),
      '#required' => TRUE,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Solicitar cita'),
    ];
    // creamos una variable para retornar en el $form la plantilla twig y la- libreria js 'segura_viudas_citas'
    $form['#attached']['library'] = 'segura_viudas_citas/segura_viudas_citas';
    $form['#theme'] = 'segura_viudas_citas';
    // enviamos el valor #attached library a un string para enviar el valor al debug
    return $form;

  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $node = Node::create([
      // guarda los valores de nuevos campos 'field_file' y los 'field_verify_file' los campos en la base de datos
      'field_file' => $form_state->getValue('field_file'),
      'field_verify_file' => $form_state->getValue('field_verify_file'),
      'field_file2' => $form_state->getValue('field_file2'),
      'field_verify_file2' => $form_state->getValue('field_verify_file2'),
      'field_file3' => $form_state->getValue('field_file3'),
      'field_verify_file3' => $form_state->getValue('field_verify_file3'),
      'field_file4' => $form_state->getValue('field_file4'),
      'field_verify_file4' => $form_state->getValue('field_verify_file4'),
      'field_file5' => $form_state->getValue('field_file5'),
      'field_verify_file5' => $form_state->getValue('field_verify_file5'),
      // guardamos modalidad
      'field_modalidad' => $form_state->getValue('field_modalidad'),

      'type' => 'citas',
      'title' => $form_state->getValue('title'),
      'field_date' => $form_state->getValue('field_date'),
      'field_time' => $form_state->getValue('field_time'),
      'field_comment' => $form_state->getValue('field_comment'),
    ]);
    $node->save();

    // Utiliza la función 'messenger()' para mostrar mensajes en Drupal 10.
    $this->messenger()->addStatus($this->t('Cita solicitada correctamente.'));

    // Redirige a la página de citas.
    $form_state->setRedirect('entity.node.canonical', ['node' => $node->id()]);
  }

}
