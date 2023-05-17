(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      console.log('seguraViudasCitas behavior attached');

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
})(jQuery, Drupal);

(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      $('#edit-field-date', context).once('seguraViudasCitasDatepicker').each(function () {
        $(this).datepicker({
          dateFormat: 'yy-mm-dd',
          altField: '#edit-field-date',
          altFormat: 'yy-mm-dd',
          showOn: '',
          changeMonth: true,
          changeYear: true
        });

        // Hacer que el calendario esté siempre visible
        $(this).datepicker('show');
      });
    }
  };
})(jQuery, Drupal);


