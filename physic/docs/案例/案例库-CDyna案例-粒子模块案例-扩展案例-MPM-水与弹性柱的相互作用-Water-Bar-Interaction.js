//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

//设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

//打开大变形开关
dyna.Set("Large_Displace 1");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步为0.2ms
dyna.Set("Time_Step 2e-4");

//设置颗粒计算模式为mpm
dyna.Set("Particle_Cal_Type 4");

//导入ansys格式的桩体网格
blkdyn.ImportGrid("ansys","bar.dat");

//设置桩体模型为线弹性模型
blkdyn.SetModel("linear");

//设置桩体材料参数
blkdyn.SetMat(2000,5e7,0.3,0,0,20,20);

//固定桩体底部
blkdyn.FixV("xyz",0,"y",-1,-0.09);

//设置桩体局部阻尼
blkdyn.SetLocalDamp(0.01);

//设置全局重力加速度为0，桩体不受重力
dyna.Set("Gravity  0 0 0");

//重新设置桩体重力，让其重力为0
blkdyn.ApplyGravity();

//恢复全局重力加速度
dyna.Set("Gravity  0 -9.8 0");

//设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9  0.0 0.0 0.0");

//创建mpm颗粒
pdyna. RegularCreateByCoord (1, 1, 0.1, 0,10,0,10,0,0);

//添加刚性面
rdface.Create (1, 1, 2, [-0.1,-0.1,0,-0.1,20,0]); 
rdface.Create (1, 1, 2, [-0.1,-0.1,0,30,-0.1,0]); 
rdface.Create (1, 1, 2, [30,-0.1,0,30,20,0]); 


//设置粒子材料参数，分别为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2200,1e8,0.25, 0.0, 0.0,0.0001,0.01,0);

//设置mpm背景网格
mpm.SetBackGrid(2,1.0, [-3,-3,0], [35, 25, 0]);

//设置mpm本构模型
mpm.SetModelByGroup("DP",1,2);

//计算20秒
dyna.DynaCycle(20);

