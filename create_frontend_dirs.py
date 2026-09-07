import os

dirs = [
    "frontend/src/components",
    "frontend/src/pages/Public",
    "frontend/src/pages/User",
    "frontend/src/pages/Admin",
    "frontend/src/hooks",
    "frontend/src/context",
    "frontend/src/services",
    "frontend/src/utils",
    "frontend/public"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"Created {d}")
