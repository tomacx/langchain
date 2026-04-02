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
dyna.Set("Gravity 0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

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

// 设置仅依靠拓扑寻找接触面，加速接触检索
dyna.Set("If_Find_Contact_OBT 1");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

// 打开仅接触面破裂或接触面为预设面时进行压力传递及更新开度
dyna.Set("FS_Frac_Start_Cal 1");

// 创建几何
var faceid = igeo.genRectS(0,0,0,10,10,0,0.2,1);

// 设置硬线，便于加水压
var pid1 = igeo.genPoint(4.9, 5,0, 0.1);
var pid2 = igeo.genPoint(5.1, 5, 0, 0.1);
var lid = igeo.genLine(pid1, pid2);
igeo.setHardLineToFace(lid, faceid);

// 设置硬线，天然裂隙
var pid3 = igeo.genPoint(3, 6, 0, 0.1);
var pid4 = igeo.genPoint(7, 6, 0, 0.1);
var lid2 = igeo.genLine(pid3, pid4);
igeo.setHardLineToFace(lid2, faceid);

// 划分网格
imeshing.genMeshByGmsh(2);

// 下载网格至blkdyn模块
blkdyn.GetMesh(imeshing);

// 切割形成接触面
blkdyn.CrtIFace(1, 1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定材料参数
blkdyn.SetMatByGroup(2530, 0.25e10, 0.29, 2.17e6, 0.14e6, 35, 10, 1);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 接触面刚度从单元中获取
blkdyn.SetIStiffByElem(100.0);
