(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    attach: function (context, settings) {
      const $timeField = $('select[name="field_time"]', context);
      const $dateField = $('input[name="field_date"]', context);

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
        });
      }

      function handleDateChange() {
        const dateValue = $dateField.val();
        if (!dateValue) {
         // disableTimeField();
        } else {
          checkExistingAppointments(dateValue).done(function (response) {
            enableTimeField();
            $timeField.find('option').prop('disabled', false);
            response.forEach(function (time) {
              $timeField.find('option[value="' + time + '"]').prop('disabled', true);
            });
            $timeField.val($timeField.find('option:not(:disabled):first').val());
          });
        }
      }

      $dateField.on('change', handleDateChange);

      if (!$dateField.val()) {
        disableTimeField();
      }
    },
  };
})(jQuery, Drupal);
