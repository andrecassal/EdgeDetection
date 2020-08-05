//REFERENCES
//https://idmnyu.github.io/p5.js-image/Edge/index.html
//https://www.rand-on.com/projects/2018_edge_detection/edge_detection.html
//https://habibtariq.wordpress.com/

class EdgeDetection{
	
	constructor(img){
		this.img = img;
		this.data = [];
		this.max = 0;
		this.blk = 1; //SCAN BLOCK
		this.chn = 1; //Green channel only;
		//Kernel x and y;
		this.kx = [[-1, 	0, 	1],
							[-2, 	0, 	2],
							[-1, 	0, 	1]];
		this.ky = [[-1, 	-2, -1],
							[0, 	0, 	0],
							[1, 	2, 	1]];
	}
	scan(){
		let w = this.img.width;
		let h = this.img.height;
		
		this.img.loadPixels();
		this.onIterateBegin();
		
		for (var x=this.blk; x < w; x+=this.blk) {
				for (var y=this.blk; y < h; y+=this.blk) {

				// INDEX POSITION IN PIXEL LIST
				let ul = ((x-1+w)%w + w*((y-1+h)%h))*4; // location of the UPPER LEFT
				let uc = ((x-0+w)%w + w*((y-1+h)%h))*4; // location of the UPPER MID
				let ur = ((x+1+w)%w + w*((y-1+h)%h))*4; // location of the UPPER RIGHT
				let ml = ((x-1+w)%w + w*((y+0+h)%h))*4; // location of the LEFT
				let mc = ((x-0+w)%w + w*((y+0+h)%h))*4; // location of the CENTER PIXEL
				let mr = ((x+1+w)%w + w*((y+0+h)%h))*4; // location of the RIGHT
				let ll = ((x-1+w)%w + w*((y+1+h)%h))*4; // location of the LOWER LEFT
				let lc = ((x-0+w)%w + w*((y+1+h)%h))*4; // location of the LOWER MID
				let lr = ((x+1+w)%w + w*((y+1+h)%h))*4; // location of the LOWER RIGHT
				
				//Results for x and y based on kernel calculation
				let rx = 	this.calcKernel(ul,uc,ur,ml,mc,mr,ll,lc,lr, this.kx);
				let ry = 	this.calcKernel(ul,uc,ur,ml,mc,mr,ll,lc,lr, this.ky);
				// 0 is the minimum value the sum could result in and 1414 is the maximum
				// var result = map(sqrt(r1*r1+r2*r2),0,1414,0,255);
					
				let o = {	x: x,
									y: y,
									rx: rx,	//result from x kernel
									ry: ry,	//result from y kernel
									res: sqrt(rx*rx+ry*ry),	//result squared
									c: 		color(	this.img.pixels[mc],
														 		this.img.pixels[mc+1],
																this.img.pixels[mc+2])
									};
				this.data.push( o );
				this.onIterate( o );	
				// if(o.res > this.max) this.max = o.res;
			}
		}
		this.onIterateEnd();		
	}
	//Loop events
	onIterateBegin(){}
	onIterate(){}
	onIterateEnd(){}	
	
	//for some reason this is inverted
	getRotation(rx,ry){
		return map(atan2(rx,ry),0,TWO_PI,TWO_PI,0)+HALF_PI;
	}
	
	calcKernel(ul,uc,ur,ml,mc,mr,ll,lc,lr,k){
		let t=this;
		return 	t.img.pixels[ul+t.chn] * k[0][0]+ // upper left
						t.img.pixels[uc+t.chn] * k[0][1]+ // upper mid
						t.img.pixels[ur+t.chn] * k[0][2]+ // upper right
						t.img.pixels[ml+t.chn] * k[1][0]+ // left
						t.img.pixels[mc+t.chn] * k[1][1]+ // center pixel
						t.img.pixels[mr+t.chn] * k[1][2]+ // right
						t.img.pixels[ll+t.chn] * k[2][0]+ // lower left
						t.img.pixels[lc+t.chn] * k[2][1]+ // lower mid
						t.img.pixels[lr+t.chn] * k[2][2] // lower right
	
	}
	
}
