setCurDir(getSrcDir());

// 清除所有模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 初始化计算环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// ========== 几何建模及网格划分 ==========
// 创建外边界矩形环（20m x 20m）
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);

// 创建巷道空洞矩形环（8m x 6m，位于中心）
var loopid2 = igeo.genRect(8, 3, 0, 12, 9, 0, 0.2);

// 生成带孔洞的外边界面
igeo.genSurface([loopid1, loopid2], 1);

// 产生二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 创建接触面（两侧围岩与巷道壁）
blkdyn.CrtIFace();

// 更新接触面网格信息
blkdyn.UpdateIFaceMesh();

// ========== 材料参数设置 ==========
// 岩石材料参数：密度(kg/m³), 弹性模量(Pa), 泊松比, 粘聚力(Pa), 内摩擦角(度)
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 35.0, 15.0);

// 设置块体本构模型为线弹性
blkdyn.SetModel("linear");

// 设置界面接触属性（从单元自动获取）
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// ========== 高地应力初始边界条件 ==========
// 施加X方向高应力（20MPa）
dyna.Set("Boundary_X 20e6");

// 施加Y方向高应力（15MPa）
dyna.Set("Boundary_Y 15e6");

// 施加Z方向高应力（8MPa）
dyna.Set("Boundary_Z 8e6");

// ========== 巷道开挖操作 ==========
// 通过移除巷道区域单元模拟开挖卸荷
blkdyn.RemoveBlockByCoord(9, 4.5, 0, 11, 7.5, 0);

// ========== 冲击波载荷设置 ==========
// 在巷道顶部施加冲击波（模拟顶板来压或爆破）
blkdyn.ApplyShockWaveByCoord(50.0, [8, 3, 0], 0.001, 340, 1.2, 7, 9, 2, 4, -1);

// ========== 监测点设置 ==========
// 监测巷道顶部节点X方向位移（冲击波传播）
dyna.Monitor("block", "xdis", 8.0, 3.0, 0.0);

// 监测巷道底部节点Y方向位移
dyna.Monitor("block", "ydis", 8.0, 9.0, 0.0);

// 监测系统断裂度（全局变量）
dyna.Monitor("gvalue", "gv_block_crack_ratio");

// 监测块体总动能
dyna.Monitor("gvalue", "gv_block_kinetic_energy");

// 监测块体强损伤区体积占比
dyna.Monitor("gvalue", "gv_block_strong_damage_ratio");

// ========== 求解与结果输出 ==========
// 启动显式动力学求解器
dyna.Solve();

// 保存计算结果
doc.SaveResult();
