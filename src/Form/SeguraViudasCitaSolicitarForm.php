<?php

namespace Drupal\segura_viudas_citas\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

class SeguraViudasCitaSolicitarForm extends FormBase {

  public function getFormId() {
    return 'segura_viudas_cita_solicitar_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    // No es necesario obtener los campos del nodo citas aquí, ya que no se utilizarán en el formulario.
    // $node = \Drupal::routeMatch()->getParameter('node');


    $form['title'] = [
      '#type' => 'hidden',
      '#value' => 'juan palomo',
    ];
    
    // Agregamos los campos de fecha, hora y lugar al formulario.
    $form['field_date'] = [
      '#type' => 'date',
      '#title' => $this->t('Fecha'),
      '#required' => TRUE,
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
      '#required' => TRUE,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Solicitar cita'),
    ];

    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $node = Node::create([
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
