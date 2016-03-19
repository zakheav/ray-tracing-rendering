/**
 * Created by leonardo on 15-4-30.
 */

function scene(){
    this.Bulbs = {
        bulbNum:0,
        Bulb:new Array(0),
        addBulb: function(x,y,z,light_range){
            this.Bulb[this.bulbNum] = new bulb(x,y,z,light_range);
            this.bulbNum = this.bulbNum+1;
        }
    };

    this.num = 0;//初始没有物品

    this.objects = new Array(0);

    this.addObj = function(x,y,z,r,diffuse,R,G,B){
        this.objects[this.num] = new object(x,y,z,r,diffuse,R,G,B);
        ++this.num;
    };

    this.find_closestPoint = function(begin, light){//找到与给定射线最初的交点, begin是射线的起始点
        var closest_point={};
        var find = 0;
        for(var i= 0,sq_distance = 999999; i<this.num; ++i){
            //先判断这条射线有没有可能和某个物品相交
            if( (light.x*(this.objects[i].Point.X-begin.X) + light.y*(this.objects[i].Point.Y-begin.Y)+light.z*(this.objects[i].Point.Z-begin.Z)) > 0 ){
                var result = this.objects[i].intersect_judge(begin, light);
                if(result){
                    find = 1;
                    if("point1" in result){
                        var dx = result.point1.X - begin.X,
                            dy = result.point1.Y - begin.Y,
                            dz = result.point1.Z - begin.Z;
                        var temp =Math.sqrt(dx*dx + dy*dy + dz*dz);

                        if( temp < sq_distance ){
                            sq_distance = temp;
                            closest_point.X = result.point1.X;
                            closest_point.Y = result.point1.Y;
                            closest_point.Z = result.point1.Z;
                            closest_point.id = i;//交点所在物件编号
                        }
                    }
                    if("point2" in result){
                        dx = result.point2.X - begin.X;
                        dy = result.point2.Y - begin.Y;
                        dz = result.point2.Z - begin.Z;
                        temp =Math.sqrt(dx*dx + dy*dy + dz*dz);

                        if( temp < sq_distance ){
                            sq_distance = temp;
                            closest_point.X = result.point2.X;
                            closest_point.Y = result.point2.Y;
                            closest_point.Z = result.point2.Z;
                            closest_point.id = i;//交点所在物件编号
                        }
                    }
                }
            }

        }
        if(find){

            return closest_point;
        }
        return false;
    };

    this.phong = function(closestPoint,sightLight){//这里的sightLight就是视线
        var light = new Array(this.Bulbs.bulbNum);
        var lighting = 0;
        for( var i=0; i<this.Bulbs.bulbNum; ++i ){
            light[i] = {
                x: this.Bulbs.Bulb[i].X - closestPoint.X,
                y: this.Bulbs.Bulb[i].Y - closestPoint.Y,
                z: this.Bulbs.Bulb[i].Z - closestPoint.Z
            };//closedPoint到光源的射线

            if(!this.find_closestPoint(closestPoint, light[i])){//光线没有被遮蔽

                var normal_vector = {
                    x: closestPoint.X - this.objects[closestPoint.id].Point.X,
                    y: closestPoint.Y - this.objects[closestPoint.id].Point.Y,
                    z: closestPoint.Z - this.objects[closestPoint.id].Point.Z
                };
                var n = Math.sqrt(normal_vector.x*normal_vector.x+normal_vector.y*normal_vector.y+normal_vector.z*normal_vector.z),
                    l = Math.sqrt(light[i].x*light[i].x+light[i].y*light[i].y+light[i].z*light[i].z);
                var cosA = (light[i].x*normal_vector.x+light[i].y*normal_vector.y+light[i].z*normal_vector.z)/(n*l);//光线与法线的夹角

                var A = normal_vector.x*sightLight.x + normal_vector.y*sightLight.y + normal_vector.z*sightLight.z,
                    B = normal_vector.x*normal_vector.x + normal_vector.y*normal_vector.y + normal_vector.z*normal_vector.z;
                var reflect = {
                    x: (-2*A*normal_vector.x)/B + sightLight.x,
                    y: (-2*A*normal_vector.y)/B + sightLight.y,
                    z: (-2*A*normal_vector.z)/B + sightLight.z
                };//视线sightLight的反射向量

                n = Math.sqrt(reflect.x*reflect.x+reflect.y*reflect.y+reflect.z*reflect.z);
                l = Math.sqrt(light[i].x*light[i].x+light[i].y*light[i].y+light[i].z*light[i].z);
                var cosB = (light[i].x*reflect.x+light[i].y*reflect.y+light[i].z*reflect.z)/(n*l);//视线与反射光线的夹角
                if(cosB < 0){
                    cosB = 0;
                }
                cosB = cosB*cosB*cosB;
                var mirror = this.Bulbs.Bulb[i].light_range*Math.pow(cosB,this.objects[closestPoint.id].diffuse);
                var rough = this.Bulbs.Bulb[i].light_range*cosA;

                lighting = rough + mirror + lighting;//累加光线
            }

        }
        if(lighting == 0 )
            lighting = 10;
        return {
            red: lighting*this.objects[closestPoint.id].Color.R,
            green: lighting*this.objects[closestPoint.id].Color.G,
            blue: lighting*this.objects[closestPoint.id].Color.B
        };//phong模型求解局部光照
    };

    this.rayTracing = function( closestPoint, light, deep ){//closedPoint包含 交点坐标和交点属于的物品编号(通过this.find_closestPoint得到) light是入射光线方向向量
        if(deep>0){
            //得到法向量
            var normal_vector = {
                x: closestPoint.X - this.objects[closestPoint.id].Point.X,
                y: closestPoint.Y - this.objects[closestPoint.id].Point.Y,
                z: closestPoint.Z - this.objects[closestPoint.id].Point.Z
            };

            var A = normal_vector.x*light.x + normal_vector.y*light.y + normal_vector.z*light.z,
                B = normal_vector.x*normal_vector.x + normal_vector.y*normal_vector.y + normal_vector.z*normal_vector.z;
            var reflect = {
                x: (-2*A*normal_vector.x)/B + light.x,
                y: (-2*A*normal_vector.y)/B + light.y,
                z: (-2*A*normal_vector.z)/B + light.z
            };
            var begin = {
                X: closestPoint.X,
                Y: closestPoint.Y,
                Z: closestPoint.Z
            };


            var new_closestPoint = this.find_closestPoint( begin, reflect );
            var Reflection = {red:0,green:0,blue:0};
            if(new_closestPoint){//找到新的最近交点

                Reflection = this.rayTracing(new_closestPoint, reflect, deep-1);
            }
            var  phong = this.phong(closestPoint, light);
            return {
                red: phong.red + 0.5*Reflection.red,
                green: phong.green + 0.5*Reflection.green,
                blue: phong.blue + 0.5*Reflection.blue
            };

        }
        return {red:0,green:0,blue:0};
    };

    this.rayCasting = function(cam, screenSpace){
        var shader={r:0,g:0,b:0};
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,400,400);
        for(var i=0; i<400; ++i){
            for(var j=0; j<400; ++j){
                var sightLine = {
                    x: screenSpace[i][j].X - cam.X,
                    y: screenSpace[i][j].Y - cam.Y,
                    z: screenSpace[i][j].Z - cam.Z
                };//视线

                var closestPoint = this.find_closestPoint(cam,sightLine);


                if(closestPoint){
				    var  result = this.rayTracing(closestPoint,sightLine,3);
                    shader.r = Math.ceil( result.red);
                    shader.g = Math.ceil( result.green);
                    shader.b = Math.ceil( result.blue);
                    if(shader.r>255)shader.r = 255;
                    if(shader.r<0)shader.r = 0;
                    if(shader.g>255)shader.g = 255;
                    if(shader.g<0)shader.g = 0;
                    if(shader.b>255)shader.b = 255;
                    if(shader.b<0)shader.b = 0;

                    //alert(shader.r+" "+shader.g+" "+shader.b);
                } else{
                    shader.r = shader.g = shader.b = 0;
                }

                ctx.beginPath();
                ctx.moveTo(j,i);
                ctx.lineTo(j,i+1);
                ctx.strokeStyle = "rgb("+shader.r+","+shader.g+","+shader.b+")";
                ctx.stroke();
                ctx.closePath();
            }
        }
    };
}//实际物品空间