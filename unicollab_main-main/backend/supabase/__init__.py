from typing import Any

class MockTable:
    def insert(self, *args, **kwargs): return self
    def select(self, *args, **kwargs): return self
    def update(self, *args, **kwargs): return self
    def delete(self, *args, **kwargs): return self
    def eq(self, *args, **kwargs): return self
    def order(self, *args, **kwargs): return self
    def limit(self, *args, **kwargs): return self
    def execute(self, *args, **kwargs):
        class Result:
            def __init__(self):
                self.data = []
                self.error = None
        return Result()

class Client:
    def __init__(self):
        self.auth = Any
        self.table = lambda name: MockTable()

def create_client(url: str, key: str) -> Client:
    return Client()
