// 设置当前工作路径为脚本所在目录
setCurDir(getSrcDir());

// 清除Mesh模块几何数据和网格数据
igeo.clear();
imeshing.clear();

// 清除BlockDyna模型数据及Genvi平台数据
dyna.Clear();
doc.clearResult();

// 打开力学计算开关并设置重力加速度
dyna.Set("Mechanic_Cal", 1);
dyna.Set("Gravity", "0.0 -9.8 0.0");

// 设置大变形计算开关及接触更新开关
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);

// 导入Ansys格式的网格文件并获取网格数据
var msh1 = imesh.importAnsys("bricks.dat");
blkdyn.GetMesh(msh1);

// 将所有单元面切割为接触面并更新网格拓扑信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型及材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 1e6, 25.0, 10.0, 1, 10);

// 设置接触面本构模型及材料参数
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();
blkdyn.SetIFracEnergyByCoord(100, 1000, -1E5, 1E5, -1E5, 1E5, -1E5, 1E5);

// 固体底面位移约束
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.11, 2.13);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.51, 2.53);

// 设置计算结果输出间隔及自动存储文件
dyna.Set("Output_Interval", 500);
dyna.Set("SaveFile_Out", 1);

// 开始动态求解过程，设置时间步长并进行求解
dyna.TimeStepCorrect(0.8);
dyna.Solve(30000);
