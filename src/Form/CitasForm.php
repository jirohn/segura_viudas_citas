<?php

namespace Drupal\segura_viudas_citas\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

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
    $form['#attached']['library'][] = 'core/drupal.date';
    $form['#attached']['library'][] = 'core/jquery.ui.datepicker';
    $node = Node::create(['type' => 'citas']);
    $form_display = \Drupal::service('entity_display.repository')->getFormDisplay('node', 'citas');
    $form_display->buildForm($node, $form, $form_state);

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
