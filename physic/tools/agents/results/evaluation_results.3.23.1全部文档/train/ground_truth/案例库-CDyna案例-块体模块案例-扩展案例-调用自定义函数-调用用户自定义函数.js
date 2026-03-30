setCurDir(getSrcDir());

dyna.LoadUDF("CustomModel.dll");

dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");


var dist = dyna.RunUDFCmdAdv("CalDist", [0, 0, 0, 10, 10 ,0]);

print("Dist is ", dist);

dyna.FreeUDF();
