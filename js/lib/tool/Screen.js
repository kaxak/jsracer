/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    Objet définissant l'écran (canvas)
*/

/* global include, X */

/* 

*/
X.Screen = new function(){
    /* Properties */
    this.width = 0;
    this.height = 0;
    
    /* Méthodes */
    this.InitFromCanvas = function(canvas){
        if(canvas && canvas.tagName === 'CANVAS'){
            this.width = canvas.width || 0;
            this.height = canvas.height || 0;
        }
        else{
            console.log('[Error} Screen:InitFromCanvas(canvas): parameter canvas is not recognized');
        }
    };
}();