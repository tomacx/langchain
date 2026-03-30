setCurDir(getSrcDir());

// 清除所有模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度为0（无重力环境）
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

// 打开杆件结果文件输出开关
dyna.Set("Bar_Out 1");

// ========== 几何建模及网格划分 ==========

// 创建矩形环1（外边界）
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);

// 创建矩形环2（巷道轮廓）
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界的面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建矩形巷道，填实
igeo.genSurface([loopid2], 2);

// 产生二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear");

// 指定材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度、粘聚力、内摩擦角）
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 虚拟接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// ========== 冲击波加载设置 ==========

// 设置空气冲击波参数
// TNT质量: 100kg, 爆炸点坐标[5, 2, 3], 起爆时间0s, 声速340m/s, 衰减指数1.0
// X方向范围[-1, 3.81], Y方向范围[0.299, 5.701], Z方向范围[0.299, 5.701]
blkdyn.ApplyShockWaveByCoord(100.0, [5, 2, 3], 0, 340, 1.0, -1, 3.81, 0.299, 5.701, 0.299, 5.701);

// ========== 监测点设置 ==========

// 设置典型测点记录位移、速度、应力等物理量
dyna.Monitor("bloc", "disp vel stress");

// 设置监测点位置（巷道顶部中心）
dyna.MonitorPoint(1, [9.5, 9.5, 0]);

// 设置监测点记录频率
dyna.MonitorFreq(1, 10);

// ========== 求解计算 ==========

// 启动计算引擎并执行动力学分析求解过程
dyna.Run();

// 导出仿真结果文件
doc.ExportResult();

// 验证输出数据的完整性与准确性
var resultStatus = doc.CheckResult();
if (resultStatus) {
    console.log("仿真结果验证通过");
} else {
    console.log("仿真结果验证失败");
}
