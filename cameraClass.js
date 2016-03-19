/**
 * Created by leonardo on 15-4-30.
 */
function camera( x,y,z ){
    this.cam = new point(x,y,z);

    this.screen = new Array(400);
    for( var i=0; i<400; ++i ){
        this.screen[i] = new Array(400);

        for( var j=0; j<400; ++j ){

            this.screen[i][j] = new point(x-200,j+y-200,z+200-i);
        }
    }//初始化屏幕空间

    this.changePostion = function(sig){//sig=1向上转，sig=2向下转 sig=3向左转 sig=4向右转
        var cos = 0.996, sin = 0.087;
        if( sig == 1 || sig == 2){
            var k = 1;
            if(sig == 1)
                k = -1;
            var x = this.cam.X, z = this.cam.Z;
            this.cam.X = x*cos + z*sin*k;
            this.cam.Z = z*cos - x*sin*k;
            for( i=0; i<400; ++i ){
                for( j=0; j<400; ++j ){
                    x=this.screen[i][j].X; z=this.screen[i][j].Z;
                    this.screen[i][j].X = x*cos + z*sin*k;
                    this.screen[i][j].Z = z*cos - x*sin*k;
                }
            }
        }
        if( sig == 3 || sig == 4){
            k = 1;
            if(sig == 4)
                k = -1;
            x = this.cam.X; y = this.cam.Y;
            this.cam.X = x*cos - y*sin*k;
            this.cam.Y = x*sin*k + y*cos;
            for( i=0; i<400; ++i ){
                for( j=0; j<400; ++j ){
                    x=this.screen[i][j].X; y=this.screen[i][j].Y;
                    this.screen[i][j].X = x*cos - y*sin*k;
                    this.screen[i][j].Y = x*sin*k + y*cos;
                }
            }
        }
    }

}//相机
