////设置工作路径为当前javascript文件所在的路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统收敛的不平衡率为 1e-5
dyna.Set("UnBalance_Ratio 1e-1");

//设置 3 个方向的重力加速度值
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置接触更新
dyna.Set("If_Renew_Contact 1");


//设置计算结果的输出间隔为 100000 步
dyna.Set("Output_Interval 10000");

//设置监测结果的输出时步为 100 步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为 0.1
dyna.Set("Virtural_Step 0.4");

//设置接触容差 1.0e-3
dyna.Set("Contact_Detect_Tol 0.0");

//设置单元固体应力的计算模式-常规有限体积法
dyna.Set("Solid_Cal_Mode 1");

//导入 ansys 格式的网格
blkdyn.ImportGrid("ansys", "ansys.dat");

//按照坐标对单元界面进行切割
blkdyn.CrtIFaceByCoord(0,400,0,134,-0.1,0.1 );

//在组 42 与组 43 的交界面上创建接触面
blkdyn.CrtIFace(42, 43);

//在组 42 与组 44 的交界面上创建接触面
blkdyn.CrtIFace(42, 44);

//对组 45 的自由面创建接触面
blkdyn.CrtBoundIFaceByGroup(45);

//更新交界面网格信息
blkdyn.UpdateIFaceMesh();


//设置材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(	2546	,	1.85E+10	,	0.31 	,	3.58E+07	,	7.22E+06	,	35 	,	5	,	1	)	;
blkdyn.SetMatByGroup(	2482	,	1.10E+10	,	0.15 	,	2.86E+07	,	8.58E+06	,	32 	,	5	,	2	)	;
blkdyn.SetMatByGroup(	2512	,	1.29E+10	,	0.25 	,	2.66E+07	,	7.84E+06	,	32 	,	5	,	3	)	;
blkdyn.SetMatByGroup(	1290	,	2.08E+09	,	0.22 	,	1.91E+07	,	1.08E+06	,	28 	,	5	,	4	)	;
blkdyn.SetMatByGroup(	2430	,	1.40E+10	,	0.24 	,	3.56E+07	,	9.26E+06	,	25 	,	5	,	5	)	;
blkdyn.SetMatByGroup(	2360	,	1.41E+10	,	0.36 	,	2.30E+07	,	4.93E+06	,	34 	,	5	,	6	)	;
blkdyn.SetMatByGroup(	2482	,	7.70E+09	,	0.21 	,	1.61E+07	,	5.60E+06	,	39 	,	5	,	7	)	;
blkdyn.SetMatByGroup(	2387	,	9.30E+09	,	0.24 	,	2.45E+07	,	7.21E+06	,	26 	,	5	,	8	)	;
blkdyn.SetMatByGroup(	2256	,	9.78E+09	,	0.25 	,	2.00E+07	,	5.62E+06	,	27 	,	5	,	9	)	;
blkdyn.SetMatByGroup(	2494	,	1.57E+10	,	0.19 	,	2.60E+07	,	8.08E+06	,	32 	,	5	,	10	)	;
blkdyn.SetMatByGroup(	2446	,	6.08E+09	,	0.20 	,	1.61E+07	,	5.47E+06	,	39 	,	5	,	11	)	;
blkdyn.SetMatByGroup(	2403	,	1.17E+10	,	0.24 	,	2.20E+07	,	6.27E+06	,	29 	,	5	,	12	)	;
blkdyn.SetMatByGroup(	2425	,	6.80E+09	,	0.17 	,	2.68E+07	,	6.79E+06	,	26 	,	5	,	13	)	;
blkdyn.SetMatByGroup(	2406	,	1.56E+10	,	0.33 	,	2.18E+07	,	6.01E+06	,	30 	,	5	,	14	)	;
blkdyn.SetMatByGroup(	2295	,	1.63E+10	,	0.31 	,	2.06E+07	,	5.71E+06	,	30 	,	5	,	15	)	;
blkdyn.SetMatByGroup(	2374	,	8.21E+09	,	0.20 	,	2.77E+07	,	5.20E+06	,	29 	,	5	,	16	)	;
blkdyn.SetMatByGroup(	2263	,	4.19E+09	,	0.20 	,	3.76E+07	,	3.56E+06	,	31 	,	5	,	17	)	;
blkdyn.SetMatByGroup(	2366	,	7.50E+09	,	0.27 	,	1.81E+07	,	5.75E+06	,	35 	,	5	,	18	)	;
blkdyn.SetMatByGroup(	2367	,	6.92E+09	,	0.20 	,	2.75E+07	,	3.73E+06	,	17 	,	5	,	19	)	;
blkdyn.SetMatByGroup(	2606	,	1.24E+10	,	0.18 	,	1.92E+07	,	6.54E+06	,	33 	,	5	,	20	)	;
blkdyn.SetMatByGroup(	2343	,	9.99E+09	,	0.29 	,	5.78E+06	,	5.35E+06	,	48 	,	5	,	21	)	;
blkdyn.SetMatByGroup(	2606	,	1.24E+10	,	0.18 	,	1.92E+07	,	6.54E+06	,	33 	,	5	,	22	)	;
blkdyn.SetMatByGroup(	2367	,	6.92E+09	,	0.20 	,	2.75E+07	,	3.73E+06	,	17 	,	5	,	23	)	;
blkdyn.SetMatByGroup(	2363	,	6.15E+09	,	0.22 	,	1.92E+07	,	5.66E+06	,	33 	,	5	,	24	)	;
blkdyn.SetMatByGroup(	2405	,	5.53E+09	,	0.14 	,	1.92E+07	,	4.40E+06	,	33 	,	5	,	25	)	;
blkdyn.SetMatByGroup(	2367	,	6.92E+09	,	0.20 	,	2.75E+07	,	3.73E+06	,	17 	,	5	,	26	)	;
blkdyn.SetMatByGroup(	2593	,	3.53E+10	,	0.25 	,	2.44E+07	,	2.75E+06	,	44 	,	5	,	27	)	;
blkdyn.SetMatByGroup(	2352	,	7.72E+09	,	0.29 	,	1.92E+07	,	5.37E+06	,	33 	,	5	,	28	)	;
blkdyn.SetMatByGroup(	2372	,	5.68E+09	,	0.25 	,	1.24E+07	,	4.68E+06	,	20 	,	5	,	29	)	;
blkdyn.SetMatByGroup(	2318	,	7.72E+09	,	0.29 	,	2.86E+07	,	3.95E+06	,	23 	,	5	,	30	)	;
blkdyn.SetMatByGroup(	2800	,	2.00E+11	,	0.25 	,	1.23E+09	,	2.24E+09	,	45 	,	5	,	42	)	;
blkdyn.SetMatByGroup(	2800	,	2.00E+11	,	0.25 	,	1.23E+09	,	2.24E+09	,	45 	,	5	,	43	)	;
blkdyn.SetMatByGroup(	2800	,	2.00E+11	,	0.25 	,	1.23E+09	,	2.24E+09	,	45 	,	5	,	44	)	;
blkdyn.SetMatByGroup(	2800	,	2.00E+11	,	0.25 	,	1.23E+09	,	2.24E+09	,	45 	,	5	,	45	)	;
																	

//// 界面弹簧材料自动计算																	
//blkdyn.SetIStrengthByElem();

//继承刚度																
//blkdyn.SetIStiffByElem(0.1);	

//所有材料先赋这个值，包括支架接触面
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	0.000 	,	0 	,	0);
																	
////blkdyn.SetIMat(normalstiff, shearstiff, friction, cohesion, tension, iGroup);层内节理赋参数														
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.625	,	4.48E+06	,	9.03E+05	,	1	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.925	,	3.58E+06	,	1.07E+06	,	2	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.95	,	3.33E+06	,	9.80E+05	,	3	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.175	,	0	,	0	,	4	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.175	,	0	,	0	,	5	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	16.8	,	1.15E+07	,	2.47E+06	,	6	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	9.825	,	2.01E+06	,	7.00E+05	,	7	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.575	,	3.06E+06	,	9.01E+05	,	8	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.625	,	2.50E+06	,	7.03E+05	,	9	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.95	,	3.25E+06	,	1.01E+06	,	10	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	9.825	,	2.01E+06	,	6.84E+05	,	11	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.35	,	2.75E+06	,	7.84E+05	,	12	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.45	,	3.35E+06	,	8.49E+05	,	13	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.5	,	2.73E+06	,	7.51E+05	,	14	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.375	,	2.58E+06	,	7.14E+05	,	15	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.15	,	3.46E+06	,	6.50E+05	,	16	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.825	,	4.70E+06	,	4.45E+05	,	17	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.825	,	2.26E+06	,	7.19E+05	,	18	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.35	,	3.44E+06	,	4.66E+05	,	19	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	8.18E+05	,	20	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	11.875	,	7.23E+05	,	6.69E+05	,	21	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	8.18E+05	,	22	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.35	,	3.44E+06	,	4.66E+05	,	23	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	7.08E+05	,	24	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	5.50E+05	,	25	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.35	,	3.44E+06	,	4.66E+05	,	26	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	10.975	,	3.05E+06	,	3.44E+05	,	27	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	6.71E+05	,	28	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.875	,	1.55E+06	,	5.85E+05	,	29	);		
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	5.675	,	3.58E+06	,	4.94E+05	,	30	);		
														
														
														
														
////blkdyn.SetIMat(normalstiff, shearstiff, friction, cohesion, tension, iGroup, jGroup);层间节理赋参数														
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.925	,	3.58E+06	,	1.07E+06	,	1	,	2	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.95	,	3.33E+06	,	9.80E+05	,	2	,	3	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.05	,	2.39E+06	,	1.35E+05	,	3	,	4	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.175	,	0	,	0	,	4	,	5	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.4	,	2.88E+06	,	6.16E+05	,	5	,	6	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	9.825	,	2.01E+06	,	7.00E+05	,	6	,	7	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.575	,	0	,	0	,	7	,	8	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.575	,	0	,	0	,	8	,	9	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	6.625	,	2.50E+06	,	7.03E+05	,	9	,	10	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	9.825	,	2.01E+06	,	6.84E+05	,	10	,	11	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	9.825	,	2.01E+06	,	6.84E+05	,	11	,	12	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.35	,	2.75E+06	,	7.84E+05	,	12	,	13	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.5	,	2.73E+06	,	7.51E+05	,	13	,	14	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.375	,	0	,	0	,	14	,	15	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.375	,	2.58E+06	,	7.14E+05	,	15	,	16	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.825	,	0	,	0	,	16	,	17	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	7.825	,	0	,	0	,	17	,	18	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.825	,	2.26E+06	,	7.19E+05	,	18	,	19	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	8.18E+05	,	19	,	20	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	0	,	0	,	20	,	21	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	0	,	0	,	21	,	22	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.35	,	0	,	0	,	22	,	23	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	7.08E+05	,	23	,	24	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	5.50E+05	,	24	,	25	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	8.2	,	2.40E+06	,	5.50E+05	,	25	,	26	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	10.975	,	3.05E+06	,	3.44E+05	,	26	,	27	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.35	,	0	,	0	,	26	,	27	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.875	,	0	,	0	,	28	,	29	);
blkdyn.SetIMat(	1.00E+10	,	1.00E+10	,	4.875	,	0	,	0	,	29	,	30	);

																						
																	

//X 方向左侧法向约束
blkdyn.FixVByCoord("x", 0.0,  -0.1,  0.1   ,  0 , 136.4   ,  -0.1,   0.1);

//X 方向右侧法向约束
blkdyn.FixVByCoord("x", 0.0, 399.9 , 400.1 ,  0 , 185.9   ,   -0.1  , 0.1);

//Y 方向底部法向约束
blkdyn.FixVByCoord("y", 0.0, -0.1,  400.1 ,  -0.1,  0.1 ,  -0.1 ,  0.1);



//设置全部节点的局部阻尼为 0.8
blkdyn.SetLocalDamp(0.8);

//监测测点
dyna.Monitor("spring1", "sp_ndis", 8, 1, 0);
dyna.Monitor("spring1", "sp_nstress", 8, 1, 0);
dyna.Monitor("block1", "syy", 6717, 1, 0);

//设置所有单元为线弹性模型
blkdyn.SetModel("linear");


//支架赋空
blkdyn.SetModel("none", 42, 45);

blkdyn.SetIModel("linear");


//弹性计算
dyna.Solve();


//保存结果文件
dyna.Save("elastic.sav");


//将所有单元的计算模型设定为 Mohr-Coulomb 理想弹塑性模型
blkdyn.SetModel("MC");

///弹簧脆断
blkdyn.SetIModel("brittleMC");


//开切眼
blkdyn.SetModelByCoord("none", 97,105,10.8,17.6,-0.1,0.1);

//支架单元弹性
blkdyn.SetModel("linear", 42, 45);
 

//移架
var coord = new Array(108.229, 0.0, 0.0);
blkdyn.MoveGrid(coord, 42, 45);

//单元挖空或移架后，单元间的接触关系被置零，必须计算一步，找到彼此接触关系，才能通过接触面两侧的组号进行赋值
dyna.Solve(0);

//进行液压支架模型设置
blkdyn.SetIModel("HydroSupport", 42, 44);

blkdyn.SetIHydroSupportMat(1,1e9,0,1.0e9,0.25e9,1.54e6,3.08e6,2.57e7,1.42e7);

blkdyn.BindIHydroSupportMatByGroupInterface(1, 42, 44);

blkdyn.SetLocalDamp(0.005);

dyna.Solve(60000);

dyna.Save("qieyan.sav");


//每隔5m开挖，开挖40次
for(var istage = 0; istage < 40; istage++)
{
   var xcoord1 = 105 + istage * 5;
   var xcoord2 = 105 + istage * 5 + 5;
   
    blkdyn.SetModelByCoord("none", xcoord1, xcoord2, 10.8, 17.6, -0.1, 0.1); 

    //移动液压支架
    var coord = new Array(5, 0, 0); 
    blkdyn.MoveGrid(coord, 42, 45);

    //求解6万步
    dyna.Solve(20000);

    ///保持save文件
    var string = xcoord1 + "-" + xcoord2 + ".sav";
    dyna.Save(string); 

}


//打印求解信息
print("Solution Finished");