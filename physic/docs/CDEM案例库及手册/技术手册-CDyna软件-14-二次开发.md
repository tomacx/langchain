<!--HJS_secdev_overview-->

## 二次开发概述

CDEM动力学分析系统（CDyna）提供了强大的二次开发功能，用户可借助JavaScript脚本或C++进行二次开发。

<!--HJS_secdev_JavaScript-->

## 基于JavaScript的二次开发

<!--HJS_secdev_JavaScript_self-->

### JavaScript自带功能函数介绍

用户可以利用JavaScript脚本编写循环、分支、判断等代码，可以利用JavaScript脚本定义变量、数组、函数、对象等，还可利用JavaScript脚本自带的功能函数进行各类计算操作（如Math对象下面的各类数学函数等）。以下例子为借助JavaScript脚本创建了一个求两点之间距离的函数。

```javascript
//定义求距离的函数
function TwoPointDistance(Coord1, Coord2)
{
	//Math为JavaScript自带的数学库对象。
	Var result = Math.sqrt((Coord1[0] – Coord2[0]) * (Coord1[0] – Coord2[0]) +
			 			(Coord1[1] – Coord2[1]) * (Coord1[1] – Coord2[1]) + 
						(Coord1[2] – Coord2[2]) * (Coord1[2] – Coord2[2])); 
	return result;
}
//定义第一点坐标
var P1 = [10.0, 0.0, 0.0];
//定义第二点坐标
var P2 = [0.0, 10.0, 0.0];
//求两点的距离
var dist = TwoPointDistance(P1,P2);
//打印结果，print(<>)为GDEM-Env平台内置的函数。
print("The distance is ", dist);
```

<!--HJS_secdev_JavaScript_dynasuite-->

### CDyna自定义JavaScript接口使用介绍

CDyna提供了大量的接口函数，用户通过这些接口函数，可以对内存中存储的单元数据、节点数据等进行访问和设置。典型的接口函数见表5.1。

<center>表5.1 CDyna接口函数列表</center>

| **序号** | **接口函数名**                          | **作用说明**                                                 |
| -------- | --------------------------------------- | ------------------------------------------------------------ |
| 1        | dyna.GetValue(<>)                       | 全局信息的获取，返回值为浮点型。可获取通过dyna.Set设置的所有全局量。 |
| 2        | dyna.BeforeCal (<>)                     | 计算之前初始化。                                             |
| 3        | dyna.Solver(<>)                         | 单一迭代步求解，包含时步累加，但不包含结果推送。             |
| 4        | dyna.OutputMonitorData(<>)              | 每隔设定时步输出监测信息。                                   |
| 5        | blkdyn.GetElemID(<>)                    | 获得离某一坐标最近的单元ID号。                               |
| 6        | blkdyn.GetNodeID(<>)                    | 获得离某一坐标最近的节点ID号。                               |
| 7        | blkdyn.GetSpringID(<>)                  | 获得离某一坐标最近的半弹簧ID号。                             |
| 8        | blkdyn.GetFaceID(<>)                    | 获得某一个单元中，离某一坐标最近的局部面ID号。               |
| 9        | blkdyn.GetElemValue(<>)                 | 获得某一单元序号的值。                                       |
| 10       | blkdyn.GetElemFaceValue(<>)             | 获得某一单元序号及局部面序号的值。                           |
| 11       | blkdyn.GetNodeValue(<>)                 | 获得某一节点序号的值。                                       |
| 12       | blkdyn.GetSpringValue(<>)               | 获得某一弹簧序号的值。                                       |
| 13       | blkdyn.SetElemValue(<>)                 | 设置某一单元序号的值。                                       |
| 14       | blkdyn.SetNodeValue(<>)                 | 设置某一节点序号的值。                                       |
| 15       | blkdyn.SetSpringValue(<>)               | 设置某一弹簧序号的值。                                       |
| 16       | blkdyn.CalBlockForce(<>)                | 计算单元变形力。                                             |
| 17       | blkdyn.CalContactForce(<>)              | 寻找接触，计算接触力。                                       |
| 18       | blkdyn.CalDynaBound(<>)                 | 计算动态边界。                                               |
| 19       | blkdyn.CalRayleighDamp(<>)              | 计算瑞利阻尼力。                                             |
| 20       | blkdyn.CalQuietBound(<>)                | 计算静态边界条件（无反射）。                                 |
| 21       | blkdyn.CalFreeFieldBound(<>)            | 计算自由场边界（无反射）。                                   |
| 22       | blkdyn.CalNodeMovement(<>)              | 根据牛顿定律计算单元运动，必需放在上述15-20的后面，即每个迭代步先进行力的求解，在进行运动的求解。 |
| 23       | blkdyn.Solver(<>)                       | BlockDyna核心求解器，上述15-21功能的集合。                   |
| 24       | blkdyn.  CalElemForce(<>)               | 采用有限体积法，单独计算某个单元的变形力。                   |
| 25       | blkdyn.CalElemForceByStiffMatrix  (<>); | 采用刚度矩阵法，单独计算某个单元的变形力。                   |
| 26       | blkdyn.RenewNodalSS(<>);                | 更新节点应力。                                               |
| 27       | blkdyn.SearchElemInCell(<>);            | 搜索格子内单元，返回总数。                                   |
| 28       | blkdyn.GetElemIdInCell(<>);             | 返回某一索引号对应的单元ID                                   |
| 29       | pdyna.GetParticleValue(<>)              | 获取颗粒信息。                                               |
| 30       | pdyna.  GetPPContactValue(<>)           | 获取颗粒与颗粒间的接触信息。                                 |
| 31       | pdyna.  GetPFaceContactValue(<>)        | 获取颗粒与刚性面间的接触信息。                               |
| 32       | pdyna.  GetPBlockContactValue(<>)       | 获取颗粒与块体间的接触信息。                                 |
| 33       | pdyna.SetParticleValue(<>)              | 设置颗粒信息。                                               |
| 34       | pdyna.  SetPPContactValue(<>)           | 设置颗粒与颗粒间的接触信息。                                 |
| 35       | pdyna.  SetPFaceContactValue(<>)        | 设置颗粒与刚性面间的接触信息。                               |
| 36       | pdyna.  SetPBlockContactValue(<>)       | 设置颗粒与块体间的接触信息。                                 |
| 37       | pdyna.Solver(<>)                        | 颗粒核心计算，每一迭代步进行。                               |
| 38       | pdyna.CellMapping(<>)                   | 将颗粒映射至背景网格。                                       |
| 39       | pdyna.DetectContactAll(<>)              | 对颗粒-颗粒、颗粒-块体、颗粒-刚性面进行接触检测。            |
| 40       | pdyna.DetectPPContact(<>)               | 仅对颗粒-颗粒进行接触检测。                                  |
| 41       | pdyna.DetectPBContact(<>)               | 仅对颗粒-块体进行接触检测。                                  |
| 42       | pdyna.DetectPFContact(<>)               | 仅对颗粒-刚性面进行接触检测。                                |
| 43       | pdyna.CalPPContact(<>)                  | 计算颗粒-颗粒接触力。                                        |
| 44       | pdyna.CalPBContact(<>)                  | 计算颗粒-块体接触力。                                        |
| 45       | pdyna.CalPFContact(<>)                  | 计算颗粒-刚性面接触力。                                      |
| 46       | pdyna.CalRotaSpring(<>)                 | 计算转角弹簧。                                               |
| 47       | pdyna.CalQuietBound(<>)                 | 计算无反射边界。                                             |
| 48       | pdyna.CalDynaBound(<>)                  | 计算动态力。                                                 |
| 49       | pdyna.CalMovement(<>)                   | 计算颗粒运动。                                               |
| 50       | pdyna.PostProcess(<>)                   | 颗粒后处理。                                                 |
| 51       | pdyna.SearchParInCell(<>)               | 搜索某一个cell内的颗粒数。                                   |
| 52       | pdyna. GetParIdInCell(<>)               | 获取某一索引号对应的颗粒ID。                                 |
| 53       | poresp.GetNodeValue(<>)                 | 获得孔隙渗流节点信息                                         |
| 54       | poresp.SetNodeValue(<>)                 | 设置孔隙渗流节点信息                                         |
| 55       | poresp.Solver(<>)                       | 孔隙渗流核心求解器                                           |
| 56       | poresp.CalNodeSatAndPresLiquid(<>)      | 根据节点液体体积改变计算节点压力                             |
| 57       | poresp.CalNodeSatAndPresLiquidBiot(<>)  | 考虑biot效应，根据节点液体体积改变计算节点压力               |
| 58       | poresp.CalNodePressGas(<>)              | 根据节点质量改变计算节点气体压力                             |
| 59       | poresp.CalElemFlowDarcy(<>)             | 基于达西定律，根据节点压力计算单元流速                       |
| 60       | poresp.CalContactFlowTransfer(<>)       | 计算接触面上的流量传递                                       |
| 61       | poresp.AddBoundPresToSolid(<>)          | 将流体边界的压力施加于固体表面                               |
| 62       | poresp.CalAbsorbanceAndErosion(<>)      | 计算单元吸水弱化及溶蚀过程                                   |
| 63       | poresp.CalDynaBound(<>)                 | 计算渗流动态边界                                             |
| 64       | fracsp.GetNodeValue(<>)                 | 获取裂隙渗流节点信息的值。                                   |
| 65       | fracsp.GetElemValue(<>)                 | 获得裂隙渗流单元信息的值。                                   |
| 66       | fracsp.SetNodeValue(<>)                 | 设置裂隙渗流节点信息的值。                                   |
| 67       | fracsp.SetElemValue(<>)                 | 设置裂隙渗流单元信息的值。                                   |
| 68       | fracsp.CalDynaBound(<>)                 | 动态施加压力、流量边界（每一步执行）。                       |
| 69       | fracsp.CalNodePressure(<>)              | 计算节点压力及饱和度（每一步执行）。                         |
| 70       | fracsp.CalElemDischarge(<>)             | 动态单元流速、流量（每一步执行）。                           |
| 71       | fracsp.CalIntSolid(<>)                  | 计算与固体破裂的耦合（每一步执行）。                         |
| 72       | fracsp.CalIntPoreSp(<>)                 | 计算与孔隙渗流的耦合（每一步执行）。                         |
| 73       | fracsp.CalPipeDischarge(<>)             | 计算几何相交但不共节点裂隙单元间的流量透传（每一步执行）。   |
| 74       | fracsp.CalJetConvection(<>)             | 计算注入点材料性质的空间输运（每一步执行）。                 |
| 75       | fracsp.Solver(<>)                       | 裂隙渗流核心求解器，上述29-35功能的集成。                    |
| 76       | heatcd.GetNodeValue(<>)                 | 获取热传导节点信息                                           |
| 77       | heatcd.SetNodeValue(<>)                 | 设置热传导节点信息的值                                       |
| 78       | heatcd.Solver(<>)                       | 热传导核心求解器。                                           |
| 79       | heatcd.CalNodeTemperature(<>)           | 计算节点温度                                                 |
| 80       | heatcd.CalElemHeatTransfer(<>)          | 计算单元热流速                                               |
| 81       | heatcd.CalContactHeatTransfer(<>)       | 计算接触面的热传递                                           |
| 82       | bar.GetBarInfo(<>)                      | 获取每根杆件的信息。                                         |
| 83       | bar.GetSegValue(<>)                     | 获取杆件中某个单元的信息。                                   |
| 84       | bar.GetNodeValue(<>)                    | 获取杆件中某个节点的信息。                                   |
| 85       | bar.SetSegValue(<>)                     | 设置杆件中某单元信息。                                       |
| 86       | bar.SetNodeValue(<>)                    | 设置杆件中某节点信息。                                       |
| 87       | bar.Solver(<>)                          | 杆件核心求解器。                                             |
| 88       | link.GetElemValue(<>)                   | 获取某一Link单元的信息。                                     |
| 89       | link.SetElemValue(<>)                   | 设置某一Link单元的信息。                                     |
| 90       | rdface.GetElemValue(<>)                 | 获取刚性面单元的信息。                                       |
| 91       | rdface.Solver(<>)                       | 刚性面核心求解器。                                           |
| 92       | trff.Solver(<>)                         | 耦合面核心求解器。                                           |
| 93       | trff.GetValue(<>)                       | 获取耦合面单元的参数。                                       |
| 94       | trff.SetValue(<>)                       | 设置耦合面单元的参数。                                       |

以下给出了利用JavaScript调用CDyna核心求解模块，进行计算的示例。用户可以在每一迭代步对计算进行控制，添加个性化的操作函数。

```javascript
//设置当前目录为JS脚本文件所在目录
SetCurDir(GetSrcDir());

//设置个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//创建三维方块网格
blkdyn.GenBrick3D(10,10,10,20,20,20,1);

//设置单元的模型为线弹性模型
blkdyn.SetModel("linear");

//设置材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

//固定底部个方向的速度为
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

//设置Y方向的个监测点
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);


//计算前初始haul
dyna.BeforeCal();

//循环万步
for(var i = 0; i < 10000; i++)
{

	//集成核心计算
	//var unbal = blkdyn.Solver();

	//计算单元变形力
	blkdyn.CalBlockForce();

	//计算节点运动
	var unbal = blkdyn.CalNodeMovement();

	//输出监测信息
	dyna.OutputMonitorData();

	//每隔步推送信息
	if(i != 0 && i % 100 == 0)
	{
		//推送文本信息
		print("不平衡率：" + unbal);

		//推送结果信息至GDEM-Env
		dyna.PutStep(1,i,0.1);
	}
}
```

<!--HJS_secdev_CPP-->

## 基于C++的二次开发

由于JavaScript脚本是解释型语言，因此对于计算量大的二次开发（尤其在每一迭代步均需进行计算的情况），建议用户利用C++进行二次开发。

基于C++的二次开发，需要用户打开与CDyna软件相配套的CustomModel工程文件。利用Visual Studio 2015版本打开CustomModel.sln工程文件，编写个性化代码后，选择编译模式x64（64位）及Release或Debug，进行编译后，将在工程文件夹x64/Release（或x64/Debug）下产生CustomModel.dll动态链接库。

注意，在进行VS2015配置时，编译模式为x64（Debug或Release模式下均可），并在性质选项卡中设置MFC的使用方式为"Use MFC in a Shared DLL"以及字体方式为"Use Unicode Character Set"。具体见图5.1。

![](images/DynaSuite_SecDev_1.png)

<center>属性页配置方式</center>

若用户想启用运行调试功能，可在下图中的Debuging-Command中添加GDEM软件安装目录中的Genvi.exe路径。

![](images/DynaSuite_SecDev_2.png)

<center>Genvi.exe路径添加</center>

用户通过JavaScript接口函数dyna.LoadUDF("CustomModel")，即可实现对该动态链接库的加载。而后，用户即可通过接口函数dyna. SetUDFValue(<>)及dyna. RunUDFCmd(<>)、dyna. RunUDFCmdAdv(<>)实现对该动态链接库的控制。

CustomModel.sln工程文件包含"KernelInterfaceFuncForUser.h"、"CustomModel.h"等2个头文件及"CustomMethod.cpp"、"CustomModel_Element.cpp"、"CustomModel_Interface.cpp"、"CustomModel_Particle.cpp"、" CustomModel_MPM.cpp"等5个可执行文件。

现对上述7个文件的作用及其中的典型函数进行说明。

<!--HJS_secdev_CPP_KernelInterfaceFuncForUser-->

### KernelInterfaceFuncForUser.h

该头文件包含了BlockDyna软件提供的可以被用户所使用的各类C++级别的接口函数。这些函数大部分均有对应的JavaScript接口。各C++级别的接口函数的描述如表5.2所示。

<center>表5.2 CDyna提供的C++级别的接口函数</center>

| **序号** | **函数名**                                 | **功能**                                       | **JavaScript****对应接口**             |
| -------- | ------------------------------------------ | ---------------------------------------------- | -------------------------------------- |
| 1        | Set_String_To_Host                         | 向GDEM-Env平台输出文本显示                     | print(<>)                              |
| 2        | SetGlobalValue                             | 设置全局变量                                   | dyna.Set(<>)                           |
| 3        | GetGlobalValue                             | 获取全局变量                                   | dyna.GetValue(<>)                      |
| 4        | Set_ResultData_To_Host                     | 向GDEM-Env平台推送结果数据                     | dyna.PutStep(<>)                       |
| 5        | Dyna_BeforeCal                             | 核心计算前设置信息                             | dyna.BeforeCal (<>)                    |
| 6        | Dyna_Solver                                | 单独进行一次核心求解                           | dyna.Solver(<>)                        |
| 7        | GetElementValue                            | 获取单元信息                                   | blkdyn.GetElemValue(<>)                |
| 8        | GetElementFaceValue                        | 获取单元面信息                                 | blkdyn.GetElemFaceValue(<>)            |
| 9        | GetNodeValue                               | 获取节点信息                                   | blkdyn.GetNodeValue(<>)                |
| 10       | GetSpringValue                             | 获取接触弹簧信息                               | blkdyn.GetSpringValue(<>)              |
| 11       | SetElementValue                            | 设置单元信息                                   | blkdyn.SetElemValue(<>)                |
| 12       | SetNodeValue                               | 设置节点信息                                   | blkdyn.SetNodeValue(<>)                |
| 13       | SetSpringValue                             | 设置接触弹簧信息                               | blkdyn.SetSpringValue(<>)              |
| 14       | GetElementIDNearCoord                      | 获取最近点单元ID                               | blkdyn.GetElemID(<>)                   |
| 15       | GetNodeIDNearCoord                         | 获取最近点节点ID                               | blkdyn.GetNodeID(<>)                   |
| 16       | GetSpringIDNearCoord                       | 获取最近点弹簧ID                               | blkdyn.GetSpringID(<>)                 |
| 17       | GetFaceIDNearCoord                         | 获取最近点单元面ID                             | blkdyn.GetFaceID(<>)                   |
| 18       | BlockDyna_CalBlockForce                    | 计算单元变形力                                 | blkdyn.CalBlockForce(<>)               |
| 19       | BlockDyna_CalContactForce                  | 计算接触力                                     | blkdyn.CalContactForce(<>)             |
| 20       | BlockDyna_CalNodeMovement                  | 计算节点运动                                   | blkdyn.CalDynaBound(<>)                |
| 21       | BlockDyna_CalDynaBound                     | 施加动态边界                                   | blkdyn.CalRayleighDamp(<>)             |
| 22       | BlockDyna_CalRayleighDamp                  | 施加瑞利阻尼                                   | blkdyn.CalQuietBound(<>)               |
| 23       | BlockDyna_CalQuietBound                    | 施加粘性无反射条件                             | blkdyn.CalFreeFieldBound(<>)           |
| 24       | BlockDyna_CalFreeFieldBound                | 施加自由场边界条件                             | blkdyn.CalNodeMovement(<>)             |
| 25       | BlockDyna_Solver                           | 每一迭代步集成求解                             | blkdyn.Solver(<>)                      |
| 26       | Dyna_OutputMonitorData                     | 每一步输出监测信息                             | dyna.OutputMonitorData(<>)             |
| 27       | GetParticleValue                           | 获取颗粒信息                                   | pdyna.GetParticleValue(<>)             |
| 28       | GetPPContactValue                          | 获取颗粒与颗粒接触的信息                       | pdyna.GetPPContactValue(<>)            |
| 29       | GetPFaceContactValue                       | 获取颗粒与刚性面接触的信息                     | pdyna.GetPFaceContactValue(<>)         |
| 30       | GetPBlockContactValue                      | 获取颗粒与块体接触的信息                       | pdyna.GetPBlockContactValue(<>)        |
| 31       | SetParticleValue                           | 设置颗粒信息                                   | pdyna.SetParticleValue(<>)             |
| 32       | SetPPContactValue                          | 设置颗粒与颗粒接触的信息                       | pdyna.SetPPContactValue(<>)            |
| 33       | SetPFaceContactValue                       | 设置颗粒与刚性面接触的信息                     | pdyna.SetPFaceContactValue(<>)         |
| 34       | SetPBlockContactValue                      | 设置颗粒与块体接触的信息                       | pdyna.SetPBlockContactValue(<>)        |
| 35       | API_DEM_CellMapping                        | 映射颗粒至格子                                 | pdyna.CellMapping(<>)                  |
| 36       | API_DEM_Find_ContactAll                    | 接触检测集成                                   | pdyna.DetectContactAll(<>)             |
| 37       | API_DEM_Find_PP_Contact                    | 颗粒-颗粒检测                                  | pdyna.DetectPPContact(<>)              |
| 38       | API_DEM_Find_PB_Contact                    | 颗粒-块体检测                                  | pdyna.DetectPBContact(<>)              |
| 39       | API_DEM_Find_PF_Contact                    | 颗粒-刚性面检测                                | pdyna.DetectPFContact(<>)              |
| 40       | API_DEM_Cal_PP_Contact                     | 颗粒-颗粒接触力                                | pdyna.CalPPContact(<>)                 |
| 41       | API_DEM_Cal_PB_Contact                     | 颗粒-块体接触力                                | pdyna.CalPBContact(<>)                 |
| 42       | API_DEM_Cal_PF_Contact                     | 颗粒-刚性面接触力                              | pdyna.CalPFContact(<>)                 |
| 43       | API_DEM_Cal_Rotation_Spring                | 颗粒转角弹簧                                   | pdyna.CalRotaSpring(<>)                |
| 44       | API_DEM_Cal_Quiet_Bound                    | 无反射边界                                     | pdyna.CalQuietBound(<>)                |
| 45       | API_DEM_Cal_DynaBound                      | 动态力                                         | pdyna.CalDynaBound(<>)                 |
| 46       | API_DEM_Cal_Movement                       | 颗粒运动                                       | pdyna.CalMovement(<>)                  |
| 47       | API_DEM_PostProcess                        | 颗粒后处理                                     | pdyna.PostProcess(<>)                  |
| 48       | API_ParticleSolver                         | 颗粒核心求解器                                 | pdyna.Solver(<>)                       |
| 49       | SetPoreSeepageNodeValue                    | 设置孔隙渗流节点信息                           | poresp.SetNodeValue(<>)                |
| 50       | GetPoreSeepageNodeValue                    | 获取孔隙渗流节点信息                           | poresp.GetNodeValue(<>)                |
| 51       | API_PoreSeepageSolver                      | 孔隙渗流核心求解器                             | poresp.Solver(<>)                      |
| 52       | API_PoreSeepageCalNodeSatAndPresLiquid     | 根据节点液体体积改变计算节点压力               | poresp.CalNodeSatAndPresLiquid(<>)     |
| 53       | API_PoreSeepageCalNodeSatAndPresLiquidBiot | 考虑biot效应，根据节点液体体积改变计算节点压力 | poresp.CalNodeSatAndPresLiquidBiot(<>) |
| 54       | API_PoreSeepageCalNodePressGas             | 根据节点质量改变计算节点气体压力               | poresp.CalNodePressGas(<>)             |
| 55       | API_PoreSeepageCalElemFlowDarcy            | 基于达西定律，根据节点压力计算单元流速         | poresp.CalElemFlowDarcy(<>)            |
| 56       | API_PoreSeepageCalContactFlowTransfer      | 计算接触面上的流量传递                         | poresp.CalContactFlowTransfer(<>)      |
| 57       | API_PoreSeepageAddBoundPresToSolid         | 将流体边界的压力施加于固体表面                 | poresp.AddBoundPresToSolid(<>)         |
| 58       | API_PoreSeepageCalAbsorbanceAndErosion     | 计算单元吸水弱化及溶蚀过程                     | poresp.CalAbsorbanceAndErosion(<>)     |
| 59       | API_PoreSeepageCalDynaBound                | 计算渗流动态边界                               | poresp.CalDynaBound(<>)                |
| 60       | SetFracSeepageNodeValue                    | 设置裂隙渗流节点信息                           | fracsp.GetNodeValue(<>)                |
| 61       | GetFracSeepageNodeValue                    | 获取裂隙渗流节点信息                           | fracsp.SetNodeValue(<>)                |
| 62       | SetFracSeepageElemValue                    | 设置裂隙渗流单元信息                           | fracsp.SetElemValue(<>)                |
| 63       | GetFracSeepageElemValue                    | 获取裂隙渗流单元信息                           | fracsp.GetElemValue(<>)                |
| 64       | API_FracSP_CalDynaBound                    | 动态施加压力、流量                             | fracsp.CalDynaBound(<>)                |
| 65       | API_FracSP_CalPressure                     | 计算节点压力及饱和度                           | fracsp.CalNodePressure(<>)             |
| 66       | API_FracSP_CalElemDischargeByDarcyLaw      | 动态单元流速、流量                             | fracsp.CalElemDischarge(<>)            |
| 67       | API_FracSP_CalMechanicalInteraction        | 计算与固体破裂的耦合                           | fracsp.CalIntSolid(<>)                 |
| 68       | API_FracSP_CalPoreSeepageInteraction       | 计算与孔隙渗流的耦合                           | fracsp.CalIntPoreSp(<>)                |
| 69       | API_FracSP_CalPipeDischarge                | 计算几何相交流量透传                           | fracsp.CalPipeDischarge(<>)            |
| 70       | API_FracSP_CalJetConvection                | 计算注入点材料输运                             | fracsp.CalJetConvection(<>)            |
| 71       | API_FracSP_Solver                          | 裂隙渗流核心求解器                             | fracsp.Solver(<>)                      |
| 72       | SetThermalNodeValue                        | 设置热传导节点信息                             | heatcd.SetNodeValue(<>)                |
| 73       | GetThermalNodeValue                        | 获取热传导节点信息                             | heatcd.GetNodeValue(<>)                |
| 74       | API_ThermalSolver                          | 热传导核心求解器                               | heatcd.Solver(<>)                      |
| 75       | API_CalNodeTemperature                     | 计算节点温度                                   | heatcd.CalNodeTemperature(<>)          |
| 76       | API_ElemHeatTransfer                       | 计算单元热流速                                 | heatcd.CalElemHeatTransfer(<>)         |
| 77       | API_ContactHeatTransfer                    | 计算接触面的热传递                             | heatcd.CalContactHeatTransfer(<>)      |
| 78       | GetBarValue                                | 获取杆件信息                                   | bar.GetBarInfo(<>)                     |
| 79       | GetBarSegValue                             | 获取杆件单元信息                               | bar.GetSegValue(<>)                    |
| 80       | SetBarSegValue                             | 设置杆件单元信息                               | bar.SetSegValue(<>)                    |
| 81       | GetBarNodalValue                           | 获取杆件节点信息                               | bar.GetNodeValue(<>)                   |
| 82       | SetBarNodalValue                           | 设置杆件节点信息                               | bar.SetNodeValue(<>)                   |
| 83       | API_BarSolver                              | 杆件核心求解器                                 | bar.Solver(<>)                         |
| 84       | GetLinkValue                               | 获取Link单元信息                               | link.GetElemValue(<>)                  |
| 85       | SetLinkValue                               | 设置Link单元信息                               | link.SetElemValue(<>)                  |
| 86       | RigidFaceGetElementValue                   | 获取刚性面单元信息                             | rdface.GetElemValue(<>)                |
| 87       | API_RigidFace_Solver                       | 刚性面核心求解器                               | rdface.Solver(<>)                      |
| 88       | API_TRFF_CalculateAll                      | 耦合面核心求解器                               | trff.Solver(<>)                        |
| 89       | API_TRFF_GetValue                          | 获取耦合面数据                                 | trff.GetValue(<>)                      |
| 90       | API_TRFF_SetValue                          | 设置耦合面数据                                 | trff.SetValue(<>)                      |
| 91       | API_MPMSolver                              | mpm核心求解器                                  | Mpm.Solver(<>)                         |

由于上述C++级别的接口函数与对应的JavaScript接口函数在参数类型上基本一致，因此不对C++级别的接口函数进行详细叙述。

需要说明以下几点：

（1）JavaScript接口函数中，获取某一信息后是通过函数返回值的方式传递给JavaScript变量的；而C++级别的函数中，是通过形参中传引用实现的数据的回传（该形参为fValue）。

（2）C++级别的函数中，无论单元ID、节点ID、变量的分量ID，序号均是从1开始，即最小序号为1。

（3）C++级别的函数中，每个函数的返回值为0，表示函数正常执行；返回值为-1，表示出现异常错误。

以下一些C/C++级别的接口函数，没有对应的JS接口。具体见表5.3所示。

<center>表5.3 仅C/C++语言可用的接口函数</center>

| **序号** | **名称**                                                     | **释义**                                                     |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1        | int  JUDGE_IF_STOP_KERNEL();                                 | 利用C/C++进行用户自定义核心计算时，如果想在核心迭代循环过程中通过点击GUI界面的退出按钮退出迭代，可在核心循环中增加该函数。 |
| 2        | int  BlockDyna_ResetElemCell();                              | 按照子空间法自动更新Cell，并将单元按照体心映射到对应的Cell中。 |
| 3        | int  BlockDyna_GetCellInfo(double fMinCoord[3], double fMaxCoord[3], int  NoDivision[3]); | 得到Cell的基本信息，包括Cell最小坐标（fMinCoord），最大坐标（fMaxCoord），三个方向的分割数（NoDivision）。 |
| 4        | int  BlockDyna_GetElemIdInCell(int iCellIDx, int iCellIDy, int iCellIDz,  std::vector<int> &ElemID); | 根据输入的Cell序号（编号从0开始），返回该Cell中的单元ID（编号从1开始）。  iCellIDx，iCellIDy，iCellIDz为某一个cell在三个方向的ID。  ElemID为返回的单元ID号。 |
| 5        | int BlockDyna_GetCellIDNearCoord(double  fx, double fy, double fz, int iCellID[3]); | 根据输入的空间坐标位置，返回该点所在的Cell序号（编号从0开始）。 |
| 6        | int  BlockDyna_GetNodeValueFast(int NodeID, int NameFlag,  std::vector<double> &fValue); | 根据名字ID号快速获取节点变量，NodeID（节点序号，从1开始），NameFlag（名字序号，从1开始），fValue（返回值）。 |
| 7        | int  BlockDyna_SetNodeValueFast(int NodeID, int NameFlag,  std::vector<double> fValue); | 根据名字ID号快速设置节点变量，NodeID（节点序号，从1开始），NameFlag（名字序号，从1开始），fValue（返回值）。 |
| 8        | int  BlockDyna_GetPotentialElem(double fMin[3], double fMax[3],  std::vector<int> &ElemID); | 根据Bound Box的范围获取在该范围内的块体单元ID数组            |

上述BlockDyna_GetNodeValueFast函数及BlockDyna_GetNodeValueFast函数，可快速获取及设置的节点变量如表5.4所示。

<center>表5.4 可快速获取及设置的节点变量</center>

| **索引号** | **含义**             | **分量个数**         |
| ---------- | -------------------- | -------------------- |
| 1          | 位移                 | 3(x,y,z)             |
| 2          | 增量位移             | 3(x,y,z)             |
| 3          | 速度                 | 3(x,y,z)             |
| 4          | 加速度               | 3(x,y,z)             |
| 5          | 内力（计算中可叠加） | 3(x,y,z)             |
| 6          | 重力                 | 3(x,y,z)             |
| 7          | 内力（供显式）       | 3(x,y,z)             |
| 8          | 不平衡力             | 3(x,y,z)             |
| 9          | 是否固定速度         | 3(x,y,z)             |
| 10         | 速度约束值           | 3(x,y,z)             |
| 11         | 是否固定外力         | 3(x,y,z)             |
| 12         | 固定的外力值         | 3(x,y,z)             |
| 13         | 应力                 | 6(xx,yy,zz,xy,yz,xz) |
| 14         | 应变                 | 6(xx,yy,zz,xy,yz,xz) |
| 15         | 塑性应变             | 6(xx,yy,zz,xy,yz,xz) |
| 16         | 用户自定义变量       | 6                    |
| 17         | 初始坐标             | 3(x,y,z)             |
| 18         | 当前坐标             | 3(x,y,z)             |
| 19         | 节点关联的单元总数   | 1                    |
| 20         | 节点质量             | 1                    |
| 21         | 节点虚拟质量         | 1                    |
| 22         | 节点孔隙压力         | 1                    |
| 23         | 节点温度             | 1                    |
| 24         | 节点局部阻尼         | 1                    |
| 25         | 节点应变增量         | 6(xx,yy,zz,xy,yz,xz) |

<!--HJS_secdev_CPP_CustomModel-->

###  CustomModel.h

该头文件提供中提供了4个接口函数的申明，这4个接口函数可被CDyna核心程序所使用。用户进行的二次开发，也主要是在上述4个接口函数内进行。该4个函数的列表如表5.5所示。

<center>表5.5 可被CDyna核心所使用的用户自定义函数</center>

| **序号** | **函数名**                       | **功能**                                   |
| -------- | -------------------------------- | ------------------------------------------ |
| 1        | UserDef_ElemConstitutiveLaw      | 用户自定义单元本构                         |
| 2        | UserDef_InterfaceConstitutiveLaw | 用户自定义接触面本构                       |
| 3        | UserDefFunction_Execute          | 用户自定义命令流入口函数                   |
| 4        | UserDefAdvFunction_Execute       | 用户自定义高级函数入口，可以传入及传出参数 |
| 5        | UserDefKernalFunction            | 用户自定义核心迭代函数（每个迭代步均执行） |

<!--HJS_secdev_CPP_CustomMethod-->

### CustomMethod.cpp

该可执行文件提供了用户自定义命令流接口函数UserDefFunction_Execute、UserDefAdvFunction_Execute及用户自定义核心函数UserDefKernalFunction的实现。

用户自定义命令流接口函数UserDefFunction_Execute中，提供了"CalDist"及"PrintTotalVolume"等两类范例命令。其中"CalDist"根据输入的两点坐标计算两点的距离，"PrintTotalVolume"计算模型中所有单元的总体积。

```c++
/////////oCmd，字符串命令，每次传入不同的字符串，通过解析，可以执行不同的函数，相当于用户自定义了命令流
__declspec(dllexport) int __stdcall UserDefFunction_Execute(CString oCmd)
{
	CString oCmdS = oCmd;
	int i1;
	CString str0, str1;
	i1 = oCmdS.Find(' ');
	//如果字符串包含空格（表明存在多个变量）
	if(i1 != -1)
	{
		str0 = oCmdS.Left(i1);
		str1 = oCmdS.Mid(i1 + 1);
		if(str0 ==  "CalDist")//计算两点间的距离
		{
			//定义两个坐标点
			double coord1[3] = {0.0};
			double coord2[3] = {0.0};
			//读入两个坐标点
			sscanf(str1, _T("%lf%lf%lf%lf%lf%lf"),&coord1[0], &coord1[1], &coord1[2], &coord2[0], &coord2[1], &coord2[2]);
			double dist = sqrt ( (coord1[0] - coord2[0]) * (coord1[0] - coord2[0]) +				(coord1[1] - coord2[1]) * (coord1[1] - coord2[1]) + 
				(coord1[2] - coord2[2]) * (coord1[2] - coord2[2]));
			CString ost;
			ost.Format("两点之间的距离为：%lf", dist);
			Set_String_To_Host(ost);
		}
		else
		{
			AfxMessageBox(CString("没有这样的用户自定义命令，为：") + oCmd);
		}
	}
	//如果字符串不包含空格
	else
	{
		if(strcmp(oCmdS, "PrintTotalVolume") == 0)//获取所有单元的总体积
		{
			double fValue = 0.0;
			GetGlobalValue("Total_Block_Num", 1, fValue);
			int TotalBlockNo = (int)fValue;
			double Volume = 0;
			for(int ielem = 1; ielem <= TotalBlockNo; ielem++)
			{
				double tempV = 0.0;
				GetElementValue(ielem, "Volume", 1, tempV);
				Volume += tempV;
			}
			CString ost;
			ost.Format("数值模型的总体积为：%lf", Volume);
			Set_String_To_Host(ost);
		}
		else
		{
			AfxMessageBox(CString("没有这样的用户自定义命令，为：") + oCmd);
		}
	}
	return 0;
}
```

用户首先通过JavaScript脚本调入CustomModel动态链接库，该脚本接口函数为：dyna.LoadUDF("CustomModel")；而后，通过执行dyna.RunUDFCmd("CalDist 0 0 0 10 10 0")或dyna.RunUDFCmd("PrintTotalVolume")即可实现相应的用户自定义命令流。

用户高级自定义接口函数UserDefAdvFunction_Execute中，提供了CalDist函数的示例。该函数中，aPara为输入的动态数组，fReturnV为返回的浮点型值，用户可根据需要进行不同的设定。

```c++
__declspec(dllexport) int __stdcall UserDefAdvFunction_Execute(CString oCmd, std::vector<double> aPara, double &fReturnV)
{
	if(oCmd.CompareNoCase("CalDist") == 0)//计算两点间的距离
	{
		if(aPara.size() != 6)
		{
			return -1;
		}

		double coord1[3] = {aPara[0], aPara[1], aPara[2]};
		double coord2[3] = {aPara[3], aPara[4], aPara[5]};
		
		fReturnV = sqrt ( (coord1[0] - coord2[0]) * (coord1[0] - coord2[0]) + 
			(coord1[1] - coord2[1]) * (coord1[1] - coord2[1]) + 
			(coord1[2] - coord2[2]) * (coord1[2] - coord2[2]));

	}
	else
	{

		AfxMessageBox(CString("没有这样的用户自定义命令，为：") + oCmd);
		return -1;
	}

	return 0;
}
```

用户首先通过JavaScript脚本调入CustomModel动态链接库，该脚本接口函数为：dyna.LoadUDF("CustomModel")；而后，通过执行var dist = dyna.RunUDFCmdAdv("CalDist", [0, 0, 0, 10, 10 ,0])即可实现相应的用户自定义命令流。

 

用户自定义核心接口函数UserDefKernalFunction将在每一迭代步自动调用，用户可在该函数中写入每一迭代步需要完成的事项（如施加某些时间相关的边界条件、实时统计某些参数等）。该核心接口函数中，提供了每个100个迭代步打印相应信息的实例。**若用户希望UserDefKernalFunction函数起作用，则需要借助接口函数dyna.Set(<>)设置"If_Allow_UDF_Kernel"变量为1。**

```c++
__declspec(dllexport) int __stdcall UserDefKernalFunction(const int &iter, const double &time_now)
{
	// iter当前计算时步
	//time_now,当前时间
	if(iter % 100 == 0)
	{
		CString ost;
		ost.Format("********调用动态链接库，当前时间为：%e *********", time_now);
		Set_String_To_Host(ost);
	}
	
	return 0;
}
```

<!--HJS_secdev_CPP_CustomModel_Element-->

### CustomModel_Element.cpp

该可执行文件中提供了单元二次开发本构的实现方式（接口函数名为UserDef_ElemConstitutiveLaw），并提供了Drukcer-Parager理想弹塑性模型的实现方式。

```c++
__declspec(dllexport) int __stdcall UserDef_ElemConstitutiveLaw(const int ElemID, const std::vector<double> &UserDefParameters, const double Volume, const double DeltDispGrad[3][3], const double ElementDeltaStrain[6],const double LastElementPlasticStrain[6], const double &TimeStep, const int &ElementGroup,double ElementStrain[6], double ElementStress[6], double ElementDeltPlasticStrain[6], int &CurrentFailureFlag, double UDM_P[6])
{
	///////////////参数说明///////////////////
	//////ElemID，单元的ID号
	/////UserDefParameters，输入参数，用户自定义的材料参数值列表，可通过命令流"Set UserDefValue"指定
	/////Volume,单元当前的体积
	/////DeltDispGrad，输入参数，位移增量的三个分量在三个方向的梯度，xx,xy,xz;   yx,yy,yz;  zx,zy,zz，该梯度除以TimeStep即为速度梯度
	/////ElementDeltaStrain，输入参数，单元的增量应变，xx,yy,zz,xy,yz,zx
	/////LastElementPlasticStrain，输入参数，单元上一时步的塑性应变，xx,yy,zz,xy,yz,zx，用于一些本构的分析计算
	/////TimeStep，输入参数，计算时步，真实质量时步
	/////ElementGroup，输入参数，单元组号
	////////ElementStrain，输出参数，单元的当前应变值，通过ElementDeltaStrain的累加获得。
	////////ElementStress，输出参数，单元的当前应力值，通过本函数定义的本构获得。
	////////ElementDeltPlasticStrain，输出参数，单元当前的塑性应变增量，通过本函数定义的本构获得。
	////////CurrentFailureFlag，单元的当前破坏标记，通过本函数定义的本构获得。
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	////////UDM_P，用户自定义的存储于单元（插值至节点）上的个量，可通过"绘图设置->应力应变及自定义"查看。
	//////////////可通过Monitor block/block1 UDM_P1/UDM_P2……UDM_P6进行监测
	//////////////可通过"数据拣选输出"对话框进行信息的输出。


	//////////////////////////////////////////////////////////////////////////////////////
	/////////////////////      以Drucker-Prager模型为例       ///////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////

	if(UserDefParameters.size() >= 6)
	{
		////////////////////////////////////////////////////////////////
		/////////////参数读取及转化
		////////////////////////////////////////////////////////////////

		//////弹性参数
		double E  = UserDefParameters[0]; ///弹性模量
		double mu = UserDefParameters[1]; ///泊松比

		double K = E / (3.0 * (1.0 - 2.0 * mu)); ///体积模量
		double G = E / (2.0 * (1.0 + mu)); ////剪切模量

		/////强度参数
		double C    = UserDefParameters[2]; ///粘聚力
		double T    = UserDefParameters[3]; ///抗拉强度
		double FaiA = UserDefParameters[4]; ///内摩擦角，度
		double DiaA = UserDefParameters[5]; ///剪胀角，度

		/////转化为弧度
		double Fai = FaiA * PI / 180.0;  ///内摩擦角
		double Dia = DiaA * PI / 180.0;  ///剪胀角

		////////////////////////////////////////////////////////////////
		/////////////弹性试探应力场计算
		////////////////////////////////////////////////////////////////

		////本步应变值，累加应变增量获得
		ElementStrain[0] += ElementDeltaStrain[0];
		ElementStrain[1] += ElementDeltaStrain[1];
		ElementStrain[2] += ElementDeltaStrain[2];
		ElementStrain[3] += ElementDeltaStrain[3];
		ElementStrain[4] += ElementDeltaStrain[4];
		ElementStrain[5] += ElementDeltaStrain[5];
		/////体积应变增量
		double Aver_Bulk_DeltaStrain=ElementDeltaStrain[0] + ElementDeltaStrain[1] + ElementDeltaStrain[2];
		/////系数
		double coeff = K - 2.0 / 3.0 * G;
		//////当前时步试探应力，此处ElementStress中存储着上一时步的应力
		double StressTry[6] = {0.0};
		StressTry[0] = ElementStress[0] + 2.0 * G * ElementDeltaStrain[0] + coeff * Aver_Bulk_DeltaStrain;
		StressTry[1] = ElementStress[1] + 2.0 * G * ElementDeltaStrain[1] + coeff * Aver_Bulk_DeltaStrain;
		StressTry[2] = ElementStress[2] + 2.0 * G * ElementDeltaStrain[2] + coeff * Aver_Bulk_DeltaStrain;
		StressTry[3] = ElementStress[3] + 2.0 * G * ElementDeltaStrain[3];
		StressTry[4] = ElementStress[4] + 2.0 * G * ElementDeltaStrain[4];
		StressTry[5] = ElementStress[5] + 2.0 * G * ElementDeltaStrain[5];

		ElementStress[0] = StressTry[0];
		ElementStress[1] = StressTry[1];
		ElementStress[2] = StressTry[2];
		ElementStress[3] = StressTry[3];
		ElementStress[4] = StressTry[4];
		ElementStress[5] = StressTry[5];	

		////////////////////////////////////////////////////////////////
		/////////////应力修正及塑性流动
		////////////////////////////////////////////////////////////////
		////For the inner adjustment,内部适应，比摩尔库伦准则危险
		double qfai     = 6.0 * sin(Fai) / (sqrt(3.0) * (3.0 + sin(Fai)));
		double qfai_dia = 6.0 * sin(Dia) / (sqrt(3.0) * (3.0 + sin(Dia)));
		double kfai     = 6.0 * C * cos(Fai) / (sqrt(3.0) * (3.0 + sin(Fai)));

		///D_P准则中抗拉强度有个上限值，即剪切线与横轴交点
		if(T > (kfai / qfai))
		{
			T = kfai / qfai;
		}
		///等效正应力
		double bulk_stress = (StressTry[0] + StressTry[1] + StressTry[2]) / 3.0;
		///偏应力分量
		double devia_stress[6]={StressTry[0] - bulk_stress,StressTry[1] - bulk_stress,StressTry[2] - bulk_stress, 
			                    StressTry[3],              StressTry[4],              StressTry[5]};
		//等效剪应力
		double shear_stress=sqrt( 0.5 * sqr(devia_stress[0]) + 0.5 * sqr(devia_stress[1]) + 0.5 * sqr(devia_stress[2]) + 
			                            sqr(devia_stress[3]) +       sqr(devia_stress[4]) +       sqr(devia_stress[5]) );
		/////剪切屈服条件
		double fs = shear_stress + qfai * bulk_stress - kfai;
		/////拉伸屈服条件
		double ft = bulk_stress - T;
		////满足条件，达到拉伸或剪切破坏条件
		if(fs >= 0.0 || ft >= 0.0)
		{
			double taop = kfai - qfai * T;
			double ap   = sqrt(1.0 + qfai * qfai) - qfai;
			double h    = shear_stress - taop - ap * (bulk_stress - T);
			///根据h指标，确定是发生拉伸，还是剪切破坏
			if(h > 0)
			{
				///剪切破坏
				CurrentFailureFlag = 1;
				double lamda = fs / (G + K * qfai * qfai_dia);
				double bulk_stress_new  = bulk_stress - lamda * K * qfai_dia;
				double shear_stress_new = shear_stress - lamda * G;
				devia_stress[0] = devia_stress[0] * shear_stress_new / shear_stress;
				devia_stress[1] = devia_stress[1] * shear_stress_new / shear_stress;
				devia_stress[2] = devia_stress[2] * shear_stress_new / shear_stress;
				devia_stress[3] = devia_stress[3] * shear_stress_new / shear_stress;
				devia_stress[4] = devia_stress[4] * shear_stress_new / shear_stress;
				devia_stress[5] = devia_stress[5] * shear_stress_new / shear_stress;
				ElementStress[0] = devia_stress[0] + bulk_stress_new;
				ElementStress[1] = devia_stress[1] + bulk_stress_new;
				ElementStress[2] = devia_stress[2] + bulk_stress_new;
				ElementStress[3] = devia_stress[3];
				ElementStress[4] = devia_stress[4];
				ElementStress[5] = devia_stress[5];			
			}
			else
			{
				/////拉伸破坏
				CurrentFailureFlag = 2;
				ElementStress[0] = StressTry[0] + (T - bulk_stress);
				ElementStress[1] = StressTry[1] + (T - bulk_stress);
				ElementStress[2] = StressTry[2] + (T - bulk_stress);

			}
			double delt_stress[6] = {0.0};

			////试探应力与修正后应力的差
			delt_stress[0] = StressTry[0] - ElementStress[0];
			delt_stress[1] = StressTry[1] - ElementStress[1];
			delt_stress[2] = StressTry[2] - ElementStress[2];
			delt_stress[3] = StressTry[3] - ElementStress[3];
			delt_stress[4] = StressTry[4] - ElementStress[4];
			delt_stress[5] = StressTry[5] - ElementStress[5];

			//////////////本时步引起的塑性应变增量
			ElementDeltPlasticStrain[0] = (delt_stress[0] - mu * (delt_stress[1] + delt_stress[2])) / E;
			ElementDeltPlasticStrain[1] = (delt_stress[1] - mu * (delt_stress[0] + delt_stress[2])) / E;
			ElementDeltPlasticStrain[2] = (delt_stress[2] - mu * (delt_stress[1] + delt_stress[0])) / E;
			ElementDeltPlasticStrain[3] = 0.5 * delt_stress[3] / G;
			ElementDeltPlasticStrain[4] = 0.5 * delt_stress[4] / G;
			ElementDeltPlasticStrain[5] = 0.5 * delt_stress[5] / G;
		}
		UDM_P[0] = T;
		UDM_P[1] = C;
		return 0;
	}
	else 
	{
		/////DP模型需要的输入参数为个，用户自定义的参数小于个，返回错误标识符
		return -1;
	}
}
```

用户首先通过JavaScript脚本调入CustomModel动态链接库，该脚本接口函数为：dyna.LoadUDF("CustomModel")；而后通过blkdyn.SetMat(<>)系列函数设定基础材料参数，通过dyna. SetUDFValue(<>)设置自定义材料参数；接着通过blkdyn.SetModel等系列函数将单元的本构模型设置为"Custom"。这样，在核心计算时，CDyna将自动调用用户自定义的本构进行计算。

<!--HJS_secdev_CPP_CustomModel_Interface-->

### CustomModel_Interface.cpp

该可执行文件中提供了接触面二次开发本构的实现方式（接口函数名为UserDef_InterfaceConstitutiveLaw），并提供了脆性断裂模型的实现方式。

```c++
__declspec(dllexport) int __stdcall UserDef_InterfaceConstitutiveLaw(const int SpringID, const std::vector<double> &UserDefParameters, const double LocalDeltaDisp[3], const double LocalDisp[3], const bool &IfFailure, const double &ContactArea, const double &TimeStep, double LocalForce[3], int &CurrentFailureFlag, bool &If_Crack, double UDM_P[6])
{
	///////////////参数说明///////////////////
	/////SpringID，交界面弹簧ID号
	/////UserDefParameters，输入参数，用户自定义的材料参数值列表，可通过命令流"Set UserDefValue"指定
	/////LocalDeltaDisp，输入参数，接触局部坐标系下三个方向的位移增量，前两个为切向，第三个为法向，该增量位移除以TimeStep即为速度
	/////LocalDisp，输入参数，接触局部坐标系下三个方向的位移全量，前两个为切向，第三个为法向
	////////IfFailure，输入参数，该接触是否曾经进入过破坏，由该函数传出去的CurrentFailureFlag判定
	/////ContactArea，输入参数，接触面积，由于采用半弹簧技术，此面积为真实接触面积的一半
	/////TimeStep，输入参数，计算时步，真实质量时步

	////////LocalForce，输出参数，局部坐标系下接触力，前两个为切向分量，第三个为法向分量。
	////////CurrentFailureFlag，输出参数，当前接触破坏标记0-不坏，-拉坏，-剪坏
	////////If_Crack，该节理位置是否显示裂纹，true为显示。

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////UDM_P，用户自定义的存储于节理上的个变量，可通过"绘图设置->块体、节理信息->节理性质（云图）"查看。
	//////////////可通过Monitor spring/spring1 sp_UDM_P1/sp_UDM_P2……sp_UDM_P6进行监测
	//////////////可通过"数据拣选输出"对话框进行信息的输出。

	//////////////////////////////////////////////////////////////////////////////////////
	/////////////////////      以Mohr-Coulomb、拉伸脆断模型为例       ///////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////

	if(UserDefParameters.size() >= 5)
	{
		////////////////////////////////////////////////////////////////
		/////////////参数读取及转化
		////////////////////////////////////////////////////////////////

		//////弹性参数
		double kn = UserDefParameters[0]; ///单位面积法向接触刚度，Pa/m
		double kt = UserDefParameters[1]; ///单位面积切向接触刚度，Pa/m

		/////强度参数
		double C    = UserDefParameters[2]; ///粘聚力
		double T    = UserDefParameters[3]; ///抗拉强度
		double FaiA = UserDefParameters[4]; ///内摩擦角，度

		double StiffKn = kn * ContactArea;
		double StiffKt = kt * ContactArea;
		double Friction = tan (FaiA * PI / 180.0);  ///摩擦系数

		//////弹性试探应力，采用增量法，负号表示力与位移方向相反
		LocalForce[0] += - StiffKt * LocalDeltaDisp[0]; /////切向力
		LocalForce[1] += - StiffKt * LocalDeltaDisp[1]; /////切向力
		LocalForce[2] += - StiffKn * LocalDeltaDisp[2]; /////法向力

		//////每一迭代步，先将破坏指标设定为，不破坏
		CurrentFailureFlag = 0;

		/////若该接触历史上曾经进入过破坏，则抗拉强度及粘聚力置零
		if(IfFailure == true)
		{
			C = 0.0;
			T = 0.0;
		}

		//////拉伸破坏
		if(  -LocalForce[2] > (T * ContactArea)  )
		{
			LocalForce[0]=0.0;
			LocalForce[1]=0.0;
			LocalForce[2]=0.0;
			CurrentFailureFlag = 1; ///拉坏
		}
		else
		{
			double shear_force     = sqrt( sqr(LocalForce[0]) + sqr(LocalForce[1]) ); ////切向合力

			double shear_force_max = LocalForce[2] * Friction + C * ContactArea;  ///Mohr-Coulomb准则极限力

			if(shear_force_max < 0.0)
			{
				shear_force_max = 0.0;
			}

			////剪切破坏
			if( shear_force > shear_force_max && shear_force > 0.0)
			{
				LocalForce[0] = shear_force_max * LocalForce[0] / shear_force;
				LocalForce[1] = shear_force_max * LocalForce[1] / shear_force;

				CurrentFailureFlag = 2; ///剪坏
		
			}
		}

		UDM_P[0] = T;
		UDM_P[1] = C;

		if(T == 0.0 || C == 0.0)
		{
			If_Crack = true;
		}
		return 0;
	}
	else 
	{
/////节理脆断模型，需要的输入参数为个，用户自定义的参数小于个，返回错误标识符
		return -1;
	}
}
```

用户首先通过JavaScript脚本调入CustomModel动态链接库，该脚本接口函数为：dyna.LoadUDF("CustomModel")；而后通过blkdyn.SetIMat(<>)系列函数设定接触面的基本材料参数，通过dyna. SetUDFValue(<>)设置自定义材料参数；接着通过blkdyn.SetIModel等系列函数将接触面的本构模型设置为"Custom"。这样，在核心计算时，CDyna将自动调用用户自定义的接触本构进行计算。

<!--HJS_secdev_CPP_CustomModel_Particle-->

### CustomModel_Particle.cpp

该可执行文件中提供了颗粒与颗粒接触的二次开发本构的实现方式（接口函数名为UserDef_ParticleConstitutiveLaw），并提供了脆性断裂Mohr-Coulomb模型的实现方式。

```c++
__declspec(dllexport) int __stdcall UserDef_ParticleConstitutiveLaw(const int ParticleID, const int ContactID, const std::vector<double>  &UserDefParameters, const int &PType, const double P1Coord[3], const double P2Coord[3],const double &fRad1, const double &fRad2,const double LocalDeltaDisp[3], const double LocalDisp[3], const bool &IfFailure,const double &TimeStep, double LocalForce[3], int &CurrentFailureFlag, double UDM_P[6])
{
	///////////////参数说明///////////////////
	//////ParticleID，颗粒ID号
	//////ContactID，颗粒与颗粒接触的ID号
	/////UserDefParameters，输入参数，用户自定义的材料参数值列表，可通过命令流"Set UserDefValue"指定
	/////PType，输入参数，颗粒二三维识别，---二维，---三维
	/////P1Coord，输入参数，颗粒的当前坐标，x,y,z
	/////P2Coord，输入参数，颗粒的当前坐标，x,y,z
	/////fRad1，输入参数，颗粒的半径
	/////fRad2，输入参数，颗粒的半径
	/////LocalDeltaDisp，输入参数，接触局部坐标系下三个方向的位移增量，前两个为切向，第三个为法向，该增量位移除以TimeStep即为速度
	/////LocalDisp，输入参数，接触局部坐标系下三个方向的位移全量，前两个为切向，第三个为法向
	////////IfFailure，输入参数，该接触是否曾经进入过破坏，由该函数传出去的CurrentFailureFlag判定
	/////TimeStep，输入参数，计算时步，真实质量时步
	////////LocalForce，输出参数，局部坐标系下接触力，前两个为切向分量，第三个为法向分量。
	////////CurrentFailureFlag，输出参数，当前接触破坏标记0-不坏，-拉坏，-剪坏
	////////UDM_P，用户自定义的存储于颗粒接触对上的个变量，可通过"绘图设置->颗粒显示->颗粒力链"查看。

	//////////////////////////////////////////////////////////////////////////////////////
	/////////////////////      以Mohr-Coulomb、拉伸脆断模型为例       ///////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////

	if(UserDefParameters.size() >= 5)
	{
		////////////////////////////////////////////////////////////////
		/////////////参数读取及转化
		////////////////////////////////////////////////////////////////
		//////弹性参数
		double E  = UserDefParameters[0];  ///弹性模量
		double mu = UserDefParameters[1]; ///泊松比
		double G = E / (2.0 * (1.0 + mu)); ///剪切模量
		/////强度参数
		double C        = UserDefParameters[2]; ///粘聚力
		double T        = UserDefParameters[3]; ///抗拉强度
		double FaiA     = UserDefParameters[4]; ///内摩擦角，度
		double Friction = tan (FaiA * PI / 180.0);  ///摩擦系数

		double Length = fRad1 + fRad2;
		double MinRad = fRad1;
		MinRad = MinRad < fRad2 ? MinRad : fRad2;

		////计算接触面积，二维为较小球的直径，三维为较小球的面积
		double ContactArea = 2.0 * MinRad;
		if(PType == 2) ///3D
		{
			ContactArea = PI * MinRad * MinRad;
		}
		double StiffKn  = E * ContactArea / Length; ////法向刚度
		double StiffKt  = G * ContactArea / Length; ////切向刚度

		//////弹性试探应力，采用增量法，负号表示力与位移方向相反
		LocalForce[0] += - StiffKt * LocalDeltaDisp[0]; /////切向力
		LocalForce[1] += - StiffKt * LocalDeltaDisp[1]; /////切向力
		LocalForce[2] += - StiffKt * LocalDeltaDisp[2]; /////法向力
		//////每一迭代步，先将破坏指标设定为，不破坏
		CurrentFailureFlag = 0;
		/////若该接触历史上曾经进入过破坏，则抗拉强度及粘聚力置零
		if(IfFailure == true)
		{
			C = 0.0;
			T = 0.0;
		}
		//////拉伸破坏
		if(  -LocalForce[2] > (T * ContactArea)  )
		{
			LocalForce[0]=0.0;
			LocalForce[1]=0.0;
			LocalForce[2]=0.0;
			CurrentFailureFlag = 1; ///拉坏
		}
		else
		{
			double shear_force = sqrt( sqr(LocalForce[0]) + sqr(LocalForce[1]) ); ////切向合力
			    double shear_force_max = LocalForce[2] * Friction + C * ContactArea;   
///Mohr-Coulomb准则极限力
			if(shear_force_max < 0.0)
			{
				shear_force_max = 0.0;
			}
			////剪切破坏
			if( shear_force > shear_force_max && shear_force > 0.0)
			{
				LocalForce[0] = shear_force_max * LocalForce[0] / shear_force;
				LocalForce[1] = shear_force_max * LocalForce[1] / shear_force;
				CurrentFailureFlag = 2; ///剪坏
			}
		}
		UDM_P[0] = T;
		UDM_P[1] = C;
		return 0;
	}
	else 
	{
	/////颗粒脆断模型，需要的输入参数为个，用户自定义的参数小于个，返回错误标识符
		return -1;
	}
}
```

用户首先通过JavaScript脚本调入CustomModel动态链接库，该脚本接口函数为：dyna.LoadUDF("CustomModel")；而后通过pdyna.SetMat(<>)系列函数设定基础材料参数，通过dyna.SetUDFValue(<>)设置自定义材料参数；接着通过pdyna.SetModel等系列函数将颗粒接触的本构模型设置为"Custom"。这样，在核心计算时，CDyna将自动调用用户自定义的本构进行计算。

<!--HJS_secdev_CPP_CustomModel_MPM-->

### CustomModel_MPM.cpp

该可执行文件中提供了基于颗粒的MPM方法的二次开发本构实现方式（接口函数名为UserDef_MPMConstitutiveLaw），并提供了气体绝热膨胀模型的实现方式。

```c++
__declspec(dllexport) int __stdcall UserDef_MPMConstitutiveLaw (const double TimeStep, const std::vector<int> aParID, const std::vector<double> &UserDefParameters, const double DeltDispGrad[3][3],const double DeltStrain[6], double Strain[6], double Stress[6], double PlasticStrain[6], double aDamage[3])
{
	///////////////参数说明///////////////////
	//////TimeStep，输入参数，时步（如果虚质量开关打开，为虚拟时步；否则为真实时步）
	//////aParID，输入参数，MPM格点内的粒子ID号数组，编号从开始
	/////UserDefParameters，输入参数，用户自定义的材料参数值列表，可通过dyna. SetUDFValue(afValue)指定
	/////DeltDispGrad，输入参数，位移增量的空间梯度，除以TimeStep即可得到速度空间梯度，分别为xx/xy/xz/yx/yy/yz/zx/zy/zz
	/////DeltStrain，输入参数，应变增量，除以TimeStep即可得到应变率，分别为xx、yy、zz、xy、yz、zx
	/////Strain，输出参数，应变全量
	/////Stress，输出参数，应力全量
	/////PlasticStrain，输出参数，塑性应变全量
	/////aDamage，输出参数，损伤值

	if(UserDefParameters.size() >= 2)
	{
		double InitPressure = UserDefParameters[0]; //初始压力
		double AdCoeff      = UserDefParameters[1]; //绝热指数
		//当前压力
		double PressureNow = InitPressure;

		double fBulkStrain = Strain[0] +  Strain[1] +  Strain[2];

		if(fBulkStrain > 0.0)
		{
			PressureNow = InitPressure * pow( (1.0 / (1.0 + fBulkStrain)), AdCoeff);
		}

		//返回应变
		Strain[0] += DeltStrain[0];
		Strain[1] += DeltStrain[1];
		Strain[2] += DeltStrain[2];
		Strain[3] += DeltStrain[3];
		Strain[4] += DeltStrain[4];
		Strain[5] += DeltStrain[5];

		//返回应力
		Stress[0] = -PressureNow;
		Stress[1] = -PressureNow;
		Stress[2] = -PressureNow;
		Stress[3] = 0.0;
		Stress[4] = 0.0;
		Stress[5] = 0.0;
	}
	else
	{
		return -1;
	}
	return 0;
}
```

用户首先通过JavaScript脚本调入CustomModel动态链接库，该脚本接口函数为：dyna.LoadUDF("CustomModel")；而后通过pdyna.SetMat(<>)系列函数设定基础材料参数，通过dyna.SetUDFValue(<>)设置自定义材料参数；接着通过mpm.SetModel等系列函数将mpm的本构模型设置为"Custom"。这样，在核心计算时，CDyna将自动调用用户自定义的本构进行计算。

