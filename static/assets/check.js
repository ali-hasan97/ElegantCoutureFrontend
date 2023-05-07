function check() {
    var input = document.getElementById('psw');
    if (input.value != document.getElementById('psw-repeat').value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        // input is valid -- reset the error message
        input.setCustomValidity('');
    }
  }