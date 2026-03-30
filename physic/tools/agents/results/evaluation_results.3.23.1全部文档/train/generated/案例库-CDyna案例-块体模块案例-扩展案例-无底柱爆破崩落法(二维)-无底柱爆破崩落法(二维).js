setCurDir(getSrcDir());

// 清除平台数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ========== 模型参数定义 ==========
var CaveL = 4.0;      // 矿房长度
var CaveH = 3.0;      // 矿房高度
var ModelL = 30.0;    // 模型总长度
var ModelH = 40.0;    // 模型总高度
var BaseH = 8.0;      // 底板高度
var Size1 = 0.2;      // 矿房网格尺寸
var Size2 = 1.0;      // 围岩网格尺寸

// ========== 求解器设置 ==========
dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("UnBalance_Ratio 5e-4");
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");

// ========== 几何模型创建 ==========
var iloop1 = igeo.genRect(-ModelL * 0.5, 0, 0, ModelL * 0.5, ModelH, 0, Size2);
var iloop2 = igeo.genRect(-CaveL * 0.5, BaseH, 0, CaveL * 0.5, BaseH + CaveH, 0, Size1);

igeo.genSurface([iloop1, iloop2], 1);

// ========== 网格生成 ==========
imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

// ========== 界面与接触设置 ==========
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ========== 单元模型设置 ==========
blkdyn.SetModel("linear");
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1.0);
blkdyn.SetIStrengthByElem();

// ========== 材料参数设置 ==========
blkdyn.SetMat(3200, 6e10, 0.22, 20e6, 10e6, 39, 15);

// ========== 爆破起爆点设置 ==========
var BlastTopC = [0, BaseH + CaveH + 20.0, 0]; // 顶部炮孔位置
var HoleDist = 2.0; // 炮孔间距

// 设置朗道爆源参数 (ID=1)
blkdyn.SetLandauSource(1, 115, 5600, 3.4e6, 3.0, 1.3333, 9e9, BlastTopC, 0.0, 1e-2);

// 绑定爆源到材料组
blkdyn.BindLandauSource(1, 1, 1);

// ========== 边界条件设置 ==========
// 固定底部节点速度（模拟支撑）
blkdyn.FixV("xyz", 0.0, "y", -BaseH - 1e-3, BaseH + 1e-3, -ModelL * 0.5 - 1e-3, ModelL * 0.5 + 1e-3);

// ========== 监测点设置 ==========
// 监测Y方向位移
dyna.Monitor("block", "ydis", 0, ModelH, 0);
dyna.Monitor("block", "ydis", CaveL / 2, BaseH + CaveH / 2, 0);

// 监测X方向应力
for (var i = 0; i <= 3; i++) {
    dyna.Monitor("block", "sxx", -ModelL * 0.5 + i * ModelL / 4, BaseH + CaveH / 2, 0);
}

// ========== 求解循环 ==========
dyna.BeforeCal();

for (var i = 0; i < 10000; i++) {
    // 核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    var nodeUnbal = blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// ========== 计算结束 ==========
dyna.DynaCycle(5000);
