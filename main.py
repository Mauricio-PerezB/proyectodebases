from db import conectar
from alumno import menu_alumno
from profesor import menu_profesor
from curso import menu_curso
from apoderado import menu_apoderado

# Verifica que el archivo y función existan y estén bien escritos
try:
    from extraprogramatica import menu_extraprogramatico
except ImportError:
    def menu_extraprogramatico():
        print("Función de menú extraprogramático no implementada.")

from asignaciones import (
    asignar_ciclo_curso,
    asignar_apoderado,
    asignar_extraprogramatica,
    asignar_especialidad
)

def consulta_q1():
    print("\n📊 Consulta Q1 - Alumnos, curso, profesor jefe y apoderado vigente en 2025")
    conn = conectar()
    cur = conn.cursor()
    
    query = """
        SELECT a.nombres, c.codigo AS curso,
               p.nombres AS profesor_jefe_nombre, p.apellido_paterno AS profesor_jefe_apellido,
               ap.nombres AS apoderado_nombre
        FROM alumno a
        JOIN curso c ON a.codigo_curso = c.codigo
        JOIN es_jefe ej ON c.codigo = ej.codigo_curso
        JOIN profesor p ON ej.rut_profesor_jefe = p.rut
        JOIN representa r ON a.rut = r.rut_alumno
        JOIN apoderado ap ON r.rut_apoderado = ap.rut
        WHERE c.anio = 2025
    """

    try:
        cur.execute(query)
        rows = cur.fetchall()
        if rows:
            print("\nResultados:")
            for row in rows:
                print(f"Alumno: {row[0]}, Curso: {row[1]}, Profesor Jefe: {row[2]} {row[3]}, Apoderado vigente: {row[4]}")
        else:
            print("No se encontraron resultados.")
    except Exception as e:
        print(f"❌ Error al ejecutar la consulta: {e}")
    finally:
        cur.close()
        conn.close()

def consulta_q2():
    print("\n📊 Consulta Q2 - Profesores que realizan actividades extraprogramáticas en media y no tienen especialidad")
    conn = conectar()
    cur = conn.cursor()
    query = """
        SELECT DISTINCT p.nombres, p.apellido_paterno
        FROM profesor p
        JOIN realiza r ON p.rut = r.rut_profesor
        JOIN extraprogramatica e ON r.codigo_actividad = e.codigo
        JOIN media m ON e.codigo_curso = m.codigo_curso
        WHERE p.rut NOT IN (
            SELECT rut_profesor FROM especialidad
        )
    """
    try:
        cur.execute(query)
        rows = cur.fetchall()
        if rows:
            print("\nResultados:")
            for row in rows:
                print(f"Nombre: {row[0]}, Apellido: {row[1]}")
        else:
            print("No se encontraron resultados.")
    except Exception as e:
        print(f"❌ Error al ejecutar la consulta: {e}")
    finally:
        cur.close()
        conn.close()

def consulta_q3():
    print("\n📊 Consulta Q3 - Profesores jefes con mayor cantidad de alumnos a cargo")
    conn = conectar()
    cur = conn.cursor()
    crear_vista = """
        CREATE OR REPLACE VIEW Alumnoscurso AS
        SELECT c.codigo AS codigo_curso, COUNT(a.rut) AS total_alumnos
        FROM curso c
        LEFT JOIN alumno a ON c.codigo = a.codigo_curso
        GROUP BY c.codigo
    """
    query = """
        SELECT p.nombres, p.apellido_paterno, ac.total_alumnos
        FROM es_jefe ej
        JOIN profesor p ON ej.rut_profesor_jefe = p.rut
        JOIN Alumnoscurso ac ON ej.codigo_curso = ac.codigo_curso
        WHERE ac.total_alumnos = (
            SELECT MAX(total_alumnos) FROM Alumnoscurso
        )
    """
    try:
        cur.execute(crear_vista)
        cur.execute(query)
        rows = cur.fetchall()
        if rows:
            print("\nResultados:")
            for row in rows:
                print(f"Profesor jefe: {row[0]} {row[1]}, Alumnos a cargo: {row[2]}")
        else:
            print("No se encontraron resultados.")
    except Exception as e:
        print(f"❌ Error al ejecutar la consulta: {e}")
    finally:
        cur.close()
        conn.close()

def main():
    while True:
        print("\n🏫 MENÚ PRINCIPAL")
        print("1. Alumnos")
        print("2. Profesores")
        print("3. Cursos")
        print("4. Apoderados")
        print("5. Extra programáticas")
        print("6. Consulta Q1")
        print("7. Consulta Q2")
        print("8. Consulta Q3")
        print("9. Asignar ciclo y curso")
        print("10. Asignar apoderado")
        print("11. Asignar extraprogramática")
        print("12. Asignar especialidad")
        print("0. Salir")
        opcion = input("Elige una opción: ")
        if opcion == '1':
            menu_alumno()
        elif opcion == '2':
            menu_profesor()
        elif opcion == '3':
            menu_curso()
        elif opcion == '4':
            menu_apoderado()
        elif opcion == '5':
            menu_extraprogramatico()
        elif opcion == '6':
            consulta_q1()
        elif opcion == '7':
            consulta_q2()
        elif opcion == '8':
            consulta_q3()
        elif opcion == '9':
            asignar_ciclo_curso()
        elif opcion == '10':
            asignar_apoderado()
        elif opcion == '11':
            asignar_extraprogramatica()
        elif opcion == '12':
            asignar_especialidad()
        elif opcion == '0':
            print("¡Adiós!")
            break
        else:
            print("❌ Opción inválida.")

if __name__ == "__main__":
    main()