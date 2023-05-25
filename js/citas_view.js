(function ($, Drupal) {
  Drupal.behaviors.seguraViudasCitas = {
    _attach: function (context, settings) {
      console.log('seguraViudasCitasVIEW behavior attached');

      window.openPopup = function(file_name, file_url, cita_id, file_field_name) {
        var fileExtension = file_url.split('.').pop().toLowerCase();
        var fileDisplayArea;
        if (fileExtension == 'pdf') {
          fileDisplayArea = '<embed src="' + file_url + '" width="900" height="375" type="application/pdf">';
        } else if (fileExtension == 'jpg' || fileExtension == 'jpeg') {
          fileDisplayArea = '<img src="' + file_url + '" width="800">';
        }
        document.getElementById('documentName').innerHTML = '<div id="file-container">' + fileDisplayArea + '</div>';
         // Si el archivo es de formato xls o xlsx se añade un botón de descarga del archivo y en lugar de "undefined" muestra un texto indicando que el archivo no se puede previsualizar
        if (fileExtension == 'xls' || fileExtension == 'xlsx') {
          // Añade un texto antes del botón que diga que el archivo no se puede previsualizar
          fileDisplayArea = '<p>El archivo no se puede previsualizar</p>';
          document.getElementById('documentName').innerHTML = '<div id="file-container">' + fileDisplayArea + '</div>' + '<div id="file-download"><a href="' + file_url + '" download>Descargar archivo</a></div>';
        }

        //document.getElementById('documentName').innerHTML = '<a href="' + file_url + '">' + file_name + '</a>';
        document.getElementById('validateDocument').onclick = function () {
          $.ajax({
            url: Drupal.url('/admin/gestion_citas/reservas/validate_appointment'),
            data: { cita_id: cita_id, file_field_name: file_field_name},
            dataType: 'json',
            success: function () {
              closepreview();
              console.log('documento validado', file_field_name);

              // le añadimos al lado del nombre una imagen de validado
              var img = document.createElement("img");
              img.src = ("/modules/nateevo/segura_viudas_citas/images/validated.svg");
              img.width = 20;
              img.height = 20;
              img.classList.add("validate-icon");
              var src = document.getElementById(file_field_name);

              // si hay un img dentro de src y contiene la clase 'validate-icon' no añadimos la img
              if (!src.classList.contains('validate-icon')) {
                src.append(img);
              }else{
                console.log('ya tiene la clase validate-icon');

                // le cambiamos el source a la img
                src.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/validated.svg');
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error fetching appointments:', textStatus, errorThrown);
            },
          });
        };
        document.getElementById('rejectDocument').onclick = function () {

          $.ajax({
            url: Drupal.url('/admin/gestion_citas/reservas/reject_appointment'),
            data: { cita_id: cita_id, file_field_name: file_field_name},
            dataType: 'json',
            success: function () {
              closepreview();
              console.log('documento rechazado', file_field_name);

              // le añadimos al lado del nombre una imagen de rechazado con la clase 'validate-icon'
              var img = document.createElement("img");
              img.src = ("/modules/nateevo/segura_viudas_citas/images/refused.svg");
              img.width = 20;
              img.height = 20;

              // añadimos la clase 'validate-icon'a nuestra img
              img.classList.add("validate-icon");
              var src = document.getElementById(file_field_name);

              // si el img dentro del elemento con la id (file_field_name) tiene la clase 'validate-icon' no añadimos la img
              if (!src.classList.contains('validate-icon')) {
                src.append(img);
              } else {
                console.log('ya tiene la clase validate-icon');
                
                // le cambiamos el source a la img
                src.find('img').attr('src', '/modules/nateevo/segura_viudas_citas/images/refused.svg');
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error fetching appointments:', textStatus, errorThrown);
            },
          });
        };
        
        document.getElementById('popupDocument').style.display = 'flex';

      }



      window.closePopup = function() {
        document.getElementById('documentName').innerHTML = '';
        document.getElementById('popupDocument').style.display = 'none';
      }
      // creamos funcion cerrar popup y validar documento
      function closepreview(){
        document.getElementById('documentName').innerHTML = '';
        document.getElementById('popupDocument').style.display = 'none';
      }



    },
    get attach() {
      return this._attach;
    },
    set attach(value) {
      this._attach = value;
    },
  };

})(jQuery, Drupal);
