setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("RdFace_MechModel 2");

// 加载网格数据到刚柔性面求解器
GetMesh();

// 创建三维柔性面实体对象 (使用Create接口)
var faceGroup = 1;
var totalPoints = 6;
var coords = [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1];
rdface.Create(2, faceGroup, totalPoints, coords);

// 设置柔性面材料属性 (使用SetPropByCoord接口)
rdface.SetPropByCoord(faceGroup, 0.2, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

// 分配模型配置给已创建的面 (使用SetModelByGroup接口)
rdface.SetModelByGroup(1, faceGroup, 1);

// 构建三维柔性面线段定义坐标并创建接触面 (使用CrtIFaceByCoord接口)
blkdyn.CrtIFaceByCoord([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1]);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定组号为1的材料参数
blkdyn.SetMat(2500, 1e9, 0.3, 6e3, 3e3, 25.0, 10.0, 1);

// 设定接触面上的材料属性
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

// 设定全部节点的局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 施加初始速度条件到柔性段上 (使用ApplyVelocityByCoord接口)
rdface.ApplyVelocityByCoord(faceGroup, 0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5, -1e5, 1e5);

// 设置动态计算时步
dyna.Set("Time_Step 1e-4");

// 设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置子空间更新时步为100步
dyna.Set("Renew_Interval 100");

// 设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-3");

// 打开save文件自动保存开关
dyna.Set("SaveFile_Out 1");

// 运行用户自定义命令流启动求解器 (使用RunUDFCmd接口)
var solveCmd = "Solve";
dyna.RunUDFCmd(solveCmd);

// 监控收敛状态并检查错误信息
var status = dyna.Get("Calc_Status");
if (status != 0) {
    console.log("计算过程中出现异常，状态码: " + status);
}

// 导出最终的仿真结果和监测数据到指定的输出目录中
dyna.ExportResults();
