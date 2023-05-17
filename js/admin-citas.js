(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
      console.log('seguraViudasCitas behavior attached');
      // Escucha cambios en el input de tipo "date".
      $('#date-picker', context).on('change', function () {
        var selectedDate = $(this).val();

        // Realiza una solicitud AJAX para obtener las citas del día seleccionado.
        $.ajax({
          url: '/segura_viudas_citas/admin_check_appointments',
          data: { date: selectedDate },
          dataType: 'json',
          success: function (citas) {
            updateCitasTable(citas);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching appointments:', textStatus, errorThrown);
          },
        });
      });

      // Función para actualizar la tabla de citas con las citas del día seleccionado.
      function updateCitasTable(citas) {
        var $tableBody = $('#citas-container table tbody');
        $tableBody.empty();

        citas.forEach(function (cita) {
          var $row = $('<tr></tr>');
          $row.append($('<td></td>').text(cita.title));
          $row.append($('<td></td>').text(cita.field_date));
          $row.append($('<td></td>').text(cita.field_time));
          $row.append($('<td></td>').text(cita.field_comment));
          $tableBody.append($row);
        });
      }
    },
  };
})(jQuery, Drupal);
