import os

dirs = [
    "backend/src/main/java/com/houseprice/config",
    "backend/src/main/java/com/houseprice/common/enums",
    "backend/src/main/java/com/houseprice/common/response",
    "backend/src/main/java/com/houseprice/auth/controller",
    "backend/src/main/java/com/houseprice/auth/service",
    "backend/src/main/java/com/houseprice/auth/repository",
    "backend/src/main/java/com/houseprice/auth/dto",
    "backend/src/main/java/com/houseprice/model",
    "backend/src/main/java/com/houseprice/user/controller",
    "backend/src/main/java/com/houseprice/user/service",
    "backend/src/main/java/com/houseprice/user/repository",
    "backend/src/main/java/com/houseprice/user/dto",
    "backend/src/main/java/com/houseprice/admin/controller",
    "backend/src/main/java/com/houseprice/admin/service",
    "backend/src/main/java/com/houseprice/chatbot/controller",
    "backend/src/main/java/com/houseprice/chatbot/service",
    "backend/src/main/java/com/houseprice/ml/client",
    "backend/src/main/java/com/houseprice/ml/dto",
    "backend/src/main/java/com/houseprice/exception",
    "backend/src/main/resources"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"Created {d}")
