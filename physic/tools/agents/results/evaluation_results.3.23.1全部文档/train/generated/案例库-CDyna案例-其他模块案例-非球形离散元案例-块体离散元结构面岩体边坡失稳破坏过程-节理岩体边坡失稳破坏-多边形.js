setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Clear();
doc.clearResult();

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置云图输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置虚拟时步
dyna.Set("Virtural_Step 0.4");

// 设置不平衡率
dyna.Set("UnBalance_Ratio 5e-4");

// 关闭虚质量计算开关（初始开启，求解前关闭）
dyna.Set("If_Virtural_Mass 1");

// ==================== 2. 导入几何网格模型 ====================
// 导入块体网格（多边形节理岩体边坡）
blkdyn.ImportGrid("gid", "blockmesh.msh");

// 导入刚性面边界（节理面、固定边界等）
rdface.Import("gid", "bound.msh");

// 更新界面网格拓扑信息
blkdyn.UpdateIFaceMesh();

// ==================== 3. 定义块体材料属性 ====================
// 设置块体单元本构模型为线弹性（初始状态）
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
// 密度2500kg/m³，弹性模量1e8 Pa，泊松比0.3，抗拉/抗压强度1e6 Pa，内摩擦角35度
blkdyn.SetMat(2500, 1e8, 0.3, 1e6, 1e6, 35, 35);

// ==================== 4. 设置接触界面参数 ====================
// 设置接触面本构模型为线弹性
blkdyn.SetIModel("linear");

// 设置接触面材料参数：法向/切向刚度、粘聚力、内摩擦角
// 接触面刚度从单元自动获取，初始粘聚力和内摩擦角设为较小值模拟节理面
blkdyn.SetIMat(1e9, 1e9, 0.0, 0.0, 25);

// 设置接触容差为0.005m
dyna.Set("Contact_Detect_Tol 0.005");

// ==================== 5. 施加初始边界条件 ====================
// 固定底部Y方向位移（边坡底部约束）
blkdyn.FixV("y", 0, "y", -1e-2, 1e-2);

// 固定两侧X方向位移（防止侧向刚体运动）
blkdyn.FixV("x", 0, "x", -1e-2, 1e-2);
blkdyn.FixV("x", 0, "x", 2.51, 2.53);

// ==================== 6. 配置动态触发条件 ====================
// 设置重力加速度（Y方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置计算时步
dyna.Set("Time_Step 5e-3");

// ==================== 7. 设置监测函数 ====================
// 监测边坡顶部块体Y方向位移（失稳关键指标）
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);

// 监测边坡中部块体Y方向位移
dyna.Monitor("block", "ydis", 1.14, 2.0, 0);

// 监测系统断裂度（损伤因子）
dyna.Monitor("gvalue", "gv_block_crack_ratio");

// 监测块体强损伤区体积占比
dyna.Monitor("gvalue", "gv_block_strong_damage_ratio");

// 监测系统总动能和势能
dyna.Monitor("gvalue", "gv_block_kinetic_energy");
dyna.Monitor("gvalue", "gv_block_gravity_energy");

// ==================== 8. 调整求解器参数 ====================
// 设置局部阻尼为0.01（确保数值稳定性）
blkdyn.SetLocalDamp(0.01);

// 自动优化计算时间步长
dyna.TimeStepCorrect(0.8);

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// ==================== 9. 调用核心求解函数 ====================
// 求解至稳定状态（模拟边坡失稳破坏过程）
dyna.Solve();

print("Solution is OK!");
