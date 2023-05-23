function getTimeSlots() {
  var slots = [];
  for (var i = 9; i <= 17; i++) {
    slots.push(('0' + i).slice(-2) + ':00');
    if (i < 17) {
      slots.push(('0' + i).slice(-2) + ':30');
    }
  }
  return slots;
}
var firstload=false;
(function ($, Drupal) {

  Drupal.behaviors.reservas = {

    attach: function (context, settings) {
      // le decimos que si firstload es false que ejecute el codigo
      if(!firstload){
        // comprobamos que la pagina esta cargada
        $(document).ready(function(){
        $('#date-input').val(new Date().toISOString().slice(0,10)).trigger('change');
        firstload=true;
        });

      }

    }

  };

  var slots = getTimeSlots();

      $('#date-input').on('change', function () {
        $(this).on('change', function () {
          var inputDate = $(this).val();
          $.get('citas/' + inputDate, function (data) {
            $('thead th').empty();
            $('tbody td').empty();

            // Llenar las citas para cada día de la semana
            for (var i = 0; i < 7; i++) {
              var date = new Date(inputDate);
              date.setDate(date.getDate() + i);
              var dateString = date.toISOString().slice(0,10);

              $('#day-' + i).text(dateString);

              var citas = data[dateString] || [];

              $.each(slots, function(index, slot) {
                var row = '<p>' + slot + '</p>';
                var cita = citas.find(function(c) { return c.time === slot; });
                if (cita) {
                  if (cita.title === 'Bloqueado') {
                    row += '<p class="bloqueada"></p>';
                  } else {
                    row += '<p class="cita">' + cita.title + ' - ' + cita.comment + ' - ' + cita.modalidad + '</p>';
                    // cuando hacemos click en el row realizamos una funcion
                    $(row).click(function() {
                      window.location.href = Drupal.url('node/' + cita.nid);
                    });
                  }
                } else {
                  row += '<p class="libre"></p>';
                }
                $('#column-' + i).append(row);
              });
            }
          });
        });
      });



      $('#date-input').val(new Date().toISOString().slice(0,10)).trigger('change');


})(jQuery, Drupal);
