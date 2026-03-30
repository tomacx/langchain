setCurDir(getSrcDir());

// 初始化求解器环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 100");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Cal_Rayleigh 1");

// 导入Gmsh格式网格（使用案例中的示例文件）
blkdyn.ImportGrid("gmsh", "circleblast.msh");

// 创建接触面并更新网格
blkdyn.CrtIFace(1, 1);
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型
blkdyn.SetModel("linear", 1);
blkdyn.SetModel("JWL", 2);

// 设置材料参数（岩石和炸药）
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 3e6, 1e6, 40.0, 10.0, 1, 2);

// 设置接触面模型为断裂能模型
blkdyn.SetIModel("FracE");

// 设置接触面基础材料参数
blkdyn.SetIMat(5e14, 5e14, 40.0, 10e6, 5e6);

// 设置组1与组2交界面的材料参数（摩擦角、粘聚力及抗拉强度均为0）
blkdyn.SetIMatByGroupInterface(5e14, 5e14, 0.0, 0.0, 0.0, 1, 2);

// 设置组1与组2交界面上的断裂能
blkdyn.SetIFracEnergyByGroupInterface(0.0, 0.0, 1, 2);

// 设置组1内部交界面的断裂能
blkdyn.SetIFracEnergyByGroupInterface(100, 1000, 1, 1);

// 设置JWL炸药参数（TNT）
var apos = [0.0, 0.0, 0.0];
blkdyn.SetJWLSource(1, 1630, 7e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 21e9, 6930.0, apos, 0.0, 10.0);

// 将JWL炸药参数与组2单元关联
blkdyn.BindJWLSource(1, 2, 2);

// 设置监测点（位移、速度、应力）
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 设置刚体部件的局部阻尼（平动和转动）
rdface.SetPartLocalDamp(0.02, 0.05);

// 计算前初始化
dyna.BeforeCal();

// 执行求解循环
for(var i = 0; i < 10000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if(i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// 导出最终结果
dyna.ExportResult();
