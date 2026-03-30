setCurDir(getSrcDir());

// 定义Weibull分布参数
var k = 2.0;      // 形状参数
var lambda = 2.0; // 比例因子

// 生成1000个满足Weibull分布的随机数
for (var i = 0; i < 1000; i++) {
    var randomValue = dyna.GenRandomValue("weibull", k, lambda);
    print(randomValue);
}

// 输出统计信息
print("=== Weibull分布随机数生成完成 ===");
print("参数: k=" + k + ", lambda=" + lambda);
print("生成数量: 1000");
