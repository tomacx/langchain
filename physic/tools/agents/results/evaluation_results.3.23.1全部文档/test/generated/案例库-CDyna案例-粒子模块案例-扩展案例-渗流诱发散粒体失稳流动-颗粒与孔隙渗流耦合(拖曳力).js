setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Cal_Particle 1");

// 包含孔隙渗流计算模块，开辟相应内存
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");

// ==================== 2. 定义散粒体材料参数及流体物理属性 ====================
// 设置颗粒本构模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 30, 0.0, 0.3);

// 设置颗粒与流体耦合参数：耦合模式2，渗透率计算系数，动力粘度、最大渗透系数、最小孔隙率
dyna.Set("Par_PoreSp_Couple_Option 2 1.0 1e-3 1e-2 1e-2 1.0");

// ==================== 3. 创建离散颗粒单元 ====================
// 创建计算域内的颗粒（例如：50x50x50的立方体区域）
var x = [-2, 2];
var y = [-2, 2];
var z = [-1, 1];
pdyna.CreateByCoord(10000, 1, 1, 0.05, 0.1, 0.05, x, y, z);

// ==================== 4. 配置孔隙渗流模块参数 ====================
// 瞬态可压缩液体渗流模式
dyna.Set("Seepage_Mode 1");
// 牛顿流体定律
dyna.Set("Liquid_Seepage_Law 1");
// 截止开度
dyna.Set("PS_CirInject_Width 1e-6");
// 最小孔隙开度
dyna.Set("Pore_Min_Width 1e-6");
// 是否更新孔隙率
dyna.Set("If_Renew_Porosity 0");

// 定义X、Y、Z三个方向的渗透系数（各向同性）
var arrayK = new Array(1e-7, 1e-7, 1e-7);

// 指定坐标控制范围内的孔隙渗流参数：流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.35, arrayK, 1.0, -2, 2, -2, 2, -1, 1);

// ==================== 5. 初始化压力及饱和度 ====================
// 对特定坐标范围内的单元初始化初始压力（例如：底部区域）
poresp.ApplyConditionByCoord("pp", 1e5, [0, 0, 0], -2, 2, -2, 2, -1.5, -0.5, false);

// ==================== 6. 施加入口流量及出口动态压力边界条件 ====================
// 入口（左侧面）施加流量边界条件
poresp.ApplyConditionByCylinder("inlet", 1e-4, [0, 0, 0], -2, 2, -2, 2, -2, -2, false);

// 出口（右侧面）施加动态压力边界条件
poresp.ApplyConditionByCylinder("outlet", 5e4, [0, 0, 0], 2, 2, -2, 2, -2, -2, true);

// ==================== 7. 开启粒子与流体耦合计算，设置拖曳力参数 ====================
// 设置拖曳力相关参数以模拟渗流诱发失稳流动
dyna.Set("If_Drag_Force 1");
dyna.Set("Drag_Coefficient 0.5");

// ==================== 8. 定义监测点位置并配置输出变量 ====================
// 获取中心节点ID用于监测
var id = blkdyn.GetNodeID(0.0, 0.0, 0.0);

// 设置求解器参数
dyna.Set("Time_Step 1e-5");
dyna.Set("Solver_MaxIter 1000");
dyna.Set("Solver_Tol 1e-6");

// ==================== 9. 启动核心计算 ====================
// 迭代求解（根据物理过程设定步数）
dyna.Solve(20000);

// ==================== 10. 后处理分析 ====================
print("Simulation completed successfully.");
print("Results saved to output directory.");
