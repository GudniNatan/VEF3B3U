//Classes for JavaScript canvas games.
//These are in many ways similar to pygame for python.

//Gudni Natan Gunnarsson, 2017

class Rect {
    constructor(x, y, w, h, bouncy=false) {
	    this._x = x;
	    this._left = x;
	    this._y = y;
	    this._top = y;
	    this._w = w;
	    this._h = h;

	    this._vx = 0; //velocity X
	    this._vy = 0; //velocity Y

	    this._centerx = x + ( w / 2 );
	    this._centery = y + ( h / 2 );
	    this._center = [this._centerx, this._centery];

	    this._right = x + w;
	    this._bottom = y + h;

	    this.bouncy = bouncy;
	    this.direction = 0;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get w() { return this._w; }
    get h() { return this._h; }
    get left() { return this._x; }
    get top() { return this._y; }
    get right() { return this._right; }
    get bottom() { return this._bottom; }
    get centerx() { return this._centerx; }
    get centery() { return this._centery; }
    get center() { return this._center; }
    get vx() { return this._vx; }
    get vy() { return this._vy; }

    set x(value) { 
    	this._x = value;
    	this._left = value;
    	this._right = this._w + value;
    	this.RecalcCenter();
    }
    set y(value) { 
    	this._y = value;
    	this._top = value;
		this._bottom = this._h + value;
    	this.RecalcCenter();
    }
    set w(value) { 
    	value = Math.abs(value);
    	this._w = value;
    	this._right = this._x + value;
    	this.RecalcCenter();
    }
    set h(value) { 
    	value = Math.abs(value);
    	this._h = value;
    	this._bottom = this._y + value;
    	this.RecalcCenter();
    }
    set left(value) { 
    	this._x = value;
    	this._left = value;
    	this._right = this._w + value;
    	this.RecalcCenter();
    }
    set top(value) { 
    	this._y = value;
    	this._top = value;
		this._bottom = this._h + value;
    	this.RecalcCenter();
    }
    set right(value) { 
    	this._right = value;
    	this._x = value - this._w;
    	this._left = this._x;
    	this.RecalcCenter();
    }
    set bottom(value) { 
    	this._bottom = value;
    	this._y = value - this._h;
		this._top = this._y;
    	this.RecalcCenter();
    }
    set centerx(value){
    	this._centerx = value;
    	this._x = value - (this._w / 2);
    	this._left = this._x;
    	this._right = this._x + this._w;
    }
    set centery(value){
    	this._centery = value;
    	this._y = value - (this._h / 2);
    	this._top = this._y;
    	this._bottom = this._y + this._h;
    }
    set center(xytuple){
    	this._center = xytuple;
    	x = xytuple[0];
    	y = xytuple[1];

    	this._x = value - (this._w / 2);
    	this._left = this._x;
    	this._right = this._x + this._w;

    	this._y = value - (this._y / 2);
    	this._top = this._y;
    	this._bottom = this._y + this._h;
    }

    set vx(value){
    	this._vx = value;
    	if (!value && !this.vy) {return;}
    	this.direction = Math.atan2(this.vy, value);
    }

    set vy(value){
    	this._vy = value;
    	if (!value && !this.vx) {return;}
    	this.direction = Math.atan2(value, this.vx);
    }

    RecalcCenter(){
    	this._centerx = this._x + (this._w / 2);
    	this._centery = this._y + (this._h / 2);
    	this._center = (this._centerx, this._centery);
    }

    collidePoint(x, y){
    	//is the rect overlapping this point?
    	return (this._left <= x && x < this._right) && (this._top <= y && y < this._bottom); 
    }
    collideRect(otherRect){
    	//are the rects colliding?
    	//there is probably a better way to do this ------ not anymore! (this used to be bad)
    	//x axis
    	let differencex = Math.abs(this.centerx - otherRect.centerx);
    	let x = differencex < (this.w + otherRect.w) / 2  - 0.0001;
    	//y axis
    	let differencey = Math.abs(this.centery - otherRect.centery);
    	let y = differencey < (this.h + otherRect.h) / 2 - 0.0001;
    	return x && y;
    }
    contains(otherRect){ //true if otherRect is completely inside this rect.
    	return (this.left <= otherRect.left && this.right >= otherRect.right) && (this.top <= otherRect.top && this.bottom >= otherRect.bottom);
    }
    clamp_ip(otherRect){ //move other rect fully inside this one. Will center the rect if the container is smaller.
    	//if (this.contains(otherRect)) {return;}
    	if (this.left > otherRect.left) {
    		otherRect.left = this.left;
    	}
    	else if (this.right < otherRect.right) {
    		otherRect.right = this.right;
    	}
    	if (this.top > otherRect.top) {
    		otherRect.top = this.top;
    	}
    	else if (this.bottom < otherRect.bottom) {
    		otherRect.bottom = this.bottom;
    	}
    }

    expell_ip(otherRect){ //fully exert otherRect so that it does not collide with this rect anymore 
    	//NOTE:additionally returns axis adjusted in array
    	//Will pick the shortest path to move it out.
    	if (!this.collideRect(otherRect)) {return [false, false];} //assuming that there is a collision

    	//what is the shortest path to move this rect out?

    	let differencex = this.centerx - otherRect.centerx;
    	let differencey = this.centery - otherRect.centery;

    	if (Math.abs(differencex) >= Math.abs(differencey)) {
    		if (differencex < 0) {
	    		otherRect.x = this.right;
	    	}
	    	else{
	    		otherRect.right = this.left;
	    	}
	    	return [true, false];
    	}
    	else{
    		if (differencey < 0){
	    		otherRect.y = this.bottom;
	    	}
	    	else{
	    		otherRect.bottom = this.top;
	    	}
	    	return [false, true];
    	}
    }

    expell(otherRect){
    	let newRect = new Rect(0,0,0,0);
    	newRect.copyFromOther(otherRect);
    	this.expell_ip(newRect);
    	return newRect;
    }
    
    clamp(otherRect){ //not really very useful, but...
    	let newRect = new Rect(0,0,0,0);
    	newRect.copyFromOther(otherRect);
    	this.clamp_ip(newRect);
    	return newRect;
    }

    draw(canvas, color){
    	canvas.fillStyle = color;
    	canvas.fillRect(this._x, this._y, this._w, this._h);
    }
    drawImage(canvas, image){
    	canvas.drawImage(image, Math.round(this.x), Math.round(this.y), Math.round(this.w), Math.round(this.h));
    }
    drawText(canvas, text, font='sans-serif', color='white', stroke=true) //Draws text not exceeding the size of the rect.
    {
    	let size = this.h;
    	canvas.font = `${size}px ${font}`;
    	if (canvas.measureText(text).width > this.w) {
    		size = measureTextBinaryMethod(text, font, 0, Math.min(this.h, 600), this.w, canvas);
			canvas.font = `${size}px ${font}`;
    	}
    	canvas.fillStyle = color;
    	canvas.textAlign = 'center';
    	canvas.fillText(text, this.centerx, this.centery, this.w); 
    	if (stroke) {
    		canvas.lineWidth = size / 30;
      		canvas.strokeStyle = `lightgray`;
    		canvas.strokeText(text, this.centerx, this.centery, this.w);
    	}
    }
    drawOutline(canvas, color){
    	canvas.strokeStyle = color;
    	canvas.lineWidth=1;
    	canvas.beginPath();
    	canvas.rect(this.x, this.y, this.w, this.h);
		canvas.stroke();
    }
    copyFromOther(otherRect){
    	this.x = otherRect.x;
    	this.y = otherRect.y;
    	this.h = otherRect.h;
    	this.w = otherRect.w;

    	this.vx = otherRect.vx;
    	this.vy = otherRect.vy;
    }
    centerIn(otherRect){
    	this.centerx = otherRect.centerx;
    	this.centery = otherRect.centery;
    }
}

class Player extends Rect{
	constructor(x, y, w, h, direction, speed) {
		super(x,y,w,h);
		this.direction = direction;
		this.speed = speed;
    }
}

class Bullet extends Rect{
	constructor(x, y, w, h, direction, speed, lifeSpan=10000) {
		super(x,y,w,h);
		this.direction = direction; //in radians
		this.born = Date.now();
		this.lifeSpan = lifeSpan; //in milliseconds
		this.death = this.born + this.lifeSpan;

		this.vx = Math.cos(direction);
		this.vy = Math.sin(direction);
    }
}

class Asteroid extends Rect{
	constructor(x, y, w, h, rotation=0, scale=1, lifeSpan=30000) {
		super(x,y,w,h, true);
		this.born = Date.now();
		this.lifeSpan = lifeSpan;
		this.death = this.born + this.lifeSpan;
		this.rotation = rotation;
		this.scale = scale;
    }

}