/*
Created : 23/02/2016
Authors : ROCHE Emmanuel
Description :
    Node d'un scène. Les acteurs d'une scène doivent hérité de ce prototype.
Todo :
    -méthode pour récupérer la position global dans la scène.
*/

/* global include, X */

include('js/Vector.js');

X.Node = function () {
    
    var _ = X.class.propertiesGetter();
    
    var X_object = function(protected, position, orientation, scale) {
        //* Initialise les propriétés
        _(this, protected);
        
        //* Propriétés
        _(this, '-').parent = null;
        _(this, '-').childs = {};
        _(this, '+').position = position || new X.Vector(0, 0);
        _(this, '+').orientation = orientation || 0;
        _(this, '+').scale = scale || new X.Vector(1, 1);
        if(X.Node.showHotSpot === undefined){
            X.Node.showHotSpot = false;
        }
        
        /**
         * Méthode virtuelle qu'il faudrat surcharger dans les objet enfants.
         * @param {CanvasRenderingContext2D} ctx : contexte de dessins 2D du canvas.
         */
        this.onRender = function(ctx){};
        /**
         * Méthode virtuelle pour mettre à jour les données de l'acteur.
         */
        this.onUpdate = function(){};
    };
    
    /**
     * Ajoute un Node aux enfants.
     * @param {string} name : nom du Node.
     * @param {Node} node : Node à ajouter.
     * @returns {Node} : Le Node ajouté ou false en cas d'erreur.
     */
    X_object.prototype.addChild = function(name, node){
        var _childs = _(this, '-').childs;
        
        if(arguments.length === 2){
            if(node instanceof X.Node){
                console.log('[Info] X.Node.addChild() : '+name);
                _childs[name] = node;
                _childs[name].setParent(this);
                _childs[name].name = name;
                return _childs[name];
            }
            throw new Error('X.Node.addChild() : The Node '+name+' is not a valid instance of Node');
        return false;
        }
        throw new Error('X.Node.addChild() : X.Node requiert 2 arguments ('+arguments.length+' argument(s) passed!)');
        return false;
            
    };
    
    
    /**
     * Positionne le canvas en fonction de ce Node, appel cette méthode sur les Node enfants puis dessine l'acteur ( this.localRender(ctx); ).
     * @param {CanvasRenderingContext2D} ctx : contexte de dessins 2D du canvas.
     */
    X_object.prototype.render = function(ctx){
        //* Positionne le contexte
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.orientation);
        ctx.scale(this.scale.x, this.scale.y);
        
        //* Appel de render sur chaque enfants
        var _childs = _(this, '-').childs;
        for(var key in _childs){
            _childs[key].render(ctx);
        }
        
        //* Dessine l'acteur
        this.onRender(ctx);
        
        //* Dessine le point et l'orientation du Node
        if(X.Node.showHotSpot === true){
            ctx.strokeStyle = 'rgba(20,20,20,1.0)';
            ctx.lineWidth = 1;
            ctx.fillStyle = 'rgba(255,255,0,1.0)';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, 2*Math.PI, true);
            ctx.lineTo(10 ,0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    };
   
    
    /**
     * Met à jour les données de l'acteur et appel cette méthode sur les Node enfants.
     */
    X_object.prototype.update = function(){
        this.onUpdate();

        var _childs = _(this, '-').childs;
        for(var key in _childs){
            _childs[key].update();
        }
    };
    
    X_object.prototype.getParent = function(){
        return _(this, '-').parent;
    };
    X_object.prototype.setParent = function(parentNode){
        _(this, '-').parent = parentNode;
    };
    
    X_object.prototype.getChilds = function(){
        return _(this, '-').childs;
    };
    
    X_object.prototype.getPosition = function(){
        return _(this, '+').position;
    };
    
    /**
    * Retourne la position globale depuis le node racine
    * @param {node} node : node dont on veut la position globale
    * @returns {Vector} globalPosition : position globale du node
    */
    X_object.prototype.getGlobalPosition = function(node){
        
//        if(node instanceof X.Node){
//            throw new Error('X.Node.getGlobalPosition : node is not a instance of X.Node');
//        }
        
        var globalPosition = new X.Vector(node.getPosition().x,node.getPosition().y);
        var actualNode = node;
        
        while(actualNode.getParent() !== null){
            actualNode = actualNode.getParent();
            globalPosition = globalPosition.Add(actualNode.getPosition());
        }
        
        return globalPosition;
    };
    
    X_object.prototype.getOrientation = function(){
        return _(this, '+').orientation;
    };
    X_object.prototype.setOrientation = function(orientation){
        if(orientation > Math.PI2 || orientation < 0){
            orientation -= Math.floor(orientation/Math.PI2) * Math.PI2;
        }
        if(!isNaN(orientation))
            _(this, '+').orientation = orientation;
    };
    
    X_object.prototype.getScale = function(){
        return _(this, '+').scale;
    };
    
    X_object.showHotSpot = false;
 
    return X.Node = X_object;
};