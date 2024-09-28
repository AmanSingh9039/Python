import random

#make a list of words

words=['bmw','audi','masda','porsche']
word=random.choice(words)

print("Guess the characters")
turns=10
guesses=''

#iterate till turns greater than 0

while turns>0:

    failed=0 # a counter variable to check for wrong inputs

    for char in word:
        if char in guesses:
            print(char,end=" ")
        else:
            print("_",end=" ")
            failed+=1

    if failed==0:
        print("\nYOU WIN")
        print("The word is",word)
        break

#input the character to guess
    print()
    guess=input("Enter the character")
    guesses+=guess

    if guess not in word:
        print("WRONG")
        turns-=1
        print(f"You have only {turns} left")

        if turns==0:
            print("YOU LOSE")
            print(f"The word is {word}")


