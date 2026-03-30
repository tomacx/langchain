/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////函数定义

//////////////////////////////////////////////////////开门
function OpenDoor(id1, id2, id3, id4, id5) {

    //id1，掩护梁节点1
    var x1 = blkdyn.GetNodeValue(id1, "Coord", 1);
    var y1 = blkdyn.GetNodeValue(id1, "Coord", 2);
    //id2，掩护梁节点2
    var x2 = blkdyn.GetNodeValue(id2, "Coord", 1);
    var y2 = blkdyn.GetNodeValue(id2, "Coord", 2);

    //id3，掩护梁与尾梁交点
    var x3 = blkdyn.GetNodeValue(id3, "Coord", 1);
    var y3 = blkdyn.GetNodeValue(id3, "Coord", 2);

    //id4，尾梁节点1
    var x4 = blkdyn.GetNodeValue(id4, "Coord", 1);
    var y4 = blkdyn.GetNodeValue(id4, "Coord", 2);

    //id5，尾梁节点2
    var x5 = blkdyn.GetNodeValue(id5, "Coord", 1);
    var y5 = blkdyn.GetNodeValue(id5, "Coord", 2);

    var alpha = 0.0;
    var beta  = 0.0;
    if( Math.abs(y2 - y1) > 1e-6 )
    {
        var sita = (x2 - x1) / (y2 -y1);
        alpha = 180.0 / Math.PI * Math.atan(sita);
    }
    else
    {
        if(x2 > x1)
        {
            alpha = 90.0;
        }
        else
        {
            alpha = -90.0;
        }
    }


    if( Math.abs(y5 - y4) > 1e-6 )
    {
        var sita = (x5 - x4) / (y5 - y4);
        beta = 180.0 / Math.PI * Math.atan(sita);
    }
    else
    {
        if(x5 > x4)
        {
            beta = 90.0;
        }
        else
        {
            beta = -90.0;
        }
    }

    var deltaSita = beta;
    return deltaSita;
}


//////////////////////////////////////////////////////////////////
////关门
function CloseDoor(id1, id2, id3, id4, id5) {

    //id1，掩护梁节点1
    var x1 = blkdyn.GetNodeValue(id1, "Coord", 1);
    var y1 = blkdyn.GetNodeValue(id1, "Coord", 2);
    //id2，掩护梁节点2
    var x2 = blkdyn.GetNodeValue(id2, "Coord", 1);
    var y2 = blkdyn.GetNodeValue(id2, "Coord", 2);

    //id3，掩护梁与尾梁交点
    var x3 = blkdyn.GetNodeValue(id3, "Coord", 1);
    var y3 = blkdyn.GetNodeValue(id3, "Coord", 2);

    //id4，尾梁节点1
    var x4 = blkdyn.GetNodeValue(id4, "Coord", 1);
    var y4 = blkdyn.GetNodeValue(id4, "Coord", 2);

    //id5，尾梁节点2
    var x5 = blkdyn.GetNodeValue(id5, "Coord", 1);
    var y5 = blkdyn.GetNodeValue(id5, "Coord", 2);

    var alpha = 0.0;
    var beta  = 0.0;
    if( Math.abs(y2 - y1) > 1e-6 )
    {
        var sita = (x2 - x1) / (y2 -y1);
        alpha = 180.0 / Math.PI * Math.atan(sita);
    }
    else
    {
        if(x2 > x1)
        {
            alpha = 90.0;
        }
        else
        {
            alpha = -90.0;
        }
    }


    if( Math.abs(y5 - y4) > 1e-6 )
    {
        var sita = (x5 - x4) / (y5 - y4);
        beta = 180.0 / Math.PI * Math.atan(sita);
    }
    else
    {
        if(x5 > x4)
        {
            beta = 90.0;
        }
        else
        {
            beta = -90.0;
        }
    }

    var deltaSita = beta - alpha;
    return deltaSita;
}




//////////////////////////////////////////////////////////////////////结束函数定义

//测试案例
setCurDir(getSrcDir());
dyna.Clear();
doc.clearResult();
blkdyn.ImportGrid("gid","rota.msh");

//掩护梁节点
var id1 = blkdyn.GetNodeID(2.63135,  4.04115, 0);
var id2 = blkdyn.GetNodeID(1.52583, 2.86997, 0);

//掩护梁与尾梁交接点
var id3 = blkdyn.GetNodeID(1.1296, 1.77758, 0);

//尾梁坐标
var id4 = blkdyn.GetNodeID(0.429072, 1.60245, 0);
var id5 = blkdyn.GetNodeID(-0.267075, 0.84063, 0);


//再次读取交点坐标，原来输入的值可能不精确
var fcx = blkdyn.GetNodeValue(id3,"Coord",1);
var fcy = blkdyn.GetNodeValue(id3,"Coord",2);
var fcz = blkdyn.GetNodeValue(id3,"Coord",3);

/////////////////////////////////////////////////////////////////////////////////////////
//////逐渐旋转

dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0 0 0");
dyna.Set("If_Virtural_Mass 1");

blkdyn.SetModel("linear");
blkdyn.SetMat(7800, 2.1e11, 0.25, 235e6, 235e6, 0,0);
blkdyn.SetLocalDamp(0.0);
blkdyn.FixVByGroupInterface("xyz", 0.0, 1,1);


dyna.Set("Virtural_Step 0.5");
var RotaVel = 1e-4;
var Time_Step = 0.5;

for(var i = 0; i < 20; i++)
{

var OpenSita =  OpenDoor(id1, id2, id3, id4, id5);


var RotaStep = Math.abs (OpenSita /  (RotaVel * Time_Step * 360.0) );

print("Open RotaStep", RotaStep);


blkdyn.ApplyRotateCondition(1, [fcx, fcy, fcz],  [0,0,1],  RotaVel, 0.0, [0.0, 0.0, 0.0], 2, 2);

dyna.Solve(Math.floor(RotaStep));

var CloseSita =  CloseDoor(id1, id2, id3, id4, id5);

var RotaStep = Math.abs (CloseSita  /  (RotaVel * Time_Step  * 360.0) );


print("Close RotaStep", RotaStep);


blkdyn.ApplyRotateCondition(1, [fcx, fcy, fcz],  [0,0,-1],  RotaVel, 0.0, [0.0, 0.0, 0.0], 2, 2);

dyna.Solve( Math.floor(RotaStep) );
}
