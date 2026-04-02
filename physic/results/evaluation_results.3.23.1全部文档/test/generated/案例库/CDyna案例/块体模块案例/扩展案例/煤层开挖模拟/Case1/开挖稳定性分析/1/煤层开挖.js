// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据
igeo.clear();

// 清除Mesh模块网格数据
imeshing.clear();

// 清除BlockDyna模型数据
dyna.Clear();

// 清除Genvi平台数据
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0.0
dyna.Set("Contact_Detect_Tol 0.0");

// 创建矩形环1
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);

// 创建矩形环2
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界的面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建矩形巷道，填实
igeo.genSurface([loopid2], 2);

// 产生二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(2);

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 指定材料参数
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 虚拟接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 设置X方向左侧法向约束
blkdyn.FixVByCoord("x", 0.0, -0.1, 0.1, 0, 20, -0.1, 0.1);

// 设置X方向右侧法向约束
blkdyn.FixVByCoord("x", 0.0, 19.9, 20.1, 0, 20, -0.1, 0.1);

// 设置Y方向底部法向约束
blkdyn.FixVByCoord("y", 0.0, -0.1, 20.1, -0.1, 0.1, -0.1, 0.1);
