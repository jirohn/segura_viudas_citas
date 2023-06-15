(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      // cuando el documento este cargado y se realiza solo una vez
      $(document).ready(function() {
      console.log('seguraViudasCitas behavior attached');
      $selectArray = [];
      if($selectArray.length == 0){
        $selectArray = $('select[name="field_time"] option').clone();
      }
      $('#edit-field-file-upload', context).change(function () {
        if (this.files.length > 5) {
          alert("Solo puedes seleccionar un máximo de 5 archivos.");
          this.value = '';
        }
      });
      // le introducimos un texto que diga 'adjunta o arrastra el archivo' dentro del input con clase 'js-form-file'
      $('.js-form-file', context).attr('placeholder', '{{ Adjunta o arrastra el archivo | t }}');
      function deleteAppointment(nid)
      {
        $.ajax({
          url: Drupal.url('/segura_viudas_citas/admin/delete_appointment'),
          data: { nid: nid },
          dataType: 'json',
          success: function (data) {
            console.log('Cita eliminada: ', data);
            // recargamos la pagina
            location.reload();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error eliminando cita:', textStatus, errorThrown);
          },
        });
      }
      $('#delete-cita').click(function() {
        // se crea una variable con el valor del campo 'nid'
        var nid = drupalSettings.segura_viudas_citas.nid
        deleteAppointment(nid);
      });


      // cerramos el 'mod-popup' cuando se hace clic en el botón 'cancelar'
      $('.close-mod-popup', context).click(function(e) {
        e.preventDefault();
        $('#mod-popup').hide();
      });
      var $file = $('.js-form-managed-file').eq(0);
      var $file2 = $('.js-form-managed-file').eq(1);

      // Función para verificar si un elemento tiene al menos dos .js-form-item
      function tieneDosItems($elemento) {
        return $elemento.find('.js-form-item').length >= 1;
      }

      if (tieneDosItems($file) && tieneDosItems($file2)) {
        $('.open-popup').prop('disabled', false).removeClass('disabled');
      } else {
        $('.open-popup').prop('disabled', true).addClass('disabled');
        $('#create-popup').hide();
      }
      $('#cancel-popup').off('click').click(function (event) {
        event.preventDefault();
        $('#create-popup').hide();
      });
      $('.open-popup').off('click').click(function (event) {
        event.preventDefault();
        $('#create-popup').show();
        $('')
      });
      $('.open-mod-popup').off('click').click(function (event) {
        event.preventDefault();
        $('#mod-popup').show();
      });
      var $form = $(context).find('form');
      if ($form.hasClass('segura-viudas-citas-attached')) {
        return;
      }
      $form.addClass('segura-viudas-citas-attached');
      $('#mod-popup input[name="field_date"]').on('change', function () {
        $form.find('input[name="field_date"]').val(this.value);
      });
      var $timeField = $('select[name="field_time"]');
      var $dateField = $('input[name="field_date"]');
      if($('input[name="field_date_update"]').length){
        var $dateField = $('input[name="field_date_update"]');
        handleDateChange();
      }

      $dateField.on('change', function () {
        var dateValue = new Date(this.value);
        var day = dateValue.getDay();
        if (day === 0) {
          var lang = $('html').attr('lang');
          if (lang == 'es') {
            alert('No se pueden seleccionar citas este día');
          } else {
            alert('No es poden seleccionar cites aquest dia');
          }
          this.value = '';
        }
      });
      function disableTimeField() {
        $timeField.prop('disabled', true);
      }
      function enableTimeField() {
        $timeField.prop('disabled', false);
      }
      function checkExistingAppointments(date) {
        return $.ajax({
          url: Drupal.url('segura_viudas_citas/check_appointments'),
          method: 'GET',
          data: { date: date },
        }).then(function(response) {
          response.existing_times.push('13:00', '13:30');
          return response;
        });
      }
      var addedTimes = [];
      $('#guardar').click(function() {
        console.log('se hizo clic en el boton de guardar');
        $('#edit-save').click();
      });


function handleDateChange() {
  console.log('El campo de fecha ha cambiado');
  var dateValue = $dateField.val();
  if (!dateValue) {
    disableTimeField();
  } else {
    console.log('Obteniendo citas existentes para la fecha:', dateValue);
    checkExistingAppointments(dateValue)
      .done(function (response) {
        console.log('Citas recibidas:', response);
        enableTimeField();
        // si la fecha seleccionada en el date es sabado o dia 6 se quitan los campos del select
        var dateValue = new Date($dateField.val());
        var day = dateValue.getDay();
        if (day === 6) {
          $timeField.find('option').remove();
        }else{
          // le damos al select las opciones del array $selectArray
          $timeField.find('option').remove();
          $timeField.append($selectArray);

        }
        addedTimes.forEach(function (time) {
          var timeDate = new Date('1970-01-01T' + time + ':00');
          var time2 = new Date(timeDate.getTime() + 30 * 60000);
          var time2String = time2.toTimeString().slice(0, 5);
          var timeString = timeDate.toTimeString().slice(0, 5);
          var timeformatted = timeString + ' ~ ' + time2String;
          $timeField.find('option[value="' + timeformatted + '"]').remove();
        });
        addedTimes = [];
        $timeField.find('option').prop('disabled', false);
        response.existing_times.forEach(function (time) {
          $timeField.find('option[value="' + time + '"]').prop('disabled', true);
        });
        if (response.addedTimes) {
          response.addedTimes.forEach(function (item) {
            var time = new Date('1970-01-01T' + item.field_time + ':00');
            var nextTime = new Date(time.getTime() + 30 * 60000);
            var newTime2 = nextTime.toTimeString().slice(0, 5);
            var newTime = item.field_time + ' ~ ' + newTime2;
            var newOption = new Option(newTime, item.field_time);
            addedTimes.push(item.field_time);
            if (!$timeField.find('option[value="' + time + '"]').length) {
              $timeField.append(newOption);
            }
          });
        }
        $timeField.val($timeField.find('option:not(:disabled):first').val());
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Error al obtener citas:', textStatus, errorThrown);
      });
  }
}
      $dateField.off('change').on('change', handleDateChange);
      if (!$dateField.val()) {
        disableTimeField();
      }
    });
    },
  };
  $('.save-mod-popup').click(function(e) {
    e.preventDefault();
    $type = '0';
    if($('input[name="type"]:checked').val()=='telefonica'){
      $type = '1';
    }
    // Recoge los datos del formulario.
    var data = {
      nid: drupalSettings.segura_viudas_citas.nid,
      date: $('#date').val(),
      time: $('#time-update').val(),
      type: $type,
      comment: $('#comment').val()
    };    // Enviar una petición AJAX al controlador personalizado.
    $.ajax({
      url: Drupal.url('/proveedores/update_cita'),
      type: 'GET',
      data: data,
      success: function(response) {
        if (response.status === 'success') {
          console.log('La cita se actualizó con éxito');
          location.reload();
          $('#mod-popup').hide();
        } else {
          console.log('Hubo un error al actualizar la cita');
          alert('Hubo un error al actualizar la cita');
        }
      }
    });
  });
  $(document).ready(function () {
    $('.save-file').appendTo('form');
    var $fileInfo = $('.file-field');
    if (!$fileInfo.length) {
    $('.nofileuploades').removeClass('hidden');
    }
    $('.fieldset-legend').addClass('hidden');
    var $popupDiv = $('#popup');
    var $overlay = $('#create-popup');
    var $fieldDate = $('#edit-field-date').detach().val(null);
    var $fieldTime = $('#edit-field-time').detach().val(null);
    var $fieldComment = $('#edit-field-comment').detach();
    var $fieldModalidad = $('#edit-field-modalidad').detach();
    var $cancel = $('<button type="button" class="secondary-sub close-mod-popup" id="cancel-popup"><em class="icon-crest"></em>Cancelar</button>');
    var $submit = $('#edit-submit').detach();
    var $labelDate = $('label[for="edit-field-date"]').detach();
    var $labelTime = $('label[for="edit-field-time"]').detach();
    var $labelComment = $('label[for="edit-field-comment"]').detach();
    var $labelModalidad = $('label[for="edit-field-modalidad"]').detach();
    $popupDiv.append( $labelDate, $fieldDate, $labelTime, $fieldTime, $labelComment, $fieldComment, $labelModalidad, $fieldModalidad,$cancel, $submit);
    $('form').append($overlay);
    $('.open-popup').prop('disabled', true);
    $('#create-popup').hide();
    $('#mod-popup').hide();
    var date = $('form input[name="field_date"] ').val();
    $('input[name="field_date"]').val(date);
    $(document).ready(function() {
      var $fileInfo = $('.file-field');
      var time = $('#time-update').attr('data-time');
      $('#time-update').val(time);
      if ($fileInfo.length > 0) {
        $fileInfo.each(function(index) {
          if ($(this).find('p').length > 0) {
          var $fileInfo = $(this);
          var $fileInput = $('input[type="file"]').eq(index);
          $fileInput.prop('disabled', true).eq(index);
          $fileInput.parent().eq(index).addClass('disabled');
          $fileInfo.insertAfter($fileInput);
          }
        });
      }
    });

    $(document).ready(function() {
      $('#id_de_tu_nuevo_boton').click(function(e) {
          e.preventDefault();
          $('#save-file').click();
      });
    });

  });

})(jQuery, Drupal);

