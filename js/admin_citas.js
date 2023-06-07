(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
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

        var today = new Date();
        var formattedDate = today.toISOString().substr(0, 10);
        var selectedones=[];
        function getSelected() {
          var selected = [];
          $('input[type="checkbox"]').each(function () {
            selected.push({ checked: $(this).prop('checked'), id: $(this).attr('id') });
          });
          return selected;
          }
          function addAppointment(newTimeSlot){
            $.ajax({
              url: Drupal.url('/segura_viudas_citas/admin/add_appointment'),
              data: { timeSlot: newTimeSlot, date: $('#date-picker').val() },
              dataType: 'json',
              success: function (data) {
                console.log('Hora añadida: ', data);
                timeSlots.push(newTimeSlot);
                $('#date-picker').change();
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error añadiendo cita:', textStatus, errorThrown);
              },
            });
        }
        $('#date-picker', context).val(formattedDate).change();
        $('#date-picker', context).off('change').on('change', function () {
          timeSlots = null;

          timeSlots = [
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

          var selectedDate = $(this).val();
          console.log('AdminCitas fecha seleccionada: ', selectedDate);
          $.ajax({
            url: Drupal.url('/segura_viudas_citas/admin/check_apointments'),
            data: { date: selectedDate },
            dataType: 'json',
            success: function (citas) {
              selectedones = getSelected();
              updateCitasTable(citas);
              console.log('obtenemos array de citas de este dia ', citas);
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error fetching appointments:', textStatus, errorThrown);
            },
          });
        });



        function updateCitasTable(citas) {

          var date = $('#date-picker').val();
          var $tableBody = $('.gestion-citas-wrapper table tbody');
          $tableBody.empty();
          citas.forEach(function (cita) {

              if (timeSlots.indexOf(cita.field_time) === -1) {
              timeSlots.push(cita.field_time);
              }

          });
          timeSlots.forEach(function (timeSlot) {
            var citaForTimeSlot = citas.find(function (cita) {
              return cita.field_time === timeSlot;
            });
            var $row = $('<tr></tr>');
            if (citaForTimeSlot) {
              $row.addClass('appointment');
              $row.css('cursor', 'pointer');
              if(citaForTimeSlot.title != 'Bloqueado' || citaForTimeSlot.title != 'Bloqueado Ampliado' || citaForTimeSlot.title != 'Ampliado'){
                $row.off('click').on('click', function () {
                  if (event.target.className == 'action-link action-link--danger action-link--icon-delete') {
                  window.location.href = Drupal.url('node/' + citaForTimeSlot.nid);
                  }
                });
              }
              if(citaForTimeSlot.title == 'Ampliado'){
                var $blockButton = $('<button class="action-link action-link--danger action-link--icon-block" style="border: medium none; background-color: transparent;"></button>').append($('<img src="" alt="lock icon" style="width: 1.5em;" />'));
                $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
                var $checkbox = $('<input type="checkbox" class="form-checkbox form-boolean form-boolean--type-checkbox" id="reserved-appointment" />');
                $checkbox.attr('data-nid', citaForTimeSlot.nid);
                $row.css('background-color', '#f5f8ff');
                $row.append($('<td></td>').append($checkbox));
                $row.append($('<td></td>').text(citaForTimeSlot.field_time));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').append($deleteButton).append($blockButton));
                $blockButton.off('click').on('click', function (event) {
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
              }else if (citaForTimeSlot.title == 'Bloqueado' || citaForTimeSlot.title == 'Bloqueado Ampliado') {
                var $blockButton = $('<button class="action-link action-link--danger action-link--icon-block"></button>').append($('<img src="" alt="lock icon" />'));
                $blockButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/lockicon.svg');
                $blockButton.css('border', 'none');
                $blockButton.css('background-color', 'transparent');
                $blockButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
                $row.addClass('blocked');
                $row.css('background-color', '#ffcccc');
                $blockButton.addClass('blocked');
                $blockButton.find('img').css('transform', 'rotate(-90deg)');
                var $checkbox = $('<input type="checkbox" class="form-checkbox form-boolean form-boolean--type-checkbox check-blocked" id="blocked-appointment" />');
                $checkbox.attr('data-nid', citaForTimeSlot.nid);
                $row.append($('<td></td>').append($checkbox));
                $row.append($('<td></td>').text(timeSlot));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').text(''));
                $row.append($('<td></td>').append($deleteButton).append($blockButton));
                $blockButton.off('click').on('click', function (event) {
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
                  var $checkbox = $('<input type="checkbox" class="form-checkbox form-boolean form-boolean--type-checkbox" id="reserved-appointment" />');
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
                  if (citaForTimeSlot.title != 'Bloqueado' || citaForTimeSlot.title != 'Bloqueado Ampliado') {
                  var $deleteButton = $('<button class="action-link action-link--danger action-link--icon-delete"></button>').append($('<img src="" alt="delete icon" />'));
                  $deleteButton.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/deleteicon.svg');
                  $deleteButton.css('border', 'none');
                  $deleteButton.css('background-color', 'transparent');
                  $deleteButton.find('img').css('width', '1.5em', 'transition', 'all .4s');
                  $row.append($('<td></td>').append($deleteButton));
                  $deleteButton.off('click').on('click', function (event) {
                    if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
                      alert('Eliminación cancelada');
                    }else{
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
              $blockButton.off('click').on('click', function (event) {
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
              var $checkbox = $('<input type="checkbox" class="form-checkbox form-boolean form-boolean--type-checkbox check-empty" id="empty-appointment"/>');
              $checkbox.attr('data-time', timeSlot);
              $checkbox.attr('data-date', $('#date-picker').val());
              $row.append($('<td></td>').append($checkbox));
              $row.append($('<td></td>').text(timeSlot));
              $row.append($('<td colspan="3"></td>').text(''));
              $row.append($('<td></td>').append($blockButton));
            }
            $tableBody.append($row);

            $('input[type="checkbox"]').on('change', function () {
              if ($(this).is(':checked') && $('#action-buttons-container').hasClass('hidden')) {
                checkSelected();
              }else if (!$('input[type="checkbox"]').is(':checked')) {
                checkSelected();
              }
              console.log('selectedones: ', selectedones);
            });
          });
          function checkSelected() {
            console.log('click en checkbox');
            if ($('#action-buttons-container').hasClass('hidden')) {
              $('#action-buttons-container').removeClass('hidden');
              var $actioncontainer = $('#action-buttons-container');
              console.log('hay acciones', $actioncontainer);
              var $deleteButton = $('#delete-button');
              var $blockButton = $('#block-button');
              var $unblockButton = $('#unblock-button');
              $deleteButton.off('click').on('click', function () {
                console.log('click en el boton de eliminar');
                if (!confirm('¿Estás seguro de que quieres eliminar estas citas?')) {
                  alert('Eliminación cancelada');
                } else {
                  $('input[type="checkbox"]:checked').each(function () {
                    if ($(this).attr('id') === 'reserved-appointment') {
                      var nid = $(this).attr('data-nid');
                      console.log('nid: ', nid);
                      deleteAppointments(nid);
                    }else{
                      console.log('no hay citas seleccionadas');
                    }
                  });
                  $('#date-picker').change();
                }
              });
              $blockButton.off('click').on('click', function () {
                date = $('#date-picker').val();
                var time = [];
                console.log('click en el boton de bloquear');
                console.log('fecha: ', date);
                console.log('horas: ', time);
                if (!confirm('¿Estás seguro de que quieres bloquear estas citas?')) {
                  alert('Bloqueo cancelado');
                } else {
                  $('input[type="checkbox"]:checked').each(function () {
                  if ($(this).attr('id') === 'empty-appointment') {
                    time.push($(this).attr('data-time'));
                  }else{
                    console.log('no hay citas libres seleccionadas');
                  }
                });
                if(time.length > 0){
                  blockAppointments(date, time);
                  }
                }
                $('#date-picker').change();
              });
              $unblockButton.off('click').on('click', function () {
                console.log('click en el boton de desbloquear');
                if (!confirm('¿Estás seguro de que quieres desbloquear estas citas?')) {
                  alert('Desbloqueo cancelado');
                } else {
                  $('input[type="checkbox"]:checked').each(function () {
                  if ($(this).attr('id') === 'blocked-appointment') {
                    var nid = $(this).attr('data-nid');
                    console.log('nid: ', nid);
                    deleteAppointments(nid);
                  }else{
                    console.log('no hay citas bloqueadas seleccionadas');
                  }
              });
              $('#date-picker').change();
            }
          });
            }else {
              $('#action-buttons-container').addClass('hidden');
            }
          };
          $('input[type="checkbox"]').each(function () {
            var id = $(this).attr('id');
            var selectedone = selectedones.find(function (selectedone) {
              return selectedone.id === id;
            });
            if (selectedone) {
              $(this).prop('checked', selectedone.checked);
            }
          });
        }
        function blockAppointment(date, timeSlot) {
          ;
          $.ajax({
            url: Drupal.url('/segura_viudas_citas/admin/block_appointment'),
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
        function deleteAppointments(nid){
          $.ajax({
            url: Drupal.url('/segura_viudas_citas/admin/delete_appointment'),
            data: { nid: nid },
            dataType: 'json',
            success: function (data) {
              $('#date-picker').change();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error eliminando cita:', textStatus, errorThrown);
            },
          });
        }
        function blockAppointments(date, timeSlot) {
          $.ajax({
            url: Drupal.url('/segura_viudas_citas/admin/block_appointment'),
            data: { timeSlot: timeSlot.join(','), date: date},
            dataType: 'json',
            success: function (data) {
              // se reinicia la tabla
              $('#date-picker').change();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error bloqueando cita:', textStatus, errorThrown);
            },
          });
        }


        $('#check-all').on('change', function () {
          if ($(this).is(':checked')) {
            $('input[type="checkbox"]').prop('checked', true);
          } else {
            $('input[type="checkbox"]').prop('checked', false);
          }
        });
        var $select = $('#select-action');
        $select.on('change', function () {
          if ($select.val() === 'empty') {
            $('input[type="checkbox"]').prop('checked', false);
            $('input#empty-appointment').prop('checked', true);
          } else if ($select.val() === 'reserved') {
            $('input[type="checkbox"]').prop('checked', false);
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
        $('#add-time-slot').off('click').on('click', function (event) {
          event.stopPropagation();
          var lastTimeSlot = timeSlots[timeSlots.length - 1];
          var lastTimeSlotParts = lastTimeSlot.split(':');
          var lastTimeSlotHour = parseInt(lastTimeSlotParts[0]);
          var lastTimeSlotMinutes = parseInt(lastTimeSlotParts[1]);
          if (lastTimeSlotMinutes === 30) {
            lastTimeSlotHour += 1;
            lastTimeSlotMinutes -= 30;
          } else {
            lastTimeSlotMinutes += 30;
          }
          var newTimeSlot = lastTimeSlotHour + ':' + lastTimeSlotMinutes;
          if (lastTimeSlotMinutes === 0) {
            newTimeSlot += '0';
          }


            addAppointment(newTimeSlot);


        });
    },
  }}(jQuery, Drupal));
