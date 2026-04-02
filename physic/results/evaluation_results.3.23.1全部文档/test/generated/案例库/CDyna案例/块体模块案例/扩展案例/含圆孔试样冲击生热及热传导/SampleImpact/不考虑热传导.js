setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算模块，开辟相应内存
dyna.Set("Config_PoreSeepage 1");

// 打开孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

// 导入gid格式的网格文件，孔隙渗流
blkdyn.ImportGrid("gid", "grid.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-6, 1e-6, 1e-6);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup (1000.0, 1e7, 0.0, 0.01, arrayK, 1.0);

// 获取节点ID
var id = blkdyn.GetNodeID(0.5, 0.5, 0);

// 获取节点坐标
var xcoord = blkdyn.GetNodeValue(id, "Coord0", 1);
var ycoord = blkdyn.GetNodeValue(id, "Coord0", 2);
var zcoord = blkdyn.GetNodeValue(id, "Coord0", 3);

print("xcoord: ", xcoord, "ycoord: ", ycoord,"zcoord: ", zcoord);

// 应用孔隙渗流条件
poresp.ApplyConditionByCoord("pp", 1e6, [0,0,0], xcoord - 1e-3, xcoord + 1e-3, ycoord - 1e-3, ycoord + 1e-3, zcoord - 1e-3, zcoord + 1e-3, false);

// 设置计算步长为500s
dyna.Set("Time_Step 500");

// 计算1万步
for(var i = 0; i < 10000; i++) {
    var fUnBal = poresp.CalPoreSeepage();

    if(i % 100 == 0) {
        var str = "Iter  = " + i + "  UnBal = " + fUnBal;
        print(str);
        dyna.PutStep();
    }
}

// 打印提示信息
print("Solution Finished");
