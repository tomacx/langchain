setCurDir(getSrcDir());

// 全局仿真参数设置
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("Particle_Renew_Interval 1");

// 刚性板模型设置 - 使用板单元类型(2)
dyna.Set("RdFace_MechModel 2");
dyna.Set("If_Search_PBContact_Adavance 1");

// 创建底部刚性板（固定边界）
var plateCoord = [-5.0, -5.0, 0.0, 5.0, -5.0, 0.0];
rdface.Create(1, 1, 2, plateCoord);

var plateCoord2 = [-5.0, -5.0, 0.0, -5.0, 5.0, 0.0];
rdface.Create(1, 1, 2, plateCoord2);

var plateCoord3 = [5.0, -5.0, 0.0, 5.0, 5.0, 0.0];
rdface.Create(1, 1, 2, plateCoord3);

var plateCoord4 = [-5.0, 5.0, 0.0, -5.0, 5.0, 0.0];
rdface.Create(1, 1, 2, plateCoord4);

// 设置板材料参数（密度、弹性模量、泊松比、屈服强度等）
rdface.SetDeformMat(2500, 3e9, 0.25, 3e6, 1e6, 35, 0.01);

// 设置板边界条件 - 固定底部
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

// 创建随机分布的颗粒
var xRange = [4.5, 5.5];
var yRange = [4.5, 5.5];
var zRange = [0.2, 1.0];
pdyna.CreateByCoord(3000, 1, 2, 0.1, 0.1, 0.1, xRange, yRange, zRange);

// 设置颗粒接触模型为脆性Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
pdyna.SetMat(2500, 5e8, 0.25, 0.0, 0.0, 0.0, 0.0, 0.05);

// 设置监测变量 - 板节点Z向速度和位移
dyna.Monitor("rdface", "rg_NodeVelZ", 5, 5, 0);
dyna.Monitor("rdface", "rg_NodeDisZ", 5, 5, 0);

// 设置动态计算时步
dyna.Set("Time_Step 2e-4");

// 执行求解 - 计算3万步
dyna.Solve(30000);
