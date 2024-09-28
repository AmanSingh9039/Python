def trailing_zero(number):
    count=0
    i=5

    while (number//i!=0):
        count+=int(number/i)
        i=i*5
    return count

if __name__ == '__main__':
    number=int(input("Enter Number: "))
    print(trailing_zero(number))
