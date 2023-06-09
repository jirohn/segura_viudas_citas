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
              // guardamos la direccion de la web en una variable
              var url = window.location.href;
              $.each(slots, function(index, slot) {
                var row = '<p>' + slot + '</p>';
                var cita = citas.find(function(c) { return c.time === slot; });
                if (cita) {
                  if (cita.title === 'Bloqueado') {
                    row += '<p class="bloqueada">Bloqueada</p>';
                  } else {
                    // Añade el ID del nodo a la URL del enlace
                    // si cita.modalidad es 0 es 'Precencial' si es 1 es 'Telefónica'
                    if(cita.modalidad == 0){
                      cita.modalidad = "Presencial";
                    } else{
                      cita.modalidad = "Telefónica";
                    }
                  // If cita.verificado1 y cita.verificado2 is "validado" add the validated icon in the span with the id validation-icon
                  if(cita.verificado1 == "validado" && cita.verificado2 == "validado") {
                    row += '<p class="cita"><a href="'+ url + "/" +  cita.nid + '">' + '<span id="validation-icon"><img style="transform:translateY(4px)" width="20px" height="20px"src="/modules/nateevo/segura_viudas_citas/images/validated.svg"></span>' + '<b>' + cita.title +  '</b><br>' + cita.modalidad + '</a></p>';
                  } else if(cita.verificado1 == "rechazado" || cita.verificado2 == "rechazado") {
                    row += '<p class="cita"><a href="'+ url + "/" +  cita.nid + '">' + '<span id="validation-icon"><img style="transform:translateY(4px)" width="20px" height="20px"src="/modules/nateevo/segura_viudas_citas/images/refused.svg"></span>' + '<b>' + cita.title +  '</b><br>' + cita.modalidad + '</a></p>';
                  } else {
                    row += '<p class="cita"><a href="'+ url + "/" +  cita.nid + '">' + '<span id="validation-icon"></span>' + '<b>' + cita.title +  '</b><br>' + cita.modalidad + '</a></p>';
                  }}
                } else {
                  row += '<p class="libre"><br></p>';
                }
                $('#column-' + i).append(row);
              });
            }
          });
        });
      });

      $('#date-input').val(new Date().toISOString().slice(0,10)).trigger('change');


})(jQuery, Drupal);
