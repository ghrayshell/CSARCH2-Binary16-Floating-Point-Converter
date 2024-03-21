
function getInputFormat() {
    var inputFormat = document.getElementById("formatSelect").value;

    if(inputFormat == "decimal")
    {
        document.getElementById("baseNumber").innerHTML = "&#215;10";
        document.getElementById("inputPrompt").innerHTML = "Decimal Number";
        document.getElementById("inputBox").placeholder = "Enter Decimal Number...";
        document.getElementById("inputBox").value = "";

        document.getElementById("convertBtn").onclick = function() {convertDecimal()};
    }
    else if(inputFormat == "binary")
    {
        document.getElementById("baseNumber").innerHTML = "&#215; 2";
        document.getElementById("inputPrompt").innerHTML = "Binary Mantissa";
        document.getElementById("inputBox").placeholder = "Enter Binary Mantissa...";
        document.getElementById("inputBox").value = "";

        document.getElementById("convertBtn").onclick = function() {convertBinary()};
    }
}

function getExponent() {
    var exp = document.getElementById("expBox").value;

    const expPrime = getExpPrime(parseInt(exp));
    const binary = decToBinary(expPrime);

    return binary;

    // if(exp < 0)  {
    //     /* ZERO */
    // }
    // else if(exp > 0) {
    //     /* DENORMALIZE */
    // }
    // else if(exp > 0) {
    //     /* INFINITY */
    // }
    // else if(exp > 0) {
    //     /* NaN - Not a Number */
    // }
    // else {
    //     /* Normal Case */
    // }
}

function getExpPrime(exp) {
    return exp + 15;
}

function isNegative(mantissa){
    if(mantissa.charAt(0) === "-"){
        return "1"
    } else{
        return "0"
    }
}

function generateOutput(mantissa, exp){
    const flag = isNegative(mantissa);
    const exponent_bits = getExponent();
    const fraction_bits = mantissa.substring(3);

    const output = flag + exponent_bits + fraction_bits;

    console.log(output);
}

function resetValues() {
    document.getElementById("formatSelect").selectedIndex = 0;
    document.getElementById("inputBox").value = "";
    document.getElementById("expBox").value = "";
    getInputFormat();
}

function decToBinary(input){
    output = "";

    var val = parseInt(input);

    while(val > 0){
        if(val % 2 == 1) {
            output = "1" + output;
        } else {
            output = "0" + output;
        }

        val = Math.floor(val / 2);
    }

    return output;
}

function handleConvert() {
    const mantissa = document.getElementById("inputBox").value;
    const exp = document.getElementById("expBox").value;

    generateOutput(mantissa, exp);
}

function convertBinary() {
    // document.getElementById("inputPrompt").innerHTML = "BINARY CONVERTED";

    var inputFormat = document.getElementById("formatSelect").value;
}

function convertDecimal() {
    // document.getElementById("inputPrompt").innerHTML = "DECIMAL CONVERTED";
}

function saveResult() {

}