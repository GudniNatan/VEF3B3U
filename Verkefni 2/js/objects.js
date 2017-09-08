class Rect {
    constructor(x, y, w, h) {
	    this._x, this._left = x;
	    this._y, this._top = y;
	    this._w = w;
	    this._h = h;

	    this.vx = 0; //velocity X
	    this.vy = 0; //velocity Y

	    this._centerx = x + ( w / 2 );
	    this._centery = y + ( h / 2 );
	    this._center = (this._centerx, this._centery);

	    this._right = x + w;
	    this._left = y + h;
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
    	this._right = this._left + value;
    	this.RecalcCenter();
    }
    set h(value) { 
    	value = Math.abs(value);
    	this._h = value;
    	this._bottom = this._top + value;
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
    	this._x = value - this._w;
    	this._right = value;
    	this._left = this._x;
    	this.RecalcCenter();
    }
    set bottom(value) { 
    	this._y = value - this._h;
    	this._bottom = value;
		this._top = this._y;
    	this.RecalcCenter();
    }
    set centerx(value){
    	this._x = value - (this._w / 2);
    	this._left = this._x;
    	this._right = this._x + this._w;
    }
    set centery(value){
    	this._y = value - (this._y / 2);
    	this._top = this._y;
    	this._bottom = this._y + this._h;
    }
    set center(xytuple){
    	x = xytuple[0];
    	y = xytuple[1];

    	this._x = value - (this._w / 2);
    	this._left = this._x;
    	this._right = this._x + this._w;

    	this._y = value - (this._y / 2);
    	this._top = this._y;
    	this._bottom = this._y + this._h;
    }

    RecalcCenter(){
    	this._centerx = this._x + (this._w / 2);
    	this._centery = this._y + (this.w / 2);
    	this._center = (this._centerx, this._centery);
    }

    collideRect(otherRect){
    	//are the rects colliding?
    }

    collidePoint(pointTuple){
    	//is the rect overlapping this point?
    }

    draw(canvas, color){
    	canvas.fillStyle = color;
    	canvas.fillRect(this._x, this._y, this._w, this._h);
    }
}

/*

function rect(x, y, w, h) {
    this._x, this._left = x;
    this._y, this._top = y;
    this._w = w;
    this._h = h;

    this._centerx = x + ( w / 2 );
    this._centery = y + ( h / 2 );
    this._center = (this.centerx, this.centery);

    this._right = x + w;
    this._left = y + h;

    //Ojj bara ullabjakk

    this.__defineGetter__('x', function () {
    	return _x;
    });
    this.__defineGetter__('y', function () {
    	return _y;
    });
    this.__defineGetter__('w', function () {
    	return _x;
    });
    this.__defineGetter__('h', function () {
    	return _x;
    });
    this.__defineGetter__('top', function () {
    	return _top;
    });
    this.__defineGetter__('left', function () {
    	return _left;
    });
    this.__defineGetter__('right', function () {
    	return _right;
    });
    this.__defineGetter__('bottom', function () {
    	return _bottom;
    });
    this.__defineGetter__('centerx', function () {
    	return _centerx;
    });
    this.__defineGetter__('centery', function () {
    	return _centery;
    });
    this.__defineGetter__('center', function () {
    	return _center;
    });


    // Setters

}

*/