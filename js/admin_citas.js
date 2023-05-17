(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
      console.log('AdminCitas behavior attached');
      // Escucha cambios en el input de tipo "date".
      $('#date-picker', context).on('change', function () {
        var selectedDate = $(this).val();
        console.log('AdminCitas fecha seleccionada: ', selectedDate );
        // Realiza una solicitud AJAX para obtener las citas del día seleccionado.
        $.ajax({
          url: Drupal.url('/segura_viudas_citas/admin/check_apointments'),
          data: { date: selectedDate },
          dataType: 'json',
          success: function (citas) {
            updateCitasTable(citas);
            console.log('obtenemos array de citas de este dia ', citas);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching appointments:', textStatus, errorThrown);
          },
        });
      });

      // Función para actualizar la tabla de citas con las citas del día seleccionado.
      function updateCitasTable(citas) {
        var $tableBody = $('.gestion-citas-wrapper table tbody');
        $tableBody.empty();

        citas.forEach(function (cita) {
          var $row = $('<tr></tr>');
          $row.append($('<td></td>').text(cita.field_time));
          $row.append($('<td></td>').text(cita.title));
          $row.append($('<td></td>').text(cita.field_date));
          $row.append($('<td></td>').text(cita.field_comment));
          $tableBody.append($row);
        });
      }
    },
  };
})(jQuery, Drupal);
