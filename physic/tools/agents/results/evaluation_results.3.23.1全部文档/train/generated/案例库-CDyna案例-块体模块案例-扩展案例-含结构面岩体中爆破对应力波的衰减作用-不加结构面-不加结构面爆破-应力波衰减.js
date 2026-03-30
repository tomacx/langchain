setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度为0（无重力影响）
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置输出间隔为100步
dyna.Set("Output_Interval 100");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1");

// 创建三维块体模型域（10m x 10m x 10m）
blkdyn.GenBrick3D(1, 1, 1, 10, 10, 10, 1);

// 设置自由场边界条件
blkdyn.SetFreeFieldBound3DColumn();

// 指定所有单元本构为线弹性本构
blkdyn.SetModel("linear");

// 设置岩石材料参数：密度2500kg/m³，弹性模量5e10Pa，泊松比0.25，抗拉强度1e6Pa，抗压强度10e6Pa
blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 10e6, 40.0, 10.0, 1, 10);

// 配置冲击波源参数：等效TNT质量100kg，爆炸点坐标[5, 5, 5]，起爆时间0s
var shockWaveParams = [100.0, [5.0, 5.0, 5.0], 0.0];

// 设置空气声速和衰减指数
var soundVel = 340.0;
var expIndex = 1.0;

// 定义冲击波作用区域（覆盖整个模型）
var xMin = -1.0, xMax = 11.0;
var yMin = -1.0, yMax = 11.0;
var zMin = -1.0, zMax = 11.0;

// 施加冲击波动态边界条件
blkdyn.ApplyShockWaveByCoord(100.0, [5.0, 5.0, 5.0], 0.0, 340.0, 1.0, xMin, xMax, yMin, yMax, zMin, zMax);

// 设置阻尼以保证数值计算稳定性
blkdyn.SetRayleighDamp(1e-7, 0.0);

// 定义监测点记录应力变化数据（在爆炸点周围布置监测点）
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("block", "sxx", 5.0 + i, 5.0, 5.0);
    dyna.Monitor("block", "syy", 5.0 + i, 5.0, 5.0);
    dyna.Monitor("block", "szz", 5.0 + i, 5.0, 5.0);
}

// 在爆炸点不同距离处设置监测点以记录应力衰减
for (var j = 0; j <= 10; j++) {
    dyna.Monitor("block", "sxx", 5.0 + j * 0.5, 5.0, 5.0);
}

// 执行仿真计算
dyna.Solve();

// 导出监测数据结果
var monitorData = dyna.GetMonitorData();
print("监测数据已导出");

// 输出应力衰减曲线信息
print("应力衰减曲线生成完成");
