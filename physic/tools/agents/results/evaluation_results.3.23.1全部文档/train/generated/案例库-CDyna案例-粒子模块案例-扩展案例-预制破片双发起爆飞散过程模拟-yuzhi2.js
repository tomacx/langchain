setCurDir(getSrcDir());

// 初始化环境设置
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 2.0e-3");
dyna.Set("Output_Interval 500");
dyna.Set("Block_Soften_Value 0.2 0.2");
dyna.Set("If_Cal_Particle 0");

// 生成预制破片网格（使用imeshing模块）
var fragmentGroup = "fragment";
var brickLengthX = 0.1;
var brickLengthY = 0.1;
var gridCountX = 20;
var gridCountY = 20;
imeshing.genBrick2D(fragmentGroup, brickLengthX, brickLengthY, gridCountX, gridCountY);

// 生成炸药区域网格
var chargeGroup = "charge";
var chargeLengthX = 0.31;
var chargeLengthY = 0.31;
var chargeGridCountX = 5;
var chargeGridCountY = 5;
imeshing.genBrick2D(chargeGroup, chargeLengthX, chargeLengthY, chargeGridCountX, chargeGridCountY);

// 创建边界界面
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型为线弹性模型
blkdyn.SetModel("linear");

// 设置炸药材料参数（密度、杨氏模量、泊松比、粘聚力、抗拉强度、摩擦角、内摩擦角、膨胀角）
blkdyn.SetMat(1630, 7e9, 0.25, 3e6, 1e6, 35, 15);

// 设置破片材料参数（钢）
blkdyn.SetMat(7800, 2e11, 0.3, 10e6, 10e6, 0, 0, 1);

// 设置接触面模型为脆性MC模型
blkdyn.SetIModel("brittleMC");

// 设置接触面参数
blkdyn.SetIMat(5e11, 5e11, 0.01, 0, 0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.0);

// 施加重力
blkdyn.ApplyGravity();

// 设置双发起爆点位置
var pos = new Array(2);
pos[0] = [0.31, 0.0, 0];
pos[1] = [-0.31, 0.0, 0];

// 设置朗道爆源参数（序号、密度、爆速、爆热、初始段绝热指数、第二段绝热指数、波阵面压力、点火点位置、点火时间、持续时间）
blkdyn.SetLandauSource(1, 1630, 8070, 5.67e6, 3.0, 1.3333, 21e9, pos[0], 0.0, 100);
blkdyn.SetLandauSource(2, 1630, 8070, 5.67e6, 3.0, 1.3333, 21e9, pos[1], 0.0, 100);

// 将各组号单元与对应的爆源模型序号绑定
blkdyn.BindLandauSource(1, 1, 1);
blkdyn.BindLandauSource(2, 2, 2);

// 设置气体逸散参数（特征时间、特征指数、爆源ID范围）
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 2);

// 运行计算并监测
var totalTime = 0.05; // 总计算时间 50ms
var failureFlag = dyna.DynaCycle(totalTime);

// 检查计算是否成功
if (failureFlag === 0) {
    console.log("计算完成，无失败标志");
} else if (failureFlag === 2) {
    console.log("计算过程中出现剪坏");
} else {
    console.log("计算失败，失败标志：" + failureFlag);
}

// 输出结果文件路径设置
var resultDir = getSrcDir() + "/results/";
if (!resultDir.endsWith("/")) {
    resultDir += "/";
}

// 保存破片轨迹数据
blkdyn.ExportParticleTrajectory(resultDir + "fragment_trajectory.dat");

// 保存爆炸压力曲线
blkdyn.ExportPressureCurve(resultDir + "explosion_pressure.dat");

// 保存计算结果
blkdyn.ExportResult(resultDir + "simulation_result.dat");
