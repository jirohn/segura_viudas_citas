(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      console.log('seguraViudasCitas behavior attached');

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
        console.log('se hizo clic en el boton de borrar cita');
        // se crea una variable con el valor del campo 'nid'
        var nid = drupalSettings.segura_viudas_citas.nid
        deleteAppointment(nid);
      });

      $('.save-mod-popup', context).click(function(e) {
        e.preventDefault();
        $type = '0';
        if($('input[name="type"]:checked').val()=='telefonica'){
          console.log('se selecciono un tipo de cita telefonica');
          $type = '1';
        }
        // Recoge los datos del formulario.
        var data = {
          nid: drupalSettings.segura_viudas_citas.nid,
          date: $('#date').val(),
          time: $('#time').val(),
          type: $type,
          comment: $('#comment').val()
        };
        console.log('data', data);
        // Enviar una petición AJAX al controlador personalizado.
        $.ajax({
          url: Drupal.url('/proveedores/update_cita'),
          type: 'GET',
          data: data,
          success: function(response) {
            if (response.status === 'success') {
              // La cita se actualizó con éxito.
              // Cierra el popup o muestra un mensaje, dependiendo de tu implementación.
              console.log('La cita se actualizó con éxito');
              // recargamos la pagina
              location.reload();
              $('#mod-popup').hide();
            } else {
              // Hubo un error al actualizar la cita.
              // Muestra un mensaje de error.
              console.log('Hubo un error al actualizar la cita');
              //mostramos alerta
              alert('Hubo un error al actualizar la cita');
            }
          }
        });
      });
      // cerramos el 'mod-popup' cuando se hace clic en el botón 'cancelar'
      $('.close-mod-popup', context).click(function(e) {
        e.preventDefault();
        $('#mod-popup').hide();
      });
      var $file = $('input[type="file"]').eq(0);
      var $file2 = $('input[type="file"]').eq(1);


      $file.add($file2).change(function () {
        console.log('se cargó una foto para el popup');
        if ($file.val() && $file2.val()) {
          // Habilitar el botón
          $('.open-popup').prop('disabled', false);
          console.log('se habilito el open popup');
          $('.open-popup').removeClass('disabled');
        }
      });
      // si hace click en cualquier otro lado o en el boton de cancelar se cierra el popup
      $('#cancel-popup').off('click').click(function (event) {
        console.log('se intento cerrar el popup');
        event.preventDefault(); // Prevenir la acción predeterminada del enlace
        $('#create-popup').hide();
      });
      // Si se hace clic en el botón "open-popup", abrir el popup
      $('.open-popup').off('click').click(function (event) {
        console.log('se intento abrir el popup');

        event.preventDefault(); // Prevenir la acción predeterminada del enlace
        // mostramos el overlay que tiene un hide
        $('#create-popup').show();
      });
      // Si se hace clic en el botón "open-popup", abrir el popup
      $('.open-mod-popup').off('click').click(function (event) {
        console.log('se intento abrir el popup');

        event.preventDefault(); // Prevenir la acción predeterminada del enlace
        // mostramos el overlay que tiene un hide
        $('#mod-popup').show();
      });
      var $form = $(context).find('form');
      if ($form.hasClass('segura-viudas-citas-attached')) {
        return;
      }
      $form.addClass('segura-viudas-citas-attached');
      // guardamos todos los date field fuera y  dentro del form en una variable

      // si cambia el field_date que esta dentro del div con la clase mod-popup el date del form cambia
      $('#mod-popup input[name="field_date"]').on('change', function () {
        console.log('se cambio el date del popup');
        $form.find('input[name="field_date"]').val(this.value);
      });
      var $timeField = $('select[name="field_time"]');
      var $dateField = $('input[name="field_date"]');
      // le asignamos la fecha que tiene el date_field que esta dentro del form

      // Deshabilitar los sábados y domingos
      $dateField.on('change', function () {
        var dateValue = new Date(this.value);
        var day = dateValue.getDay();

        if (day === 0) {
          // detectamos el idioma de la pagina
          var lang = $('html').attr('lang');
          if (lang == 'es') {
            alert('No se pueden seleccionar citas este día');
          } else {
            // ahora en catalan
            alert('No es poden seleccionar cites aquest dia');
          }
          this.value = '';
        }
      });
      // buscamos el submit y le añadimos un icono
      var $submit = $form.find('#edit-submit');
      // le añadimos esto al submit <em class="icon-crest"></em>
      $submit.append('<em class="icon-crest"></em>');
      function disableTimeField() {
        console.log('Desactivando el campo de hora');
        $timeField.prop('disabled', true);
      }

      function enableTimeField() {
        console.log('Activando el campo de hora');
        $timeField.prop('disabled', false);
      }

      function checkExistingAppointments(date) {
        return $.ajax({
          url: Drupal.url('segura_viudas_citas/check_appointments'),
          method: 'GET',
          data: { date: date },
        }).then(function(response) {
          // Añade las horas de la comida a la respuesta antes de devolverla
          response.push('13:00', '13:30', '14:00');
          return response;
        });
      }

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
              $timeField.find('option').prop('disabled', false);
              response.forEach(function (time) {
                $timeField.find('option[value="' + time + '"]').prop('disabled', true);
              });
              $timeField.val($timeField.find('option:not(:disabled):first').val());
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              console.error('Error al obtener citas:', textStatus, errorThrown);
            });
        }
      }

      handleDateChange();
      $dateField.on('change', handleDateChange);

      if (!$dateField.val()) {
        disableTimeField();
      }
    },
  };

  $(document).ready(function () {
    console.log('seguraViudasCitas form styles attached');
    // buscamos los span con clases noFileUploades y le quitamos la clase hidden
    var $fileInfo = $('.file-field');
    // si no existe $fileInfo
    if (!$fileInfo.length) {
    $('.nofileuploades').removeClass('hidden');
    }
    //PABLADAS//
    // Añade clases y estilosa los contenedores de los inputs:
   /* var $fileDiv = $('.js-form-item-field-file').addClass('block column half right space-between').prepend('<p class="file-title">CARTA ACREDITATIVA RAÏM DO CAVA O DO CAT, O AMBDÓS*</p>');
    var $fileDiv2 = $('.js-form-item-field-file2').addClass('block column half right space-between').prepend('<p class="file-title">QUADERN DE CAMP*</p>');
    var $fileDiv3 = $('.js-form-item-field-file3').addClass('block column half right space-between').prepend('<p class="file-title">CERTIFICAT CCPAE</p>');
    var $fileDiv4 = $('.js-form-item-field-file4').addClass('block column half right space-between').prepend('<p class="file-title">RVC</p>');
    var $fileDiv5 = $('.js-form-item-field-file5').addClass('block column half right space-between').prepend('<p class="file-title">ALTRES DOCUMENTS</p>');

    // Combina los divs 'js-form-item-field-file' y 'js-form-item-field-file2' en un solo div con la clase 'block row full cgap-1 uploads nomobile'
    var $fileDivs = $fileDiv.add($fileDiv2).wrapAll('<div class="block row full cgap-1 uploads nomobile"></div>');
    var $fileDivs2 = $fileDiv3.add($fileDiv4).wrapAll('<div class="block row full cgap-1 uploads nomobile"></div>');

    // Agrega la clase 'inputfile' y un ID a los inputs de tipo file
    var $fileInput = $fileDiv.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo');
    var $fileInput2 = $fileDiv2.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo2');
    var $fileInput3 = $fileDiv3.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo3');
    var $fileInput4 = $fileDiv4.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo4');
    var $fileInput5 = $fileDiv5.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo5');

    // Agrega el atributo 'for' y la clase 'label-file' a las etiquetas de los inputs de tipo file
    var $fileLabel = $fileDiv.find('label').attr('for', 'archivo').addClass('label-file');
    var $fileLabel2 = $fileDiv2.find('label').attr('for', 'archivo2').addClass('label-file');
    var $fileLabel3 = $fileDiv3.find('label').attr('for', 'archivo3').addClass('label-file');
    var $fileLabel4 = $fileDiv4.find('label').attr('for', 'archivo4').addClass('label-file');
    var $fileLabel5 = $fileDiv5.find('label').attr('for', 'archivo5').addClass('label-file');

    // Genera el SVG y el texto para las etiquetas
    var svgHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-paperclip" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#718457" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5" /></svg>' + Drupal.t('Adjunta o arrastra el archivo');

    // Inserta el SVG y el texto en las etiquetas de los inputs de tipo file
    $fileLabel.html(svgHTML);
    $fileLabel2.html(svgHTML);
    $fileLabel3.html(svgHTML);
    $fileLabel4.html(svgHTML);
    $fileLabel5.html(svgHTML);

    // Inserta las etiquetas después de los inputs de tipo file
    $fileLabel.insertAfter($fileInput);
    $fileLabel2.insertAfter($fileInput2);
    $fileLabel3.insertAfter($fileInput3);
    $fileLabel4.insertAfter($fileInput4);
    $fileLabel5.insertAfter($fileInput5);
    console.log('seguraViudasCitas form styles end');*/
    // FIN DE PABLADA //
    // Crea el div contenedor con la clase 'popup'
    var $popupDiv = $('#popup');
    var $overlay = $('#create-popup');
    // Selecciona los campos del formulario y el botón de envío y los mueve al div popup
    var $fieldDate = $('#edit-field-date').detach();
    var $fieldTime = $('#edit-field-time').detach();
    var $fieldComment = $('#edit-field-comment').detach();
    var $fieldModalidad = $('#edit-field-modalidad').detach();
    // creamos boton cancelar y lo añadimos en variable
    var $cancel = $('<button type="button" class="secondary-sub close-mod-popup" id="cancel-popup"><em class="icon-crest"></em>Cancelar</button>');
    var $submit = $('#edit-submit').detach();
    // selecciona los labels de los campos y los mueve al div popup
    var $labelDate = $('label[for="edit-field-date"]').detach();
    var $labelTime = $('label[for="edit-field-time"]').detach();
    var $labelComment = $('label[for="edit-field-comment"]').detach();
    var $labelModalidad = $('label[for="edit-field-modalidad"]').detach();
    // Añade los elementos al div
    $popupDiv.append( $labelDate, $fieldDate, $labelTime, $fieldTime, $labelComment, $fieldComment, $labelModalidad, $fieldModalidad,$cancel, $submit);
    console.log('añadido el popup');
    // Agrega el div popup al final del formulario
    $('form').append($overlay);
    console.log('desactivado el popup');
    // escondemos overlay para luego llamarlo con un fadein

    $('.open-popup').prop('disabled', true);
    // hacemos invisible el overlay por defecto con un hide
    $('#create-popup').hide();
    // ocultamos el div con la clase 'mod-popup' por defecto con un hide
    $('#mod-popup').hide();
    var date = $('form input[name="field_date"] ').val();
    $('input[name="field_date"]').val(date);
    // una vez cargado el documento se ejecuta la funcion
    $(document).ready(function() {
      // cogemos todos divs con la clase 'file-info' y los añadimos en una array
      var $fileInfo = $('.file-field');
      // si el array tiene contenido añadimos cada elemento del array en en los input tipo file por orden
      if ($fileInfo.length > 0) {
        $fileInfo.each(function(index) {
          // si el elemento del array tiene un <p> dentro
          if ($(this).find('p').length > 0) {
          var $fileInfo = $(this);
          var $fileInput = $('input[type="file"]').eq(index);
          // le añadimos al fileinput el atributo disabled
          $fileInput.prop('disabled', true).eq(index);
          // le añadimos a al div padre del input la clase 'disabled'
          $fileInput.parent().eq(index).addClass('disabled');
          $fileInfo.insertAfter($fileInput);
          }
        });
      }
    });
    // si presionamos el boton con la id 'delete-cita' se ejecuta la funcion





  });

})(jQuery, Drupal);




