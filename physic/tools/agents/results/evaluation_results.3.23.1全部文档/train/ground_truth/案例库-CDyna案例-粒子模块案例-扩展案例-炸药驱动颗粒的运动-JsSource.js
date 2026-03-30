setCurDir(getSrcDir());
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 200");

//时步进行了调整
dyna.Set("Time_Step 5e-9");
dyna.Set("Moniter_Iter 10");

//接触容差太大了，颗粒尺寸都是在毫米以下
dyna.Set("Contact_Detect_Tol 1e-5");

dyna.Set("Renew_Interval 10");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Time_Now 0.0");
dyna.Set("If_Cal_Particle 1");
dyna.Set("Particle_Renew_Interval 10");
dyna.Set("If_Particle_NForce_Incremental 1");
dyna.Set("If_Particle_Cal_Rolling 1");
dyna.Set("Particle_Cal_Type 1");
dyna.Set("UnBalRFile_Out 1");
dyna.Set("HistFile_Out 1");
dyna.Set("SaveFile_Out 1");
dyna.Set("Bar_Out 0");

//设置接触搜索模式为2
dyna.Set("Contact_Search_Method 2");



blkdyn.ImportGrid("gid" ,"circle.msh");


//一般切割放在导入网格后执行，后续才是施加模型及参数
blkdyn.CrtBoundIFaceByGroup(1);

//需要更新网格，相当于原来的Initial
blkdyn.UpdateIFaceMesh();


//设置模型为JWL模型
blkdyn.SetModel("JWL");
blkdyn.SetMat(1630,1e10,0.25,3e6,1e6,35,15);



blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e10,1e10,30.0,0,0);
blkdyn.SetLocalDamp(0.0);
dyna.Set("If_Cal_Rayleigh 0");
var pos=new Array(0.0,0.0,0.0);
blkdyn.SetJWLSource(1,1630,7.0e9,371.2e9,3.2e9,4.2,0.95,0.30,21e9,6930,pos,0.0,100);
blkdyn.BindJWLSource(1,1,100);
pdyna.Import("gid","al100.msh");
pdyna.Export("Ball.dat");
pdyna.SetMat(2700,7.2e10,0.33,0,0,10.2,0.0,0.1,1,100);

//颗粒模型为脆断
pdyna.SetModel("brittleMC");

dyna.Solve(100000)
