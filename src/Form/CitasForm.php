<?php

namespace Drupal\segura_viudas_citas\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Datetime\DrupalDateTime;


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
    $form['date'] = [
      '#type' => 'datetime',
      '#title' => $this->t('Fecha y hora'),
      '#default_value' => new DrupalDateTime(),
      '#date_date_element' => 'date',
      '#date_time_element' => 'time',
      '#required' => TRUE,
    ];

    $form['comment'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Comentario'),
      '#description' => $this->t('Escriba un comentario acerca de la cita.'),
      '#required' => FALSE,
    ];

    $form['actions'] = [
      '#type' => 'actions',
    ];

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
