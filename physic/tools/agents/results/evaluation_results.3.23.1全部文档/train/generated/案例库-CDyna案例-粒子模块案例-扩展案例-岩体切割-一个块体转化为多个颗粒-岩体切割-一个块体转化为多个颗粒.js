setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.4");
dyna.Set("SaveFile_Out 1");

// ==================== 2. 导入网格并设置块体参数 ====================
blkdyn.ImportGrid("gid", "rock.msh");

// 创建边界面（底部和侧面约束）
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtBoundIFaceByGroup(2);

// 更新网格以支持块体-颗粒转化
blkdyn.UpdateIFaceMesh();

// ==================== 3. 设置材料模型与参数 ====================
blkdyn.SetModel("brittleMC");

// 设置岩石材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 5e6, 2e6, 40.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 5e6, 2e6, 40.0, 10.0, 2);

// 设置块体软化参数（体积膨胀断裂应变及等效剪切断裂应变）
dyna.Set("Block_Soften_Value 0.005 0.01");

// ==================== 4. 配置块体转化为颗粒规则 ====================
// 允许块体变为颗粒的开关，第二个参数为最大转化颗粒数
dyna.Set("If_Allow_Block_To_Particles 1 40");

// 单元杀死选项（断裂应变相关）
dyna.Set("Elem_Kill_Option 1 0.03 0.01 1 1");

// ==================== 5. 设置边界条件与载荷 ====================
// Y方向底部法向约束（固定底部）
blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);

// X方向顶部施加水平速度（模拟切割头或外部驱动）
blkdyn.FixV("x", 0.0, "x", 0.401, 100);

// Y方向顶部施加竖直向下速度（模拟重力加载或冲击）
blkdyn.FixV("y", -10.0, "y", 0.401, 100);

// ==================== 6. 设置阻尼与接触参数 ====================
// 设置全部节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// ==================== 7. 设置监测点 ====================
// 监测典型测点的应力演化（x方向位移和y方向应力）
dyna.Monitor("block", "xdis", 0.0, 0.4, 0);
dyna.Monitor("block", "syy", 0.05, 0.2, 0);
dyna.Monitor("block", "syy", 0.05, 0.1, 0);

// ==================== 8. 配置求解器输出设置 ====================
// 设置动态计算时步为1e-4秒
dyna.Set("Time_Step 1e-4");

// 关闭虚拟质量开关（块体模块通常不需要）
dyna.Set("If_Virtural_Mass 0");

// 设置结果输出格式
dyna.Set("GiD_Out 1");

// ==================== 9. 执行求解 ====================
// 计算步数根据物理过程调整，建议120000步以上以观察完整破裂演化
dyna.Solve(120000);
