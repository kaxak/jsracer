/*
Created : 2013
Authors : ROCHE Emmanuel
Description :
    Représente un vecteur et permet de faire des opérations entre vecteur.
    Le haut est -y et c'est aussi l'angle 0°. +x angle 90°. +y 180°. -x 270°

aide :
-http://openclassrooms.com/courses/les-shaders-en-glsl/les-vecteurs-3
-http://openclassrooms.com/courses/theorie-des-collisions/formes-plus-complexes
*/

Math.PI2 = Math.PI * 2;

/* global include, X */

X.Vector = function(x,y){
    var _this = this;
    _this.x, _this.y;
    
    this.Add = function(vector){
        return new X.Vector(_this.x + vector.x, _this.y + vector.y);
    };
    
    this.Sub = function(vector){
        return new X.Vector(vector.x - _this.x, vector.y - _this.y);
    };
    
    this.Multiply = function(nombre){
        return new X.Vector(_this.x * nombre, _this.y * nombre);
    };
    
    this.Divide = function(nombre){
        nombre = 1 / nombre;//inverse
        return new X.Vector(_this.x * nombre, _this.y * nombre);
    };
    
    this.Reverse = function(nombre){
        return new X.Vector(-_this.x, -_this.y);
    };
    
    this.Length = function(){
        return Math.sqrt(_this.x * _this.x + _this.y * _this.y);
    };
    
    this.Determinant = function(vector){
        //Déterminant : d = D_x*T_y - D_y*T_x
        return _this.x*vector.y - _this.y*vector.x;
    };
    
    this.Scalar = function(vector){
        //dot = (a.x * b.x) + (a.y * b.y)
        return _this.x*vector.x + _this.y*vector.y;
    };
    
    this.Normalize = function(){
        //Normalize = Vector * 1/ Vector.Length
        return _this.Multiply(1/_this.Length());
    };
    
    this.Normale = function(){
        return new X.Vector(_this.y, -_this.x);
    };
    
    /*Experimental*/
    this.render = function(ctx, xy, scale, color){
        var x = 0, y = 0;
        if(xy === 'x'){
            x = _this.Length() * scale;
        }
        else if(xy === 'y'){
            y = _this.Length() * scale;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
//        ctx.fillStyle = 'rgba(255,255,0,1.0)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.closePath();
//        ctx.fill();
        ctx.stroke();
    };
    
    /*
    Vecteur CalculerVecteurV2(Vecteur v,Vecteur N){
        Vecteur v2;
        float pscal = (v.x*N.x +  v.y*N.y);
        v2.x = v.x -2*pscal*N.x;
        v2.y = v.y -2*pscal*N.y;
        return v2;
    }
    */
    this.testRebond = function(normal){
        var pscal = _this.Scalar(normal);
        var r = new X.Vector();
        r.x = _this.x-2*pscal*normal.x;
        r.y = _this.y-2*pscal*normal.y;
        return r;
    };
    
    this.toString = function(round){
        round = round | 8;
        return 'x='+_this.x.toFixed(round)+', y='+_this.y.toFixed(round);
    };
    
    /* Constructeur */
    _this.x = (x)?x:0;
    _this.y = (y)?y:0;
};

/* static paramètres */
X.Vector.Params = {};
//!\Experimental//* Indique la direction du haut. Requiert un vecteur normalisé.
X.Vector.Params.top = new X.Vector(1, 0);//* direction par défaut (angle 0) +x

/* static tools */
X.Vector.Tools = {};
X.Vector.Tools.FromAngle = function(angle){
    return new X.Vector(Math.cos(angle), Math.sin(angle));
};

X.Vector.Tools.ToAngle = function(vector){
    return Math.acos(X.Vector.Params.top.Scalar(vector));
};

 