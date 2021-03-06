/*
Created : 06/03/2016
Authors : ROCHE Emmanuel, GINOT Gilles
Description :
    Représente un rectangle à la position x,y , qui a une largeur w et une hauteur h.
*/

/* global include, X */

include('js/Vector.js');

X.Rect = function(position, width, height){
    /* Properties */
    this.x = position.x || 0;
    this.y = position.y || 0;
    this.w = width || 0;
    this.h = height || 0;
};

X.Rect.prototype.getPosition = function(){
    return new X.Vector(this.x, this.y);
};

X.Rect.prototype.setPosition = function(position){
    this.x = position.x;
    this.y = position.y;
};
