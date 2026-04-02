// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除数据，便于直接进行重新计算
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

// 创建几何模型
var faceid = igeo.genRectS(0, 0, 0, 20, 20, 0, 0.5, 1);
var pid1 = igeo.genPoint(9.9, 10, 0, 0.1);
var pid2 = igeo.genPoint(10.1, 10, 0, 0.1);
var lid = igeo.genLine(pid1, pid2);

// 设置硬线，便于加水压
igeo.setHardLineToFace(lid, faceid);

// 划分网格
imeshing.genMeshByGmsh(2);

// 下载网格至blkdyn模块
blkdyn.GetMesh(imeshing);

// 切割形成接触面
blkdyn.CrtIFace(1, 1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数
blkdyn.SetMat(2500, 3e9, 0.25, 2.8e4, 2.8e4, 25, 10);

// 固定边界条件
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("z", 0.0, "z", -0.01, 0.01);

// 打开孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-12, 1e-12, 1e-12);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 2.2e9, 0.5, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义梯度
var fArrayGrad = new Array(0, -9800, 0);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 1e4, fArrayGrad, -20.01, 20.01, -500, 500, true);
poresp.InitConditionByCoord("pp", 1e4, fArrayGrad, -500, 500, -20.01, 20.01, false);

// 求解
dyna.Solve();
