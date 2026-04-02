// 设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 加载自定义动态链接库
dyna.LoadUDF("CustomModel.dll");

// 运行用户自定义函数并获取返回值
var dist = dyna.RunUDFCmdAdv("CalDist", [0, 0, 0, 10, 10, 0]);

// 打印计算结果
print("Distance is ", dist);

// 设置允许在核心迭代中使用用户自定义函数
dyna.Set("If_Allow_UDF_Kernel", 1);

// 求解模型（此处假设求解步数为500，具体数值根据实际情况调整）
dyna.Solve(500);

// 释放动态链接库资源
dyna.FreeUDF();
