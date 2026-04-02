//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());


//设置输出间隔为200步
dyna.Set("Output_Interval 1000");

//设置重力方向
dyna.Set("Gravity  0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步为1e-5
dyna.Set("Time_Step 2e-5");

//设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

//设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

//设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8  0.0 0.0 0.0");

//产生圆形面
igeo.genCircleS(0.5, 1.3,0,0.15, 0.02,3);

//划分网格
imeshing.genMeshByGmsh(2);

//将Mesh模块网格下载至Dyna模块中
blkdyn.GetMesh(imeshing);

//设置块体模型为线弹性
blkdyn.SetModel("linear");

//设置块体材料参数
blkdyn.SetMat(2000,1e8, 0.3, 1e6,1e6,35,15);

//设置块体阻尼
blkdyn.SetLocalDamp(0.01);

//创建颗粒
pdyna.RegularCreateByCoord(1,1,0.01,-0.16,1.16, -0.16,1.1, 0.0, 0);
pdyna.RegularCreateByCoord(1,1,0.01,-0.16,-0.02, 1,2, 0.0, 0);
pdyna.RegularCreateByCoord(1,1,0.01,1.04,1.16, 1,2, 0.0, 0);

//颗粒的左右两侧及底部固定
pdyna.FixV("xyz",0,"x",-1,-0.001);
pdyna.FixV("xyz",0,"x",1.021,2);
pdyna.FixV("xyz",0,"y",-1,-0.001);


//设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2000,1e7,0.35, 1e-3, 1e-3, 0.0, 0.8,0);

//创建mpm背景网格
mpm.SetBackGrid(2,0.06, [-0.3,-0.3,0], [28, 40, 0]);

//mpm模型切换为理想弹塑性模型
mpm.SetModelByGroup("Fluid",1,2);

mpm.SetKGVByGroup(5e6, 0.0, 1e-3, 1,11);

dyna.Set("MPM_Fluid_Tension 1e2");

//监测圆形中部节点的竖向位移及速度
dyna.Monitor("block","ydis", 0.5, 1.3,0);
dyna.Monitor("block","yvel", 0.5, 1.3,0);

//设置块体模型为空模型
blkdyn.SetModel("none");

//求解1万步，获得稳定水的应力场
dyna.Solve(10000);

//设置颗粒的局部阻尼为0.01
pdyna.SetSingleMat("LocalDamp", 0.01);

//设置块体模型为线弹性模型
blkdyn.SetModel("linear");

//求解20万步
dyna.Solve(10000);
