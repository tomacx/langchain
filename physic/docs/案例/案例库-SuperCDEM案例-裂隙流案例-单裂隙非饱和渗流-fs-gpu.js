setCurDir(getSrcDir());

//包含裂隙计算模块，开辟相应内存
scdem.set("Config_FracSeepage", 1);

scdem.set("FracSeepage_Cal", 1);

scdem.set("Mechanic_Cal", 0);

scdem.set("gravity",[0.0,0.0,0.0]);

scdem.outputInterval = 1000;
scdem.monitorIter = 10;

var msh = imesh.importGmsh("boxcrack.msh");
scdem.getMesh(msh);

SFracsp.setFlowCrackFace(1,2);
SFracsp.createGridFromBlock(2);

SFracsp.setPropByCoord([1000.0,2e8,1e-9,1e-4], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.applyConditionByCoord("pp", 10e6, 0,0,0, -1, 0.001, -1e5, 1e5, -1e5, 1e5)


for(var i = 0; i <= 50; i++)
{
    scdem.monitor("fracsp", "sc_pp", i,0.5,0.5)
}

for(var i = 0; i <= 50; i++)
{
   scdem.monitor("fracsp", "sc_sat", i,0.5,0.5)
}

scdem.timeStep = 0.01;

scdem.dynaSolveGpu(30*3600);

print("finish");