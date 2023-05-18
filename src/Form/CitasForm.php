<?php

namespace Drupal\segura_viudas_citas\Form;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\Core\Datetime\DrupalDateTime; // Añade esta línea para importar la clase DrupalDateTime
use Symfony\Component\DependencyInjection\ContainerInterface;
//llamamos a la clase de messenger para poder mostrar mensajes
use Drupal\Core\Messenger;
//llamamos a la clase file_save_upload para poder guardar el archivo
use Drupal\file\Entity\File;
use Drupal\file\FileInterface;
use Drupal\node\NodeInterface;


class CitasForm extends FormBase {

  protected $currentUser;

  public function __construct(AccountInterface $current_user) {
    $this->currentUser = $current_user;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_user')
    );
  }
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'citas_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#attached']['library'][] = 'segura_viudas_citas/segura_viudas_citas';
  
    // Obtén la fecha actual en el formato correcto
    $current_date = DrupalDateTime::createFromTimestamp(time())->format('Y-m-d');
    // Obtén el nombre del usuario actual y créalo como el título del nodo.
    $title = $this->currentUser->getDisplayName();

    \Drupal::logger('segura_viudas_citas')->notice('buildForm ha sido ejecutado.');

    $Horas = array (
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
    );
    

    $node = Node::create([
      'type' => 'citas', 
      'title' => $this->currentUser->getDisplayName(),
    ]);


    $form_display = \Drupal::service('entity_display.repository')->getFormDisplay('node', 'citas');
    $form_display->buildForm($node, $form, $form_state);




    // Obtén la fecha actual en el formato correcto
    $current_date = DrupalDateTime::createFromTimestamp(time())->format('Y-m-d');
    // Obtén el nombre del usuario actual y créalo como el título del nodo.
    $title = $this->currentUser->getDisplayName();

  // Agrega un campo de texto deshabilitado al formulario para mostrar el título.
    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Nombre'),
      '#default_value' => $title,
      '#required' => FALSE,

    ];
    $form['field_file'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
      '#required' => FALSE,

    ];
    $form['field_file2'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
      '#required' => FALSE,

    ];
    $form['field_file3'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
      '#required' => FALSE,

    ];
    $form['field_file4'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
      '#required' => FALSE,

    ];
    $form['field_file5'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
      '#required' => FALSE,

    ];
    
    $form['field_date'] = [
      '#type' => 'date',
      '#title' => $this->t('Fecha'),
      '#default_value' => $current_date, 
      '#required' => FALSE,
    ];
    $form['field_time'] = [
      '#type' => 'select',
      '#title' => $this->t('Hora'),
      '#options' => $Horas,
      '#required' => FALSE,
    ];
    $form['field_comment'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Comentario'),
      '#required' => FALSE,
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Pedir cita'),
      '#button_type' => 'primary',
      '#submit' => [[ $this, 'submitForm']], // no leas estas cosas... 
    ];
  
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    \Drupal::logger('segura_viudas_citas')->notice('submitForm ha sido ejecutado.');

    // Guarda el nodo cuando el formulario en la trituradora y lo tira a la basura //
    // llamamos getentity() para guardar el nodo en una variable
    $node = $form_state->getFormObject()->getEntity();
    // Guarda el valor del campo de texto en el título del nodo.

    

    $fields = ['field_file', 'field_file2', 'field_file3', 'field_file4', 'field_file5'];
    foreach ($fields as $field) {
      $file = $form_state->getValue($field);
      if (!empty($file[0])) {
        $file = File::load($file[0]);
        if ($file instanceof FileInterface) {
          $file->setPermanent();
          $file->save();
          $node->set($field, $file->id());
        }
      }
    }
  
    $node->save();
  
    // Muestra el mensaje de confirmación.
    \Drupal::messenger()->addMessage($this->t('La cita ha sido guardada.'));
  }

  
}