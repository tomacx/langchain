setCurDir(getSrcDir());

// 清除所有模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（爆破仿真通常忽略重力）
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

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 打开杆件计算开关（电缆单元）
dyna.Set("If_Cal_Bar 1");

// 打开杆件结果文件输出开关
dyna.Set("Bar_Out 1");

// 打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1");

/////////////////////////几何建模及网格划分

// 创建矩形环1（外部边界）
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);

// 创建矩形环2（巷道区域）
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界的面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建矩形巷道，填实
igeo.genSurface([loopid2], 2);

// 产生二维网格
imeshing.genMeshByGmsh(2);

/////////////////////////BlockDyna网格加载

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear");

// 指定材料参数（密度、弹性模量、泊松比、屈服强度等）
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 虚拟接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

/////////////////////////杆件（电缆）单元导入

// 创建电缆几何模型（简化为直线段）
var cableLoop = igeo.genRect(0, 0, 0, 20, 0.1, 0, 0);
igeo.genSurface([cableLoop], 3);

// 产生电缆网格
imeshing.genMeshByGmsh(3);

// 将电缆网格加载到杆件求解器，指定类型为cable
bar.GetMesh(imeshing, "cable");

/////////////////////////边界条件设置

// 自由场边界计算，实现无反射功能
blkdyn.CalFreeFieldBound();

// 静态边界条件，实现无反射功能（防止刚体位移）
blkdyn.CalQuietBound();

// 瑞利阻尼计算
blkdyn.CalRayleighDamp();

/////////////////////////加载工况设置

// 定义爆炸压力载荷（在岩体表面施加）
var loadGroup = blkdyn.GetLoadGroup(1);
loadGroup.SetPressure(1e7, 0.5, 20, 0, 0, 0); // 压力幅值、作用时间等参数

/////////////////////////输出请求配置

// 监测应力数据
dyna.Monitor("gvalue", "gv_stress");

// 监测位移数据
dyna.Monitor("gvalue", "gv_displace");

// 监测电缆力数据
dyna.Monitor("gvalue", "gv_bar_force");

/////////////////////////执行求解器

// 执行求解
dyna.Run();

// 获取仿真结果进行分析
var result = doc.GetResult();
console.log("仿真完成，结果已保存至输出目录");
