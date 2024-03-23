var validInput = "";
var expInput = "";
var baseInput = "";
var globalResult = {};
var resultInHex = "";

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
    console.log('TYPE: ', typeof(mantissa));
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
    console.log('TYPE: ', typeof(mantissa));
    const isMantissaNegative = isNegative(mantissa);;
    const parseMantissa = parseFloat(mantissa);
    console.log('PARSE MANTISSA: ', parseMantissa);
    var output = "";

    var wholeNum = 0;
    var fractionalPart = 0;

    if(isMantissaNegative === "1"){
        output = output + "-";
        console.log('TEST WHOLE NUM: ', wholeNum);
        wholeNum = parseInt(mantissa.substring(1));
        console.log('PARSE: ', parseFloat(mantissa.substring(1)));
        console.log('WHOLE: ', parseFloat(wholeNum));
        fractionalPart = parseFloat(mantissa.substring(1)) - parseFloat(wholeNum);
        console.log('FRACTION: ', fractionalPart.toFixed(32)); //NOTE: might be lack on precision on some test cases
    } else{
        wholeNum = parseInt(mantissa);
        console.log('TEST WHOLE NUM: ', parseMantissa);
        fractionalPart = parseMantissa - wholeNum;
    }

    console.log(wholeNum);

    console.log("FRACTIONAL: ", fractionalPart)

    output = output + decToBinary(wholeNum) + "." + fractionalToBinary(fractionalPart.toFixed(32).toString());


    console.log('OUTPUT BINARY: ', output);

    return output;
}

//assume mantissa to be in binary x 2^0
function fixMantissa(mantissa){
    // console.log('FIX MANTISSA: ', mantissa); //correct
    console.log('TYPE: ', typeof(mantissa));
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

        console.log('MANTISSA: ', mantissa);

        console.log('CTR: ', ctr);
        console.log('EXP: ', exp);

        var sbstring = mantissa.substring(offset+ctr+2);

        console.log('SUBSTRING!!!: ', sbstring);
    
        result = result + "1" + "." + sbstring;

        

        // result = parseFloat(mantissa).toFixed(32) * (base ** ctr);

        console.log("New result: ", result);

        

    } else {
        //consider the case 1 (e.g. 1111.101). FIND THE DECIMAL POINT.
        
        for(var i = offset+1; i <= mantissa.length - (offset+1); i++){
            console.log('CHARAT: ', mantissa.charAt(i));
            if(mantissa.charAt(i) === "."){
                break;
            }

            ctr--;
            exp++;
        }

        console.log('MANTISSA: ', mantissa);

        console.log('CTR: ', ctr);
        console.log('EXP: ', exp);

        var sbstring = mantissa.substring(offset+1, offset+exp+1);
        var sbstring2 = mantissa.substring(offset+exp+2);

        console.log('SUB1: ', sbstring);
        console.log('SUB2: ', sbstring2);

        result = result + "1" + "." + sbstring + sbstring2;

        console.log('RESULT: ', result);
    }

    const output = {
        result: result,
        exp: exp
    };

    return output;
}

function generateOutput(mantissa, exp){

    console.log('MANTISSA USE: ', mantissa);

    var flag = "";
    var exponent_bits = "";
    var fraction_bits = "";

    //testing 

    var output = {
        s_bit: flag,
        e_bits: exponent_bits,
        f_bits: fraction_bits
    }

    console.log('TYPE: ', typeof(mantissa));
    flag = isNegative(mantissa);
    console.log('FLAG: ', flag);
    console.log('EXP2: ', exp);
    exponent_bits = padZeroes(5, getExponent(exp));
    console.log('MANTISSA: ', mantissa);
    fraction_bits = padZeroes(10, mantissa.toString().substring(2));

    if(flag === "1"){
        fraction_bits = padZeroes(10, mantissa.toString().substring(3));
    }

    output = {
        s_bit: flag,
        e_bits: exponent_bits,
        f_bits: fraction_bits
    }

    console.log('Sign Bit: ', output.s_bit);
    console.log('Exponent Bits: ', output.e_bits);
    console.log('Fraction Bits: ', output.f_bits);

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

// function moveRadixPoint(input, exp){
//     const isMantissaNegative = isNegative(input);
//     const parseExp = parseInt(exp);
//     const number = parseFloat(input);
//     var offset = 0;
//     var result = "";
//     var ctr = parseInt(exp);
//     var str1 = "";
//     var str2 = "";

//     // const notationBuilder = number + "e" + parseExp;
//     // const parseNotation = parseFloat(notationBuilder);

//     // console.log(parseNotation);

//     // const output = {
//     //     mantissa: parseNotation,
//     //     exp : 0
//     // };

//     // INPUT: 5.5025 x 10 ^ 
//     // 5.025
//     // RESULT: 0.005025 x 10 ^ 0

//     if(isMantissaNegative === "1"){
//         offset++;
//     }

//     if(parseExp < 0){
//         //move radix point to the left until exp is 0
//         var str1 = input.substring(input.indexOf(".") - 1, input.indexOf(".") + 1);
//         var str2 = input.substring(input.indexOf(".") + 1);
//         var temp = str1;
//         result = str1 + str2;

//         console.log('STR1: ', str1);
//         console.log('STR2: ', str2);
        
//         console.log('COMBINED: ', result);

//         while(ctr != 0){
//             if(result.charAt(0) !== "."){
//                 str1 = swapTwoChar(str1);
//                 temp = str1;
//                 str2 = temp.charAt(1) + str2;

//             } else {
//                 str1 = swapTwoChar("0.");
//                 temp = str1;
//                 str2 = temp.charAt(1) + str2;
//             }

//             ctr++;
//         }

//         result = str1 + str2;

//         if(result.charAt(0) === "."){
//             result = "0" + result;
//         }

//         console.log('RESULT: ', result);
        

//     } else {
//         //move radix point to the right until exp is 0
//     }

//     return output;
// }

function moveRadixPoint(input, exp){
    console.log('TYPE: ', typeof(input));
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

        console.log('STR1: ', str1);
        console.log('STR2: ', str2);

        if(num <= 0){
            while(temp !== 0){
                padZero = padZero + "0";
                temp++;
            }

            result = "0." + padZero + str1 + str2;

            console.log('RESULT PLS SANA TAMA: ', result);
        } else {
            splitStr = str1.substring(0, num);
            str1 = str1.substring(num);

            result = splitStr + "." + str1 + str2;

            console.log('SANA TAMA: ', result);
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

        console.log('RESULT SANA TAMA PLS AYOKO NA: ', result);
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
    console.log('BIT: ', bits);
    console.log('BINARY: ', binary);
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

function handleConvert() {
    var mantissa = document.getElementById("inputBox").value;
    var exp = document.getElementById("expBox").value;
    const mode = document.getElementById("formatSelect").value;

    var result = {}
    var finalOutput = "";
    var binaryMantissa = "";

    var regex = getRegex(mode);

    const validateFlag = validateMantissa(mantissa, regex);

    if(!validateFlag){
        alert("WRONG!");
    } else {
        if(mode === "decimal"){
            result = moveRadixPoint(mantissa, exp);
            mantissa = result.mantissa;
            exp = result.exp;

            console.log('TYPE: ', typeof(mantissa));

            console.log('ISEMPTY: ', result.mantissa);
            binaryMantissa = binaryBuilder(mantissa);
            console.log('BUILD:' , binaryMantissa); // -- .0000000..00
            binaryMantissa = fixMantissa(binaryMantissa);
            console.log('FIX: ', binaryMantissa); // -- .00..09..9

            mantissa = binaryMantissa.result;
            exp = binaryMantissa.exp;

            finalOutput = generateOutput(mantissa, exp);

            validInput = mantissa;
            expInput = exp;
            baseInput = 2;

        } else {
            result = moveRadixPoint(mantissa, exp)
            mantissa = result.mantissa;
            exp = result.exp;

            binaryMantissa = fixMantissa(mantissa.toString());

            mantissa = binaryMantissa.result;
            exp = binaryMantissa.exp;

            console.log('EXP: ', exp);

            finalOutput = generateOutput(mantissa, exp);

            validInput = mantissa;
            expInput = exp;
            baseInput = 2;
        }

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

function convertBinary() {
    // document.getElementById("inputPrompt").innerHTML = "BINARY CONVERTED";

    var inputFormat = document.getElementById("formatSelect").value;
}

function convertDecimal() {
    // document.getElementById("inputPrompt").innerHTML = "DECIMAL CONVERTED";
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
    // console.log('Sign Bit: ', globalResult.s_bit);
    // console.log('Exponent Bits: ', globalResult.e_bits);
    // console.log('Fractional Bits: ', globalResult.f_bits);
    // console.log('Hex: ', resultInHex);

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


    // return "Sign Bit: " + globalResult.s_bit + "\n" + "Exponent Bits: " + globalResult.e_bits + "\n" + "Fractional Bits: " + globalResult.f_bits + "\n" + "Hex: " + resultInHex + "\n"; 
}