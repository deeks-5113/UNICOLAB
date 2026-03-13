import traceback
try:
    from app.main import app
    print("Success")
except Exception as e:
    with open("err.txt", "w", encoding="utf-8") as f:
        traceback.print_exc(file=f)
    print("Failed - wrote to err.txt")
