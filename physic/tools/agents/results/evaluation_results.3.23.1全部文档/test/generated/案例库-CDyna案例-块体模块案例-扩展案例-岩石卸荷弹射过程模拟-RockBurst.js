setCurDir(getSrcDir());

// 清除所有模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 1. 全局参数配置 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("UnBalance_Ratio 1e-2");

// ==================== 2. 几何建模（岩体+开挖边界） ====================
// 创建外边界矩形环（岩体轮廓）
var loopid1 = igeo.genRect(0, 0, 0, 30, 30, 0, 1.0);

// 创建内部巷道开挖边界
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 生成带孔洞的外表面
igeo.genSurface([loopid1, loopid2], 1);

// 填实巷道区域
igeo.genSurface([loopid2], 2);

// ==================== 3. 网格划分 ====================
imeshing.genMeshByGmsh(2);

// 从平台获取网格
var msh = imeshing;
blkdyn.GetMesh(msh);

// 创建接触面（巷道两侧）
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(2);

// 更新接触面网格信息
blkdyn.UpdateIFaceMesh();

// ==================== 4. 材料属性设置（Mohr-Coulomb弹塑性） ====================
// 岩体材料参数：密度(kg/m³), 弹性模量(Pa), 泊松比, 内聚力(Pa), 摩擦角(度), 断裂能(J/m²)
blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 35.0, 15.0);

// 接触面模型设为线弹性
blkdyn.SetIModel("linear");

// 接触面刚度强度从单元自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// ==================== 5. 初始地应力边界条件（深部采矿环境） ====================
// 定义三个方向基础地应力值（深部高地应力环境）
var InitPP = 80e6; // 80MPa初始地应力
var values = new Array(-InitPP, -InitPP, -InitPP);

// 定义变化梯度（均匀场）
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

// 将控制范围内的应力初始化
blkdyn.InitConditionByCoord("stress", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// ==================== 6. 开挖触发事件（块体移除模拟） ====================
// 设置开挖面位置（巷道中心区域）
var ExcavationPos = new Array(10.0, 10.0, 0.0);
var ExcavationSize = new Array(4.0, 3.0, 2.0);

// 设置开挖触发时间（t=0时开始移除）
blkdyn.SetExcavateByCoord(ExcavationPos[0], ExcavationPos[1], ExcavationPos[2],
                          ExcavationSize[0], ExcavationSize[1], ExcavationSize[2], 0.0);

// ==================== 7. 监测点设置 ====================
// 监测巷道中心点位移（Y方向）
dyna.Monitor("block", "ydis", 10.0, 10.0, 0.0);

// 监测应力集中区域（X方向正应力）
dyna.Monitor("gvalue", "sx", 8.5, 11.5, 0.0);

// 监测裂纹扩展路径（Y方向位移梯度）
dyna.Monitor("block", "ydis", 8.0, 12.0, 0.0);

// ==================== 8. 时间步长与求解设置 ====================
dyna.TimeStepCorrect(0.5);

// 设置总计算时间（秒）
var TotalTime = 0.5;

// 启动动态分析
dyna.Run(TotalTime);

// ==================== 9. 输出结果配置 ====================
// 能量释放、体积变化和破坏统计通过标准输出文件自动记录
// 可通过RunUDFCmd调用自定义命令获取特定统计信息
