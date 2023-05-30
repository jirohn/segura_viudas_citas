(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
      $(document).ready(function () {
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
            var $row = $('<tr></tr>');
            if (citaForTimeSlot) {
              $row.addClass('appointment');
              $row.css('cursor', 'pointer');
              if(citaForTimeSlot.title != 'Bloqueado'){
                $row.on('click', function () {
                  if (event.target.className == 'action-link action-link--danger action-link--icon-delete') {
                  window.location.href = Drupal.url('node/' + citaForTimeSlot.nid);
                  }

                });
              }
              if (citaForTimeSlot.title == 'Bloqueado') {
                var $blockButton = $('<button class="action-link action-link--danger action-link--icon-block"></button>').append($('<img src="" alt="lock icon" />'));
                $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
                $blockButton.css('border', 'none');
                $blockButton.css('background-color', 'transparent');
                $blockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');

                $row.addClass('blocked');
                $row.css('background-color', '#ffcccc');
                $blockButton.addClass('blocked');
                $blockButton.find('img').css('transform', 'rotate(-90deg)');
                var $checkbox = $('<input type="checkbox" id="blocked-appointment" class="blocked" />');
                $checkbox.attr('data-nid', citaForTimeSlot.nid);
                $row.append($('<td></td>').append($checkbox));
                $row.append($('<td></td>').text('Bloqueado'));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').append($deleteButton).append($blockButton));
                $blockButton.on('click', function (event) {
                  event.stopPropagation();
                  if ($blockButton.hasClass('blocked')) {
                    $blockButton.removeClass('blocked');
                    $blockButton.find('img').css('transform', 'rotate(0deg)');
                    $row.css('background-color', '#f5f8ff');
                    $blockButton.find('img').css('fill', '#00cc00');
                    deleteAppointment(citaForTimeSlot.nid);
                  } else {
                    $blockButton.addClass('blocked');
                    $blockButton.find('img').css('transform', 'rotate(90deg)');
                    $row.css('background-color', '#ffcccc');
                    $blockButton.find('img').css('fill', '#ff0000');
                    blockAppointment(date, timeSlot);

                  }

                });

                }else{
                  var $checkbox = $('<input type="checkbox" id="reserved-appointment" class="reserved" />');
                  $checkbox.attr('data-nid', citaForTimeSlot.nid);
                  $row.append($('<td></td>').append($checkbox));
                  $row.append($('<td></td>').text(citaForTimeSlot.field_time));
                  $row.append($('<td></td>').text(citaForTimeSlot.title));
                  $row.append($('<td></td>').text(citaForTimeSlot.field_modalidad));
                  if(citaForTimeSlot.field_comment != null){
                  comment_sanitized = citaForTimeSlot.field_comment.replace(/<[^>]+>/g, '');
                  $row.append($('<td></td>').text(comment_sanitized));
                  }else{
                    $row.append($('<td></td>').text(''));
                  }
                  if (citaForTimeSlot.title != 'Bloqueado') {
                  var $deleteButton = $('<button class="action-link action-link--danger action-link--icon-delete"></button>').append($('<img src="" alt="delete icon" />'));
                  $deleteButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/deleteicon.svg');
                  $deleteButton.css('border', 'none');
                  $deleteButton.css('background-color', 'transparent');
                  $deleteButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
                  $row.append($('<td></td>').append($deleteButton));
                  $deleteButton.on('click', function (event) {
                    if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
                      alert('Eliminación cancelada');
                    }else{
                      // eliminamos
                      deleteAppointment(citaForTimeSlot.nid);
                      alert('Eliminando cita...');
                      $('#date-picker').change();
                    };
                  });
                }
              }
            } else {
              var $blockButton = $('<button class="action-link action-link--danger action-link--icon-block"></button>').append($('<img src="" alt="lock icon" />'));
              $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
              $blockButton.css('border', 'none');
              $blockButton.css('background-color', 'transparent');
              $blockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
              $blockButton.on('click', function (event) {
                event.stopPropagation();
                if ($blockButton.hasClass('blocked')) {
                  $blockButton.removeClass('blocked');
                  $blockButton.find('img').css('transform', 'rotate(0deg)');
                  $row.css('background-color', '#f5f8ff');
                  $blockButton.find('img').css('fill', '#00cc00');
                } else {
                  $blockButton.addClass('blocked');
                  $blockButton.find('img').css('transform', 'rotate(-90deg)');
                  $row.css('background-color', '#ffcccc');
                  $blockButton.find('img').css('fill', '#ff0000');
                  var date = $('#date-picker').val();
                  blockAppointment(date, timeSlot);
                }
              });
              $row.css('background-color', '#f5f8ff');
              var $checkbox = $('<input type="checkbox" id="empty-appointment" class="reserved" />');
              $checkbox.attr('data-time', timeSlot);
              // guardamos la fecha seleccionada en el checkbox
              $checkbox.attr('data-date', $('#date-picker').val());
              $row.append($('<td></td>').append($checkbox));
              $row.append($('<td></td>').text(timeSlot));
              $row.append($('<td colspan="3"></td>').text(''));
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
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error eliminando cita:', textStatus, errorThrown);
            },
          });
        }
        function deleteAppointments(nid){
          $.ajax({
            url: Drupal.url('/segura_viudas_citas/admin/delete_appointment'),
            data: { nid: nid },
            dataType: 'json',
            success: function (data) {
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error eliminando cita:', textStatus, errorThrown);
            },
          });
        }
        function blockAppointments(date, timeSlot) {
          $.ajax({
            url: Drupal.url('/segura_viudas_citas/admin/block_appointment'),
            // enviamos el timeSlot y la fecha seleccionada
            data: { timeSlot: timeSlot.join(','), date: date},
            dataType: 'json',
            success: function (data) {
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error bloqueando cita:', textStatus, errorThrown);
            },
          });
        }
        // buscamos todos los checkbox que tengan la id 'citas' o la id 'select-all' y los guardamos en una variable

        $('input[type="checkbox"]').on('change', function () {
          // le decimos que si algun checkbox esta seleccionado y no existe 'action-buttons-container' en la pagina
          if ($('input[type="checkbox"]:checked').length > 0 && !$('#action-buttons-container').length) {

            // creamos un div llamado action buttons container
            var $actionButtonsContainer = $('<div id="action-buttons-container"></div>');
            // si hay alguno seleccionado, creamos los botones
            var $deleteButton = $('<button id="action-button" class="action-link action-link--danger action-link--icon-delete"></button>').append($('<img src="" alt="delete icon" />'));
            $deleteButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/deleteicon.svg');
            $deleteButton.css('border', 'none');
            $deleteButton.css('background-color', 'transparent');
            $deleteButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
            // añadimos el boton al lado del la id 'select-action'
            var $blockButton = $('<button id="action-button" class="action-link action-link--danger action-link--icon-block"></button>').append($('<img src="" alt="lock icon" />'));
            $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
            $blockButton.css('border', 'none');
            $blockButton.css('background-color', 'transparent');
            $blockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
            var $unblockButton = $('<button id="action-button" class="action-link action-link--danger action-link--icon-unblock"></button>').append($('<img src="" alt="unlock icon" />'));
            $unblockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/unlockicon.svg');
            $unblockButton.css('border', 'none');
            $unblockButton.css('background-color', 'transparent');
            $unblockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
            // añadimos todos los botones en el div action button container
            $actionButtonsContainer.append($deleteButton).append($blockButton).append($unblockButton);
            // añadimos el div action button container al lado del select
            $('#select-action').after($actionButtonsContainer);
            // cuando hacemos click en el boton de eliminar
            $deleteButton.on('click', function () {
              // imprimimos un mensaje de consola
              console.log('click en el boton de eliminar');
              // si no confirmamos la eliminación
              if (!confirm('¿Estás seguro de que quieres eliminar estas citas?')) {
                // cancelamos la eliminación
                alert('Eliminación cancelada');
              } else {
                // si no, buscamos el nid de cada cita seleccionada
                $('input[type="checkbox"]:checked').each(function () {
                  // si el checkbox tiene la id 'reserved-appointment'
                  if ($(this).attr('id') === 'reserved-appointment') {
                    // guardamos el nid en una variable
                    var nid = $(this).attr('data-nid');
                    // imprimimos el nid en consola
                    console.log('nid: ', nid);
                    // eliminamos
                    deleteAppointments(nid);

                  }else{
                    // imprime un mensaje de consola
                    console.log('no hay citas seleccionadas');
                  }
                });
                $('#date-picker').change();

              }
            });
            // cuando hacemos click en el boton de bloquear
            $blockButton.on('click', function () {
              // guardamos la fecha seleccionad en date-picker en la variable date
              var date = $('#date-picker').val();
              var time = [];
              // imprimimos un mensaje de consola
              console.log('click en el boton de bloquear');
              // imprimimos fecha y horas
              console.log('fecha: ', date);
              console.log('horas: ', time);
              // si no confirmamos la eliminación
              if (!confirm('¿Estás seguro de que quieres bloquear estas citas?')) {
                // cancelamos la eliminación
                alert('Bloqueo cancelado');
              } else {
                // creamios una array para time y para date
                $('input[type="checkbox"]:checked').each(function () {
                if ($(this).attr('id') === 'empty-appointment') {
                // introducimos los valores de time y date en el array
                  time.push($(this).attr('data-time'));
                }else{
                  // imprime un mensaje de consola
                  console.log('no hay citas libres seleccionadas');
                }


              });
              if(time.length > 0){
                blockAppointments(date, time);
                }
              }

              $('#date-picker').change();
            });
            // cuando hacemos click en el boton de desbloquear
            $unblockButton.on('click', function () {
              //imprimimos un mensaje de consola
              console.log('click en el boton de desbloquear');
              // si no confirmamos la eliminación
              if (!confirm('¿Estás seguro de que quieres desbloquear estas citas?')) {
                // cancelamos la eliminación
                alert('Desbloqueo cancelado');
              } else {
                $('input[type="checkbox"]:checked').each(function () {
                // si el checkbox tiene la id 'blocked-appointment'
                if ($(this).attr('id') === 'blocked-appointment') {
                // buscamos el nid de cada cita seleccionada
                  var nid = $(this).attr('data-nid');
                  // imprimimos el nid en consola
                  console.log('nid: ', nid);
                  // eliminamos
                  deleteAppointments(nid);
                }else{
                  // imprime un mensaje de consola
                  console.log('no hay citas bloqueadas seleccionadas');
                }

            });
            $('#date-picker').change();
          }
        });
          }else{
            // buscamos el div con la id 'action-buttons-container' y lo eliminamos
            $('#action-buttons-container').remove();

          }

        });

        // si el checkbox con la id 'check-all' esta seleccionado
        $('#check-all').on('change', function () {
          if ($(this).is(':checked')) {
            // seleccionamos todos los checkbox
            $('input[type="checkbox"]').prop('checked', true);
          } else {
            // si no, los deseleccionamos
            $('input[type="checkbox"]').prop('checked', false);
          }
        });

        // cargamos el input select que hay en la pagina
        var $select = $('#select-action');
        // cuando cambiamos el valor del select
        $select.on('change', function () {
          // si el valor es empty
          if ($select.val() === 'empty') {
            // buscamos todos los input checkbox y los ponemos en unchecked
            $('input[type="checkbox"]').prop('checked', false);
            $('input#empty-appointment').prop('checked', true);
            // si el valor es reserved
          } else if ($select.val() === 'reserved') {
            $('input[type="checkbox"]').prop('checked', false);
            // seleccionamos los checkbox que tengan la id 'reserved-appointment'
            $('input#reserved-appointment').prop('checked', true);
          } else if ($select.val() === 'blocked') {
            $('input[type="checkbox"]').prop('checked', false);
            $('input#blocked-appointment').prop('checked', true);
          } else if ($select.val() === 'all') {
            $('input[type="checkbox"]').prop('checked', true);
          } else if ($select.val() === 'deselect') {
            $('input[type="checkbox"]').prop('checked', false);
          }
        });


      });
    },
  };

  })(jQuery, Drupal);
