/*
Created : 17/04/2016
Authors : ROCHE Emmanuel
Description :
    Gestion de l'interface utilisateur
*/

/* global X */

X.GUIElement = function(id){
    this.HTMLElement = document.getElementById(id);
};
X.GUIElement.prototype.show = function(delay){
    this.HTMLElement.style.visibility = 'visible';
    if(delay){
        setTimeout(function(){X.GUI.hint.hide();}, delay);
    }
};
X.GUIElement.prototype.hide = function(){
    this.HTMLElement.style.visibility = 'hidden';
};
X.GUIElement.prototype.setText = function(text, color){
    if(color){ this.HTMLElement.style.color = color; }
    else{ this.HTMLElement.style.color = 'white'; }
    this.HTMLElement.innerHTML = text;
};

X.GUI = {};
