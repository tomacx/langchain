setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();


dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 1000");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");

var msh1=imesh.importGmsh("GDEM--quan.msh");

blkdyn.GetMesh(msh1);

blkdyn.SetModel("JWL", 1);
blkdyn.SetModel("SatRock", 2);

//blkdyn.SetModel("MC", 2);

blkdyn.SetMat(2009, 8e9, 0.307, 3e6, 1e6, 35, 15, 2);

blkdyn.SetMat(1680, 8e9, 0.307, 3e6, 1e6, 35, 15, 1);

var afPara = new Array(25);

afPara[0] = 3.13e9;  //表观剪切模量   (Pa)

////计算实体压力相关参数
afPara[1] = 25.91e9;  //Beta_s1   (Pa) ，为实体体模量
afPara[2] = 32.65e9;  //Beta_s2   (Pa)
afPara[3] = 8.05e9;  //Beta_s3   (Pa)

////计算水压力相关参数
afPara[4] = 3.61e9;  //Beta_f1   (Pa) ，为水体模量
afPara[5] = 7.80e9;  //Beta_f2   (Pa)
afPara[6] = 7.83e9;  //Beta_f3  (Pa)

//材料泊松比，fPoisson 
afPara[7] = 0.307;  

/////初始孔隙率，fPorosity0 /////文献中给出
afPara[8] =0.0;  

/////水初始体积分数，fWaterFai0  
afPara[9] =0.34;  

/////比奥系数，fBiot   
afPara[10] =1.0;  

/////用于计算孔隙率，体积变形耗散率与偏应变耗散率的比值，0-1之间，取1，fmd 
afPara[11] =0.0;  

//////与初始体积分数有关的拟合系数，用于计算当前体积分数
afPara[12] =-0.20289;    ////faf  
afPara[13] =0.14657;    ////ftf   

/////拟合初始屈服面的拟合系数
afPara[14] =0.711e9;    ////faq  
afPara[15] =0.56e-9;    ////fbq   
afPara[16] =0.685e9;    ////fcq  

/////拟合破坏面的拟合系数
afPara[17] =1.92e9;    ////fap  
afPara[18] =0.335e-9;    ////fbp   
afPara[19] =1.89e9;    ////fcp 

////应变硬化系数（控制应变硬化速度）, fk
afPara[20] =2300.0;  

//////计算损伤因子相关材料参数
afPara[21] = 784;  //系数，n1  (1/s)
afPara[22] = 0.07;  //指数，n2  
afPara[23] = 0.56;  //临界损伤因子，Dc
afPara[24] = 0.005;  //临界塑性应变，CriPlaStrain


blkdyn.SetSatRockMat(1, afPara);
blkdyn.BindSatRockMat(1,2,2);



blkdyn.SetJWLSource(1, 1680, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 7830, [0,0,0], 0.0, 1);
blkdyn.BindJWLSource (1,1,1);


blkdyn.SetLocalDamp(0.0);

//这样是可以的 但是采用blkdyn对象访问显示非法网格
var sel1 = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
sel1.sphere(0,0,0,9.99,10.01);
blkdyn.SetQuietBoundBySel(sel1);


dyna.Monitor("block","sxx", 1.70, 0 ,0 );   ////1YFC
dyna.Monitor("block","sxx", 2.03, 0 ,0 );  ////2YFC
dyna.Monitor("block","sxx", 2.51, 0 ,0 );  ////4YFC
dyna.Monitor("block","sxx", 3.72, 0 ,0 );  ////5YFC
dyna.Monitor("block","sxx", 5.27, 0 ,0 );  ////8YFC
dyna.Monitor("block","sxx", 5.16, 0 ,0 );  ////9TS1
dyna.Monitor("block","sxx", 7.45, 0 ,0 );   ////9TS2
dyna.Monitor("block","sxx", 7.63, 0 ,0 );   ////12YFC

dyna.Monitor("block","syy", 5.32, 0 ,0 );   ////9PC1
dyna.Monitor("block","syy", 7.60, 0 ,0 );   ////9PC2
dyna.Monitor("block","szz", 5.32, 0 ,0 );   ////9PC1
dyna.Monitor("block","szz", 7.60, 0 ,0 );   ////9PC2

dyna.Monitor("block","xvel", 3.72, 0 ,0 );   ////5AC
dyna.Monitor("block","xvel", 5.27, 0 ,0 );   ////8AC
dyna.Monitor("block","xvel", 7.63, 0 ,0 );   ////12AC


dyna.Monitor("block","General_P5", 1.70, 0 ,0 );   ////1YFC
dyna.Monitor("block","General_P5", 2.03, 0 ,0 );  ////2YFC
dyna.Monitor("block","General_P5", 2.51, 0 ,0 );  ////4YFC
dyna.Monitor("block","General_P5", 3.72, 0 ,0 );  ////5YFC



//dyna.TimeStepCorrect(0.5);

dyna.Set("Time_Step 5.0e-7");

dyna.Set("If_Cal_Rayleigh 1");
blkdyn.SetRayleighDamp(1e-5, 0);


dyna.DynaCycle(20e-3);