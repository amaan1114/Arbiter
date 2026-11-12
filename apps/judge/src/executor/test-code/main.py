rows, cols = map(int, input().split())

matrix = []

for i in range(rows):
    row = list(map(int, input().split()))
    matrix.append(row)

for row in matrix:
    print(*row)