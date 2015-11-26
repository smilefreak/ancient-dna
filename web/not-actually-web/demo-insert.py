#Dependencies: psycopg, SQLAlchemy
connection_string = 'postgres://postgres:test123@localhost:5432/adna'

import json  
import sqlalchemy  
db = sqlalchemy.create_engine(connection_string)  
engine = db.connect()  
meta = sqlalchemy.MetaData(engine)

from sqlalchemy import Column, Integer, TIMESTAMP  
from sqlalchemy.dialects.postgresql import JSON, JSONB
from sqlalchemy.types import TIMESTAMP

jrTable = sqlalchemy.Table("job_results", meta,  
                Column('jobID', Integer, primary_key=True),
                #Column('completion_time', TIMESTAMP, server_default=func.now()),
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
        jobID=9001,
        files=resultFiles
    )

engine.execute(statement)