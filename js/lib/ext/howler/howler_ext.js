



/* global Howl */

Howl.pos2Dstereo = function(x, multiple, screenWidth) {
    var pos2d;
    if (x < screenWidth/2) {
        pos2d = ((screenWidth/2 - x) / (screenWidth/2) * multiple) * -1;
    } else {
        pos2d = (x - screenWidth/2) / (screenWidth/2) * multiple;
    }
    return pos2d;
};