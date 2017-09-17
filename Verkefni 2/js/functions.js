//Font size binary search by Vibber on stackoverflow
/*function fitTextOnCanvas(text, fontface, width){    
    var size = measureTextBinaryMethod(text, fontface, 0, 600, canvas.width);
    return size;
}

function measureTextBinaryMethod(text, fontface, min, max, desiredWidth, context) {
    if (max-min < 1) {
        return min;     
    }
    var test = min+((max-min)/2); //Find half interval
    context.font=test+"px "+fontface;
    measureTest = context.measureText(text).width;
    if ( measureTest > desiredWidth) {
        var found = measureTextBinaryMethod(text, fontface, min, test, desiredWidth, context)
    } else {
        var found = measureTextBinaryMethod(text, fontface, test, max, desiredWidth, context)
    }
    return found;
}*/
//Non-recursive version by Gudni
function measureTextBinaryMethod(text, fontface, min, max, desiredWidth, context) {
    let test = 0;
    let found = min;
    let measureTest = 0;
    while(true){
        if (max-min < 1) {
            return min;     
        }
        test = min+((max-min)/2); //Find half interval
        context.font = `${test}px ${fontface}`;
        measureTest = context.measureText(text).width;
        if (measureTest > desiredWidth) {
            max = test;
        }
        else{
            min = test;
        }
    }
}