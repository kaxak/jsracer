/* global Vector, Node, Screen, Input, Time, include */

include('js/lib/Time.js');

if(Assets == undefined){
    var Assets = {Scenes:{}};
}

var Shape = function(){
    this.base = Node;
    this.base(new Vector(50, 50), 0, new Vector(1, 1));
    this.direction = new Vector(5, 0);
    var _image = new Image();
    this.width = 100;
    this.height = 100;
    
    
    
    
    _image.src = '/assets/textures/slow.png';
    
    this.update = function(){
        Time.update();
        var time = Time.getElapseTime();
        var chrono = document.getElementById('chrono');
        chrono.innerHTML = Time.displayTime(time);
        
        /*if (Input.isKeyPress('d') && this.position.x < (Screen.width - _image.width) ) {
            this.direction.x = 4;
            this.direction.y = 0;
            this.position = this.position.Add(this.direction)
            
        }
        if (Input.isKeyPress('q') && this.position.x > 0 ) {
            this.direction.x = -4;
            this.direction.y = 0;
            this.position = this.position.Add(this.direction);
        }
        if (Input.isKeyPress('s') && this.position.y < (Screen.height - _image.height) ) {
            this.direction.y = 4;
            this.direction.x = 0;
            this.position = this.position.Add(this.direction);
        }
        if (Input.isKeyPress('z') && this.position.y > 0  ) {
            this.direction.y = -4;
            this.direction.x = 0;
            this.position = this.position.Add(this.direction);
        }*/
        
        /*if(this.position.x > Screen.width || this.position.x < 0){
            this.direction.x = -this.direction.x;
        }
        this.position.x = this.position.x + this.direction.x*/
    }
    
    this.draw = function(ctx){
        //ctx.save();
        //ctx.translate(_bananas[i].position().x, _bananas[i].position().y);
        //ctx.rotate(_bananas[i].angle);
        //dessine l'image par rapport au hotspot
        //ctx.drawImage(_image, this.position.x, this.position.y);
        //dessine le hotSpot
        
        //ctx.fillStyle = 'rgba(255,255,0,1.0)';
        //ctx.beginPath();
        //ctx.arc(this.position.x, this.position.y, 2, 0, 2*Math.PI, true);
        //ctx.closePath();
        //ctx.fill();
        
        //ctx.restore();
    }
}

Assets.Scenes.test = {
    car: new Shape()
}