//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置三个方向的重力加速度值
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置云图输出间隔为5000
dyna.Set("Output_Interval 100");

//设置监测信息提取间隔为10时步
dyna.Set("Moniter_Iter 10");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量计算时步
dyna.Set("Virtural_Step 0.6");

//导入ansys格式的网格
blkdyn.ImportGrid("patran", "bridge.out");

blkdyn.CrtBoundIFaceByCoord(-1e7, 1e7, -1e7, 1e7, -1e7, 1e7);
blkdyn.UpdateIFaceMesh();

//设置单元模型为线弹性模型
blkdyn.SetModel("linear");

//设置组号为1的单元材料，基岩
blkdyn.SetMat(2550, 1e10, 0.22, 1e7, 1e7, 55, 10, 1);

//设置组号为2的单元材料，覆盖层
blkdyn.SetMat(2000, 6e7, 0.25, 6e4, 3e4, 30, 10, 2);


blkdyn.SetIModel("linear");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(10);

///////////////////////////////////以下为动力计算

//设置所有节点的局部阻尼0.0
blkdyn.SetLocalDamp(0.0);

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置当前时间为0
dyna.Set("Time_Now 0");

//设置动力计算时步
dyna.Set("Time_Step 1e-5");

//模型底部施加无反射边界条件
blkdyn.SetQuietBoundByCoord(-2000,2000,-20-0.001,-20+0.001,-2000,2000);




//**************************************************施加地震应力
//指定三个方向的载荷系数
var coeff1= new Array(0, 0, 1e5);

//x方向下限及上限
var x= new Array(-1000,1000);

//y方向下限及上限
var y= new Array(-20-0.01, 20+0.01);

//z方向下限及上限
var z= new Array(-1000,1000);

//剪切波-面力、载荷系数、衰减指数、振幅、周期、初相位、开始时间、结束时间
blkdyn.ApplyDynaSinVarByCoord ("face_force", false, coeff1, 0, 1, 0.2, 0, 0, 20, x, y, z);

//**************************************************施加地震应力


//动态求解22s
dyna.Solve(30000);

//打印提示信息
print("Solution Finished");
