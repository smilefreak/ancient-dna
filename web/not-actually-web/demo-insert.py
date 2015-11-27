#Dependencies: psycopg, SQLAlchemy
connection_string = 'postgres://postgres:test123@localhost:5432/adna'

import json  
import sqlalchemy  
db = sqlalchemy.create_engine(connection_string)  
engine = db.connect()  
meta = sqlalchemy.MetaData(engine)

from sqlalchemy import Column, Integer, Text  
from sqlalchemy.dialects.postgresql import JSONB

jrTable = sqlalchemy.Table("job_results", meta,  
                Column('job_id', Integer, primary_key=True),
                Column('base_path', Text),
                Column('files', JSONB))
meta.create_all()

import os

rootDir = "/root/ancient-dna/sampleResults/"
resultFiles = {}

#technically this replace *could* go wrong, but it is fairly trivial
for (dir, _, files) in os.walk(rootDir):
    dirMinRoot = dir.replace(rootDir, '')
    insertAt = resultFiles
    if dirMinRoot:
        dirSplit = dirMinRoot.split('/')
        for dSeg in xrange(len(dirSplit) - 1):
            insertAt = insertAt[dirSplit[dSeg]]
        insertAt[dirSplit[-1]] = {}
        insertAt = insertAt[dirSplit[-1]]
    for f in files:
        path = os.path.join(dir, f)
        if os.path.exists(path):
            insertAt[f] = os.path.getsize(path)

statement = jrTable.insert().values(
        job_id=9001,
        base_path=rootDir,
        files=resultFiles
    )

engine.execute(statement)