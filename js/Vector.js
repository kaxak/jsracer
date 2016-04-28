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
Math.PIO2 = Math.PI / 2;

/* global include, X */

X.Vector = function(x,y){
    this.x = (x)?x:0;
    this.y = (y)?y:0;
};


X.Vector.prototype.Add = function(vector){
    return new X.Vector(this.x + vector.x, this.y + vector.y);
};

X.Vector.prototype.Sub = function(vector){
    return new X.Vector(vector.x - this.x, vector.y - this.y);
};

X.Vector.prototype.Multiply = function(nombre){
    return new X.Vector(this.x * nombre, this.y * nombre);
};

X.Vector.prototype.Divide = function(nombre){
    nombre = 1 / nombre;//inverse
    return new X.Vector(this.x * nombre, this.y * nombre);
};

X.Vector.prototype.Reverse = function(){
    return new X.Vector(-this.x, -this.y);
};

X.Vector.prototype.Length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

X.Vector.prototype.Determinant = function(vector){
    //Déterminant : d = D_x*T_y - D_y*T_x
    return this.x*vector.y - this.y*vector.x;
};

X.Vector.prototype.Scalar = function(vector){
    //dot = (a.x * b.x) + (a.y * b.y)
    return this.x*vector.x + this.y*vector.y;
};

X.Vector.prototype.Normalize = function(){
    //Normalize = Vector * 1/ Vector.Length
    return this.Multiply(1/this.Length());
};

X.Vector.prototype.Normale = function(){
    return new X.Vector(this.y, -this.x);
};

X.Vector.prototype.toString = function(round){
    round = round | 8;
    return 'x='+this.x.toFixed(round)+', y='+this.y.toFixed(round);
};

/*Experimental*/
X.Vector.prototype.render = function(ctx, xy, scale, color){
    var x = 0, y = 0;
    if(xy === 'x'){
        x = this.Length() * scale;
    }
    else if(xy === 'y'){
        y = this.Length() * scale;
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
X.Vector.prototype.testRebond = function(normal){
    var pscal = this.Scalar(normal);
    var r = new X.Vector();
    r.x = this.x-2*pscal*normal.x;
    r.y = this.y-2*pscal*normal.y;
    return r;
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

 