
function getInputFormat() {
    var inputFormat = document.getElementById("formatSelect").value;

    if(inputFormat == "decimal")
    {
        document.getElementById("baseNumber").innerHTML = "&#215;10";
        document.getElementById("inputPrompt").innerHTML = "Decimal Number";
        document.getElementById("inputBox").placeholder = "Enter Decimal Number...";
        document.getElementById("inputBox").value = "";

        document.getElementById("convertBtn").onclick = function() {handleConvert()};
    }
    else if(inputFormat == "binary")
    {
        document.getElementById("baseNumber").innerHTML = "&#215; 2";
        document.getElementById("inputPrompt").innerHTML = "Binary Mantissa";
        document.getElementById("inputBox").placeholder = "Enter Binary Mantissa...";
        document.getElementById("inputBox").value = "";

        document.getElementById("convertBtn").onclick = function() {handleConvert()};
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

function validateMantissa(mantissa, regex){
    var DecimalRegex = /^[-]?[0-9]+[.]?[0-9]*$/; //validates decimal base
    var BinaryRegex = /^[-]?[0-1]+[.]?[0-1]*$/

    console.log('Mantissa: ', mantissa);

    if(mantissa.match(regex)){
        return true;
    } else{
        return false;
    }
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

function getRegex(mode){
    var regex = /^[-]?[0-1]+[.]?[0-1]*$/ //binary regex

    if(mode === "decimal"){
        regex = /^[-]?[0-9]+[.]?[0-9]*$/ //decimal regex
    }

    return regex;
} 

//assume mantissa to be in decimal x 10^0
function binaryBuilder(mantissa){
    const isMantissaNegative = isNegative(mantissa);
    const parseMantissa = parseFloat(mantissa);
    var output = "";

    var wholeNum = 0;
    var fractionalPart = 0;

    if(isMantissaNegative === "1"){
        output = output + "-";
        wholeNum = parseInt(mantissa.substring(1));
        console.log('PARSE: ', parseFloat(mantissa.substring(1)));
        console.log('WHOLE: ', parseFloat(wholeNum));
        fractionalPart = parseFloat(mantissa.substring(1)) - parseFloat(wholeNum);
        console.log('FRACTION: ', fractionalPart.toFixed(32)); //NOTE: might be lack on precision on some test cases
    } else{
        wholeNum = parseInt(mantissa);
        fractionalPart = parseMantissa - wholeNum;
    }

    console.log(wholeNum);

    output = output + decToBinary(wholeNum) + "." + fractionalToBinary(fractionalPart.toFixed(32).toString());


    console.log('OUTPUT: ', output);

    return output;
}

//assume mantissa to be in binary x 2^0
function fixMantissa(mantissa){
    const isMantissaNegative = isNegative(mantissa);
    var offset = 0;
    var ctr = 0;
    var base = 10;
    var result = 0;

    if(isMantissaNegative === "1"){
        offset++;
    } 

    // console.log('OFFSET: ', offset);

    // for(var i = offset; i < mantissa.length - offset; i++){
    //     if(mantissa.charAt(i) === "0"){

    //     }
    // }

    //the if condition tests whether we move the radix point to the left or write
    if(mantissa.charAt(offset) === "0"){
        for(var i = offset+1; i <= mantissa.length - (offset+1); i++){
            console.log('CHARAT: ', mantissa.charAt(i+1));
            if(mantissa.charAt(i) === "1"){
                break;
            }
            ctr++;
        }

        result = parseFloat(mantissa) * (base ** ctr);
    } else {
        //consider the case 1 (e.g. 1111.101). FIND THE DECIMAL POINT.
    }

    console.log("Result: ", result);


}

function generateOutput(mantissa, exp){
    const mode = document.getElementById("formatSelect").value;

    var flag = false;
    var exponent_bits = "";
    var fraction_bits = "";

    //testing 

    var output = {
        s_bit: flag,
        e_bits: exponent_bits,
        f_bits: fraction_bits
    }

    var regex = getRegex(mode);

    const validateFlag = validateMantissa(mantissa, regex);

    if(!validateFlag){
        alert('wrong!');
    } else {
        flag = isNegative(mantissa);
        exponent_bits = padZeroes(5, getExponent());
        fraction_bits = padZeroes(10, mantissa.substring(2));

        if(flag){
            fraction_bits = padZeroes(10, mantissa.substring(3));
        }

        output = {
            s_bit: flag,
            e_bits: exponent_bits,
            f_bits: fraction_bits
        }
    }

    console.log('Sign Bit: ', output.s_bit);
    console.log('Exponent Bits: ', output.e_bits);
    console.log('Fraction Bits: ', output.f_bits);

    return output;
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

    if(output === ""){
        output = output + "0"
    }

    return output;
}

function fractionalToBinary(input){
    //e.g. 0.625
    var parseFractional = parseFloat(input);
    console.log('PARSE FRACTIONAL: ', parseFractional);
    var output = "";
    var temp = 0;

    for(var i = 0; i < 32; i++){
        parseFractional = parseFractional * 2;

        output = output + (Math.floor(parseFractional)).toString();

        if(parseFractional === 1){
            break;
        }

        if(Math.floor(parseFractional) === 1){
            parseFractional = parseFractional - 1;
        } 
    }

    console.log('PARSE FRACTIONAL OUTPUT: ', output);

    return output;
        
}

function moveDecimalPoint(input, exp){
    const parseExp = parseInt(exp);
    const number = parseFloat(input);

    const notationBuilder = number + "e" + parseExp;
    const parseNotation = parseFloat(notationBuilder);

    console.log(parseNotation);

    return parseNotation;
}

function countBits(binary){
    return binary.length;
}

function padZeroes(bits, binary){
    const zeroes = parseInt(bits) - countBits(binary);
    var output = ""

    for(var i = 0; i < zeroes; i++){
        output = output + "0";
    }

    if(bits === 10){
        return binary + output;
    } else{
        return output + binary;
    }
}

function handleConvert() {

    //remove after use
    // var temp = binaryBuilder("-0.625");
    fixMantissa("0.00001");

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