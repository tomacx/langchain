// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置计算结果的输出间隔为1000步
dyna.Set("Output_Interval 100000");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 开启接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 1e-2");

dyna.Set("If_Find_Contact_OBT 1");

// 包含孔隙渗流计算模块，开辟相应内存
dyna.Set("Config_PoreSeepage 1");

// 关闭孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

dyna.Set("FS_MaxWid 5e-5");

// 关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

// 采用增量法计算液体压力及饱和度
dyna.Set("FS_Cal_Incremental 0");

// 导入midas格式网格
var faceID = igeo.genRectS(0,0,0,100,50,0, 2, 1);

// 切割单元面
blkdyn.CrtIFace();

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

// 接触面强度从单元中获取
blkdyn.SetIStrengthByElem();

var fso = new ActiveXObject("Scripting.FileSystemObject"); // 创建FileSystemObject对象
var filew = fso.CreateTextFile("Aperture.txt", true); // 创建文件

var totalElem = Math.round(dyna.GetValue("Total_FS_ElemNum")); // 获取总单元数

filew.WriteLine(totalElem);

for (var i = 1; i <= totalElem; i++) {
    var fcwidth = fracsp.GetElemValue(i, "CWidthIni"); // 获取初始裂隙宽度
    filew.WriteLine(fcwidth);
}

filew.Close();

print("File write successfully.");
