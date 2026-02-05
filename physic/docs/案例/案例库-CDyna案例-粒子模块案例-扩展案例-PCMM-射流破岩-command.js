setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-5"); 

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("Time_Step 1.0e-4");

dyna.Set("Renew_Interval 100");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Virtural_Step 0.4");

dyna.Set("Output_Interval 500");

dyna.Set("Particle_Cal_Type 2");

dyna.Set("PCMM_Elem_Tol 5e-5");

// 当颗粒超过一定范围，删除颗粒
dyna.Set("Particle_Out_Kill 1 -0.101 0.016 -0.012 0.012 -0.1 0.05 0");



//设置PSEM邻居搜索距离
dyna.Set("Contact_Detect_Tol 1.0e-7");
dyna.Set("Renew_Interval 100");

//////////////////////////////////////////////////////颗粒流设置区

//颗粒流文件读入
pdyna.Import("gid", "0.2mm-15cm-long.msh");

pdyna.SetModel("brittleMC");

pdyna.SetMat(2500,5e9,0.25, 0.1e6,0.5e6,30, 0.05,0.0, 2,2); 
pdyna.SetMat(1000,2e9,0.25, 0,0,0, 0.05,0.0, 1,1); 


// 初始化速度等
var fvalue = new Array(800, 0.0, 0.0);
pdyna.InitCondByGroup ("velocity", fvalue, 1,1);


// 位移边界条件设置x/y/z/xy/yz/zx/xyz/
pdyna.FixVByCoord("xy", 0, -100, 100, -10,-0.0098, -100,100);
pdyna.FixVByCoord("xy", 0, -100, 100, 0.0098, 11, -100,100);
pdyna.FixVByCoord("xy", 0, 0.0148, 100, -11, 11, -100,100);



// 颗粒弹簧元设置
// 连续体的性质，bulk ,shear, visc，组号下限，上限
pcmm.SetKGVByGroup(2e9, 0, 1e-3, 1,1);

// 指定PSEM的模型，1-线弹性，2-DP模型，3-Mohr-Coulomb模型
pcmm.SetModelByGroup("MC", 1,2);


dyna.Monitor("particle", "pa_xvel", 0, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.005, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.01, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.0012, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.0014, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.0016, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.0018, 0.0001, 0);
dyna.Monitor("particle", "pa_xvel", 0.0020, 0.0001, 0);



// 程序自动计算时步
dyna.TimeStepCorrect();

dyna.Solve(1000000);
dyna.Save("final.sav");