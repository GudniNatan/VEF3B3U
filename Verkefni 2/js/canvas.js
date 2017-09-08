(function() {
	let canvas, ctx, body;
	let running = true;
	let oldDate;
    let block = new Rect(0.0, 0.0, 25.0, 25.0);
    let speed = 0.2;
	function main(event) {
		canvas = document.getElementById("mainCanvas");
		body = document.getElementsByTagName('body')[0];
		ctx = canvas.getContext("2d");

		window.addEventListener('resize', resizeCanvas, false);
		resizeCanvas();
		drawUpdate();
	}


    function keyDownEvent(event){
        if (event.key == 'd') {
            block.vx = speed;
        }
        else if (event.key == 'a') {
            block.vx = -speed;
        }
        else if (event.key == 'w') {
            block.vy = -speed;
        }
        else if (event.key == 's') {
            block.vy = speed;
        }
    }
    function keyUpEvent(event){
        if (event.key == 'd' && block.vx > 0) {
            block.vx = 0;
        }
        else if (event.key == 'a' && block.vx < 0) {
            block.vx = 0;
        }
        else if (event.key == 'w' && block.vy < 0) {
            block.vy = 0;
        }
        else if (event.key == 's' && block.vy > 0) {
            block.vy = 0;
        }
    }



	window.addEventListener("load", main, true);
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("keyup", keyUpEvent);

    function resizeCanvas() {
            canvas.width = canvas.parentNode.offsetWidth;
            canvas.height = canvas.parentNode.offsetHeight;

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
             draw();

    }

    function sleep(ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));
	}

    async function drawUpdate(timestamp) { //order should be: processing => events => drawing
            let desiredDate = 0;
            let ms = 0;
            let nextSleep = 0;
            let target = 1;
            let average = [];
            while(running)
            {               	
                newDate = Date.now();
                ms = newDate - desiredDate + target;
                ms = Math.min(ms, 1000);
                desiredDate = newDate + target;

                let now = Date.now();

                doit(ms);   

                if (now >= desiredDate) {
                    continue;  // if frame is overdue, just skip to the next one
                }
                await sleep(desiredDate - now); //wait until the desired time is reached
            }

    }

    async function doit(ms) {
        // body...
        process(ms);
        draw();
    }
    function avg(argument) {
        // body...
        let total = 0;
        for (let i = argument.length - 1; i >= 0; i--) {
            total += argument[i];
        }
        return total / argument.length;
    }

    function process(ms) {
    	//ms should be milliseconds since last call
    	// body...

        block.x += block.vx * ms;
        block.y += block.vy * ms;
    }

    function draw() { //Will be called every 50ms and on resize
    	// do your drawing stuff here
		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

        block.draw(ctx, 'red');
        /*ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="red";
        ctx.rect(canvas.width / 2 - 20,canvas.height / 2 - 20, 40, 40);
        ctx.stroke();*/

        /*for (var i = 0000 - 1; i >= 0; i--) {
            ctx.beginPath();
            ctx.lineWidth="1";
            ctx.strokeStyle=`#${Math.round(Math.random() * 999998)}`;
            ctx.rect(Math.round(canvas.width * Math.random()) - 20,Math.round(canvas.height * Math.random()) - 20, 40, 40);
            ctx.stroke();
        }


        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="red";
        ctx.rect(Math.round(block.x), Math.round(block.y), Math.round(block.w), Math.round(block.h));
        //ctx.rect(block.x, block.y, block.w, block.h);
        ctx.stroke();*/
    }
})();
