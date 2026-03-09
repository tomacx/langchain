
try:
    from langchain.agents import create_agent
    print(f"create_agent found: {create_agent}")
except ImportError as e:
    print(f"ImportError: {e}")

try:
    from langchain.agents import create_tool_calling_agent
    print(f"create_tool_calling_agent found: {create_tool_calling_agent}")
except ImportError as e:
    print(f"create_tool_calling_agent ImportError: {e}")
