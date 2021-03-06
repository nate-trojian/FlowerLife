
function newCircle(){
    return {
	radius: 6,
	color: "#fff",
	life : {color : 'red'},
	position:{
	    x: null,
	    y: null,
	}
    }
}

var cycleAnimation = {
    name: "Cycle",
    tick: function(circles){
	
	if (circles.length - 2 < Math.abs(this.state.circleCount)){
	    this.state.flipped *= -1;
	}
	if (this.state.flipped == -1 && this.state.circleCount > 0){//decreasing
	    this.state.color = getRandomColor();

	    }else if (this.state.flipped == -1 && this.state.circleCount < 0){// increasing
		this.state.color = 'black';

	    }else if ( this.state.flipped == 1 && this.state.circleCount < 0){// increasing
		this.state.color = getRandomColor();

	    }else if (this.state.flipped == 1 && this.state.circleCount > 0){// increasing
		this.state.color = 'black';
	    }else{
		this.state.color = 'black';
	    }
	circle = circles[Math.abs(this.state.circleCount)];
	circle.life.color = this.state.color;
//	console.log(this.state.circleCount);
	this.state.circleCount += this.state.flipped;
    },
    state:{ circleCount : 0 ,flipped : 1, color: 'black'},
    setup: function(circles,options){
	
    },
    deinit: function(){

    }
}
//Animation radially from inward to outwards
var bloomAnimation = {
    name: "Bloom",
    tick: function(circles){
	var color = getRandomColor();
	this.state.offset = (++this.state.cycle)%this.sections.length;
	if(this.state.cycle%20 == 0) {
		this.state.direction *= -1;
	}
    	this.state.detailsforSection[this.state.offset].color = color;
    },
    state:{ cycleI : 0 ,cycle : 1, offset: 0, direction:-1, detailsforSection: []},
    setup: function(circles, options){
	var temp = [];
	var section = 0;
	//group circles by each tier or section. 
	for ( var i = 0; i < circles.length; i++){
	    temp.push(circles[i]);
	    if ( i > options['sectfunc'](section) -3){		
		section ++ ;
		this.sections.push(temp);
		//Details for section holds state in between ticks for each tier.
		this.state.detailsforSection.push({color: getRandomColor()});
		temp = [];
	   
	    }
	}

	    for(i = 1; i < this.sections.length; i++){
	    for (c = 0 ; c < this.sections[i].length; c++){
		//update the circles and their colors in a given section
		this.sections[i][c].life =  this.state.detailsforSection[i];
	    }
	}
	
		
    },
    sections: [],
    drawCircles : function(context){
	for (var i = 0 ; i < this.sections.length  ; i++){
	    context.beginPath();
		// This is bad, make this better
	    context.strokeStyle = this.state.detailsforSection[(this.sections.length + i + (this.state.direction * this.state.offset))%this.sections.length].color
	    for(var c = 0 ; c < this.sections[i].length  ; c ++){
		context.arc(this.sections[i][c].position.x, this.sections[i][c].position.y, circle.radius, 0, 2 * Math.PI);
	    }
	    context.stroke();
	}
    },
    deinit: function(){
	this.sections = [];
    }
    
}

var ferrrisWheelAnimation ={
    name: "Ferris Wheel",
    tick: function(circles){
	var color = getRandomColor();
	//increment tier colors outward. The inner most tier will start with a random color
	
	for(i = 1 ; i < this.sections.length; i++){
	    //this.state.detailsforSection[0].color = this.state.detailsforSection[this.sections.length - 1 ].color;
	    
	    this.state.detailsforSection[this.sections.length - i].color = this.state.detailsforSection[this.sections.length - i - 1].color ;
	    this.state.detailsforSection[0].color = color;
	    this.sections[0][0].life.color = color;
	    
	    
	}
    },
    state:{ cycleI : 0 ,cycle : 1, detailsforSection: []},
    setup: function(circles, options){
	var temp = [];
	var section = 0;
	for (var i =0 ; i < options['layers']   ; i++){
	    temp = [];
	    this.sections.push(temp);
	    this.state.detailsforSection.push({color: getRandomColor()});
	}
	
	//group circles by each tier or section. 
	for ( var i = 0; i < circles.length; i++){
	     if ( i > options['sectfunc'](section)){		
		section ++ ;
	     }

	    
	    index = i % (options['layers'] -1)

	    this.sections[index].push(circles[i]);
	}


	    for(i = 1; i < this.sections.length; i++){
		for (c = 0 ; c < this.sections[i].length; c++){
		//update the circles and their colors in a given section
		    this.sections[i][c].life =  this.state.detailsforSection[i];
		}
	}
	
		
    },
    sections: [],
    drawCircles : function(context){
	for (var i = 0 ; i < this.sections.length  ; i++){
	    context.strokeStyle = this.state.detailsforSection[i].color
	    for(var c = 0 ; c < this.sections[i].length  ; c ++){
		context.beginPath();
		context.arc(this.sections[i][c].position.x, this.sections[i][c].position.y, circle.radius, 0, 2 * Math.PI);
		context.stroke();
	    }
	    
	}
    },
    deinit : function(){
	this.sections = [];
    }
    
}


//Returns random color in the form of hex
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function drawCircle(circle, context){

    context.beginPath();
    context.strokeStyle = circle.life.color;
    context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
    context.stroke();

}   



var Flower = {
    animations :  [bloomAnimation, ferrrisWheelAnimation]
};

