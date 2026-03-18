with open('test_error.log', 'rb') as f:
    content = f.read()
    try:
        print(content.decode('utf-16'))
    except:
        try:
            print(content.decode('utf-16-le'))
        except:
            print(content.decode('utf-8', errors='ignore'))
