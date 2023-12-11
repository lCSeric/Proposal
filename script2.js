var Vector = function(x,y){
	this.x = x || 0
	this.y = y || 0
}
Vector.prototype.add = function(v){
	return new Vector(this.x+v.x,this.y+v.y)
}
Vector.prototype.sub = function(v){
	return new Vector(this.x-v.x,this.y-v.y)
}
Vector.prototype.length = function(v){
	return Math.sqrt(this.x*this.x,this.y*this.x)
}
Vector.prototype.set = function(x,y){
	this.x = x
	this.y = y
}
Vector.prototype.equal = function(v){
	return this.x == v.x && this.y == v.y
}
Vector.prototype.mul = function(s){
	return new Vector(this.x*s,this.y*s)
}
Vector.prototype.clone = function(){
	return new Vector(this.x,this.y)
}



var Snake = function(){

	this.body = []
	this.maxLength = 5

	this.head = new Vector()
	this.speed = new Vector(1,0)
	this.direction = "Right"
}

Snake.prototype.update = function(){
	let newHead = this.head.add(this.speed)
	this.body.push(this.head) 
	this.head = newHead

	while(this.body.length>this.maxLength){
		this.body.shift()
	}
}

Snake.prototype.setDirection = function(dir){
	let target
  	if(dir=="Up"){
		target = new Vector(0,-1)
  	}
	if(dir=="Down"){
		target = new Vector(0,1)
	}
	if(dir=="Left"){
		target = new Vector(-1,0)
	}
	if(dir=="Right"){
		target = new Vector(1,0)
	 }


	if(!target.equal(this.speed.mul(-1))){
		this.speed=target
	}
}

Snake.prototype.checkBoundary = function(gameWidth){
	//頭的x,y位置，都要小於等於gameWidth
	let xInRange= 0<= this.head.x && this.head.x < gameWidth
  	let yInRange= 0<= this.head.y && this.head.y < gameWidth
  	return xInRange && yInRange
}



var Game = function(){
	this.bw = 15
	this.bs = 2
	this.gameWidth = 40
	this.speed = 30
	this.snake = new Snake()
	this.foods = []
	this.superStars = []
	this.superSnake = false
	this.start = false
}



Game.prototype.init = function(){
	this.canvas = document.getElementById("mycanvas")
  	this.ctx = this.canvas.getContext("2d")
	
	this.canvas.width = this.bw * this.gameWidth + this.bs * (this.gameWidth-1)
  	this.canvas.height = this.canvas.width
	
	this.render()
	this.update()
}


Game.prototype.startGame = function(){
	this.start = true
	this.snake = new Snake()
	$(".panel").hide()
	console.log(this.start)
	console.log(this.snake.head)

	this.foods = [];
	this.superStars = [];

	this.generateFood(1)

	setTimeout(() => {
		this.generateSuperStar();
	}, 3000);

	this.playSound("C#5",-10)
	this.playSound("E5",-10,200)
}

Game.prototype.endGame = function(){
	this.start = false
	$(".panel").show()

	$("h2").text("Score: "+ (this.snake.body.length-5)*10)

	this.playSound("A3")
	this.playSound("E2",-10,200)
	this.playSound("A2",-10,400)
}

Game.prototype.getPositon = function(x,y){
	return new Vector(
		x * this.bw + (x-1) * this.bs,
		y * this.bw + (y-1) * this.bs
	)
}

Game.prototype.drawBlock = function(v,color){
	this.ctx.fillStyle = color
	let pos = this.getPositon(v.x,v.y)
	this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)
}

Game.prototype.drawEffect = function(x,y,color){
  let r = 2
  let pos = this.getPositon(x,y)
  let _this = this
  let effect = ()=>{
    r++
    _this.ctx.strokeStyle = "rgba("+ color + "," +(100-r)/100+")"
    _this.ctx.beginPath()
    _this.ctx.arc(pos.x+_this.bw/2,pos.y+_this.bw/2,r,0,Math.PI*2)
    _this.ctx.stroke()
    
    if (r<100){
      requestAnimationFrame(effect)
    }
  }
  requestAnimationFrame(effect)
}

Game.prototype.generateFood = function(num){
	for(let i = 0; i < num; i++){

		do{
			x = parseInt(Math.random() * this.gameWidth);
			y = parseInt(Math.random() * this.gameWidth);
		}while (x === 0 || y === 0 || x === this.gameWidth - 1 || y === this.gameWidth - 1);

		this.foods.push(new Vector(x,y))
		

		this.drawEffect(x,y,"255,0,0")
	}
	
}

Game.prototype.generateSuperStar = function(){

	do{
		x = parseInt(Math.random() * this.gameWidth);
		y = parseInt(Math.random() * this.gameWidth);
	}while (x === 0 || y === 0 || x === this.gameWidth - 1 || y === this.gameWidth - 1);
	this.superStars.push(new Vector(x,y))
    this.drawEffect(x,y,"255,255,0")
}

Game.prototype.render = function(){

	this.ctx.fillStyle = "rgba(0,0,0,0.3)"
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.width)
	

	for(let i=0;i<this.gameWidth;i++){
		for(let j=0;j<this.gameWidth;j++){
			this.drawBlock(new Vector(i,j),"rgba(255,255,255,0.03)")
		}
	}
	

	this.snake.body.forEach((sp,i) => {
     	this.drawBlock(sp,"white")
		if(this.superSnake){
			this.drawBlock(sp,"orange")
		}
  	})
	

	this.foods.forEach((p) => {
     	this.drawBlock(p,"red")
  	})
	

	this.superStars.forEach((p) => {
     	this.drawBlock(p,"yellow")
  	})
	
	requestAnimationFrame(()=>{this.render()})
}

Game.prototype.update = function(){
	if(this.start) {
	
		this.playSound("A2",-20)
	
		this.snake.update()
	

		this.foods.forEach((food,i) => {

			if(this.snake.head.equal(food)){
	
				this.snake.maxLength ++

				this.foods.splice(i,1)

				this.playSound("E5",-20)
				this.playSound("A5",-20,100)
				

				if (this.foods.length === 0) {
					this.generateFood(3);
				}
			}
		})


		this.superStars.forEach((food,i) => {

			if(this.snake.head.equal(food)){

				this.snake.maxLength ++

				this.superStars.splice(i,1)

            	this.superSnake = true

				setTimeout(() => {
					this.superSnake = false
				}, 5000);

				setTimeout(() => {
					this.generateSuperStar();
				}, 10000);
			}
		})
		
		console.log(this.speed)
		

		if(!this.superSnake){
			this.snake.body.forEach(bp=>{
				if(this.snake.head.equal(bp)){
					console.log('Game Over')
					this.endGame()
				}
			})
		}
		

		if (this.snake.checkBoundary(this.gameWidth)==false){
      		this.endGame()
    	}
	}
	

	this.speed = Math.sqrt(this.snake.body.length) + 5;
	
	setTimeout(() => {
		this.update()
	},parseInt(1000/this.speed))
}

Game.prototype.playSound = function(note,volume,when){
	setTimeout(function(){

		var synth = new Tone.Synth().toMaster()

		synth.volume.value= volume || -12;
    	synth.triggerAttackRelease(note, "8n");
	},when || 0)
}

var game = new Game()
game.init()


$(window).keydown(function(evt){
	console.log(evt.key)
	game.snake.setDirection(evt.key.replace("Arrow",""))
})
