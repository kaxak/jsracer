/*
Created : 
Authors : TORRES Julien, GINOT Gilles, ROCHE Emmanuel
Description : creer un objet de type Car

Vmax = sqrt((acceleration - friction moteur)8550. / friction air)

*/

/* global include, X, Howl */

include('js/Node.js');
include('js/Shape.js');
include('js/Vector.js');
include('js/Rect.js');
include('js/lib/tool/Input.js');
include('js/lib/tool/Screen.js');
include('js/lib/tool/Collision.js');
include('js/lib/ext/howler/howler.js').extension = 'js/lib/ext/howler/howler_ext.js';

X.Car = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, x, y, orientation, boundingBox, urlImageCar, urlImageWheel) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Shape.apply(this, [protected, x, y, boundingBox, urlImageCar]);
        this.setOrientation(orientation);
        /* Propriétés */
        _(this, '-').vitesse = 0;
        _(this, '-').coefFrictionMoteur = 5;
        _(this, '-').coefTraine = 0.003;//
        _(this, '-').acceleration = 600;
        _(this, '-').freinage = 300;
        _(this, '-').direction = 0;
        _(this, '-').directionMAX = 20;
        _(this, '-').state = 0; //0=arret, 1=accelere, 2=freine
        
        _(this, '-').binds = {};
        _(this, '-').binds.accelerator = {
            keyboard:['z','up'],
            gamepads:{
                0:['A']
            },
            mouse:[]
        };
        _(this, '-').binds.brake = {
            keyboard:['s','down'],
            gamepads:{
                0:['B']
            },
            mouse:[]
        };
        _(this, '-').binds.turnLeft = {
            keyboard:['q','left'],
            gamepads:{
                0:['DLEFT']
            },
            mouse:[]
        };
        _(this, '-').binds.turnRight = {
            keyboard:['d','right'],
            gamepads:{
                0:['DRIGHT']
            },
            mouse:[]
        };
        
        /* Les Roues */
        //* Roues Avants
        WheelsParams = {offset: 12, wheelbase: 22};
        this.addChild('roueAVG', X.new(X.Shape, [
                -WheelsParams.offset, -WheelsParams.wheelbase,
                new X.Rect(new X.Vector(-6/2, -12/2), 6, 12),
                urlImageWheel
        ])).onUpdate = _wheelOnUpdate;
        this.addChild('roueAVD', X.new(X.Shape, [
            WheelsParams.offset, -WheelsParams.wheelbase,
            new X.Rect(new X.Vector(-6/2, -12/2), 6, 12),
            urlImageWheel
        ])).onUpdate = _wheelOnUpdate;
        //* Roues Arrières
        this.addChild('roueARG', X.new(X.Shape, [
                -WheelsParams.offset, 0,
                new X.Rect(new X.Vector(-6/2, -12/2), 6, 12),
                urlImageWheel
        ]));
        this.addChild('roueARD', X.new(X.Shape, [
                WheelsParams.offset, 0,
                new X.Rect(new X.Vector(-6/2, -12/2), 6, 12),
                urlImageWheel
        ]));
        
        this.onUpdate = function(){
            var direction = X.Vector.Tools.FromAngle(this.orientation+Math.PIO2*3);
            var _binds = _(this, '-').binds;

            if(X.Input.isPressed(_binds.accelerator)){
                if(_(this, '-').state === 0 || _(this, '-').state === 2)
                    _(this, '-').state = 1;
                _(this, '-').vitesse += _(this, '-').acceleration * X.Time.getDelta();
            }
            if(X.Input.isPressed(_binds.brake)){
                if(_(this, '-').state === 1)
                    _(this, '-').state = 2;
                _(this, '-').vitesse -= _(this, '-').freinage * X.Time.getDelta();

            }
            

            if((X.Input.isPressed(_binds.turnRight) && X.Input.isPressed(_binds.turnLeft)) || !(X.Input.isPressed(_binds.turnRight) || X.Input.isPressed(_binds.turnLeft))){
                _releaseDirection.apply(this);
                
            }
            else{
                if(X.Input.isPressed(_binds.turnRight)){
                    _(this, '-').direction += _(this, '-').directionMAX * X.Time.getDelta() * 10;
                    if(_(this, '-').direction > _(this, '-').directionMAX) _(this, '-').direction = _(this, '-').directionMAX;

                }
                if(X.Input.isPressed(_binds.turnLeft)){
                    _(this, '-').direction -= _(this, '-').directionMAX * X.Time.getDelta() * 10;
                    if(_(this, '-').direction < -_(this, '-').directionMAX) _(this, '-').direction = -_(this, '-').directionMAX;
                }
            }

            if(_(this, '-').vitesse > 0.1)
                _(this, '-').vitesse -= _(this, '-').coefFrictionMoteur * X.Time.getDelta();
            if(_(this, '-').vitesse > 0.1)
                _(this, '-').vitesse -= _(this, '-').vitesse * _(this, '-').vitesse * _(this, '-').coefTraine * X.Time.getDelta();

            this.position = this.position.Add(direction.Multiply(_(this, '-').vitesse * X.Time.getDelta()));
            if(_(this, '-').vitesse > 8){
                var x = _(this, '-').vitesse;
                var z = 435*1.3;//vitesse max * 2
                var co = x-(x*x)/z;
                co *= 0.001;
                var coMini =  _(this, '-').vitesse * 0.01;//mini handling
                var o = _(this, '-').direction * co * X.Time.getDelta();
                this.setOrientation(this.orientation + o);
            }


            if(_(this, '-').vitesse < 0 && (_(this, '-').state === 1 || _(this, '-').state === 2)){
                _(this, '-').vitesse = 0;
                if(_(this, '-').state === 1)
                    _(this, '-').state = 0;
            }


            if(this.position.x > X.Screen.width) this.position.x -= X.Screen.width;
            else if(this.position.x < 0) this.position.x += X.Screen.width;
            if(this.position.y > X.Screen.height) this.position.y -= X.Screen.height;
            else if(this.position.y < 0) this.position.y += X.Screen.height;
        };
        
        
        
        
//        this.onRender = function(ctx){};
    };
    
    var _wheelOnUpdate = function(){
        this.setOrientation(Math.PI/6 * (this.getParent().getDirection() / this.getParent().getDirectionMAX()));
    };
    
    var _releaseDirection = function(){
        if(_(this, '-').direction > 1){
            _(this, '-').direction -= _(this, '-').directionMAX * X.Time.getDelta() * 10;
            if(_(this, '-').direction <= 1) _(this, '-').direction = 0;
        }
        else if(_(this, '-').direction < 1){
            _(this, '-').direction += _(this, '-').directionMAX * X.Time.getDelta() * 10;
            if(_(this, '-').direction >= 1) _(this, '-').direction = 0;
        }
    };
    
    X_object.prototype = X.extend(X.Shape);
    X_object.prototype.getDirection = function(){return _(this, '-').direction;};
    X_object.prototype.getDirectionMAX = function(){return _(this, '-').directionMAX;};
 
    return X.Car = X_object;
};

