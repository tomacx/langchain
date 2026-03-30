setCurDir(getSrcDir());

dyna.Clear();

dyna.Set("Output_Interval 500");
dyna.Set("Gravity -9.8 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");

dyna.LoadUDF("CustomModel");

pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0, 0);

pdyna.SetModel("linear");

pdyna.SetMat(2500, 3e10, 0.25, 0, 0, 45, 0.02, 0.0);

pdyna.FixV("xyz", 0.0, "y", -11, -9);

var avalue = [3e10, 0.25, 0, 0, 45];
dyna.SetUDFValue(avalue);

pdyna.SetModel("custom");

dyna.Solve();

dyna.FreeUDF();
