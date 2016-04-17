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
X.GUIElement.prototype.show = function(){
    this.HTMLElement.style.visibility = 'visible';
};
X.GUIElement.prototype.hide = function(){
    this.HTMLElement.style.visibility = 'hidden';
};
X.GUIElement.prototype.setText = function(text){
    this.HTMLElement.innerHTML = text;
};

X.GUI = {};
