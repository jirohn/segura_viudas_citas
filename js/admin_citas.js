(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
      // le asignamos la vista del 'calendar_view' al datepicker




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
          '13:00',
          '13:30',
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
                // creamos el blockButton que sera un icono que al presionar sobre el y estar bloqueado se girara 90 grados


                // Agregamos el evento click al boton de bloquear

          var $row = $('<tr></tr>');
          // comprobamos si es una cita y no se llama bloqueada no le ponemos enlace
          if (citaForTimeSlot) {
            $row.addClass('appointment');
            $row.css('cursor', 'pointer');
            if(citaForTimeSlot.title != 'Bloqueado'){
              $row.on('click', function () {
                window.location.href = Drupal.url('node/' + citaForTimeSlot.nid);
              });
            }
            // comprobamos el titulo de la cita y si se llama bloqueado le agregamos la clase blocked
            if (citaForTimeSlot.title == 'Bloqueado') {
              var $blockButton = $('<button class="action-link action-link--danger action-link--icon-block"></button>').append($('<img src="" alt="lock icon" />'));
              // le añadimos al boton una imagen llamada 'lockicon.png' que se encuentra en la carpeta images del modulo cargando el path con Drupal.url
              $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
              // le quitamos los bordes al boton y le quitamos el color del fondo para que se vea solo la imagen y le damos un tamaño de 1.5em a la imagen
              $blockButton.css('border', 'none');
              $blockButton.css('background-color', 'transparent');
              $blockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');

              $row.addClass('blocked');
              // le ponemos un color rojo claro a la fila por estar bloqueado
              $row.css('background-color', '#ffcccc');
              // le añadimos el boton de desbloquear la fila y lo giramos 90 grados
              $blockButton.addClass('blocked');
              $blockButton.find('img').css('transform', 'rotate(-90deg)');
              $row.append($('<td></td>').text('Bloqueado'));
              $row.append($('<td></td>').text(''));
              $row.append($('<td></td>').text(''));
              $row.append($('<td></td>').text(''));
              $row.append($('<td></td>').append($deleteButton).append($blockButton));
              $blockButton.on('click', function (event) {
                event.stopPropagation(); // Evita que el evento click se propague a la fila
                //comprobamos si el boton de bloquear esta bloqueado
                if ($blockButton.hasClass('blocked')) {
                  // si esta bloqueado le quitamos la clase blocked
                  $blockButton.removeClass('blocked');
                  // buscamos la imagen del boton y le quitamos el giro de 90 grados
                  $blockButton.find('img').css('transform', 'rotate(0deg)');

                  // cambiamos a verde el color de la fila
                  $row.css('background-color', '#f5f8ff');
                  // color verde a la imagen del boton
                  $blockButton.find('img').css('fill', '#00cc00');
                  deleteAppointment(citaForTimeSlot.nid);


                } else {
                  // si no esta bloqueado le agregamos la clase blocked
                  $blockButton.addClass('blocked');
                  // y le agregamos el giro de 90 grados
                  $blockButton.find('img').css('transform', 'rotate(90deg)');
                  // le ponemos el color rojo a la fila
                  $row.css('background-color', '#ffcccc');
                  // le ponemos el color rojo a la imagen del boton
                  $blockButton.find('img').css('fill', '#ff0000');
                  blockAppointment(date, timeSlot);

                }

              });

              }else{
                $row.append($('<td></td>').text(citaForTimeSlot.field_time));
                $row.append($('<td></td>').text(citaForTimeSlot.title));
                $row.append($('<td></td>').text(citaForTimeSlot.field_modalidad));
                $row.append($('<td></td>').text(citaForTimeSlot.field_comment));

                // si no es una cita bloqueada le añadimos el boton de bloquear
                if (citaForTimeSlot.title != 'Bloqueado') {
                // Agrega un botón de eliminar en la columna Acciones con una imagen
                var $deleteButton = $('<button class="action-link action-link--danger action-link--icon-delete"></button>').append($('<img src="" alt="delete icon" />'));
                // le añadimos su imagen llamada 'deleteicon.svg' que se encuentra en la carpeta images del modulo cargando el path con Drupal.url
                $deleteButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/deleteicon.svg');
                // le quitamos los bordes al boton y le quitamos el color del fondo para que se vea solo la imagen y le damos un tamaño de 1.5em a la imagen
                $deleteButton.css('border', 'none');
                $deleteButton.css('background-color', 'transparent');
                $deleteButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
                // añadimos el boton a la collumna acciones
                $row.append($('<td></td>').append($deleteButton));
                $deleteButton.on('click', function (event) {
                  // alertamos de la eliminacion
                  if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
                    alert('Eliminación cancelada');
                  }else{
                    // eliminamos
                    deleteAppointment(citaForTimeSlot.nid);
                    // mostramos mensaje de espera
                    alert('Eliminando cita...');
                    // recargamos la pagina
                  }

;
                });
              }
            }




          } else {
            var $blockButton = $('<button class="action-link action-link--danger action-link--icon-block"></button>').append($('<img src="" alt="lock icon" />'));

            // le añadimos al boton una imagen llamada 'lockicon.png' que se encuentra en la carpeta images del modulo cargando el path con Drupal.url
            $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
            // le quitamos los bordes al boton y le quitamos el color del fondo para que se vea solo la imagen y le damos un tamaño de 1em a la imagen
            $blockButton.css('border', 'none');
            $blockButton.css('background-color', 'transparent');
            $blockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');



            $blockButton.on('click', function (event) {
              event.stopPropagation(); // Evita que el evento click se propague a la fila
              //comprobamos si el boton de bloquear esta bloqueado
              if ($blockButton.hasClass('blocked')) {
                // si esta bloqueado le quitamos la clase blocked
                $blockButton.removeClass('blocked');
                // buscamos la imagen del boton y le quitamos el giro de 90 grados
                $blockButton.find('img').css('transform', 'rotate(0deg)');

                // cambiamos a verde el color de la fila
                $row.css('background-color', '#f5f8ff');
                // color verde a la imagen del boton
                $blockButton.find('img').css('fill', '#00cc00');


              } else {
                // si no esta bloqueado le agregamos la clase blocked
                $blockButton.addClass('blocked');
                // y le agregamos el giro de 90 grados
                $blockButton.find('img').css('transform', 'rotate(-90deg)');
                // le ponemos el color rojo a la fila
                $row.css('background-color', '#ffcccc');
                // le ponemos el color rojo a la imagen del boton
                $blockButton.find('img').css('fill', '#ff0000');
                // llamamos a la funcion blockAppointment pasandole los datos de la fecha y el timeSlot actual
                // guardamos la fecha seleccionada en el 'date-picker' en la variable date
                var date = $('#date-picker').val();

                blockAppointment(date, timeSlot);

              }

            });
            $row.css('background-color', '#f5f8ff');

            $row.addClass('empty');
            $row.append($('<td></td>').text(timeSlot));
            $row.append($('<td colspan="3"></td>').text(''));
            // agregamos el boton de bloquear en la misma fila
            $row.append($('<td></td>').append($blockButton));

          }

          $tableBody.append($row);
        });
      }
      // funcion para crear una nueva cita tipo 'bloqueado'donde enviamos la fecha seleccionada y la hora basada en timeSlot
      function blockAppointment(date, timeSlot) {
        ;
        $.ajax({
          url: Drupal.url('/segura_viudas_citas/admin/block_appointment'),
          // enviamos el timeSlot y la fecha seleccionada
          data: { timeSlot: timeSlot, date: date },
          dataType: 'json',
          success: function (data) {
            console.log('Cita bloqueada: ', date, timeSlot, data);
            $('#date-picker').change();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error bloqueando cita:', textStatus, errorThrown);
          },
        });
      }
      // Función para eliminar una cita usando su NID y eliminamos la cita de la tabla
      function deleteAppointment(nid)
      {
        $.ajax({
          url: Drupal.url('/segura_viudas_citas/admin/delete_appointment'),
          data: { nid: nid },
          dataType: 'json',
          success: function (data) {
            console.log('Cita eliminada: ', data);
            $('#date-picker').change();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error eliminando cita:', textStatus, errorThrown);
          },
        });
      }

    },
  };
})(jQuery, Drupal);
