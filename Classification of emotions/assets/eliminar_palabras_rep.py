"""
Este archivo contiene funciones para eliminar palabras repetidas de un archivo txt
"""

# Abre el archivo en modo lectura
with open('assets/palabras_eliminar.txt', 'r', encoding='utf-8') as file:
    # Lee todas las líneas del archivo
    palabras = file.readlines()

# Elimina los saltos de línea y espacios en blanco
palabras = [palabra.strip() for palabra in palabras]

# Usa una lista y un conjunto auxiliar para eliminar duplicados mientras mantiene el orden
palabras_unicas = []
seen = set()

for palabra in palabras:
    if palabra not in seen:
        palabras_unicas.append(palabra)
        seen.add(palabra)

# Reescribe el archivo con las palabras únicas en orden original
with open('assets/palabras_eliminar.txt', 'w', encoding='utf-8') as file:
    for palabra in palabras_unicas:
        file.write(palabra + '\n')

print("Las palabras duplicadas han sido eliminadas, manteniendo el orden original.")
