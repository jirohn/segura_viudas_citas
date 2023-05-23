(function ($, Drupal) {
    Drupal.behaviors.reservas = {
      attach: function (context, settings) {
        $('#reserva-form', context).on('submit', function (e) {
          e.preventDefault();
          
          var datosReserva = $(this).serialize();
  
          $.ajax({
            url: Drupal.url('/ruta/para/crear/reserva'),
            data: datosReserva,
            dataType: 'json',
            success: function (data) {
              console.log('Reserva creada: ', data);
              // Aquí puedes actualizar la interfaz de usuario para reflejar la reserva creada.
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error al crear reserva:', textStatus, errorThrown);
              // Aquí puedes manejar y mostrar los errores al usuario.
            },
          });
        });
      },
    };
  })(jQuery, Drupal);
  