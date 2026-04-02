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

// 设置三个方向的重力加速度为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 自动存储.sav文件，供后续恢复计算及数据处理使用
dyna.Set("SaveFile_Out 1");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 导入计算网格
var msh1 = imesh.importAnsys("bricks.dat");

blkdyn.GetMesh(msh1);

// 将所有的单元面都切割为接触面
blkdyn.CrtIFace();

// 更新网格的拓扑信息
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型
blkdyn.SetModel("linear");

// 指定单元材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 1e6, 25.0, 10.0, 1, 10);

// 设置接触面本构模型
blkdyn.SetIModel("linear");

// 接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 指定接触面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
blkdyn.SetIFracEnergyByCoord(100, 1000, -1E5, 1E5, -1E5, 1E5, -1E5, 1E5);

// 固体底面位移约束
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.11, 2.13);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.51, 2.53);

// 设置监测信息
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
dyna.Monitor("block", "ydis", 1.14, 1.507, 0);

// 运行计算
for (var i = 0; i < 2000; i++) {
    blkdyn.Calc();
}

// 输出结果
blkdyn.OutputResult();
