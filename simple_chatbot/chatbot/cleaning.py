import re
import ftfy
from unidecode import unidecode
import string

# 基础清洗

def remove_control_chars(text):
    return re.sub(r"[\x00-\x1F\x7F-\x9F]", "", text)

def merge_repeated_punct(text):
    return re.sub(r"([!?.,])\1+", r"\1", text)

def remove_template_keywords(text):
    # 黑名单关键词，可以根据业务扩展
    blacklist = [
        "点击下载", "版权所有", "Copyright", "www.", "http://", "https://"
    ]
    for word in blacklist:
        text = text.replace(word, "")
    return text

def fix_encoding(text):
    try:
        return ftfy.fix_text(text)
    except:
        return text

def deduplicate_paragraphs(text):
    seen = set()
    new_lines = []
    for line in text.split("\n"):
        if line.strip() not in seen:
            seen.add(line.strip())
            new_lines.append(line)
    return "\n".join(new_lines)


# 语义清洗

def normalize_date(text):
    # 示例：把“2023年1月1日”统一为 2023-01-01
    text = re.sub(r"(\d{4})年(\d{1,2})月(\d{1,2})日", r"\1-\2-\3", text)

    # 把 PM/AM 标准化
    text = re.sub(r"(\d{1,2})\s*(AM|am|PM|pm)", r"\1:00", text)
    return text

def normalize_units(text):
    # 简单单位替换，可以扩展
    unit_map = {
        r"\bkg\b": "千克",
        r"\bcm\b": "厘米",
    }
    for k, v in unit_map.items():
        text = re.sub(k, v, text)
    return text

def expand_abbreviations(text):
    abbr_map = {
        "NLP": "自然语言处理",
        "GPU": "图形处理器",
        "PPT": "PPT",
    }
    for k, v in abbr_map.items():
        text = text.replace(k, v)
    return text

def remove_stopwords(text):
    stopwords = ["的", "是", "这个", "如下图所示"]
    for sw in stopwords:
        text = text.replace(sw, "")
    return text

def normalize_cases(text):
    return text.strip()


# 结构清洗（轻量化实现）

def merge_broken_sentences(text):
    # 删除页码断裂的情况，比如 “...page 1\npage 2...”
    return re.sub(r"page\s*\d+", "", text, flags=re.I)

def fix_heading_levels(text):
    # 示例：纠正 Markdown 标题层级
    # 实际规则复杂，这里做一个简单保证 "#" 不超过 3 级
    lines = text.split("\n")
    new_lines = []
    for line in lines:
        if line.startswith("#"):
            # 限制标题层级不超过3级
            level = min(len(line.split(" ")[0]), 3)
            new_lines.append("#" * level + " " + line.lstrip("# "))
        else:
            new_lines.append(line)
    return "\n".join(new_lines)

def fix_list_numbers(text):
    lines = text.split("\n")
    new_lines = []
    counter = 1
    for line in lines:
        if re.match(r"^\d+\.\s+", line):
            new_lines.append(f"{counter}. " + line.split(" ", 1)[1])
            counter += 1
        else:
            new_lines.append(line)
    return "\n".join(new_lines)

# 总清洗入口函数

def clean_text(raw):
    text = raw

    # 基础清洗
    text = remove_control_chars(text)
    text = merge_repeated_punct(text)
    text = remove_template_keywords(text)
    text = fix_encoding(text)
    text = deduplicate_paragraphs(text)

    # 语义清洗
    text = normalize_date(text)
    text = normalize_units(text)
    text = expand_abbreviations(text)
    text = remove_stopwords(text)
    text = normalize_cases(text)

    # 结构清洗
    text = merge_broken_sentences(text)
    text = fix_heading_levels(text)
    text = fix_list_numbers(text)

    return text
