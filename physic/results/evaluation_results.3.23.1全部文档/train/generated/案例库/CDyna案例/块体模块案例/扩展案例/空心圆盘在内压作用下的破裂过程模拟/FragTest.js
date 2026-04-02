setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含裂隙渗流模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 10 0.0 0.0");

// 设置结果输出时步
dyna.Set("Output_Interval 2000");

igeo.genRectS(0, 0, 0, 500, 500, 0, 10, 1);

imeshing.genMeshByGmsh(2);

fracsp.GetMesh(imeshing);

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e7, 12e-9, 12e-6, 1, 11);

// 设置特定区域的渗流参数，使用圆柱体定义区域
fracsp.SetPropByCylinder(1000, 1e7, 12e-37, 12e-20, 150, 180, -1, 150, 180, 1.0, 0, 30);
fracsp.SetPropByCylinder(1000, 1e7, 12e-37, 12e-20, 450, 350, -1, 450, 350, 1.0, 0, 60);
fracsp.SetPropByCylinder(1000, 1e7, 12e-37, 12e-20, 310, 250, -1, 310, 250, 1.0, 0, 60);
fracsp.SetPropByCylinder(1000, 1e7, 12e-37, 12e-20, 250, 400, -1, 250, 400, 1.0, 0, 60);

// 获取节点ID
var id1 = fracsp.GetNodeID(50, 250, 0);
var id2 = fracsp.GetNodeID(450, 250, 0);

// 获取节点坐标值
var xCoord1 = fracsp.GetNodeValue(id1, "Coord", 1);
var yCoord1 = fracsp.GetNodeValue(id1, "Coord", 2);
var zCoord1 = fracsp.GetNodeValue(id1, "Coord", 3);

var xCoord2 = fracsp.GetNodeValue(id2, "Coord", 1);
var yCoord2 = fracsp.GetNodeValue(id2, "Coord", 2);
var zCoord2 = fracsp.GetNodeValue(id2, "Coord", 3);

// 定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

// 模型底部施加1MPa的水压力
fracsp.ApplyPressure(1e6, xCoord1, yCoord1, zCoord1);
