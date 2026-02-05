#!/usr/bin/env python3
"""
419个物理仿真脚本测试数据集划分工具
采用分层抽样策略，确保每个类别都有代表性样本
"""

import os
import json
import random
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple

# 设置随机种子以保证可重复性
random.seed(42)

class TestDatasetSplitter:
    """测试数据集划分器"""
    
    def __init__(self, source_dir: str):
        self.source_dir = Path(source_dir)
        self.files = []
        self.categories = defaultdict(list)
        
    def scan_files(self):
        """扫描所有JS文件"""
        print("正在扫描文件...")
        for file_path in self.source_dir.glob("*.js"):
            self.files.append(file_path.name)
        print(f"共找到 {len(self.files)} 个JS文件")
        
    def categorize_files(self):
        """根据文件名将文件分类"""
        print("\n正在分类文件...")
        
        # 定义分类规则
        category_rules = {
            "建模及网格案例": ["建模及网格案例"],
            "CDyna案例": ["CDyna案例"],
            "GFlow案例": ["GFlow案例"],
            "MudSim案例": ["MudSim案例"],
            "SuperCDEM案例": ["SuperCDEM案例"],
            "其他案例": []  # 兜底分类
        }
        
        for filename in self.files:
            categorized = False
            for category, keywords in category_rules.items():
                if category == "其他案例":
                    continue
                for keyword in keywords:
                    if keyword in filename:
                        self.categories[category].append(filename)
                        categorized = True
                        break
                if categorized:
                    break
            
            # 如果没有匹配任何类别，放入"其他案例"
            if not categorized:
                self.categories["其他案例"].append(filename)
        
        # 打印分类结果
        print("\n分类结果:")
        total = 0
        for category, files in sorted(self.categories.items()):
            print(f"  {category}: {len(files)} 个文件")
            total += len(files)
        print(f"  总计: {total} 个文件")
        
    def split_dataset(self, 
                     train_ratio: float = 0.8, 
                     val_ratio: float = 0.1, 
                     test_ratio: float = 0.1) -> Dict[str, List[str]]:
        """
        分层抽样划分数据集
        
        Args:
            train_ratio: 训练集（向量库）比例
            val_ratio: 验证集比例
            test_ratio: 测试集比例
            
        Returns:
            包含train, val, test三个键的字典，值为文件名列表
        """
        assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-6, \
            "比例之和必须等于1"
        
        print(f"\n开始划分数据集 (训练:{train_ratio*100}% | 验证:{val_ratio*100}% | 测试:{test_ratio*100}%)")
        
        train_files = []
        val_files = []
        test_files = []
        
        # 对每个类别进行分层抽样
        for category, files in sorted(self.categories.items()):
            # 打乱文件顺序
            shuffled_files = files.copy()
            random.shuffle(shuffled_files)
            
            n_total = len(files)
            n_train = max(1, int(n_total * train_ratio))
            n_val = max(0, int(n_total * val_ratio))
            n_test = n_total - n_train - n_val  # 确保所有文件都被分配
            
            # 如果类别文件太少，至少保证测试集有1个
            if n_test == 0 and n_total > 1:
                n_train -= 1
                n_test = 1
            
            # 划分
            train_files.extend(shuffled_files[:n_train])
            val_files.extend(shuffled_files[n_train:n_train + n_val])
            test_files.extend(shuffled_files[n_train + n_val:])
            
            print(f"  {category}: 训练={n_train} | 验证={n_val} | 测试={n_test}")
        
        print(f"\n最终划分:")
        print(f"  训练集（向量库）: {len(train_files)} 个文件 ({len(train_files)/len(self.files)*100:.1f}%)")
        print(f"  验证集: {len(val_files)} 个文件 ({len(val_files)/len(self.files)*100:.1f}%)")
        print(f"  测试集: {len(test_files)} 个文件 ({len(test_files)/len(self.files)*100:.1f}%)")
        
        return {
            "train": sorted(train_files),
            "val": sorted(val_files),
            "test": sorted(test_files)
        }
    
    def generate_category_stats(self, split_result: Dict[str, List[str]]) -> Dict:
        """生成每个数据集中的类别统计信息"""
        stats = {
            "train": defaultdict(int),
            "val": defaultdict(int),
            "test": defaultdict(int)
        }
        
        for split_name, files in split_result.items():
            for filename in files:
                for category, cat_files in self.categories.items():
                    if filename in cat_files:
                        stats[split_name][category] += 1
                        break
        
        return stats
    
    def save_results(self, split_result: Dict[str, List[str]], output_dir: str = "."):
        """保存划分结果到JSON文件"""
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
        
        # 保存划分结果
        result_file = output_dir / "dataset_split.json"
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(split_result, f, ensure_ascii=False, indent=2)
        print(f"\n✓ 划分结果已保存到: {result_file}")
        
        # 生成并保存统计信息
        stats = self.generate_category_stats(split_result)
        stats_file = output_dir / "category_statistics.json"
        with open(stats_file, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
        print(f"✓ 类别统计已保存到: {stats_file}")
        
        # 生成详细报告
        self.generate_report(split_result, stats, output_dir)
        
    def generate_report(self, split_result: Dict[str, List[str]], 
                       stats: Dict, output_dir: Path):
        """生成详细的划分报告"""
        report_file = output_dir / "dataset_split_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# 测试数据集划分报告\n\n")
            f.write(f"**生成时间**: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"**总文件数**: {len(self.files)}\n\n")
            
            # 总体统计
            f.write("## 一、总体划分统计\n\n")
            f.write("| 数据集 | 文件数 | 占比 |\n")
            f.write("|--------|--------|------|\n")
            for split_name in ["train", "val", "test"]:
                count = len(split_result[split_name])
                ratio = count / len(self.files) * 100
                name_map = {"train": "训练集（向量库）", "val": "验证集", "test": "测试集"}
                f.write(f"| {name_map[split_name]} | {count} | {ratio:.1f}% |\n")
            f.write("\n")
            
            # 类别分布
            f.write("## 二、各类别分布\n\n")
            f.write("| 类别 | 训练集 | 验证集 | 测试集 | 总计 |\n")
            f.write("|------|--------|--------|--------|------|\n")
            
            for category in sorted(self.categories.keys()):
                train_count = stats["train"].get(category, 0)
                val_count = stats["val"].get(category, 0)
                test_count = stats["test"].get(category, 0)
                total = len(self.categories[category])
                f.write(f"| {category} | {train_count} | {val_count} | {test_count} | {total} |\n")
            f.write("\n")
            
            # 详细文件列表
            f.write("## 三、详细文件列表\n\n")
            for split_name in ["test", "val", "train"]:
                name_map = {"train": "训练集（向量库）", "val": "验证集", "test": "测试集"}
                f.write(f"### {name_map[split_name]} ({len(split_result[split_name])} 个文件)\n\n")
                
                # 按类别组织
                by_category = defaultdict(list)
                for filename in split_result[split_name]:
                    for category, cat_files in self.categories.items():
                        if filename in cat_files:
                            by_category[category].append(filename)
                            break
                
                for category in sorted(by_category.keys()):
                    f.write(f"#### {category} ({len(by_category[category])} 个)\n\n")
                    for filename in sorted(by_category[category]):
                        f.write(f"- {filename}\n")
                    f.write("\n")
        
        print(f"✓ 详细报告已保存到: {report_file}")
    
    def generate_evaluation_template(self, test_files: List[str], output_dir: str = "."):
        """为测试集生成评估模板"""
        output_dir = Path(output_dir)
        template_file = output_dir / "evaluation_template.json"
        
        template = {
            "metadata": {
                "total_test_cases": len(test_files),
                "evaluation_date": None,
                "evaluator": None
            },
            "test_cases": []
        }
        
        for i, filename in enumerate(test_files, 1):
            # 从文件名提取类别和功能描述
            category = "未分类"
            for cat_name, cat_files in self.categories.items():
                if filename in cat_files:
                    category = cat_name
                    break
            
            test_case = {
                "test_id": f"T{i:03d}",
                "filename": filename,
                "category": category,
                "test_queries": [
                    f"基于{filename.split('.')[0]}的功能需求",
                    "【请根据实际功能补充查询语句】"
                ],
                "evaluation_metrics": {
                    "functionality_score": None,  # 功能正确性 (0-10)
                    "code_quality_score": None,   # 代码质量 (0-10)
                    "execution_score": None,      # 可执行性 (0-10)
                    "similarity_score": None      # 相似度 (0-1)
                },
                "notes": ""
            }
            template["test_cases"].append(test_case)
        
        with open(template_file, 'w', encoding='utf-8') as f:
            json.dump(template, f, ensure_ascii=False, indent=2)
        
        print(f"✓ 评估模板已保存到: {template_file}")


def main():
    """主函数"""
    print("=" * 60)
    print("物理仿真脚本测试数据集划分工具")
    print("=" * 60)
    
    # 配置参数
    SOURCE_DIR = "/Users/cxh/Codes/langchain/physic/docs/案例"  # 源文件目录，请根据实际情况修改
    OUTPUT_DIR = "/Users/cxh/Codes/langchain/physic/dataset_split_results"
    
    # 划分比例
    TRAIN_RATIO = 0.80  # 80% 作为向量库（训练集）
    VAL_RATIO = 0.00    # 10% 作为验证集
    TEST_RATIO = 0.20   # 10% 作为测试集
    
    # 创建划分器
    splitter = TestDatasetSplitter(SOURCE_DIR)
    
    # 扫描并分类文件
    splitter.scan_files()
    splitter.categorize_files()
    
    # 划分数据集
    split_result = splitter.split_dataset(
        train_ratio=TRAIN_RATIO,
        val_ratio=VAL_RATIO,
        test_ratio=TEST_RATIO
    )
    
    # 保存结果
    splitter.save_results(split_result, OUTPUT_DIR)
    
    # 生成评估模板
    splitter.generate_evaluation_template(split_result["test"], OUTPUT_DIR)
    
    print("\n" + "=" * 60)
    print("✅ 数据集划分完成！")
    print(f"📁 所有结果已保存到: {OUTPUT_DIR}")
    print("=" * 60)
    
    print("\n📋 生成的文件:")
    print("  1. dataset_split.json - 数据集划分结果（JSON格式）")
    print("  2. category_statistics.json - 类别统计信息")
    print("  3. dataset_split_report.md - 详细划分报告（Markdown格式）")
    print("  4. evaluation_template.json - 测试评估模板")
    
    print("\n💡 下一步:")
    print("  1. 查看 dataset_split_report.md 了解详细划分情况")
    print("  2. 使用 dataset_split.json 中的训练集构建向量库")
    print("  3. 使用 evaluation_template.json 进行测试集评估")


if __name__ == "__main__":
    main()