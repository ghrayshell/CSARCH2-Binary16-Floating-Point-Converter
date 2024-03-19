
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

    if(exp < 0)  {
        /* ZERO */
    }
    else if(exp > 0) {
        /* DENORMALIZE */
    }
    else if(exp > 0) {
        /* INFINITY */
    }
    else if(exp > 0) {
        /* NaN - Not a Number */
    }
    else {
        /* Normal Case */
    }
}

function resetValues() {
    document.getElementById("formatSelect").selectedIndex = 0;
    document.getElementById("inputBox").value = "";
    document.getElementById("expBox").value = "";
    getInputFormat();
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