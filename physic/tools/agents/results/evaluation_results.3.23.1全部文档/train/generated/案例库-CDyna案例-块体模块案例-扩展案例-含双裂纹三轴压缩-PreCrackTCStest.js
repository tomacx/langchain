setCurDir(getSrcDir());

// ==================== 1. 初始化全局仿真参数 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Contact_Detect_Tol 0.00");
dyna.Set("GiD_Out 0");
dyna.Set("Msr_Out 0");
dyna.Set("Moniter_Iter 100");
dyna.Set("Renew_Interval 100");
dyna.Set("If_Renew_Contact 0");
dyna.Set("SaveFile_Out 0");

// 启用裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");
dyna.Set("FS_Solid_Interaction 1");

// ==================== 2. 设置TCK/KUS材料参数 ====================
// 编号为1，断裂韧度7.67e5 Pa√m，最大体积拉伸应变率100.0/s
// fk=2.3e24, fm=7.0, fSita=1.0
blkdyn.SetTCKUSMat(1, 7.67e5, 100.0, 2.3e24, 7.0, 1.0);

// ==================== 3. 导入网格并创建接触面 ====================
blkdyn.ImportGrid("gmsh", "pre-crack-2.msh");
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

// ==================== 4. 设置模型和材料参数 ====================
// 主体块体材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度
blkdyn.SetMatByGroup(2700, 5e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 接触面材料参数
blkdyn.SetIModel("linear");
blkdyn.SetIMat(5e13, 5e13, 30, 3e6, 3e6);

// ==================== 5. 设置裂缝材料参数 ====================
// 裂缝1：沿坐标点定义
var coord1 = new Array(0.025, 0.0625, 0);
var coord2 = new Array(0.05, 0.0875, 0);
blkdyn.SetIMatByLine(1e11, 1e11, 10, 0.0, 0.0, coord1, coord2, 1e-6);

// 裂缝2：沿坐标点定义
var coord3 = new Array(0.05, 0.1125, 0);
var coord4 = new Array(0.075, 0.1375, 0);
blkdyn.SetIMatByLine(1e11, 1e11, 10, 0.0, 0.0, coord3, coord4, 1e-6);

// ==================== 6. 设置接触面摩擦参数 ====================
blkdyn.SetPreIFaceByFriction(1, 0, 11);

// ==================== 7. 设置边界条件 ====================
// 底部约束：y方向速度固定为0
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e-4, 1e-4, -1e10, 1e10);

// 顶部约束：y方向速度范围0.1999-0.21（用于轴向位移控制）
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, 0.1999, 0.21, -1e10, 1e10);

// ==================== 8. 设置三轴压缩荷载 ====================
// 轴向压力（顶部）
var axialLoad = new Array(2e6, 0, 0);
blkdyn.SetForceByCoord("y", 0.0, -1e10, 1e10, axialLoad);

// 侧向围压（左右两侧）
var lateralLoad = new Array(-2e6, 0, 0);
blkdyn.SetForceByCoord("x", 0.0, -1e10, 1e10, lateralLoad);

// ==================== 9. 设置裂隙渗流参数 ====================
// 密度、体积模量、渗透系数、裂隙初始开度、组号范围
fracsp.SetPropByGroup(1000.0, 1e7, 1e-14, 1e-8, 1, 1);

// ==================== 10. 初始化预裂纹条件 ====================
// 通过组对单元初始化裂隙条件（压力、饱和度等）
fracsp.InitConditionByGroup(0, 1, 1); // 初始压力为0，饱和度为1

// ==================== 11. 设置动态边界计算 ====================
// 在求解循环中调用此函数进行流体-固体耦合计算
// fracsp.CalDynaBound()将在每个时间步自动执行

// ==================== 12. 定义输出监测请求 ====================
// 裂纹密度监测（通过裂隙单元获取）
fracsp.SetElemValue(1, "CrackDensity", 0);

// 节点位移监测
fracsp.SetNodeValue(1, "DisplacementX", 0);
fracsp.SetNodeValue(2, "DisplacementY", 0);
fracsp.SetNodeValue(3, "DisplacementZ", 0);

// 压力值监测
fracsp.SetNodeValue(4, "Pressure", 0);

// ==================== 13. 设置求解参数并执行 ====================
dyna.Set("Time_Step 1e-5");
dyna.Solve(10000);

// ==================== 14. 仿真结束处理 ====================
// 获取关键节点位移值（示例）
var nodeDisplacement = fracsp.GetNodeValue(1, "DisplacementY");

// 获取裂隙单元压力值（示例）
var crackPressure = fracsp.GetElemValue(1, "Pressure");

// 输出监测结果
console.log("Simulation completed. Node displacement: " + nodeDisplacement);
console.log("Crack pressure: " + crackPressure);

// 保存结果文件
dyna.Set("SaveFile_Out 1");
