var validInput = "";
var expInput = "";
var baseInput = "";
var globalResult = {};
var resultInHex = "";
var detectedSpecialCase = "Normal";

function getInputFormat() {
    var inputFormat = document.getElementById("formatSelect").value;

    if(inputFormat === "decimal")
    {
        document.getElementById("baseNumber").innerHTML = "&#215;10";
        document.getElementById("inputPrompt").innerHTML = "Decimal Number";
        document.getElementById("inputBox").placeholder = "Enter Decimal Number...";
        document.getElementById("inputBox").value = "";

        // document.getElementById("convertBtn").onclick = function() {handleConvert()};
    }
    else if(inputFormat === "binary")
    {
        document.getElementById("baseNumber").innerHTML = "&#215; 2";
        document.getElementById("inputPrompt").innerHTML = "Binary Mantissa";
        document.getElementById("inputBox").placeholder = "Enter Binary Mantissa...";
        document.getElementById("inputBox").value = "";

        // document.getElementById("convertBtn").onclick = function() {handleConvert()};
    }
}

function getExponent(exp) {

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
    
    const isMantissaNegative = isNegative(mantissa);;
    const parseMantissa = parseFloat(mantissa);
    
    var output = "";

    var wholeNum = 0;
    var fractionalPart = 0;

    if(isMantissaNegative === "1"){
        output = output + "-";
        
        wholeNum = parseInt(mantissa.substring(1));
        
        fractionalPart = parseFloat(mantissa.substring(1)) - parseFloat(wholeNum);
        
    } else{
        wholeNum = parseInt(mantissa);
       
        fractionalPart = parseMantissa - wholeNum;
    }

    output = output + decToBinary(wholeNum) + "." + fractionalToBinary(fractionalPart.toFixed(32).toString());

    return output;
}

//assume mantissa to be in binary x 2^0
function fixMantissa(mantissa){
    
    
    const isMantissaNegative = isNegative(mantissa);
    var offset = 0;
    var ctr = 0;
    var base = 10;
    var result = "";
    var exp = 0;

    if(isMantissaNegative === "1"){
        offset++;
        result = result + "-";
    } 

    //the if condition tests whether we move the radix point to the left or write
    if(mantissa.charAt(offset) === "0"){
        for(var i = offset+1; i <= mantissa.length - (offset+1); i++){
            if(mantissa.charAt(i) === "1"){
                break;
            }
            ctr++;
            exp--;
        }

        var sbstring = mantissa.substring(offset+ctr+2);
        result = result + "1" + "." + sbstring;
    } else {
        //consider the case 1 (e.g. 1111.101). FIND THE DECIMAL POINT.
        
        for(var i = offset+1; i <= mantissa.length - (offset+1); i++){
            
            if(mantissa.charAt(i) === "."){
                break;
            }

            ctr--;
            exp++;
        }

        var sbstring = mantissa.substring(offset+1, offset+exp+1);
        var sbstring2 = mantissa.substring(offset+exp+2);

        result = result + "1" + "." + sbstring + sbstring2;
    }

    const output = {
        result: result,
        exp: exp,
        s_cases: ""
    };

    if(exp > 15){
        output.s_cases = "infinity";
        detectedSpecialCase = "Infinity";
    }

    if(exp <= -15){
        
        output.s_cases = "denormalize";
        detectedSpecialCase = "Denormalized";
    }

    if(mantissa === 0){
        output.s_cases = "zero";
        detectedSpecialCase = "Zero";
    }

    return output;
}

function handleDenormalize(mantissa, exp){
    const isMantissaNegative = isNegative(mantissa);
    var posExp = parseInt(exp) * -1;
    var offset = 0;
    var numZero = posExp - 15;
    var padZero = "";
    var result = "";
    var signBit = "";
    var fractionBits = "";

    for(var i = 0; i < numZero; i++){
        padZero = "0" + padZero;
    }

    if(isMantissaNegative === "1"){
        offset++;
        signBit = "1";
    } else{
        signBit = "0";
    }

    var str1 = "1";
    var str2 = mantissa.substring(mantissa.indexOf(".") + 1);

    result = "0." + padZero + str1 + str2;
    fractionBits = padZero + str1 + str2;

    const output = {
        s_bit: signBit,
        e_bits: "00000",
        f_bits: fractionBits.substring(0, 10)
    }

    return output;
}

function generateOutput(mantissa, exp, s_case){
    var flag = "";
    var exponent_bits = "";
    var fraction_bits = "";

    var output = {
        s_bit: flag,
        e_bits: exponent_bits,
        f_bits: fraction_bits
    }

    flag = isNegative(mantissa);
    exponent_bits = padZeroes(5, getExponent(exp));
    fraction_bits = padZeroes(10, mantissa.toString().substring(2));

    if(flag === "1"){
        fraction_bits = padZeroes(10, mantissa.toString().substring(3));
    }

    output = {
        s_bit: flag,
        e_bits: exponent_bits,
        f_bits: fraction_bits
    }

    if(s_case === "infinity"){
        output = {
            s_bit: flag,
            e_bits: "11111",
            f_bits: "0000000000"
        }
    }

    if(s_case === "zero"){
        output = {
            s_bit: flag,
            e_bits: "00000",
            f_bits: "0000000000"
        }
    }

    if(s_case === "denormalize"){
       output = handleDenormalize(mantissa, exp);
    }

    return output;
}

function resetValues() {
    document.getElementById("formatSelect").selectedIndex = 0;
    document.getElementById("specialCase").innerHTML = "";
    document.getElementById("inputBox").value = "";
    document.getElementById("expBox").value = "";
    getInputFormat();

    document.getElementById("signBit").innerHTML = "X";
    document.getElementById("expBit").innerHTML = "XXX XX";
    document.getElementById("fracPart").innerHTML = "XX XXXX XXXX";

    document.getElementById("HEX1").innerHTML = "X";
    document.getElementById("HEX2").innerHTML = "X";
    document.getElementById("HEX3").innerHTML = "X";
    document.getElementById("HEX4").innerHTML = "X";

    document.getElementById("SIGNBOX").style.backgroundColor = "#666666";
    document.getElementById("SIGNBOX").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";
    document.getElementById("FRACBOX").style.backgroundColor = "#666666";
    document.getElementById("FRACBOX").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";
    document.getElementById("EXPBOX").style.backgroundColor = "#666666";
    document.getElementById("EXPBOX").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";

    document.getElementById("HEXBOX").style.backgroundColor = "#666666";
    document.getElementById("HEXBOX").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";
    document.getElementById("HEXBOX-2").style.backgroundColor = "#666666";
    document.getElementById("HEXBOX-2").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";
    document.getElementById("HEXBOX-3").style.backgroundColor = "#666666";
    document.getElementById("HEXBOX-3").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";
    document.getElementById("HEXBOX-4").style.backgroundColor = "#666666";
    document.getElementById("HEXBOX-4").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";

    document.getElementById("saveBtn").disabled = true;
    document.getElementById("saveBtn").removeAttribute("enabled");
    document.getElementById("saveBtn").className = "disabled";
    document.getElementById("saveBtn").style.backgroundColor = "#1F2529";
    document.getElementById("saveBtn").style.cursor = "not-allowed";
    document.getElementById("saveBtn").style.boxShadow = "inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040, inset 0px 4px 4px #00000040";
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

    return output;    
}

function moveRadixPoint(input, exp){
    
    const isMantissaNegative = isNegative(input);
    const parseExp = parseInt(exp);
    var ctr = parseExp;
    var temp = 0;
    var offset = 0;
    var num = 0;
    var padZero = "";
    var splitStr = "";
    var result = "";

    if(isMantissaNegative === "1"){
        offset++;
    }

    if(parseExp < 0){

        var str1 = input.substring(offset, input.indexOf("."));
        var str2 = input.substring(input.indexOf(".") + 1);

        num = str1.length + parseExp;
        temp = num;

        if(num <= 0){
            while(temp !== 0){
                padZero = padZero + "0";
                temp++;
            }

            result = "0." + padZero + str1 + str2;
        } else {
            splitStr = str1.substring(0, num);
            str1 = str1.substring(num);

            result = splitStr + "." + str1 + str2;
        }
    }

    if(parseExp > 0){
        var str1 = input.substring(offset, input.indexOf("."));
        var str2 = input.substring(input.indexOf(".") + 1);
        num = parseExp - str2.length;
        temp = num;
        padZero = "";
        result = "";

        if(num > 0){
            while(temp !== 0){
                padZero = padZero + "0";
                temp--;
            }

            result = str1 + str2 + padZero;
        } else {
            splitStr = str2.substring(0, exp);
            str2 = str2.substring(exp);

            result = str1 + splitStr + "." + str2;
        }
    }

    if(isMantissaNegative === "1"){
        result = "-" + result;
    }

    if(parseExp === 0) {
        result = input;
    }

    const output = {
        mantissa: result,
        exp: 0
    };

    return output;
}

function swapTwoChar(str){
    return str.charAt(1) + str.charAt(0);
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
        if(zeroes < 0){
            output = ""
            for(var i = 0; i < 10; i++){
                output = output + binary.charAt(i);
            }

            return output;
        }

        return binary + output;
    } else{
        return output + binary;
    }
}

function validateExp(exp, regex){
    var flag = false;

    if(exp.match(regex)){
        flag = true;
    }

    return flag;
}

function handleConvert() {
    var mantissa = document.getElementById("inputBox").value;
    var exp = document.getElementById("expBox").value;
    const mode = document.getElementById("formatSelect").value;

    var result = {}
    var finalOutput = "";
    var binaryMantissa = "";
    var s_case = "";

    var regex = getRegex(mode);

    const validateFlag = validateMantissa(mantissa, regex);
    const isExpCorrect = validateExp(exp, /-?\d+/);

    if(!isExpCorrect || !validateFlag){

        globalResult = {
            s_bit: "X",
            e_bits: "11111",
            f_bits: "01XXXXXXXX"
        }

        detectedSpecialCase = "NaN";
        resultInHex = "XXXX";

        printOutputs();
    } else {
        if(mode === "decimal"){
            validInput = mantissa;
            expInput = exp;
            baseInput = 10;
            
            result = moveRadixPoint(mantissa, exp);
            mantissa = result.mantissa;
            exp = result.exp;

            

            
            binaryMantissa = binaryBuilder(mantissa);
            
            binaryMantissa = fixMantissa(binaryMantissa);
            

            mantissa = binaryMantissa.result;
            exp = binaryMantissa.exp;
            s_case = binaryMantissa.s_cases;

            finalOutput = generateOutput(mantissa, exp, s_case);
        } else {
            validInput = mantissa;
            expInput = exp;
            baseInput = 2;
            
            result = moveRadixPoint(mantissa, exp)
            mantissa = result.mantissa;
            exp = result.exp;

            binaryMantissa = fixMantissa(mantissa);

            mantissa = binaryMantissa.result;
            exp = binaryMantissa.exp;
            s_case = binaryMantissa.s_cases;

            

            finalOutput = generateOutput(mantissa, exp, s_case);
        }

        document.getElementById("saveBtn").disabled = false;
        document.getElementById("saveBtn").removeAttribute("disabled");
        document.getElementById("saveBtn").className = "enabled";
        document.getElementById("saveBtn").style.backgroundColor = "#344955";
        document.getElementById("saveBtn").style.cursor = "pointer";
        document.getElementById("saveBtn").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040, 0px 4px 4px #00000040";

        globalResult = finalOutput;
        resultInHex = binaryToHex(finalOutput.s_bit + finalOutput.e_bits + finalOutput.f_bits);

        printOutputs();
    }
}

function binaryToHex(binary) {
    let hex = '';

    for (let i = 0; i < binary.length; i += 4) {
        let binarybyte = binary.substr(i, 4);
        let hexDigit = parseInt(binarybyte, 2).toString(16); 
        hex += hexDigit; 
    }

    return hex.toUpperCase(); 
}

function saveResult() {
  
    const link = document.createElement("a");
    const file = new Blob(["\n\n [ FLOATING-POINT CONVERTER RESULTS ] \n\n\n", " INPUT = ", validInput, "x", baseInput, "^", expInput, "\n\n ---------- \n\n BINARY-16 = ", globalResult.s_bit, " ", globalResult.e_bits, " ", globalResult.f_bits, "\n HEXADECIMAL = ", resultInHex], { type: 'text/plain' });

    link.href = URL.createObjectURL(file);
    link.download = "binary16_hex_result.txt";

    link.click();
    URL.revokeObjectURL(link.href); 
}

function printOutputs(){
    document.getElementById("specialCase").innerHTML = detectedSpecialCase;

    document.getElementById("signBit").innerHTML = globalResult.s_bit;
    document.getElementById("expBit").innerHTML = globalResult.e_bits.substring(0, 3) + " " + globalResult.e_bits.substring(3, 5);
    document.getElementById("fracPart").innerHTML = globalResult.f_bits.substring(0, 2) + " " + globalResult.f_bits.substring(2, 6) + " " + globalResult.f_bits.substring(6, 10);

    document.getElementById("HEX1").innerHTML = resultInHex.substring(0, 1);
    document.getElementById("HEX2").innerHTML = resultInHex.substring(1, 2);
    document.getElementById("HEX3").innerHTML = resultInHex.substring(2, 3);
    document.getElementById("HEX4").innerHTML = resultInHex.substring(3, 4);

    document.getElementById("SIGNBOX").style.backgroundColor = "#d9d9d9";
    document.getElementById("SIGNBOX").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";
    document.getElementById("FRACBOX").style.backgroundColor = "#d9d9d9";
    document.getElementById("FRACBOX").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";
    document.getElementById("EXPBOX").style.backgroundColor = "#d9d9d9";
    document.getElementById("EXPBOX").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";

    document.getElementById("HEXBOX").style.backgroundColor = "#d9d9d9";
    document.getElementById("HEXBOX").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";
    document.getElementById("HEXBOX-2").style.backgroundColor = "#d9d9d9";
    document.getElementById("HEXBOX-2").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";
    document.getElementById("HEXBOX-3").style.backgroundColor = "#d9d9d9";
    document.getElementById("HEXBOX-3").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";
    document.getElementById("HEXBOX-4").style.backgroundColor = "#d9d9d9";
    document.getElementById("HEXBOX-4").style.boxShadow = "0px 4px 4px #00000040, 0px 4px 4px #00000040";
}