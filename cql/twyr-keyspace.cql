CREATE KEYSPACE IF NOT EXISTS twyr WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;
