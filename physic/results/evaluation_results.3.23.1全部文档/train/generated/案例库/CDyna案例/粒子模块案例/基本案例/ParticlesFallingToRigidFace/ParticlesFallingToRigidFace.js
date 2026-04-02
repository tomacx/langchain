setCurDir(getSrcDir());

// 设置基本物理参数
dyna.Set("Time_Step", 1e-4);
dyna.Set("Output_Interval", 500);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);

// 创建刚性面
var fCoord = new Array();
fCoord[0] = [-2, -2, 0];
fCoord[1] = [2, -2, 0];
fCoord[2] = [2, 2, 0];
fCoord[3] = [-2, 2, 0];
rdface.Create(4, 1, fCoord);

// 导入块体网格
blkdyn.ImportGrid("gid", "block.msh");

// 设置接触面和材料属性
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e8, 0.25, 1e6, 1e4, 30);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e9, 5e9, 20, 0.0, 0.0);

// 设置阻尼
blkdyn.SetLocalDamp(0.01);

// 开始计算
dyna.Solve(10000);
