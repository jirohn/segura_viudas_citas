<?php

namespace Drupal\segura_viudas_citas\Form;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\Core\Datetime\DrupalDateTime; // Añade esta línea para importar la clase DrupalDateTime
use Symfony\Component\DependencyInjection\ContainerInterface;

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
    // Creamos un nuevo nodo de tipo "citas" para obtener el formulario.
    //$form['#attached']['library'][] = 'segura_viudas_citas/segura_viudas_citas';
    // creamos una array con todas horas disponibles

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
    
    /*$current_username = $this->currentUser->getDisplayName();*/

    $node = Node::create([
      'type' => 'citas', 
      'title' => $this->currentUser->getDisplayName(),
    ]);
    $node->save();
    $form_display = \Drupal::service('entity_display.repository')->getFormDisplay('node', 'citas');
    $form_display->buildForm($node, $form, $form_state);

    // le ponemos el nombre completo del usuario al campo de title.

    // Obtén la fecha actual en el formato correcto
    $current_date = DrupalDateTime::createFromTimestamp(time())->format('Y-m-d');
    
    $form['field_file'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
    ];
    $form['field_file2'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
    ];
    $form['field_file3'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
    ];
    $form['field_file4'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
    ];
    $form['field_file5'] = [
      '#type' => 'file',
      '#title' => $this->t('Subir archivo'),
      '#upload_location' => 'public://documentacion/', 
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx jpg'], 
      ],
    ];
    
    $form['field_date'] = [
      '#type' => 'date',
      '#title' => $this->t('Fecha'),
      '#default_value' => $current_date, 
      '#required' => TRUE,
    ];
    $form['field_time'] = [
      '#type' => 'select',
      '#title' => $this->t('Hora'),
      '#options' => $Horas,
      '#required' => TRUE,
    ];
    $form['field_comment'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Comentario'),
      '#required' => TRUE,
    ];
    // Añade el botón de envío al formulario.
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Pedir cita'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Guarda el nodo cuando el formulario se envía.
    $node = $form_state->getFormObject()->getEntity();
    
    $node->save();

    drupal_set_message($this->t('La cita ha sido guardada.'));
  }
}
