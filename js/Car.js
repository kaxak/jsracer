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
include('js/Timer.js');

include('js/lib/tool/Input.js');
include('js/lib/tool/Screen.js');
include('js/lib/tool/Collision.js');
include('js/lib/tool/Time.js');
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
        _(this, '-').directionSpeed = 20;
        _(this, '-').direction = 0;
        _(this, '-').directionMAX = 20;
        
        _(this, '+').enum_state = {
            stopped:0,
            accelerate:1,
            brake:2,
            engineBrake:3,
            rew_accelerate:4,
            rew_brake:5,
            rew_engineBrake:6
        };
        Object.freeze(_(this, '+').enum_state);
        _(this, '-').state = _(this, '+').enum_state.stopped; //0=arret, 1=accelere, 2=freine
        _(this, '-').timerToSwitchForwRew = new X.Timer(500, false);
        
        _(this, '-').power = 260 * 736;//chevaux * 736 = watt
        _(this, '-').masse = 600;//Kg
        _(this, '-').braking = _(this, '-').power * 1;
        
        _(this, '-').weight = _(this, '-').masse * 9.81;
        _(this, '-').coef_friction = 0.015;
        _(this, '-').coef_turn = 0.03;
        _(this, '-').coef_friction_total = 0;
        _(this, '-').grass_friction_penality = 0.03;
        _(this, '-').coef_drag = 0.5 * 1.2 * 3 * 0.3;//Fx = 1/2 * p * S * Cx * V²
        
        _(this, '-').force = 0;
        _(this, '-').speed = 0;
        _(this, '-').default_grip = 0.7;
        _(this, '-').grass_grip_penality = 0.5;
        //* recalculate
        _(this, '-').grass_grip_penality = _(this, '-').default_grip *  _(this, '-').grass_grip_penality  /4;
        
        _(this, '-').timerGui = new X.Timer(30, true);
        _(this, '-').timerGui.start();
        
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
                0:['B', 'X']
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
        _(this, '-').binds.debug = {
            keyboard:['space']
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
                X.GUI.speed.setText(_(this, '-').speed.toFixed(0)+'pixels/s');
            }
            
            var _tileMap = this.getRoot().getChilds()['circuit'];
            _(this, '-').coef_friction_total = _(this, '-').coef_friction;
            _(this, '-').grip = _(this, '-').default_grip;

            
            if(_tileMap.getTypeAtPosition(_(this, '#').childs['roueAVG'].gposition) === 'grass'){
                _(this, '-').coef_friction_total += _(this, '-').grass_friction_penality;
                _(this, '-').grip -= _(this, '-').grass_grip_penality;
//                console.log('roueAVG in grass');
            }
            if(_tileMap.getTypeAtPosition(_(this, '#').childs['roueAVD'].gposition) === 'grass'){
//                console.log('roueAVD in grass');
                _(this, '-').coef_friction_total += _(this, '-').grass_friction_penality;
                _(this, '-').grip -= _(this, '-').grass_grip_penality;
            }
            if(_tileMap.getTypeAtPosition(_(this, '#').childs['roueARG'].gposition) === 'grass'){
//                console.log('roueARG in grass');
                _(this, '-').coef_friction_total += _(this, '-').grass_friction_penality;
                _(this, '-').grip -= _(this, '-').grass_grip_penality;
            }
            if(_tileMap.getTypeAtPosition(_(this, '#').childs['roueARD'].gposition) === 'grass'){
//                console.log('roueARD in grass');
                _(this, '-').coef_friction_total += _(this, '-').grass_friction_penality;
                _(this, '-').grip -= _(this, '-').grass_grip_penality;
            }
            
            var _binds = _(this, '-').binds;
            
            var direction = X.Vector.Tools.FromAngle(this.orientation+Math.PIO2*3);
            _(this, '-').force = -_getDragForce.call(this)- _getFrictionalForce.call(this); 
            
            //* input avancer
            if(X.Input.isPressed(_binds.accelerator) && !X.Input.isPressed(_binds.brake)){
                switch(_(this, '-').state){
                    case _(this, '+').enum_state.stopped:
                    case _(this, '+').enum_state.engineBrake:
                    case _(this, '+').enum_state.brake:
                        _setState.call(this, _(this, '+').enum_state.accelerate);
                        break;
                    case _(this, '+').enum_state.rew_engineBrake:
                    case _(this, '+').enum_state.rew_accelerate:
                        _setState.call(this, _(this, '+').enum_state.rew_brake);
                        break;
                }
            }
            //* input freiner
            else if(!X.Input.isPressed(_binds.accelerator) && X.Input.isPressed(_binds.brake)){
                switch(_(this, '-').state){
                    case _(this, '+').enum_state.stopped:
                        if(!_(this, '-').timerToSwitchForwRew.isRunning())
                            _(this, '-').timerToSwitchForwRew.start();
                        else if(_(this, '-').timerToSwitchForwRew.isElapsed())
                            _setState.call(this, _(this, '+').enum_state.rew_accelerate);
                        break;
                    case _(this, '+').enum_state.accelerate:
                    case _(this, '+').enum_state.engineBrake:
                        _setState.call(this, _(this, '+').enum_state.brake);
                        break;
                    case _(this, '+').enum_state.rew_brake:
                    case _(this, '+').enum_state.rew_engineBrake:
                        _setState.call(this, _(this, '+').enum_state.rew_accelerate);
                        break;
                }
            }
            //* sinon
            else{
                if(_(this, '-').timerToSwitchForwRew.isRunning())
                    _(this, '-').timerToSwitchForwRew.stop();
                switch(_(this, '-').state){
                    case _(this, '+').enum_state.stopped:
                        break;
                    case _(this, '+').enum_state.accelerate:
                    case _(this, '+').enum_state.brake:
                        _setState.call(this, _(this, '+').enum_state.engineBrake);
                        break;
                    case _(this, '+').enum_state.rew_accelerate:
                    case _(this, '+').enum_state.rew_brake:
                        _setState.call(this, _(this, '+').enum_state.rew_engineBrake);
                        break;
                }
            }

            
            switch(_(this, '-').state){
                case _(this, '+').enum_state.stopped:
                    break;
                case _(this, '+').enum_state.accelerate:
                case _(this, '+').enum_state.rew_accelerate:
                    _accelerate.call(this);
                    break;
                case _(this, '+').enum_state.brake:
                case _(this, '+').enum_state.rew_brake:
                    _brake.call(this);
                    break;
                
            }
            
            if((X.Input.isPressed(_binds.turnRight) && X.Input.isPressed(_binds.turnLeft)) 
            || !(X.Input.isPressed(_binds.turnRight) || X.Input.isPressed(_binds.turnLeft)))
            {   _releaseDirection.apply(this);  }
            else
            {   _turn.call(this);               }

            _(this, '-').speed += _(this, '-').force / _(this, '-').masse * X.Time.getDelta();
            
            
            var o;
            if(_(this, '-').speed > 1){
                var x = _(this, '-').speed;
                var vmax = _getMaxSpeed.call(this)*1.2;//vitesse max * 1 -> va tout droit à fond
                var co = (x-(x*x)/vmax) / (1/_(this, '-').grip);
                o = _(this, '-').direction * co * X.Time.getDelta()*0.001;
                
            }
            else{
                _setState.call(this, _(this, '+').enum_state.stopped);
                _(this, '-').speed = 0;
            }
            //* Si l'état est > 3 c'est qu'on est en marche arrière
            if(_(this, '-').state > 3){
                var vmaxO2 = _getMaxSpeed.call(this)/2;
                if(_(this, '-').speed > vmaxO2) _(this, '-').speed = vmaxO2;
                this.setOrientation(this.orientation - o);
                _(this, '+').position = _(this, '+').position.Add(direction.Multiply(-_(this, '-').speed * X.Time.getDelta()));
            }
            else{
                this.setOrientation(this.orientation + o);
                _(this, '+').position = _(this, '+').position.Add(direction.Multiply(_(this, '-').speed * X.Time.getDelta()));
            }
            
            _(this, '-').sounds.engine.rate(Math.max(_(this, '-').speed/_getMaxSpeed.call(this)*1.6, 0.28));
            
            //* gestion sorti d'écran
            if(this.position.x > X.Screen.width) this.position.x -= X.Screen.width;
            else if(this.position.x < 0) this.position.x += X.Screen.width;
            if(this.position.y > X.Screen.height) this.position.y -= X.Screen.height;
            else if(this.position.y < 0) this.position.y += X.Screen.height;
        };
        
        
        
        
//        this.onRender = function(ctx){};
    };
    
    var _setState = function(state){
        if(_(this, '-').state !== state){
//            console.info('car changing state to -> '+state+' ('+X.Time.getElapseTime()+')')
            _(this, '-').state = state;
        }
    };
    
    var _getDragForce = function(){
        return _(this, '-').coef_drag * _(this, '-').speed * _(this, '-').speed;
    };
    var _getFrictionalForce = function(){
        var turn = (_(this, '-').direction / _(this, '-').directionMAX) *_(this, '-').coef_turn;
        turn = Math.max(turn, -turn);
        return _(this, '-').weight * (_(this, '-').coef_friction_total + turn) * _(this, '-').speed;
    };
    var _getMaxSpeed = function(){
        //v = (sqrt(4*f*t+r^2)-r)/(2*t)
        var f = _(this, '-').power, 
            t = _(this, '-').coef_drag, 
            r = _(this, '-').coef_friction;
        return (Math.sqrt(4*f*t+r*r)-r)/(2*t);
    };
    var _accelerate = function(){
        _(this, '-').force += _(this, '-').power;
    };
    var _brake = function(){
        _(this, '-').force -= _(this, '-').braking;
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
    
    X_object.prototype = X.extend(X.Shape);
    X_object.prototype.getDirection = function(){return _(this, '-').direction;};
    X_object.prototype.getDirectionMAX = function(){return _(this, '-').directionMAX;};
    X_object.prototype.getVitesse = function() {return _(this, '-').speed;};
    X_object.prototype.getState = function() {return _(this, '-').state;};
    X_object.prototype.soundsPlay = function() { _(this, '-').sounds.engine.play(); };
    X_object.prototype.soundsStop = function() { _(this, '-').sounds.engine.stop(); };
    X_object.prototype.setCarOpacity = function(value) {
        this.opacity = value;
        this.getChilds().roueAVG.setOpacity(value);
        this.getChilds().roueAVD.setOpacity(value);
        this.getChilds().roueARG.setOpacity(value);
        this.getChilds().roueARD.setOpacity(value);
    };
 
    return X.Car = X_object;
};
