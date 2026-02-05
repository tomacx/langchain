//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8 ");

//设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("GiD_Out 0");

dyna.Set("If_Particle_Cal_Rolling 0");

//设置底部刚性面
rdface.Import("gid", "20m-20m-bound.msh");

dyna.Set("Auto_Put_Data_To_Host 0");

//pdyna.CrtPolyhedronPartSTL(<strSTLFile, nGroupNo, fCenter, fMaxLength, nRandomDirFlag [, Type, Value]>);
var fCenter = [0,0,2];
pdyna.CrtPolyhedronPartSTL("RGPS001.stl", 1, fCenter, 2.0, 1,  1, 1);
var fCenter = [5,0,2];
pdyna.CrtPolyhedronPartSTL("RGPS002.stl", 2, fCenter, 2.0, 1,  1, 1);
var fCenter = [4,0,4];
pdyna.CrtPolyhedronPartSTL("RGPS003.stl", 3, fCenter, 2.0, 1,  1, 1);
var fCenter = [2,0,4];
pdyna.CrtPolyhedronPartSTL("RGPS004.stl", 4, fCenter, 2.0, 1,  1, 1);
var fCenter = [3,3,4];
pdyna.CrtPolyhedronPartSTL("RGPS005.stl", 5, fCenter, 2.0, 1,  1, 1);
var fCenter = [3,0,3];
pdyna.CrtPolyhedronPartSTL("RGPS006.stl", 6, fCenter, 2.0, 1,  1, 1);
var fCenter = [0,2,3];
pdyna.CrtPolyhedronPartSTL("RGPS007.stl", 7, fCenter, 2.0, 1,  1, 1);

dyna.Set("Auto_Put_Data_To_Host 1");

var fCenter = [3,2,3];
pdyna.CrtPolyhedronPartSTL("RGPS008.stl", 8, fCenter, 2.0, 1,  1, 1);


//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 1e7, 0.25, 0.0,0.0, 10, 0.02, 0.02, 0.02);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");


//设置动态计算时步为1e-4秒
dyna.TimeStepCorrect(0.1);


//计算3万步
dyna.Solve(100000);
