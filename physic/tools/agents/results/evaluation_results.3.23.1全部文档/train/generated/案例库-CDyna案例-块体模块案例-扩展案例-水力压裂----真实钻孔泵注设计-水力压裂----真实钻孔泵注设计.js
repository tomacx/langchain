setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 开启力学计算和裂隙渗流模块
dyna.Set("Mechanic_Cal 1");
dyna.Set("Config_FracSeepage 1");

// 设置重力加速度（Z方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置计算参数
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 1000");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-3");

// 创建三维岩石模型（20m x 20m x 20m）
blkdyn.GenBrick3D(20, 20, 20, 20, 20, 20, 1);

// 设置线弹性模型
blkdyn.SetModel("linear");

// 设置岩石材料参数（密度、杨氏模量、泊松比、抗拉强度、抗压强度等）
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 创建接触面以支持水力压裂计算
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置简单水力压裂参数（注入点坐标、压力等）
var fC = new Array(10.0, 10.0, 10.0); // 注入点位于模型中心
blkdyn.SetSimpleHyFracPram(1, 1, 1e6, 0.9, fC, true);

// 设置泵注孔属性（ID=1，液体类型，长度50m，直径0.1m）
fracsp.SetJetBoreHoleProp(1, 1, 1, 50, 0.1, 2.1e9, 1e6, 0.01);

// 将泵注孔与圆柱体范围内的裂隙节点关联
fracsp.BindJetBoreHolePropByCylinder(1, 9.5, 9.5, 9.5, 10.5, 10.5, 10.5, 0.3, 0.7);

// 设置孔隙渗流参数
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("Seepage_Mode 1"); // 瞬态可压缩液体渗流

// 初始化模型范围内的孔隙压力和饱和度（注入点附近）
poresp.InitConditionByCoord(1000.0, 1e6, 1.0, 0.3, 1e-12, 1.0, -500, 500, -500, 500);

// 设置四周水压力边界条件
var fArrayGrad = new Array(0.0, 0.0, 0.0);
poresp.ApplyConditionByCoord("pp", 1e5, fArrayGrad, -10, 10, -10, 10, true);

// 设置监测点（监测压力和位移）
dyna.Monitor("block", "fpp", 9.5, 10.0, 10.0);
dyna.Monitor("block", "fpp", 10.0, 10.0, 10.0);
dyna.Monitor("block", "ydis", 10.0, 10.0, 9.5);

// 计算前初始化
dyna.BeforeCal();

// 循环迭代求解
for(var i = 0; i < 20000; i++) {
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

print("Solution Finished");
