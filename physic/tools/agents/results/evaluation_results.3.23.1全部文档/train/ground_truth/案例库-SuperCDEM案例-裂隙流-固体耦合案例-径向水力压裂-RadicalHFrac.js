setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.monitorIter = 10;

scdem.gravity = [0, 0, 0];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);

scdem.set("Config_FracSeepage", 1);

scdem.set("Seepage_Mode", 1);
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_MaxWid", 5e-3);

var msh = imesh.importGmsh("RadBox-0.1m.msh");
scdem.getMesh(msh);

scdem.setModel("linear");
scdem.setMat([2500, 38.8e9, 0.15, 1e12, 1.5e6, 50, 10]);

scdem.setIModel("linear");
scdem.setIModel("FracE", 1, 2);
scdem.setContactFractureEnergy(32, 1e12, 1, 2);
scdem.setIMatByElem(10);

//设置流道
SFracsp.setFlowCrackFace(1,2);
SFracsp.createGridFromBlock(2);

scdem.set("FracSeepage_Cal", 1);

//设置流体的参数
var w = 1e-5;
var k = w * w / 12 / (1e-3);

SFracsp.setProp([1000.0, 2.2e9, k, w]);

//0.1m
SFracsp.applyConditionByCoord("source", 0.001, 0, 0, 0, 24.9, 25.1, 24.9, 25.1, 24.9, 25.1);

//注水点监测
scdem.monitor("fracsp", "sc_aperture", 25, 25, 25);
scdem.monitor("fracsp", "sc_pp", 25, 25, 25);

//开度监测
for (var i = 1; i <= 50; i++)
{
    scdem.monitor("fracsp", "sc_aperture", 25 + 0.12 * i, 25, 25)
}

for (var i = 1; i <= 50; i++)
{
    scdem.monitor("fracsp", "sc_aperture", 25, 25 + 0.12 * i, 25)
}

scdem.timeStep = 1e-7;

scdem.dynaSolveGpu(8);

print("finish");
