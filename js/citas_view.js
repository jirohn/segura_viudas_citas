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
              img.src = "/modules/nateevo/segura_viudas_citas/images/validated.svg";
              img.width = 20;
              img.height = 20;
              img.class = "validate-icon";
              var src = document.getElementById(file_field_name);
              src.append(img);
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
              console.log('documento rechazado', file_field_name, 2);
              // le añadimos al lado del nombre una imagen de rechazado
              var img = document.createElement("img");
              img.src = "/modules/nateevo/segura_viudas_citas/images/refused.svg";
              img.width = 20;
              img.height = 20;
              var src = document.getElementById(file_field_name);
              src.append(img);
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
