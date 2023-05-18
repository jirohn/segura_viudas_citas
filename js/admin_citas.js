(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
      // Configura el valor predeterminado del datepicker en la fecha actual
      var today = new Date();
      var formattedDate = today.toISOString().substr(0, 10);
      $('#date-picker', context).val(formattedDate).change();

      $('#date-picker', context).on('change', function () {
        var selectedDate = $(this).val();
        console.log('AdminCitas fecha seleccionada: ', selectedDate);

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

        // Lista de horarios en el campo field_time (reemplazar con tus horarios reales)
        var timeSlots = [
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
        ];

        timeSlots.forEach(function (timeSlot) {
          var citaForTimeSlot = citas.find(function (cita) {
            return cita.field_time === timeSlot;
          });

          var $row = $('<tr></tr>');

          if (citaForTimeSlot) {
            $row.addClass('appointment');
            $row.css('cursor', 'pointer');
            $row.on('click', function () {
              window.location.href = Drupal.url('node/' + citaForTimeSlot.nid);
            });
            $row.append($('<td></td>').text(citaForTimeSlot.field_time));
            $row.append($('<td></td>').text(citaForTimeSlot.title));
            $row.append($('<td></td>').text(citaForTimeSlot.field_modalidad));
            $row.append($('<td></td>').text(citaForTimeSlot.field_comment));
            
            // Agrega un botón de eliminar en la columna Acciones
            var $deleteButton = $('<button class="action-link action-link--danger action-link--icon-trash"></button>').text('Eliminar');
            $deleteButton.on('click', function (event) {
              event.stopPropagation(); // Evita que el evento click se propague a la fila
              deleteAppointment(citaForTimeSlot.nid);
            });
            $row.append($('<td></td>').append($deleteButton));

          } else {
            $row.addClass('empty');
            $row.append($('<td></td>').text(timeSlot));
            $row.append($('<td colspan="3"></td>').text(''));
            $row.append($('<td></td>')); // Añade una celda vacía en la columna Acciones
          }

          $tableBody.append($row);
        });
      }

      // Función para eliminar una cita usando su NID
      function deleteAppointment(nid) {
        if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
          $.ajax({
            url: Drupal.url('node/' + nid),
            type: 'DELETE',
            success: function () {
              // Actualiza la tabla de citas después de eliminar la cita
              $('#date-picker').trigger('change');
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error deleting appointment:', textStatus, errorThrown);
            },
          });
        }
      }
    },
  };
})(jQuery, Drupal);
