import pygame
import time

# Initialize Pygame mixer
pygame.mixer.init()

# Morse Code Dictionary
MORSE_CODE_DICT = {'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 
                   'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 
                   'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 
                   'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 
                   'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', 
                   '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
                   '9': '----.', '0': '-----', ', ': '--..--', '.': '.-.-.-', '?': '..--..', 
                   '/': '-..-.', '-': '-....-', '(': '-.--.', ')': '-.--.-'}

# Function to convert text to Morse code
def text_to_morse(text):
    morse_code = ''
    for letter in text.upper():
        if letter != ' ':
            morse_code_letter = MORSE_CODE_DICT.get(letter)
            if morse_code_letter is not None:
                morse_code += morse_code_letter + ' '
        else:
            morse_code += '/ '  # Changed space representation to "/"
    return morse_code.strip()

# Function to play Morse code sound
def play_morse_code(morse_code):
    dot_sound = pygame.mixer.Sound("dot.wav")  # Path to dot sound file
    dash_sound = pygame.mixer.Sound("dash.wav")  # Path to dash sound file
    for symbol in morse_code:
        if symbol == '.':
            dot_sound.play()
            pygame.time.wait(300)  # Duration of dot sound
        elif symbol == '-':
            dash_sound.play()
            pygame.time.wait(600)  # Duration of dash sound
        elif symbol == '/':  # Added condition to handle "/" as space
            time.sleep(.5)  # Space between words
        else:
            time.sleep(.5)  # Space between words

# Main function to input text and play its Morse code sound
def main():
    text = input("Enter text to convert to Morse Code: ")
    morse_code = text_to_morse(text)
    print("Morse Code:", morse_code)
    play_morse_code(morse_code)

if __name__ == "__main__":
    main()
