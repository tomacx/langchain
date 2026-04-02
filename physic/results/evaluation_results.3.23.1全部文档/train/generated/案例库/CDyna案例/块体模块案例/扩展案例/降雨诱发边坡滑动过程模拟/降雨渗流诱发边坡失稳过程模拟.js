// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 清除之前的几何、网格和计算数据
igeo.clear();
imeshing.clear();
dyna.Clear();

// 创建一个简单的六面体几何模型，用于模拟边坡
var acoord = new Array(6);
acoord[0] = [0, 0, 0];
acoord[1] = [40, 0, 0];
acoord[2] = [40, 25, 0];
acoord[3] = [20, 25, 0];
acoord[4] = [10, 10, 0];
acoord[5] = [0, 10, 0];

igeo.genPloygenS(acoord, 1);

// 网格划分
imeshing.genMeshByGID("blockmesh.msh");

// 设置计算参数
dyna.Set("Output_Interval", 1000);
dyna.Set("Gravity", [0.0, -9.8, 0.0]);
dyna.Set("Config_PoreSeepage", 1);

// 设置材料属性，这里以线弹性模型为例
blkdyn.GetMesh(imeshing);
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 1e9, 0.3, 2e4, 2e4, 25, 15);

// 设置边界条件，固定底部和两侧的位移
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 设置孔隙水压力初始条件
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, [1e-10, 1e-10, 1e-10], 1.0, -500, 500, -500, 500, -500, 500);

// 设置计算时间步长
dyna.Set("Time_Step", 1e-4);
dyna.TimeStepCorrect(0.8);

// 开始计算
dyna.Solve();
