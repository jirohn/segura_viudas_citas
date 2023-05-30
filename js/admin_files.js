(function ($, Drupal) {
  Drupal.behaviors.adminCitas = {
    attach: function (context, settings) {
      $(document).ready(function () {

        $.ajax({
          url: Drupal.url('/segura_viudas_citas/admin/check_apointments'),
          dataType: 'json',
          success: function (citas) {
            updateCitasTable(citas);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching appointments:', textStatus, errorThrown);
          },
        });

        function updateCitasTable(citas) {
          var $tableBody = $('.gestion-citas-wrapper table tbody');
          $tableBody.empty();

          citas.forEach(function (cita) {
            var $row = $('<tr></tr>');

            $row.append($('<td></td>').text(cita.title));

            if(cita.field_comment != null){
              comment_sanitized = cita.field_comment.replace(/<[^>]+>/g, '');
              $row.append($('<td></td>').text(comment_sanitized));
            }else{
              $row.append($('<td></td>').text(''));
            }

            $tableBody.append($row);
          });
        }

      });
    },

  };
})(jQuery, Drupal);
