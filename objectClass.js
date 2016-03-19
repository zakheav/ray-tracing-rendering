/**
 * Created by leonardo on 15-4-30.
 */
function object( x,y,z,r,diffuse,R,G,B ){
    this.Color = new color(R,G,B);//表示颜色分量系数（0-1）

    this.diffuse = diffuse;//镜面反射程度

    this.Point = new point(x,y,z);//包围盒球心

    this.R = r;//包围盒半径

    this.shape = null;//物体实际造型

    this.intersect_judge = function(begin, light){//输入参数是起始点 和 射线的方向向量
        var A = begin.X-this.Point.X, B = begin.Y-this.Point.Y, C = begin.Z-this.Point.Z;
        var D = light.x * light.x + light.y * light.y + light.z * light.z,
            E = 2 * (A*light.x + B*light.y + C*light.z),
            F = A*A + B*B + C*C - this.R*this.R;
        var delta = E*E - 4*D*F;
        if( delta<0 ){
            return false;
        } else{
            var sq_delta = Math.sqrt(delta);
            var t1 = (-E+sq_delta)/(2*D), t2 = (-E-sq_delta)/(2*D);

            if(t1<=0&&t2<=0){
                return false;
            }
            var intersect_point = {};
            if(t1>0){
                var p1 = {};
                p1.X = light.x * t1 + begin.X;
                p1.Y = light.y * t1 + begin.Y;
                p1.Z = light.z * t1 + begin.Z;
                intersect_point.point1 = p1;
            }
            if(t2>0){
                var p2 = {};
                p2.X = light.x * t2 + begin.X;
                p2.Y = light.y * t2 + begin.Y;
                p2.Z = light.z * t2 + begin.Z;
                intersect_point.point2 = p2;
            }
            return intersect_point;//返回交点对象
        }
    };//宽阶段

    this.intersect_judge_strict = null;//严阶段

    this.get_normal_vector = function(point){

    };//得到某点的法向量

    this.movePosition = function(dx,dy,dz){
        this.Point.X = this.Point.X + dx;
        this.Point.Y = this.Point.Y + dy;
        this.Point.Z = this.Point.Z + dz;
    };//物件移动
}//物品