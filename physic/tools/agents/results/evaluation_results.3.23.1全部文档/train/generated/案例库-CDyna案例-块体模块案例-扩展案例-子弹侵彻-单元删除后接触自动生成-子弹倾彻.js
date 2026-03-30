setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ========== 1. 几何模型创建 ==========
var length = 0.2;      // 靶体长度(m)
var height = 0.05;     // 靶体高度(m)
var deltl = 0.005;     // 接触面偏移量(m)
var size = 0.002;      // 单元尺寸(m)

// 创建靶体矩形区域（组号1）
igeo.genRectS(0, 0, 0, length, height, 0, size, 1);

// 创建子弹接触面区域（组号2）
igeo.genRectS(0.5 * length - deltl, height + deltl, 0,
              0.5 * length + deltl, height + deltl * 4, 0, size, 2);

// 创建子弹几何实体（圆锥形弹头）
igeo.genPloygenS([length * 0.5, height + 0.1 * deltl, 0, size,
                  0.5 * length - deltl, height + deltl, 0, size,
                  0.5 * length + deltl, height + deltl, 0, size], 2);

// ========== 2. 网格划分 ==========
imeshing.genMeshByGmsh(2);

// ========== 3. 求解器全局参数设置 ==========
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 100");
dyna.Set("If_Auto_Create_Contact 1 0");

// ========== 4. 单元删除准则设置 ==========
// Elem_Kill_Option: 启用单元删除，基于应力/应变判据
dyna.Set("Elem_Kill_Option 1 0.1 0.1 1 1");

// ========== 5. 获取网格并创建接触面 ==========
blkdyn.GetMesh(imeshing);

// 为靶体和子弹组创建边界接触面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtBoundIFaceByGroup(2);

// 更新接触面网格拓扑
blkdyn.UpdateIFaceMesh();

// ========== 6. 材料本构参数设置 ==========

// 靶体材料（混凝土/岩石类，使用JH2损伤模型）
blkdyn.SetModel("JH2");
var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76, 0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0, 1.0];
blkdyn.SetJH2Mat(1, JH2Mat);
blkdyn.BindJH2Mat(1, 1, 1);

// 靶体材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力、损伤类型
blkdyn.SetMat(2500, 8e10, 0.3, 20e6, 20e6, 45, 10, 1);

// 子弹材料（钢，线弹性）
blkdyn.SetModel("linear", 2);
blkdyn.SetMat(7800, 2.1e11, 0.3, 8e8, 8e8, 0, 0, 2);

// 脆性断裂模型参数（用于靶体损伤演化）
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 0, 0, 0);
blkdyn.SetIStiffByElem(10.0);

// ========== 7. 初始条件设置 ==========

// 定义子弹初始速度（沿Y轴负方向，1000 m/s）
var values = new Array(0.0, -1000, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

// 为子弹组（组号2）设置初始速度
blkdyn.InitConditionByGroup("velocity", values, gradient, 2, 2);

// ========== 8. 局部阻尼设置 ==========
blkdyn.SetLocalDamp(0.01);

// ========== 9. 求解器时间步长设置 ==========
dyna.TimeStepCorrect(0.2);

// ========== 10. 执行求解 ==========
dyna.Solve(50000);

// ========== 11. 输出结果 ==========
print("Simulation completed successfully!");
doc.ExportResult();
