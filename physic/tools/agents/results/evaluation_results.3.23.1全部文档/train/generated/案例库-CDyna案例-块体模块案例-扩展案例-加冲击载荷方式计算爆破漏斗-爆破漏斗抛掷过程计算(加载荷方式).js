setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
doc.clearResult();
dyna.Clear();

// 定义模型尺寸参数
var Length = 15;
var Height = 5;
var CenterX = Length / 2.0;
var CenterY = 3.0;
var Rad = 0.75;
var Size1 = 0.4;
var Size2 = 0.2;

// 创建几何模型：矩形区域和圆形孔洞
igeo.genRect(0, 0, 0, Length, Height, 0, Size1);
igeo.genCircle(CenterX, CenterY, 0.0, Rad, Size2);
igeo.genSurface([1, 2], 1);

// 生成网格
imeshing.genMeshByGmsh(2);

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度矢量 (X=0, Y=-9.8, Z=0)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置输出和监测参数
dyna.Set("Output_Interval 2000");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Elem_Kill_Option 1 1 1 1 1");

// 获取网格并创建接触面
blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

// 设置线弹性材料模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 固定模型底部所有方向的速度边界条件
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);
blkdyn.FixV("y", 0, "y", -0.0001, 0.0001);
blkdyn.FixV("z", 0, "z", -0.0001, 0.0001);

// 设置起爆点位置数组
var pos = new Array(3);
pos[0] = [CenterX, CenterY, 0];
pos[1] = [CenterX + 0.5, CenterY, 0];
pos[2] = [CenterX - 0.5, CenterY, 0];

// 设置JWL爆源参数：ID、密度、弹性模量、体积模量、拉梅常数、气体指数、特征时间等
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 15e-3);

// 配置爆生气体逸散衰减参数：特征时间、特征指数、爆源ID范围
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);

// 绑定JWL爆源到单元
blkdyn.BindJWLSource(1, 1, 100);

// 设置监测点追踪爆破漏斗材料的位移和速度
dyna.Monitor("block", "ydis", CenterX, CenterY, 0);
dyna.Monitor("block", "xdis", CenterX, CenterY, 0);
dyna.Monitor("block", "zdis", CenterX, CenterY, 0);

// 执行计算前初始化操作
dyna.BeforeCal();

// 运行求解器循环
for (var i = 0; i < 10000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

print("Solution Finished");
