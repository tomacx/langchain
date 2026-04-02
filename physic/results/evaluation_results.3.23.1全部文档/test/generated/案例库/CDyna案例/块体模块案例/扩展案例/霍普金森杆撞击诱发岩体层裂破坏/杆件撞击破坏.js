setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

// 设置重力加速度为0
dyna.Set("Gravity 0 0 0");

// 设置输出间隔步数
dyna.Set("Output_Interval 500");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 开启接触更新
dyna.Set("If_Renew_Contact 1");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 1e-3");

// 关闭虚拟质量计算
dyna.Set("If_Virtural_Mass 0");

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.02);

// 导入网格数据
blkdyn.ImportGrid("gid","bar-fine.msh");

// 创建边界接触面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtIFaceByCoord(0.02, 0.18,-1,1,-1,1);

// 更新接触网格信息
blkdyn.UpdateIFaceMesh();

// 设置实体单元模型为Mohr-Coulomb模型
blkdyn.SetModel("MC");

// 设置材料参数
blkdyn.SetMat(7800,2.1e11,0.25,235e6,235e6,0,0);

// 设定接触面本构为脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设置接触刚度和强度从单元中自动获取
blkdyn.SetIStiffByElem(1.0);
blkdyn.SetIStrengthByElem();

// 导入旋转边界条件数据
rdface.Import("gid","rotaAppBound.msh");
var forigin = [0,0,0];
var fnormal = [1,0,0];

var fGlobV = [0,0,0];

// 应用旋转边界条件
rdface.ApplyRotateCondition(1,forigin, fnormal, 5e-6, 0.0, fGlobV, 2,2);
rdface.ApplyRotateCondition(2,forigin, fnormal, -5e-6, 0.0, fGlobV, 3,3);

// 求解
dyna.Solve(100000);
