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
    
    var Node = function(protected, position, orientation, scale) {
        //* Initialise les propriétés
        _(this, protected);
        
        //* Propriétés
        _(this, '#').name = 'root';
        _(this, '#').parent = null;
        _(this, '#').childs = {};
        _(this, '+').position = position || new X.Vector(0, 0);
        _(this, '+').orientation = orientation || 0;
        _(this, '+').scale = scale || new X.Vector(1, 1);
        
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
    Node.prototype.addChild = function(name, node){
        var _childs = _(this, '#').childs;
        
        if(arguments.length === 2){
            if(node instanceof X.Node){
                console.log('[Info] X.Node.addChild() : '+name);
                
//                node.setParent(this);
                _(node, '#').parent = this;
                _(node, '#').name = name;
//                node.name = name;

                _childs[name] = node;
                return _childs[name];
            }
            throw new Error('X.Node.addChild() : The Node '+name+' is not a valid instance of Node');
        }
        throw new Error('X.Node.addChild() : X.Node requiert 2 arguments ('+arguments.length+' argument(s) passed!)');
            
    };
    
    
    /**
     * Positionne le canvas en fonction de ce Node, appel cette méthode sur les Node enfants puis dessine l'acteur ( this.localRender(ctx); ).
     * @param {CanvasRenderingContext2D} ctx : contexte de dessins 2D du canvas.
     */
    Node.prototype.render = function(ctx){
        //* Positionne le contexte
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.orientation);
        ctx.scale(this.scale.x, this.scale.y);
        
        //* Appel de render sur chaque enfants
        var _childs = _(this, '#').childs;
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
    Node.prototype.update = function(){
        this.onUpdate();

        var _childs = _(this, '#').childs;
        for(var key in _childs){
            _childs[key].update();
        }
    };
    
    Node.prototype.getName = function(){
        _(this, '#').name;
    };
    
    Node.prototype.getParent = function(){
        return _(this, '#').parent;
    };
    Node.prototype.setParent = function(parentNode){
        _(this, '#').parent = parentNode;
    };
    
    Node.prototype.getChilds = function(){
        return _(this, '#').childs;
    };
    
    Node.prototype.getPosition = function(){
        return _(this, '+').position;
    };
    
    /**
    * Retourne la position globale depuis le node racine
    * @returns {Vector} globalPosition : position globale du node
    */
    Node.prototype.getGlobalPosition = function(){
        var globalPosition = this.getPosition();
        var actualNode = this;
        
        while(actualNode.getParent() !== null){
            actualNode = actualNode.getParent();
            globalPosition = globalPosition.Add(actualNode.getPosition());
        }
        
        return globalPosition;
    };
    
    Node.prototype.getOrientation = function(){
        return _(this, '+').orientation;
    };
    Node.prototype.setOrientation = function(orientation){
        if(orientation > Math.PI2 || orientation < 0){
            orientation -= Math.floor(orientation/Math.PI2) * Math.PI2;
        }
        if(!isNaN(orientation))
            _(this, '+').orientation = orientation;
    };
    
    Node.prototype.getScale = function(){
        return _(this, '+').scale;
    };
    Node.prototype.getRoot = function(){
        var current = this;
        while(current.getParent() !== null){
            current = current.getParent();
        }
        return current;
    };
    
    Node.showHotSpot = false;
 
    return X.Node = Node;
};