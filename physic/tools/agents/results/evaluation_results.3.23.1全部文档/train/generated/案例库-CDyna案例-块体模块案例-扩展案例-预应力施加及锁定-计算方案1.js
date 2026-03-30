setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 创建混凝土块体几何
var id1 = igeo.genBrickV(0, 0, 0, 1.0, 0.3, 0.3, 0.05, 1);

// 创建圆柱形锚头几何
var id2 = igeo.genCylinderV(-0.1, 0.15, 0.15, 0, 0.15, 0.15, 0.0, 0.1, 0.02, 0.02, 2);

// 几何体绑定
igeo.glue("volume", id1, id2);

// 网格划分
imeshing.genMeshByGmsh(3);

// 设置计算参数
dyna.Set("If_Cal_Bar 1");
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Mechanic_Cal 1");
dyna.Set("Large_Displace 1");

// 获取网格并创建界面
blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// 设置单元模型为线弹性
blkdyn.SetModel("linear");

// 设置混凝土材料参数（组1）
blkdyn.SetMat(2500, 3e10, 0.25, 10e6, 5e6, 35, 10, 1);

// 设置钢筋材料参数（组2）
blkdyn.SetMat(7800, 2e11, 0.3, 200e6, 200e6, 35, 10, 2);

// 设置界面模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置界面材料参数
blkdyn.SetIMat(1e12, 1e12, 10.0, 0.0, 0.0);

// 固定底部边界（X方向）
blkdyn.FixV("xyz", 0.0, "x", 0.999, 1.01);

// 创建锚索
var fArrayCoord1 = [-0.095, 0.15, 0.15];
var fArrayCoord2 = [0.8, 0.15, 0.15];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 30);

// 设置锚索力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

// 定义锚索材料属性（自由段）
var BarPropFree = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.4, 0.0];
// 定义锚索材料属性（锚固段）
var BarPropBond = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.4, 0.0];

// 指定自由段材料
bar.SetPropByID(BarPropFree, 1, 10, 1, 23);

// 指定锚固段材料
bar.SetPropByID(BarPropBond, 1, 10, 24, 30);

// 在锚索第一个节点施加预应力（1kN）
bar.ApplyPreTenForce(1e3, 1, 11, 1, 1);

// 设置监测点 - 锚索轴向力
dyna.Monitor("bar", "a_normal_force", 0, 0.15, 0.15);
dyna.Monitor("bar", "a_normal_force", 0.2, 0.15, 0.15);

// 计算前初始化
dyna.BeforeCal();

// 循环迭代求解
for(var i = 0; i < 10000; i++) {
    // 核心求解器积分计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 定期保存结果
    if(i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// 计算完成后输出最终监测数据
dyna.OutputMonitorData();
