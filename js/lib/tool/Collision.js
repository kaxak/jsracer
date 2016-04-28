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
include('js/Rect.js');

X.Collision = new function() {
    this.dotInAABB = function(X_Vector_Dot, X_Rect_AAB){
        if(!(X_Vector_Dot instanceof X.Vector && X_Rect_AAB instanceof X.Rect)){
            throw new Error('X.Collision.dotInAABB: Bad arguments passed!');
        }
        if(X_Vector_Dot.x > X_Rect_AAB.x + X_Rect_AAB.w) return false;
        if(X_Vector_Dot.x < X_Rect_AAB.x) return false;
        if(X_Vector_Dot.y > X_Rect_AAB.y + X_Rect_AAB.h) return false;
        if(X_Vector_Dot.y < X_Rect_AAB.y) return false;
        return true;
    };
//    this.onUpdate = function(boxColliderA, boxColliderB){
//            var b = controled_shape.getBoundingBox();
//            var p = controled_shape.position;
//            controled_shape.boxCollider = new SAT.Box(new SAT.Vector(p.x, p.y), b.w, b.h).toPolygon();
//            controled_shape.boxCollider.setOffset(b.getPosition());
//            controled_shape.boxCollider.setAngle(controled_shape.orientation);
//
//            b = fixed_shape.getBoundingBox();
//            p = fixed_shape.position;
//            fixed_shape.boxCollider = new SAT.Box(new SAT.Vector(p.x, p.y), b.w, b.h).toPolygon();
//            fixed_shape.boxCollider.setOffset(b.getPosition());
//            fixed_shape.boxCollider.setAngle(fixed_shape.orientation);
//
//            var result = new SAT.Response();
//            if(SAT.testPolygonPolygon(controled_shape.boxCollider, fixed_shape.boxCollider, result)){
//                controled_shape.index = 1;
//                fixed_shape.index = 1;
//            }
//            else{
//                controled_shape.index = 0;
//                fixed_shape.index = 0;
//            }
//        };
    
    
}();