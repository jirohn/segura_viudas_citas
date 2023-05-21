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



      // guardamos los div donde se encuentran los input tipo file y les añadimos clases
      const $fileDiv = $(context).find('.js-form-item-field-file');
      const $fileDiv2 = $(context).find('.js-form-item-field-file2');
      const $fileDiv3 = $(context).find('.js-form-item-field-file3');
      const $fileDiv4 = $(context).find('.js-form-item-field-file4');
      const $fileDiv5 = $(context).find('.js-form-item-field-file5');
      $fileDiv.addClass('block column half right space-between');
      $fileDiv2.addClass('block column half right space-between');
      $fileDiv3.addClass('block column half right space-between');
      $fileDiv4.addClass('block column half right space-between');
      $fileDiv5.addClass('block column half right space-between');
      // cogemos los input tipo file y les añadimos las clases para que queden asi <input type="file" id="real-file" hidden="hidden" />
      const $fileInput = $(context).find('input[type="file"]');
      // le ponemos al $fileInput el atributo hidden y le añadimos la ide real-file
      $fileInput.attr('hidden', 'hidden');
      $fileInput.attr('id', 'real-file');
      /* guardamos una variable con la id custom-button  */
      const $customButton = $(context).find('#custom-button');
      /* y la copiamos en los $fileDiv */
      $fileDiv.append($customButton.clone());
      $fileDiv2.append($customButton.clone());
      $fileDiv3.append($customButton.clone());
      $fileDiv4.append($customButton.clone());
      $fileDiv5.append($customButton.clone());










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




