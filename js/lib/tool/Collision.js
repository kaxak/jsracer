/*
Created : 03/03/16
Authors : GINOT Gilles
Description : test de collision

https://en.wikipedia.org/wiki/Hyperplane_separation_theorem
http://www.gamedev.net/page/reference/index.html/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
http://xnatd.blogspot.fr/2012/05/2d-collision-series-sat-part-1.html
*/

/* global include, X */

include('js/Vector.js');

X.Collision = function() {
    /* Properties */
    
    
    
    /* Méthodes */
    this.isInCollisionWith = function(collider, otherCollider) {
        
        //if (typeof collider == 'object' && typeof otherCollider == 'object') {
            var boxCollider = this.setCarBoxCollider(collider);
            var otherBoxCollider = this.setCarBoxCollider(otherCollider)
            
            return!((boxCollider.bottom  <  otherBoxCollider.top  ) || ( boxCollider.top > otherBoxCollider.bottom)
                    || (boxCollider.right < otherBoxCollider.left ) || (boxCollider.left > otherBoxCollider.right));
        //}
    };
    
    this.setCarBoxCollider = function(collider) {
        var boxCollider = {};
        boxCollider['bottom'] = new X.Vector(collider.position.x - 14, collider.position.y - 14);
        
        boxCollider['top'] = new X.Vector(collider.position.x + Math.sin(collider.orientation) * 30 ,
                                          collider.position.y - Math.cos(collider.orientation) * 30);
                                          
        boxCollider['left'] = new X.Vector(collider.position.x - Math.cos(1.50) - (collider.width/2),
                                           collider.position.y - Math.cos(1.50) - (collider.width/2));
                                           
        boxCollider['right'] = new X.Vector(collider.position.x - Math.sin(1.50) - (collider.width/2),
                                            collider.position.y - Math.sin(1.50) - (collider.width/2));
                                            
        return boxCollider;
    }
    
    this.isInScreen = function(collider) {
        
        if(collider.position.x > 0 && collider.position.y > 0
            && collider.position.x < X.Screen.width 
            && collider.position.y < X.Screen.height) {
            return true;
        }
        else {
            return false;
        }
    }
    
    /* Accessors */
      
    
    
    /* Initialisation (contructor) */
    
        
    
    
};

X.Collision = new X.Collision();