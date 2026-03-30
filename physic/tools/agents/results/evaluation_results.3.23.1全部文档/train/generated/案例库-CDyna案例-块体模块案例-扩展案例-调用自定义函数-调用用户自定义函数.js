setCurDir(getSrcDir());

dyna.LoadUDF("CustomModel");

dyna.Set("If_Allow_UDF_Kernel", 1);

var dist = dyna.RunUDFCmdAdv("CalDist", [0, 0, 0, 10, 10, 0]);

if (dist === -1) {
    print("没有这样的用户自定义命令，已终止");
} else {
    print("Dist is ", dist);
}

dyna.Solve();

dyna.FreeUDF();

print("仿真脚本运行结束成功");
