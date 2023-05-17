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

    $node = Node::create(['type' => 'citas']);
    $form_display = \Drupal::service('entity_display.repository')->getFormDisplay('node', 'citas');
    $form_display->buildForm($node, $form, $form_state);

    // Obtén la fecha actual en el formato correcto
    $current_date = DrupalDateTime::createFromTimestamp(time())->format('Y-m-d');

    $form['field_date'] = [
      '#type' => 'date',
      '#title' => $this->t('Date'),
      '#default_value' => $current_date, // Establece la fecha actual como valor predeterminado
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