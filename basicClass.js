function point( x,y,z ){
    this.X = x;
    this.Y = y;
    this.Z = z;
}

function light( begin, end ){//传入参数是射线起点和射线上任意一点 是对象point的实例
    this.x = end.X - begin.X;
    this.y = end.Y - begin.Y;
    this.z = end.Z - begin.Z;
}

function color(r,g,b){//表示颜色分量系数（0-1）
    this.R = r;
    this.G = g;
    this.B = b;
}

function bulb(x,y,z,light_range){//光源
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.light_range = light_range;
    this.move = function(dx,dy,dz){
        this.X = this.X + dx;
        this.Y = this.Y + dy;
        this.Z = this.Z + dz;
    };
}