function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(document).ready(() => {
  console.log('hi')
  document.getElementById('email').value = getUrlParameter('email')
  document.getElementById('orderID').value = getUrlParameter('OrderID')
  document.getElementById('orderNumber').value = getUrlParameter('orderNumber')
})
