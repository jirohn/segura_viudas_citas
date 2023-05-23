<?php

//Este archivo crea el contenido de la pestana de administracion de citas principal
//de aquí puedes pasar a los otros dos apartados de la administración de citas.

namespace Drupal\segura_viudas_citas\Controller;

use Drupal\Core\Controller\ControllerBase;

class AdminPageController extends ControllerBase {

    public function content() {
        $build = [
          '#type' => 'markup',
          '#markup' => $this->t('
          <div class="layout-row clearfix">
          <div class="layout-column layout-column--half">
              <div class="panel gin-layer-wrapper">
                  <div class="panel__content">
                      <dl class="admin-list--panel admin-list gin-layer-wrapper">
                          <div class="admin-item">
                            <a href="/admin/gestion-citas/franjas-horarias" class="admin-item__link"></a>
                            <dt class="admin-item__title">Franjas horarias</dt>
                            <dd class="admin-item__description">Selecciona los horarios de disponibilidad en lo que los usuarios podrán reservar.</dt>
                          </div>
                      </dl>
                  </div>
              </div>
              </div>
              <div class="layout-column layout-column--half">
              <div class="panel gin-layer-wrapper">
                  <div class="panel__content">
                      <dl class="admin-list--panel admin-list gin-layer-wrapper">
                          <div class="admin-item">
                            <a href="/admin/gestion-citas/reservas" class="admin-item__link"></a>
                            <dt class="admin-item__title">Reservas</dt>
                            <dd class="admin-item__description">Revisa las reservas de citas y los detalles de las citas.</dt>
                          </div>
                      </dl>
                  </div>
              </div>
          </div>

          '),
        ];

        return $build;
      }

}
