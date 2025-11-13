import psycopg2
from psycopg2 import Error

# --------------------------------------------------------------------------
# 1. DATABASE CONFIGURATION 
# --------------------------------------------------------------------------
DB_HOST = "localhost" 
DB_NAME = "testdb"
DB_USER = "postgres"
DB_PASS = "Lawnchair1!" 
DB_PORT = "5432"      

def fetch_data_from_postgres():
    """
    Connects to the PostgreSQL database, executes a query, and prints the results.
    """
    connection = None
    cursor = None

    try:
        # Connect to the PostgreSQL database server
        print(f"Attempting connection to {DB_NAME}...")
        connection = psycopg2.connect(
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME
        )
        print("Successfully connected to PostgreSQL.")

        # Create a cursor object to execute queries
        cursor = connection.cursor()

        # ------------------------------------------------------------------
        # 2. SQL QUERY
        # ------------------------------------------------------------------
        sql_query = """
        SELECT * FROM messages;
        """

        # Execute the query
        print("Executing SQL query...")
        cursor.execute(sql_query)

        # Retrieve the results (fetchone, fetchmany, or fetchall)
        records = cursor.fetchall()
        
        # Get column names (optional, for better output formatting)
        column_names = [desc[0] for desc in cursor.description]
        print("\n--- Query Results ---")
        print(column_names)
        print("-" * 30)

        # Print the results
        if records:
            for row in records:
                print(row)
        else:
            print("No records found matching the query.")

    except (Exception, Error) as error:
        # Catch connection or query errors
        print(f"Error while connecting to PostgreSQL or executing query: {error}")

    finally:
        # Close the connection and cursor in the 'finally' block to ensure they close
        if connection:
            if cursor:
                cursor.close()
            connection.close()
            print("\nPostgreSQL connection is closed.")

if __name__ == "__main__":
    fetch_data_from_postgres()