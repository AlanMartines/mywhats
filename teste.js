//
function apenasNumeros(str) {
    str = typeof str.toString();
    return str.replace(/\D+/g, "");
}
//
function soNumeros(string) {
    var numsStr = string.replace(/\D+/g, "");
    return parseInt(numsStr);
}

var numero = "";

console.log("Numero: " + soNumeros(numero));