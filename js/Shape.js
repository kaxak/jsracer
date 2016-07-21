/*
Created : 
Authors : ROCHE Emmanuel
Description : prototype d'un acteur simple ayant une texture
*/

/* global include, X, Image */

include('js/Node.js');
include('js/Vector.js');
include('js/Rect.js');

X.Shape = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, x, y, boundingBox, urlImage) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Node.apply(this, [protected, new X.Vector(x, y), 0, new X.Vector(1, 1)]);
        
        //* Propriétés
        _(this, '#').boundingBox = boundingBox || new X.Rect(new X.Vector(0, 0), 0, 0);
        _(this, '#').image = new Image();
        _(this, '#').image.src = urlImage;
        _(this, '#').opacity = 1.0;
        _(this, '+').localePosition = new X.Vector(0, 0);
        
        this.onRender = function(ctx){
            var _image = _(this, '#').image;
            var _boundingBox = _(this, '#').boundingBox;
            ctx.globalAlpha = _(this, '#').opacity;
            ctx.drawImage(_image, //image
                0, 0, //sx, sy
                _boundingBox.w, _boundingBox.h, //swidth, sheight
                _boundingBox.x, _boundingBox.y, //x, y
                _boundingBox.w, _boundingBox.h);//width, height

            ctx.globalAlpha = 1;
            
            if(X.Shape.drawBoudningBox){
                ctx.strokeStyle = 'rgba(255,0,0,1.0)';
                ctx.lineWidth = 1;
    //            ctx.fillStyle = 'rgba(0,0,0,0.0)';
                ctx.beginPath();
                ctx.rect(_boundingBox.x, _boundingBox.y, _boundingBox.w, _boundingBox.h);
                ctx.closePath();
    //            ctx.fill();
                ctx.stroke();
            }
        };
    };
    
    X_object.prototype = X.extend(X.Node);
    
    X_object.prototype.getBoundingBox = function(){ return _(this, '#').boundingBox; };
    
    X_object.prototype.drawBoudningBox = false;//static
    
    X_object.prototype.getOpacity = function(){
        return _(this, '#').opacity;
    };
    
    X_object.prototype.setOpacity = function(value){
        if(value > 1) _(this, '#').opacity = 1;
        else if(value < 0) _(this, '#').opacity = 0;
        else _(this, '#').opacity = value;
    };
 
    return X.Shape = X_object;
};

