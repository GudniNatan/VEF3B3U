(function() {
    //Globals  
	let canvas, ctx, body;
	let running = true;
	let oldDate;
    let earth, player, scoreCount, earthHealthBar; //rects
    let score = 0;
    let scorestring, populationString;
    
    let screenRect; //for reference only

    let earthHealth = 100;
    let earthMaxHealth = earthHealth;

    let asteroids = []; //asteroids will be kept here.
    let bullets = [];//bullets will be kept here.
    let rects = []; //all rects will be kept here.

    let spaceDown = false; //is the space button currently pressed?

    //Textures
    let asteroidImage1 = document.getElementById('asteroidTexture1');
    let asteroidImage2 = document.getElementById('asteroidTexture2');
    let asteroidImage3 = document.getElementById('asteroidTexture3');
    let asteroidImage4 = document.getElementById('asteroidTexture4');
    let asteroidTextures = [asteroidTexture1, asteroidTexture2, asteroidTexture3, asteroidTexture4];

    let earthTexture = document.getElementById('earthTexture');
    
    let populationP = document.getElementById('populationP');

	async function main(event) {
		canvas = document.getElementById("mainCanvas");
        screenRect = new Rect(0, 0, canvas.width, canvas.height);
		body = document.getElementsByTagName('body')[0];
		ctx = canvas.getContext("2d");

		window.addEventListener('resize', resizeCanvas, false);
		resizeCanvas();

        player.centerx = screenRect.centerx * 0.8;
        player.centery = screenRect.centery;

        let population = Math.round(Math.pow(earthHealth / 100 * 2291, 3)).toString();
        populationString = '';
        for (let k = population.length - 1; k >= 0; k--) {
            populationString += population.charAt(k);
            if ((population.length - k) % 3 == 0 && k > 0) {
                populationString += '.';
            }
        }
        populationString = populationString.split("").reverse().join("");

		drawUpdate();

        await sleep(50);
        resizeCanvas();
	}

    //Special functions for player interaction

    async function keyDownEvent(event){
        event.preventDefault(); // You should remove this if you plan on having anything except the game on your site.
        if (event.key == 'd' || event.keyCode == 39) {
            player.vx = player.speed;
        }
        else if (event.key == 'a' || event.keyCode == 37) {
            player.vx = -player.speed;
        }
        else if (event.key == 'w' || event.keyCode == 38) {
            player.vy = -player.speed;
        }
        else if (event.key == 's' || event.keyCode == 40) {
            player.vy = player.speed;
        }
        else if (event.keyCode === 0 || event.keyCode === 32) {
            if (!running) {
                running = true;
                drawUpdate();
                return;
            }
            if (!spaceDown) {
                spaceDown = true;
                spawnBullet();
            }
        }
        else if (event.keyCode == 27) {
            running = false;
            await sleep(50);
            screenRect.drawText(ctx, 'Paused. Press space to continue.');

        }
    }
    function keyUpEvent(event){
        event.preventDefault(); // You should remove this if you plan on having anything except the game on your site.
        if ((event.key == 'd' || event.keyCode == 39) && player.vx > 0) {
            player.vx = 0;
        }
        else if ((event.key == 'a' || event.keyCode == 37) && player.vx < 0) {
            player.vx = 0;
        }
        else if ((event.key == 'w' || event.keyCode == 38) && player.vy < 0) {
            player.vy = 0;
        }
        else if ((event.key == 's' || event.keyCode == 40) && player.vy > 0) {
            player.vy = 0;
        }
        else if (event.keyCode === 0 || event.keyCode === 32) {
            spaceDown = false;
        }

    }



	window.addEventListener("load", newGame, true);
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("keyup", keyUpEvent);

    function resizeCanvas() {
            canvas.width = canvas.parentNode.offsetWidth;
            canvas.height = canvas.parentNode.offsetHeight;

            screenRect.w = canvas.width;
            screenRect.h = canvas.height;

            let maxDimension = Math.max(screenRect.w, screenRect.h);
            player.speed = maxDimension / 5000;
            player.h = maxDimension / 60;
            player.w = maxDimension / 60;

            earth.h = maxDimension / 30;
            earth.w = maxDimension / 30;
            earth.centerIn(screenRect);

            earthHealthBar.bottom = screenRect.bottom;
            earthHealthBar.left = screenRect.left;
            earthHealthBar.w = screenRect.w * (earthHealth / earthMaxHealth);
            earthHealthBar.h = screenRect.h / 50;

            ctx.filter = 'constrast(100)';

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
             draw();
             process(0);

    }
    function newGame(){
        let speed = 0.2;
        earth = new Rect(0, 0, 0, 0);
        player = new Player(0,0,20,20,0, speed);
        scoreCount = new Rect(20, 20, 120, 30);
        earthHealthBar = new Rect(0,0,0,0);

        asteroids = [];
        bullets = [];
        rects = [player, earth];

        earthHealth = 100;
        score = 0;

        running = true;

        main();
    }

    function sleep(ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));
	}

    async function drawUpdate(timestamp) { //order should be: processing => events => drawing
        let oldDate = Date.now();
        let ms = 0;
        let nextSleep = 0;
        let target = 5;
        let average = [];
        spawnAsteroid(400, 150); //spawn asteroid every 5 seconds.

        window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  async function(/* function */ callback, /* DOMElement */ element){
                    await sleep(1000 / 60);
                    callback();
                  };
        })();

        function doit() {
            if (running) {
                requestAnimFrame( doit );
            }
            newDate = Date.now();
            ms = newDate - oldDate;
            ms = Math.min(ms, 1000);
            oldDate = newDate;

            process(ms);
            draw();

            // body...
        }
        doit();
    }

    async function spawnAsteroid(startRate, minRate){
        let rate = startRate;
        while(running)
        {
            if (rate > minRate) {
                rate--;
            }
            await sleep(rate);
            let circle = Math.random() * 2 * Math.PI; // somewhere on the 360 degree circle
            let maxDimension = Math.max(screenRect.h, screenRect.w);
            let x = Math.cos(circle) * maxDimension * 0.75;
            x += screenRect.centerx; //center it
            let y = Math.sin(circle) * maxDimension * 0.75;
            y += screenRect.centery;
            let scale =  (0.4 + Math.random() * Math.random() / 5 * 3);
            let w = maxDimension / 30 * scale;
            let h = maxDimension / 30 * scale;

            let rot = Math.floor(Math.random() * 4);

            let a = new Asteroid(x, y, w, h, rot, scale);
            a.vx = (-Math.cos(circle) + (Math.random() - 0.5) / 1.5) / 200 * w;
            a.vy = (-Math.sin(circle) + (Math.random() - 0.5) / 1.5) / 200 * h;

            asteroids.push(a);
            rects.push(a);
        }
    }

    function spawnBullet(){
        let bullet = new Bullet(player.centerx, player.centery, player.w / 4, player.h / 4, player.direction, 10);
        bullets.push(bullet);
        rects.push(bullet)
    }

    function handleBullet(r) {
        for (let i = rects.length - 1; i >= 0; i--) {
            r2 = rects[i];
            if (r2 == r || r2 == null) {
                continue; //Don't care about these interactions.
            }
            if (r2 instanceof Asteroid  && r.collideRect(r2)) {
                score++;
                bullets.splice(bullets.indexOf(r), 1);
                rects.splice(rects.indexOf(r), 1);
                asteroids.splice(asteroids.indexOf(r2), 1);
                rects.splice(i, 1);
                delete r2;
                delete r1;
                return;
            }
            
        }
        // body...
    }

    async function process(ms) {
    	//ms should be milliseconds since last call
    	// body... 
        if (!running) {
            return;
        }

        let now = Date.now();
        for (let i = asteroids.length - 1; i >= 0; i--) {
            if (asteroids[i] == null || now > asteroids[i].death) {
                delete asteroids[i];
                asteroids.splice(i, 1);
                continue;
            }
        }
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i] == null || now > bullets[i].death) {
                delete bullets[i];
                bullets.splice(i, 1);
                continue;
            }
        }



        for (let i = rects.length - 1; i >= 0; i--) {

            //remove dead objects
            let r = rects[i];
            if (r == null){
                rects.splice(i, 1);
                continue;
            }
            if (r.death && now > r.death) {
                delete r;
                rects.splice(i, 1);
                continue;
            }

            //Moving objects according to their velocity
            r.x += r.vx * ms;
            r.y += r.vy * ms;

            //special collision detection for bullets
            if (r instanceof Bullet) {
                handleBullet(r);
                continue;
            }


            //mercykilling asteroids when they are offscreen
            if (r instanceof Asteroid){
                let life = now - r.born;
                if (!r.collideRect(screenRect) && life > r.lifeSpan / 4) {
                    asteroids.splice(asteroids.indexOf(r), 1);
                    delete r;
                    rects.splice(i, 1);
                    continue;
                }
            }

            //lock player inside the screen
            if (r instanceof Player) {
                screenRect.clamp_ip(r);
            }

            //do collision detections
            //reverse movements if colliding.
            for (let j = rects.length - 1; j >= 0; j--) {
                let r2 = rects[j];
                if (r2 == r || r2 == null || r2 instanceof Bullet) {
                    continue; //Don't care about interaction with itself.
                }
                if (r.vx || r.vy) {
                    let changed = r2.expell_ip(r);

                    //Asteroid hit earth
                    if (r instanceof Asteroid && r2 == earth) {
                        if (changed[0] || changed[1]) {
                            if (earthHealth <= 1) {
                                running = false;
                                alert(`Game over. Score: ${score}`);
                                await sleep(1000);
                                if (!running) {
                                    newGame();
                                }
                                return;
                            }
                            earthHealth -= 20 * Math.pow(r.scale, 3);
                            rects.splice(rects.indexOf(r), 1);
                            asteroids.splice(asteroids.indexOf(r), 1);
                            delete r;
                            if (earthHealth < 1) {
                                earthHealth = 1;
                            }
                            earthHealthBar.w = screenRect.w * (earthHealth / earthMaxHealth);

                            let population = Math.round(Math.pow(earthHealth / 100 * 2291, 3)).toString();
                            populationString = '';
                            for (let k = population.length - 1; k >= 0; k--) {
                                populationString += population.charAt(k);
                                if ((population.length - k) % 3 == 0 && k > 0) {
                                    populationString += '.';
                                }
                            }
                            populationString = populationString.split("").reverse().join("");

                            return;
                        }
                    }

                    if (r.bouncy || r2.bouncy) {
                        if (changed[0]) {
                            r.vx *= -1;
                            r2.vx *= -1;
                        }
                        else if (changed[1]){
                            r.vy *= -1;
                            r2.vx *= -1;
                        }
                    }
                }
            }
        }

        scorestring = `Score: ${score}`;
        populationP.textContent = `Earth population: ${populationString}`;
    }

    function draw() { //Will be called every 50ms and on resize
    	// do your drawing stuff here
        screenRect.draw(ctx, 'rgba(20, 20, 30, 1)');

        player.draw(ctx, 'lightgray'); // will be in the format (ctx, image). This image will be the sprite. It might rotate depending on direction.

        earth.drawImage(ctx, earthTexture);

        scoreCount.drawText(ctx, scorestring);

        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].drawImage(ctx, asteroidTextures[asteroids[i].rotation]);
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].draw(ctx, 'darkorange');
            bullets[i].drawOutline(ctx, 'black');
        }

        earthHealthBar.draw(ctx, 'red');

    }
})();
