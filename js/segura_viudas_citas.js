(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      console.log('seguraViudasCitas behavior attached');


      var $file = $('input[type="file"]').eq(0);
      var $file2 = $('input[type="file"]').eq(1);


      $file.add($file2).change(function () {
        console.log('se cargó una foto para el popup');
        if ($file.val() && $file2.val()) {
          // Habilitar el botón
          $('.open-popup').prop('disabled', false);
          console.log('se habilito el open popup');
        }
      });

      // Si se hace clic en el botón "open-popup", abrir el popup
      $('.open-popup').off('click').click(function (event) {
        console.log('se intento abrir el popup');

        event.preventDefault(); // Prevenir la acción predeterminada del enlace
        // mostramos el overlay que tiene un hide
        $('.overlay').show();
      });
      var $form = $(context).find('form');
      if ($form.hasClass('segura-viudas-citas-attached')) {
        return;
      }
      $form.addClass('segura-viudas-citas-attached');

      var $timeField = $form.find('select[name="field_time"]');
      var $dateField = $form.find('input[name="field_date"]');

      // Deshabilitar los sábados y domingos
      $dateField.on('change', function () {
        var dateValue = new Date(this.value);
        var day = dateValue.getDay();

        if (day === 6 || day === 0) {
          alert('Los sábados y domingos no están disponibles para citas.');
          this.value = '';
        }
      });

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

    // Añade clases y estilosa los contenedores de los inputs:
    var $fileDiv = $('.js-form-item-field-file').addClass('block column half right space-between').prepend('<p class="file-title">CARTA ACREDITATIVA RAÏM DO CAVA O DO CAT, O AMBDÓS*</p>');
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
    console.log('seguraViudasCitas form styles end');
    // Crea el div contenedor con la clase 'popup'
    var $popupDiv = $('.popup');
    var $overlay = $('.overlay');
    // Selecciona los campos del formulario y el botón de envío y los mueve al div popup
    var $fieldDate = $('#edit-field-date').detach();
    var $fieldTime = $('#edit-field-time').detach();
    var $fieldComment = $('#edit-field-comment').detach();
    var $fieldModalidad = $('#edit-field-modalidad').detach();
    var $submit = $('#edit-submit').detach();
    // selecciona los labels de los campos y los mueve al div popup
    var $labelDate = $('label[for="edit-field-date"]').detach();
    var $labelTime = $('label[for="edit-field-time"]').detach();
    var $labelComment = $('label[for="edit-field-comment"]').detach();
    var $labelModalidad = $('label[for="edit-field-modalidad"]').detach();
    // Añade los elementos al div
    $popupDiv.append( $labelDate, $fieldDate, $labelTime, $fieldTime, $labelComment, $fieldComment, $labelModalidad, $fieldModalidad, $submit);
    console.log('añadido el popup');
    // Agrega el div popup al final del formulario
    $('form').append($overlay);
    console.log('desactivado el popup');
    // escondemos overlay para luego llamarlo con un fadein
    $('.overlay').hide();
    $('.open-popup').prop('disabled', true);

  });

})(jQuery, Drupal);




