<?php

namespace Drupal\segura_viudas_citas\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\Core\Datetime\DrupalDateTime; // Añade esta línea para importar la clase DrupalDateTime

class CitasForm extends FormBase {

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

    $node = Node::create(['type' => 'citas']);
    $form_display = \Drupal::service('entity_display.repository')->getFormDisplay('node', 'citas');
    $form_display->buildForm($node, $form, $form_state);

    // le ponemos el nombre completo del usuario al campo de title.
    $user = \Drupal::currentUser();
    $user_name = $user->getDisplayName();
    $form['title']['widget'][0]['value']['#default_value'] = $user_name;

    // Obtén la fecha actual en el formato correcto
    $current_date = DrupalDateTime::createFromTimestamp(time())->format('Y-m-d');

    $form['field_date'] = [
      '#type' => 'date',
      '#title' => $this->t('Fecha'),
      '#default_value' => $current_date, // Establece la fecha actual como valor predeterminado
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

<<<<<<< HEAD
}
=======



}
>>>>>>> 4ab79eecadd2dcfbb7115ec36bc519d278a14afa
