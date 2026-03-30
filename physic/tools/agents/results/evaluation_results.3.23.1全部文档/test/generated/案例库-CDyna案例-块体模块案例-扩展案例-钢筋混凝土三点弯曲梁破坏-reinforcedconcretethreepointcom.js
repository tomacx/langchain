setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（混凝土结构通常考虑自重）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步
dyna.Set("Monitor_Iter 100");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 1e-5");

// 关闭虚质量计算
dyna.Set("If_Virtural_Mass 0");

// 加载自定义模型动态链接库
dyna.LoadUDF("CustomModel");

// 创建三点弯曲梁几何（简化为块体单元模拟）
igeo.GeneratePoint([0, 0, 0]);
igeo.GeneratePoint([1.0, 0, 0]);
igeo.GeneratePoint([2.0, 0, 0]);
igeo.GeneratePoint([3.0, 0, 0]);
igeo.GeneratePoint([0, 0.5, 0]);
igeo.GeneratePoint([1.0, 0.5, 0]);
igeo.GeneratePoint([2.0, 0.5, 0]);
igeo.GeneratePoint([3.0, 0.5, 0]);
igeo.GeneratePoint([0, 1.0, 0]);
igeo.GeneratePoint([1.0, 1.0, 0]);
igeo.GeneratePoint([2.0, 1.0, 0]);
igeo.GeneratePoint([3.0, 1.0, 0]);

// 创建梁体块单元（混凝土）
igeo.CreateBlock([0, 0, 0], [3.0, 1.0, 0], [0.1, 0.1, 0.1]);

// 创建钢筋网格（简化为内部增强层）
igeo.GeneratePoint([0.5, 0.25, 0]);
igeo.GeneratePoint([1.5, 0.25, 0]);
igeo.GeneratePoint([2.5, 0.25, 0]);

// 创建钢筋块单元
igeo.CreateBlock([0.4, 0.2, 0], [2.6, 0.3, 0], [0.1, 0.1, 0.1]);

// 生成网格
imeshing.GenerateMesh();

// 获取网格对象
var mesh = imeshing.GetMesh();

blkdyn.GetMesh(mesh);

// 创建接触面（梁顶面与加载点接触）
blkdyn.CrtIFace(1);

// 创建边界接触面（支座区域）
blkdyn.CrtBoundIFaceByGroup(2);

// 更新网格拓扑信息
blkdyn.UpdateIFaceMesh();

// 设置混凝土块体材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼）
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 3e6, 30.0, 0.01, 1);

// 设置钢筋材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼）
blkdyn.SetMat(7850, 2.1e11, 0.3, 4e8, 1e9, 45.0, 0.01, 2);

// 设置梁体单元本构模型为线弹性
blkdyn.SetModel("linear");

// 设置接触面本构模型为断裂能模型
blkdyn.SetIModel("FracE");

// 设置接触面基础材料参数（法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度）
blkdyn.SetIMat(1e10, 1e10, 30.0, 3e6, 1e6);

// 为接触面组施加法向刚度与抗拉强度参数（Kn, Ks, cohesion, tension, friction, iGroupLow, iGroupUp）
rdface.SetPropByGroup(1e10, 1e10, 3e6, 1e6, 30.0, 1, 2);

// 配置拉伸及剪切断裂能模型（拉伸断裂能、剪切断裂能、组号下限、组号上限）
blkdyn.SetIFracEnergyByGroupInterface(100, 1000, 1, 2);

// 设置支座约束条件（左侧固定，右侧部分约束）
blkdyn.FixV("xyz", 0.0, "y", -0.5, 0.5);
blkdyn.FixV("xyz", 0.0, "x", -0.5, 0.5);
blkdyn.FixV("xyz", 0.0, "z", -0.5, 0.5);

// 设置跨中加载点集中力（通过位移控制模拟）
blkdyn.FixV("xyz", 3.0, "y", -1e-2, 1e-2);

// 设置监测变量：位移、反力及裂缝扩展状态
dyna.Monitor("block", "ydis", 1.5, 0.5, 0);
dyna.Monitor("block", "ydis", 1.5, 0.5, 1);
dyna.Monitor("block", "stress", 1.5, 0.5, 2);
dyna.Monitor("block", "damage", 1.5, 0.5, 3);

// 设置结果文件路径（记录时间历程数据与破坏状态信息）
doc.SetResultPath("./result");

// 执行计算（静力学分析，计算步数根据收敛情况调整）
dyna.Solve(20000);

// 获取并导出仿真结束后的监测结果
var result = doc.GetResult();

// 释放动态链接库
dyna.FreeUDF();
