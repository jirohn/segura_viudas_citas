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

      $files_info = [];
      for ($i = 1; $i <= 5; $i++) {
        $file_field = 'field_file' . ($i === 1 ? '' : $i);
        $verify_field = 'field_verify_file' . ($i === 1 ? '' : $i);

        $file_field_values = $node->get($file_field)->getValue();

        foreach ($file_field_values as $file_field_value) {
          $file = \Drupal\file\Entity\File::load($file_field_value['target_id']);
          if ($file) {
            $files_info[$file_field][] = [
              'filename' => $file->getFilename(),
              'status' => $node->get($verify_field)->value === 'validado' ? 'Validado'
                        : ($node->get($verify_field)->value === 'rechazado' ? 'Rechazado' : NULL),
            ];
          }
        }
      }

      // Agrega la información de la cita a la variable de renderizado del formulario.
      $form['#cita_info'] = [
        'name' => $node->getTitle(),
        'date' => $node->get('field_date')->value,
        'time' => $node->get('field_time')->value,
        'type' => $node->get('field_modalidad')->value,
        'comment' => $node->get('field_comment')->value,
        'edit_link' => \Drupal\Core\Url::fromRoute('entity.node.edit_form', ['node' => $nid])->toString(),
        'files_info' => $files_info, // Agrega la información de los archivos aquí.
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
      '#title' => $this->t('CARTA ACREDITATIVA RAÏM DO CAVA*'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg xlsx'],
        'file_validate_size' => [10 * 1024 * 1024],
        // ponemos un maximo de 5 archivos
        'max_filesize' => '5',
      ],
      '#description' => '<span class="nofileuploades">' . $this->t('Adjunta o arrastra el archivo') . '</span>' . $this->t('Puedes subir más de un archivo.') . '<br>' . $this->t('Peso máximo archivos 1 MB.') . '<br>',
      '#multiple' => 'true',
      '#required' => TRUE,

    ];
    // llamamos a los campos 'field_file2' del formulario
    $form['field_file2'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('QUADERN DE CAMP*'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg xlsx'],
        'file_validate_size' => [10 * 1024 * 1024],
      ],
      '#description' => '<span class="nofileuploades">' . $this->t('Adjunta o arrastra el archivo') . '</span>' . $this->t('Puedes subir más de un archivo.') . '<br>' . $this->t('Peso máximo archivos 1 MB.') . '<br>',
      '#multiple' => 'true',
      '#required' => TRUE,

    ];
    // llamamos a los campos 'field_file3' del formulario
    $form['field_file3'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('CERTIFICAT CCPAE'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg xlsx'],
        'file_validate_size' => [10 * 1024 * 1024],
      ],
      '#description' => '<span class="nofileuploades">' . $this->t('Adjunta o arrastra el archivo') . '</span>' . $this->t('Puedes subir más de un archivo.') . '<br>' . $this->t('Peso máximo archivos 1 MB.') . '<br>',
      '#multiple' => 'true',
      '#required' => FALSE,

    ];
    // llamamos a los campos 'field_file4' del formulario
    $form['field_file4'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('RVC'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg xlsx'],
        'file_validate_size' => [10 * 1024 * 1024],
      ],
      '#description' => '<span class="nofileuploades">' . $this->t('Adjunta o arrastra el archivo') . '</span>' . $this->t('Puedes subir más de un archivo.') . '<br>' . $this->t('Peso máximo archivos 1 MB.') . '<br>',
      '#multiple' => 'true',
      '#required' => FALSE,

    ];
    // llamamos a los campos 'field_file5' del formulario
    $form['field_file5'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('ALTRES DOCUMENTS'),
      '#upload_location' => 'public://',
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf jpg jpeg xlsx'],
        'file_validate_size' => [10 * 1024 * 1024],
        // ponemos un maximo de 5 archivos
        'max_filesize' => '5',
      ],
      '#description' => '<span class="nofileuploades">' . $this->t('Adjunta o arrastra el archivo') . '</span>' . $this->t('Puedes subir más de un archivo.') . '<br>' . $this->t('Peso máximo archivos 1 MB.') . '<br>',
      '#multiple' => 'true',
      '#required' => FALSE,

    ];


    $form['field_modalidad'] = [
      '#type' => 'radios',
      '#title' => $this->t('Modalidad'),
      '#options' => array(
        0 => $this->t('Presencial'),
        1 => $this->t('Telefónica'),
      ),
      '#required' => TRUE,
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
        '09:00' => '09:00 ~ 09:30',
        '09:30' => '09:30 ~ 10:00',
        '10:00' => '10:00 ~ 10:30',
        '10:30' => '10:30 ~ 11:00',
        '11:00' => '11:00 ~ 11:30',
        '11:30' => '11:30 ~ 12:00',
        '12:00' => '12:00 ~ 12:30',
        '12:30' => '12:30 ~ 13:00',
        '13:00' => '13:00 ~ 13:30',
        '13:30' => '13:30 ~ 14:00',
        '14:00' => '14:00 ~ 14:30',
        '14:30' => '14:30 ~ 15:00',
        '15:00' => '15:00 ~ 15:30',
        '15:30' => '15:30 ~ 16:00',
        '16:00' => '16:00 ~ 16:30',
        '16:30' => '16:30 ~ 17:00',
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

    $form['submit'] = [
      '#type' => 'submit',
      /* Añadimos un value con un <em> y un texto */
      '#value' => $this->t('Solicitar cita'),
      '#attributes' => array(
        'class' => array('icon-crest'),
      ),
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

    // comprobamos que no existe ninguna cita a la misma hora y el mismo dia
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'citas')
      ->condition('field_date', $form_state->getValue('field_date'))
      ->condition('field_time', $form_state->getValue('field_time'))
      ->accessCheck(FALSE);
    $nids = $query->execute();
    // si existe una cita a la misma hora y el mismo dia
    if (!empty($nids)) {
      // Utiliza la función 'messenger()' para mostrar mensajes en Drupal 10.
      $this->messenger()->addError($this->t('Ya existe una cita a la misma hora y el mismo dia.'));
      // Redirige a la misma pagina donde estamos
      echo '<script>alert("Ya han pedido cita a esa hora, elige otra hora");</script>';
      return;
    }
    $node->save();
    // Utiliza la función 'messenger()' para mostrar mensajes en Drupal 10.
    // enviamos por alert de jquery un mensaje que diga que la cita se ha solicitado correctamente
    echo '<script>alert("Cita solicitada correctamente");</script>';
    $this->messenger()->addStatus($this->t('Cita solicitada correctamente.'));

    // Redirige a la misma pagina donde estamos
    $form_state->setRedirect('<current>');
  }

}
