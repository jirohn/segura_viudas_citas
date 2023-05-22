(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      console.log('seguraViudasCitas behavior attached');

      //si lees esto es que te sobra tiempo

      /*const realFile = document.getElementById("real-file");
      const customButton = document.getElementById("custom-button");
      const fileName = document.getElementById("file-name");



      function openPopUp() {
        popUp.style.display = 'flex';
        body.classList.add('no-scroll');
      }

      function closePopUp() {
        popUp.style.display = 'none';
        body.classList.remove('no-scroll');
      }

      btn.onclick = openPopUp;
      closeBtn.onclick = closePopUp;

      window.onclick = function (event) {
        if (event.target === popUp) {
          closePopUp();
        }
      }
*/

      //cosas pedralas Pedralo, estas to pedralao, el que lo desenpedre buen desenpedrelador sera//
      // Custom File Input Button.
      /*const realFileBtn = $(context).find('.js-form-item-field-file');
      const customBtn = $(context).find('.custom-upload-button');
      const customTxt = $(context).find('.custom-text');

      customBtn.click(function () {
        realFileBtn.click();
      });

      realFileBtn.change(function () {
        if (realFileBtn.val()) {
          customTxt.html(realFileBtn.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
        } else {
          customTxt.html('No se ha seleccionado ningún archivo...');
        }
      });*/

      // le decimos que si presionas el boton openPopUp hace una funcion

      // Seleccionamos los contenedores de los inputs y les añadimos las clases
      var $fileDiv = $(context).find('.js-form-item-field-file').addClass('block column half right space-between').prepend('<p class="file-title">CARTA ACREDITATIVA RAÏM DO CAVA O DO CAT, O AMBDÓS*</p>');
      var $fileDiv2 = $(context).find('.js-form-item-field-file2').addClass('block column half right space-between').prepend('<p class="file-title">QUADERN DE CAMP*</p>');
      var $fileDiv3 = $(context).find('.js-form-item-field-file3').addClass('block column half right space-between').prepend('<p class="file-title">CERTIFICAT CCPAE</p>');
      var $fileDiv4 = $(context).find('.js-form-item-field-file4').addClass('block column half right space-between').prepend('<p class="file-title">RVC</p>');
      var $fileDiv5 = $(context).find('.js-form-item-field-file5').addClass('block column half right space-between').prepend('<p class="file-title">ALTRES DOCUMENTS</p>');






      // mete los divs js-form-item-field-file y js-form-item-field-file2 dentro de un div con las clases 'block row full cgap-1 uploads nomobile' 
      var $fileDivs = $fileDiv.add($fileDiv2).wrapAll('<div class="block row full cgap-1 uploads nomobile"></div>');
      var $fileDivs2 = $fileDiv3.add($fileDiv4).wrapAll('<div class="block row full cgap-1 uploads nomobile"></div>');




      // Seleccionamos los input de tipo file y les añadimos la clase y la id correspondientes
      var $fileInput = $fileDiv.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo');
      var $fileInput2 = $fileDiv2.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo2');
      var $fileInput3 = $fileDiv3.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo3');
      var $fileInput4 = $fileDiv4.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo4');
      var $fileInput5 = $fileDiv5.find('input[type="file"]').addClass('inputfile').attr('id', 'archivo5');

      // Seleccionamos los labels de los inputs que contengan la clase inputfile y les añadimos el atributo for y la clase correspondientes
      var $fileLabel = $fileDiv.find('label').attr('for', 'archivo').addClass('label-file');
      var $fileLabel2 = $fileDiv2.find('label').attr('for', 'archivo2').addClass('label-file');
      var $fileLabel3 = $fileDiv3.find('label').attr('for', 'archivo3').addClass('label-file');
      var $fileLabel4 = $fileDiv4.find('label').attr('for', 'archivo4').addClass('label-file');
      var $fileLabel5 = $fileDiv5.find('label').attr('for', 'archivo5').addClass('label-file');

      // Generamos el SVG y el texto de los labels
      var svgHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-paperclip" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#718457" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5" /></svg>' + Drupal.t('Adjunta o arrastra el archivo');


      $fileLabel.html(svgHTML);
      $fileLabel2.html(svgHTML);
      $fileLabel3.html(svgHTML);
      $fileLabel4.html(svgHTML);
      $fileLabel5.html(svgHTML);

      $fileLabel.insertAfter($fileInput);
      $fileLabel2.insertAfter($fileInput2);
      $fileLabel3.insertAfter($fileInput3);
      $fileLabel4.insertAfter($fileInput4);
      $fileLabel5.insertAfter($fileInput5);

      // guardamos una variable con la id file-name y la añadimos en despues de los input tipo file



      // guarda el primero y el segundo input del tipo file de 5 que hay en la pagina y los almacena en una variable
      const $file = $(context).find('input[type="file"]').eq(0);
      const $file2 = $(context).find('input[type="file"]').eq(1);


      $file.add($file2).change(function() {
        console.log('se cargo una foto para el popup');
        if ($file.val() && $file2.val()) {
          // le quitamos el disabled al boton
          $('.open-popup').prop('disabled', false);
          console.log('abierto el popup');
        }
      });

      const $form = $(context).find('form');
      if ($form.hasClass('segura-viudas-citas-attached')) {
        return;
      }
      $form.addClass('segura-viudas-citas-attached');

      const $timeField = $form.find('select[name="field_time"]');
      const $dateField = $form.find('input[name="field_date"]');


      // deshabilitamos los sabados y domingos
      $dateField.on('change', function () {
        const dateValue = new Date(this.value);
        const day = dateValue.getDay();

        if (day === 6 || day === 0) {
          alert('Sábados y domingos no están disponibles para citas.');
          this.value = '';
        }
      });
      function disableTimeField() {
        console.log('Disabling time field'); // Added console log
        $timeField.prop('disabled', true);
      }

      function enableTimeField() {
        console.log('Enabling time field'); // Added console log
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
        console.log('Date field changed'); // Added console log
        const dateValue = $dateField.val();
        if (!dateValue) {
          disableTimeField();
        } else {
          console.log('Fetching existing appointments for date:', dateValue); // Added console log
          checkExistingAppointments(dateValue).done(function (response) {
            console.log('Received appointments:', response); // Added console log
            enableTimeField();
            $timeField.find('option').prop('disabled', false);
            response.forEach(function (time) {
              $timeField.find('option[value="' + time + '"]').prop('disabled', true);
            });
            $timeField.val($timeField.find('option:not(:disabled):first').val());
          }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching appointments:', textStatus, errorThrown); // Added console log
          });
        }
      }
      //llamamos al 'handleDateChange' cuando carga la pagina con la fecha ya seleccionada
      handleDateChange();
      $dateField.on('change', handleDateChange);


      if (!$dateField.val()) {
        disableTimeField();
      }
    },
  };
  $(document).ready(function() {
    // Crea el div contenedor con la clase 'popup'
    var $popupDiv = $('#popup');

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
    $('form').append($popupDiv);
    console.log('seguraViudasCitas behavior attached');

    console.log('desactivado el popup');
    // desactivamos el open-poppup
    $('.open-popup').prop('disabled', true);
  });

})(jQuery, Drupal);




