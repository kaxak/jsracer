/*
Created : 
Authors : TORRES Julien, GINOT Gilles, ROCHE Emmanuel
Description : creer un objet de type Car

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
include('js/Wheel.js');


X.Car = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, x, y, orientation, boundingBox, urlImageCar, urlImageWheel_L, urlImageWheel_R) {
        //* Initialise les propriétés
        _(this, protected);
        //* Appel le super contructeur 
        X.Shape.apply(this, [protected, x, y, boundingBox, urlImageCar]);
        this.setOrientation(orientation);
        /* Propriétés */
        
        /* direction */
        _(this, '-').directionSpeed = 10;
        _(this, '-').direction = 0;
        _(this, '-').directionMAX = 20;
        _(this, '-').state = 0; //0=arret, 1=accelere, 2=freine
        
        _(this, '-').puissance = 160 * 736;//chevaux * 736 = watt
        _(this, '-').masse = 600;//Kg
        _(this, '-').freinage = _(this, '-').puissance * 1;
        
        _(this, '-').coef_friction = _(this, '-').masse * 9.81 * 0.015;
        _(this, '-').coef_drag = 0.5 * 1.2 * 3 * 0.3;//Fx = 1/2 * p * S * Cx * V²
        
        _(this, '-').force = 0;
        _(this, '-').vitesse = 0;
        
        _(this, '-').timerGui = new X.Timer(64);
        
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
        
        _(this, '-').sounds ={};
        _(this, '-').sounds.engine = new Howl({
            loop: true,
            rate: 0.28,
            volume: 0.20,
            urls: ['./assets/Sounds/car-engine-loop.wav']
        });
        _(this, '-').sounds.engine.play();
        
        /* Les Roues */
        //* Roues Avants
        var WheelsParams = {offset: 12, wheelbase: 22};
        
        this.addChild('roueAVG', X.new(X.Wheel, [
                -WheelsParams.offset, -WheelsParams.wheelbase,
                new X.Rect(new X.Vector(-6/2, -12/2), 7, 12),
                urlImageWheel_L,
                true
        ]));
        
        this.addChild('roueAVD', X.new(X.Wheel, [
                WheelsParams.offset, -WheelsParams.wheelbase,
                new X.Rect(new X.Vector(-6/2, -12/2), 7, 12),
                urlImageWheel_R,
                true
        ]));
        //* Roues Arrières
        this.addChild('roueARG', X.new(X.Wheel, [
                -WheelsParams.offset, 0,
                new X.Rect(new X.Vector(-6/2, -12/2), 7, 12),
                urlImageWheel_L,
                false
        ]));
        this.addChild('roueARD', X.new(X.Wheel, [
                WheelsParams.offset, 0,
                new X.Rect(new X.Vector(-6/2, -12/2), 7, 12),
                urlImageWheel_R,
                false
        ]));
        
        this.onUpdate = function(){
            //* Met à jour le chronomètre GUI à chaque tic du timer
            if(_(this, '-').timerGui.isElapsed() && _(this, '-').timeZero !== null){
                X.GUI.speed.setText(_(this, '-').vitesse.toFixed(0)+'pixels/s');
            }
            
            var _binds = _(this, '-').binds;
            
            var direction = X.Vector.Tools.FromAngle(this.orientation+Math.PIO2*3);
            _(this, '-').force = -_getDragForce.call(this)- _getFrictionalForce.call(this); 
            

            if(X.Input.isPressed(_binds.accelerator))
            {   _accelerate.call(this);         }
            if(X.Input.isPressed(_binds.brake))
            {   _brake.call(this);              }
            if((X.Input.isPressed(_binds.turnRight) && X.Input.isPressed(_binds.turnLeft)) 
            || !(X.Input.isPressed(_binds.turnRight) || X.Input.isPressed(_binds.turnLeft)))
            {   _releaseDirection.apply(this);  }
            else
            {   _turn.call(this);               }

            _(this, '-').vitesse += _(this, '-').force / _(this, '-').masse * X.Time.getDelta();
            _(this, '+').position = _(this, '+').position.Add(direction.Multiply(_(this, '-').vitesse * X.Time.getDelta()));
            
            
            if(_(this, '-').vitesse > 8){
                var x = _(this, '-').vitesse;
                var z = _getMaxSpeed.call(this)*1.27;//vitesse max * 1 -> va tout droit
                var co = x-(x*x)/z;
                var o = _(this, '-').direction * co * X.Time.getDelta()*0.001;
                this.setOrientation(this.orientation + o);
            }
            
            _(this, '-').sounds.engine.rate(Math.max(_(this, '-').vitesse/_getMaxSpeed.call(this)*1.6, 0.28));
            if(_(this, '-').vitesse < 0 && (_(this, '-').state === 1 || _(this, '-').state === 2)){
                _(this, '-').vitesse = 0;
                if(_(this, '-').state === 1)
                    _(this, '-').state = 0;
            }
            
            //* gestion sorti d'écran
            if(this.position.x > X.Screen.width) this.position.x -= X.Screen.width;
            else if(this.position.x < 0) this.position.x += X.Screen.width;
            if(this.position.y > X.Screen.height) this.position.y -= X.Screen.height;
            else if(this.position.y < 0) this.position.y += X.Screen.height;
        };
        
        
        
        
//        this.onRender = function(ctx){};
    };
    
    var _getDragForce = function(){
        return _(this, '-').coef_drag * _(this, '-').vitesse * _(this, '-').vitesse;
    };
    var _getFrictionalForce = function(){
        return _(this, '-').coef_friction * _(this, '-').vitesse;
    };
    var _getMaxSpeed = function(){
        //v = (sqrt(4*f*t+r^2)-r)/(2*t)
        var f = _(this, '-').puissance, 
            t = _(this, '-').coef_drag, 
            r = _(this, '-').coef_friction;
        return (Math.sqrt(4*f*t+r*r)-r)/(2*t);
    };
    var _accelerate = function(){
        if(_(this, '-').state === 0 || _(this, '-').state === 2)
            _(this, '-').state = 1;
//        _(this, '-').vitesse += _(this, '-').acceleration * X.Time.getDelta();

        _(this, '-').force += _(this, '-').puissance;
    };
    var _brake = function(){
        if(_(this, '-').state === 1)
            _(this, '-').state = 2;
//        _(this, '-').vitesse -= _(this, '-').freinage * X.Time.getDelta();
        if(_(this, '-').vitesse > 0)
            _(this, '-').force -= _(this, '-').freinage;
    };
    var _turn = function(){
        if(X.Input.isPressed(_(this, '-').binds.turnRight)){
            _(this, '-').direction += _(this, '-').directionMAX * X.Time.getDelta() * _(this, '-').directionSpeed;
            if(_(this, '-').direction > _(this, '-').directionMAX) _(this, '-').direction = _(this, '-').directionMAX;

        }
        if(X.Input.isPressed(_(this, '-').binds.turnLeft)){
            _(this, '-').direction -= _(this, '-').directionMAX * X.Time.getDelta() * _(this, '-').directionSpeed;
            if(_(this, '-').direction < -_(this, '-').directionMAX) _(this, '-').direction = -_(this, '-').directionMAX;
        }
    };
    var _releaseDirection = function(){
        if(_(this, '-').direction > 1){
            _(this, '-').direction -= _(this, '-').directionMAX * X.Time.getDelta() * _(this, '-').directionSpeed;
            if(_(this, '-').direction <= 1) _(this, '-').direction = 0;
        }
        else if(_(this, '-').direction < 1){
            _(this, '-').direction += _(this, '-').directionMAX * X.Time.getDelta() * _(this, '-').directionSpeed;
            if(_(this, '-').direction >= 1) _(this, '-').direction = 0;
        }
    };
    
    var _wheelOnUpdate = function(){
        this.setOrientation(Math.PI/6 * (this.getParent().getDirection() / this.getParent().getDirectionMAX()));
    };
    
    X_object.prototype = X.extend(X.Shape);
    X_object.prototype.getDirection = function(){return _(this, '-').direction;};
    X_object.prototype.getDirectionMAX = function(){return _(this, '-').directionMAX;};
    X_object.prototype.getVitesse = function() {return _(this, '-').vitesse;};
 
    return X.Car = X_object;
};

